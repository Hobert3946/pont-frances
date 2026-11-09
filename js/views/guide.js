// Visualizador da Trilha / Guia Passo a Passo: Do Zero ao B1.
import { getState } from '../store.js';
import { getGuideProgress, PHASES } from '../data/guide.js';
import { html, mount, icon, pageHead } from '../ui.js';

export default function render(root) {
  const st = getState();
  const info = getGuideProgress(st);
  const cur = info.currentStep;

  mount(root, html`
    <section class="editorial-mast">
      <div class="mast-meta">
        <span class="mast-issue">PARCOURS D'APPRENTISSAGE</span>
        <span class="mast-sep">◆</span>
        <span class="mast-date">${info.completedCount} DE ${info.total} PASSOS CONCLUÍDOS (${info.percent}%)</span>
        <span class="mast-status"><i class="pulse-dot"></i> NÍVEL ATUAL: ${info.currentPhase.level}</span>
      </div>
      <div class="mast-headline">
        <h1 class="h1">Roteiro Passo a Passo: <span class="grad-text">Do Zero ao B1</span><em>.</em></h1>
        <p class="mast-sub">Nunca mais fique sem saber por onde começar. Esta trilha organiza lições, pronúncia, memória e diálogo em uma sequência pedagógica progressiva.</p>
      </div>
      <div class="bar" style="margin-top:14px;height:9px"><i style="width:${info.percent}%"></i></div>
    </section>

    <!-- Card Destaque: Seu Próximo Passo -->
    <section class="card glow pad-lg" style="background:var(--grad-soft), var(--surface);border-color:rgba(226,189,90,0.32)">
      <div class="bento-top-bar">
        <div class="row" style="gap:8px">
          <span class="tag fr">SEU PRÓXIMO PASSO</span>
          <span class="bento-index">PASSO ${cur.num} DE ${info.total} · ${info.currentPhase.badge}</span>
        </div>
        <span class="small bold" style="color:var(--gold-bright)">⏱ ${cur.time}</span>
      </div>

      <div class="row wrap between" style="gap:16px">
        <div class="grow" style="max-width:760px">
          <div class="bi-tag" style="margin-bottom:6px">${cur.tag}</div>
          <h2 class="h2" style="font-size:clamp(1.5rem, 1.2rem + 1vw, 2rem)">${cur.title}</h2>
          <p class="small muted" style="margin:8px 0 12px;font-size:1.02rem;line-height:1.6">${cur.sub}</p>
          <div class="callout tip" style="margin:12px 0 0">
            <span class="ci">✦</span>
            <div><b>Por que fazer isso agora:</b> ${cur.why}</div>
          </div>
        </div>

        <div style="align-self:center;min-width:200px">
          <a class="btn btn-primary btn-lg btn-block" href="${cur.href}">
            ${cur.actionText} ${icon('arrow')}
          </a>
        </div>
      </div>
    </section>

    <!-- As 5 Fases da Trilha -->
    <div class="stack-lg" style="margin-top:32px">
      ${info.phases.map((ph, pIdx) => html`
        <div class="phase-block stack-sm">
          <div class="section-header" style="margin-top:16px">
            <div>
              <div class="row" style="gap:10px;margin-bottom:4px">
                <span class="eyebrow">${ph.badge} · NÍVEL ${ph.level}</span>
                <span class="tag ${ph.isComplete ? 'ok' : ph.isCurrent ? 'fr' : ''}">${ph.doneCount}/${ph.totalCount} CONCLUÍDOS</span>
              </div>
              <h2>${ph.title}</h2>
            </div>
            <span class="small muted" style="max-width:540px">${ph.desc}</span>
          </div>

          <div class="list" style="margin-top:14px">
            ${ph.steps.map((s) => {
              const isCurrent = s.id === cur.id;
              return html`
                <div class="card step-item ${s.done ? 'step-done' : ''} ${isCurrent ? 'step-active glow' : ''}" style="padding:18px 22px">
                  <div class="row top wrap between" style="gap:16px">
                    <div class="row top grow" style="gap:16px">
                      <!-- Indicador de Status -->
                      <div class="step-badge ${s.done ? 'done' : isCurrent ? 'active' : ''}">
                        ${s.done ? '✓' : isCurrent ? s.num : s.num}
                      </div>

                      <div class="grow">
                        <div class="row wrap" style="gap:8px;align-items:baseline">
                          <span class="bi-tag">${s.tag}</span>
                          <span class="tiny faint">⏱ ${s.time}</span>
                        </div>
                        <h3 class="bi-title" style="margin:4px 0 6px">${s.title}</h3>
                        <p class="small muted" style="margin:0">${s.sub}</p>
                        ${isCurrent ? html`
                          <div class="tiny" style="color:var(--gold-bright);margin-top:8px;font-weight:550">
                            ✦ <b>Próximo na sua sequência:</b> ${s.why}
                          </div>
                        ` : ''}
                      </div>
                    </div>

                    <!-- Botão de Ação -->
                    <div style="align-self:center;flex:none">
                      <a class="btn ${isCurrent ? 'btn-primary' : s.done ? 'btn-ghost' : 'btn-soft'} btn-sm" href="${s.href}">
                        ${s.done ? 'Revisar' : s.actionText} ${icon('arrow')}
                      </a>
                    </div>
                  </div>
                </div>
              `;
            })}
          </div>
        </div>
      `)}
    </div>
  `);
}

