const CACHE_NAME = 'e-dit-v4';
const ASSETS = [
  '/format-edit-mobile/',
  '/format-edit-mobile/index.html',
  '/format-edit-mobile/manifest.json',
  '/format-edit-mobile/icons/icon-16x16.png',
  '/format-edit-mobile/icons/icon-32x32.png',
  '/format-edit-mobile/icons/icon-192x192.png',
  '/format-edit-mobile/icons/icon-512x512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
    .then(response => {
      const clone = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
      return response;
    })
    .catch(() => caches.match(e.request))
  );
});