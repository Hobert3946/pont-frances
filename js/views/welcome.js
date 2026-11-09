// Boas-vindas: nome, nível e ritmo — Edição Editorial L'Atelier.
import { getState, save } from '../store.js';
import { speak } from '../speech.js';
import { html, mount, actions, icon, $, confetti, sfx } from '../ui.js';

const LEVELS = [
  ['zero', '01 · INITIATION', 'Do zero', 'Nunca estudei francês formalmente'],
  ['basic', '02 · ÉLÉMENTAIRE', 'Básico', 'Sei me apresentar e reconheço frases essenciais'],
  ['inter', '03 · AVANCÉ', 'Intermediário', 'Leio bem, mas busco fluência acústica e conversação'],
];
const PACES = [
  [8, 'I · CADENCE LÉGÈRE', 'Leve', '~10 min/dia'],
  [12, 'II · CADENCE SOUTENUE', 'Firme', '~15 min/dia'],
  [20, 'III · IMMERSION TOTALE', 'Intenso', '~25 min/dia'],
];

export default function render(root) {
  const st = getState();
  let level = st.profile.level || 'zero';
  let pace = st.settings.newPerDay || 12;

  const draw = () => mount(root, html`
    <header class="editorial-mast">
      <div class="mast-meta">
        <span class="mast-issue">PONT · L'ATELIER DU FRANÇAIS</span>
        <span class="mast-sep">/</span>
        <span class="mast-date">PROTOCOLE D'ADMISSION</span>
      </div>
      <h1 class="mast-headline">Seu francês, esculpido sobre o que você <span class="grad-text">já domina</span>.</h1>
      <p class="mast-sub">Português e inglês formam duas pontes diretas para o francês. O Pont conecta ambas — com retenção neural FSRS e laboratório acústico em tempo real.</p>
      <div class="row wrap" style="margin-top:8px">
        <button class="btn btn-soft" data-act="hear">${icon('volume')} Ouvir saudação: « Bienvenue à l'Atelier ! »</button>
      </div>
    </header>

    <div class="bento-grid-2">
      <section class="card stack">
        <div class="bento-top-bar">
          <span class="bento-index">01 · IDENTITÉ</span>
          <span class="tag fr">PERFIL</span>
        </div>
        <label class="lbl" for="nm">Como devemos nos dirigir a você?</label>
        <input id="nm" class="field" maxlength="30" placeholder="Seu nome ou apelido" value="${st.profile.name}">
        <p class="tiny faint" style="margin:4px 0 0">Seus dados permanecem 100% gravados localmente no seu dispositivo.</p>
      </section>

      <section class="card stack">
        <div class="bento-top-bar">
          <span class="bento-index">02 · CALIBRAGE ACOUSTIQUE & LEXICAL</span>
          <span class="tag">FSRS v4</span>
        </div>
        <div class="lbl">Cadência diária de novos vocábulos</div>
        <div class="grid grid-3">${PACES.map(([n, code, t, d]) => html`
          <button class="opt ${pace === n ? 'right' : ''}" data-act="pace" data-v="${n}" style="flex-direction:column;align-items:flex-start;gap:4px">
            <span class="bento-index" style="font-size:0.6rem">${code}</span>
            <b>${t}</b>
            <span class="tiny muted">${n} palavras · ${d}</span>
          </button>`)}</div>
      </section>
    </div>

    <section class="card stack">
      <div class="bento-top-bar">
        <span class="bento-index">03 · NIVEAU INITIAL</span>
        <span class="tag">DIAGNÓSTICO</span>
      </div>
      <div class="bento-grid-3">${LEVELS.map(([id, code, t, d]) => html`
        <button class="opt ${level === id ? 'right' : ''}" data-act="level" data-v="${id}" style="flex-direction:column;align-items:flex-start;gap:6px;padding:18px">
          <div class="row between" style="width:100%">
            <span class="bento-index">${code}</span>
            <span class="k">${level === id ? icon('check') : ''}</span>
          </div>
          <b style="font-size:1.1rem;color:#fff">${t}</b>
          <span class="small muted">${d}</span>
        </button>`)}</div>
    </section>

    <button class="btn btn-primary btn-lg btn-block" data-act="go">Entrar no Atelier — On y va ! ${icon('arrow')}</button>
  `);

  draw();
  actions(root, {
    hear: () => speak("Bienvenue à l'Atelier ! On commence ?"),
    level: (el) => { st.profile.name = $('#nm', root).value.trim(); level = el.dataset.v; draw(); },
    pace: (el) => { st.profile.name = $('#nm', root).value.trim(); pace = +el.dataset.v; draw(); },
    go: () => {
      st.profile.name = $('#nm', root).value.trim();
      st.profile.level = level;
      st.profile.onboarded = true;
      st.settings.newPerDay = pace;
      st.decks = level === 'zero' ? ['essentiels'] : level === 'basic' ? ['essentiels', 'verbes', 'liens'] : ['verbes', 'liens', 'sentiments', 'familier'];
      save();
      navigator.storage?.persist?.().catch(() => { });
      sfx.done();
      confetti();
      location.hash = '#/';
    },
  });
}
