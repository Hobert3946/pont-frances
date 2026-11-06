// Tutor com IA (Claude): role-play por voz ou texto, com correções em português.
// A chave da API fica só neste navegador (BYOK) e as chamadas vão direto para a API da Anthropic.
import { settings, setSetting, addXP, bump } from '../store.js';
import { speak, stopSpeaking, listen, stopListening, sttSupported, sttErrorMessage } from '../speech.js';
import { html, mount, actions, icon, pageHead, toast, accentBar, $ } from '../ui.js';

const SDK_URL = 'https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@1.3.0/+esm';

export const MODELS = [
  ['claude-opus-5-5', 'Claude Opus 5.5', 'Melhor qualidade · US$ 4 / 20 por milhão de tokens'],
  ['claude-sonnet-5-5', 'Claude Sonnet 5.5', 'Ótimo e mais barato · US$ 2 / 10'],
  ['claude-haiku-5-5', 'Claude Haiku 5.5', 'Rápido e baratíssimo · US$ 0,10 / 0,50'],
];

const SCENES = [
  ['libre', '💬', 'Conversa livre', 'a relaxed chat about the learner\'s life, work and interests'],
  ['cafe', '☕', 'No café', 'a waiter at a Parisian café taking the learner\'s order'],
  ['entretien', '💼', 'Entrevista em TI', 'a recruiter interviewing the learner for an IT support/developer job in Lyon'],
  ['support', '🛠️', 'Suporte técnico', 'a stressed office worker whose computer is not working; the learner is the IT technician helping'],
  ['hotel', '🏨', 'No hotel', 'a hotel receptionist checking the learner in, with a small problem in the room'],
  ['rue', '🗺️', 'Pedindo direções', 'a friendly Parisian passer-by; the learner is lost and asks for directions'],
  ['medecin', '🩺', 'No médico', 'a general practitioner asking about the learner\'s symptoms'],
  ['soiree', '🥂', 'Festa com amigos', 'a talkative French person meeting the learner at a party, using casual spoken French'],
];

function systemPrompt(scene, level, name) {
  return `You are Camille, a warm, encouraging French conversation partner. You are role-playing this scene: ${scene[3]}.
The learner${name ? ` (${name})` : ''} is Brazilian (native Portuguese, advanced English), learning French at CEFR level ${level}.

How to reply:
- Write your in-character reply in French only, in 1 to 3 short sentences matched to level ${level}. At A1/A2 use simple, frequent words and the present tense; at B1/B2 speak naturally, including common spoken forms.
- Keep the scene moving and usually end with a question, so the learner has to answer.
- Then write a line containing only "---", followed by feedback in Brazilian Portuguese on the learner's last message: if it had mistakes, give the corrected French sentence and a one-line explanation, linking to Portuguese or English when that helps (false friends, gender, partitive, etc.). If it was correct, say so briefly and, when useful, offer a more natural way a French person would say it.
- On your very first turn there is no learner message yet: after "---", give one short tip in Portuguese about how to answer.
- Plain text only: no markdown, no lists, no emojis inside the French part. Never use "---" anywhere else.`;
}

let sdkPromise = null;
const loadSdk = () => (sdkPromise ||= import(SDK_URL));

