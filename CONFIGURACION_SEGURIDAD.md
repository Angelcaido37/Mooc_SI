# Activación segura de Misión NEXUS v4

## 1. Authentication

En Firebase Console abra **Authentication → Sign-in method → Google** y habilite el proveedor. En **Settings → Authorized domains** agregue `angelcaido37.github.io`.

## 2. Firestore

Cree la base de datos y publique el contenido de `firestore.rules`. Estas reglas impiden que un usuario se otorgue a sí mismo el rol docente.

## 3. Primer acceso y autorización docente

1. Inicie sesión una vez con la cuenta de Google que usará el docente.
2. En **Authentication → Users**, copie su UID.
3. En **Firestore → roles**, cree un documento cuyo identificador sea exactamente ese UID.
4. Agregue el campo `role`, tipo **string**, valor `teacher`.
5. Cierre sesión e ingrese otra vez. Sólo esa cuenta será enviada al portal docente.

Una cuenta sin documento de rol se considera estudiante. Aunque escriba `docente.html` en la barra de direcciones, la aplicación mantiene el contenido oculto y consulta el rol antes de renderizarlo.

## 4. Storage y Classroom

Esta entrega funciona sin Storage y no solicita actualizar el plan. Las evidencias se descargan y se entregan por el enlace normal de Classroom. La creación de tareas, entrega automática y sincronización de calificaciones requiere autorización de un administrador de Google Workspace; por eso permanece desactivada y no se simula.

## 5. Publicación en GitHub Pages

Reemplace la carpeta `public/course` del repositorio, confirme los cambios y espere la publicación. Después haga una recarga forzada o borre los datos del sitio para retirar el caché de versiones anteriores.

Pruebas mínimas:

- Abrir `docente.html` sin sesión: debe volver al acceso y no mostrar el guion.
- Entrar con una cuenta sin rol: debe abrir el portal estudiante.
- Escribir manualmente `docente.html` con esa cuenta: debe mostrar acceso denegado.
- Entrar con el UID autorizado: debe abrir el portal docente.
- Cerrar sesión: debe volver a la portada y permitir iniciar con otra cuenta.
