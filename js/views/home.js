// Painel Principal: Dashboard amigável, limpo e direto ao ponto
import { getState, settings, streak, bestStreak, dayKey } from '../store.js';
import { counts, dueCount, newLeftToday, WORDS, DECKS } from '../srs.js';
import { LESSONS } from '../data/lessons.js';
import { DUO_LESSONS } from '../data/duo-lessons.js';
import { html, mount, icon, sayBtn, tapFr, pickDaily, plural } from '../ui.js';

function heatmap(weeks = 20) {
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
  const goal = settings().dailyGoal || 30;
  const due = dueCount();
  const fresh = newLeftToday();
  const c = counts();
  const word = pickDaily(WORDS.filter((w) => w.ex), 7);
  const slang = pickDaily(DECKS.find((d) => d.id === 'familier')?.words || WORDS, 11);

  const h = new Date().getHours();
  const hello = h < 5 || h >= 18 ? 'Bonsoir' : 'Bonjour';
  const name = st.profile.name || '';

  st.duoLessons = st.duoLessons || {};
  const allDuoIds = Object.keys(DUO_LESSONS);
  const nextDuoId = allDuoIds.find((id) => !st.duoLessons[id]) || '1';
  const nextDuo = DUO_LESSONS[nextDuoId];
  const duoDoneCount = allDuoIds.filter((id) => st.duoLessons[id]).length;
  const duoTotal = allDuoIds.length;
  const duoPct = Math.round((duoDoneCount / duoTotal) * 100);
  const goalReached = t.xp >= goal;

  mount(root, html`
    <!-- Cabeçalho Principal -->
    <header style="margin-bottom:24px;padding-top:8px">
      <div class="row between wrap" style="gap:12px;align-items:flex-start">
        <div>
          <div class="row" style="gap:8px;margin-bottom:6px;align-items:center">
            <span class="tag ok">MÉTODO PONT</span>
            <span class="small muted">Francês fácil & descomplicado</span>
          </div>
          <h1 class="h1" style="font-size:clamp(1.7rem, 1.3rem + 1.6vw, 2.3rem);margin:0 0 6px">
            ${hello}${name ? `, ${name}` : ''}! 👋
          </h1>
          <p class="small muted" style="margin:0;font-size:1.02rem">
            Pronto para praticar francês hoje? Apenas 2 minutos mantêm seu aprendizado ativo.
          </p>
        </div>

        <!-- Indicadores Rápidos de Ofensiva e Meta -->
        <div class="row" style="gap:10px;align-items:center">
          <div class="card pad-xs row center" style="gap:8px;padding:8px 14px;background:var(--surface)">
            <span style="font-size:1.2rem">🔥</span>
            <div>
              <b style="color:var(--text-strong);font-size:1.05rem">${streak()}</b>
              <span class="tiny muted" style="display:block;margin-top:-2px">${streak() === 1 ? 'dia' : 'dias'} de ofensiva</span>
            </div>
          </div>
          <div class="card pad-xs row center" style="gap:8px;padding:8px 14px;background:var(--surface)">
            <span style="font-size:1.2rem">⚡</span>
            <div>
              <b style="color:var(--primary);font-size:1.05rem">${t.xp}/${goal} XP</b>
              <span class="tiny muted" style="display:block;margin-top:-2px">${goalReached ? 'Meta batida! 🎉' : 'Meta de hoje'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Card Destaque: Continuar Lição da Trilha -->
    <section class="card pad-lg stack" style="margin-bottom:24px;background:var(--surface);border-color:rgba(34,197,94,0.35);box-shadow:0 6px 20px rgba(0,0,0,0.25)">
      <div class="row between wrap" style="gap:10px;align-items:center;padding-bottom:12px;border-bottom:1px solid var(--border)">
        <div class="row" style="gap:8px;align-items:center">
          <span class="tag ok">SUA PRÓXIMA LIÇÃO</span>
          <span class="small bold" style="color:var(--text-strong)">Lição ${nextDuo.id} de ${duoTotal}</span>
        </div>
        <div class="row" style="gap:10px;align-items:center">
          <span class="small muted">${duoDoneCount}/${duoTotal} concluídas (${duoPct}%)</span>
          <a class="btn btn-ghost btn-xs" href="#/learn">Ver Trilha Completa →</a>
        </div>
      </div>

      <div class="row wrap between" style="gap:18px;align-items:center;margin-top:4px">
        <div class="grow" style="max-width:680px">
          <h2 class="h2" style="font-size:clamp(1.35rem, 1.15rem + 0.8vw, 1.75rem);margin:0 0 6px">
            ${nextDuo.title}: ${nextDuo.sub}
          </h2>
          <p class="small muted" style="margin:0;font-size:1rem;line-height:1.55">
            Aulas interativas curtas: ouça o áudio com nativos, treine a pronúncia no microfone e fixe com exercícios práticos.
          </p>
        </div>

        <div style="flex:none;min-width:min(100%, 220px)">
          <a class="btn btn-primary btn-lg btn-block" href="#/learn/${nextDuo.id}" style="padding:14px 22px;font-size:1.05rem">
            ${icon('play')} Continuar Lição (2 min)
          </a>
        </div>
      </div>

      <!-- Barra de Progresso da Trilha -->
      <div style="margin-top:12px">
        <div class="bar" style="height:8px"><i style="width:${Math.max(5, duoPct)}%;background:var(--primary)"></i></div>
      </div>
    </section>

    <!-- Grade de Acesso Rápido -->
    <div style="margin-bottom:28px">
      <h2 class="h3" style="font-size:1.15rem;margin:0 0 14px;color:var(--text-strong)">Atividades de Aprendizado</h2>
      <div class="bento-grid-2">
        <!-- Trilha Duolingo -->
        <a class="card link stack-sm" href="#/learn" style="background:var(--surface)">
          <div class="row between">
            <span class="tag ok">PASSO A PASSO</span>
            <span style="font-size:1.4rem">🗺️</span>
          </div>
          <div class="h3" style="color:var(--text-strong);margin:4px 0 2px">Trilha de Lições</div>
          <p class="small muted" style="margin:0">Lições interativas estruturadas do zero até conversação diária.</p>
          <div class="row between" style="margin-top:10px;font-size:0.88rem;color:var(--primary);font-weight:600">
            <span>${duoDoneCount}/${duoTotal} lições feitas</span>
            <span>Acessar →</span>
          </div>
        </a>

        <!-- Revisão com Repetição Espaçada -->
        <a class="card link stack-sm" href="#/review" style="background:var(--surface)">
          <div class="row between">
            <span class="tag ${due > 0 ? 'warn' : 'ok'}">${due > 0 ? `${due} PENDENTES` : 'MEMÓRIA EM DIA'}</span>
            <span style="font-size:1.4rem">🗂️</span>
          </div>
          <div class="h3" style="color:var(--text-strong);margin:4px 0 2px">Revisar Palavras</div>
          <p class="small muted" style="margin:0">${due ? `${plural(due, 'palavra aguarda', 'palavras aguardam')} revisão inteligente.` : 'Todas as palavras revisadas por hoje!'}</p>
          <div class="row between" style="margin-top:10px;font-size:0.88rem;color:var(--primary);font-weight:600">
            <span>${c.young + c.mature} palavras aprendidas</span>
            <span>Revisar →</span>
          </div>
        </a>

        <!-- Treino de Pronúncia -->
        <a class="card link stack-sm" href="#/speak" style="background:var(--surface)">
          <div class="row between">
            <span class="tag fr">MICROFONE</span>
            <span style="font-size:1.4rem">🎙️</span>
          </div>
          <div class="h3" style="color:var(--text-strong);margin:4px 0 2px">Treino de Pronúncia</div>
          <p class="small muted" style="margin:0">Fale no microfone e receba pontuação e correções imediatas de fonética.</p>
          <div class="row between" style="margin-top:10px;font-size:0.88rem;color:var(--primary);font-weight:600">
            <span>Sons do francês</span>
            <span>Praticar →</span>
          </div>
        </a>

        <!-- Conversação com Camille -->
        <a class="card link stack-sm" href="#/tutor" style="background:var(--surface)">
          <div class="row between">
            <span class="tag ok">DIÁLOGO IA</span>
            <span style="font-size:1.4rem">💬</span>
          </div>
          <div class="h3" style="color:var(--text-strong);margin:4px 0 2px">Conversar com Camille</div>
          <p class="small muted" style="margin:0">Pratique diálogos em francês em cenários como café, hotel e viagens.</p>
          <div class="row between" style="margin-top:10px;font-size:0.88rem;color:var(--primary);font-weight:600">
            <span>Simulações reais</span>
            <span>Conversar →</span>
          </div>
        </a>
      </div>
    </div>

    <!-- Vocabulário do Dia -->
    <div style="margin-bottom:28px">
      <div class="row between" style="margin-bottom:14px;align-items:baseline">
        <h2 class="h3" style="font-size:1.15rem;margin:0;color:var(--text-strong)">Vocabulário de Hoje</h2>
        <span class="small muted">Atualizado diariamente</span>
      </div>

      <div class="bento-grid-2">
        <!-- Palavra do Dia -->
        <section class="card stack-sm" style="background:var(--surface);padding:22px">
          <div class="row between" style="margin-bottom:6px">
            <span class="tag ok">PALAVRA DO DIA</span>
            ${sayBtn(word.fr, 'sm')}
          </div>
          <div class="h2" style="font-size:1.8rem;margin:4px 0;color:var(--text-strong)">${word.display}</div>
          <div class="row" style="gap:8px;align-items:center;margin-bottom:12px;font-size:1rem">
            <span class="tag pt">PT</span>
            <span style="color:var(--text-strong);font-weight:600">${word.pt}</span>
            <span class="muted" style="margin-left:4px">(${word.en})</span>
          </div>
          <div style="padding:12px 14px;border-radius:10px;background:var(--surface-2);border-left:3px solid var(--primary)">
            <div style="font-size:1.02rem;color:var(--text-strong);line-height:1.4">${tapFr(word.ex)}</div>
            <div class="small muted" style="margin-top:4px">${word.exPt}</div>
          </div>
        </section>

        <!-- Expressão do Francês Falado -->
        <section class="card stack-sm" style="background:var(--surface);padding:22px">
          <div class="row between" style="margin-bottom:6px">
            <span class="tag fr">FRANCÊS DO DIA A DIA</span>
            ${sayBtn(slang.fr, 'sm')}
          </div>
          <div class="h2" style="font-size:1.8rem;margin:4px 0;color:var(--text-strong)">${slang.display}</div>
          <div class="row" style="gap:8px;align-items:center;margin-bottom:12px;font-size:1rem">
            <span class="tag fr">GÍRIA / EXPRESSÃO</span>
            <span style="color:var(--text-strong);font-weight:600">${slang.pt}</span>
          </div>
          <div style="padding:12px 14px;border-radius:10px;background:var(--surface-2);border-left:3px solid var(--blue)">
            <div style="font-size:1.02rem;color:var(--text-strong);line-height:1.4">${tapFr(slang.ex)}</div>
            <div class="small muted" style="margin-top:4px">${slang.exPt}</div>
          </div>
        </section>
      </div>
    </div>

    <!-- Estatísticas & Constância -->
    <section class="card pad-lg" style="margin-bottom:20px;background:var(--surface)">
      <div class="row between wrap" style="gap:10px;margin-bottom:16px;align-items:center">
        <div>
          <div class="h3" style="color:var(--text-strong);margin:0">Constância de Estudos</div>
          <span class="small muted">Atividade registrada nas últimas 20 semanas</span>
        </div>
        <div class="row" style="gap:14px;align-items:center">
          <span class="small muted">Recorde: <b style="color:var(--primary)">${plural(bestStreak(), 'dia seguido', 'dias seguidos')}</b></span>
          <div class="heat-legend">
            <span>Menos</span>
            <i data-l="0"></i><i data-l="1"></i><i data-l="2"></i><i data-l="3"></i><i data-l="4"></i>
            <span>Mais</span>
          </div>
        </div>
      </div>
      ${heatmap(20)}
    </section>
  `);
}
