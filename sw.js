self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(function(clientList) {
            if (clientList.length > 0) {
                clientList[0].focus();
                clientList[0].postMessage({ playAdhan: true });
            } else {
                clients.openWindow('./');
            }
        })
    );
});
