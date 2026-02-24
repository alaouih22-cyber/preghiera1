self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('push', (event) => {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/1162/1162383.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/1162/1162383.png',
        vibrate: [200, 100, 200],
        tag: 'adhan-notification',
        renotify: true
    };
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Gestione clic sulla notifica
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
