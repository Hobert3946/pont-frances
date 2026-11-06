// Pontes: padrões de conversão PT → FR → EN, falsos amigos e jogos de dedução.
import { settings, addXP } from '../store.js';
import { PATTERNS, FALSE_FRIENDS } from '../data/bridges.js';
import { checkAnswer, speak } from '../speech.js';
import { html, mount, actions, icon, pageHead, tapFr, sayBtn, accentBar, shuffle, sample, sfx, haptic, confetti, $ } from '../ui.js';

export default function render(root) {
  let tab = 'patterns', filter = 'all', game = null;

  const patterns = () => html`
    <p class="small muted">Com estas regras você "adivinha" centenas de palavras francesas a partir do português — e confirma pelo inglês.</p>
    <div class="list">${PATTERNS.map((p) => html`<section class="card stack-sm">
      <div class="pattern"><span class="tag pt">PT ${p.pt}</span><span class="arrow">→</span><span class="tag fr">FR ${p.fr}</span><span class="arrow">→</span><span class="tag en">EN ${p.en}</span></div>
      <div class="h3">${p.title}</div>
      <div class="small muted">${p.note}</div>
      <div class="stack-sm">${p.examples.map(([pt, fr, en]) => html`<div class="tri"><span>${pt}</span><span class="fr">${tapFr(fr)}</span><span class="faint">${en}</span></div>`)}</div>
    </section>`)}</div>`;

  const friends = () => {
    const items = FALSE_FRIENDS.filter((f) => filter === 'all' || f.trap.includes(filter));
    return html`
      <p class="small muted">Palavras que parecem uma coisa e significam outra. As marcadas <span class="tag pt">PT</span> enganam quem pensa em português; <span class="tag en">EN</span>, quem pensa em inglês.</p>
      <div class="row wrap between" style="margin:10px 0">
        <div class="seg">${[['all', 'Todos'], ['PT', 'Do português'], ['EN', 'Do inglês']].map(([k, l]) => html`<button class="${filter === k ? 'on' : ''}" data-act="filter" data-f="${k}">${l}</button>`)}</div>
        <button class="btn btn-soft btn-sm" data-act="ffQuiz">${icon('target')} Quiz</button>
      </div>
      <section class="card">${items.map((f) => html`<div class="word-row" style="align-items:flex-start">
        ${sayBtn(f.fr, 'sm')}
        <div class="grow">
          <div class="row wrap" style="gap:8px"><span class="fr" style="font-size:1.15rem;font-weight:600">${f.fr}</span>${f.trap.split('+').map((t) => html`<span class="tag ${t.toLowerCase()}">${t}</span>`)}</div>
          <div class="small">✅ <b>${f.means}</b> &nbsp; <span class="faint">❌ não é “${f.looks}”</span></div>
          ${f.ex !== '—' ? html`<div class="small muted">${f.ex}</div>` : ''}
        </div></div>`)}</section>`;
  };

  const converterIntro = () => html`
    <section class="card hero glow pad-lg center stack">
      <div class="big" style="font-size:2.4rem">🧩</div>
      <h2 class="h2">Conversor</h2>
      <p class="muted">Você vê uma palavra em português e deduz a francesa usando os padrões. 10 rodadas.</p>
      <button class="btn btn-primary btn-lg" data-act="convStart">${icon('play')} Jogar</button>
    </section>`;

  function gameView() {
    if (game.type === 'conv') {
      if (game.i >= game.items.length) return endView();
      const [pt, fr, en, rule] = game.items[game.i];
      return html`<section class="card pad-lg stack center">
        <div class="row between"><span class="eyebrow">Rodada ${game.i + 1}/${game.items.length}</span><span class="small bold">${game.score} ✓</span></div>
        <div class="tag pt" style="align-self:center">PT</div>
        <div style="font-size:2rem;font-weight:700">${pt}</div>
        <div class="small faint">Dica: ${rule}</div>
        <input id="cv" class="field fr center" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="em francês…">
        ${accentBar()}
        <div id="gfb"></div>
        <button class="btn btn-primary btn-block" data-act="convCheck">${icon('check')} Verificar</button>
      </section>`;
    }
    if (game.i >= game.items.length) return endView();
    const q = game.items[game.i];
    return html`<section class="card pad-lg stack">
      <div class="row between"><span class="eyebrow">Pergunta ${game.i + 1}/${game.items.length}</span><span class="small bold">${game.score} ✓</span></div>
      <div class="row" style="gap:10px">${sayBtn(q.f.fr)}<span class="fr" style="font-size:1.7rem;font-weight:600">${q.f.fr}</span></div>
      <div class="muted">significa…</div>
      <div class="opts">${q.opts.map((o, k) => html`<button class="opt" data-act="ffPick" data-k="${k}"><span class="k">${'ABC'[k]}</span>${o}</button>`)}</div>
      <div id="gfb"></div>
    </section>`;
  }

  const endView = () => {
    const n = game.items.length;
    if (game.score / n >= .9) confetti();
    return html`<section class="card hero glow pad-lg center stack">
      <div class="score" style="--p:${(game.score / n) * 100};margin:0 auto"><span>${game.score}/${n}</span></div>
      <h2 class="h2">${game.score / n >= .8 ? 'Ponte construída! 🌉' : 'Bom treino!'}</h2>
      <div class="row wrap" style="justify-content:center"><button class="btn btn-primary" data-act="${game.type === 'conv' ? 'convStart' : 'ffQuiz'}">${icon('refresh')} De novo</button>
      <button class="btn btn-ghost" data-act="quit">Voltar</button></div></section>`;
  };

  const draw = () => {
    mount(root, html`
      ${pageHead('Pontes', { back: '#/explore', sub: 'Português e inglês trabalhando a seu favor' })}
      ${game ? html`<button class="btn btn-ghost btn-sm" data-act="quit" style="margin-bottom:12px">${icon('x')} Sair do jogo</button>` : html`<div class="seg" style="margin-bottom:14px">${[['patterns', 'Padrões'], ['friends', 'Falsos amigos'], ['game', 'Conversor']].map(([k, l]) => html`<button class="${tab === k ? 'on' : ''}" data-act="tab" data-t="${k}">${l}</button>`)}</div>`}
      <div id="body">${game ? gameView() : tab === 'patterns' ? patterns() : tab === 'friends' ? friends() : converterIntro()}</div>`);
    if (game?.type === 'conv') setTimeout(() => $('#cv', root)?.focus(), 50);
  };

  const advance = (ok, msg) => {
    if (ok) game.score++;
    ok ? sfx.ok() : sfx.bad();
    haptic(ok ? 10 : [30, 40, 30]);
    $('#gfb', root).innerHTML = String(msg);
    game.answered = true;
  };

  actions(root, {
    tab: (el) => { tab = el.dataset.t; draw(); },
    filter: (el) => { filter = el.dataset.f; draw(); },
    quit: () => { game = null; draw(); },
    convStart: () => {
      const all = PATTERNS.flatMap((p) => p.examples.map(([pt, fr, en]) => [pt, fr, en, `${p.pt} → ${p.fr}`]));
      game = { type: 'conv', items: sample(all, 10), i: 0, score: 0 };
      draw();
    },
    convCheck: () => {
      if (game.answered) { game.i++; game.answered = false; if (game.i >= game.items.length) addXP(game.score, 'bridges'); return draw(); }
      const v = $('#cv', root).value.trim();
      if (!v) return;
      const [, fr, en] = game.items[game.i];
      const r = checkAnswer(fr, v, { strictAccents: settings().accentStrict });
      const ok = r.perfect || r.accentOnly;
      speak(fr);
      advance(ok, html`<div class="feedback ${ok ? 'ok' : 'bad'}"><b class="t">${r.perfect ? 'Exato!' : ok ? 'Certo — confira os acentos' : 'Quase'}</b>
        <div class="fr" style="font-size:1.3rem">${fr}</div><div class="small faint"><span class="tag en">EN</span> ${en}</div></div>`);
      root.querySelector('[data-act="convCheck"]').innerHTML = String(html`Próxima ${icon('arrow')}`);
    },
    ffQuiz: () => {
      const items = sample(FALSE_FRIENDS, 8).map((f) => {
        const other = sample(FALSE_FRIENDS.filter((x) => x !== f), 1)[0].means;
        const opts = shuffle([f.means, f.looks, other]);
        return { f, opts, ans: opts.indexOf(f.means) };
      });
      game = { type: 'ff', items, i: 0, score: 0 };
      draw();
    },
    ffPick: (el) => {
      if (game.answered) return;
      const q = game.items[game.i], k = +el.dataset.k, ok = k === q.ans;
      root.querySelectorAll('.opt').forEach((b, j) => { b.disabled = true; b.classList.add(j === q.ans ? 'right' : j === k ? 'wrong' : 'dim'); });
      advance(ok, html`<div class="feedback ${ok ? 'ok' : 'bad'}"><b class="t">${ok ? 'Não caiu na armadilha!' : 'Caiu no falso amigo'}</b>
        <div class="small">${q.f.ex !== '—' ? q.f.ex : ''}</div></div>
        <button class="btn btn-primary btn-block" data-act="ffNext" style="margin-top:10px">Próxima ${icon('arrow')}</button>`);
    },
    ffNext: () => { game.i++; game.answered = false; if (game.i >= game.items.length) addXP(game.score, 'bridges'); draw(); },
  });
  root.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.id === 'cv') { e.preventDefault(); root.querySelector('[data-act="convCheck"]')?.click(); } });
  draw();
}
