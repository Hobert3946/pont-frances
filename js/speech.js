// Voz: síntese (TTS), reconhecimento (STT), captura do microfone e pontuação.
import { settings } from './store.js';

/* =================== Síntese de voz =================== */
const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
let voices = [];
const loadVoices = () => (voices = synth ? synth.getVoices() : []);

export const ttsSupported = !!synth;
export const voicesReady = new Promise((resolve) => {
  if (!synth) return resolve([]);
  if (loadVoices().length) return resolve(voices);
  const done = () => resolve(loadVoices());
  synth.addEventListener?.('voiceschanged', done, { once: true });
  setTimeout(done, 2000);
});
synth?.addEventListener?.('voiceschanged', loadVoices);

const isFr = (v) => /^fr([-_]|$)/i.test(v.lang);
function voiceScore(v, dialect) {
  let s = 0;
  if (/natural|neural|online|premium|enhanced|wavenet/i.test(v.name)) s += 20; // vozes neurais primeiro
  if (/google/i.test(v.name)) s += 8;
  if (v.lang.replace('_', '-').toLowerCase() === dialect.toLowerCase()) s += 6;
  if (/fr[-_]fr/i.test(v.lang)) s += 2;
  return s;
}

export function frenchVoices() {
  const dialect = settings().dialect || 'fr-FR';
  return voices.filter(isFr).sort((a, b) => voiceScore(b, dialect) - voiceScore(a, dialect));
}
export function currentVoice() {
  const fr = frenchVoices();
  return fr.find((v) => v.voiceURI === settings().voiceURI) || fr[0] || null;
}
export function randomVoice() {
  const fr = frenchVoices();
  return fr[Math.floor(Math.random() * fr.length)] || null;
}

/** Limpa marcações de dicionário antes de falar: "(f.)", "qqn", barras… */
export function speakable(text) {
  return String(text)
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\bqqn\b/g, "quelqu'un").replace(/\bqqch\b/g, 'quelque chose')
    .replace(/\s*\/\s*/g, ', ')
    .replace(/\s*[→—–]\s*/g, ', ')
    .replace(/…|\.\.\./g, ' ')
    .replace(/\s+/g, ' ').trim();
}

let speakToken = 0;
export function speak(text, opts = {}) {
  return new Promise((resolve) => {
    if (!synth || !text) return resolve(false);
    const token = ++speakToken;
    const busy = synth.speaking || synth.pending;
    synth.cancel();
    synth.resume?.();
    const u = new SpeechSynthesisUtterance(speakable(text));
    const v = opts.voice || currentVoice();
    if (v) { u.voice = v; u.lang = v.lang; } else u.lang = settings().dialect || 'fr-FR';
    u.rate = opts.rate ?? settings().rate ?? 1;
    u.onend = () => resolve(token === speakToken);
    u.onerror = () => resolve(false);
    // o Chrome às vezes "engole" a fala se speak() vier colado num cancel()
    busy ? setTimeout(() => synth.speak(u), 70) : synth.speak(u);
  });
}
export function stopSpeaking() { speakToken++; synth?.cancel(); }

/* =================== Reconhecimento de voz =================== */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
export const sttSupported = !!SR;
let rec = null;

export function listen({ lang, onInterim } = {}) {
  return new Promise((resolve, reject) => {
    if (!SR) return reject(new Error('unsupported'));
    stopListening();
    const r = new SR();
    r.lang = lang || settings().dialect || 'fr-FR';
    r.interimResults = true;
    r.maxAlternatives = 5;
    r.continuous = false;
    let finals = [], interim = '', failed = null;
    r.onresult = (e) => {
      finals = []; interim = '';
      for (const res of e.results) res.isFinal ? finals.push(res) : (interim += res[0].transcript);
      const text = [...finals.map((f) => f[0].transcript), interim].join(' ').replace(/\s+/g, ' ').trim();
      if (text) onInterim?.(text);
    };
    r.onerror = (e) => { if (!['no-speech', 'aborted'].includes(e.error)) failed = e.error; };
    r.onend = () => {
      rec = null;
      if (failed) return reject(new Error(failed));
      let alts = [];
      if (finals.length === 1) alts = Array.from(finals[0], (a) => ({ transcript: a.transcript.trim(), confidence: a.confidence }));
      else if (finals.length > 1) alts = [{ transcript: finals.map((f) => f[0].transcript).join(' ').trim(), confidence: 0 }];
      else if (interim.trim()) alts = [{ transcript: interim.trim(), confidence: 0 }];
      resolve({ transcript: alts[0]?.transcript || '', alternatives: alts });
    };
    rec = r;
    try { r.start(); } catch (err) { rec = null; reject(err); }
  });
}
export function stopListening() { try { rec?.stop(); } catch { /* já parado */ } }
export const isListening = () => !!rec;

