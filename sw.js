// sw.js
const CACHE_NAME = 'muslim-pro-v2';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// IL CUORE DEL PERMESSO: Il push event
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};

  const options = {
    body: data.body || 'È il momento della preghiera',
    icon: 'https://cdn-icons-png.flaticon.com/512/2798/2798007.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/2798/2798007.png',
    
    // 1. FORZA IL BANNER POP-UP (In alto allo schermo)
    priority: 2,           // Massima priorità Chrome/Android
    vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 1000],
    
    // 2. FORZA IL PERMESSO DI INTERAZIONE
    requireInteraction: true, // La notifica NON sparisce finché non la tocchi
    
    // 3. TAG DI SOVRASCRITTURA
    tag: 'prayer-alarm',      // Evita che Android raggruppi le notifiche ignorandole
    renotify: true,           // Suona e vibra anche se c'è già una notifica attiva
    
    data: {
      url: './index.html?play=true'
    },
    
    // Azione rapida per forzare l'apertura
    actions: [
      { action: 'open', title: '🕌 APRI E ASCOLTA ADHAN' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Muslim Pro - Bastia Umbra', options)
  );
});

// GESTIONE DEL CLIC PER SBLOCCARE IL PERMESSO AUDIO
self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Se l'app è aperta, la "svegliamo"
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus().then(c => {
            return c.postMessage({ action: 'FORCE_PLAY_ADHAN' });
          });
        }
      }
      // Se è chiusa, la apriamo. Il browser considererà il clic come 
      // permesso esplicito dell'utente per far partire l'audio.
      if (clients.openWindow) {
        return clients.openWindow('./index.html?play=true');
      }
    })
  );
});
