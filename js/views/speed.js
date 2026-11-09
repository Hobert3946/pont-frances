// Treino Relâmpago: Quiz contra o relógio de 60 segundos.
import { addXP, bump, getState, save } from '../store.js';
import { checkAchievements } from '../achievements.js';
import { WORDS } from '../data/decks.js';
import { speak, stopSpeaking } from '../speech.js';
import { html, mount, actions, icon, pageHead, toast, confetti, sfx, haptic, shuffle, $ } from '../ui.js';

export default function render(root) {
  let state = 'intro'; // 'intro' | 'play' | 'over'
  let timeLeft = 60;
  let timerId = null;
  let score = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let combo = 0;
  let maxCombo = 0;
  let curQ = null;

  // Filtra apenas palavras com tradução limpa
  const pool = WORDS.filter((w) => w.pt && w.fr && w.fr.length < 25 && !w.fr.includes('…'));

  function makeQuestion() {
    const target = pool[Math.floor(Math.random() * pool.length)];
    // 3 distratores
    const others = shuffle(pool.filter((w) => w.id !== target.id)).slice(0, 3);
    const options = shuffle([target, ...others]);

    const isFrToPt = Math.random() < 0.6;
    curQ = {
      target,
      prompt: isFrToPt ? target.display || target.fr : target.pt,
      isFrToPt,
      options: options.map((opt) => ({
        id: opt.id,
        label: isFrToPt ? opt.pt : (opt.display || opt.fr),
        correct: opt.id === target.id,
      })),
    };
  }

  function start() {
    state = 'play';
    timeLeft = 60;
    score = 0;
    correctCount = 0;
    wrongCount = 0;
    combo = 0;
    maxCombo = 0;
    makeQuestion();
    draw();

    clearInterval(timerId);
    timerId = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(timerId);
        finish();
      } else {
        const timerEl = $('#timerVal', root);
        if (timerEl) timerEl.textContent = `${timeLeft}s`;
        const barEl = $('#timerBar', root);
        if (barEl) barEl.style.width = `${(timeLeft / 60) * 100}%`;
      }
    }, 1000);
  }

  function finish() {
    state = 'over';
    const xpEarned = Math.max(5, Math.round(score / 15) + correctCount);
    addXP(xpEarned, 'speed');
    bump('speedSessions');

    const st = getState();
    const prevBest = st.counters?.bestSpeedScore || 0;
    if (correctCount > prevBest) {
      st.counters.bestSpeedScore = correctCount;
      save();
    }

    confetti();
    sfx.fanfare();
    checkAchievements();
    draw(xpEarned);
  }

  function answer(isCorrect, optEl) {
    if (state !== 'play') return;

    if (isCorrect) {
      combo++;
      if (combo > maxCombo) maxCombo = combo;
      const mult = combo >= 6 ? 3 : combo >= 3 ? 2 : 1;
      const pts = 10 * mult;
      score += pts;
      correctCount++;
      sfx.ok();
      haptic(15);
      optEl.classList.add('btn-ok');
    } else {
      combo = 0;
      wrongCount++;
      sfx.bad();
      haptic(35);
      optEl.classList.add('btn-err');
    }

    if (curQ.isFrToPt) speak(curQ.target.fr);

    setTimeout(() => {
      if (state === 'play') {
        makeQuestion();
        draw();
      }
    }, 280);
  }

  function draw(xpEarned = 0) {
    const st = getState();
    const bestScore = st.counters?.bestSpeedScore || 0;

    if (state === 'intro') {
      mount(root, html`
        ${pageHead('Treino Relâmpago', { back: '#/explore', sub: '60 segundos de pura adrenalina' })}

        <section class="card hero glow pad-lg center stack" style="margin-top:14px">
          <div style="font-size:3.5rem">⚡</div>
          <div class="h2">60 Segundos</div>
          <p class="muted" style="max-width:380px">
            Responda o máximo de palavras que conseguir antes do tempo acabar!
            Mantenha combos de acertos para multiplicar seus pontos (até 3x).
          </p>
          <div class="row center wrap" style="gap:16px;margin:8px 0">
            <span class="stat-chip streak"><b>Recorde: ${bestScore}</b> acertos</span>
          </div>
          <button class="btn btn-primary btn-lg" data-act="start" style="padding:16px 36px;font-size:1.15rem">
            ${icon('zap')} Iniciar Desafio
          </button>
        </section>
      `);
      return;
    }

    if (state === 'play') {
      const mult = combo >= 6 ? 3 : combo >= 3 ? 2 : 1;
      mount(root, html`
        <div class="speed-hud row between" style="margin-bottom:12px">
          <a class="icon-btn" href="#/explore" aria-label="Sair">${icon('x')}</a>
          <div class="row" style="gap:14px">
            <div class="speed-combo ${combo >= 3 ? 'fire' : ''}">
              <b>${combo}</b> combo <span class="tag fr">${mult}x</span>
            </div>
            <div class="speed-score"><b>${score}</b> pts</div>
          </div>
          <div class="speed-timer tag fr" id="timerVal" style="font-size:1.1rem;font-weight:700">${timeLeft}s</div>
        </div>

        <div class="speed-progress-wrap" style="height:6px;background:var(--border);border-radius:3px;overflow:hidden;margin-bottom:20px">
          <div id="timerBar" style="height:100%;width:${(timeLeft / 60) * 100}%;background:linear-gradient(90deg, #4f5bff, #ff4f74);transition:width 1s linear"></div>
        </div>

        <section class="card pad-lg center stack" style="min-height:160px;justify-content:center">
          <div class="tiny faint eyebrow">${curQ.isFrToPt ? 'Traduza para o Português' : 'Traduza para o Francês'}</div>
          <div class="fr" style="font-size:2rem;font-weight:700;margin-top:6px">${curQ.prompt}</div>
        </section>

        <div class="grid grid-2" style="margin-top:18px;gap:12px">
          ${curQ.options.map((opt) => html`
            <button class="btn btn-soft btn-lg speed-opt" data-act="choose" data-correct="${opt.correct}">
              ${opt.label}
            </button>
          `)}
        </div>
      `);
      return;
    }

    if (state === 'over') {
      const total = correctCount + wrongCount;
      const pct = total ? Math.round((correctCount / total) * 100) : 0;
      mount(root, html`
        ${pageHead('Resultado Relâmpago', { back: '#/explore' })}

        <section class="card hero glow pad-lg center stack" style="margin-top:14px">
          <div style="font-size:3rem">${correctCount >= 10 ? '🏎️🔥' : '🎉'}</div>
          <div class="h2">${score} Pontos!</div>
          <div class="small muted">+${xpEarned} XP adicionados</div>

          <div class="grid grid-3" style="width:100%;margin-top:16px;text-align:center">
            <div class="card pad-sm">
              <div class="h3" style="color:var(--green)">${correctCount}</div>
              <div class="tiny faint">Acertos</div>
            </div>
            <div class="card pad-sm">
              <div class="h3" style="color:var(--gold)">${maxCombo}x</div>
              <div class="tiny faint">Maior combo</div>
            </div>
            <div class="card pad-sm">
              <div class="h3">${pct}%</div>
              <div class="tiny faint">Precisão</div>
            </div>
          </div>

          <div class="row center wrap" style="gap:12px;margin-top:20px">
            <button class="btn btn-primary btn-lg" data-act="start">${icon('refresh')} Jogar Novamente</button>
            <a class="btn btn-soft btn-lg" href="#/stats">${icon('chart')} Ver Estatísticas</a>
          </div>
        </section>
      `);
    }
  }

  actions(root, {
    start: () => start(),
    choose: (el) => {
      const isCorrect = el.dataset.correct === 'true';
      answer(isCorrect, el);
    },
  });

  draw();
  return () => {
    clearInterval(timerId);
    stopSpeaking();
  };
}

