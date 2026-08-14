# Activación de Google Classroom en Misión NEXUS

NEXUS permite que una cuenta con rol docente conecte Google Classroom, seleccione un curso activo y publique la actividad correspondiente a una sesión. El alumnado abre la tarea desde su portal NEXUS y adjunta o entrega sus archivos directamente en Classroom.

La conexión utiliza OAuth en Firebase Functions. Los tokens de actualización se guardan en Firestore con acceso exclusivo del servidor: no se escriben en el navegador ni en el repositorio.

## 1. Habilitar la API

1. Abra Google Cloud Console con el proyecto `mooc-505320`.
2. Entre en **APIs y servicios → Biblioteca**.
3. Busque y habilite **Google Classroom API**.

## 2. Configurar el consentimiento OAuth

En **Google Auth Platform** complete Branding, Audience y Data Access.

- Use el nombre visible **Misión NEXUS**.
- Elija **Internal** si sólo participarán cuentas de la misma organización Google Workspace y la política institucional lo permite.
- Elija **External** si participarán cuentas externas. Durante la configuración agregue las cuentas autorizadas; antes de un uso amplio puede requerirse la verificación de Google.
- Registre estos alcances exactos:
  - `https://www.googleapis.com/auth/classroom.courses.readonly`
  - `https://www.googleapis.com/auth/classroom.coursework.students`

La administración de Google Workspace puede exigir que la aplicación y sus alcances se marquen como confiables.

## 3. Crear el cliente OAuth

1. En **Clients**, cree un cliente de tipo **Web application**.
2. Registre como URI de redirección autorizada:

```text
https://mooc-505320.web.app/api/classroom/callback
```

Si se publicará con otro dominio de Firebase Hosting, agregue también su URI equivalente terminada en `/api/classroom/callback`.

3. Copie el Client ID y el Client secret. No los incluya en archivos del proyecto.

## 4. Guardar los secretos en Firebase

Abra PowerShell dentro de la carpeta descomprimida y ejecute:

```powershell
npx firebase-tools functions:secrets:set GOOGLE_OAUTH_CLIENT_ID --project mooc-505320
npx firebase-tools functions:secrets:set GOOGLE_OAUTH_CLIENT_SECRET --project mooc-505320
npx firebase-tools functions:secrets:set GOOGLE_OAUTH_REDIRECT_URI --project mooc-505320
```

Firebase solicitará cada valor. Para `GOOGLE_OAUTH_REDIRECT_URI` escriba exactamente:

```text
https://mooc-505320.web.app/api/classroom/callback
```

## 5. Desplegar la integración

Desde la misma carpeta ejecute:

```powershell
npx firebase-tools deploy --only functions,firestore:rules,hosting --project mooc-505320
```

El despliegue publica el backend OAuth, las reglas que protegen las tareas y la interfaz actualizada.

## 6. Conectar y publicar

1. Ingrese a **Portal docente → Classroom**.
2. Pulse **Conectar Google Classroom** y autorice los permisos solicitados.
3. Elija un curso activo y una sesión NEXUS.
4. Revise título, instrucciones, fecha límite, hora y puntuación.
5. Confirme la publicación y pulse **Publicar actividad**.
6. NEXUS crea una tarea para todo el grupo y muestra el enlace en el historial docente y en **Tareas en Classroom** del portal estudiantil.

Después de cerrar una sesión en **Modo Conducción**, el botón **Publicar actividad en Classroom** abre este mismo formulario con la sesión seleccionada.

## Verificación mínima

- La cuenta docente ve únicamente los cursos donde Google la reconoce como docente.
- La tarea aparece en el tablón de Classroom con estado publicado.
- Una cuenta estudiantil ve el enlace desde NEXUS y puede adjuntar y entregar archivos en Classroom.
- Desconectar Classroom elimina del servidor los tokens de esa cuenta, sin borrar las tareas ya publicadas.

## Privacidad y operación

Solicite sólo los permisos necesarios, publique el aviso de privacidad institucional y documente el periodo de conservación. No almacene contraseñas, tokens OAuth en el navegador ni claves privadas en el repositorio. La entrega y los archivos permanecen bajo los controles de Google Classroom; NEXUS conserva sólo los metadatos necesarios para enlazar la sesión con la tarea publicada.
