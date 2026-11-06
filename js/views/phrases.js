// Frases prontas por situação, com áudio e prática de fala.
import { SCENES } from '../data/phrases.js';
import { speak } from '../speech.js';
import { mountPractice } from '../practice.js';
import { addXP } from '../store.js';
import { html, mount, actions, icon, pageHead, sheet } from '../ui.js';

export default function render(root, params) {
  let scene = SCENES.find((s) => s.id === params[0]) || SCENES[0];
  let playing = false;

  const draw = () => mount(root, html`
    ${pageHead('Frases prontas', { back: '#/explore', sub: 'O essencial para cada situação' })}
    <div class="chips" style="margin-bottom:14px">${SCENES.map((s) => html`<button class="chip ${s === scene ? 'on' : ''}" data-act="scene" data-id="${s.id}">${s.icon} ${s.title}</button>`)}</div>
    <div class="row between" style="margin-bottom:10px">
      <h2 class="h2">${scene.icon} ${scene.title}</h2>
      <button class="btn btn-ghost btn-sm" data-act="playAll">${icon('play')} Ouvir todas</button>
    </div>
    <section class="card">${scene.phrases.map((p, i) => html`<div class="word-row">
      <button class="say sm" data-say="${p.fr}" aria-label="Ouvir">${icon('volume')}</button>
      <div class="grow"><div class="fr">${p.fr}</div><div class="pt">${p.pt}</div></div>
      <button class="btn btn-ghost btn-sm btn-icon" data-act="practice" data-i="${i}" aria-label="Praticar">${icon('mic')}</button>
    </div>`)}</section>`);

  actions(root, {
    scene: (el) => { playing = false; scene = SCENES.find((s) => s.id === el.dataset.id); history.replaceState(null, '', `#/phrases/${scene.id}`); draw(); },
    practice: (el) => {
      const p = scene.phrases[+el.dataset.i];
      const d = sheet(String(html`<div class="center stack-sm"><div class="eyebrow">Diga em voz alta</div>
        <div class="fr" style="font-size:1.45rem;font-weight:600">${p.fr}</div><div class="small muted">${p.pt}</div></div><div id="sp"></div>`));
      const w = mountPractice(d.querySelector('#sp'), p.fr, { onResult: (r) => { if (r.score >= .6) addXP(2, 'speaking'); } });
      d.addEventListener('close', () => w.stop());
      speak(p.fr);
    },
    playAll: async () => {
      if (playing) { playing = false; return; }
      playing = true;
      for (const p of scene.phrases) {
        if (!playing || !document.contains(root)) break;
        await speak(p.fr);
        await new Promise((r) => setTimeout(r, 700));
      }
      playing = false;
    },
  });
  draw();
  return () => { playing = false; };
}
