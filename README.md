# Misión NEXUS · Plataforma académica universitaria

NEXUS integra planeación docente, conducción de sesiones, ruta estudiantil, gamificación, seguimiento, evaluación semestral y publicación de actividades en Google Classroom. Estudiantes y docentes reciben únicamente los instrumentos correspondientes a la fase académica actual; el portal docente reúne cobertura, datos automáticos, comparación pre/post, experiencia estudiantil y valoración de la plataforma.

Plataforma universitaria de 96 horas con portales protegidos para docente y estudiante.

## Incluye

- Ruta estudiantil propia para las 26 sesiones, sin checklist docente ni secuencia privada de conducción.
- Acceso directo desde cada sesión estudiantil a la lámina visual y a la explicación académica completa.
- Tabla de posiciones semanal claramente rotulada en el menú y en el Centro de mando.
- Estado visible cuando todavía no hay participantes o cuando falta publicar `firestore.rules`.
- Identidad institucional uniforme en ambos portales y renovación automática de caché.
- La medición reutiliza rutas protegidas ya existentes (`coursework`, `progress` y `teacherUsage`) para evitar el error «Missing or insufficient permissions» cuando el portal se actualiza antes que las reglas.
- Renovación automática de la caché para evitar que el navegador conserve módulos anteriores.

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
- Progreso sincronizado en Firestore para las cuentas autenticadas.
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
- Cinco instrumentos estudiantiles programados: diagnóstico, semanas 4, 8 y 12, y evaluación final.
- Cinco instrumentos docentes programados: línea base, semanas 4, 8 y 12, y evaluación final de la plataforma.
- Calendario de 16 semanas configurable desde el módulo docente; NEXUS calcula automáticamente la fase vigente.
- Módulo estudiantil «Mi participación y encuestas», con avisos de instrumentos disponibles y estado de cada aplicación.
- Tablero integrado con cobertura, conocimiento pre/post emparejado, autoeficacia, motivación, dimensiones de experiencia y resultados docentes.
- Integración de datos automáticos de visitas, tiempo aproximado, avance, controles, sesiones conducidas, reflexiones y uso del plan B.
- Exportación CSV seudonimizada de los resultados de la medición integrada.
- Los formularios de aplicación están incorporados en NEXUS y se habilitan automáticamente por fase; la interfaz ya no muestra plantillas CSV/XLSX heredadas.
- Evaluación integrada de usabilidad y conducción docente en las fases programadas, con resumen automático y criterios de interpretación.
- Conexión docente segura con Google Classroom mediante OAuth y funciones de servidor.
- Publicación de tareas por sesión, con instrucciones, fecha límite, hora y puntuación máxima.
- Acceso estudiantil directo a la tarea para adjuntar y entregar archivos dentro de Classroom, sin capturar identificadores técnicos.
- Historial docente de actividades publicadas y acceso directo al trabajo correspondiente.

## Puesta en marcha

Publique la carpeta completa `public/course`, no archivos aislados, y siga `CONFIGURACION_SEGURIDAD.md`. También publique las reglas actualizadas de `firestore.rules`, necesarias para el calendario, los instrumentos, la clasificación voluntaria, Classroom, las reflexiones y las bitácoras del Modo Conducción. Después del primer acceso docente, abra «Medición y resultados» y configure la fecha de inicio del semestre.

Para activar Classroom complete una sola vez la configuración indicada en `CONFIGURACION_FIREBASE_CLASSROOM.md`: habilitar la API, crear el cliente OAuth, registrar la redirección, cargar tres secretos y desplegar Functions, reglas y Hosting. Storage permanece desactivado porque los archivos se adjuntan y entregan directamente en Classroom.

## Validación

Ejecute `node --test tests/*.test.mjs`. Las pruebas verifican acceso, separación de rutas, seguimiento, tabla de posiciones, actualización de caché, gamificación responsable, instrumentos por fase, reglas de datos, tablero académico, Modo Conducción, integración de Classroom, cuadernos técnicos, 30 lecciones híbridas y 234 diapositivas explicativas.
