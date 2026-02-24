const CACHE_NAME = 'mushaf-v1';
const assets = [
  './',
  './index.html',
  'https://cdn-icons-png.flaticon.com/512/2319/2319830.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
