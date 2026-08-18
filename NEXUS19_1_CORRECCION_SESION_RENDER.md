# NEXUS 19.1 · Recuperación de sesión

## Incidente
Después de un redeploy de Render, el navegador podía conservar un token cuya fila de sesión ya no existía en SQLite. Los módulos de medición continuaban consultando y mostraban `Medición no disponible: Sesión inválida`.

## Corrección
- Cualquier 401 de una ruta protegida invalida el token local de forma centralizada.
- Se emite `sessionExpired` y se detienen los observadores dependientes de autenticación.
- El portal docente sustituye el error técnico por una solicitud clara de nuevo inicio de sesión.
- El portal estudiante regresa al acceso con contexto de sesión expirada.
- Medición deja de presentar una sesión inválida como si fuera una falla de medición.
- Se incrementa la caché PWA para impedir que sobreviva el JavaScript anterior.

## Nota de arquitectura
Mientras Render use SQLite sobre almacenamiento efímero, un redeploy puede reiniciar no sólo sesiones sino también datos almacenados localmente. Para uso real del semestre se requiere persistencia externa.
