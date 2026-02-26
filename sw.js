const CACHE_NAME = 'muslim-pro-audio-v1';

// Installazione: l'app si prende il controllo subito
self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

// GESTIONE FETCH CON CACHING AUDIO
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