export function sttErrorMessage(err) {
  const code = String(err?.message || err);
  return ({
    'not-allowed': 'Permita o acesso ao microfone para treinar a fala.',
    'service-not-allowed': 'Permita o acesso ao microfone para treinar a fala.',
    'audio-capture': 'Nenhum microfone encontrado.',
    network: 'O reconhecimento de voz precisa de internet.',
    unsupported: 'Este navegador não reconhece voz. Use Chrome ou Edge.',
    'language-not-supported': 'Francês indisponível no reconhecimento deste navegador.',
  })[code] || 'Não consegui ouvir. Tente de novo.';
}

/* =================== Microfone: onda ao vivo + gravação =================== */
export const canCapture = !!navigator.mediaDevices?.getUserMedia && !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

export async function startCapture(canvas) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const an = ctx.createAnalyser();
  an.fftSize = 1024;
  ctx.createMediaStreamSource(stream).connect(an);
  const data = new Uint8Array(an.fftSize);
  const g = canvas?.getContext('2d');
  let raf = 0;
  const draw = () => {
    raf = requestAnimationFrame(draw);
    if (!g) return;
    const dpr = devicePixelRatio || 1, w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== Math.round(w * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
    an.getByteTimeDomainData(data);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const grad = g.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#4f5bff'); grad.addColorStop(.5, '#8a4fff'); grad.addColorStop(1, '#ff4f74');
    g.fillStyle = grad;
    const bars = 42, step = Math.floor(data.length / bars), bw = w / bars;
    for (let i = 0; i < bars; i++) {
      let peak = 0;
      for (let k = 0; k < step; k++) peak = Math.max(peak, Math.abs(data[i * step + k] - 128));
      const bh = Math.min(h, Math.max(3, (peak / 128) * h * 1.8));
      g.beginPath();
      g.roundRect ? g.roundRect(i * bw + bw * .22, (h - bh) / 2, bw * .56, bh, 3) : g.rect(i * bw + bw * .22, (h - bh) / 2, bw * .56, bh);
      g.fill();
    }
  };
  draw();
  let recorder = null;
  const chunks = [];
  if (window.MediaRecorder) {
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    recorder.start();
  }
  return {
    async stop() {
      cancelAnimationFrame(raf);
      let url = null;
      if (recorder && recorder.state !== 'inactive') {
        await new Promise((r) => { recorder.onstop = r; recorder.stop(); });
        if (chunks.length) url = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType || 'audio/webm' }));
      }
      stream.getTracks().forEach((t) => t.stop());
      ctx.close();
      g?.clearRect(0, 0, canvas.width, canvas.height);
      return url;
    },
  };
}

/* =================== Comparação de textos =================== */
const NUMS = {
  0: 'zéro', 1: 'un', 2: 'deux', 3: 'trois', 4: 'quatre', 5: 'cinq', 6: 'six', 7: 'sept', 8: 'huit', 9: 'neuf',
  10: 'dix', 11: 'onze', 12: 'douze', 13: 'treize', 14: 'quatorze', 15: 'quinze', 16: 'seize', 20: 'vingt',
  30: 'trente', 40: 'quarante', 50: 'cinquante', 60: 'soixante', 100: 'cent', 1000: 'mille',
};
const stripAccents = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

export function lev(a, b) {
  if (a === b) return 0;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}

/** Alinhamento genérico (edição mínima) entre duas sequências. */
function align(a, b, sub) {
  const n = a.length, m = b.length;
  const D = Array.from({ length: n + 1 }, (_, i) => { const r = new Array(m + 1).fill(0); r[0] = i; return r; });
  for (let j = 0; j <= m; j++) D[0][j] = j;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) D[i][j] = Math.min(D[i - 1][j] + 1, D[i][j - 1] + 1, D[i - 1][j - 1] + sub(a[i - 1], b[j - 1]));
  }
  const ops = [];
  let i = n, j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && Math.abs(D[i][j] - (D[i - 1][j - 1] + sub(a[i - 1], b[j - 1]))) < 1e-9) { ops.push(['sub', i - 1, j - 1]); i--; j--; }
    else if (i > 0 && Math.abs(D[i][j] - (D[i - 1][j] + 1)) < 1e-9) { ops.push(['del', i - 1, -1]); i--; }
    else { ops.push(['ins', -1, j - 1]); j--; }
  }
  return { dist: D[n][m], ops: ops.reverse() };
}

