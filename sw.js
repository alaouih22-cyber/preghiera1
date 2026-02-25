// Service Worker per Notifiche Salat Bastia Umbra

self.addEventListener('install', (event) => {
    // Forza il Service Worker a diventare attivo immediatamente
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Permette al Service Worker di prendere il controllo della pagina subito
    event.waitUntil(clients.claim());
});

// Gestione dell'evento di notifica (quando il browser riceve il comando di mostrare il testo)
self.addEventListener('push', (event) => {
    let data = { title: 'حان وقت الصلاة', body: 'È il momento della preghiera.' };
    
    if (event.data) {
        data = event.data.json();
    }

    const options = {
        body: data.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/1162/1162383.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/1162/1162383.png',
        vibrate: [200, 100, 200, 100, 200],
        tag: 'salat-notification', // Evita doppioni
        renotify: true,
        data: {
            url: '/' // Apre l'app quando clicchi
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Gestione del click sulla notifica
self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // Chiude il banner dopo il click

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((
