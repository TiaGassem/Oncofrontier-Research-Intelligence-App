/* ONCOFRONTIER service worker.
 *
 * The precache list and version are injected at build time by
 * scripts/build-sw.mjs. Caching rules are deliberately conservative:
 *   - navigations        → network-first, cached shell only as offline fallback
 *   - hashed /assets/*   → cache-first (content-addressed, safe forever)
 *   - everything else    → untouched by the worker
 *
 * Never cached: API routes, Supabase traffic (different origin), and any
 * non-GET request. Account data, chat messages and research results therefore
 * never come from a stale cache, and a new deploy is picked up on next load.
 */

const VERSION = '__SW_VERSION__';
const PRECACHE = __PRECACHE_MANIFEST__;
const CACHE = `oncofrontier-${VERSION}`;
const SHELL = '/index.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await cache.addAll(PRECACHE.map((url) => new Request(url, { cache: 'reload' })));
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Only same-origin static content is handled. Supabase, research APIs and
  // any other third-party host bypass the worker entirely.
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;
  if (url.pathname === '/sw.js') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(CACHE);
          if (fresh.ok) await cache.put(SHELL, fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(CACHE);
          const cached = await cache.match(SHELL);
          return cached ?? Response.error();
        }
      })()
    );
    return;
  }

  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE);
        const hit = await cache.match(request);
        if (hit) return hit;
        const fresh = await fetch(request);
        if (fresh.ok) await cache.put(request, fresh.clone());
        return fresh;
      })()
    );
  }
});
