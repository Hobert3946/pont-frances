// Boas-vindas: nome, nível e ritmo. Aparece só na primeira vez.
import { getState, save } from '../store.js';
import { speak } from '../speech.js';
import { html, mount, actions, icon, $, confetti, sfx } from '../ui.js';

const LEVELS = [
  ['zero', 'Do zero', 'Nunca estudei francês'],
  ['basic', 'Básico', 'Sei me apresentar e algumas frases'],
  ['inter', 'Intermediário', 'Leio bem, travo para falar e ouvir'],
];
const PACES = [
  [8, 'Leve', '~10 min/dia'],
  [12, 'Firme', '~15 min/dia'],
  [20, 'Intenso', '~25 min/dia'],
];

export default function render(root) {
  const st = getState();
  let level = st.profile.level || 'zero';
  let pace = st.settings.newPerDay || 12;

  const draw = () => mount(root, html`
    <section class="card hero glow pad-lg center stack">
      <div class="eyebrow">Bienvenue</div>
      <h1 class="h1">Seu francês, construído sobre o que você <span class="grad-text">já sabe</span>.</h1>
      <p class="muted">Português e inglês são duas pontes para o francês. O Pont usa as duas — e treina ouvido e pronúncia com a sua voz.</p>
      <div class="row wrap" style="justify-content:center">
        <button class="btn btn-soft" data-act="hear">${icon('volume')} Ouvir: « Bienvenue ! »</button>
      </div>
    </section>

    <section class="card stack">
      <label class="lbl" for="nm">Como posso te chamar?</label>
      <input id="nm" class="field" maxlength="30" placeholder="Seu nome" value="${st.profile.name}">
    </section>

    <section class="card stack">
      <div class="h3">Seu nível hoje</div>
      <div class="opts">${LEVELS.map(([id, t, d]) => html`
        <button class="opt ${level === id ? 'right' : ''}" data-act="level" data-v="${id}">
          <span class="k">${level === id ? icon('check') : ''}</span><span class="grow"><b>${t}</b><br><span class="small muted">${d}</span></span>
        </button>`)}</div>
    </section>

    <section class="card stack">
      <div class="h3">Ritmo de palavras novas</div>
      <div class="grid grid-3">${PACES.map(([n, t, d]) => html`
        <button class="opt ${pace === n ? 'right' : ''}" data-act="pace" data-v="${n}" style="flex-direction:column;align-items:flex-start">
          <b>${t}</b><span class="small muted">${n} palavras · ${d}</span>
        </button>`)}</div>
      <p class="tiny faint">Dá para mudar depois em Ajustes. Revisões não têm limite: o algoritmo FSRS decide o melhor momento de rever cada palavra.</p>
    </section>

    <button class="btn btn-primary btn-lg btn-block" data-act="go">Começar — on y va ! ${icon('arrow')}</button>
  `);

  draw();
  actions(root, {
    hear: () => speak('Bienvenue ! On commence ?'),
    level: (el) => { st.profile.name = $('#nm', root).value.trim(); level = el.dataset.v; draw(); },
    pace: (el) => { st.profile.name = $('#nm', root).value.trim(); pace = +el.dataset.v; draw(); },
    go: () => {
      st.profile.name = $('#nm', root).value.trim();
      st.profile.level = level;
      st.profile.onboarded = true;
      st.settings.newPerDay = pace;
      // quem já tem base começa com mais baralhos ativos
      st.decks = level === 'zero' ? ['essentiels'] : level === 'basic' ? ['essentiels', 'verbes', 'liens'] : ['verbes', 'liens', 'sentiments', 'familier'];
      save();
      navigator.storage?.persist?.().catch(() => {});
      sfx.done();
      confetti();
      location.hash = '#/';
    },
  });
}
