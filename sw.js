// sw.js - Versione Aggressiva per superare il blocco audio
self.addEventListener('push', event => {
    const options = {
        body: "Clicca qui per attivare l'Adhan subito!",
        icon: 'https://cdn-icons-png.flaticon.com/512/2619/2619277.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/2619/2619277.png',
        
        // PRIORITÀ MASSIMA: Forza la comparsa del banner pop-up
        priority: 2, 
        importance: 'high',
        vibrate: [500, 110, 500, 110, 450],
        
        // OBBLIGA L'INTERAZIONE: La notifica non scompare finché non la tocchi
        requireInteraction: true, 
        
        tag: 'adhan-alarm',
        renotify: true,
        data: { url: './index.html?play=true' }
    };

    event.waitUntil(
        self.registration.showNotification("🕌 Momento della Preghiera", options)
    );
});

// IL TRUCCO PER L'AUDIO: Quando clicchi il banner, sblocchi il permesso
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            // Se l'app è aperta, manda il comando di suonare
            for (const client of clientList) {
                if (client.url.includes('index.html') && 'focus' in client) {
                    return client.focus().then(c => c.postMessage({ action: 'FORCE_PLAY_ADHAN' }));
                }
            }
            // Se è chiusa, la apre e il clic sblocca l'audio automaticamente
            if (clients.openWindow) {
                return clients.openWindow('./index.html?play=true');
            }
        })
    );
});
