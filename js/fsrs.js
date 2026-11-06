// FSRS-5 (Free Spaced Repetition Scheduler) — o algoritmo de agendamento usado pelo Anki moderno.
// Modela a memória com Dificuldade (D), Estabilidade (S, em dias) e Recuperabilidade (R).
// Pesos padrão do FSRS-5, treinados em centenas de milhões de revisões.
const W = [
  0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192,
  1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621,
];
const DECAY = -0.5;
const FACTOR = 19 / 81; // garante R = 90% quando t = S
const MIN = 60e3;
const DAY = 864e5;

export const State = { New: 0, Learning: 1, Review: 2, Relearning: 3 };
export const Rating = { Again: 1, Hard: 2, Good: 3, Easy: 4 };

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

export const createCard = (now = Date.now()) => ({ due: now, s: 0, d: 0, reps: 0, lapses: 0, state: State.New, last: 0 });

const initS = (g) => Math.max(W[g - 1], 0.1);
const initD = (g) => clamp(W[4] - Math.exp(W[5] * (g - 1)) + 1, 1, 10);

function nextD(d, g) {
  const delta = -W[6] * (g - 3);
  const damped = d + delta * (10 - d) / 9;          // amortecimento linear
  return clamp(W[7] * initD(4) + (1 - W[7]) * damped, 1, 10); // reversão à média
}

/** Probabilidade de lembrar após `t` dias com estabilidade `s`. */
export const retrievability = (t, s) => (s > 0 ? Math.pow(1 + FACTOR * t / s, DECAY) : 0);

const recallS = (d, s, r, g) =>
  s * (1 + Math.exp(W[8]) * (11 - d) * Math.pow(s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1)
    * (g === Rating.Hard ? W[15] : 1) * (g === Rating.Easy ? W[16] : 1));

const forgetS = (d, s, r) =>
  Math.min(s, W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r)));

const shortS = (s, g) => s * Math.exp(W[17] * (g - 3 + W[18]));

export function intervalDays(s, retention = 0.9) {
  const ivl = (s / FACTOR) * (Math.pow(retention, 1 / DECAY) - 1);
  return clamp(Math.round(ivl), 1, 36500);
}

/** Aplica uma nota (1–4) e devolve um novo cartão (não altera o original). */
export function schedule(card, g, now = Date.now(), retention = 0.9) {
  const c = { ...card, reps: card.reps + 1 };
  const elapsed = card.last ? Math.max(0, (now - card.last) / DAY) : 0;

  if (card.state === State.New) {
    c.d = initD(g);
    c.s = initS(g);
    if (g === Rating.Easy) { c.state = State.Review; c.due = now + intervalDays(c.s, retention) * DAY; }
    else { c.state = State.Learning; c.due = now + [1, 5, 10][g - 1] * MIN; }
  } else if (card.state === State.Learning || card.state === State.Relearning) {
    c.d = nextD(card.d, g);
    c.s = shortS(card.s, g);
    if (g === Rating.Again) c.due = now + 5 * MIN;
    else if (g === Rating.Hard) c.due = now + 10 * MIN;
    else {
      let ivl = intervalDays(c.s, retention);
      if (g === Rating.Easy) ivl = Math.max(ivl, intervalDays(shortS(card.s, Rating.Good), retention) + 1);
      c.state = State.Review;
      c.due = now + ivl * DAY;
    }
  } else {
    const r = retrievability(elapsed, card.s);
    c.d = nextD(card.d, g);
    if (g === Rating.Again) {
      c.s = forgetS(card.d, card.s, r);
      c.lapses = card.lapses + 1;
      c.state = State.Relearning;
      c.due = now + 5 * MIN;
    } else {
      const sh = recallS(card.d, card.s, r, 2);
      const sg = recallS(card.d, card.s, r, 3);
      const se = recallS(card.d, card.s, r, 4);
      let ih = intervalDays(sh, retention), ig = intervalDays(sg, retention), ie = intervalDays(se, retention);
      ih = Math.min(ih, ig);
      ig = Math.max(ig, ih + 1);
      ie = Math.max(ie, ig + 1);
      c.s = [0, 0, sh, sg, se][g];
      c.due = now + [0, 0, ih, ig, ie][g] * DAY;
    }
  }
  c.last = now;
  return c;
}

/** Quanto tempo até a próxima revisão para cada nota — mostrado nos botões. */
export function preview(card, now = Date.now(), retention = 0.9) {
  const out = {};
  for (const g of [1, 2, 3, 4]) out[g] = schedule(card, g, now, retention).due - now;
  return out;
}

export function formatDelay(ms) {
  const m = ms / MIN;
  if (m < 60) return `${Math.max(1, Math.round(m))} min`;
  const h = m / 60;
  if (h < 24) return `${Math.round(h)} h`;
  const d = h / 24;
  if (d < 30) return `${Math.round(d)} d`;
  if (d < 365) return `${(d / 30).toFixed(d < 60 ? 1 : 0).replace('.', ',')} m`;
  return `${(d / 365).toFixed(1).replace('.', ',')} a`;
}

export const isDue = (c, now = Date.now()) => c && c.state !== State.New && c.due <= now;

/** Status para a interface: novo, aprendendo, jovem ou maduro (S ≥ 21 dias). */
export function status(c) {
  if (!c || c.state === State.New) return 'new';
  if (c.state !== State.Review) return 'learning';
  return c.s >= 21 ? 'mature' : 'young';
}
