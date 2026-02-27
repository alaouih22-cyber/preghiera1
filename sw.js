const CACHE_NAME = 'muslim-pro-audio-v1';

// Installazione: l'app si prende il controllo subito
self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

// --- NUOVO: LOGICA SVEGLIA (Aggiunta senza modificare il resto) ---
self.addEventListener('push', event => {
    const options = {
        body: 'È il momento della preghiera. Tocca per ascoltare l\'Adhan.',
        icon: 'https://cdn-icons-png.flaticon.com/512/2798/2798007.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/2798/2798007.png',
        
        // Caratteristiche "Sveglia Google"
        vibrate: [500, 200, 500, 200, 500, 200, 500, 200, 800], // Vibrazione continua
        tag: 'adhan-alarm', // Identifica la notifica come allarme
        renotify: true,
        requireInteraction: true, // Non scompare finché non la premi
        priority: 2, // Forza la comparsa sopra altre app
        
        actions: [
            { action: 'play_adhan', title: '🔊 APRI E ASCOLTA ADHAN' }
        ],
        data: { url: './index.html' }
    };

    event.waitUntil(self.registration.showNotification('Muslim Pro - Bastia Umbra', options));
});

// Gestore clic per attivare l'audio nell'HTML
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

// GESTIONE FETCH CON CACHING AUDIO (Invariato come da tua richiesta)
self.addEventListener('fetch', event => {
    const url = event.request.url;

    // Gestiamo solo i file MP3
    if (url.endsWith('.mp3')) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                // 1. Se il file è già in cache, lo usiamo subito (velocissimo)
                if (cachedResponse) {
                    return cachedResponse;
                }

                // 2. Altrimenti lo scarichiamo con le impostazioni CORS corrette
                return fetch(event.request, {
                    mode: 'cors',
                    credentials: 'omit',
                    headers: { 'Accept': 'audio/mpeg' }
                }).then(networkResponse => {
                    // Se lo scaricamento va a buon fine, salviamo una copia in cache
                    if (networkResponse.ok) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return networkResponse;
                }).catch(() => {
                    // 3. Se fallisce tutto (offline), proviamo il fallback locale
                    return fetch('./fallback-adhan.mp3');
                });
            })
        );
    }
});
