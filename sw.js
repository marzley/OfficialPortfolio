/* Marzley Tech Solutions service worker: offline page and saved copies.
 * Pages: try the network first. If there is no connection, or it takes too
 * long, show the saved copy of that page, or the offline page if there is none.
 * Styles, scripts and images: use the saved copy when the network fails.
 * Change VERSION whenever offline.html or this file changes. */
var VERSION = "marzley-v5";
var OFFLINE_URL = "offline.html";
var PAGE_TIMEOUT = 10000;
var PRECACHE = [
  OFFLINE_URL,
  "js/offline.js",
  "js/theme-init.js",
  "img/brand/logo-96.webp",
  "img/brand/favicon-32.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(VERSION).then(function (cache) { return cache.addAll(PRECACHE); }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      // Only this worker's own old copies: the learning hub's language store (marzley-runtimes) stays
      return Promise.all(keys.filter(function (k) { return /^marzley-v\d+$/.test(k) && k !== VERSION; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

var save = function (request, response) {
  if (!response || !response.ok || response.type !== "basic") return;
  var copy = response.clone();
  caches.open(VERSION).then(function (cache) { cache.put(request, copy); });
};

var withTimeout = function (promise, ms) {
  return new Promise(function (resolve, reject) {
    var timer = setTimeout(function () { reject(new Error("timeout")); }, ms);
    promise.then(function (r) { clearTimeout(timer); resolve(r); }, function (e) { clearTimeout(timer); reject(e); });
  });
};

self.addEventListener("fetch", function (event) {
  var request = event.request;
  if (request.method !== "GET") return;
  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Payments, form handlers and downloads always go straight to the server
  if (/\.(php|apk)$/.test(url.pathname)) return;
  // The client portal holds private data: never save any of it
  if (url.pathname.indexOf("/portal/") === 0) return;
  // Language runtimes for the code runner (Python, PHP, SQL, Ruby…) are large: the learning hub keeps
  // them in its own store on the device (learn.js), so don't save a second copy here
  if (/^\/vendor\/(pyodide|sqljs|php|langs|sucrase|react|marked)\//.test(url.pathname)) return;

  if (request.mode === "navigate") {
    var network = fetch(request);
    network.then(function (response) { save(request, response); }).catch(function () {});
    event.respondWith(
      withTimeout(network, PAGE_TIMEOUT).catch(function () {
        return caches.match(request, { ignoreSearch: true }).then(function (saved) {
          return saved || caches.match(OFFLINE_URL);
        });
      })
    );
    return;
  }

  event.respondWith(
    fetch(request).then(function (response) {
      save(request, response);
      return response;
    }).catch(function () {
      return caches.match(request).then(function (saved) {
        return saved || Response.error();
      });
    })
  );
});
