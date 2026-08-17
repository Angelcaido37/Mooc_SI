# Informe de correcciones de consolidación · NEXUS 17

## Bloqueantes corregidos
1. Acceso estudiante: la interfaz y backend usan `NEXUS17`.
2. Identidad reforzada: la interfaz permite introducir clave individual opcional, validable mediante `NEXUS_STUDENT_KEYS`.
3. Coherencia de versión: frontend activo, health, trazabilidad y caché reportan NEXUS 17.
4. Regresión: la suite vigente está separada de pruebas históricas obsoletas y pasa en su totalidad.

## Seguridad y trazabilidad
- Las sesiones expiran según `NEXUS_SESSION_HOURS`.
- Evidencias restringidas por extensión y `NEXUS_MAX_UPLOAD_MB`.
- En producción (`NEXUS_ENV=production`) no se permite arrancar con la contraseña docente de demostración.
- Las constancias generan SHA-256 en servidor si no se suministra `resourceHash`.
- Reflexiones, bitácoras de conducción e instrumentos docentes ya se persisten vía FastAPI/SQLite y no dependen del almacenamiento local del navegador.

## Prueba de extremo a extremo realizada
Se verificó: health NEXUS 17 → acceso estudiante → acceso docente → entrega de evidencia → calificación → libro de calificaciones → constancia con SHA-256 → registro docente → consulta de trazabilidad.

## Alcance
Estas correcciones eliminan los bloqueantes técnicos detectados en la auditoría de consolidación. Continúan como requisitos de gobernanza antes de despliegue institucional masivo: auditoría formal WCAG 2.2 AA, aviso de privacidad institucional, política de respaldo/retención y validación empírica mediante piloto real.
