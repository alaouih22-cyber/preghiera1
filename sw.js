const CACHE_NAME = 'muslim-pro-bastia-v2026';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './1000087707.png',
  'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'
];

// INSTALL
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

// ACTIVATE
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// FETCH (cache-first + network fallback)
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached =>
      cached || fetch(event.request).catch(() => caches.match('./index.html'))
    )
  );
});

// NOTIFICATION CLICK
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./');
    })
  );
});
