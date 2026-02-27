const CACHE_NAME = 'muslim-pro-audio-v1';

self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

// 1. IL MOTORE DELLE NOTIFICHE: Forza il sistema a trattarle come sveglie
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Muslim Pro - Bastia Umbra';
    const message = data.body || 'È il momento della preghiera';

    const options = {
        body: message,
        icon: 'https://cdn-icons-png.flaticon.com/512/2798/2798007.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/2798/2798007.png',
        
        // CONFIGURAZIONE HARDWARE (Sveglia)
        vibrate: [500, 200, 500, 200, 500, 200, 800], 
        tag: 'prayer-alarm', // Sovrascrive la precedente per non accumulare
        renotify: true,
        
        // CONFIGURAZIONE PRIORITÀ (Inganna Android)
        requireInteraction: true, // La notifica resta fissa finché non agisci
        priority: 2,              // Livello "High/Max"
        importance: 'high',       // Specifica per alcuni browser Android
        
        actions: [
            { action: 'play_now', title: '🔊 ASCOLTA ADHAN SUBITO' },
            { action: 'close', title: 'CHIUDI' }
        ],
        data: { 
            url: './index.html?play=true',
            timestamp: Date.now()
        }
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// 2. IL GESTORE DEL CLIC: Il momento in cui l'audio viene sbloccato
self.addEventListener('notificationclick', event => {
    event.notification.close();

    // Se l'utente preme il tasto o la notifica, apriamo/focalizziamo l'app
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            // Se l'app è già aperta in background, la portiamo in primo piano e spariamo l'audio
            for (const client of clientList) {
                if (client.url.includes('index.html') && 'focus' in client) {
                    return client.focus().then(c => {
                        c.postMessage({ action: 'FORCE_PLAY_ADHAN' });
                    });
                }
            }
            // Se l'app era chiusa, la apriamo con il parametro per l'auto-play
            if (clients.openWindow) {
                return clients.openWindow('./index.html?play=true');
            }
        })
    );
});

// 3. IL TUO SISTEMA DI CACHING (Invariato e protetto)
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
