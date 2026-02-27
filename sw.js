const CACHE_NAME = 'muslim-pro-audio-v1';

self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

// GESTIONE NOTIFICA COME SVEGLIA PRIORITARIA
self.addEventListener('push', event => {
    const options = {
        body: 'È il momento della preghiera. Tocca per ascoltare l\'Adhan.',
        icon: 'https://cdn-icons-png.flaticon.com/512/2798/2798007.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/2798/2798007.png',
        vibrate: [500, 200, 500, 200, 800], 
        tag: 'adhan-alarm',
        renotify: true,
        requireInteraction: true, // Come una sveglia: resta finché non premi
        priority: 2,
        actions: [
            { action: 'play_adhan', title: '🔊 APRI E ASCOLTA ADHAN' }
        ],
        data: { url: './index.html' }
    };
    event.waitUntil(self.registration.showNotification('Muslim Pro - Bastia Umbra', options));
});

// CLIC SULLA NOTIFICA: Sblocca l'audio e parla con l'index.html
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            for (const client of clientList) {
                if (client.url.includes('index.html') && 'focus' in client) {
                    return client.focus().then(c => c.postMessage({ action: 'FORCE_PLAY_ADHAN' }));
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('./index.html?play=true');
            }
        })
    );
});

// IL TUO CACHING ORIGINALE (Invariato)
self.addEventListener('fetch', event => {
    const url = event.request.url;
    if (url.endsWith('.mp3')) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) return cachedResponse;
                return fetch(event.request, {
                    mode: 'cors',
                    credentials: 'omit',
                    headers: { 'Accept': 'audio/mpeg' }
                }).then(networkResponse => {
                    if (networkResponse.ok) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return networkResponse;
                }).catch(() => {
                    return fetch('./fallback-adhan.mp3');
                });
            })
        );
    }
});
