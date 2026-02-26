const CACHE_NAME = 'muslim-pro-bastia-v1';
const ASSETS = [
  'index.html',
  'manifest.json'
];

// Installazione e salvataggio file base
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Gestione notifiche Push / Avvisi
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { 
    title: "تنبيه من المسجد", 
    body: "رسالة جديدة من المركز الإسلامي" 
  };

  const options = {
    body: data.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/2619/2619277.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/2619/2619277.png',
    vibrate: [200, 100, 200],
    dir: 'rtl',
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Apre l'app quando si clicca sulla notifica
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
