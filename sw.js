// sw.js
const CACHE_NAME = 'muslim-pro-v1';
const assets = [
  "./",
  "./index.html",
  "./manifest.json",
  "./1000087707.png"
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(assets))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Questo evento è fondamentale per rendere l'app installabile
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const data = event.data;
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '1000087707.png',
            badge: '1000087707.png',
            vibrate: [500, 110, 500, 110, 450],
            tag: 'prayer-notif'
        });
    }
});
