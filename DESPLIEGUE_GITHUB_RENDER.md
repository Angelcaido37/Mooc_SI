# NEXUS 19 · GitHub Pages + Render

Este archivo conserva el nombre histórico para compatibilidad con pruebas y documentación anterior. La guía vigente es `DESPLIEGUE_NEXUS19_GITHUB_RENDER.md`.

## Frontend
GitHub Pages publica `public/course`. Configure la variable de Actions:

`NEXUS_API_BASE=https://nexus18-api.onrender.com/api`

## Backend Render
- Build Command: `pip install -r backend/requirements.txt`
- Start Command: `uvicorn backend.app:app --host 0.0.0.0 --port $PORT`
- `NEXUS_ALLOWED_ORIGINS=https://angelcaido37.github.io`
- `NEXUS_ENV=production`
- `NEXUS_COURSE_CODE=NEXUS18` por compatibilidad con el piloto actual.
- Configure `NEXUS_TEACHER_PASSWORD` como secreto.

Render puede desplegar automáticamente cada push al repositorio conectado.
