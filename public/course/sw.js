const CACHE = "nexus-plataforma-academica-classroom-produccion-r1";
const FILES = [
  "./", "./index.html", "./estudiante.html", "./docente.html", "./styles.css", "./portal.css", "./login.css", "./v4.css", "./tracking.css", "./visual-lessons.css", "./arcade.css", "./pilot.css", "./conductor.css", "./measurement.css", "./classroom.css", "./version.js", "./app.js", "./arcade-data.js", "./pilot-data.js", "./measurement-data.js", "./measurement-scoring.js", "./measurement-student.js", "./measurement-teacher.js", "./classroom-teacher.js", "./arcade.js", "./pilot.js", "./teacher-app.js", "./teacher-conductor.js", "./student-cloud.js", "./course-data.js", "./teaching-data.js", "./teacher-detail-data.js", "./technical-labs-data.js", "./visual-lessons-data.js", "./game-data.js", "./firebase-config.js", "./platform.js", "./classroom-links.js", "./manifest.webmanifest",
  "./visuales/unidad-1/01-ia-automatizacion.webp", "./visuales/unidad-1/02-enfoques-ia.webp", "./visuales/unidad-1/03-ciclo-agente.webp", "./visuales/unidad-1/04-peas.webp", "./visuales/unidad-1/05-supervision-humana.webp",
  "./visuales/u2/u2l1.webp", "./visuales/u2/u2l2.webp", "./visuales/u2/u2l3.webp", "./visuales/u2/u2l4.webp", "./visuales/u2/u2l5.webp",
  "./visuales/u3/u3l1.webp", "./visuales/u3/u3l2.webp", "./visuales/u3/u3l3.webp", "./visuales/u3/u3l4.webp", "./visuales/u3/u3l5.webp",
  "./visuales/u4/u4l1.webp", "./visuales/u4/u4l2.webp", "./visuales/u4/u4l3.webp", "./visuales/u4/u4l4.webp", "./visuales/u4/u4l5.webp",
  "./visuales/u5/u5l1.webp", "./visuales/u5/u5l2.webp", "./visuales/u5/u5l3.webp", "./visuales/u5/u5l4.webp", "./visuales/u5/u5l5.webp",
  "./visuales/u6/u6l1.webp", "./visuales/u6/u6l2.webp", "./visuales/u6/u6l3.webp", "./visuales/u6/u6l4.webp", "./visuales/u6/u6l5.webp"
];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  const freshFirst = e.request.mode === "navigate" || ["script", "style"].includes(e.request.destination);
  if (freshFirst) {
    e.respondWith(fetch(e.request).then(r => {
      const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
    }).catch(() => caches.match(e.request, {ignoreSearch:true}).then(hit => hit || caches.match("./index.html"))));
    return;
  }
  e.respondWith(caches.match(e.request, {ignoreSearch:true}).then(hit => hit || fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
  })));
});
