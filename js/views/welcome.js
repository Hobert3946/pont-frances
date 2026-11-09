// Boas-vindas: entrada amigável, simples e direta estilo Duolingo.
import { getState, save } from '../store.js';
import { speak } from '../speech.js';
import { html, mount, actions, icon, $, confetti, sfx } from '../ui.js';

export default function render(root) {
  const st = getState();
  let selectedMode = 'zero';

  const draw = () => mount(root, html`
    <div style="max-width:580px;margin:20px auto 60px;padding:0 12px">
      <!-- Cabeçalho Acolhedor -->
      <header class="text-center" style="text-align:center;margin-bottom:28px">
        <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:20px;background:var(--grad-soft);border:1px solid var(--line-gold);margin-bottom:14px;box-shadow:0 0 24px rgba(226,189,90,0.25)">
          <span style="font-size:2rem">✨</span>
        </div>
        <div class="mast-meta" style="justify-content:center;margin-bottom:6px">
          <span class="mast-issue">APRENDA DO ZERO</span>
          <span class="mast-sep">◆</span>
          <span class="mast-date">MÉTODO FÁCIL & PRÁTICO</span>
        </div>
        <h1 class="h1" style="font-size:clamp(1.8rem, 1.3rem + 2vw, 2.5rem);margin-bottom:10px">
          Aprenda Francês <span class="grad-text">do Básico</span><em>.</em>
        </h1>
        <p class="small muted" style="max-width:48ch;margin:0 auto;line-height:1.6">
          Aulas interativas curtas de 2 minutos. Ouça os nativos, treine a pronúncia no microfone e fixe o que aprendeu sem esforço.
        </p>
      </header>

      <!-- Cartão Principal de Início -->
      <div class="card glow pad-lg stack" style="background:linear-gradient(180deg, rgba(226,189,90,0.08) 0%, rgba(14,16,21,0.95) 100%), var(--surface);border-color:rgba(226,189,90,0.35)">
        <!-- Campo de Nome -->
        <div>
          <label class="lbl" for="nm" style="font-size:0.95rem;font-weight:600;margin-bottom:6px;display:block">
            Como devemos te chamar?
          </label>
          <input id="nm" class="field" maxlength="30" placeholder="Digite seu primeiro nome..." value="${st.profile.name || ''}" style="font-size:1.05rem;padding:14px 16px">
          <span class="tiny faint" style="display:block;margin-top:4px">Seu progresso fica salvo com segurança no seu aparelho.</span>
        </div>

        <!-- Escolha de Ponto de Partida -->
        <div style="margin-top:8px">
          <label class="lbl" style="font-size:0.95rem;font-weight:600;margin-bottom:8px;display:block">
            Qual é o seu nível atual?
          </label>
          <div class="stack-sm">
            <button class="opt ${selectedMode === 'zero' ? 'right' : ''}" data-act="pickMode" data-m="zero" style="padding:16px;gap:14px">
              <span style="font-size:1.6rem">🌱</span>
              <div class="grow text-left" style="text-align:left">
                <div class="row between" style="width:100%">
                  <b style="color:#fff;font-size:1.05rem">Começar do Zero Absoluto</b>
                  <span class="tag ok">RECOMENDADO</span>
                </div>
                <div class="small muted" style="margin-top:3px">Primeiras palavras (Bonjour, Merci, Oui) com áudio e pronúncia guiada.</div>
              </div>
            </button>

            <button class="opt ${selectedMode === 'basic' ? 'right' : ''}" data-act="pickMode" data-m="basic" style="padding:16px;gap:14px">
              <span style="font-size:1.6rem">🚀</span>
              <div class="grow text-left" style="text-align:left">
                <b style="color:#fff;font-size:1.05rem">Já conheço algumas palavras</b>
                <div class="small muted" style="margin-top:3px">Ir para frases, perguntas e situações práticas de viagem.</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Botão Principal de Ação -->
        <div style="margin-top:14px">
          <button class="btn btn-primary btn-lg btn-block" data-act="startLearning" style="padding:16px 24px;font-size:1.1rem">
            Começar Lição 1 Agora (2 min) ${icon('arrow')}
          </button>
        </div>
      </div>

      <!-- Demonstração Rápida de Áudio -->
      <div class="row center" style="margin-top:20px;justify-content:center">
        <button class="btn btn-ghost btn-sm" data-act="quickAudio">
          ${icon('volume')} Ouvir saudação nativa: « Bienvenue ! »
        </button>
      </div>
    </div>
  `);

  draw();

  actions(root, {
    quickAudio: () => speak("Bienvenue ! On commence ?"),

    pickMode: (el) => {
      selectedMode = el.dataset.m;
      st.profile.name = $('#nm', root)?.value.trim() || st.profile.name;
      draw();
    },

    startLearning: () => {
      const name = $('#nm', root)?.value.trim() || 'Aventureiro';
      st.profile.name = name;
      st.profile.level = selectedMode;
      st.profile.onboarded = true;
      st.settings.newPerDay = 10;
      st.duoLessons = st.duoLessons || {};
      save();

      sfx.done();
      confetti();

      // Leva direto para a primeira lição interativa estilo Duolingo!
      location.hash = selectedMode === 'zero' ? '#/learn/1' : '#/learn';
    },
  });
}
