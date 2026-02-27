// sw.js
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : { title: "Preghiera", body: "È il momento di pregare" };
    
    const options = {
        body: data.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/2619/2619277.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/2619/2619277.png',
        vibrate: [200, 100, 200], // Un triplo vibrazione per attirare l'attenzione
        tag: 'prayer-notification',
        renotify: true,
        requireInteraction: true, // Il banner resta finché non lo chiudi
        priority: 2, // Massima priorità per far apparire il pop-up
        data: { url: './index.html' }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            if (clientList.length > 0) return clientList[0].focus();
            return clients.openWindow('./index.html');
        })
    );
});
