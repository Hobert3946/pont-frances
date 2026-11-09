// Casca do app: roteador, tema, barra superior, atalhos globais e service worker.
import { getState, settings, streak, addMinutes } from './store.js';
import { speak, stopSpeaking, stopListening, voicesReady } from './speech.js';
import { initSearch } from './search.js';
import { checkAchievements } from './achievements.js';
import { $, html, icon, toast } from './ui.js';

/* ---------- tema ---------- */
const darkMq = matchMedia('(prefers-color-scheme: dark)');
export function applyTheme() {
  const t = settings().theme;
  const dark = t === 'dark' || (t === 'auto' && darkMq.matches);
  document.documentElement.dataset.theme = t;
  document.documentElement.dataset.scheme = dark ? 'dark' : 'light';
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', dark ? '#06070a' : '#f5f2eb'));
}
darkMq.addEventListener?.('change', applyTheme);

/* ---------- rotas ---------- */
const ROUTES = {
  '': 'home', welcome: 'welcome', guide: 'guide', trilha: 'guide', lessons: 'lessons', lesson: 'lessons', review: 'review', decks: 'decks', deck: 'decks',
  speak: 'speak', sound: 'speak', shadow: 'shadow', listen: 'listen', verbs: 'verbs', verb: 'verbs',
  bridges: 'bridges', phrases: 'phrases', tutor: 'tutor', explore: 'explore', settings: 'settings',
  speed: 'speed', reader: 'reader', stats: 'stats',
};
const TABS = { '': 'home', welcome: 'home', guide: 'guide', trilha: 'guide', lessons: 'lessons', lesson: 'lessons', review: 'review', decks: 'review', deck: 'review', speak: 'speak', sound: 'speak', shadow: 'speak', settings: '', speed: 'explore', reader: 'explore', stats: 'explore', explore: 'explore' };

const view = document.getElementById('view');
let cleanup = null;
let navSeq = 0;

async function route() {
  const seq = ++navSeq;
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  let name = ROUTES[parts[0] ?? ''] !== undefined ? (parts[0] ?? '') : '';
  if (!getState().profile.onboarded && name === '') name = 'welcome';
  const params = parts.slice(1);

  stopSpeaking();
  stopListening();
  if (typeof cleanup === 'function') { try { cleanup(); } catch (e) { console.warn(e); } }
  cleanup = null;

  let mod;
  try { mod = await import(`./views/${ROUTES[name]}.js`); }
  catch (e) { console.error(e); return showError('Não consegui carregar esta tela.'); }
  if (seq !== navSeq) return; // o usuário já navegou para outro lugar

  const page = document.createElement('div');
  page.className = 'page';
  view.replaceChildren(page);
  window.scrollTo(0, 0);
  document.querySelectorAll('.tabbar a').forEach((a) => {
    const on = a.dataset.tab === (TABS[name] ?? 'explore');
    a.classList.toggle('active', on);
    on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
  });
  try { cleanup = (await mod.default(page, params, name)) || null; }
  catch (e) { console.error(e); showError('Algo deu errado nesta tela.'); }
  view.focus({ preventScroll: true });
}

function showError(msg) {
  view.innerHTML = String(html`<div class="page"><div class="card empty"><div class="big">😕</div><p>${msg}</p>
    <a class="btn btn-soft" href="#/">${icon('back')} Voltar ao início</a></div></div>`);
}

/* ---------- barra superior e badge de revisões ---------- */
function refreshTop() {
  const chip = $('#streakChip');
  chip.querySelector('b').textContent = streak();
  chip.classList.toggle('on', (getState().days[todayKey()]?.xp || 0) > 0);
  $('#xpChip b').textContent = getState().xp.toLocaleString('pt-BR');
}
const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

let badgeTimer = 0;
function refreshBadge() {
  clearTimeout(badgeTimer);
  badgeTimer = setTimeout(async () => {
    const { dueCount } = await import('./srs.js');
    const n = dueCount();
    const b = $('#dueBadge');
    b.hidden = !n;
    b.textContent = n > 99 ? '99+' : n;
    // Badging API: número no ícone do app instalado
    if (n) navigator.setAppBadge?.(n).catch(() => { }); else navigator.clearAppBadge?.().catch(() => { });
  }, 350);
}

window.addEventListener('pont:change', () => { refreshTop(); refreshBadge(); checkAchievements(); });
window.addEventListener('pont:xp', () => {
  const c = $('#xpChip');
  c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
  checkAchievements();
});

/* ---------- toque para ouvir: qualquer [data-say] fala em francês ---------- */
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-say]');
  if (!el) return;
  el.classList.add('speaking');
  speak(el.dataset.say, el.dataset.rate ? { rate: +el.dataset.rate } : {}).finally(() => el.classList.remove('speaking'));
});

/* ---------- teclado de acentos: insere no último campo focado ---------- */
let lastField = null;
document.addEventListener('focusin', (e) => {
  if (e.target.matches('input[type="text"], input:not([type]), input[type="search"], textarea')) lastField = e.target;
});
document.addEventListener('mousedown', (e) => { if (e.target.closest('[data-accent]')) e.preventDefault(); });
document.addEventListener('click', (e) => {
  const key = e.target.closest('[data-accent]');
  if (!key || !lastField || !document.contains(lastField)) return;
  const f = lastField;
  const start = f.selectionStart ?? f.value.length, end = f.selectionEnd ?? f.value.length;
  f.setRangeText(key.dataset.accent, start, end, 'end');
  f.focus();
  f.dispatchEvent(new Event('input', { bubbles: true }));
});

/* ---------- tempo de estudo (só conta com o app visível e em uso) ---------- */
let lastTouch = Date.now();
['pointerdown', 'keydown'].forEach((ev) => addEventListener(ev, () => { lastTouch = Date.now(); }, { passive: true }));
setInterval(() => {
  if (document.visibilityState === 'visible' && Date.now() - lastTouch < 90e3) addMinutes(.5);
}, 30e3);

/* ---------- instalação e offline ---------- */
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.__pontInstall = e;
  window.dispatchEvent(new Event('pont:installable'));
});
window.addEventListener('appinstalled', () => toast('Pont instalado! Abra pelo ícone. 🎉', { type: 'ok' }));
window.addEventListener('offline', () => toast('Offline: quase tudo continua funcionando (voz e tutor IA precisam de internet).', { ms: 5000 }));

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  addEventListener('load', async () => {
    try {
      const hadController = !!navigator.serviceWorker.controller;
      const reg = await navigator.serviceWorker.register('./sw.js');
      const offer = (w) => toast('Nova versão do Pont disponível.', { action: 'Atualizar', ms: 0, onAction: () => w.postMessage('skip-waiting') });
      if (reg.waiting && hadController) offer(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const w = reg.installing;
        w?.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) offer(w); });
      });
      let reloaded = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (hadController && !reloaded) { reloaded = true; location.reload(); }
      });
    } catch (e) { console.warn('Service worker:', e); }
  });
}

/* ---------- partida ---------- */
applyTheme();
refreshTop();
refreshBadge();
initSearch();
checkAchievements();
addEventListener('hashchange', route);
route();
voicesReady.then(() => window.dispatchEvent(new Event('pont:voices')));
if (getState().profile.onboarded) navigator.storage?.persist?.().catch(() => { });
