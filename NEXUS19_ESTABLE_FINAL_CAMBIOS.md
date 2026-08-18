# NEXUS 19 · Estable Final — cierre de usabilidad estudiantil

Se aplicaron los hallazgos prioritarios de la auditoría de experiencia estudiantil.

## Correcciones realizadas

- Menú del estudiante reducido de 19 a 7 decisiones principales.
- `26 sesiones` se integra dentro de **Mi ruta** y deja de competir como opción principal.
- `Centro de aprendizaje` deja de ser una ruta paralela: activación, práctica guiada, práctica autónoma, transferencia, remediación, errores frecuentes y demostración de dominio aparecen dentro de cada lección.
- Juegos, retos, leaderboard y tienda quedan agrupados en **Actividades y juegos**.
- Low/no-code y Python/FastAPI pasan a **Recursos y apoyo** con nombres orientados a tarea: **Laboratorio visual** y **Laboratorio de código**.
- Evidencias corrige el error visual del 35%: ahora distingue peso global de categoría y aporte predeterminado de cada producto.
- Menú móvil incorpora backdrop, cierre explícito, toque fuera, Escape y estado `aria-expanded`.
- La página inicial usa un CTA inequívoco: **Continuar donde me quedé** cuando existe progreso.
- Sesiones usan “lección principal” en vez de “recurso completo”.
- Videos externos curados aparecen en la sesión estudiantil cuando existen.
- Rutas heredadas `learn/...` siguen funcionando, pero abren la lección integrada.

## Criterio de producción

El código soporta PostgreSQL mediante `DATABASE_URL`. No usar calificaciones o evidencias reales hasta que `/health` del backend desplegado reporte `persistent: true`, `databaseOk: true` y `productionReady: true`.
