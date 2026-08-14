# Misión NEXUS v13 · Modo Conducción y piloto semestral de Sistemas Inteligentes

Esta versión conserva las 30 lecciones híbridas, las presentaciones explicativas, el seguimiento docente en tiempo real y la gamificación responsable. Sobre la versión 12 añade un Modo Conducción de Clase que convierte los guiones en una microplaneación universitaria operativa de 100 minutos, sin sustituir el criterio profesional del docente.

Plataforma universitaria de 96 horas con portales protegidos para docente y estudiante.

## Incluye

- 26 guiones docentes de 100 minutos, con intervención, respuestas esperadas, comprobaciones y continuidad independiente.
- Modo Conducción que muestra un momento a la vez, con cronómetro, rango de minutos, avance de la clase y transición sugerida.
- Lista previa persistente, kit de recursos directos, ajuste de tiempo en bloques de cinco minutos y plan B sin conexión para cada momento.
- Bitácora posterior con logro, dificultad, próximo ajuste, incidencias, tiempo activo y valoración de utilidad, claridad y apoyo a decisiones.
- Presentación web explicativa de nueve diapositivas para cada sesión: activación, explicación conceptual, conceptos esenciales, proceso, ejemplo razonado, aplicación, criterios de calidad y síntesis.
- Las instrucciones como «explique», «pregunte» o «presente el caso» quedan en el guion docente y no sustituyen el contenido que ve el alumnado.
- Portal estudiante con 30 lecciones híbridas, juegos, laboratorios visuales, evidencias y proyecto.
- Las seis unidades comparten el formato visual–textual–interactivo aprobado: una ilustración original por lección, texto accesible, componentes explorables, ejemplo, error típico, límite, reto con retroalimentación y laboratorio.
- Seis cuadernos Colab documentados: reglas, BFS/A*, umbrales, percepción, RAG y FastAPI.
- Acceso único con Google. El rol docente sólo se obtiene desde `roles/{UID}` en Firestore.
- Progreso sincronizado en Firestore; no existe modo demostración.
- Seguimiento docente en tiempo real con estudiante, progreso, ubicación actual, laboratorios, evidencias y última actividad.
- Insignias automáticas por completar misiones, con nombre y significado separados visualmente.
- NexoCoins obtenidas sólo mediante retos opcionales; no alteran XP ni calificación.
- Tienda con seis avatares originales y selección persistente.
- Retos de rapidez, memoria, clasificación y reparación de errores.
- Jingles chiptune originales y desactivables para logros, niveles y compras.
- Historia «La reconstrucción del Núcleo NEXUS» conectada con las seis misiones.
- Pantalla «Cómo jugar NEXUS» y bienvenida para el primer acceso.
- Metas semanales personales de lecciones y retos.
- Ocho recompensas visuales desbloqueadas automáticamente por nivel.
- Clasificación semanal voluntaria, seudónima y cooperativa; nunca usa calificaciones.
- Analítica docente de adopción, retorno, tiempo aproximado, avance, aciertos, retos, narrativa, metas y riesgo de inactividad.
- Medición del propio portal docente mediante consultas, minutos ahorrados, utilidad, claridad, capacidad de acción y reflexiones posteriores a clase.
- Analítica del Modo Conducción: aperturas, sesiones cerradas, tiempo activo aproximado, uso del plan B y exportación de bitácoras.
- Exportaciones seudonimizadas e instrumentos CSV para pre/post, experiencia estudiantil y evaluación docente.
- Instrumento XLSX para evaluar usabilidad docente en semanas 1, 8 y 16, con resumen automático y criterios de interpretación.

## Puesta en marcha

Publique `public/course` en GitHub Pages y siga `CONFIGURACION_SEGURIDAD.md`. También publique las reglas actualizadas de `firestore.rules`, necesarias para la clasificación voluntaria, las reflexiones y las bitácoras del Modo Conducción. La configuración web de Firebase incluida es pública por diseño; la protección real depende de Authentication, el rol del UID y las reglas de Firestore.

Storage y automatización de Classroom quedan desactivados porque requieren servicios o autorización administrativa no disponibles actualmente. Los cuadernos y plantillas se descargan desde la aplicación y pueden entregarse manualmente en Classroom.

## Validación

Ejecute `node --test tests/*.test.mjs`. Las pruebas verifican acceso, seguimiento, gamificación responsable, analítica del piloto, privacidad de la clasificación, Modo Conducción, cuadernos técnicos, 30 lecciones híbridas y 234 diapositivas explicativas.
