self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Se l'app è aperta, mandiamo il comando di riproduzione
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus().then(c => {
            c.postMessage({ action: 'FORCE_PLAY_ADHAN' });
          });
        }
      }
      // Se è chiusa, la apriamo con un parametro speciale
      if (clients.openWindow) {
        return clients.openWindow('./index.html?play=true');
      }
    })
  );
});
