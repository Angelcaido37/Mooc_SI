# Misión NEXUS v3 · Sistemas Inteligentes

Plataforma universitaria gamificada con dos portales protegidos y una carga oficial de 96 horas.

## Contenido

- Portal docente con 26 guiones pedagógicos detallados de 100 minutos.
- Para cada momento: qué preparar, qué decir, qué preguntar, qué hacen los estudiantes, respuestas esperadas, intervención, recurso y comprobación.
- Continuidad independiente vinculada a cada sesión: 44 horas totales sin duplicar actividades de clase.
- Portal estudiantil con 30 lecciones, juegos, videolecciones web, laboratorios low/no-code, XP, evidencias y proyecto.
- Acceso con cualquier cuenta de Google mediante Firebase Authentication.
- Roles protegidos: estudiante por defecto y docente sólo por autorización en Firestore.
- Guardado de progreso, salidas de clase y evidencias.
- Funciones para crear tareas, adjuntar/entregar evidencias y sincronizar calificaciones con Google Classroom.
- Modo alternativo cuando Classroom no autoriza una cuenta institucional.

## Abrir inmediatamente

Publique `public/course` o abra `public/course/index.html`. La aplicación inicia en modo demostración y permite recorrer ambos portales sin datos reales.

## Activar cuentas, almacenamiento y Classroom

Siga `CONFIGURACION_FIREBASE_CLASSROOM.md`. La versión con datos reales requiere Firebase Hosting/Functions; GitHub conserva el repositorio, pero GitHub Pages por sí solo no ejecuta las funciones seguras.

## Seguridad

- Nunca agregue secretos OAuth o claves privadas al repositorio.
- La configuración web de Firebase no sustituye las reglas de Firestore y Storage incluidas.
- Autorice docentes creando `roles/UID` desde la consola; nunca permita que una persona se asigne ese rol desde la interfaz.
- Antes del uso real, publique aviso de privacidad y defina conservación y eliminación de datos.

## Validación

Ejecute `npm test`. Las pruebas comprueban currículo, 26 sesiones, 2,600 minutos docentes, 2,640 independientes, seis fases detalladas por sesión, materiales, juegos y archivos de los dos portales.
