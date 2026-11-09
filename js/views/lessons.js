// Lições de gramática: lista por nível e leitor com quiz.
import { getState, save, addXP } from '../store.js';
import { checkAchievements } from '../achievements.js';
import { LESSONS, LESSON, LEVELS } from '../data/lessons.js';
import { markup, inline } from '../markup.js';
import { checkAnswer } from '../speech.js';
import { settings } from '../store.js';
import { html, raw, mount, actions, icon, pageHead, accentBar, diffView, confetti, sfx, haptic, $ } from '../ui.js';

function list(root) {
  const st = getState();
  const done = LESSONS.filter((l) => st.lessons[l.id]).length;
  const pct = Math.round((done / LESSONS.length) * 100);
  mount(root, html`
    <header style="margin-bottom:24px;padding-top:8px">
      <div class="row" style="gap:8px;margin-bottom:6px;align-items:center">
        <span class="tag ok">GRAMÁTICA & ESTRUTURA</span>
        <span class="small muted">${done} de ${LESSONS.length} aulas concluídas (${pct}%)</span>
      </div>
      <h1 class="h1" style="font-size:clamp(1.7rem, 1.3rem + 1.6vw, 2.3rem);margin:0 0 6px">
        Aulas de Gramática
      </h1>
      <p class="small muted" style="margin:0;font-size:1.02rem;max-width:65ch">
        Aulas práticas e diretas mostrando como o português facilita o aprendizado do francês e onde ter atenção, sempre com quizzes para fixação.
      </p>
      <div class="bar" style="margin-top:16px;height:8px"><i style="width:${pct}%;background:var(--primary)"></i></div>
    </header>

    ${LEVELS.map((lv, lIdx) => html`
      <div class="section-header" style="margin-top:${lIdx === 0 ? '12px' : '36px'}">
        <div>
          <span class="eyebrow">NIVEAU CECR · 0${lIdx + 1}</span>
          <h2>${lv.title}</h2>
        </div>
        <span class="small muted">${lv.desc}</span>
      </div>
      <div class="bento-grid-3">${LESSONS.filter((l) => l.level === lv.id).map((l) => {
    const globalIdx = String(LESSONS.indexOf(l) + 1).padStart(2, '0');
    const r = st.lessons[l.id];
    return html`<a class="bento-item ${r ? 'done' : ''}" href="#/lesson/${l.id}">
          <div class="bi-head">
            <span class="bi-idx">LEÇON ${globalIdx}</span>
            <span class="bi-ico">${r ? icon('check') : html`<b class="fr">${globalIdx}</b>`}</span>
          </div>
          <div class="bi-body">
            <div class="bi-tag">${l.level} · ${l.min} MIN</div>
            <h3 class="bi-title">${l.title}</h3>
            <p class="bi-desc">${l.sub}</p>
          </div>
          <div class="bi-foot">
            <span>${r ? `Domínio: ${Math.round(r.best * 100)}%` : 'Estudar dossiê'}</span>
            <span class="bi-arrow">→</span>
          </div>
        </a>`;
  })}</div>`)}
  `);
}

