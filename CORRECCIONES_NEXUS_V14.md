# Correcciones de NEXUS v14

## Portal del estudiante

- «Mapa de las 26 sesiones» abre ahora una agenda diseñada para el estudiante.
- Cada sesión presenta propósito, pregunta inicial, láminas, explicación completa, actividad, producto, continuidad independiente y salida de clase.
- Se retiraron de esa vista el checklist docente, la planeación minuto a minuto, las respuestas esperadas, las intervenciones y las soluciones internas.
- La opción «Tabla de posiciones» aparece con ese nombre en el menú y también desde el Centro de mando.

## Portal docente

- El encabezado muestra `v14 · conducción docente`.
- El panel inicial confirma que están activos el Modo Conducción, los 26 guiones, los materiales proyectables, el seguimiento y la analítica.
- La información pedagógica privada permanece concentrada en el portal docente.

## Actualización

Debe publicarse toda la carpeta `public/course`. El archivo `version.js` y el nuevo `sw.js` sustituyen las cachés anteriores y recargan la aplicación cuando se instala una versión nueva.

La tabla de posiciones requiere además publicar el archivo `firestore.rules` ubicado en la raíz del proyecto.
