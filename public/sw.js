const CACHE_VERSION = "v2";
const STATIC_CACHE = `vimperk-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `vimperk-dynamic-${CACHE_VERSION}`;

const PRECACHE_URLS = ["/", "/manifest.json", "/branding/vimperk-mark.png", "/branding/vimperk-shield.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(
        () =>
          new Response(JSON.stringify({ reply: "Jste offline. Zkuste to prosím po obnovení připojení." }), {
            headers: { "Content-Type": "application/json" },
          })
      )
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => (await caches.match(request)) || caches.match("/"))
    );
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    ["style", "script", "worker", "font", "image"].includes(request.destination)
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
            return response;
          })
      )
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request))
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
