// Service worker do Pont: funciona offline e se atualiza sozinho.
const VERSION = 'pont-v4.0.0';
const CORE = [
  './', 'index.html', 'manifest.webmanifest',
  'css/base.css', 'css/components.css',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png',
  'js/app.js', 'js/store.js', 'js/fsrs.js', 'js/speech.js', 'js/ui.js', 'js/srs.js', 'js/markup.js', 'js/practice.js',
  'js/achievements.js', 'js/search.js',
  'js/data/duo-lessons.js',
  'js/data/guide.js',
  'js/data/decks.js', 'js/data/vocab-1.js', 'js/data/vocab-2.js', 'js/data/vocab-3.js', 'js/data/vocab-4.js', 'js/data/vocab-5.js',
  'js/data/lessons.js', 'js/data/lessons-1.js', 'js/data/lessons-2.js', 'js/data/lessons-3.js', 'js/data/lessons-4.js',
  'js/data/sounds.js', 'js/data/verbs.js', 'js/data/bridges.js', 'js/data/phrases.js', 'js/data/stories.js',
  'js/views/home.js', 'js/views/learn.js', 'js/views/guide.js', 'js/views/welcome.js', 'js/views/lessons.js', 'js/views/review.js', 'js/views/decks.js',
  'js/views/speak.js', 'js/views/shadow.js', 'js/views/listen.js', 'js/views/verbs.js', 'js/views/bridges.js',
  'js/views/phrases.js', 'js/views/tutor.js', 'js/views/explore.js', 'js/views/settings.js',
  'js/views/speed.js', 'js/views/reader.js', 'js/views/stats.js',
];
const RUNTIME = `${VERSION}-runtime`;
const CDN = /^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net)\//;

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (e) => { if (e.data === 'skip-waiting') self.skipWaiting(); });

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Fontes e SDK de CDN: usa o cache e atualiza em segundo plano
  if (CDN.test(req.url)) {
    e.respondWith(staleWhileRevalidate(req, RUNTIME));
    return;
  }
  if (url.origin !== location.origin) return;

  // Navegação: rede primeiro com fallback para cache
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(staleWhileRevalidate(req, VERSION));
});

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req, { ignoreSearch: true });
  const net = fetch(req).then((res) => {
    if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
    return res;
  }).catch(() => null);
  return hit || (await net) || new Response('Offline', { status: 503, statusText: 'Offline' });
}
