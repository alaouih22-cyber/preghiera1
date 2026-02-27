const CACHE_NAME = 'muslim-pro-audio-v1';

// Installazione: l'app si prende il controllo subito
self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

// --- NUOVO: GESTIONE NOTIFICHE PUSH ---
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : { title: 'Muslim Pro', body: 'È il momento della preghiera' };
    const options = {
        body: data.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/2798/2798007.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/2798/2798007.png',
        vibrate: [200, 100, 200],
        data: { url: './index.html' }
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
});

// --- NUOVO: CLIC SULLA NOTIFICA PER APRIRE L'APP ---
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clientList => {
            if (clientList.length > 0) return clientList[0].focus();
            return clients.openWindow('./index.html');
        })
    );
});

// GESTIONE FETCH CON CACHING AUDIO (Invariato come da tua richiesta)
self.addEventListener('fetch', event => {
    const url = event.request.url;
    if (url.endsWith('.mp3')) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
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
