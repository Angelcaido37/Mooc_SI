# NEXUS 19 · Sistema universitario de conducción del aprendizaje

NEXUS 19 reorganiza la plataforma alrededor de cinco momentos: **preparar, conducir, evaluar, analizar y mejorar**. Conserva el backend FastAPI, evidencias, rúbricas, ponderaciones, analítica, gamificación, trazabilidad y portales docente/estudiante de NEXUS 18.x, pero sustituye la lógica de guiones redundantes por una **planeación universitaria ejecutable**.

## Principio central

> Todo aquello que el docente necesita para ejecutar una acción debe estar disponible exactamente en el momento en que NEXUS le indica realizarla.

El equivalente para el estudiante también aplica: cada lectura, actividad, interactivo, práctica o evidencia se entrega en el punto de la ruta en que se necesita.

## Qué incorpora NEXUS 19

- **Manual docente de 26 sesiones** para preparar la clase: profundidad disciplinar, errores frecuentes, preguntas previsibles, mediación, técnica, recursos y criterios.
- **Conducir clase** como orquestador en tiempo real: cada fase abre la diapositiva exacta, lectura, técnica, video/microlección, interactivo o apoyo docente sin perder el punto de la sesión.
- **Material proyectable ampliado**: 13 láminas base por sesión, 338 láminas generadas para las 26 sesiones.
- **Motor de actividades interactivas**: sopa de conceptos, emparejamiento, secuenciación, escape room, tarjetas de repaso, drag and drop, mapa mental, sudoku conceptual, ruleta, decisiones ramificadas, quiz, simulador de umbral y constructores guiados.
- **Alineamiento pedagógico**: resultado de aprendizaje → técnica → recurso → actividad → evidencia → criterio → retroalimentación → analítica/intervención.
- **Evaluación configurable** por categorías y ponderaciones, con rúbricas y evidencias predefinidas editables.
- **Analítica pedagógica** que separa participación, cumplimiento, desempeño y aprendizaje.
- **Trazabilidad** con fecha/hora, versión de recurso y SHA-256 en los registros documentales instrumentados.
- **Diseño visual profesional y responsive**, con navegación docente simplificada en antes/durante/después.

## Arquitectura de despliegue recomendada para este paquete

```text
GitHub Pages
  └─ Frontend: public/course
          │ HTTPS
          ▼
Render
  └─ FastAPI: backend/app.py
          │
          ▼
Persistencia actual del piloto: SQLite
```

### GitHub Pages

Configure en el repositorio:

- `Settings → Pages → Source: GitHub Actions`
- `Settings → Secrets and variables → Actions → Variables`
- Variable: `NEXUS_API_BASE`
- Valor actual del piloto: `https://nexus18-api.onrender.com/api`

El workflow `.github/workflows/deploy-pages.yml` publica `public/course`.

### Render

Configuración del Web Service:

```text
Build Command:
pip install -r backend/requirements.txt

Start Command:
uvicorn backend.app:app --host 0.0.0.0 --port $PORT
```

Variables mínimas de producción:

```text
NEXUS_ENV=production
NEXUS_COURSE_CODE=NEXUS18
NEXUS_TEACHER_PASSWORD=<secreto>
NEXUS_SESSION_HOURS=12
NEXUS_RETENTION_DAYS=730
NEXUS_PRIVACY_NOTICE_VERSION=NEXUS18-PRIV-1
NEXUS_ALLOWED_ORIGINS=https://angelcaido37.github.io
```

`NEXUS_COURSE_CODE=NEXUS18`, el nombre del archivo SQLite y la clave local `nexus18-token` se conservan por compatibilidad con los datos y accesos ya configurados; **no significan que el producto siga siendo NEXUS 18**.

## Persistencia: advertencia importante

La edición actual conserva SQLite para no romper el piloto existente. El disco local de un servicio gratuito no debe asumirse como persistencia institucional definitiva. Antes de usar NEXUS con calificaciones y evidencias reales a escala, migre la base y los archivos a almacenamiento persistente externo y pruebe respaldo/restauración.

## Ejecución local

```bash
pip install -r backend/requirements.txt
```

PowerShell:

```powershell
$env:NEXUS_TEACHER_PASSWORD="una-contraseña-segura"
$env:NEXUS_COURSE_CODE="NEXUS18"
python run_nexus18.py
```

macOS/Linux:

```bash
export NEXUS_TEACHER_PASSWORD="una-contraseña-segura"
export NEXUS_COURSE_CODE="NEXUS18"
python run_nexus18.py
```

Abra `http://localhost:8000`.

## Validación del paquete

```bash
npm test
```

La suite incluye regresiones de NEXUS 15–18.x y pruebas específicas de la arquitectura pedagógica de NEXUS 19: aprovisionamiento de las 26 sesiones, recursos contextuales, motor interactivo y separación de respuestas privadas del docente.

Consulte también:

- `NEXUS19_ARQUITECTURA_PEDAGOGICA.md`
- `NEXUS19_CAMBIOS_DESDE_18_3.md`
- `NEXUS19_RECURSOS_CURADOS.md`
- `DESPLIEGUE_NEXUS19_GITHUB_RENDER.md`
- `NEXUS19_VALIDACION.txt`
