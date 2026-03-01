const CACHE_NAME = "muslim-pro-bastia-v2026";
const ASSETS = ["./", "./index.html", "./manifest.json"];

// Installazione e cache
self.addEventListener("install", event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
});

// Attivazione e pulizia
self.addEventListener("activate", event => {
    event.waitUntil(clients.claim());
});

// Gestione Notifiche Push (fondamentale per APK)
self.addEventListener("push", event => {
    let data = { title: "Muslim Pro", body: "È ora della preghiera" };
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            vibrate: [200, 100, 200, 100, 200],
            tag: "prayer-notification",
            renotify: true
        })
    );
});

// Apre l'app quando clicchi sulla notifica
self.addEventListener("notificationclick", event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow("./index.html")
    );
});
