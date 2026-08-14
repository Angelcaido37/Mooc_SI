# Misión NEXUS v9 · Sistemas Inteligentes

Esta versión conserva las 30 lecciones híbridas y corrige el material proyectable de las 26 sesiones. Las diapositivas visibles para el grupo contienen el texto explicativo, los conceptos, el proceso y el ejemplo razonado; las indicaciones de conducción permanecen en el guion privado del docente.

Plataforma universitaria de 96 horas con portales protegidos para docente y estudiante.

## Incluye

- 26 guiones docentes de 100 minutos, con intervención, respuestas esperadas, comprobaciones y continuidad independiente.
- Presentación web explicativa de nueve diapositivas para cada sesión: activación, explicación conceptual, conceptos esenciales, proceso, ejemplo razonado, aplicación, criterios de calidad y síntesis.
- Las instrucciones como «explique», «pregunte» o «presente el caso» quedan en el guion docente y no sustituyen el contenido que ve el alumnado.
- Portal estudiante con 30 lecciones híbridas, juegos, laboratorios visuales, evidencias y proyecto.
- Las seis unidades comparten el formato visual–textual–interactivo aprobado: una ilustración original por lección, texto accesible, componentes explorables, ejemplo, error típico, límite, reto con retroalimentación y laboratorio.
- Seis cuadernos Colab documentados: reglas, BFS/A*, umbrales, percepción, RAG y FastAPI.
- Acceso único con Google. El rol docente sólo se obtiene desde `roles/{UID}` en Firestore.
- Progreso sincronizado en Firestore; no existe modo demostración.

## Puesta en marcha

Publique `public/course` en GitHub Pages y siga `CONFIGURACION_SEGURIDAD.md`. La configuración web de Firebase incluida es pública por diseño; la protección real depende de Authentication, el rol del UID y las reglas de Firestore.

Storage y automatización de Classroom quedan desactivados porque requieren servicios o autorización administrativa no disponibles actualmente. Los cuadernos y plantillas se descargan desde la aplicación y pueden entregarse manualmente en Classroom.

## Validación

Ejecute `node --test tests/v4-security.test.mjs tests/v5-visual.test.mjs tests/v9-projectables.test.mjs tests/static-course.test.mjs`. Las pruebas verifican la protección de acceso, el rol en Firestore, los cuadernos técnicos, las 30 lecciones híbridas y las 234 diapositivas explicativas.
