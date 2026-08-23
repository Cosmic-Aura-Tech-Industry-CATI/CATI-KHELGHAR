const CACHE_NAME = 'catikhelghar-v6';

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
  '/themes/ludo/sakura/board.jpg'
];

// Only cache requests we are allowed to cache
function isCacheable(request) {
  const url = new URL(request.url);
  // Must be http or https — never chrome-extension://, data:, etc.
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
  // Skip Next.js internal hot-reload / dev overlay endpoints
  if (url.pathname.startsWith('/_next/webpack-hmr')) return false;
  if (url.pathname.startsWith('/__nextjs')) return false;
  // Skip browser extension injected resources
  if (url.hostname === 'localhost' && url.pathname.startsWith('/chrome-extension')) return false;
  return true;
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // addAll only for our own static assets — safe origins
      return Promise.allSettled(
        STATIC_ASSETS.map(url =>
          cache.add(url).catch(err => {
            console.warn('[SW] Failed to pre-cache:', url, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;

  // Immediately ignore un-cacheable requests (chrome-extension, etc.)
  if (!isCacheable(request)) return;

  // Navigation requests: Network first → cache fallback → /offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then(cached => cached || caches.match('/offline'))
        )
    );
    return;
  }

  // Static assets: Network first, cache on success
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response && response.status === 200 && response.type !== 'opaque') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
