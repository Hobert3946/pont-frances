// Utilitários de interface: templates seguros, ícones, toasts, confete, sons e afins.
import { settings } from './store.js';

/* ---------- templates com escape automático ---------- */
class Raw { constructor(s) { this.s = s; } toString() { return this.s; } }
export const raw = (s) => new Raw(String(s));
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (v) => (v == null || typeof v === 'boolean' ? '' : v instanceof Raw ? v.s : Array.isArray(v) ? v.map(fmt).join('') : esc(v));
export function html(strings, ...vals) {
  let out = strings[0];
  for (let i = 0; i < vals.length; i++) out += fmt(vals[i]) + strings[i + 1];
  return new Raw(out);
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
export function mount(root, content) { root.innerHTML = String(content); return root; }

/** Delegação de cliques: <button data-act="x"> chama handlers.x(el, evento). */
export function actions(root, handlers) {
  root.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el || !root.contains(el) || el.disabled) return;
    const fn = handlers[el.dataset.act];
    if (fn) { e.preventDefault(); fn(el, e); }
  });
}

/* ---------- ícones (traço, 24×24) ---------- */
const ICONS = {
  volume: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2.5"/>',
  play: '<path d="M7 4.5v15l12.5-7.5z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  chev: '<path d="m9 18 6-6-6-6"/>',
  back: '<path d="m15 18-6-6 6-6"/>',
  arrow: '<path d="M5 12h14M13 5l7 7-7 7"/>',
  book: '<path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z"/>',
  cards: '<rect x="3" y="7" width="14" height="14" rx="2.5"/><path d="M7 3h11.5A2.5 2.5 0 0 1 21 5.5V17"/>',
  headphones: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  bridge: '<path d="M2 17h20M5 17Q12 6 19 17M8.5 17v-4.2M12 17v-5.8M15.5 17v-4.2"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  sparkles: '<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/><path d="M19 3v4M17 5h4M5 17v4M3 19h4"/>',
  table: '<rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M3 9h18M3 15h18M9 3v18"/>',
  bubble: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>',
  ear: '<path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0"/><path d="M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4"/>',
  waves: '<path d="M2 12h2M6 8v8M10 5v14M14 9v6M18 7v10M22 12h-2"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  flame: '<path d="M12 22c4 0 7-2.7 7-7 0-3-1.6-5.4-3.5-7.3-.3 1.7-1.2 3-2.5 3.6C13.6 7.9 12.4 4.6 9.5 2c.2 3.3-1.4 5.3-3 7.2C5.2 10.8 5 12.5 5 15c0 4.3 3 7 7 7z"/>',
  star: '<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  upload: '<path d="M12 21V9M7 14l5-5 5 5M5 3h14"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  bulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>',
  send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
  shuffle: '<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M12 7v7M9 11l3 3 3-3"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20"/>',
  gauge: '<path d="M12 14l4-4M3.3 19a10 10 0 1 1 17.4 0"/>',
  compass: '<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  chart: '<path d="M18 20V10M12 20V4M6 20v-6"/>',
};
export const icon = (name, cls = '') => raw(`<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`);

export const sayBtn = (text, size = '', label = 'Ouvir em francês') =>
  html`<button type="button" class="say ${size}" data-say="${text}" aria-label="${label}" title="${label}">${icon('volume')}</button>`;
export const tapFr = (text, shown) => html`<span class="fr tap" data-say="${text}">${shown ?? text}</span>`;

export function pageHead(title, { back = '#/explore', sub = '', right = '' } = {}) {
  return html`<header class="page-head">
    <a class="back" href="${back}" aria-label="Voltar">${icon('back')}</a>
    <div class="grow"><h1 class="h2">${title}</h1>${sub ? html`<div class="small muted">${sub}</div>` : ''}</div>
    ${right}
  </header>`;
}

/** Palavras coloridas por acerto: ok / close / miss / extra. */
export const diffView = (words) => html`<div class="diff">${words.map((x) =>
  html`<span class="w ${x.s}" title="${x.typed && x.kind !== 'ok' ? `você escreveu: ${x.typed}` : ''}">${x.w}</span> `)}</div>`;

/* ---------- anel de progresso horológico ---------- */
let ringSeq = 0;
export function ring(pct, { size = 136, sw = 8, label = '' } = {}) {
  const r = (size - sw * 2.6) / 2, outerR = (size - 4) / 2, C = 2 * Math.PI * r, id = `rg${++ringSeq}`, c = size / 2;
  const clamped = Math.max(0, Math.min(1, pct || 0));
  const off = C * (1 - clamped);
  return html`<div class="ring" style="width:${size}px;height:${size}px">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
      <defs>
        <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f7e6ad"/>
          <stop offset="45%" stop-color="#e2bd5a"/>
          <stop offset="100%" stop-color="#b08a2e"/>
        </linearGradient>
      </defs>
      <circle cx="${c}" cy="${c}" r="${outerR}" stroke="rgba(226,189,90,0.35)" stroke-width="4" stroke-dasharray="1.2 ${((2 * Math.PI * outerR) / 60 - 1.2).toFixed(2)}"/>
      <circle class="track" cx="${c}" cy="${c}" r="${r}" stroke-width="${sw}"/>
      <circle class="val" cx="${c}" cy="${c}" r="${r}" stroke-width="${sw}" stroke="url(#${id})" stroke-dasharray="${C}" stroke-dashoffset="${off}" style="--c:${C}"/>
    </svg><div class="label">${label}</div></div>`;
}

