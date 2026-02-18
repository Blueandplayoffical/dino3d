const CACHE_STATIC = "trex-static-v1";
const CACHE_DYNAMIC = "trex-dynamic-v1";

/* Files we KNOW exist */
const STATIC_FILES = [
  "./",
  "./index.html",
  "./low.html",
  "./css/style.min.css",

  "./js/config-high.js",
  "./js/config-low.js",
  "./js/build.min.js",

  "./libs/three/three.min.js",
  "./libs/three/controls/OrbitControls.js",
  "./libs/three/helpers/CameraHelper.js",
  "./libs/three/loaders/OBJLoader.js",
  "./libs/vox/vox.min.js",
  "./libs/howler/howler.min.js",
  "./libs/nebula/three-nebula.js",
  "./libs/visibly/visibly.js"
];

/* Install */
self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_STATIC).then(cache => cache.addAll(STATIC_FILES))
  );
});

/* Activate */
self.addEventListener("activate", e => {
  e.waitUntil(self.clients.claim());
});

/* Fetch — THIS is the magic */
self.addEventListener("fetch", e => {
  const req = e.request;

  // navigation pages
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).catch(() => caches.match("./index.html"))
    );
    return;
  }

  // cache-first for assets
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;

      return fetch(req).then(res => {
        return caches.open(CACHE_DYNAMIC).then(cache => {
          cache.put(req, res.clone());
          return res;
        });
      });
    })
  );
});
