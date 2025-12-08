const CACHE_NAME = "lake-levels-v1";
const CACHE_ASSETS = [
  "lake_report_live.html",
  "manifest.json",
  "service-worker.js",
  "icon-192.png",
  "icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHE_ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // Network-first for API
  if (url.includes("/lakes") || url.includes("/refresh")) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for shell
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request))
  );
});
