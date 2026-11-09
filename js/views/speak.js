// Falar: laboratório de sons (explicação, palavras, pares mínimos e prática com microfone).
import { getState, save, addXP } from '../store.js';
import { SOUNDS, SOUND } from '../data/sounds.js';
import { markup } from '../markup.js';
import { speak, randomVoice, sttSupported } from '../speech.js';
import { mountPractice } from '../practice.js';
import { html, raw, mount, actions, icon, pageHead, pick, sfx, haptic, confetti, $ } from '../ui.js';

function list(root) {
  const st = getState();
  const practiced = SOUNDS.filter((s) => st.sounds[s.id]?.best != null).length;
  mount(root, html`
    <section class="editorial-mast">
      <div class="mast-meta">
        <span class="mast-issue">LABORATOIRE ACOUSTIQUE</span>
        <span class="mast-sep">◆</span>
        <span class="mast-date">${practiced} DE ${SOUNDS.length} FONEMAS CALIBRADOS</span>
      </div>
      <div class="mast-headline">
        <h1 class="h1">Phonétique & <span class="grad-text">Voix</span><em>.</em></h1>
        <p class="mast-sub">Domine os fonemas que não existem em português com análise espectral e avaliação de pronúncia em tempo real.</p>
      </div>
    </section>

    <div class="bento-grid-2">
      <a class="bento-item featured" href="#/shadow">
        <div class="bi-head">
          <span class="bi-idx">STUDIO 01 · PROSODIE</span>
          <span class="bi-ico">${icon('waves')}</span>
        </div>
        <div class="bi-body">
          <div class="bi-tag">IMITATION RYTHMIQUE</div>
          <h3 class="bi-title">Shadowing Acústico</h3>
          <p class="bi-desc">Ouça um falante nativo e repita simultaneamente no mesmo ritmo e entonação. O treino definitivo de fluidez oral.</p>
        </div>
        <div class="bi-foot">
          <span>Iniciar estúdio de voz</span>
          <span class="bi-arrow">→</span>
        </div>
      </a>

      <a class="bento-item featured" href="#/listen">
        <div class="bi-head">
          <span class="bi-idx">STUDIO 02 · PERCEPTION</span>
          <span class="bi-ico">${icon('headphones')}</span>
        </div>
        <div class="bi-body">
          <div class="bi-tag">ACUITÉ AUDITIVE</div>
          <h3 class="bi-title">Ditado de Precisão</h3>
          <p class="bi-desc">Ouça frases graduadas, transcreva e receba diagnóstico ortográfico detalhado palavra por palavra.</p>
        </div>
        <div class="bi-foot">
          <span>Iniciar sessão de escuta</span>
          <span class="bi-arrow">→</span>
        </div>
      </a>
    </div>

    ${ sttSupported ? '' : html`<div class="callout warn" style="margin-top:16px"><span class="ci">⚠️</span><div>Este navegador não possui motor de reconhecimento de voz. Abra o Pont no <b>Edge</b> ou no <b>Chrome</b> para receber notas acústicas de pronúncia.</div></div>` }

    <div class="section-header" style="margin-top:36px">
      <div>
        <span class="eyebrow">MATRICE PHONÉTIQUE FRANÇAISE</span>
        <h2>Laboratório de Sons (${SOUNDS.length})</h2>
      </div>
      <span class="small muted">Pares mínimos & calibragem por microfone</span>
    </div>

    <div class="sound-matrix">${SOUNDS.map((s, idx) => {
      const best = st.sounds[s.id]?.best;
      return html`<a class="sound ${best >= 0.8 ? 'mastered' : ''}" href="#/sound/${s.id}">
        <div class="sound-top">
          <span class="bi-idx">N° ${String(idx + 1).padStart(2, '0')}</span>
          <span class="ipa">${s.ipa}</span>
        </div>
        <span class="sym">${s.sym}</span>
        <b class="sound-title">${s.title}</b>
        <div class="sound-foot">
          <span class="meta">${best != null ? `Recorde: ${Math.round(best * 100)}%` : s.tag}</span>
          <span class="bi-arrow">→</span>
        </div>
      </a>`;
    })}</div>
    `);
}

