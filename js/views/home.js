// Painel "Aujourd'hui": Arquitetura Bento Grid editorial nível Awwwards.
import { getState, settings, streak, bestStreak, dayKey } from '../store.js';
import { counts, dueCount, newLeftToday, WORDS, DECKS } from '../srs.js';
import { LESSONS } from '../data/lessons.js';
import { SOUNDS } from '../data/sounds.js';
import { html, mount, icon, ring, sayBtn, tapFr, frDate, pickDaily, plural } from '../ui.js';

  function heatmap(weeks = 22) {
    const days = getState().days;
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - (weeks * 7 - 1));
    const pad = (start.getDay() + 6) % 7;
    const cells = [];
    for (let i = 0; i < pad; i++) cells.push(html`<i class="pad"></i>`);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const k = dayKey(d), xp = days[k]?.xp || 0;
      const l = xp === 0 ? 0 : xp < 15 ? 1 : xp < 40 ? 2 : xp < 80 ? 3 : 4;
      cells.push(html`<i data-l="${l}" class="${k === dayKey() ? 'today' : ''}" title="${d.toLocaleDateString('pt-BR')}: ${xp} XP"></i>`);
    }
    return html`<div class="heat">${cells}</div>`;
  }

  export default function render(root) {
    const st = getState();
    const t = st.days[dayKey()] || { xp: 0, minutes: 0 };
    const goal = settings().dailyGoal;
    const due = dueCount();
    const fresh = newLeftToday();
    const c = counts();
    const nextLesson = LESSONS.find((l) => !st.lessons[l.id]) || LESSONS[0];
    const lessonsDone = LESSONS.filter((l) => st.lessons[l.id]).length;
    const sound = pickDaily(SOUNDS, 3);
    const word = pickDaily(WORDS.filter((w) => w.ex), 7);
    const slang = pickDaily(DECKS.find((d) => d.id === 'familier').words, 11);
    const h = new Date().getHours();
    const hello = h < 5 || h >= 18 ? 'Bonsoir' : 'Bonjour';
    const name = st.profile.name;
    const sessionLabel = due + fresh ? `${plural(due, 'revisão', 'revisões')} · ${plural(fresh, 'nova', 'novas')}` : 'Memória sincronizada';
    const goalReached = t.xp >= goal;

    const MODULES = [
      {
        idx: '01',
        tag: 'MÉMOIRE FSRS-5',
        title: 'Vocabulário & Cartões',
        desc: due + fresh ? sessionLabel : 'Ciclo do dia concluído — adiante ou revise.',
        href: '#/review',
        ico: icon('cards'),
        accent: true,
      },
      {
        idx: '02',
        tag: `GRAMMAIRE · ${nextLesson.level}`,
        title: nextLesson.title,
        desc: `${nextLesson.sub || 'Ponte estrutural PT → FR'} · ${nextLesson.min} min`,
        href: `#/lesson/${nextLesson.id}`,
        ico: icon('book'),
        done: !!st.lessons[nextLesson.id],
      },
      {
        idx: '03',
        tag: `PHONÉTIQUE · ${sound.ipa}`,
        title: `Som: ${sound.title}`,
        desc: 'Calibragem acústica com avaliação por voz.',
        href: `#/sound/${sound.id}`,
        ico: html`<span class="fr" style="font-weight:700;font-size:1.05rem">${sound.sym.slice(0, 3)}</span>`,
      },
      {
        idx: '04',
        tag: 'CONTRE-LA-MONTRE',
        title: 'Treino Relâmpago 60s',
        desc: 'Desafio de reflexo lexical com multiplicador 3x.',
        href: '#/speed',
        ico: icon('zap'),
      },
      {
        idx: '05',
        tag: 'COMPRÉHENSION',
        title: 'Ditado Auditivo',
        desc: 'Escuta analítica e precisão ortográfica em 5 frases.',
        href: '#/listen',
        ico: icon('headphones'),
      },
      {
        idx: '06',
        tag: 'CONVERSATION IA',
        title: 'Role-play com Camille',
        desc: 'Simulação de cenários reais por voz com correção.',
        href: '#/tutor',
        ico: icon('sparkles'),
      },
    ];

    mount(root, html`
    <!-- Editorial Masthead -->
    <section class="editorial-mast">
      <div class="mast-meta">
        <span class="mast-issue">ÉDITION QUOTIDIENNE</span>
        <span class="mast-sep">◆</span>
        <span class="mast-date">${tapFr(frDate(), frDate())}</span>
        <span class="mast-status"><i class="pulse-dot"></i> FSRS-5 ACTIF</span>
      </div>
      <div class="mast-headline">
        <h1 class="h1">${hello}${name ? html`, <span class="grad-text">${name}</span>` : ''}<em>.</em></h1>
        <p class="mast-sub">L'architecture du français construite sur vos ponts cognitifs en portugais et en anglais.</p>
      </div>
    </section>

    <!-- Primary Asymmetric Bento Grid -->
    <div class="bento-hero-grid">
      <!-- Left: Horological Command Module -->
      <section class="card hero glow bento-command">
        <div class="bento-top-bar">
          <span class="bento-index">00 / CADRAN DU JOUR</span>
          <span class="tag ${goalReached ? 'ok' : 'fr'}">${goalReached ? 'OBJECTIF ATTEINT ✦' : 'EN COURS'}</span>
        </div>

        <div class="command-body">
          <div class="command-dial">
            ${ring(t.xp / goal, {
      size: 148,
      sw: 8,
      label: html`<div class="dial-readout">
                <span class="dial-eyebrow">AUJOURD'HUI</span>
                <b class="dial-val">${t.xp}</b>
                <span class="dial-sub">/ ${goal} XP</span>
              </div>`,
    })}
          </div>

          <div class="command-info">
            <h2 class="h2">${goalReached ? 'Meta diária conquistada.' : 'Sua sessão diária aguarda.'}</h2>
            <p class="small muted" style="margin-bottom:14px">${sessionLabel} agendadas pelo algoritmo de retenção espaçada.</p>

            <div class="telemetry-strip">
              <div class="tel-pill">
                ${icon('flame')}
                <div><b>${streak()}</b><span>${streak() === 1 ? 'dia' : 'dias'}</span></div>
              </div>
              <div class="tel-pill">
                ${icon('clock')}
                <div><b>${Math.round(t.minutes || 0)}</b><span>min</span></div>
              </div>
              <a class="tel-pill" href="#/stats" title="Protetores de Ofensiva">
                ${icon('shield')}
                <div><b>${st.streakFreezes || 0}/2</b><span>escudos</span></div>
              </a>
            </div>

            <div class="command-actions">
              <a class="btn btn-primary btn-lg" href="#/review">
                ${icon('play')} Iniciar Sessão
              </a>
              <a class="btn btn-ghost btn-lg" href="#/reader">
                ${icon('book')} Leitor Bilíngue
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Right: Lexicon & Idiom Showcase -->
      <div class="bento-showcase-stack">
        <section class="card bento-lexicon">
          <div class="bento-top-bar">
            <span class="bento-index">LEXIQUE · MOT DU JOUR</span>
            ${sayBtn(word.fr, 'sm')}
          </div>
          <div class="lex-word fr">${word.display}</div>
          <div class="lex-bridges">
            <span class="tag pt">PT</span> <span>${word.pt}</span>
            <span class="lex-dot">·</span>
            <span class="tag en">EN</span> <span class="muted">${word.en}</span>
          </div>
          <blockquote class="lex-quote">
            <div class="fr">${tapFr(word.ex)}</div>
            <div class="tiny muted">${word.exPt}</div>
          </blockquote>
        </section>

        <section class="card bento-lexicon">
          <div class="bento-top-bar">
            <span class="bento-index">ARGOT · COMME ON DIT</span>
            ${sayBtn(slang.fr, 'sm')}
          </div>
          <div class="lex-word fr">${slang.display}</div>
          <div class="lex-bridges">
            <span class="tag fr">FRANCÊS FALADO</span> <span>${slang.pt}</span>
          </div>
          <blockquote class="lex-quote">
            <div class="fr">${tapFr(slang.ex)}</div>
            <div class="tiny muted">${slang.exPt}</div>
          </blockquote>
        </section>
      </div>
    </div>

    <!-- Curriculum Bento Grid -->
    <div class="section-header">
      <div>
        <span class="eyebrow">ARCHITECTURE D'ÉTUDE</span>
        <h2>Parcours d'Aujourd'hui</h2>
      </div>
      <a class="btn btn-ghost btn-sm" href="#/explore">Ver todas as ferramentas ${icon('arrow')}</a>
    </div>

    <div class="bento-grid-3">
      ${MODULES.map((m) => html`
        <a class="bento-item ${m.accent ? 'featured' : ''} ${m.done ? 'done' : ''}" href="${m.href}">
          <div class="bi-head">
            <span class="bi-idx">${m.idx}</span>
            <span class="bi-ico">${m.ico}</span>
          </div>
          <div class="bi-body">
            <div class="bi-tag">${m.tag}</div>
            <h3 class="bi-title">${m.title}</h3>
            <p class="bi-desc">${m.desc}</p>
          </div>
          <div class="bi-foot">
            <span>${m.done ? 'Concluído ✓' : 'Acessar módulo'}</span>
            <span class="bi-arrow">→</span>
          </div>
        </a>
      `)}
    </div>

    <!-- Telemetry & Chronology Matrix -->
    <div class="section-header">
      <div>
        <span class="eyebrow">TÉLÉMÉTRIE & MÉMOIRE</span>
        <h2>Chronologie de Maîtrise</h2>
      </div>
      <span class="small muted">Recorde: <b style="color:var(--gold-light)">${plural(bestStreak(), 'dia consecutivo', 'dias consecutivos')}</b></span>
    </div>

    <div class="kpis">
      <div class="kpi">
        <span class="kpi-idx">I · VOCABULAIRE</span>
        <b>${c.young + c.mature}</b>
        <span>palavras ativas</span>
      </div>
      <div class="kpi">
        <span class="kpi-idx">II · CONSOLIDATION</span>
        <b>${c.mature}</b>
        <span>memória de longo prazo</span>
      </div>
      <div class="kpi">
        <span class="kpi-idx">III · GRAMMAIRE</span>
        <b>${lessonsDone}<small style="font-size:.55em;color:var(--text-3)">/${LESSONS.length}</small></b>
        <span>lições dominadas</span>
      </div>
      <div class="kpi">
        <span class="kpi-idx">IV · EXPÉRIENCE</span>
        <b>${st.xp.toLocaleString('pt-BR')}</b>
        <span>pontos de maestria (XP)</span>
      </div>
    </div>

    <section class="card pad-lg" style="margin-top:14px">
      <div class="row between wrap" style="margin-bottom:14px">
        <div>
          <span class="bento-index">MATRICE D'ACTIVITÉ · 22 SEMAINES</span>
          <div class="h3" style="margin-top:2px">Constância Diária</div>
        </div>
        <div class="heat-legend">
          <span>Menos</span>
          <i data-l="0"></i><i data-l="1"></i><i data-l="2"></i><i data-l="3"></i><i data-l="4"></i>
          <span>Mais</span>
        </div>
      </div>
      ${heatmap(22)}
    </section>
  `);
  }