function lesson(root, id) {
  const l = LESSON[id];
  if (!l) { location.hash = '#/lessons'; return; }
  const idx = LESSONS.indexOf(l);
  const nextL = LESSONS[idx + 1];
  let qi = -1, correct = 0, answered = false;

  const quizBox = () => {
    if (qi < 0) return html`<button class="btn btn-primary btn-lg btn-block" data-act="start">${icon('target')} Fazer o quiz (${l.quiz.length} perguntas)</button>`;
    if (qi >= l.quiz.length) {
      const pct = correct / l.quiz.length;
      return html`<section class="card hero glow pad-lg center stack">
        <div class="score" style="--p:${pct * 100};--c:${pct >= .8 ? 'var(--green)' : pct >= .5 ? 'var(--gold)' : 'var(--red)'};margin:0 auto"><span>${Math.round(pct * 100)}%</span></div>
        <h2 class="h2">${pct === 1 ? 'Parfait !' : pct >= .6 ? 'Très bien !' : 'Continue praticando'}</h2>
        <p class="muted">${correct} de ${l.quiz.length} certas.</p>
        <div class="row wrap" style="justify-content:center">
          <button class="btn btn-ghost" data-act="start">${icon('refresh')} Refazer</button>
          ${nextL ? html`<a class="btn btn-primary" href="#/lesson/${nextL.id}">Próxima: ${nextL.title} ${icon('arrow')}</a>` : html`<a class="btn btn-primary" href="#/lessons">Ver lições</a>`}
        </div></section>`;
    }
    const [q, opts] = l.quiz[qi];
    return html`<section class="card stack" id="quiz">
      <div class="row between"><span class="eyebrow">Pergunta ${qi + 1} de ${l.quiz.length}</span><span class="small bold">${correct} ✓</span></div>
      <div class="h3" style="font-size:1.15rem">${raw(inline(q))}</div>
      ${opts ? html`<div class="opts">${opts.map((o, i) => html`<button class="opt" data-act="pick" data-i="${i}"><span class="k">${'ABCD'[i]}</span><span class="fr" style="font-size:1.05rem">${o}</span></button>`)}</div>`
        : html`<div><input id="typed" class="field fr" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Digite em francês…">${accentBar()}</div>
          <button class="btn btn-primary" data-act="type">${icon('check')} Verificar</button>`}
      <div id="fb"></div>
    </section>`;
  };

  const draw = () => {
    mount($('#quizArea', root), quizBox());
    if (qi >= 0 && qi < l.quiz.length && !l.quiz[qi][1]) $('#typed', root)?.focus();
  };

  const feedback = (ok, extra = '') => {
    answered = true;
    if (ok) correct++;
    ok ? sfx.ok() : sfx.bad();
    haptic(ok ? 12 : [30, 40, 30]);
    const [, , , expl] = l.quiz[qi];
    $('#fb', root).innerHTML = String(html`<div class="feedback ${ok ? 'ok' : 'bad'}"><b class="t">${ok ? 'Certo!' : 'Não exatamente'}</b>${extra}<div class="small">${raw(inline(expl || ''))}</div></div>
      <button class="btn btn-primary btn-block" data-act="next" style="margin-top:12px">${qi + 1 < l.quiz.length ? 'Próxima' : 'Ver resultado'} ${icon('arrow')}</button>`);
  };

  mount(root, html`
    ${pageHead(l.title, { back: '#/lessons', sub: `${l.level} · ${l.sub}` })}
    <article class="card pad-lg prose">${raw(markup(l.body))}</article>
    <div id="quizArea" style="margin-top:16px"></div>
    <div class="row between" style="margin-top:18px">
      ${idx > 0 ? html`<a class="btn btn-ghost btn-sm" href="#/lesson/${LESSONS[idx - 1].id}">${icon('back')} Anterior</a>` : html`<span></span>`}
      ${nextL ? html`<a class="btn btn-ghost btn-sm" href="#/lesson/${nextL.id}">Próxima ${icon('chev')}</a>` : ''}
    </div>
  `);
  draw();

  actions(root, {
    start: () => { qi = 0; correct = 0; answered = false; draw(); $('#quiz', root)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); },
    pick: (el) => {
      if (answered) return;
      const ans = l.quiz[qi][2], i = +el.dataset.i;
      root.querySelectorAll('.opt').forEach((b, k) => { b.disabled = true; b.classList.add(k === ans ? 'right' : k === i ? 'wrong' : 'dim'); });
      feedback(i === ans);
    },
    type: () => {
      if (answered) return;
      const v = $('#typed', root).value.trim();
      if (!v) return;
      const res = checkAnswer(l.quiz[qi][2], v, { strictAccents: settings().accentStrict });
      const ok = res.perfect || res.accentOnly;
      feedback(ok, html`${diffView(res.words)}${!res.perfect ? html`<div class="small">Resposta: <b class="fr">${res.target}</b></div>` : ''}`);
    },
    next: () => {
      qi++; answered = false;
      if (qi >= l.quiz.length) {
        const st = getState();
        const pct = correct / l.quiz.length;
        const first = !st.lessons[l.id];
        st.lessons[l.id] = { best: Math.max(pct, st.lessons[l.id]?.best || 0), at: Date.now() };
        save();
        addXP((first ? 10 : 3) + correct * 2, 'lessons');
        if (pct >= .8) { sfx.done(); confetti(); }
        checkAchievements();
      }
      draw();
    },
  });
  root.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.id === 'typed') root.querySelector('[data-act="type"]')?.click(); });
}

export default function render(root, params, name) {
  if (name === 'lesson' && params[0]) lesson(root, params[0]);
  else list(root);
}
