# Despliegue NEXUS 19 · GitHub Pages + Render

La estructura de despliegue se conserva respecto a NEXUS 18.x.

## Render / FastAPI
- Build: `pip install -r backend/requirements.txt`
- Start: `uvicorn backend.app:app --host 0.0.0.0 --port $PORT`
- Origen permitido: `https://angelcaido37.github.io`

## GitHub Pages
- Variable de Actions `NEXUS_API_BASE=https://nexus18-api.onrender.com/api` si se conserva el servicio actual.
- Source de Pages: GitHub Actions.
- El workflow publica `public/course`.

## Nota de persistencia
La API heredada usa SQLite. En un Web Service gratuito de Render el almacenamiento local no debe considerarse persistencia institucional definitiva. Antes de un uso real a escala, migre datos/evidencias a almacenamiento persistente externo y valide respaldos/restauración.
