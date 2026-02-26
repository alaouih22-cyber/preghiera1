self.addEventListener('push', function(event) {
    const options = {
        body: event.data.text(),
        icon: 'https://cdn-icons-png.flaticon.com/512/2619/2619277.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/2619/2619277.png'
    };
    event.waitUntil(self.registration.showNotification('Muslim Pro', options));
});
