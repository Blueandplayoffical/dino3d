const BASE = "/dino3d/";

const STATIC = "trex-static-v3";
const DYNAMIC = "trex-dynamic-v3";

const STATIC_FILES = [
  BASE,
  BASE + "index.html",
  BASE + "low.html",

  BASE + "css/style.min.css",

  BASE + "js/config-high.js",
  BASE + "js/config-low.js",
  BASE + "js/build.min.js",

  BASE + "libs/three/three.min.js",
  BASE + "libs/three/controls/OrbitControls.js",
  BASE + "libs/three/helpers/CameraHelper.js",
  BASE + "libs/three/loaders/OBJLoader.js",
  BASE + "libs/vox/vox.min.js",
  BASE + "libs/howler/howler.min.js",
  BASE + "libs/nebula/three-nebula.js",
  BASE + "libs/visibly/visibly.js"
];

/* install */
self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(STATIC).then(cache => cache.addAll(STATIC_FILES))
  );
});

/* activate */
self.addEventListener("activate", e => {
  e.waitUntil(self.clients.claim());
});

/* fetch */
self.addEventListener("fetch", e => {
  const req = e.request;

  // handle page navigation
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).catch(() => caches.match(BASE + "index.html"))
    );
    return;
  }

  // asset caching
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;

      return fetch(req).then(res => {
        return caches.open(DYNAMIC).then(cache => {
          cache.put(req, res.clone());
          return res;
        });
      });
    })
  );
});
