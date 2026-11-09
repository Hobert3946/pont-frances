// Ajustes: perfil, voz, estudo, aparência, tutor IA, instalação e backup.
import { getState, settings, setSetting, save, exportJSON, importJSON, resetProgress, buyStreakFreeze } from '../store.js';
import { frenchVoices, currentVoice, speak, voicesReady, ttsSupported, sttSupported } from '../speech.js';
import { applyTheme } from '../app.js';
import { MODELS } from './tutor.js';
import { html, mount, actions, icon, pageHead, toast, $ } from '../ui.js';

const NUMERIC = new Set(['rate', 'newPerDay', 'dailyGoal', 'retention']);
const sw = (key) => html`<label class="switch"><input type="checkbox" data-set="${key}" ${settings()[key] ? 'checked' : ''}><span></span></label>`;
const row = (title, sub, control) => html`<div class="setting"><div class="grow"><b>${title}</b>${sub ? html`<div class="small muted">${sub}</div>` : ''}</div>${control}</div>`;

export default function render(root) {
  const draw = () => {
    const s = settings(), st = getState();
    const voices = frenchVoices();
    const cur = currentVoice();
    mount(root, html`
      ${pageHead('Ajustes', { back: '#/' })}

      <section class="card"><div class="eyebrow" style="margin-bottom:4px">Perfil</div>
        ${row('Seu nome', 'Usado nas saudações', html`<input class="field" style="max-width:180px;height:42px" data-set="name" value="${st.profile.name}" maxlength="30">`)}
      </section>

      <section class="card" style="margin-top:12px"><div class="eyebrow" style="margin-bottom:4px">Voz francesa</div>
        ${!ttsSupported ? html`<p class="small">Este navegador não tem síntese de voz.</p>` : ''}
        ${row('Sotaque', 'Afeta a escolha automática da voz e o reconhecimento de fala', html`<select class="field" style="max-width:190px;height:42px" data-set="dialect">
          ${[['fr-FR', 'França'], ['fr-CA', 'Canadá (Québec)'], ['fr-BE', 'Bélgica'], ['fr-CH', 'Suíça']].map(([v, l]) => html`<option value="${v}" ${s.dialect === v ? 'selected' : ''}>${l}</option>`)}</select>`)}
        ${row('Voz', voices.length ? `${voices.length} vozes francesas neste aparelho` : 'Nenhuma voz francesa instalada — instale o pacote de idioma francês do sistema', html`<select class="field" style="max-width:220px;height:42px" data-set="voiceURI">
          <option value="">Automática${cur ? ` (${cur.name.replace(/Microsoft |Online |\(Natural\)| - .*/g, '').trim()})` : ''}</option>
          ${voices.map((v) => html`<option value="${v.voiceURI}" ${s.voiceURI === v.voiceURI ? 'selected' : ''}>${v.name} · ${v.lang}</option>`)}</select>`)}
        ${row('Velocidade', `${Math.round(s.rate * 100)}%`, html`<input type="range" min="0.6" max="1.2" step="0.05" value="${s.rate}" data-set="rate" style="max-width:160px">`)}
        ${row('Tocar áudio automaticamente', 'Nos cartões e nas respostas do tutor', sw('autoplay'))}
        <div class="row" style="padding-top:10px"><button class="btn btn-soft" data-act="test">${icon('volume')} Testar voz</button>
          <span class="tiny faint">Dica: no Windows, o Edge tem as vozes neurais mais naturais (Denise, Henri, Vivienne).</span></div>
      </section>

      <section class="card" style="margin-top:12px"><div class="eyebrow" style="margin-bottom:4px">Estudo</div>
        ${row('Palavras novas por dia', 'Revisões não têm limite', html`<input class="field" type="number" min="0" max="50" style="max-width:90px;height:42px" data-set="newPerDay" value="${s.newPerDay}">`)}
        ${row('Meta diária de XP', '', html`<select class="field" style="max-width:150px;height:42px" data-set="dailyGoal">${[30, 60, 100, 150].map((n) => html`<option value="${n}" ${s.dailyGoal === n ? 'selected' : ''}>${n} XP</option>`)}</select>`)}
        ${row('Retenção-alvo (FSRS)', `${Math.round(s.retention * 100)}% — mais alto = revisões mais frequentes`, html`<input type="range" min="0.8" max="0.95" step="0.01" value="${s.retention}" data-set="retention" style="max-width:160px">`)}
        ${row('Exigir acentos exatos', 'Desligado: acento errado conta como "quase"', sw('accentStrict'))}
      </section>

      <section class="card" style="margin-top:12px"><div class="eyebrow" style="margin-bottom:4px">Aparência e sensações</div>
        ${row('Tema', '', html`<div class="seg">${[['auto', 'Auto'], ['light', 'Claro'], ['dark', 'Escuro']].map(([v, l]) => html`<button class="${s.theme === v ? 'on' : ''}" data-act="theme" data-v="${v}">${l}</button>`)}</div>`)}
        ${row('Efeitos sonoros', '', sw('sfx'))}
        ${row('Vibração', 'No celular', sw('haptics'))}
      </section>

      <section class="card" style="margin-top:12px"><div class="eyebrow" style="margin-bottom:4px">Tutor com IA</div>
        ${row('Modelo', '', html`<select class="field" style="max-width:220px;height:42px" data-set="tutorModel">${MODELS.map(([id, n]) => html`<option value="${id}" ${s.tutorModel === id ? 'selected' : ''}>${n}</option>`)}</select>`)}
        ${row('Chave da API', s.tutorKey ? `Salva neste navegador (…${s.tutorKey.slice(-4)})` : 'Não configurada', s.tutorKey ? html`<button class="btn btn-danger btn-sm" data-act="delKey">${icon('trash')} Remover</button>` : html`<a class="btn btn-soft btn-sm" href="#/tutor">Configurar</a>`)}
      </section>

      <section class="card" style="margin-top:12px"><div class="eyebrow" style="margin-bottom:4px">App & Dados</div>
        ${row('Protetor de Ofensiva', `${st.streakFreezes || 0} guardado(s) de no máximo 2`, html`<div class="row" style="gap:6px">
          ${(st.streakFreezes || 0) < 2 ? html`<button class="btn btn-soft btn-sm" data-act="buyFreeze">Comprar (100 XP)</button>` : html`<span class="tiny good">Cheio ✓</span>`}</div>`)}
        ${row('Instalar o Pont', window.matchMedia('(display-mode: standalone)').matches ? 'Já está rodando como app instalado ✓' : 'Ícone na tela inicial, abre em tela cheia e funciona offline',
      window.__pontInstall ? html`<button class="btn btn-primary btn-sm" data-act="install">${icon('phone')} Instalar</button>` : html`<span class="tiny faint" style="max-width:150px">No iPhone: Compartilhar → Adicionar à Tela de Início</span>`)}
        ${row('Backup do progresso', `${Object.keys(st.cards || {}).length} palavras salvas · ${st.xp} XP acumulado`, html`<div class="row wrap" style="gap:6px">
          <button class="btn btn-ghost btn-sm" data-act="copyBackup" title="Copiar texto JSON">${icon('layers')} Copiar</button>
          <button class="btn btn-ghost btn-sm" data-act="export">${icon('download')} Baixar</button>
          <label class="btn btn-ghost btn-sm" style="cursor:pointer">${icon('upload')} Importar<input type="file" accept="application/json,.json" id="imp" hidden></label></div>`)}
        ${row('Zerar progresso', 'Apaga cartões, XP e histórico. Mantém os ajustes.', html`<button class="btn btn-danger btn-sm" data-act="reset">${icon('trash')} Zerar</button>`)}
      </section>

      <p class="tiny faint center" style="margin-top:18px">Pont · FSRS-5 · voz ${ttsSupported ? '✓' : '✗'} · reconhecimento ${sttSupported ? '✓' : '✗'} · seus dados ficam só neste aparelho</p>`);
  };

  root.addEventListener('change', (e) => {
    const key = e.target.dataset.set;
    if (e.target.id === 'imp' && e.target.files[0]) {
      e.target.files[0].text().then((t) => { importJSON(t); applyTheme(); toast('Backup restaurado ✓', { type: 'ok' }); draw(); })
        .catch((err) => toast(`Não deu para importar: ${err.message}`, { type: 'err' }));
      return;
    }
    if (!key) return;
    if (key === 'name') { getState().profile.name = e.target.value.trim(); save(); return; }
    const v = e.target.type === 'checkbox' ? e.target.checked : NUMERIC.has(key) ? +e.target.value : e.target.value;
    setSetting(key, v);
    if (key === 'rate' || key === 'retention' || key === 'dialect') draw();
  });
  root.addEventListener('input', (e) => {
    if (e.target.type === 'range') e.target.closest('.setting').querySelector('.small').textContent =
      e.target.dataset.set === 'rate' ? `${Math.round(e.target.value * 100)}%` : `${Math.round(e.target.value * 100)}% — mais alto = revisões mais frequentes`;
  });

  actions(root, {
    test: () => speak('Bonjour ! Je suis votre voix française. On apprend ensemble ?'),
    theme: (el) => { setSetting('theme', el.dataset.v); applyTheme(); draw(); },
    delKey: () => { setSetting('tutorKey', ''); toast('Chave removida.'); draw(); },
    install: async () => {
      const p = window.__pontInstall;
      if (!p) return;
      p.prompt();
      await p.userChoice;
      window.__pontInstall = null;
      draw();
    },
    export: () => {
      const blob = new Blob([exportJSON()], { type: 'application/json' });
      const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `pont-backup-${new Date().toISOString().slice(0, 10)}.json` });
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    },
    copyBackup: () => {
      navigator.clipboard?.writeText(exportJSON())
        .then(() => toast('Backup copiado para a área de transferência! ✓', { type: 'ok' }))
        .catch(() => toast('Não foi possível copiar automaticamente.', { type: 'err' }));
    },
    buyFreeze: () => {
      const res = buyStreakFreeze(100);
      toast(res.msg, { type: res.ok ? 'ok' : 'err' });
      if (res.ok) draw();
    },
    reset: () => {
      if (!confirm('Zerar todo o progresso? Isso não pode ser desfeito (a não ser que você tenha um backup).')) return;
      resetProgress();
      toast('Progresso zerado.');
      draw();
    },
  });

  const onInstallable = () => draw();
  window.addEventListener('pont:installable', onInstallable);
  draw();
  voicesReady.then(() => { if (document.contains(root)) draw(); });
  return () => window.removeEventListener('pont:installable', onInstallable);
}
