const CACHE_NAME = "muslim-pro-v2026-final";

self.addEventListener("install", event => {
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(clients.claim());
});

// GESTORE NOTIFICHE (Cruciale per APK)
self.addEventListener("push", event => {
    const options = {
        body: event.data ? event.data.text() : "È ora della preghiera",
        vibrate: [300, 100, 300],
        requireInteraction: true, // La notifica non sparisce finché non la tocchi
        data: { dateOfArrival: Date.now() }
    };
    event.waitUntil(
        self.registration.showNotification("Muslim Pro Bastia", options)
    );
});

// APERTURA APP AL CLICK
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
