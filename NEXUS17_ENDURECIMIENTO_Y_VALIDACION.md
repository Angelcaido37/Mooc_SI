# NEXUS 17 · Endurecimiento y validación
**NEXUS 17 conserva las mejoras de NEXUS 15 y NEXUS 17.**

## NEXUS 15 heredado
Evidencias predefinidas/editables; categorías y ponderaciones; rúbricas; calificación, retroalimentación y libro de calificaciones; pre/post; retos de dominio; gamificación separada de la nota; analítica y alertas; ABP, ABProyectos, STEAM, cooperación, indagación y mapa de competencias.

## NEXUS 17 heredado
Centro de preparación docente; centro de aprendizaje del estudiante; práctica guiada/autónoma, transferencia, remediación y reto avanzado; trazabilidad UAN; acuses que no afectan calificación; evidencia docente y triangulación.

## NEXUS 17
- Token operativo unificado en `nexus17-token`.
- Sesiones con expiración configurable.
- Restricción de tamaño y extensiones de evidencias.
- Padrón opcional de claves individuales (`NEXUS_STUDENT_KEYS`).
- Pruebas de regresión 16 + endurecimiento 17.
- Ruta explícita a WCAG 2.2 AA, privacidad, respaldos y validación empírica.
- Firebase/Classroom fuera de la arquitectura operativa.

La clave individual mejora atribución, pero no equivale a firma electrónica avanzada.

## Correcciones de consolidación aplicadas
- Código de acceso corregido a `NEXUS17`.
- Campo de clave individual incorporado al frontend.
- Service Worker actualizado e invalidación de cachés anteriores.
- Registros docentes críticos centralizados en SQLite vía API.
- Hash SHA-256 automático para constancias cuando el cliente no envía una huella.
- Protección de contraseña docente predeterminada en modo producción.
- Mensajes operativos de Firestore retirados.
- Suite vigente separada de pruebas históricas archivadas en `tests/legacy/`.
