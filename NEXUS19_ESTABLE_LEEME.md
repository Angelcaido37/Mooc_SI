# NEXUS 19 · Edición estable

Esta edición consolida NEXUS 19 sin cambiar su arquitectura pedagógica. El objetivo de esta compilación es que el flujo GitHub Pages → Render funcione de forma consistente y que, al activar una base PostgreSQL externa, los datos sobrevivan a los redeploys de Render.

## Qué se corrigió

- Sesiones firmadas y sin dependencia de la tabla SQLite de sesiones. Un redeploy no debe producir por sí solo el mensaje «Sesión inválida».
- Todas las llamadas del frontend usan la URL remota configurada en `NEXUS_API_BASE`; se corrigieron rutas que podían terminar en `/api/api/...` o intentar llamar `/api/...` dentro de GitHub Pages.
- Entrega y descarga de evidencias usan el backend remoto correctamente.
- Los archivos de evidencia se guardan dentro de la base de datos y reciben SHA-256. Así, al usar PostgreSQL, no dependen del disco efímero de Render.
- La tabla de posiciones tiene un endpoint autenticado que no expone nombres, correos ni calificaciones.
- La vista estudiante abierta desde una cuenta docente no guarda accidentalmente progreso como si el docente fuera estudiante.
- La calificación se valida entre 0 y 100 y los enlaces de evidencia sólo aceptan `http://` o `https://`.
- El Centro institucional muestra si backend, persistencia y preparación de producción están realmente activos.
- Se mantiene la arquitectura pedagógica de NEXUS 19: Preparar → Conducir → Evaluar → Analizar → Mejorar, con recursos contextualizados e interactivos.

## 1. GitHub Pages

En el repositorio, conserve la variable de Actions:

```text
NEXUS_API_BASE=https://nexus18-api.onrender.com/api
```

En `Settings → Pages`, la fuente debe seguir siendo `GitHub Actions`.

## 2. Render

Build Command:

```text
pip install -r backend/requirements.txt
```

Start Command:

```text
uvicorn backend.app:app --host 0.0.0.0 --port $PORT
```

Variables recomendadas:

```text
NEXUS_ENV=production
NEXUS_COURSE_CODE=NEXUS18
NEXUS_TEACHER_PASSWORD=<contraseña docente fuerte>
NEXUS_SESSION_SECRET=<cadena aleatoria larga y estable>
NEXUS_SESSION_HOURS=12
NEXUS_RETENTION_DAYS=730
NEXUS_PRIVACY_NOTICE_VERSION=NEXUS19-PRIV-1
NEXUS_ALLOWED_ORIGINS=https://angelcaido37.github.io
NEXUS_MAX_UPLOAD_MB=2
DATABASE_URL=<cadena de conexión PostgreSQL de Neon>
```

`NEXUS_SESSION_SECRET` debe conservarse sin cambios entre despliegues. Si no se define, NEXUS deriva una firma de la contraseña docente y del código del curso, pero es preferible configurarla explícitamente.

## 3. Persistencia

Sin `DATABASE_URL`, NEXUS continúa funcionando con SQLite para pruebas, pero `/health` mostrará:

```json
{"persistent": false, "productionReady": false}
```

Con PostgreSQL configurado correctamente debe mostrar:

```json
{"storage": "PostgreSQL", "persistent": true, "databaseOk": true, "productionReady": true}
```

No use datos académicos reales hasta obtener esos cuatro indicadores.

## 4. Prueba final obligatoria

Después del despliegue:

1. Abra `/health` y confirme `persistent: true` y `productionReady: true`.
2. Inicie sesión como estudiante.
3. Abra una actividad interactiva y guarde avance.
4. Entregue una evidencia con texto y, de ser posible, un archivo pequeño.
5. Entre como docente y confirme que la evidencia aparece.
6. Descargue el archivo desde el panel docente.
7. Califique con rúbrica y confirme que el estudiante ve la retroalimentación.
8. Abra Trazabilidad y registre una evidencia SHA-256.
9. Abra Medición y confirme que no aparece «Sesión inválida».
10. Abra Centro institucional y confirme tres indicadores en estado correcto.
11. Fuerce un redeploy de Render y compruebe que el avance, evidencia y calificación siguen disponibles.

El paso 11 es el que valida que la persistencia está realmente resuelta.
