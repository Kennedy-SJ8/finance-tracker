const CACHE_NAME = 'finance-tracker-v520';
const ASSETS_TO_CACHE = [
  'https://kennedy-sj8.github.io/finance-tracker/manifest.json?v=520',
  'https://kennedy-sj8.github.io/finance-tracker/favicon.ico'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[SW] Cache parcial:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Purgando caché obsoleta:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Ignorar peticiones de backend (Supabase / Google Sheets) para que vayan siempre a la red viva
  if (event.request.url.includes('script.google.com') || event.request.url.includes('supabase.co')) {
    return;
  }

  // ESTRATEGIA: Si es documento HTML o navegación principal -> SIEMPRE RED VIVA CON NO-CACHE
  if (event.request.mode === 'navigate' || event.request.destination === 'document' || event.request.url.endsWith('/') || event.request.url.includes('index.html')) {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' })
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Para otros assets estáticos: Network first, con fallback a caché
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && event.request.method === 'GET') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
