// Painel "Hoje": meta diária, plano do dia, palavra do dia, mapa de atividade.
import { getState, settings, streak, bestStreak, dayKey } from '../store.js';
import { counts, dueCount, newLeftToday, WORDS, DECKS } from '../srs.js';
import { LESSONS } from '../data/lessons.js';
import { SOUNDS } from '../data/sounds.js';
import { html, mount, icon, ring, sayBtn, tapFr, frDate, pickDaily, plural } from '../ui.js';

function heatmap(weeks = 18) {
  const days = getState().days;
  const end = new Date();
  const start = new Date(end); start.setDate(end.getDate() - (weeks * 7 - 1));
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
  const sessionLabel = due + fresh ? `${plural(due, 'revisão', 'revisões')} · ${plural(fresh, 'nova', 'novas')}` : 'Tudo revisado!';

  mount(root, html`
    <section class="stack-sm">
      <div class="eyebrow" style="text-transform:none;letter-spacing:.02em">${tapFr(frDate(), frDate())}</div>
      <h1 class="h1">${hello}${name ? html`, <span class="grad-text">${name}</span>` : ''} !</h1>
    </section>

    <section class="card hero glow pad-lg" style="margin-top:18px">
      <div class="row" style="gap:20px">
        ${ring(t.xp / goal, { size: 118, sw: 11, label: html`<div><b style="font-size:1.5rem">${t.xp}</b><div class="tiny faint">de ${goal} XP</div></div>` })}
        <div class="grow stack-sm">
          <div class="h3">${t.xp >= goal ? 'Meta do dia batida! 🎉' : 'Meta de hoje'}</div>
          <div class="row wrap small muted" style="gap:14px">
            <span class="row" style="gap:5px">${icon('flame')} ${plural(streak(), 'dia', 'dias')}</span>
            <span class="row" style="gap:5px">${icon('clock')} ${Math.round(t.minutes || 0)} min</span>
          </div>
          <a class="btn btn-primary" href="#/review" style="margin-top:6px">${icon('play')} Sessão de hoje</a>
          <div class="tiny faint">${sessionLabel}</div>
        </div>
      </div>
    </section>

    <div class="section-title"><h2>Plano de hoje</h2></div>
    <div class="list">
      <a class="item" href="#/review"><span class="ico">${icon('cards')}</span>
        <span class="grow"><b>Vocabulário</b><br><span class="small muted">${due + fresh ? sessionLabel : 'Nada pendente — volte amanhã'}</span></span>${icon('chev', 'chev')}</a>
      <a class="item ${st.lessons[nextLesson.id] ? 'done' : ''}" href="#/lesson/${nextLesson.id}"><span class="ico">${icon('book')}</span>
        <span class="grow"><b>${nextLesson.title}</b><br><span class="small muted">Lição ${nextLesson.level} · ${nextLesson.min} min</span></span>${icon('chev', 'chev')}</a>
      <a class="item" href="#/sound/${sound.id}"><span class="ico fr" style="font-size:${sound.sym.length > 3 ? '.8rem' : '1.05rem'};font-weight:700">${sound.sym.length > 5 ? sound.ipa : sound.sym}</span>
        <span class="grow"><b>Som do dia: ${sound.title}</b><br><span class="small muted">Treine com o microfone</span></span>${icon('chev', 'chev')}</a>
      <a class="item" href="#/listen"><span class="ico">${icon('headphones')}</span>
        <span class="grow"><b>Ditado</b><br><span class="small muted">Ouça e escreva 5 frases</span></span>${icon('chev', 'chev')}</a>
      <a class="item" href="#/tutor"><span class="ico">${icon('sparkles')}</span>
        <span class="grow"><b>Conversar com a IA</b><br><span class="small muted">Pratique uma situação real, por voz</span></span>${icon('chev', 'chev')}</a>
    </div>

    <div class="grid grid-2" style="margin-top:24px">
      <section class="card stack-sm">
        <div class="eyebrow">Mot du jour</div>
        <div class="row between"><span class="fr" style="font-size:1.6rem;font-weight:600">${word.display}</span>${sayBtn(word.fr)}</div>
        <div class="small"><span class="tag pt">PT</span> ${word.pt} &nbsp; <span class="tag en">EN</span> ${word.en}</div>
        <div class="small muted">${tapFr(word.ex)} — ${word.exPt}</div>
      </section>
      <section class="card stack-sm">
        <div class="eyebrow">Comme on dit</div>
        <div class="row between"><span class="fr" style="font-size:1.6rem;font-weight:600">${slang.display}</span>${sayBtn(slang.fr)}</div>
        <div class="small"><span class="tag">Falado</span> ${slang.pt}</div>
        <div class="small muted">${tapFr(slang.ex)} — ${slang.exPt}</div>
      </section>
    </div>

    <div class="section-title"><h2>Seu progresso</h2><span class="small faint">${plural(bestStreak(), 'dia', 'dias')} de recorde</span></div>
    <div class="kpis">
      <div class="kpi"><b>${c.young + c.mature}</b><span>palavras aprendidas</span></div>
      <div class="kpi"><b>${c.mature}</b><span>na memória longa</span></div>
      <div class="kpi"><b>${lessonsDone}/${LESSONS.length}</b><span>lições</span></div>
      <div class="kpi"><b>${st.xp.toLocaleString('pt-BR')}</b><span>XP total</span></div>
    </div>
    <section class="card" style="margin-top:12px">
      <div class="row between" style="margin-bottom:10px"><span class="h3">Atividade</span><span class="tiny faint">últimas 18 semanas</span></div>
      ${heatmap()}
    </section>
  `);
}