/** Chave fonética aproximada do francês: homófonos (vert, verre, vers) viram a mesma chave. */
export function phoneticKey(word) {
  let w = String(word).toLowerCase().replace(/[’']/g, '').replace(/ç/g, 's').replace(/[œæ]/g, 'e')
    .replace(/^\d+$/, (n) => NUMS[n] ?? n);
  w = stripAccents(w).replace(/[^a-z]/g, '');
  if (!w) return '';
  return w
    .replace(/^h/, '')
    .replace(/eaux?|aux?/g, 'o')
    .replace(/ph/g, 'f')
    .replace(/qu|q/g, 'k')
    .replace(/ch/g, 'S').replace(/gn/g, 'N')
    .replace(/c(?=[eiy])/g, 's').replace(/c/g, 'k')
    .replace(/g(?=[eiy])/g, 'j').replace(/gu(?=[eiy])/g, 'g')
    .replace(/(?<=[aeiouy])s(?=[aeiouy])/g, 'z')
    .replace(/oi/g, 'wa').replace(/ou/g, 'U')
    .replace(/(?<=.{3})er$/, 'e')
    .replace(/(?<=.)[sxtdzp]+$/, '')
    .replace(/ng$/, 'n')
    .replace(/(ain|ein|aim|in|im|un|um|yn)(?![aeiouy])/g, 'I')
    .replace(/(an|am|en|em)(?![aeiouy])/g, 'A')
    .replace(/(on|om)(?![aeiouy])/g, 'O')
    .replace(/eu/g, 'E').replace(/ai|ei/g, 'e').replace(/y/g, 'i')
    .replace(/(?<=..)e$/, '')
    .replace(/h/g, '')
    .replace(/([a-zA-Z])\1+/g, '$1');
}

function charScore(target, said, keyFn) {
  const words = target.split(/\s+/).filter(Boolean);
  const T = [], owner = [];
  words.forEach((w, wi) => { for (const ch of keyFn(w)) { T.push(ch); owner.push(wi); } });
  const S = [...said.split(/\s+/).map(keyFn).join('')];
  const { dist, ops } = align(T, S, (x, y) => (x === y ? 0 : 1));
  const hit = words.map(() => 0), tot = words.map(() => 0);
  owner.forEach((w) => tot[w]++);
  for (const [op, i, j] of ops) if (op === 'sub' && T[i] === S[j]) hit[owner[i]]++;
  const list = words.map((w, k) => {
    const r = tot[k] ? hit[k] / tot[k] : 1;
    return { w, s: r >= .8 ? 'ok' : r >= .45 ? 'close' : 'miss' };
  });
  return { score: T.length ? Math.max(0, 1 - dist / T.length) : 0, words: list };
}

const plainKey = (w) => stripAccents(String(w).toLowerCase().replace(/[’']/g, '')).replace(/[^a-z0-9]/g, '');

/** Compara o que foi dito com a frase-alvo. Usa a melhor das alternativas do reconhecedor. */
export function scoreSpeech(target, alternatives) {
  let best = { score: 0, said: '', words: charScore(target, '', plainKey).words.map((x) => ({ ...x, s: 'miss' })) };
  for (const alt of alternatives || []) {
    for (const fn of [phoneticKey, plainKey]) {
      const r = charScore(target, alt.transcript, fn);
      if (r.score > best.score) best = { ...r, said: alt.transcript };
    }
  }
  return best;
}

/* ---------- respostas digitadas (ditado, produção, quiz) ---------- */
const PUNCT = /[.,!?;:«»"“”()…–—¿¡]/g;
const tokens = (t) => String(t).replace(/[’`´]/g, "'").replace(PUNCT, ' ').split(/\s+/).filter(Boolean);
const bare = (s) => stripAccents(s.toLowerCase()).replace(/œ/g, 'oe');

function classify(a, b) {
  const x = a.toLowerCase(), y = b.toLowerCase();
  if (x === y) return 'ok';
  if (bare(x) === bare(y)) return 'accent';
  if (x.length >= 4 && lev(bare(x), bare(y)) <= 1) return 'typo';
  return 'miss';
}
const COST = { ok: 0, accent: .3, typo: .6, miss: 1.2 };

export function compareTyped(target, typed, { strictAccents = false } = {}) {
  const A = tokens(target), B = tokens(typed);
  const { ops } = align(A, B, (a, b) => COST[classify(a, b)]);
  const words = [];
  let good = 0, extras = 0;
  for (const [op, i, j] of ops) {
    if (op === 'sub') {
      const kind = classify(A[i], B[j]);
      words.push({ w: A[i], typed: B[j], kind, s: kind === 'ok' ? 'ok' : kind === 'miss' ? 'miss' : 'close' });
      good += { ok: 1, accent: strictAccents ? .5 : 1, typo: .5, miss: 0 }[kind];
    } else if (op === 'del') words.push({ w: A[i], kind: 'missing', s: 'miss' });
    else { words.push({ w: B[j], kind: 'extra', s: 'extra' }); extras++; }
  }
  const okKinds = strictAccents ? ['ok'] : ['ok', 'accent'];
  const perfect = words.every((x) => okKinds.includes(x.kind));
  return {
    words, perfect,
    accentOnly: !perfect && words.every((x) => x.kind === 'ok' || x.kind === 'accent'),
    score: Math.max(0, (good - extras * .5) / Math.max(1, A.length)),
  };
}

/** Testa contra várias respostas aceitas ("a | b") e devolve a melhor. */
export function checkAnswer(accepted, typed, opts) {
  const list = String(accepted).split('|').map((s) => s.trim()).filter(Boolean);
  return list.map((a) => ({ ...compareTyped(a, typed, opts), target: a }))
    .sort((x, y) => (y.perfect - x.perfect) || (y.score - x.score))[0];
}
