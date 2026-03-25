// ── Vimperk PWA Service Worker ─────────────────────────────────
const CACHE_VERSION = "v1";
const STATIC_CACHE  = `vimperk-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `vimperk-dynamic-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  "/",
  "/zpravodaj",
  "/adresar",
  "/jizdy",
  "/zhlasit",
  "/hlasovani",
  "/ai",
  "/manifest.json",
];

// ── Install: precache shell ─────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: clean old caches ──────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== DYNAMIC_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: network-first for API, cache-first for assets ────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin
  if (request.method !== "GET" || !url.origin.includes(self.location.origin)) return;

  // API calls — network first, no cache
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(request).catch(() =>
      new Response(JSON.stringify({ reply: "Jste offline. Zkuste to prosím po obnovení připojení." }),
        { headers: { "Content-Type": "application/json" } })
    ));
    return;
  }

  // Next.js static assets — cache first
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((res) => {
        const clone = res.clone();
        caches.open(STATIC_CACHE).then((c) => c.put(request, clone));
        return res;
      }))
    );
    return;
  }

  // Pages — stale-while-revalidate
  event.respondWith(
    caches.open(DYNAMIC_CACHE).then((cache) =>
      cache.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((res) => {
          cache.put(request, res.clone());
          return res;
        });
        return cached || fetchPromise;
      })
    )
  );
});

// ── Push notifications ──────────────────────────────────────────
self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload;
  try { payload = event.data.json(); }
  catch { payload = { title: "Vimperk", body: event.data.text() }; }

  const options = {
    body:    payload.body    ?? "",
    icon:    payload.icon    ?? "/icons/icon-192.png",
    badge:   payload.badge   ?? "/icons/icon-96.png",
    image:   payload.image,
    tag:     payload.tag     ?? "vimperk-notification",
    data:    payload.data    ?? { url: "/" },
    actions: payload.actions ?? [],
    vibrate: [200, 100, 200],
    requireInteraction: payload.urgent ?? false,
  };

  event.waitUntil(
    self.registration.showNotification(payload.title ?? "Vimperk", options)
  );
});

// ── Notification click ──────────────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      return clients.openWindow(url);
    })
  );
});
