// sw.js
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
    const options = {
        body: "È il momento della preghiera a Bastia Umbra",
        icon: 'https://cdn-icons-png.flaticon.com/512/2619/2619277.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/2619/2619277.png',
        vibrate: [200, 100, 200, 100, 400],
        tag: 'prayer-notif',
        renotify: true,
        requireInteraction: true,
        // Queste due righe sono fondamentali per Android
        priority: 2, 
        importance: 'high'
    };

    event.waitUntil(
        self.registration.showNotification("Muslim Pro", options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('./index.html')
    );
});
