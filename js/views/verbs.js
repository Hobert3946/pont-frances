// Conjugação: explorar tabelas com áudio e treinar com perguntas rápidas.
import { settings, addXP, bump } from '../store.js';
import { VERBS, VERB, TENSES, PERSONS, conjugate, full, accepted, spoken } from '../data/verbs.js';
import { checkAnswer, speak } from '../speech.js';
import { html, mount, actions, icon, pageHead, accentBar, diffView, pick, sfx, haptic, $ } from '../ui.js';

const GROUPS = [
  ['Irregulares essenciais', (v) => v.kind === 'irr'],
  ['Regulares em -er', (v) => v.kind === 'er'],
  ['Regulares em -ir (finir)', (v) => v.kind === 'ir'],
  ['Regulares em -re (attendre)', (v) => v.kind === 're'],
];

function list(root) {
  let q = '';
  const draw = () => {
    const match = (v) => !q || v.inf.includes(q) || v.pt.toLowerCase().includes(q);
    $('#vl', root).innerHTML = String(html`${GROUPS.map(([title, fn]) => {
      const vs = VERBS.filter((v) => fn(v) && match(v));
      return vs.length ? html`<div class="section-title"><h2>${title}</h2><span class="small faint">${vs.length}</span></div>
        <div class="grid grid-auto">${vs.map((v) => html`<a class="sound" href="#/verb/${encodeURIComponent(v.inf)}"><span class="sym" style="font-size:1.35rem">${v.inf}</span><span class="small muted">${v.pt}</span></a>`)}</div>` : '';
    })}`);
  };
  mount(root, html`
    <section class="stack-sm">
      <div class="eyebrow">${VERBS.length} verbos · 7 tempos</div>
      <h1 class="h1">Conjugação</h1>
      <p class="muted">Toque em qualquer forma para ouvir. O português ajuda muito aqui: os tempos franceses correspondem quase um a um aos nossos.</p>
    </section>
    <a class="card card-grad link row" href="#/verbs/drill" style="margin-top:16px;gap:16px">
      <span class="blob" style="display:grid;place-items:center;width:52px;height:52px;border-radius:16px;background:rgba(255,255,255,.18)">${icon('target')}</span>
      <span class="grow"><b style="font-size:1.1rem">Treinar conjugação</b><br><span class="small muted">Perguntas rápidas, com sequência de acertos</span></span>${icon('arrow')}
    </a>
    <input id="vq" class="field" type="search" placeholder="Buscar verbo (francês ou português)…" style="margin-top:16px">
    <div id="vl"></div>`);
  draw();
  $('#vq', root).addEventListener('input', (e) => { q = e.target.value.trim().toLowerCase(); draw(); });
}

function verb(root, inf) {
  const v = VERB[inf];
  if (!v) { location.hash = '#/verbs'; return; }
  mount(root, html`
    ${pageHead(html`<span class="fr">${v.inf}</span>`, { back: '#/verbs', sub: `${v.pt} · ${v.en}`, right: html`<button class="say" data-say="${v.inf}">${icon('volume')}</button>` })}
    <div class="row wrap small" style="margin-bottom:14px;gap:8px">
      <span class="tag">${v.kind === 'irr' ? 'irregular' : `regular -${v.kind}`}</span>
      <span class="tag ${v.aux === 'être' ? 'f' : 'fr'}">passé composé com ${v.aux}</span>
      <span class="tag">particípio: ${v.pp}</span>
    </div>
    <div class="conj">${TENSES.map((t) => html`<section class="card">
      <h3>${t.label} <span style="text-transform:none;letter-spacing:0;font-weight:500">· ${t.pt}</span></h3>
      ${PERSONS.map((_, i) => { const f = full(v, t.id, i); return f ? html`<div class="conj-row" data-say="${spoken(f)}">
        <span class="f">${t.id === 'imperatif' ? f + ' !' : f}</span></div>` : ''; })}
    </section>`)}</div>
    <div class="center" style="margin-top:16px"><a class="btn btn-soft" href="#/verbs/drill/${encodeURIComponent(v.inf)}">${icon('target')} Treinar este verbo</a></div>`);
}

