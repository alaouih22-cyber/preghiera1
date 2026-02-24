const CACHE_NAME = 'ramadan-v1';
const assets = [
  './',
  './index.html',
  'https://cdn-icons-png.flaticon.com/512/2319/2319830.png',
  'https://www.islamcan.com/audio/adhan/azan1.mp3'
];

// Installa il Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Gestisce le richieste offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
