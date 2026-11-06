// Shadowing: ouvir uma frase e repeti-la imitando ritmo e melodia.
import { addXP, bump } from '../store.js';
import { SENTENCES } from '../data/phrases.js';
import { speak } from '../speech.js';
import { mountPractice } from '../practice.js';
import { html, mount, actions, icon, pageHead, shuffle, $ } from '../ui.js';

export default function render(root) {
  let level = 'A1', blind = false, i = 0, revealed = false, practice = null;
  let list = shuffle(SENTENCES[level]);

  const draw = () => {
    const s = list[i];
    revealed = !blind;
    mount(root, html`
      ${pageHead('Shadowing', { back: '#/speak', sub: 'Ouça, imite o ritmo e a melodia, receba sua nota' })}
      <div class="row wrap between" style="margin-bottom:14px">
        <div class="seg">${Object.keys(SENTENCES).map((l) => html`<button class="${l === level ? 'on' : ''}" data-act="level" data-l="${l}">${l}</button>`)}</div>
        <label class="row small" style="gap:8px">Modo cego (sem texto) <span class="switch"><input type="checkbox" id="blind" ${blind ? 'checked' : ''}><span></span></span></label>
      </div>
      <section class="card pad-lg stack">
        <div class="row between"><span class="eyebrow">Frase ${i + 1} de ${list.length}</span>
          <div class="row" style="gap:6px"><button class="btn btn-ghost btn-sm" data-say="${s.fr}" data-rate=".7">${icon('gauge')} Devagar</button></div></div>
        <div class="center" id="text">${revealed ? html`<div class="fr" style="font-size:1.6rem;font-weight:600;line-height:1.3">${s.fr}</div><div class="small muted" style="margin-top:6px">${s.pt}</div>`
          : html`<button class="btn btn-soft" data-act="show">${icon('eye')} Mostrar texto</button>`}</div>
        <div id="practice"></div>
      </section>
      <div class="row between" style="margin-top:14px">
        <button class="btn btn-ghost" data-act="prev" ${i === 0 ? 'disabled' : ''}>${icon('back')} Anterior</button>
        <button class="btn btn-primary" data-act="next">Próxima ${icon('arrow')}</button>
      </div>
      <p class="tiny faint center" style="margin-top:16px">Dica: ouça 2–3 vezes, depois fale junto com o áudio mentalmente antes de gravar. Imite a entonação, não só as palavras.</p>`);
    practice?.stop();
    practice = mountPractice($('#practice', root), s.fr, {
      onResult: (r) => {
        bump('shadowing');
        if (r.score >= .6) addXP(r.score >= .85 ? 3 : 2, 'speaking');
        if (!revealed) { revealed = true; showText(); }
      },
    });
    setTimeout(() => speak(s.fr), 300);
  };
  const showText = () => {
    const s = list[i];
    $('#text', root).innerHTML = String(html`<div class="fr" style="font-size:1.6rem;font-weight:600;line-height:1.3">${s.fr}</div><div class="small muted" style="margin-top:6px">${s.pt}</div>`);
  };

  root.addEventListener('change', (e) => { if (e.target.id === 'blind') { blind = e.target.checked; draw(); } });
  actions(root, {
    level: (el) => { level = el.dataset.l; list = shuffle(SENTENCES[level]); i = 0; draw(); },
    show: () => { revealed = true; showText(); },
    prev: () => { if (i > 0) { i--; draw(); } },
    next: () => { i = (i + 1) % list.length; draw(); },
  });
  draw();
  return () => practice?.stop();
}
