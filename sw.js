// sw.js
self.addEventListener('push', event => {
  let data = event.data ? event.data.json() : { title: 'Muslim Pro', body: 'È il momento della preghiera' };

  const options = {
    body: data.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/2798/2798007.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/2798/2798007.png',
    vibrate: [500, 110, 500, 110, 450, 110, 200],
    tag: 'adhan-notif',
    renotify: true, // Questo forza il banner a ricomparire se ne arriva un altro
    requireInteraction: true,
    data: { url: './index.html?play=true' }
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus().then(c => c.postMessage({ action: 'FORCE_PLAY_ADHAN' }));
        }
      }
      if (clients.openWindow) return clients.openWindow('./index.html?play=true');
    })
  );
});
