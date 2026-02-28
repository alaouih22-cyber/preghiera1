// sw.js
self.addEventListener('install', (event) => {
    self.skipWaiting();
    console.log("SW: Installato");
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
    console.log("SW: Attivato");
});

// Ascolta i messaggi inviati dall'app (Test o Orari)
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const data = event.data;
        const options = {
            body: data.body,
            icon: 'https://cdn-icons-png.flaticon.com/512/2619/2619277.png',
            badge: 'https://cdn-icons-png.flaticon.com/512/2619/2619277.png',
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