function sound(root, id) {
  const s = SOUND[id];
  if (!s) { location.hash = '#/speak'; return; }
  const idx = SOUNDS.indexOf(s);
  let target = s.sentence, practice = null;
  let game = null; // { round, score, cur: { pair, i }, answered }

  const record = (res) => {
    const st = getState();
    st.sounds[id] = { best: Math.max(res.score, st.sounds[id]?.best || 0), at: Date.now() };
    save();
    if (res.score >= .6) addXP(2, 'speaking');
  };

  mount(root, html`
    ${ pageHead(html`<span class="fr">${s.sym}</span> <span class="faint" style="font-weight:500">${s.ipa}</span>`, { back: '#/speak', sub: s.title }) }
    <article class="card pad-lg prose">${raw(markup(s.body))}</article>

    <div class="section-title"><h2>Palavras-modelo</h2><span class="small faint">toque para ouvir e treinar</span></div>
    <div class="row wrap" style="gap:8px">${s.words.map((w) => html`<button class="chip fr" data-act="word" data-w="${w}" style="font-size:1.05rem">${w}</button>`)}</div>

    <section class="card stack" style="margin-top:16px">
      <div class="center"><div class="eyebrow">Diga em voz alta</div><div class="fr" id="target" style="font-size:1.55rem;font-weight:600;margin-top:6px">${target}</div></div>
      <div id="practice"></div>
      <div class="center"><button class="btn btn-ghost btn-sm" data-act="sentence">${icon('refresh')} Voltar para a frase completa</button></div>
    </section>

    ${
      s.pairs.length ? html`<div class="section-title"><h2>Treino de ouvido</h2><span class="small faint">pares mínimos</span></div>
      <section class="card stack" id="game"></section>` : ''
    }

    <div class="row between" style="margin-top:18px">
      ${idx > 0 ? html`<a class="btn btn-ghost btn-sm" href="#/sound/${SOUNDS[idx - 1].id}">${icon('back')} ${SOUNDS[idx - 1].sym}</a>` : html`<span></span>`}
      ${SOUNDS[idx + 1] ? html`<a class="btn btn-ghost btn-sm" href="#/sound/${SOUNDS[idx + 1].id}">${SOUNDS[idx + 1].sym} ${icon('chev')}</a>` : ''}
    </div>`);

  const setTarget = (t) => {
    target = t;
    $('#target', root).textContent = t;
    practice?.stop();
    practice = mountPractice($('#practice', root), t, { onResult: record });
  };
  setTarget(target);

  /* ---------- jogo de pares mínimos ---------- */
  const ROUNDS = 10;
  function drawGame() {
    const box = $('#game', root);
    if (!box) return;
    if (!game) {
      box.innerHTML = String(html`< p class="muted" style = "margin:0" > Você vai ouvir uma de duas palavras quase iguais — com vozes diferentes a cada rodada.Seu ouvido aprende a separar os sons.</p >
        <div class="row wrap small">${s.pairs.map(([a, b, g]) => html`<span class="tag">${a} · ${b}</span><span class="tiny faint">${g}</span>`)}</div>
        <button class="btn btn-primary" data-act="gameStart">${icon('target')} Começar (${ROUNDS} rodadas)</button>`);
      return;
    }
    if (game.round >= ROUNDS) {
      const pct = game.score / ROUNDS;
      box.innerHTML = String(html`< div class="center stack-sm" ><div class="score" style="--p:${pct * 100};--c:${pct >= .8 ? 'var(--green)' : 'var(--gold)'};margin:0 auto"><span>${game.score}/${ROUNDS}</span></div>
        <div class="h3">${pct >= .9 ? 'Ouvido afiado! 👂' : pct >= .7 ? 'Muito bem!' : 'Continue treinando — melhora rápido.'}</div>
        <button class="btn btn-soft" data-act="gameStart">${icon('refresh')} Jogar de novo</button></div > `);
      return;
    }
    const { pair } = game.cur;
    box.innerHTML = String(html`< div class="row between" ><span class="eyebrow">Rodada ${game.round + 1} de ${ROUNDS}</span><span class="small bold">${game.score} ✓</span></div >
      <div class="bar thin"><i style="width:${(game.round / ROUNDS) * 100}%"></i></div>
      <div class="center"><button class="say lg" data-act="gameHear" aria-label="Ouvir de novo">${icon('volume')}</button><div class="tiny faint" style="margin-top:6px">Qual você ouviu?</div></div>
      <div class="pair-opts">${[0, 1].map((k) => html`<button class="opt" data-act="gamePick" data-k="${k}">${pair[k]}</button>`)}</div>
      <div id="gfb"></div>`);
  }
  const playRound = () => speak(game.cur.pair[game.cur.i], { voice: game.cur.voice });
  const newRound = () => {
    game.cur = { pair: pick(s.pairs), i: Math.random() < .5 ? 0 : 1, voice: randomVoice() };
    game.answered = false;
    drawGame();
    setTimeout(playRound, 250);
  };
  drawGame();

  actions(root, {
    word: (el) => { speak(el.dataset.w); setTarget(el.dataset.w); },
    sentence: () => setTarget(s.sentence),
    gameStart: () => { game = { round: 0, score: 0 }; newRound(); },
    gameHear: () => playRound(),
    gamePick: (el) => {
      if (game.answered) return;
      game.answered = true;
      const k = +el.dataset.k, ok = k === game.cur.i;
      if (ok) game.score++;
      ok ? sfx.ok() : sfx.bad();
      haptic(ok ? 10 : [30, 40, 30]);
      root.querySelectorAll('.pair-opts .opt').forEach((b, j) => { b.disabled = true; b.classList.add(j === game.cur.i ? 'right' : j === k ? 'wrong' : 'dim'); });
      const [a, b, g] = game.cur.pair;
      $('#gfb', root).innerHTML = String(html`< div class="feedback ${ok ? 'ok' : 'bad'}" ><b class="t">${ok ? 'Isso!' : `Era “${game.cur.pair[game.cur.i]}”`}</b>
        <div class="row wrap small"><button class="btn btn-sm btn-ghost" data-say="${a}">${icon('volume')} ${a}</button><button class="btn btn-sm btn-ghost" data-say="${b}">${icon('volume')} ${b}</button><span class="faint">${g}</span></div></div > `);
      setTimeout(() => {
        if (!document.contains(el)) return;
        game.round++;
        if (game.round >= ROUNDS) {
          addXP(game.score, 'listening');
          if (game.score >= 9) confetti();
          drawGame();
        } else newRound();
      }, ok ? 1100 : 2400);
    },
  });
  return () => practice?.stop();
}

export default function render(root, params, name) {
  if (name === 'sound' && params[0]) return sound(root, params[0]);
  return list(root);
}
