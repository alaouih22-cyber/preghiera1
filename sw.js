// sw.js
const CACHE_NAME = 'mp-bastia-v2';

// Assicurati che questi nomi file siano ESATTAMENTE presenti nella tua cartella
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
            // Usiamo un ciclo per non far fallire tutto se un file manca
            return Promise.allSettled(
                assetsToCache.map(url => cache.add(url))
            );
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Fetch obbligatorio per PWA
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Messaggi per notifiche (Invariato)
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const options = {
            body: event.data.body,
            icon: '1000087707.png',
            badge: '1000087707.png',
            vibrate: [500, 110, 500],
            tag: 'prayer-notif',
            renotify: true,
            data: { url: './index.html' }
        };
        event.waitUntil(self.registration.showNotification(event.data.title, options));
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            if (clientList.length > 0) return clientList[0].focus();
            return clients.openWindow('./index.html');
        })
    );
});
