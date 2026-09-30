const CACHE_NAME = 'finance-tracker-v50';
const ASSETS_TO_CACHE = [
  'https://kennedy-sj8.github.io/finance-tracker/',
  'https://kennedy-sj8.github.io/finance-tracker/index.html',
  'https://kennedy-sj8.github.io/finance-tracker/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('script.google.com')) return;
  
  // ESTRATEGIA: NETWORK FIRST (Prioridad a internet, si falla usa caché)
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
