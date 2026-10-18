/* Service worker Lisible : application disponible hors ligne, mises à jour en arrière-plan.
   Les appels /api (IA) et Supabase passent toujours par le réseau. */
const VERSION = 'lisible-v3';
const SHELL = [
  '/', '/index.html', '/review.html', '/confidentialite.html', '/conditions.html', '/mentions-legales.html', '/legal.css', '/manifest.webmanifest',
  '/support.js', '/api.js', '/extract.js', '/store.js', '/no-tics.js', '/ai-adapter.js', '/exporters.js', '/i18n.js', '/auth-adapter.js',
  '/vendor/supabase.js', '/vendor/react.production.min.js', '/vendor/react-dom.production.min.js', '/fonts/fonts.css', '/icons/icon.svg', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/favicon-32.png',
];
const CDN = [];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const put = (req, res) => { if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); } return res; };

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === self.location.origin;
  if (same && url.pathname.startsWith('/api/')) return;           // IA : réseau uniquement
  if (!same && !CDN.includes(url.hostname)) return;                // Supabase et autres : réseau uniquement

  if (req.mode === 'navigate' || (same && /\.html$|\/$/.test(url.pathname))) {
    // Pages : réseau d'abord (dernière version), cache si hors ligne.
    e.respondWith(fetch(req).then(res => put(req, res)).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('/index.html'))));
    return;
  }
  if (!same) {
    // Bibliothèques et polices versionnées : cache d'abord.
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => put(req, res))));
    return;
  }
  // Scripts et images de l'application : réponse immédiate depuis le cache, mise à jour en arrière-plan.
  e.respondWith(caches.match(req).then(cached => {
    const net = fetch(req).then(res => put(req, res)).catch(() => cached);
    return cached || net;
  }));
});
