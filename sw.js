// Installazione del Service Worker
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// IL TUO SCRIPT INTEGRATO
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Gestione specifica per i file audio da archive.org
  if (url.includes('archive.org') && url.endsWith('.mp3')) {
    event.respondWith(
      fetch(url, {
        mode: 'cors',
        headers: {
          'Accept': 'audio/mpeg'
        }
      }).catch(() => {
        // Se il download fallisce, prova a caricare un file locale di emergenza
        return fetch('./fallback-adhan.mp3');
      })
    );
  }
});
