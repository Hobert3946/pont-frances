// Engine de Aprendizado Interativo Estilo Duolingo.
// Sessões curtas (2-3 min) com áudio nativo imediato, dicas de pronúncia,
// feedback instantâneo de acerto/erro, repetição espaçada e celebração.
import { getState, save, addXP, addMinutes } from '../store.js';
import { speak, stopSpeaking, listen, stopListening, scoreSpeech, sttSupported } from '../speech.js';
import { DUO_UNITS, DUO_LESSONS } from '../data/duo-lessons.js';
import { html, mount, actions, icon, confetti, sfx } from '../ui.js';

export default function render(root, params) {
  const lessonId = params[0];

  // Se não foi informada uma lição, renderiza o "Caminho de Aprendizado" (Trilha Duolingo)
  if (!lessonId || !DUO_LESSONS[lessonId]) {
    return renderPath(root);
  }

  return startLesson(root, DUO_LESSONS[lessonId]);
}

/* ==========================================================================
   1. VISUALIZADOR DO CAMINHO (TRILHA ESTILO DUOLINGO)
   ========================================================================== */
function renderPath(root) {
  const st = getState();
  st.duoLessons = st.duoLessons || {};

  // Determinar primeira lição não concluída
  const allLessonIds = Object.keys(DUO_LESSONS);
  const nextLessonId = allLessonIds.find((id) => !st.duoLessons[id]) || '1';

  mount(root, html`
    <header style="margin-bottom:24px;padding-top:8px">
      <div class="row" style="gap:8px;margin-bottom:6px;align-items:center">
        <span class="tag ok">MÉTODO PASSO A PASSO</span>
        <span class="small muted">Aprenda do zero com áudio e pronúncia</span>
      </div>
      <h1 class="h1" style="font-size:clamp(1.7rem, 1.3rem + 1.6vw, 2.3rem);margin:0 0 6px">
        Trilha de Lições Interativas
      </h1>
      <p class="small muted" style="margin:0;font-size:1.02rem;max-width:65ch">
        Aulas curtas de 2 minutos. Ouça a pronúncia nativa, treine no microfone e fixe o vocabulário sem decoreba.
      </p>
    </header>

    <!-- Card Destaque: Continuar de onde parou -->
    <div class="card pad-lg stack" style="margin-top:20px;background:var(--surface);border-color:rgba(34,197,94,0.35);box-shadow:0 6px 20px rgba(0,0,0,0.25)">
      <div class="row wrap between" style="gap:16px;align-items:center">
        <div>
          <span class="tag ok" style="margin-bottom:8px">SEU PRÓXIMO PASSO</span>
          <h2 class="h2" style="font-size:1.5rem;margin:4px 0 2px">Lição ${nextLessonId}: ${DUO_LESSONS[nextLessonId].title}</h2>
          <p class="small muted" style="margin:0">${DUO_LESSONS[nextLessonId].sub}</p>
        </div>
        <a class="btn btn-primary btn-lg" href="#/learn/${nextLessonId}">
          ${icon('play')} Começar Lição ${nextLessonId}
        </a>
      </div>
    </div>

    <!-- Lista de Unidades e Nós da Trilha -->
    <div class="duo-path-stack" style="margin-top:36px;display:flex;flex-direction:column;gap:36px">
      ${DUO_UNITS.map((unit) => {
        const unitLessons = unit.lessons.map((id) => DUO_LESSONS[id]).filter(Boolean);
        const completedInUnit = unitLessons.filter((l) => st.duoLessons[l.id]).length;
        const isUnitDone = completedInUnit === unitLessons.length;

        return html`
          <section class="card pad-lg stack" style="border-color:${isUnitDone ? 'rgba(74, 222, 128, 0.3)' : 'var(--border)'}">
            <div class="bento-top-bar" style="margin-bottom:14px">
              <div>
                <div class="row" style="gap:8px;margin-bottom:4px">
                  <span class="eyebrow">${unit.badge}</span>
                  <span class="tag ${isUnitDone ? 'ok' : ''}">${completedInUnit}/${unitLessons.length} CONCLUÍDAS</span>
                </div>
                <h3 class="h2" style="font-size:1.35rem">${unit.title}</h3>
                <p class="small muted" style="margin:2px 0 0">${unit.desc}</p>
              </div>
            </div>

            <!-- Grade de nós da unidade -->
            <div class="duo-unit-nodes">
              ${unitLessons.map((l, idx) => {
                const isDone = !!st.duoLessons[l.id];
                const isCurrent = l.id === nextLessonId;

                return html`
                  <a class="duo-node-item ${isDone ? 'done' : isCurrent ? 'current' : 'locked'}" href="#/learn/${l.id}">
                    <div class="duo-node-circle">
                      ${isDone ? '★' : isCurrent ? icon('play') : l.id}
                    </div>
                    <div class="duo-node-info">
                      <div class="duo-node-num">LIÇÃO ${l.id}</div>
                      <div class="duo-node-title">${l.title}</div>
                      <div class="duo-node-sub">${l.sub}</div>
                    </div>
                    <span class="tag ${isDone ? 'ok' : isCurrent ? 'fr' : ''}">
                      ${isDone ? '✓ Feito' : isCurrent ? 'Jogar' : 'Iniciar'}
                    </span>
                  </a>
                `;
              })}
            </div>
          </section>
        `;
      })}
    </div>
  `);
}

