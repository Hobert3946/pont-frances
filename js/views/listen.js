// Ditado: ouvir e escrever. A correção mostra palavra por palavra (acentos, erros, faltas).
import { settings, addXP, bump } from '../store.js';
import { checkAchievements } from '../achievements.js';
import { SENTENCES } from '../data/phrases.js';
import { speak, compareTyped } from '../speech.js';
import { html, mount, actions, icon, pageHead, accentBar, diffView, shuffle, confetti, sfx, haptic, $ } from '../ui.js';

const PER_SESSION = 5;

export default function render(root) {
  let level = 'A1', list = [], i = 0, total = 0, result = null, plays = 0;

  const start = () => { list = shuffle(SENTENCES[level]).slice(0, PER_SESSION); i = 0; total = 0; result = null; draw(); };

  function draw() {
    if (i >= list.length) return summary();
    const s = list[i];
    plays = 0;
    mount(root, html`
      ${pageHead('Ditado', { back: '#/speak', sub: 'Ouça e escreva exatamente o que ouviu' })}
      <div class="row between" style="margin-bottom:14px">
        <div class="seg">${Object.keys(SENTENCES).map((l) => html`<button class="${l === level ? 'on' : ''}" data-act="level" data-l="${l}">${l}</button>`)}</div>
        <span class="small bold">${i + 1}/${list.length}</span>
      </div>
      <div class="bar thin" style="margin-bottom:14px"><i style="width:${(i / list.length) * 100}%"></i></div>
      <section class="card pad-lg stack">
        <div class="row" style="justify-content:center;gap:14px">
          <button class="say lg" data-act="play" aria-label="Ouvir">${icon('volume')}</button>
          <button class="btn btn-ghost" data-act="slow">${icon('gauge')} Devagar</button>
        </div>
        <textarea id="dict" class="field fr" rows="2" autocapitalize="off" spellcheck="false" placeholder="Escreva o que você ouviu…" ${result ? 'disabled' : ''}></textarea>
        ${accentBar()}
        <div id="res"></div>
        <button class="btn btn-primary btn-lg btn-block" data-act="${result ? 'next' : 'check'}">${result ? html`Próxima ${icon('arrow')}` : html`${icon('check')} Corrigir`}</button>
        <div class="center"><button class="btn btn-ghost btn-sm" data-act="skip">Não entendi — mostrar</button></div>
      </section>
      <p class="tiny faint center" style="margin-top:14px">Pontuação e maiúsculas não contam. ${settings().accentStrict ? 'Acentos contam (modo estrito).' : 'Acentos errados contam meio ponto de alerta.'}</p>`);
    setTimeout(() => { playIt(1); $('#dict', root)?.focus(); }, 300);
  }

  const playIt = (rate) => { plays++; speak(list[i].fr, rate ? {} : { rate: .65 }); };

  function check(given) {
    const s = list[i];
    const r = compareTyped(s.fr, given, { strictAccents: settings().accentStrict });
    total += r.score;
    const gain = r.perfect ? 4 : Math.round(r.score * 3);
    if (gain) addXP(gain, 'dictation');
    bump('dictations');
    r.perfect ? sfx.ok() : sfx.bad();
    haptic(r.perfect ? 12 : 25);
    result = r;
    $('#res', root).innerHTML = String(html`<div class="feedback ${r.perfect ? 'ok' : r.score >= .6 ? 'ok' : 'bad'}">
      <b class="t">${r.perfect ? 'Parfait !' : r.accentOnly ? 'Só faltaram acentos' : `${Math.round(r.score * 100)}% certo`}</b>
      ${given ? diffView(r.words) : ''}
      <div class="row" style="gap:8px;margin-top:6px"><button class="say sm" data-say="${s.fr}">${icon('volume')}</button><b class="fr" style="font-size:1.1rem">${s.fr}</b></div>
      <div class="small muted">${s.pt}</div></div>`);
    const btn = root.querySelector('[data-act="check"]');
    btn.dataset.act = 'next';
    btn.innerHTML = String(html`Próxima ${icon('arrow')}`);
    $('#dict', root).disabled = true;
  }

  function summary() {
    const pct = list.length ? total / list.length : 0;
    if (pct >= .9) { sfx.done(); confetti(); }
    checkAchievements();
    mount(root, html`
      ${pageHead('Ditado', { back: '#/speak' })}
      <section class="card hero glow pad-lg center stack">
        <div class="score" style="--p:${pct * 100};--c:${pct >= .8 ? 'var(--green)' : 'var(--gold)'};margin:0 auto"><span>${Math.round(pct * 100)}</span></div>
        <h2 class="h2">${pct >= .9 ? 'Ouvido de nativo!' : pct >= .7 ? 'Muito bom!' : 'Bom treino!'}</h2>
        <p class="muted">${list.length} frases de nível ${level}. Ditado é o exercício que mais acelera a compreensão oral.</p>
        <div class="row wrap" style="justify-content:center"><button class="btn btn-primary" data-act="again">${icon('refresh')} Mais 5 frases</button><a class="btn btn-ghost" href="#/">Início</a></div>
      </section>`);
  }

  actions(root, {
    level: (el) => { level = el.dataset.l; start(); },
    play: () => playIt(1),
    slow: () => playIt(0),
    check: () => { const v = $('#dict', root).value.trim(); if (v) check(v); },
    skip: () => { if (!result) check(''); },
    next: () => { i++; result = null; draw(); },
    again: start,
  });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && e.target.id === 'dict') { e.preventDefault(); root.querySelector('[data-act="check"]')?.click(); }
  });
  start();
}
