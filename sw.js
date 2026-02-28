// sw.js
const CACHE_NAME = 'mp-bastia-v3'; // Cambiato v2 in v3 per forzare il browser

const assetsToCache = [
  './',
  './index.html',
  './manifest.json',
  './1000087707.png'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.allSettled(
                assetsToCache.map(url => cache.add(url))
            );
        })
    );
});

self.addEventListener('activate', (event) => {
    // Rimuove le vecchie cache per evitare errori
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) { return caches.delete(key); }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Gestione notifiche invariata
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const options = {
            body: event.data.body,
            icon: '1000087707.png',
            badge: '1000087707.png',
            vibrate: [500, 110, 500],
            tag: 'prayer-notif',
            data: { url: './index.html' }
        };
        event.waitUntil(self.registration.showNotification(event.data.title, options));
    }
});
