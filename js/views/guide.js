// Visualizador da Trilha / Guia Passo a Passo: Do Zero ao B1.
import { getState } from '../store.js';
import { getGuideProgress, PHASES } from '../data/guide.js';
import { html, mount, icon } from '../ui.js';

export default function render(root) {
  const st = getState();
  const info = getGuideProgress(st);
  const cur = info.currentStep;

  mount(root, html`
    <header style="margin-bottom:24px;padding-top:8px">
      <div class="row" style="gap:8px;margin-bottom:6px;align-items:center">
        <span class="tag ok">TRILHA PEDAGÓGICA</span>
        <span class="small muted">${info.completedCount} de ${info.total} passos concluídos (${info.percent}%)</span>
      </div>
      <h1 class="h1" style="font-size:clamp(1.7rem, 1.3rem + 1.6vw, 2.3rem);margin:0 0 6px">
        Roteiro Guiado: Do Zero ao B1
      </h1>
      <p class="small muted" style="margin:0;font-size:1.02rem;max-width:65ch">
        Uma sequência estruturada para você aprender francês sem se perder: cada passo indica exatamente o que estudar, o tempo necessário e por que é importante agora.
      </p>
      <div class="bar" style="margin-top:16px;height:8px"><i style="width:${info.percent}%;background:var(--primary)"></i></div>
    </header>

    <!-- Card Destaque: Seu Próximo Passo -->
    <section class="card pad-lg stack" style="margin-bottom:28px;background:var(--surface);border-color:rgba(34,197,94,0.35);box-shadow:0 6px 20px rgba(0,0,0,0.25)">
      <div class="row between wrap" style="gap:8px;padding-bottom:12px;border-bottom:1px solid var(--border)">
        <div class="row" style="gap:8px;align-items:center">
          <span class="tag ok">SEU PRÓXIMO PASSO</span>
          <span class="small bold" style="color:var(--text-strong)">Passo ${cur.num} de ${info.total} · ${info.currentPhase.badge}</span>
        </div>
        <span class="small bold" style="color:var(--primary)">⏱ ${cur.time}</span>
      </div>

      <div class="row wrap between" style="gap:18px;align-items:center;margin-top:6px">
        <div class="grow" style="max-width:720px">
          <div class="tag fr" style="margin-bottom:8px">${cur.tag}</div>
          <h2 class="h2" style="font-size:clamp(1.35rem, 1.15rem + 0.8vw, 1.75rem);margin:0 0 6px">${cur.title}</h2>
          <p class="small muted" style="margin:0 0 10px;font-size:1rem;line-height:1.55">${cur.sub}</p>
          <div class="callout tip" style="margin:10px 0 0">
            <span class="ci">💡</span>
            <div><b>Por que fazer agora:</b> ${cur.why}</div>
          </div>
        </div>

        <div style="flex:none;min-width:min(100%, 220px)">
          <a class="btn btn-primary btn-lg btn-block" href="${cur.href}" style="padding:14px 22px">
            ${cur.actionText} ${icon('arrow')}
          </a>
        </div>
      </div>
    </section>

    <!-- As 5 Fases da Trilha -->
    <div class="stack-lg" style="display:flex;flex-direction:column;gap:32px">
      ${info.phases.map((ph) => html`
        <div class="phase-block stack-sm">
          <div class="row between wrap" style="gap:10px;margin-bottom:12px;align-items:baseline">
            <div>
              <div class="row" style="gap:8px;margin-bottom:4px;align-items:center">
                <span class="tag ${ph.isComplete ? 'ok' : ph.isCurrent ? 'fr' : ''}">${ph.badge} · NÍVEL ${ph.level}</span>
                <span class="small muted">${ph.doneCount}/${ph.totalCount} passos</span>
              </div>
              <h2 class="h3" style="font-size:1.35rem;margin:0">${ph.title}</h2>
            </div>
            <span class="small muted" style="max-width:480px">${ph.desc}</span>
          </div>

          <div class="list stack-xs">
            ${ph.steps.map((s) => {
              const isCurrent = s.id === cur.id;
              return html`
                <div class="card ${isCurrent ? 'glow' : ''}" style="padding:16px 20px;background:var(--surface);border-color:${isCurrent ? 'rgba(34,197,94,0.45)' : 'var(--border)'}">
                  <div class="row top wrap between" style="gap:14px;align-items:center">
                    <div class="row top grow" style="gap:14px;align-items:flex-start">
                      <!-- Indicador de Status -->
                      <div style="display:grid;place-items:center;width:34px;height:34px;border-radius:10px;font-weight:700;font-size:0.95rem;background:${s.done ? 'var(--green-soft)' : isCurrent ? 'var(--primary)' : 'var(--surface-2)'};color:${s.done ? 'var(--green)' : isCurrent ? '#fff' : 'var(--text-3)'};border:1px solid ${s.done ? 'rgba(34,197,94,0.3)' : 'var(--border)'};flex:none">
                        ${s.done ? '✓' : s.num}
                      </div>

                      <div class="grow">
                        <div class="row wrap" style="gap:8px;align-items:baseline">
                          <span class="tag fr" style="font-size:0.75rem">${s.tag}</span>
                          <span class="tiny faint">⏱ ${s.time}</span>
                        </div>
                        <h3 style="margin:4px 0 2px;font-size:1.05rem;color:var(--text-strong);font-weight:650">${s.title}</h3>
                        <p class="small muted" style="margin:0">${s.sub}</p>
                        ${isCurrent ? html`
                          <div class="tiny" style="color:var(--primary);margin-top:6px;font-weight:600">
                            → <b>Recomendado agora:</b> ${s.why}
                          </div>
                        ` : ''}
                      </div>
                    </div>

                    <!-- Botão de Ação -->
                    <div style="flex:none">
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
