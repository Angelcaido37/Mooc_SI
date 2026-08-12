# Configuración de Misión NEXUS v3

La aplicación abre inmediatamente en **modo demostración**. Para registrar usuarios, guardar expedientes y conectar Classroom debe desplegarse también en Firebase.

## 1. Crear el proyecto

1. Cree un proyecto en Firebase/Google Cloud.
2. Active Authentication > Proveedores > Google.
3. Cree Firestore y Storage.
4. Registre una aplicación web y copie su configuración en `public/course/firebase-config.js`.
5. Cambie `demoMode` a `false`.

## 2. Autorizar docentes

En Firestore cree manualmente el documento `roles/UID_DEL_DOCENTE` con:

```json
{"role":"teacher"}
```

No cree un selector público de rol docente. El UID aparece en Authentication después del primer acceso.

## 3. Desplegar reglas y aplicación

Instale Firebase CLI, seleccione el proyecto y ejecute `firebase deploy`. GitHub puede seguir conservando el código, pero Firebase Hosting/Functions ejecutará la autenticación, almacenamiento y conexión segura.

## 4. Configurar Classroom

1. Active Google Classroom API en Google Cloud.
2. Configure la pantalla de consentimiento OAuth como aplicación externa.
3. Durante el piloto, agregue docentes y estudiantes como usuarios de prueba.
4. Cree un cliente OAuth de tipo aplicación web.
5. Registre como redirección: `https://SU_DOMINIO/api/classroom/callback`.
6. Guarde secretos, sin escribirlos en archivos:

```bash
firebase functions:secrets:set GOOGLE_OAUTH_CLIENT_ID
firebase functions:secrets:set GOOGLE_OAUTH_CLIENT_SECRET
firebase functions:secrets:set GOOGLE_OAUTH_REDIRECT_URI
```

7. Cambie `classroomEnabled` a `true` en `firebase-config.js` y vuelva a desplegar.

## 5. Flujo previsto

- El docente conecta Classroom y crea las tareas desde Misión NEXUS.
- La aplicación conserva el vínculo entre sesión, evidencia y tarea.
- El estudiante guarda su avance en Firestore, sube la evidencia a Storage, la adjunta a la tarea y confirma la entrega.
- El docente califica y la función sincroniza la nota con Classroom.
- Si Google bloquea el permiso, la evidencia permanece guardada y se ofrece descarga/entrega manual.

## Privacidad

Solicite únicamente datos indispensables. Publique aviso de privacidad, periodo de conservación, mecanismo de rectificación/eliminación y responsable del tratamiento antes de incorporar estudiantes reales. No almacene contraseñas, tokens OAuth en el navegador ni claves privadas en GitHub.
