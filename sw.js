// sw.js
self.addEventListener('push', event => {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || 'Muslim Pro - Bastia Umbra';
  const options = {
    body: data.body || 'È il momento della preghiera.',
    icon: 'https://cdn-icons-png.flaticon.com/512/2798/2798007.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/2798/2798007.png',
    vibrate: [500, 200, 500],
    requireInteraction: true,
    data: {
      // Usiamo l'URL del modello per forzare l'audio all'apertura
      url: data.url || './index.html?play=true' 
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Gestione clic sulla notifica (Seguendo il tuo modello)
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Se l'app è già aperta, la focalizziamo e mandiamo il comando audio
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus().then(c => c.postMessage({ action: 'FORCE_PLAY_ADHAN' }));
        }
      }
      // Altrimenti apriamo una nuova finestra con il parametro play
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
