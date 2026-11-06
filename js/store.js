// Estado persistente do app (localStorage). Pequeno e síncrono de propósito.
const KEY = 'pont:v1';

const DEFAULTS = {
  version: 1,
  createdAt: 0,
  profile: { name: '', onboarded: false, level: 'zero' },
  settings: {
    theme: 'auto',        // auto | light | dark
    voiceURI: '',         // voz francesa escolhida ('' = melhor disponível)
    dialect: 'fr-FR',     // fr-FR | fr-CA | fr-BE | fr-CH
    rate: 0.95,
    autoplay: true,
    newPerDay: 12,
    dailyGoal: 60,        // XP por dia
    retention: 0.9,       // retenção-alvo do FSRS
    sfx: true,
    haptics: true,
    accentStrict: false,  // exigir acentos exatos ao digitar
    tutorKey: '',
    tutorModel: 'claude-opus-5-5',
  },
  xp: 0,
  days: {},      // 'AAAA-MM-DD' → { xp, reviews, news, lessons, minutes }
  cards: {},     // id → cartão FSRS
  lessons: {},   // id → { best, at }
  sounds: {},    // id → { best, at }
  decks: [],     // decks ativos, na ordem de estudo
  counters: {},  // contadores livres (ditados, frases faladas…)
};

const clone = (o) => JSON.parse(JSON.stringify(o));

function merge(base, saved) {
  for (const k of Object.keys(saved || {})) {
    const nested = k === 'settings' || k === 'profile';
    base[k] = nested ? { ...base[k], ...saved[k] } : saved[k];
  }
  return base;
}

function load() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY)); } catch { /* sem dados */ }
  const s = merge(clone(DEFAULTS), saved || {});
  if (!s.createdAt) s.createdAt = Date.now();
  return s;
}

let state = load();

export const getState = () => state;
export const settings = () => state.settings;

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch (e) { console.warn('Pont: não foi possível salvar', e); }
  window.dispatchEvent(new CustomEvent('pont:change'));
}

export function update(fn) { fn(state); save(); }
export function setSetting(key, value) { state.settings[key] = value; save(); }

export function dayKey(d = new Date()) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function today() {
  const k = dayKey();
  if (!state.days[k]) state.days[k] = { xp: 0, reviews: 0, news: 0, lessons: 0, minutes: 0 };
  return state.days[k];
}

export function addXP(n, kind) {
  const d = today();
  state.xp += n;
  d.xp += n;
  if (kind) d[kind] = (d[kind] || 0) + 1;
  save();
  window.dispatchEvent(new CustomEvent('pont:xp', { detail: n }));
}

export function bump(counter, n = 1) {
  state.counters[counter] = (state.counters[counter] || 0) + n;
  save();
}

export function addMinutes(min) {
  today().minutes = +(today().minutes + min).toFixed(2);
  save();
}

/** Dias seguidos com atividade. Hoje só conta depois do primeiro XP. */
export function streak() {
  const d = new Date();
  if (!(state.days[dayKey(d)]?.xp > 0)) d.setDate(d.getDate() - 1);
  let n = 0;
  while (state.days[dayKey(d)]?.xp > 0) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

export function bestStreak() {
  const keys = Object.keys(state.days).filter((k) => state.days[k].xp > 0).sort();
  let best = 0, run = 0, prev = null;
  for (const k of keys) {
    const t = new Date(k + 'T12:00:00').getTime();
    run = prev && Math.round((t - prev) / 864e5) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = t;
  }
  return best;
}

export const getCard = (id) => state.cards[id];
export function putCard(id, card) { state.cards[id] = card; save(); }

/** Backup sem a chave da API (para não vazar ao compartilhar o arquivo). */
export function exportJSON() {
  const copy = clone(state);
  copy.settings.tutorKey = '';
  copy.exportedAt = new Date().toISOString();
  return JSON.stringify(copy);
}

export function importJSON(text) {
  const data = JSON.parse(text);
  if (!data || typeof data !== 'object' || !data.settings || !data.cards) throw new Error('Arquivo de backup inválido');
  const key = state.settings.tutorKey;
  state = merge(clone(DEFAULTS), data);
  if (!state.settings.tutorKey) state.settings.tutorKey = key;
  save();
}

export function resetProgress() {
  const { settings: st, profile } = state;
  state = clone(DEFAULTS);
  state.createdAt = Date.now();
  state.settings = st;
  state.profile = profile;
  save();
}
