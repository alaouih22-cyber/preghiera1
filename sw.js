const CACHE_NAME = "muslim-pro-bastia-v2026";

// Assicurati che questi nomi file esistano esattamente così su GitHub
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./sw.js",
  "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" // Audio bip per offline
];

// INSTALL: Carica i file nella cache per l'uso offline
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Cache aperta: salvataggio asset");
      return cache.addAll(ASSETS);
    })
  );
});

// ACTIVATE: Pulisce le vecchie versioni della cache
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

// FETCH: Strategia Cache-First (funziona senza internet)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request).catch(() => {
        // Se fallisce tutto (offline), ritorna la pagina principale
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// PUSH NOTIFICATIONS: Gestisce i messaggi inviati dal server o dai test
self.addEventListener("push", event => {
  let data = { 
    title: "Muslim Pro - Bastia Umbra", 
    body: "È ora della preghiera o di un evento Ramadan" 
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: "1000087707.png", // Assicurati che questo file sia su GitHub
    badge: "1000087707.png",
    vibrate: [200, 100, 200, 100, 200],
    tag: "prayer-notification",
    renotify: true,
    data: { url: "./index.html" }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// CLICK NOTIFICATION: Apre l'app quando tocchi la notifica
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then(clientList => {
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow("./index.html");
    })
  );
});
