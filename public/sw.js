const CACHE_NAME = 'catikhelghar-v5';

const STATIC_ASSETS = [
  '/',
  '/games',
  '/games/tic-tac-toe',
  '/games/ludo',
  '/games/snake-and-ladders',
  '/games/connect-four',
  '/games/dots-and-boxes',
  '/games/carrom',
  '/how-to-play',
  '/about',
  '/privacy',
  '/offline',
  '/manifest.json',
  '/icon.svg',
  '/dimisi-logo.png',
  '/themes/ludo/sakura/board.jpg',
  '/themes/ludo/sakura/pawn-red.jpg',
  '/themes/ludo/sakura/pawn-green.jpg',
  '/themes/ludo/sakura/pawn-yellow.jpg',
  '/themes/ludo/sakura/pawn-blue.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Navigation requests: Stale-while-revalidate with offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, resClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then(cached => {
            return cached || caches.match('/offline');
          });
        })
    );
    return;
  }

  // Static assets: Network First during development, Cache First offline
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (!response || response.status !== 200) {
          return response;
        }
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, resClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
