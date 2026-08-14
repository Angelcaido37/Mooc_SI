# Arquitectura de portales de Misión NEXUS

## Portal del estudiante

- El mapa de las 26 sesiones abre una agenda diseñada para el estudiante.
- Cada sesión presenta propósito, pregunta inicial, láminas, explicación completa, actividad, producto, continuidad independiente y salida de clase.
- El checklist docente, la planeación minuto a minuto, las respuestas esperadas, las intervenciones y las soluciones internas no se exponen en esta ruta.
- La opción **Tabla de posiciones** aparece con ese nombre en el menú y desde el Centro de mando.
- La opción **Tareas en Classroom** muestra las actividades publicadas y lleva al estudiante directamente a Google Classroom para adjuntar y entregar.

## Portal docente

- El panel inicial reúne planeación, Modo Conducción, 26 guiones, materiales proyectables, seguimiento, medición, analítica y Classroom.
- La información pedagógica privada permanece concentrada en el portal docente.
- Al cerrar una sesión, el docente puede publicar su actividad en Classroom con la sesión ya seleccionada.

## Actualización

Debe publicarse toda la carpeta `public/course`, junto con `firestore.rules` y las Firebase Functions. El archivo `version.js` y el service worker sustituyen automáticamente las cachés anteriores.
