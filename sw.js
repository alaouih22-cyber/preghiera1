const CACHE_NAME = 'muslim-pro-audio-v2';

self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

// GESTIONE NOTIFICHE E AUDIO
self.addEventListener('push', event => {
    const options = {
        body: 'È il momento della preghiera. Clicca per ascoltare l\'Adhan.',
        icon: 'https://cdn-icons-png.flaticon.com/512/2798/2798007.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/2798/2798007.png',
        vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40],
        actions: [
            { action: 'play_adhan', title: '🔊 Ascolta Adhan' },
            { action: 'close', title: 'Chiudi' }
        ],
        data: { url: './index.html' },
        tag: 'prayer-notification',
        renotify: true
    };

    event.waitUntil(
        self.registration.showNotification('Muslim Pro - Bastia Umbra', options)
    );
});

// AZIONE AL CLIC (Indispensabile per l'audio su Android)
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'play_adhan' || !event.action) {
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
                // Se l'app è aperta, la mettiamo in focus e facciamo partire l'audio
                for (const client of clientList) {
                    if (client.url.includes('index.html') && 'focus' in client) {
                        return client.focus().then(c => c.postMessage({ action: 'FORCE_PLAY_ADHAN' }));
                    }
                }
                // Se l'app è chiusa, la apriamo e passiamo il comando
                if (clients.openWindow) {
                    return clients.openWindow('./index.html?play=true');
                }
            })
        );
    }
});

// CACHING AUDIO (Mantengo intatto il tuo sistema attuale)
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
                });
            })
        );
    }
});
