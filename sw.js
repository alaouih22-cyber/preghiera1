const CACHE_NAME = "muslim-pro-bastia-v2026";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./1000087707.png"
];

// INSTALL
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// ACTIVATE
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// FETCH (offline-first)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request);
    })
  );
});

// PUSH NOTIFICATIONS
self.addEventListener("push", event => {
  let data = { title: "Muslim Pro", body: "È ora della preghiera" };

  if (event.data) {
    data = event.data.json();
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "1000087707.png",
      badge: "1000087707.png",
      vibrate: [200, 100, 200],
      tag: "prayer-notification",
      renotify: true
    })
  );
});

// CLICK NOTIFICATION
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("./index.html")
  );
});
