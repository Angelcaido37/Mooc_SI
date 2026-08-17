# NEXUS 18.3 · Corrección portal estudiante

Se corrigió el bloqueo observado al pasar desde Docente a Estudiante.

## Causa verificada
La URL desplegada apuntaba a `student.html`, mientras el portal vigente es `estudiante.html`. Además, el portal podía quedar esperando si el evento de autenticación ocurría antes de que `student-local.js` instalara su listener.

## Correcciones
- `student.html` ahora es un alias de compatibilidad que redirige a `estudiante.html`.
- `student-local.js` revalida la sesión al cargar.
- El enlace docente apunta explícitamente a `estudiante.html`.
- Caché PWA incrementada a `nexus-18-3-r1`.
- Pruebas de regresión específicas para este incidente.
