// Installazione e attivazione immediata
self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

// GESTIONE AUDIO OTTIMIZZATA
self.addEventListener('fetch', event => {
    const url = event.request.url;

    // Intercettiamo solo i file MP3
    if (url.endsWith('.mp3')) {
        event.respondWith(
            fetch(event.request, {
                mode: 'cors',
                credentials: 'omit',
                headers: {
                    'Accept': 'audio/mpeg'
                }
            })
            .then(response => {
                // Se la risposta è valida, la restituiamo
                if (response.ok) return response;
                throw new Error('Network response was not ok');
            })
            .catch(() => {
                // Se fallisce (offline o blocco), cerca il file locale
                return fetch('./fallback-adhan.mp3');
            })
        );
    }
});
