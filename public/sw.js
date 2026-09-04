const CACHE_NAME = 'catikhelghar-v11';

const STATIC_ASSETS = [
  '/',
  '/games',
  '/games/tic-tac-toe',
  '/games/ludo',
  '/games/snake-and-ladders',
  '/games/connect-four',
  '/games/dots-and-boxes',
  '/games/carrom',
  '/games/chess',
  '/games/checkers',
  '/games/reversi',
  '/games/ashta-chamma',
  '/games/bagh-chal',
  '/games/mancala',
  '/games/battleship',
  '/games/yahtzee',
  '/games/sos',
  '/games/memory-match',
  '/how-to-play',
  '/about',
  '/team',
  '/team/shikhar-dixit',
  '/team/swatantra-singh',
  '/team/nishkarsh-mishra',
  '/privacy',
  '/offline',
  '/manifest.json',
  '/icon.svg',
  '/dimisi-logo.png',
  '/team/shikhar-dixit.png',
  '/team/swatantra-singh.png',
  '/team/nishkarsh-mishra.png'
];

// Determine if request is cacheable
function isCacheable(request) {
  try {
    // 1. NEVER cache or intercept anything in local development (localhost / 127.0.0.1)
    if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
      return false;
    }
    if (request.method !== 'GET') return false;
    const url = new URL(request.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    // Only intercept same-origin requests
    if (url.origin !== self.location.origin) return false;
    // Do not intercept Next.js development and hot reload requests
    if (url.pathname.startsWith('/_next/')) return false;
    if (url.pathname.startsWith('/__nextjs')) return false;
    return true;
  } catch (e) {
    return false;
  }
}

// Pre-cache static shell on install
self.addEventListener('install', function (event) {
  if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
    self.skipWaiting();
    return;
  }

  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return Promise.allSettled(
        STATIC_ASSETS.map(function (url) {
          return cache.add(url).catch(function (err) {
            console.warn('[SW] Pre-cache skipped:', url, err.message);
          });
        })
      );
    })
  );
  self.skipWaiting();
});

// Clear old cache versions on activate
self.addEventListener('activate', function (event) {
  if (self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1') {
    event.waitUntil(
      caches.keys().then(function (keys) {
        return Promise.all(
          keys.map(function (key) {
            return caches.delete(key);
          })
        );
      }).then(function () {
        return self.registration.unregister();
      })
    );
    return;
  }

  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch interceptor
self.addEventListener('fetch', function (event) {
  const request = event.request;

  if (!isCacheable(request)) {
    return;
  }

  // 1. Navigation requests: Network-first, fallback to cache, fallback to /offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(function (networkResponse) {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(request, copy);
            });
          }
          return networkResponse;
        })
        .catch(function () {
          return caches.match(request).then(function (cached) {
            if (cached) return cached;
            return caches.match('/offline').then(function (offlinePage) {
              if (offlinePage) return offlinePage;
              return new Response(
                '<!DOCTYPE html><html><body><h2>You are currently offline.</h2><p>Please check your connection.</p></body></html>',
                { status: 503, headers: { 'Content-Type': 'text/html' } }
              );
            });
          });
        })
    );
    return;
  }

  const url = new URL(request.url);

  // 2. Next.js chunks, dynamic scripts, and CSS: Network-First with Cache fallback
  // This guarantees hot updates, rebuilds, and fresh chunks are never masked by stale caches.
  if (url.pathname.startsWith('/_next/')) {
    event.respondWith(
      fetch(request)
        .then(function (networkResponse) {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(request, copy);
            });
          }
          return networkResponse;
        })
        .catch(function () {
          return caches.match(request).then(function (cachedResponse) {
            if (cachedResponse) return cachedResponse;
            return new Response('/* Offline fallback */', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
        })
    );
    return;
  }

  // 3. Static assets (images, icons, sound files, manifest): Cache-First, then network
  event.respondWith(
    caches.match(request).then(function (cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then(function (networkResponse) {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(request, copy);
            });
          }
          return networkResponse;
        })
        .catch(function (fetchErr) {
          return new Response('', { status: 408, statusText: 'Request Timeout / Offline' });
        });
    })
  );
});

