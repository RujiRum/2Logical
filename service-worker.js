const CACHE = '2logical-id-v1';
const ASSETS = [
  './', './index.html', './manifest.webmanifest',
  './assets/badge-front.png', './assets/badge-back.png', './assets/logo.png',
  './assets/icon-180.png', './assets/icon-192.png', './assets/icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request).then(resp => {
    const clone = resp.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, clone));
    return resp;
  }).catch(() => caches.match('./index.html'))));
});
