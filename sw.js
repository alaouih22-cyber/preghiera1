const CACHE_NAME = "muslim-pro-v2"; // Cambiato nome per forzare aggiornamento
const ASSETS = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", e => {
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener("activate", e => {
    e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))));
    self.clients.claim();
});

self.addEventListener("push", e => {
    const options = {
        body: e.data ? e.data.text() : "È ora della preghiera",
        vibrate: [200, 100, 200],
        requireInteraction: true // La notifica resta finché non la clicchi
    };
    e.waitUntil(self.registration.showNotification("Muslim Pro Bastia", options));
});

self.addEventListener("notificationclick", e => {
    e.notification.close();
    e.waitUntil(clients.openWindow("./index.html"));
});