export default function render(root) {
  let scene = SCENES[0], level = 'A2', history = [], shown = [], busy = false, handsfree = false, stream = null;

  const keyView = () => mount(root, html`
    ${pageHead('Tutor com IA', { back: '#/explore', sub: 'Conversa real, por voz, com correções' })}
    <section class="card hero glow pad-lg stack">
      <div class="h3">Conecte sua chave da API da Anthropic</div>
      <p class="small muted">O tutor usa o Claude. Crie uma chave em <a class="tap" href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">console.anthropic.com</a> e cole abaixo. Ela fica salva só neste navegador e é enviada apenas para a API da Anthropic. Os custos aparecem na sua conta.</p>
      <input id="key" class="field" type="password" autocomplete="off" placeholder="sk-ant-…">
      <label class="lbl" for="mdl">Modelo</label>
      <select id="mdl" class="field">${MODELS.map(([id, n, d]) => html`<option value="${id}" ${settings().tutorModel === id ? 'selected' : ''}>${n} — ${d}</option>`)}</select>
      <button class="btn btn-primary btn-lg" data-act="saveKey">${icon('key')} Salvar e começar</button>
      <p class="tiny faint">Use uma chave só para isto e com limite de gastos. Para remover: Ajustes → Tutor com IA.</p>
    </section>`);

  const msgHtml = (m) => {
    if (m.role === 'me') return html`<div class="msg me">${m.text}</div>`;
    const [reply, ...rest] = m.text.split(/\n?-{3,}\n?/);
    const corr = rest.join(' ').trim();
    return html`<div class="msg ai">
      <div class="fr-text">${reply.trim() || html`<span class="typing"><i></i><i></i><i></i></span>`}</div>
      ${corr ? html`<div class="corr ${/^✓|perfeito|correto|certinho/i.test(corr) ? 'good' : ''}">${corr}</div>` : ''}
      ${m.done && reply.trim() ? html`<div class="tools"><button class="btn btn-ghost btn-sm" data-say="${reply.trim()}">${icon('volume')} Ouvir</button>
        <button class="btn btn-ghost btn-sm" data-say="${reply.trim()}" data-rate=".7">${icon('gauge')} Devagar</button></div>` : ''}
    </div>`;
  };

  const drawChat = () => {
    $('#chat', root).innerHTML = String(html`${shown.map(msgHtml)}`);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const chatView = () => {
    mount(root, html`
      ${pageHead('Tutor com IA', { back: '#/explore', sub: `${scene[1]} ${scene[2]} · nível ${level}`, right: html`<button class="btn btn-ghost btn-sm" data-act="reset">${icon('refresh')} Nova</button>` })}
      <div class="chips" style="margin-bottom:10px">${SCENES.map((s) => html`<button class="chip ${s === scene ? 'on' : ''}" data-act="scene" data-id="${s[0]}">${s[1]} ${s[2]}</button>`)}</div>
      <div class="row wrap between" style="margin-bottom:14px">
        <div class="seg">${['A1', 'A2', 'B1', 'B2'].map((l) => html`<button class="${l === level ? 'on' : ''}" data-act="level" data-l="${l}">${l}</button>`)}</div>
        ${sttSupported ? html`<label class="row small" style="gap:8px">Conversa por voz <span class="switch"><input type="checkbox" id="hf" ${handsfree ? 'checked' : ''}><span></span></span></label>` : ''}
      </div>
      <div class="chat" id="chat"></div>
      <div class="composer">
        ${sttSupported ? html`<button class="mic" data-act="mic" aria-label="Falar">${icon('mic')}</button>` : ''}
        <textarea id="say" rows="1" placeholder="Responda em francês…" autocapitalize="sentences"></textarea>
        <button class="btn btn-primary btn-icon" data-act="send" aria-label="Enviar">${icon('send')}</button>
      </div>
      <details style="margin-top:10px"><summary class="tiny faint" style="cursor:pointer">Acentos</summary>${accentBar()}</details>`);
    drawChat();
  };

  async function ask(userText) {
    if (busy) return;
    busy = true;
    if (userText) {
      shown.push({ role: 'me', text: userText });
      history.push({ role: 'user', content: userText });
      addXP(2, 'tutor');
      bump('tutorMessages');
    } else {
      history.push({ role: 'user', content: '(Começar a cena.)' });
    }
    const ai = { role: 'ai', text: '', done: false };
    shown.push(ai);
    drawChat();
    try {
      const { Anthropic } = await loadSdk();
      const client = new Anthropic({ apiKey: settings().tutorKey, dangerouslyAllowBrowser: true });
      const model = settings().tutorModel;
      const params = {
        model,
        max_tokens: 16000,
        system: systemPrompt(scene, level, ''),
        messages: history,
        output_config: { effort: 'low' }, // conversa: respostas rápidas e curtas
      };
      // Fallback no servidor caso um filtro de segurança recuse (não existe para o Haiku 5.5).
      if (model !== 'claude-haiku-5-5') Object.assign(params, { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' });
      stream = client.beta.messages.stream(params);
      let last = 0;
      stream.on('text', (delta) => {
        ai.text += delta;
        if (performance.now() - last > 60) { last = performance.now(); drawChat(); }
      });
      const final = await stream.finalMessage();
      stream = null;
      if (final.stop_reason === 'refusal') {
        ai.text = 'Désolée, je ne peux pas continuer sur ce sujet.\n---\nO modelo recusou esta mensagem. Tente reformular ou mude de cena.';
        history.pop(); // tira a mensagem recusada, para a conversa poder seguir
      } else {
        history.push({ role: 'assistant', content: final.content }); // devolvido intacto nas próximas chamadas
      }
      ai.done = true;
      drawChat();
      const reply = ai.text.split(/\n?-{3,}\n?/)[0].trim();
      busy = false;
      if (reply && (settings().autoplay || handsfree)) {
        await speak(reply);
        if (handsfree && document.contains(root) && !busy) startMic();
      }
    } catch (e) {
      stream = null;
      busy = false;
      if (!document.contains(root)) return; // saiu da tela (stream abortado)
      shown.pop();
      history.pop();
      if (userText) shown.pop();
      if (document.contains(root) && $('#chat', root)) drawChat();
      const status = e?.status;
      const msg = status === 401 ? 'Chave da API inválida. Confira em Ajustes.'
        : status === 429 ? 'Limite de uso atingido. Espere um pouco e tente de novo.'
        : status === 529 || status >= 500 ? 'O serviço está sobrecarregado. Tente em instantes.'
        : !navigator.onLine || e?.name === 'APIConnectionError' ? 'Sem conexão com a internet.'
        : `Erro: ${e?.message || e}`;
      toast(msg, { type: 'err', ms: 5000 });
      if (status === 401) { setSetting('tutorKey', ''); keyView(); }
      const box = $('#say', root);
      if (userText && box) box.value = userText;
    }
  }

  async function startMic() {
    const mic = root.querySelector('[data-act="mic"]');
    if (!mic || busy) return;
    stopSpeaking();
    mic.classList.add('live');
    const box = $('#say', root);
    try {
      const r = await listen({ onInterim: (t) => { box.value = t; } });
      mic.classList.remove('live');
      if (r.transcript) { box.value = ''; ask(r.transcript); }
    } catch (e) {
      mic.classList.remove('live');
      toast(sttErrorMessage(e), { type: 'err' });
    }
  }

  const begin = () => { history = []; shown = []; chatView(); ask(''); };

  actions(root, {
    saveKey: () => {
      const k = $('#key', root).value.trim();
      if (!k.startsWith('sk-ant-')) return toast('A chave começa com "sk-ant-".', { type: 'err' });
      setSetting('tutorKey', k);
      setSetting('tutorModel', $('#mdl', root).value);
      begin();
    },
    scene: (el) => { if (busy) return; scene = SCENES.find((s) => s[0] === el.dataset.id); begin(); },
    level: (el) => { if (busy) return; level = el.dataset.l; begin(); },
    reset: () => { if (!busy) begin(); },
    send: () => { const v = $('#say', root).value.trim(); if (v && !busy) { $('#say', root).value = ''; ask(v); } },
    mic: (el) => (el.classList.contains('live') ? stopListening() : startMic()),
  });
  root.addEventListener('change', (e) => { if (e.target.id === 'hf') { handsfree = e.target.checked; if (handsfree && !busy) startMic(); } });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && e.target.id === 'say') { e.preventDefault(); root.querySelector('[data-act="send"]').click(); }
  });
  root.addEventListener('input', (e) => { if (e.target.id === 'say') { e.target.style.height = 'auto'; e.target.style.height = `${Math.min(140, e.target.scrollHeight)}px`; } });

  if (!settings().tutorKey) keyView(); else begin();
  return () => { stream?.abort?.(); stopListening(); stopSpeaking(); handsfree = false; };
}