/* ==========================================================================
   2. MOTOR DA LIÇÃO INTERATIVA (ESTILO DUOLINGO)
   ========================================================================== */
function startLesson(root, lesson) {
  const steps = [...lesson.steps];
  let queue = [...steps];
  let originalTotal = steps.length;
  let correctCount = 0;
  let finished = false;

  let currentStep = queue[0];
  let selectedOption = null;
  let feedback = null; // { ok: boolean, msg: string }
  let isChecking = false;

  // Estados específicos para certos tipos de exercícios
  let matchSelected = null; // { side: 'fr'|'pt', val: string }
  let matchCompleted = new Set();
  let buildSelected = []; // tokens colocados na resposta
  let micActive = false;
  let micScore = null;
  let micTranscript = '';

  function playStepAudio() {
    stopSpeaking();
    if (currentStep?.audio) {
      setTimeout(() => speak(currentStep.audio), 180);
    }
  }

  function advance() {
    feedback = null;
    selectedOption = null;
    matchSelected = null;
    matchCompleted = new Set();
    buildSelected = [];
    micActive = false;
    micScore = null;
    micTranscript = '';
    isChecking = false;

    queue.shift();
    if (queue.length === 0) {
      finishLesson();
    } else {
      currentStep = queue[0];
      draw();
      playStepAudio();
    }
  }

  function finishLesson() {
    finished = true;
    const st = getState();
    st.duoLessons = st.duoLessons || {};
    st.duoLessons[lesson.id] = true;
    save();

    addXP(lesson.xp, 'lesson');
    addMinutes(2);
    sfx.fanfare();
    confetti();
    draw();
  }

  function draw() {
    if (finished) {
      mount(root, html`
        <div class="duo-session-frame">
          <div class="card glow pad-lg text-center" style="max-width:520px;margin:40px auto;text-align:center;padding:40px 24px">
            <div style="font-size:3.5rem;margin-bottom:12px">🎉</div>
            <span class="tag ok" style="margin-bottom:10px;font-size:0.85rem">LIÇÃO COMPLETA !</span>
            <h1 class="h2" style="font-size:2rem;margin-bottom:8px">Excelente trabalho!</h1>
            <p class="muted" style="margin-bottom:24px">Você dominou a pronúncia e fixou o vocabulário de <b>"${lesson.title}"</b>.</p>

            <div class="row center" style="gap:24px;justify-content:center;margin-bottom:32px">
              <div class="card pad-md" style="min-width:120px;background:var(--surface-2)">
                <span class="tiny faint">XP GANHO</span>
                <div style="font-size:1.6rem;font-weight:700;color:var(--gold-bright)">+${lesson.xp} XP</div>
              </div>
              <div class="card pad-md" style="min-width:120px;background:var(--surface-2)">
                <span class="tiny faint">PRECISÃO</span>
                <div style="font-size:1.6rem;font-weight:700;color:var(--green)">100%</div>
              </div>
            </div>

            <div class="stack" style="gap:12px">
              ${getNextLessonId(lesson.id) ? html`
                <a class="btn btn-primary btn-lg btn-block" href="#/learn/${getNextLessonId(lesson.id)}">
                  Próxima Lição ${icon('arrow')}
                </a>
              ` : ''}
              <a class="btn btn-soft btn-lg btn-block" href="#/learn">
                Voltar à Trilha
              </a>
            </div>
          </div>
        </div>
      `);
      return;
    }

    const progressPct = Math.round(((originalTotal - queue.length) / originalTotal) * 100);

    mount(root, html`
      <div class="duo-session-frame">
        <!-- Topo da Sessão: Sair e Barra de Progresso Verde -->
        <header class="duo-session-header">
          <a class="duo-close-btn" href="#/learn" title="Sair da Lição" aria-label="Fechar">✕</a>
          <div class="duo-progress-bar">
            <i style="width:${Math.max(6, progressPct)}%"></i>
          </div>
          <div class="duo-session-xp">⚡ ${lesson.xp} XP</div>
        </header>

        <!-- Corpo Principal da Questão -->
        <main class="duo-question-container">
          ${renderStepContent(currentStep)}
        </main>

        <!-- Barra Inferior de Ação e Feedback (Estilo Duolingo) -->
        <footer class="duo-action-bar ${feedback ? (feedback.ok ? 'correct' : 'wrong') : ''}">
          <div class="duo-action-inner">
            ${feedback ? html`
              <div class="duo-feedback-msg">
                <div class="duo-feedback-icon">${feedback.ok ? '✓' : '✕'}</div>
                <div>
                  <b class="duo-feedback-title">${feedback.ok ? 'Excelente!' : 'Não se preocupe!'}</b>
                  <div class="duo-feedback-desc">${feedback.msg}</div>
                </div>
              </div>
            ` : html`<div></div>`}

            <button class="btn ${feedback ? (feedback.ok ? 'btn-primary' : 'btn-soft') : 'btn-primary'} btn-lg duo-continue-btn" data-act="btnContinue">
              ${feedback ? 'Continuar' : currentStep.type === 'intro' ? 'Entendi' : 'Verificar'}
            </button>
          </div>
        </footer>
      </div>
    `);

    attachEvents();
  }

  function renderStepContent(step) {
    if (step.type === 'intro') {
      return html`
        <div class="duo-intro-card text-center">
          <span class="tag fr" style="margin-bottom:12px">NOVA PALAVRA / EXPRESSÃO</span>
          
          <div class="duo-big-word fr">${step.fr}</div>

          <div class="row center" style="gap:12px;margin:14px 0 20px;justify-content:center">
            <button class="btn btn-soft btn-lg" data-act="playAudio">
              ${icon('volume')} Ouvir Pronúncia
            </button>
            <button class="btn btn-ghost btn-sm" data-act="playSlow" title="Ouvir mais devagar">
              🐢 Lento
            </button>
          </div>

          <div class="duo-phonetic-badge">
            <span class="tiny faint">🗣️ COMO PRONUNCIAR EM PORTUGUÊS:</span>
            <b>${step.phonetic}</b>
          </div>

          <div class="duo-meaning-box">
            <span class="tiny faint">TRADUÇÃO:</span>
            <div class="duo-meaning-val">${step.pt}</div>
          </div>

          ${step.tip ? html`
            <div class="callout tip" style="margin-top:20px;text-align:left">
              <span class="ci">💡</span>
              <div><b>Dica de ouro:</b> ${step.tip}</div>
            </div>
          ` : ''}
        </div>
      `;
    }

    if (step.type === 'choice') {
      return html`
        <div class="duo-task-card">
          <h2 class="duo-prompt-title">${step.prompt}</h2>

          <div class="duo-choices-grid">
            ${step.options.map((opt, idx) => html`
              <button class="duo-choice-card ${selectedOption === idx ? 'selected' : ''}" data-act="selectChoice" data-idx="${idx}">
                <span class="duo-choice-radio">${selectedOption === idx ? '●' : '○'}</span>
                <span class="duo-choice-text fr">${opt}</span>
                <span class="duo-choice-speaker" data-act="speakChoice" data-text="${opt}">${icon('volume')}</span>
              </button>
            `)}
          </div>
        </div>
      `;
    }

    if (step.type === 'listen') {
      return html`
        <div class="duo-task-card text-center">
          <h2 class="duo-prompt-title">${step.prompt}</h2>

          <div style="margin:24px 0 28px">
            <button class="btn btn-primary btn-icon duo-huge-speaker" data-act="playAudio" style="width:76px;height:76px;margin:0 auto">
              ${icon('volume')}
            </button>
            <div class="tiny faint" style="margin-top:8px">Toque para ouvir quantas vezes quiser</div>
          </div>

          <div class="duo-choices-grid">
            ${step.options.map((opt, idx) => html`
              <button class="duo-choice-card ${selectedOption === idx ? 'selected' : ''}" data-act="selectChoice" data-idx="${idx}">
                <span class="duo-choice-radio">${selectedOption === idx ? '●' : '○'}</span>
                <span class="duo-choice-text fr">${opt}</span>
              </button>
            `)}
          </div>
        </div>
      `;
    }

    if (step.type === 'speak') {
      return html`
        <div class="duo-task-card text-center">
          <span class="tag fr" style="margin-bottom:12px">TREINO DE PRONÚNCIA</span>
          <h2 class="duo-prompt-title">${step.prompt}</h2>

          <div class="duo-big-word fr" style="font-size:2rem;margin:16px 0 8px">${step.fr}</div>
          <div class="tiny muted" style="margin-bottom:20px">${step.phonetic}</div>

          <div class="duo-mic-action" style="margin:24px 0">
            <button class="duo-mic-btn ${micActive ? 'listening' : ''}" data-act="toggleMic">
              ${icon(micActive ? 'stop' : 'mic')}
            </button>
            <div class="duo-mic-label" style="margin-top:10px">
              ${micActive ? 'Ouvindo... Fale agora!' : 'Toque no microfone e fale'}
            </div>
            ${micTranscript ? html`
              <div class="callout" style="margin-top:12px;display:inline-block">
                Ouvido: <i>"${micTranscript}"</i> ${micScore !== null ? `(${Math.round(micScore * 100)}%)` : ''}
              </div>
            ` : ''}
          </div>

          <div class="row center" style="justify-content:center;margin-top:14px">
            <button class="btn btn-ghost btn-sm" data-act="playAudio">
              ${icon('volume')} Ouvir como o nativo fala
            </button>
            <button class="btn btn-ghost btn-sm faint" data-act="skipSpeak">
              Pular microfone agora
            </button>
          </div>
        </div>
      `;
    }

    if (step.type === 'build') {
      return html`
        <div class="duo-task-card">
          <span class="tag" style="margin-bottom:10px">MONTE A FRASE</span>
          <h2 class="duo-prompt-title">${step.prompt}</h2>

          <!-- Área da resposta montada -->
          <div class="duo-build-tray">
            ${buildSelected.length === 0 ? html`
              <span class="tiny faint">Toque nas palavras abaixo para formar a frase...</span>
            ` : buildSelected.map((tok, idx) => html`
              <button class="duo-token in-tray" data-act="removeToken" data-idx="${idx}">
                ${tok}
              </button>
            `)}
          </div>

          <!-- Palavras disponíveis para tocar -->
          <div class="duo-tokens-bank" style="margin-top:24px">
            ${step.tokens.map((tok, idx) => {
              const isUsed = buildSelected.includes(tok);
              return html`
                <button class="duo-token ${isUsed ? 'used' : ''}" data-act="addToken" data-tok="${tok}" ${isUsed ? 'disabled' : ''}>
                  ${tok}
                </button>
              `;
            })}
          </div>
        </div>
      `;
    }

    if (step.type === 'match') {
      return html`
        <div class="duo-task-card">
          <span class="tag fr" style="margin-bottom:10px">ASSOCIAÇÃO DE PARES</span>
          <h2 class="duo-prompt-title">${step.prompt}</h2>

          <div class="row wrap" style="gap:16px;margin-top:20px;justify-content:center">
            <!-- Coluna Francês -->
            <div style="flex:1;min-width:130px;display:flex;flex-direction:column;gap:10px">
              ${step.pairs.map((p) => {
                const done = matchCompleted.has(p.fr);
                const active = matchSelected?.side === 'fr' && matchSelected?.val === p.fr;
                return html`
                  <button class="duo-match-btn ${done ? 'matched' : active ? 'active' : ''}" data-act="matchFr" data-val="${p.fr}" ${done ? 'disabled' : ''}>
                    ${p.fr}
                  </button>
                `;
              })}
            </div>

            <!-- Coluna Português -->
            <div style="flex:1;min-width:130px;display:flex;flex-direction:column;gap:10px">
              ${step.pairs.map((p) => {
                const done = matchCompleted.has(p.fr);
                const active = matchSelected?.side === 'pt' && matchSelected?.val === p.pt;
                return html`
                  <button class="duo-match-btn ${done ? 'matched' : active ? 'active' : ''}" data-act="matchPt" data-val="${p.pt}" data-for="${p.fr}" ${done ? 'disabled' : ''}>
                    ${p.pt}
                  </button>
                `;
              })}
            </div>
          </div>
        </div>
      `;
    }

    return html`<div>Tipo de etapa desconhecido.</div>`;
  }

  function attachEvents() {
    actions(root, {
      btnContinue: () => {
        if (feedback) {
          advance();
          return;
        }

        // Validação de acordo com o tipo de etapa
        if (currentStep.type === 'intro') {
          advance();
          return;
        }

        if (currentStep.type === 'choice' || currentStep.type === 'listen') {
          if (selectedOption === null) {
            sfx.tap();
            return;
          }
          const isOk = selectedOption === currentStep.answer;
          handleResult(isOk, isOk ? (currentStep.explanation || 'Você acertou!') : `A resposta certa é "${currentStep.options[currentStep.answer]}"`);
          return;
        }

        if (currentStep.type === 'speak') {
          if (micScore !== null && micScore >= 0.6) {
            handleResult(true, `Ótima pronúncia! Nota: ${Math.round(micScore * 100)}%`);
          } else {
            // Se não falou ou foi baixo
            handleResult(true, 'Pronúncia registrada! Continue praticando para aperfeiçoar.');
          }
          return;
        }

        if (currentStep.type === 'build') {
          const currentAnswer = buildSelected.join(' ').toLowerCase().replace(/[.,!]/g, '').trim();
          const targetAnswer = currentStep.target.join(' ').toLowerCase().replace(/[.,!]/g, '').trim();
          const isOk = currentAnswer === targetAnswer;
          handleResult(isOk, isOk ? 'Frase montada com perfeição!' : `A ordem correta é: "${currentStep.target.join(' ')}"`);
          return;
        }

        if (currentStep.type === 'match') {
          if (matchCompleted.size === currentStep.pairs.length) {
            handleResult(true, 'Todos os pares conectados corretamente!');
          } else {
            sfx.tap();
          }
          return;
        }
      },

      playAudio: () => speak(currentStep.audio || currentStep.fr),
      playSlow: () => speak(currentStep.audio || currentStep.fr, { rate: 0.72 }),

      selectChoice: (el) => {
        selectedOption = +el.dataset.idx;
        sfx.tap();
        draw();
      },

      speakChoice: (el, e) => {
        e.stopPropagation();
        speak(el.dataset.text);
      },

      toggleMic: async () => {
        if (micActive) {
          stopListening();
          micActive = false;
          draw();
          return;
        }

        micActive = true;
        micTranscript = '';
        draw();

        try {
          const res = await listen({ lang: 'fr-FR' });
          micActive = false;
          micTranscript = res.transcript || '';
          micScore = scoreSpeech(currentStep.fr, res.alternatives || [micTranscript]);
          if (micScore >= 0.65) {
            sfx.ok();
          } else {
            sfx.tap();
          }
        } catch (err) {
          micActive = false;
          micTranscript = '(Não foi possível ouvir)';
          micScore = 0.5;
        }
        draw();
      },

      skipSpeak: () => {
        handleResult(true, 'Tudo bem! Você poderá treinar a fala no microfone mais tarde.');
      },

      addToken: (el) => {
        buildSelected.push(el.dataset.tok);
        sfx.tap();
        draw();
      },

      removeToken: (el) => {
        buildSelected.splice(+el.dataset.idx, 1);
        sfx.tap();
        draw();
      },

      matchFr: (el) => {
        const val = el.dataset.val;
        speak(val);
        if (matchSelected?.side === 'pt') {
          // Checar se o pt selecionado corresponde a este fr
          const pair = currentStep.pairs.find((p) => p.fr === val);
          if (pair && pair.pt === matchSelected.val) {
            matchCompleted.add(val);
            matchSelected = null;
            sfx.ok();
          } else {
            sfx.bad();
            matchSelected = null;
          }
        } else {
          matchSelected = { side: 'fr', val };
        }
        draw();
      },

      matchPt: (el) => {
        const val = el.dataset.val;
        const forFr = el.dataset.for;
        if (matchSelected?.side === 'fr') {
          if (matchSelected.val === forFr) {
            matchCompleted.add(forFr);
            matchSelected = null;
            sfx.ok();
          } else {
            sfx.bad();
            matchSelected = null;
          }
        } else {
          matchSelected = { side: 'pt', val };
        }
        draw();
      },
    });
  }

  function handleResult(ok, msg) {
    feedback = { ok, msg };
    if (ok) {
      sfx.ok();
      correctCount++;
    } else {
      sfx.bad();
      // Repete o exercício no fim da lição para fixação autêntica (Método Duolingo)
      queue.push(currentStep);
    }
    draw();
  }

  playStepAudio();
  draw();
}

function getNextLessonId(curId) {
  const ids = Object.keys(DUO_LESSONS);
  const idx = ids.indexOf(curId);
  return idx !== -1 && idx < ids.length - 1 ? ids[idx + 1] : null;
}

