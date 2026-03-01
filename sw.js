const CACHE_NAME = 'muslim-pro-bastia-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  'https://www.islamcan.com/audio/adhan/azan1.mp3',
  'https://www.islamcan.com/audio/adhan/azan2.mp3'
];

// Installazione: mette in cache tutti i file necessari
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Attivazione: pulisce le vecchie cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Strategia Fetch: Network First (prova a scaricare, se fallisce usa la cache)
// Questo garantisce che gli orari siano sempre aggiornati se c'è connessione
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// Gestione Notifiche Push in Background
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {
    title: 'Muslim Pro Bastia',
    body: 'È l\'ora della preghiera.'
  };

  const options = {
    body: data.body,
    icon: 'icon-192.png', // Assicurati di avere queste icone nella cartella
    badge: 'icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      { action: 'open', title: 'Apri App' },
      { action: 'close', title: 'Chiudi' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Azione al click sulla notifica
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
