---
title: NEXUS 18 API
emoji: 🎓
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# NEXUS 18 · Candidata institucional para validación y despliegue

Conserva las capacidades consolidadas de NEXUS 15, 16 y 17. Nexus 18 corrige el promedio provisional y añade gobernanza/privacidad, accesibilidad técnica, respaldo-retención y soporte de validación empírica.

# NEXUS 18 · Piloto endurecido y validable

**Sí: conserva las mejoras de NEXUS 15 y NEXUS 16.**

# Misión NEXUS 18 · Plataforma académica autónoma

NEXUS 18 integra diseño instruccional, 26 sesiones, gamificación con propósito, metodologías activas, evaluación auténtica y analítica del aprendizaje. Esta edición gestiona tareas, evidencias, evaluación y trazabilidad dentro de NEXUS mediante FastAPI y almacenamiento propio.

## Arquitectura

- **Frontend:** portal docente y portal estudiante en `public/course`.
- **Backend incluido:** FastAPI en `backend/app.py`.
- **Datos:** SQLite local en `nexus_data/nexus18.sqlite3`.
- **Archivos de evidencias:** `nexus_data/uploads/`.
- **Sincronización:** API propia de NEXUS. Puede ejecutarse en una computadora del docente o en un servidor institucional.

## Evaluación NEXUS 18

Las actividades evaluables se vinculan explícitamente a una categoría y ponderación. La configuración inicial suma 100 %:

- Actividades de aprendizaje: 20 %.
- Retos de dominio: 15 %.
- Evidencias de aprendizaje: 35 %.
- Proyecto integrador: 30 %.

El pretest y postest se usan por defecto como **medición del cambio en el aprendizaje**, no como puntos de calificación. XP, NexoCoins, niveles e insignias no elevan la nota académica.

Las seis evidencias vienen predefinidas por misión, con categoría, resultado de aprendizaje y rúbrica. El docente puede personalizar la configuración desde **Evaluación y analítica**.

## Analítica pedagógica

El Centro de evaluación genera señales sobre baja participación, resultados menores al umbral, inactividad con avance incompleto y criterios de rúbrica con dificultad colectiva. Las recomendaciones son de acompañamiento y **no toman decisiones académicas automáticamente**.

## Puesta en marcha local

1. Instale Python 3.11 o superior.
2. Desde la carpeta del proyecto ejecute:

```bash
pip install -r backend/requirements.txt
```

3. Configure una contraseña docente antes de usarlo con estudiantes:

**PowerShell**
```powershell
$env:NEXUS_TEACHER_PASSWORD="una-contraseña-segura"
$env:NEXUS_COURSE_CODE="MI-CURSO-2026"
python run_nexus18.py
```

**macOS/Linux**
```bash
export NEXUS_TEACHER_PASSWORD="una-contraseña-segura"
export NEXUS_COURSE_CODE="MI-CURSO-2026"
python run_nexus18.py
```

4. Abra `http://localhost:8000`.

Para acceso desde otros equipos de la misma red, use la IP local de la computadora que ejecuta NEXUS, por ejemplo `http://192.168.1.20:8000`.

> En desarrollo local puede usarse la contraseña docente de demostración `cambiar-antes-de-publicar`. En `NEXUS_ENV=production` el servidor se negará a iniciar mientras no configure `NEXUS_TEACHER_PASSWORD`. El código inicial del curso es `NEXUS18`.

## Qué conserva de la versión anterior

Se mantienen las 26 sesiones, modo conducción, materiales proyectables, laboratorios Python/low-no-code, ruta estudiantil, historia, XP, logros, NexoCoins, tienda, retos, tabla cooperativa, instrumentos académicos y medición pre/post. La integración externa anterior fue retirada del paquete operativo.


## Novedades NEXUS 18

- Centro de preparación académica docente para las 30 lecciones.
- Centro de aprendizaje estudiantil con remediación, práctica autónoma y transferencia.
- Matriz de 20 indicadores de práctica docente con tratamiento diferenciado.
- Acuses estudiantiles autenticados con opción de no confirmar y observación.
- Registro documental docente y API de trazabilidad.
- Separación explícita entre percepción, trazabilidad objetiva y resultados de aprendizaje.
