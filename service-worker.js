const CACHE_NAME = 'myapp-cache-v1';
const FILES_TO_CACHE = [
  './pd39.html',
  './manifest.json'
];

// Kurulum (install)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Dosyalar cache\'e ekleniyor');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ağ isteği yakalama (offline)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Eski cache'leri temizle
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Eski cache silindi:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});