/* ---------- teclado de acentos ---------- */
const ACCENTS = ['é', 'è', 'ê', 'ë', 'à', 'â', 'î', 'ï', 'ô', 'û', 'ù', 'ç', 'œ'];
export const accentBar = () =>
  html`<div class="accents" aria-label="Acentos franceses">${ACCENTS.map((a) => html`<button type="button" data-accent="${a}" tabindex="-1">${a}</button>`)}</div>`;

/* ---------- toasts ---------- */
export function toast(msg, { type = 'info', action, onAction, ms = 3200 } = {}) {
  const box = document.getElementById('toasts');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = String(html`<span class="dot"></span><span>${msg}</span>${action ? html`<button type="button">${action}</button>` : ''}`);
  box.append(el);
  const close = () => { el.classList.add('out'); setTimeout(() => el.remove(), 260); };
  el.querySelector('button')?.addEventListener('click', () => { onAction?.(); close(); });
  if (ms) setTimeout(close, ms);
  return close;
}

/* ---------- folha inferior ---------- */
export function sheet(content, { onClose } = {}) {
  const d = document.createElement('dialog');
  d.className = 'sheet';
  d.innerHTML = `<div class="sheet-grip"></div><div class="sheet-body">${content}</div>`;
  document.body.append(d);
  d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
  d.addEventListener('close', () => { onClose?.(); d.remove(); });
  d.showModal();
  return d;
}

/* ---------- confete ---------- */
export function confetti({ count = 150 } = {}) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv = document.getElementById('confetti');
  const g = cv.getContext('2d');
  const W = innerWidth, H = innerHeight, dpr = devicePixelRatio || 1;
  cv.width = W * dpr; cv.height = H * dpr; g.scale(dpr, dpr);
  const colors = ['#fae49d', '#d4af37', '#b8860b', '#ffffff', '#e2e8f0', '#94a3b8'];
  const parts = Array.from({ length: count }, () => ({
    x: W / 2 + (Math.random() - .5) * 120, y: H * .38,
    vx: (Math.random() - .5) * 16, vy: -Math.random() * 14 - 5,
    w: 6 + Math.random() * 6, h: 9 + Math.random() * 8,
    r: Math.random() * Math.PI, vr: (Math.random() - .5) * .35,
    color: colors[(Math.random() * colors.length) | 0],
  }));
  const t0 = performance.now(), LIFE = 2800;
  const tick = (now) => {
    const t = now - t0;
    g.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.vy += .36; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      g.save();
      g.globalAlpha = Math.max(0, 1 - t / LIFE);
      g.translate(p.x, p.y); g.rotate(p.r);
      g.fillStyle = p.color;
      g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)) + 1);
      g.restore();
    }
    if (t < LIFE) requestAnimationFrame(tick); else g.clearRect(0, 0, W, H);
  };
  requestAnimationFrame(tick);
}

/* ---------- sons sintetizados e vibração ---------- */
let actx = null;
function tone(freqs, { dur = .14, type = 'sine', gain = .07, gap = .08 } = {}) {
  if (!settings().sfx) return;
  try {
    actx ||= new (window.AudioContext || window.webkitAudioContext)();
    const t0 = actx.currentTime + .01;
    freqs.forEach((f, i) => {
      const o = actx.createOscillator(), v = actx.createGain(), t = t0 + i * gap;
      o.type = type; o.frequency.value = f;
      v.gain.setValueAtTime(0, t);
      v.gain.linearRampToValueAtTime(gain, t + .012);
      v.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(v).connect(actx.destination);
      o.start(t); o.stop(t + dur + .03);
    });
  } catch { /* áudio indisponível */ }
}
export const sfx = {
  ok: () => tone([659.3, 987.8], { type: 'triangle', dur: .18 }),
  bad: () => tone([233, 185], { dur: .2, gap: .1, gain: .06 }),
  done: () => tone([523.3, 659.3, 784, 1046.5], { type: 'triangle', dur: .26, gap: .09 }),
  fanfare: () => tone([523.3, 659.3, 784, 1046.5], { type: 'triangle', dur: .26, gap: .09 }),
  tap: () => tone([880], { dur: .05, gain: .025 }),
};

/* ---------- iluminação especular interativa (Awwwards spotlight) ---------- */
if (typeof window !== 'undefined') {
  window.addEventListener('pointermove', (e) => {
    const el = e.target.closest?.('.card, .tile, .bento-item, .sound, .item');
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });
}
export function haptic(pattern = 12) {
  if (settings().haptics && navigator.vibrate) try { navigator.vibrate(pattern); } catch { /* sem vibração */ }
}

/* ---------- miudezas ---------- */
export function shuffle(a) {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0;[r[i], r[j]] = [r[j], r[i]]; }
  return r;
}
export const sample = (a, n) => shuffle(a).slice(0, n);
export const pick = (a) => a[(Math.random() * a.length) | 0];
export const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
export const frDate = (d = new Date()) => new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);

/** Número estável por dia — para "palavra do dia" e afins. */
export function daySeed(offset = 0) {
  const d = new Date();
  return d.getFullYear() * 1000 + Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5) + offset;
}
export const pickDaily = (arr, offset = 0) => arr[((daySeed(offset) * 2654435761) >>> 0) % arr.length];