function drill(root, only) {
  const st = { tenses: new Set(['present', 'pc', 'imparfait']), set: only ? 'one' : 'irr', streak: 0, best: 0, right: 0, n: 0 };
  let q = null, answered = false;

  const pool = () => (st.set === 'one' ? [VERB[only]] : st.set === 'irr' ? VERBS.filter((v) => v.kind === 'irr') : VERBS);
  function newQ() {
    for (let tries = 0; tries < 50; tries++) {
      const v = pick(pool()), t = pick([...st.tenses]), i = (Math.random() * 6) | 0;
      if (conjugate(v, t)[i]) { q = { v, t, i }; break; }
    }
    answered = false;
    draw();
  }
  const pronounHint = (t, i) => (t === 'imperatif' ? ['', 'tu', '', 'nous', 'vous', ''][i] + ' (imperativo)' : PERSONS[i]);

  function draw() {
    const tl = TENSES.find((t) => t.id === q.t);
    mount(root, html`
      ${pageHead('Treinar conjugação', { back: only ? `#/verb/${encodeURIComponent(only)}` : '#/verbs' })}
      <div class="chips" style="margin-bottom:10px">${TENSES.map((t) => html`<button class="chip ${st.tenses.has(t.id) ? 'on' : ''}" data-act="tense" data-t="${t.id}">${t.label}</button>`)}</div>
      ${only ? '' : html`<div class="seg" style="margin-bottom:14px">
        <button class="${st.set === 'irr' ? 'on' : ''}" data-act="set" data-s="irr">Irregulares</button>
        <button class="${st.set === 'all' ? 'on' : ''}" data-act="set" data-s="all">Todos</button></div>`}
      <section class="card pad-lg stack center">
        <div class="row between"><span class="tag fr">${tl.label}</span><span class="small bold">🔥 ${st.streak} · recorde ${st.best}</span></div>
        <div class="fr" style="font-size:2rem;font-weight:600">${q.v.inf}</div>
        <div class="small muted">${q.v.pt} · <b>${pronounHint(q.t, q.i)}</b> · <span class="faint">${tl.pt}</span></div>
        <input id="cj" class="field fr center" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${q.t === 'imperatif' ? 'forma do imperativo' : 'com o pronome: je…, tu…'}">
        ${accentBar()}
        <div id="cfb"></div>
        <button class="btn btn-primary btn-lg btn-block" data-act="check">${icon('check')} Verificar</button>
      </section>
      <p class="tiny faint center" style="margin-top:12px">${st.right}/${st.n} certas nesta sessão · Enter para verificar e avançar</p>`);
    setTimeout(() => $('#cj', root)?.focus(), 50);
  }

  function check() {
    if (answered) return newQ();
    const val = $('#cj', root).value.trim();
    if (!val) return;
    const exp = accepted(q.v, q.t, q.i);
    const withPron = checkAnswer(exp, val, { strictAccents: settings().accentStrict });
    // aceita também sem o pronome
    const bare = checkAnswer(exp.split(' | ').map((s) => s.replace(/^(que |qu')?(je |j'|tu |il |nous |vous |ils )/, '')).join(' | '), val, { strictAccents: settings().accentStrict });
    const r = bare.perfect && !withPron.perfect ? bare : withPron;
    const ok = r.perfect;
    answered = true;
    st.n++;
    if (ok) { st.right++; st.streak++; st.best = Math.max(st.best, st.streak); addXP(st.streak % 5 === 0 ? 3 : 1, 'conjugation'); sfx.ok(); haptic(10); }
    else { st.streak = 0; sfx.bad(); haptic([30, 40, 30]); }
    bump('conjugations');
    const right = full(q.v, q.t, q.i);
    speak(spoken(right));
    $('#cfb', root).innerHTML = String(html`<div class="feedback ${ok ? 'ok' : 'bad'}"><b class="t">${ok ? 'Certo!' : r.accentOnly ? 'Quase — acentos' : 'Ops'}</b>
      ${ok ? '' : diffView(r.words)}<div class="fr" style="font-size:1.15rem">${right}</div></div>`);
    const b = root.querySelector('[data-act="check"]');
    b.innerHTML = String(html`Próxima ${icon('arrow')}`);
  }

  actions(root, {
    tense: (el) => {
      const t = el.dataset.t;
      if (st.tenses.has(t) && st.tenses.size > 1) st.tenses.delete(t); else st.tenses.add(t);
      newQ();
    },
    set: (el) => { st.set = el.dataset.s; newQ(); },
    check,
  });
  root.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.id === 'cj') { e.preventDefault(); check(); } });
  newQ();
}

export default function render(root, params, name) {
  if (name === 'verb' && params[0]) return verb(root, params[0]);
  if (name === 'verbs' && params[0] === 'drill') return drill(root, params[1]);
  return list(root);
}
