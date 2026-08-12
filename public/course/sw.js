const CACHE = "nexus-v3";
const FILES = ["./", "./index.html", "./estudiante.html", "./docente.html", "./styles.css", "./portal.css", "./login.css", "./app.js", "./teacher-app.js", "./student-cloud.js", "./course-data.js", "./teaching-data.js", "./teacher-detail-data.js", "./game-data.js", "./firebase-config.js", "./platform.js", "./classroom-links.js", "./manifest.webmanifest"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
  }).catch(() => caches.match("./index.html"))));
});
