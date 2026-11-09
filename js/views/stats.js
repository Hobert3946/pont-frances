// Painel de Estatísticas Avançadas e Galeria de Conquistas.
import { getState, streak, bestStreak, buyStreakFreeze } from '../store.js';
import { ACHIEVEMENTS, checkAchievements } from '../achievements.js';
import { counts, WORDS } from '../srs.js';
import { SOUNDS } from '../data/sounds.js';
import { html, mount, actions, icon, pageHead, toast, ring, confetti, sfx, $ } from '../ui.js';

export default function render(root) {
  checkAchievements();
  const st = getState();
  const c = counts(); // { total, unseen, learning, review, due, fresh }
  const totalCards = Object.keys(st.cards || {}).length;
  const cardsList = Object.values(st.cards || {});
  const masteredCards = cardsList.filter((card) => card && card.s >= 7).length;
  const learningCards = cardsList.filter((card) => card && card.s < 7).length;

  // Precisão média nos sons
  const soundEntries = Object.entries(st.sounds || {});
  const avgSoundScore = soundEntries.length
    ? Math.round((soundEntries.reduce((acc, [, val]) => acc + (val.best || 0), 0) / soundEntries.length) * 100)
    : 0;

  const currentStreak = streak();
  const allBestStreak = bestStreak();
  const freezes = st.streakFreezes || 0;

  const draw = () => {
    mount(root, html`
      ${pageHead('Estatísticas & Conquistas', { back: '#/explore', sub: 'Acompanhe seu progresso e marcos alcançados' })}

      <!-- Resumo Principal -->
      <div class="grid grid-2" style="margin-top:14px;gap:12px">
        <section class="card pad-md stack-sm">
          <div class="eyebrow">Ofensiva Atual</div>
          <div class="row" style="gap:10px;align-items:baseline">
            <span class="h1" style="color:var(--orange, #f08c00)">${currentStreak}</span>
            <span class="muted small">dias seguidos</span>
          </div>
          <div class="tiny faint">Melhor recorde: ${allBestStreak} dias</div>
        </section>

        <section class="card pad-md stack-sm">
          <div class="eyebrow">Protetor de Ofensiva</div>
          <div class="row between">
            <div class="row" style="gap:8px">
              <span style="font-size:1.6rem">🛡️</span>
              <div>
                <b>${freezes} / 2</b>
                <div class="tiny faint">${freezes > 0 ? 'Ativo contra faltas' : 'Nenhum ativo'}</div>
              </div>
            </div>
            ${freezes < 2 ? html`<button class="btn btn-soft btn-sm" data-act="buyShield">${icon('plus')} Comprar (100 XP)</button>` : ''}
          </div>
        </section>
      </div>

      <!-- Memória de Longo Prazo (FSRS) -->
      <section class="card pad-lg stack-sm" style="margin-top:16px">
        <div class="row between">
          <div class="h3">Distribuição no FSRS</div>
          <span class="tag fr">${totalCards} palavras estudadas</span>
        </div>
        <p class="small muted">
          Algoritmo FSRS-5 estimando a estabilidade da sua memória para cada vocabulário.
        </p>

        <div class="grid grid-3" style="margin-top:10px;gap:10px">
          <div class="card pad-sm center">
            <div class="h3" style="color:var(--green)">${masteredCards}</div>
            <div class="tiny faint">Consolidadas (S ≥ 7d)</div>
          </div>
          <div class="card pad-sm center">
            <div class="h3" style="color:var(--gold)">${learningCards}</div>
            <div class="tiny faint">Em Aprendizado</div>
          </div>
          <div class="card pad-sm center">
            <div class="h3">${WORDS.length - totalCards}</div>
            <div class="tiny faint">Ainda Não Vistas</div>
          </div>
        </div>

        <div class="meter-bar" style="height:10px;background:var(--border);border-radius:5px;overflow:hidden;display:flex;margin-top:12px">
          <div style="background:var(--green);width:${totalCards ? (masteredCards / totalCards) * 100 : 0}%;title:Consolidadas"></div>
          <div style="background:var(--gold);width:${totalCards ? (learningCards / totalCards) * 100 : 0}%;title:Aprendizado"></div>
        </div>
      </section>

      <!-- Precisão de Pronúncia e Sons -->
      <section class="card pad-lg stack-sm" style="margin-top:16px">
        <div class="row between">
          <div class="h3">Laboratório de Sons</div>
          <span class="tag fr">${soundEntries.length} / ${SOUNDS.length} praticados</span>
        </div>
        <p class="small muted">Nota média do microfone nos fonemas franceses mais desafiadores: <b>${avgSoundScore}%</b></p>

        <div class="grid grid-auto" style="margin-top:8px;gap:8px">
          ${SOUNDS.slice(0, 8).map((s) => {
            const sc = st.sounds?.[s.id]?.best;
            return html`
              <div class="card pad-xs center" style="border:1px solid ${sc ? 'var(--green)' : 'var(--border)'}">
                <div class="fr" style="font-weight:700">${s.sym}</div>
                <div class="tiny ${sc ? 'good' : 'faint'}">${sc != null ? `${Math.round(sc * 100)}%` : '—'}</div>
              </div>
            `;
          })}
        </div>
      </section>

      <!-- Galeria de Conquistas (Badges) -->
      <div class="section-title" style="margin-top:24px">
        <h2>Conquistas</h2>
        <span class="small faint">${ACHIEVEMENTS.filter((a) => st.achievements?.[a.id]).length} de ${ACHIEVEMENTS.length}</span>
      </div>

      <div class="grid grid-2" style="gap:12px">
        ${ACHIEVEMENTS.map((a) => {
          const unlocked = !!st.achievements?.[a.id];
          const pr = a.progress ? a.progress(st) : { cur: unlocked ? 1 : 0, max: 1 };
          const pct = Math.min(100, Math.round((pr.cur / pr.max) * 100));

          return html`
            <div class="card pad-md achievement-card ${unlocked ? 'unlocked glow' : 'locked'}" style="position:relative;opacity:${unlocked ? 1 : 0.65}">
              <div class="row" style="gap:12px;align-items:flex-start">
                <span class="ach-icon" style="font-size:2.2rem;line-height:1">${a.icon}</span>
                <div class="grow stack-xs">
                  <div class="row between">
                    <b style="font-size:1.05rem">${a.title}</b>
                    <span class="tiny tag ${unlocked ? 'fr' : ''}">+${a.xp} XP</span>
                  </div>
                  <div class="small muted">${a.desc}</div>
                  ${unlocked ? html`<div class="tiny good" style="margin-top:4px">✓ Conquistado</div>`
                    : html`
                      <div class="stack-xs" style="margin-top:6px">
                        <div class="meter-bar" style="height:5px;background:var(--border);border-radius:3px;overflow:hidden">
                          <div style="height:100%;width:${pct}%;background:var(--accent)"></div>
                        </div>
                        <div class="tiny faint">${pr.cur} / ${pr.max} (${pct}%)</div>
                      </div>
                    `}
                </div>
              </div>
            </div>
          `;
        })}
      </div>
    `);
  };

  actions(root, {
    buyShield: () => {
      const res = buyStreakFreeze(100);
      if (res.ok) {
        confetti();
        sfx.ok();
        toast(res.msg, { type: 'ok' });
        checkAchievements();
        draw();
      } else {
        toast(res.msg, { type: 'err' });
      }
    },
  });

  draw();
}

