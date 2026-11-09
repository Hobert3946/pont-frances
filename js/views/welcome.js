// Boas-vindas: entrada amigável, simples e direta estilo Duolingo.
import { getState, save } from '../store.js';
import { speak } from '../speech.js';
import { html, mount, actions, icon, $, confetti, sfx } from '../ui.js';

export default function render(root) {
  const st = getState();
  let selectedMode = 'zero';

  const draw = () => mount(root, html`
    <div style="max-width:560px;margin:30px auto 60px;padding:0 16px">
      <!-- Cabeçalho Acolhedor -->
      <header style="text-align:center;margin-bottom:28px">
        <div style="display:inline-flex;align-items:center;justify-content:center;width:60px;height:60px;border-radius:18px;background:var(--primary-soft);border:1px solid rgba(34,197,94,0.3);margin-bottom:16px">
          <span style="font-size:1.8rem">🇫🇷</span>
        </div>
        <div class="row center" style="justify-content:center;gap:8px;margin-bottom:10px">
          <span class="tag ok">MÉTODO FÁCIL & PRÁTICO</span>
          <span class="small muted">Do zero ao básico</span>
        </div>
        <h1 class="h1" style="font-size:clamp(1.8rem, 1.4rem + 1.8vw, 2.3rem);margin-bottom:10px;font-weight:750">
          Aprenda Francês de Verdade
        </h1>
        <p class="small muted" style="max-width:46ch;margin:0 auto;line-height:1.6;font-size:1rem">
          Aulas interativas curtas de 2 minutos. Pratique a pronúncia no microfone, ouça nativos e fixe o que aprendeu sem decoreba.
        </p>
      </header>

      <!-- Cartão Principal de Início -->
      <div class="card stack" style="padding:28px 24px;border-color:rgba(34,197,94,0.35);background:var(--surface)">
        <!-- Campo de Nome -->
        <div>
          <label class="lbl" for="nm" style="font-size:0.95rem;font-weight:600;margin-bottom:8px;display:block">
            Como devemos te chamar?
          </label>
          <input id="nm" class="field" maxlength="30" placeholder="Digite seu primeiro nome..." value="${st.profile.name || ''}" style="font-size:1.05rem;padding:14px 16px">
          <span class="tiny faint" style="display:block;margin-top:6px">Seu progresso fica salvo com segurança neste dispositivo.</span>
        </div>

        <!-- Escolha de Ponto de Partida -->
        <div style="margin-top:10px">
          <label class="lbl" style="font-size:0.95rem;font-weight:600;margin-bottom:10px;display:block">
            Qual é o seu nível atual?
          </label>
          <div class="stack-sm">
            <button class="opt ${selectedMode === 'zero' ? 'right' : ''}" data-act="pickMode" data-m="zero" style="padding:16px;gap:14px">
              <span style="font-size:1.6rem">🌱</span>
              <div class="grow text-left" style="text-align:left">
                <div class="row between" style="width:100%">
                  <b style="color:var(--text-strong);font-size:1.05rem">Começar do Zero Absoluto</b>
                  <span class="tag ok">RECOMENDADO</span>
                </div>
                <div class="small muted" style="margin-top:4px">Primeiras palavras (Bonjour, Merci, Oui) com áudio e pronúncia guiada.</div>
              </div>
            </button>

            <button class="opt ${selectedMode === 'basic' ? 'right' : ''}" data-act="pickMode" data-m="basic" style="padding:16px;gap:14px">
              <span style="font-size:1.6rem">🚀</span>
              <div class="grow text-left" style="text-align:left">
                <b style="color:var(--text-strong);font-size:1.05rem">Já conheço algumas palavras</b>
                <div class="small muted" style="margin-top:4px">Ir para frases do dia a dia, perguntas e situações práticas de viagem.</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Botão Principal de Ação -->
        <div style="margin-top:16px">
          <button class="btn btn-primary btn-lg btn-block" data-act="startLearning" style="padding:16px 24px;font-size:1.08rem">
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
