# Validación final — NEXUS 19 Estable Final

Fecha: 17 de agosto de 2026

## Resultado

La versión fue sometida a tres niveles de verificación:

1. **Suite automatizada:** 65/65 pruebas aprobadas.
2. **Prueba de interfaz en Chromium:** aprobada sin errores de JavaScript ni recursos fallidos en el entorno de prueba.
3. **Prueba funcional del backend FastAPI:** aprobada en acceso estudiante/docente, progreso, entrega de evidencia, SHA-256, revisión docente, rúbrica/calificación, libro de calificaciones, descarga autenticada y supervivencia de sesión firmada.

## Correcciones de experiencia estudiantil

- Menú principal reducido de 19 a **7 decisiones**:
  - Inicio / Continuar
  - Mi ruta
  - Actividades y juegos
  - Proyecto integrador
  - Evidencias y calificaciones
  - Recursos y apoyo
  - Mi perfil
- Las 26 sesiones quedan dentro de **Mi ruta**.
- Se elimina la duplicidad perceptual de **Centro de aprendizaje**: la profundidad académica ahora está integrada dentro de cada lección.
- Cada lección integra activación, explicación, práctica guiada, práctica autónoma, transferencia, remediación, errores frecuentes y demostración de dominio.
- Gamificación, retos, tabla y tienda se agrupan en **Actividades y juegos**.
- Low/no-code pasa a llamarse **Laboratorio visual**.
- Python/FastAPI pasa a **Laboratorio de código**.
- El menú móvil incorpora fondo modal, cierre explícito, cierre al tocar fuera, tecla Escape y estado accesible `aria-expanded`.
- La pantalla inicial muestra **Continuar donde me quedé** cuando existe progreso.
- Las sesiones usan el término **lección principal**, no “recurso completo”.
- Los videos curados se muestran al estudiante dentro de la sesión cuando están disponibles.

## Corrección crítica de ponderaciones

Se eliminó la representación engañosa de `35 %` junto a cada evidencia.

Ahora NEXUS distingue:

- **Peso global de la categoría Evidencias de aprendizaje:** 35 %.
- **Cinco productos dentro de esa categoría.**
- **Aporte predeterminado por producto:** 7 % del promedio final, con la configuración actual.
- **Proyecto integrador:** categoría independiente de 30 %.

La interfaz explica esta lógica antes de listar las evidencias.

## Prueba funcional de backend

Aprobado:

- Login estudiante.
- Login docente.
- Validación `/auth/me`.
- Guardado de progreso.
- Entrega de evidencia con archivo.
- Generación de SHA-256 de evidencia.
- Visualización de entrega por docente.
- Calificación y retroalimentación.
- Libro de calificaciones del estudiante.
- Descarga autenticada del archivo.
- Sesión firmada válida aunque se elimine la tabla heredada de sesiones.

## Persistencia

El código está preparado para PostgreSQL mediante `DATABASE_URL`.

**Condición obligatoria antes de usar datos académicos reales:**

El `/health` del backend desplegado debe devolver:

- `storage: "PostgreSQL"`
- `persistent: true`
- `databaseOk: true`
- `productionReady: true`

La configuración de `DATABASE_URL`, `NEXUS_SESSION_SECRET` y demás secretos se realiza en Render y no debe incluirse dentro del ZIP.

## Veredicto

El artefacto queda como **candidato final para piloto real**. Las correcciones derivadas de la auditoría estudiantil ya están incorporadas y verificadas. El único cierre externo pendiente es confirmar la persistencia PostgreSQL en el despliegue de Render.
