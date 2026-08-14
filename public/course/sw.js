const CACHE = "nexus-v13-modo-conduccion-docente-r2";
const FILES = [
  "./", "./index.html", "./estudiante.html", "./docente.html", "./styles.css", "./portal.css", "./login.css", "./v4.css", "./tracking.css", "./visual-lessons.css", "./arcade.css", "./pilot.css", "./conductor.css", "./app.js", "./arcade-data.js", "./pilot-data.js", "./arcade.js", "./pilot.js", "./teacher-app.js", "./teacher-conductor.js", "./student-cloud.js", "./course-data.js", "./teaching-data.js", "./teacher-detail-data.js", "./technical-labs-data.js", "./visual-lessons-data.js", "./game-data.js", "./firebase-config.js", "./platform.js", "./classroom-links.js", "./manifest.webmanifest", "./instrumentos/encuesta_experiencia_estudiante_v12.csv", "./instrumentos/evaluacion_portal_docente_v12.csv", "./instrumentos/medicion_pre_post_v12.csv", "./instrumentos/diccionario_analitica_v12.csv", "./instrumentos/evaluacion_modo_conduccion_v13.csv", "./instrumentos/evaluacion_modo_conduccion_v13.xlsx",
  "./visuales/unidad-1/01-ia-automatizacion.webp", "./visuales/unidad-1/02-enfoques-ia.webp", "./visuales/unidad-1/03-ciclo-agente.webp", "./visuales/unidad-1/04-peas.webp", "./visuales/unidad-1/05-supervision-humana.webp",
  "./visuales/u2/u2l1.webp", "./visuales/u2/u2l2.webp", "./visuales/u2/u2l3.webp", "./visuales/u2/u2l4.webp", "./visuales/u2/u2l5.webp",
  "./visuales/u3/u3l1.webp", "./visuales/u3/u3l2.webp", "./visuales/u3/u3l3.webp", "./visuales/u3/u3l4.webp", "./visuales/u3/u3l5.webp",
  "./visuales/u4/u4l1.webp", "./visuales/u4/u4l2.webp", "./visuales/u4/u4l3.webp", "./visuales/u4/u4l4.webp", "./visuales/u4/u4l5.webp",
  "./visuales/u5/u5l1.webp", "./visuales/u5/u5l2.webp", "./visuales/u5/u5l3.webp", "./visuales/u5/u5l4.webp", "./visuales/u5/u5l5.webp",
  "./visuales/u6/u6l1.webp", "./visuales/u6/u6l2.webp", "./visuales/u6/u6l3.webp", "./visuales/u6/u6l4.webp", "./visuales/u6/u6l5.webp"
];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
  }).catch(() => caches.match("./index.html"))));
});
