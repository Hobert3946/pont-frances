// Widget de prática de fala: ouvir o nativo, gravar, ver a nota e ouvir a própria voz.
import { sttSupported, canCapture, listen, stopListening, startCapture, scoreSpeech, sttErrorMessage } from './speech.js';
import { html, icon, diffView, toast, sfx, haptic } from './ui.js';

export function scoreColor(s) { return s >= .85 ? 'var(--green)' : s >= .6 ? 'var(--gold)' : 'var(--red)'; }
export function scoreLabel(s) { return s >= .95 ? 'Parfait !' : s >= .85 ? 'Excelente!' : s >= .6 ? 'Quase lá' : 'Tente de novo'; }

/** Monta a prática dentro de `el`. onResult(res) recebe { score, words, said }. */
export function mountPractice(el, target, { onResult } = {}) {
  let busy = false, mine = null, last = null, cap = null;

  const draw = () => {
    el.innerHTML = String(html`<div class="mic-wrap">
      <div class="row" style="gap:16px">
        <button class="say lg" data-say="${target}" title="Ouvir a pronúncia nativa" aria-label="Ouvir nativo">${icon('volume')}</button>
        <button class="mic ${busy ? 'live' : ''}" data-p="rec" ${sttSupported ? '' : 'disabled'} aria-label="${busy ? 'Parar' : 'Gravar'}">${icon(busy ? 'stop' : 'mic')}</button>
        <button class="say lg" data-p="mine" ${mine ? '' : 'disabled'} style="${mine ? '' : 'opacity:.35'}" title="Ouvir minha voz" aria-label="Ouvir minha gravação">${icon('user')}</button>
      </div>
      ${canCapture ? html`<canvas class="meter"></canvas>` : ''}
      <div class="live-text">${busy ? 'Ouvindo…' : ''}</div>
      ${last ? html`<div class="row" style="gap:16px;align-items:center;justify-content:center;flex-wrap:wrap">
          <div class="score" style="--p:${last.score * 100};--c:${scoreColor(last.score)}"><span>${Math.round(last.score * 100)}</span></div>
          <div style="max-width:420px"><div class="h3" style="color:${scoreColor(last.score)}">${scoreLabel(last.score)}</div>
            ${diffView(last.words)}
            <div class="tiny faint">Entendi: “${last.said || '…'}”</div></div>
        </div>`
        : html`<div class="small faint center">${sttSupported ? 'Ouça, toque no microfone e repita em voz alta.' : 'Reconhecimento de voz indisponível aqui — use Chrome ou Edge. Você ainda pode ouvir e repetir.'}</div>`}
    </div>`);
  };

  async function record() {
    if (busy) { stopListening(); return; }
    busy = true; draw();
    const live = el.querySelector('.live-text');
    try {
      if (canCapture) cap = await startCapture(el.querySelector('.meter')).catch(() => null);
      const r = await listen({ onInterim: (t) => { live.textContent = t; } });
      const url = await cap?.stop();
      cap = null;
      if (url) { if (mine) URL.revokeObjectURL(mine); mine = url; }
      if (!r.transcript) { busy = false; draw(); return toast('Não ouvi nada. Fale mais perto do microfone.'); }
      last = scoreSpeech(target, r.alternatives);
      last.score >= .85 ? sfx.ok() : last.score < .6 ? sfx.bad() : null;
      haptic(last.score >= .85 ? 12 : 25);
      busy = false; draw();
      onResult?.(last);
    } catch (e) {
      await cap?.stop(); cap = null;
      busy = false; draw();
      toast(sttErrorMessage(e), { type: 'err' });
    }
  }

  el.onclick = (e) => {
    const b = e.target.closest('[data-p]');
    if (!b || b.disabled) return;
    if (b.dataset.p === 'rec') record();
    if (b.dataset.p === 'mine' && mine) new Audio(mine).play();
  };
  draw();
  return { stop: () => { stopListening(); cap?.stop(); } };
}
