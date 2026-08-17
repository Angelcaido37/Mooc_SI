# Validación · NEXUS 18 GitHub + Hugging Face

## Backend Python
- Return code: 0
- Resultado: OK

## Suite Node
- Return code: 0
- Resultado: OK

```text

> mision-nexus-18-institucional-candidata@18.0.0 test
> node --test tests/v15-autonomous-evaluation.test.mjs tests/v16-academic-traceability.test.mjs tests/v17-hardening.test.mjs tests/v17-consolidation.test.mjs tests/v18-institutional-readiness.test.mjs tests/v18-github-hf-deployment.test.mjs

TAP version 13
# Subtest: NEXUS 15 removes Classroom/Firebase from operational portals
ok 1 - NEXUS 15 removes Classroom/Firebase from operational portals
  ---
  duration_ms: 0.790624
  type: 'test'
  ...
# Subtest: evaluation categories sum to 100 and evidences are preconfigured
ok 2 - evaluation categories sum to 100 and evidences are preconfigured
  ---
  duration_ms: 0.246116
  type: 'test'
  ...
# Subtest: FastAPI backend includes evidence, grading and analytics routes
ok 3 - FastAPI backend includes evidence, grading and analytics routes
  ---
  duration_ms: 0.863593
  type: 'test'
  ...
# Subtest: NEXUS 16 academic depth and traceability are wired
ok 4 - NEXUS 16 academic depth and traceability are wired
  ---
  duration_ms: 1.202695
  type: 'test'
  ...
# Subtest: acceso conserva código y clave individual de versión vigente
ok 5 - acceso conserva código y clave individual de versión vigente
  ---
  duration_ms: 0.977091
  type: 'test'
  ...
# Subtest: frontend activo no conserva IDs 15/16
ok 6 - frontend activo no conserva IDs 15/16
  ---
  duration_ms: 0.264463
  type: 'test'
  ...
# Subtest: service worker usa cache vigente y borra anteriores
ok 7 - service worker usa cache vigente y borra anteriores
  ---
  duration_ms: 0.270572
  type: 'test'
  ...
# Subtest: seguimiento no instruye publicar Firestore
ok 8 - seguimiento no instruye publicar Firestore
  ---
  duration_ms: 0.227057
  type: 'test'
  ...
# Subtest: backend protege producción
ok 9 - backend protege producción
  ---
  duration_ms: 0.171084
  type: 'test'
  ...
# Subtest: acuse obtiene hash SHA-256
ok 10 - acuse obtiene hash SHA-256
  ---
  duration_ms: 0.147859
  type: 'test'
  ...
# Subtest: trazabilidad docente crítica persiste en backend
ok 11 - trazabilidad docente crítica persiste en backend
  ---
  duration_ms: 0.144514
  type: 'test'
  ...
# Subtest: README usa runtime vigente
ok 12 - README usa runtime vigente
  ---
  duration_ms: 0.172286
  type: 'test'
  ...
# Subtest: token activo moderno sin v15/v16
ok 13 - token activo moderno sin v15/v16
  ---
  duration_ms: 1.601969
  type: 'test'
  ...
# Subtest: hardening heredado
ok 14 - hardening heredado
  ---
  duration_ms: 0.180588
  type: 'test'
  ...
# Subtest: versión no retrocede
ok 15 - versión no retrocede
  ---
  duration_ms: 0.142231
  type: 'test'
  ...
# Subtest: frontend acepta API remota configurable
ok 16 - frontend acepta API remota configurable
  ---
  duration_ms: 1.316404
  type: 'test'
  ...
# Subtest: backend habilita CORS configurable
ok 17 - backend habilita CORS configurable
  ---
  duration_ms: 0.112638
  type: 'test'
  ...
# Subtest: backend admite directorio de datos configurable
ok 18 - backend admite directorio de datos configurable
  ---
  duration_ms: 0.081611
  type: 'test'
  ...
# Subtest: Docker escucha en puerto 7860
ok 19 - Docker escucha en puerto 7860
  ---
  duration_ms: 0.139447
  type: 'test'
  ...
# Subtest: GitHub Pages exige NEXUS_API_BASE
ok 20 - GitHub Pages exige NEXUS_API_BASE
  ---
  duration_ms: 0.090133
  type: 'test'
  ...
# Subtest: GitHub puede sincronizar el Space
ok 21 - GitHub puede sincronizar el Space
  ---
  duration_ms: 0.102392
  type: 'test'
  ...
# Subtest: NEXUS 18 coherente
ok 22 - NEXUS 18 coherente
  ---
  duration_ms: 1.552896
  type: 'test'
  ...
# Subtest: ponderación provisional excluye categorías no evaluadas
ok 23 - ponderación provisional excluye categorías no evaluadas
  ---
  duration_ms: 0.114951
  type: 'test'
  ...
# Subtest: gobernanza y privacidad instrumentadas
ok 24 - gobernanza y privacidad instrumentadas
  ---
  duration_ms: 0.177493
  type: 'test'
  ...
# Subtest: respaldo e investigación disponibles
ok 25 - respaldo e investigación disponibles
  ---
  duration_ms: 0.189591
  type: 'test'
  ...
# Subtest: accesibilidad base presente
ok 26 - accesibilidad base presente
  ---
  duration_ms: 0.171775
  type: 'test'
  ...
# Subtest: centros de privacidad y gobernanza son accesibles desde la interfaz
ok 27 - centros de privacidad y gobernanza son accesibles desde la interfaz
  ---
  duration_ms: 0.166798
  type: 'test'
  ...
1..27
# tests 27
# suites 0
# pass 27
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 109.007187


```

## Funciones añadidas
- API base configurable en runtime.
- CORS configurable.
- `NEXUS_DATA_DIR` configurable.
- Docker Space, puerto 7860.
- GitHub Pages con variable `NEXUS_API_BASE`.
- Sincronización automática GitHub → Hugging Face.
- Guía de despliegue y ejemplo de variables.
