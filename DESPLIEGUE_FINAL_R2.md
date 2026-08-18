# NEXUS 19 FINAL R2 — despliegue correcto

Este paquete debe sustituir **la raíz del repositorio**, no agregarse como una carpeta dentro del repositorio.

Después de descomprimir, en la raíz de GitHub deben verse directamente: `.github/`, `backend/`, `public/`, `package.json`, etc.

Si aparece una carpeta `NEXUS_19_.../` dentro del repositorio y debajo están `backend/` y `public/`, el workflow seguirá publicando la versión anterior.

## Comprobación visual
- Portal docente: debe mostrar `NEXUS 19 · FINAL R2` y la opción `Comunicación`.
- Portal estudiante: debe mostrar `NEXUS 19 · FINAL R2`, un icono ✉ en la barra superior y `Mensajes` en el menú lateral.
- `verificar-despliegue.html` confirma frontend, backend y persistencia.

## Persistencia
`SQLite temporal` no es un error de conexión. Significa que Render no tiene `DATABASE_URL` configurada. Para datos reales configure PostgreSQL (por ejemplo Neon) y redepliegue.
