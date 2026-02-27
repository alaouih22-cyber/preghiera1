// sw.js
const CACHE_NAME = 'muslim-pro-audio-v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// 1. GESTIONE RICEZIONE NOTIFICA (Modello integrato per "Sveglia")
self.addEventListener('push', event => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Muslim Pro', body: 'È il momento della preghiera' };
    }
  }

  const options = {
    body: data.body || 'Tocca per ascoltare l\'Adhan.',
    icon: 'https://cdn-icons-png.flaticon.com/512/2798/2798007.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/2798/2798007.png',
    vibrate: [500, 200, 500, 200, 800], // Vibrazione stile sveglia
    tag: 'prayer-alarm',
    renotify: true,
    requireInteraction: true, // Fondamentale: la notifica non sparisce finché non agisci
    priority: 2,              // Alta priorità per Android
    data: {
      url: './index.html?play=true' // URL che attiva l'audio all'apertura
    },
    actions: [
      { action: 'play_now', title: '🔊 ASCOLTA ADHAN' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Muslim Pro - Bastia Umbra', options)
  );
});

// 2. GESTIONE CLIC (Il trucco per far partire l'Adhan)
self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Se l'app è già aperta, la portiamo in primo piano e mandiamo il comando audio
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus().then(c => {
            // Mandiamo il comando all'index.html
            return c.postMessage({ action: 'FORCE_PLAY_ADHAN' });
          });
        }
      }
      // Se l'app è chiusa, la apriamo con il parametro play=true
      if (clients.openWindow) {
        return clients.openWindow('./index.html?play=true');
      }
    })
  );
});

// 3. IL TUO CACHING ORIGINALE (Per non rovinare il caricamento degli MP3)
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
