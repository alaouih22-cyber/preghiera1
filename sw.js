// sw.js
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const data = event.data;
        const options = {
            body: data.body,
            icon: '1000087707.png', // Solo l'icona aggiornata
            badge: '1000087707.png',
            vibrate: [500, 110, 500, 110, 450],
            tag: 'prayer-notif',
            renotify: true,
            requireInteraction: true,
            priority: 2,
            importance: 'high',
            data: { url: './index.html' }
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            if (clientList.length > 0) return clientList[0].focus();
            return clients.openWindow('./index.html');
        })
    );
});
