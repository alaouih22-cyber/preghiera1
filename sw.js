// sw.js
const CACHE_NAME = 'muslim-pro-bastia-v1';
const assetsToCache = [
  './',
  './index.html',
  './manifest.json',
  './1000087707.png'
];

// Installazione: salva i file necessari per l'offline
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(assetsToCache);
        })
    );
});

// Attivazione: pulizia vecchie cache
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Fetch: OBBLIGATORIO per rendere l'app installabile
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Gestione Notifiche (rimasta invariata come richiesto)
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const data = event.data;
        const options = {
            body: data.body,
            icon: '1000087707.png',
            badge: '1000087707.png',
            vibrate: [500, 110, 500, 110, 450],
            tag: 'prayer-notif',
            renotify: true,
            requireInteraction: true,
            data: { url: './index.html' }
        };
        event.waitUntil(self.registration.showNotification(data.title, options));
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
