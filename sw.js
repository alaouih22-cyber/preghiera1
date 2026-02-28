const CACHE_NAME = 'mp-bastia-v4';
const assets = [
  'index.html',
  'manifest.json',
  '1000087707.png'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(assets);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((res) => {
            return res || fetch(event.request);
        })
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const options = {
            body: event.data.body,
            icon: '1000087707.png',
            badge: '1000087707.png',
            vibrate: [500, 110, 500],
            tag: 'prayer-notif'
        };
        event.waitUntil(self.registration.showNotification(event.data.title, options));
    }
});
