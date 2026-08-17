# NEXUS 18 · GitHub Pages + Hugging Face Spaces

## Arquitectura

- **GitHub**: repositorio maestro.
- **GitHub Pages**: frontend para estudiantes y docente.
- **Hugging Face Spaces (Docker)**: backend FastAPI.
- **SQLite**: almacenamiento de NEXUS. En CPU Basic gratuito el disco del Space puede ser efímero; úselo para pruebas/piloto técnico o configure persistencia antes de evidencias reales.

## 1. Crear repositorio GitHub

Suba el contenido completo de `NEXUS_18` a un repositorio.

En `Settings > Pages`, seleccione **GitHub Actions** como origen.

## 2. Crear Hugging Face Space

Cree un Space:
- SDK: **Docker**
- Hardware: CPU Basic para comenzar.
- Nombre sugerido: `nexus18-api`

El repositorio contiene `Dockerfile` y metadatos compatibles con Spaces.

## 3. Secrets del Space

En `Settings > Variables and secrets` configure como mínimo:

### Secret
`NEXUS_TEACHER_PASSWORD`
: contraseña robusta del docente.

`NEXUS_STUDENT_KEYS`
: JSON opcional con claves individuales, por ejemplo:
`{"alumno1@uan.edu.mx":"clave-1","alumno2@uan.edu.mx":"clave-2"}`

### Variables
`NEXUS_ENV=production`

`NEXUS_COURSE_CODE=NEXUS18`

`NEXUS_SESSION_HOURS=12`

`NEXUS_RETENTION_DAYS=730`

`NEXUS_PRIVACY_NOTICE_VERSION=NEXUS18-PRIV-1`

`NEXUS_ALLOWED_ORIGINS=https://TU-USUARIO.github.io`

Si su URL de Pages contiene un repositorio, el **origin** sigue siendo `https://TU-USUARIO.github.io`; no agregue la ruta `/repositorio`.

Opcional:
`NEXUS_DATA_DIR=/data`
solo cuando el Space tenga almacenamiento persistente montado en `/data`.

## 4. Probar el backend

Una vez construido el Space, pruebe:

`https://TU-USUARIO-nexus18-api.hf.space/health`

Debe devolver `ok: true` y `product: NEXUS 18`.

La API está bajo:

`https://TU-USUARIO-nexus18-api.hf.space/api`

## 5. Conectar GitHub Pages con Hugging Face

En el repositorio GitHub:

`Settings > Secrets and variables > Actions > Variables`

Cree:

`NEXUS_API_BASE=https://TU-USUARIO-nexus18-api.hf.space/api`

El workflow de GitHub Pages genera automáticamente `runtime-config.js`.

## 6. Despliegue automático de GitHub a Hugging Face

Para que cada `push` a `main` actualice también el Space:

### GitHub Secret
`HF_TOKEN`
: token de Hugging Face con permisos de escritura sobre el Space.

### GitHub Variable
`HF_SPACE_ID`
: `TU-USUARIO/nexus18-api`

El workflow `.github/workflows/deploy-huggingface.yml` sincroniza el repositorio.

## 7. Orden recomendado de primera publicación

1. Crear Space.
2. Configurar secrets/variables del Space.
3. Configurar `HF_TOKEN` y `HF_SPACE_ID` en GitHub.
4. Hacer push a `main`.
5. Esperar a que Hugging Face construya.
6. Probar `/health`.
7. Configurar `NEXUS_API_BASE` en GitHub.
8. Ejecutar nuevamente `Publicar NEXUS 18 en GitHub Pages`.
9. Abrir la URL de Pages y probar estudiante/docente.

## Persistencia: advertencia importante

El backend está preparado para `NEXUS_DATA_DIR`. Sin almacenamiento persistente, SQLite, evidencias y respaldos viven en el filesystem del Space y pueden perderse tras reconstrucciones o reinicios de infraestructura.

Para demostración y pruebas técnicas puede usarse así. **Antes de trabajar con calificaciones o evidencias reales de estudiantes, configure una capa persistente y una política de respaldo.**
