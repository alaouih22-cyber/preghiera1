const CACHE_NAME = 'muslim-pro-audio-v1';

self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

// GESTIONE PUSH - Configurato come Allarme/Sveglia
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : { title: 'Muslim Pro', body: 'È il momento della preghiera' };
    
    const options = {
        body: data.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/2798/2798007.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/2798/2798007.png',
        
        // --- CONFIGURAZIONE SVEGLIA ---
        vibrate: [500, 200, 500, 200, 500, 200, 800], // Vibrazione insistente tipo sveglia
        tag: 'adhan-alarm', // Sovrascrive la precedente per non intasare
        renotify: true,
        requireInteraction: true, // La notifica non scompare finché non la tocchi
        priority: 2, // Massima priorità per Android (High Priority)
        
        actions: [
            { action: 'play_adhan', title: '🔊 APRI E ASCOLTA ADHAN' },
            { action: 'close', title: 'CHIUDI' }
        ],
        data: { url: './index.html' }
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});

// GESTORE CLIC (Sblocca l'audio forzatamente)
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            for (const client of clientList) {
                if (client.url.includes('index.html') && 'focus' in client) {
                    // Invia il comando all'HTML che hai già pronto
                    return client.focus().then(c => c.postMessage({ action: 'FORCE_PLAY_ADHAN' }));
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('./index.html?play=true');
            }
        })
    );
});

// GESTIONE FETCH (Invariata per il tuo caching)
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
