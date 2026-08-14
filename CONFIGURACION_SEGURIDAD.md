# Activación segura de Misión NEXUS

## 1. Authentication

En Firebase Console abra **Authentication → Sign-in method → Google** y habilite el proveedor. En **Settings → Authorized domains** agregue todos los dominios desde los que se abrirá la plataforma.

## 2. Firestore

Cree la base de datos y publique el contenido de `firestore.rules`. Las reglas impiden que una cuenta se otorgue a sí misma el rol docente, aíslan el progreso por estudiante y reservan las consultas agregadas para docentes autorizados.

La medición usa rutas protegidas integradas a la plataforma: el calendario se guarda en `coursework/nexusPilotConfig` por compatibilidad técnica, las respuestas estudiantiles en `progress/{uid}.measurementResponses` y las respuestas docentes en `teacherUsage/{uid}.measurementResponses`. El nombre interno del documento de calendario no se presenta en la interfaz.

Los vínculos de tareas creadas en Google Classroom se registran en `classroomAssignments`. Las cuentas docentes pueden consultar sus publicaciones y el alumnado sólo puede leer registros con estado `PUBLISHED`; las escrituras se realizan exclusivamente desde Firebase Functions.

## 3. Primer acceso y autorización docente

1. Inicie sesión una vez con la cuenta de Google que usará el docente.
2. En **Authentication → Users**, copie su UID.
3. En **Firestore → roles**, cree un documento cuyo identificador sea exactamente ese UID.
4. Agregue el campo `role`, tipo **string**, valor `teacher`.
5. Cierre sesión e ingrese otra vez.

Una cuenta sin documento de rol se considera estudiante. Aunque escriba `docente.html` en la barra de direcciones, la aplicación consulta el rol antes de renderizar contenido privado.

## 4. Classroom y archivos de evidencias

La creación de tareas usa OAuth y Firebase Functions. Siga `CONFIGURACION_FIREBASE_CLASSROOM.md` para habilitar la API, registrar el cliente OAuth y cargar los secretos. Los tokens no están disponibles para los clientes web mediante las reglas de Firestore.

Storage permanece desactivado: el estudiante adjunta y entrega sus archivos directamente en Google Classroom. De este modo NEXUS no duplica documentos ni solicita un servicio adicional para evidencias.

## 5. Publicación

Desde PowerShell, dentro de la carpeta del proyecto, ejecute:

```powershell
npx firebase-tools deploy --only functions,firestore:rules,hosting --project mooc-505320
```

Después haga una recarga forzada para sustituir la caché anterior.

Pruebas mínimas:

- Abrir `docente.html` sin sesión: debe volver al acceso y no mostrar el guion.
- Entrar con una cuenta sin rol: debe abrir el portal estudiante.
- Escribir manualmente `docente.html` con esa cuenta: debe mostrar acceso denegado.
- Entrar con el UID autorizado: debe abrir el portal docente.
- Publicar una actividad de prueba en un curso controlado y verificarla con una cuenta estudiantil.
- Desconectar Classroom y confirmar que las tareas existentes permanecen en Google.
