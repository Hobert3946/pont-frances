// Lógica de estudo: quais cartões revisar hoje, quais palavras novas apresentar, estatísticas.
import { DECKS, WORDS, WORD } from './data/decks.js';
import { getState, settings, save, today } from './store.js';
import { createCard, schedule, isDue, status, State } from './fsrs.js';

export { DECKS, WORDS, WORD };

export function activeDecks() {
  const s = getState();
  if (!s.decks.length) s.decks = [DECKS[0].id];
  return s.decks.map((id) => DECKS.find((d) => d.id === id)).filter(Boolean);
}

export function setDeck(id, on) {
  const s = getState();
  const i = s.decks.indexOf(id);
  if (on && i < 0) s.decks.push(id);
  if (!on && i >= 0) s.decks.splice(i, 1);
  save();
}

/** Cartões vencidos, do mais atrasado ao mais recente. */
export function dueIds(now = Date.now()) {
  const cards = getState().cards;
  return Object.keys(cards).filter((id) => WORD[id] && isDue(cards[id], now)).sort((a, b) => cards[a].due - cards[b].due);
}
export const dueCount = () => dueIds().length;

export const newLeftToday = () => Math.max(0, settings().newPerDay - (today().news || 0));

/** Próximas palavras novas. Se os baralhos ativos acabarem, ativa o próximo do currículo. */
export function newIds(limit = newLeftToday()) {
  const s = getState();
  const out = [];
  const take = (deck) => {
    for (const w of deck.words) {
      if (out.length >= limit) return;
      if (!s.cards[w.id]) out.push(w.id);
    }
  };
  for (const d of activeDecks()) take(d);
  for (const d of DECKS) {
    if (out.length >= limit) break;
    if (s.decks.includes(d.id)) continue;
    const before = out.length;
    take(d);
    if (out.length > before) s.decks.push(d.id);
  }
  return out;
}

export function grade(id, rating, now = Date.now()) {
  const s = getState();
  const prev = s.cards[id] || createCard(now);
  const next = schedule(prev, rating, now, settings().retention);
  s.cards[id] = next;
  const d = today();
  d.reviews = (d.reviews || 0) + 1;
  if (prev.state === State.New) d.news = (d.news || 0) + 1;
  save();
  return next;
}

export function counts() {
  const c = { new: 0, learning: 0, young: 0, mature: 0 };
  const cards = getState().cards;
  for (const w of WORDS) c[status(cards[w.id])]++;
  return c;
}

export function deckStats(deck) {
  const cards = getState().cards;
  const c = { total: deck.words.length, seen: 0, mature: 0 };
  for (const w of deck.words) {
    const st = status(cards[w.id]);
    if (st !== 'new') c.seen++;
    if (st === 'mature') c.mature++;
  }
  return c;
}

/** Quantos cartões vencem em cada um dos próximos dias. */
export function forecast(days = 7) {
  const out = Array(days).fill(0);
  const start = new Date(); start.setHours(0, 0, 0, 0);
  for (const c of Object.values(getState().cards)) {
    if (c.state === State.New) continue;
    const i = Math.max(0, Math.floor((c.due - start) / 864e5));
    if (i < days) out[i]++;
  }
  return out;
}

export const wordStatus = (id) => status(getState().cards[id]);
