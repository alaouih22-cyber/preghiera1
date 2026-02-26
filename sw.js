self.addEventListener('fetch', event => {
  const url = event.request.url;

  if (url.includes('archive.org') && url.endsWith('.mp3')) {
    event.respondWith(
      fetch(url, {
        mode: 'cors',
        headers: {
          'Accept': 'audio/mpeg'
        }
      }).catch(() => {
        return fetch('./fallback-adhan.mp3');
      })
    );
  }
});
