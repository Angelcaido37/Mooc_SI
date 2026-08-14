# Guía del Modo Conducción de Clase · NEXUS v13

## Propósito

El Modo Conducción convierte la planeación académica existente en una microplaneación universitaria operativa. Presenta sólo la información necesaria en cada momento de una sesión de 100 minutos, pero mantiene disponible el guion completo y permite adaptar tiempos, recursos e intervenciones.

No es un libreto obligatorio. Las frases son sugeridas y las comprobaciones ayudan a decidir si conviene avanzar, explicar de otra manera o activar el plan B.

## Antes de clase

1. Entre al portal docente y seleccione **Conducir clase**.
2. Abra la sesión correspondiente.
3. Revise el propósito, la distribución teórico-práctica y la lista de preparación.
4. Abra o descargue el cuaderno PDF, instrumento editable, laboratorio y bitácora.
5. Mantenga disponible el plan B si no habrá conexión o falla un recurso.

La lista se conserva en el navegador y se sincroniza con la cuenta docente cuando las reglas de Firestore están publicadas.

## Durante los 100 minutos

Cada sesión conserva seis momentos:

| Momento | Tiempo base | Decisión docente principal |
| --- | ---: | --- |
| Activación y diagnóstico | 10 min | Recuperar ideas iniciales sin anticipar la respuesta. |
| Explicación dialogada | 25 min | Explicar por segmentos y comprobar comprensión. |
| Ejemplo comentado | 15 min | Hacer visible el procedimiento y sus límites. |
| Ejercicio guiado | 30 min | Observar, preguntar y retroalimentar sin resolver por el grupo. |
| Revisión y contraste | 10 min | Comparar soluciones y corregir con criterios. |
| Cierre, salida y consigna | 10 min | Verificar aprendizaje y continuidad independiente. |

En cada momento la pantalla presenta:

- qué hace y qué puede decir el docente;
- qué hacen los estudiantes;
- respuestas o desempeños esperados;
- intervención ante dificultades;
- recurso necesario;
- comprobación antes de avanzar;
- transición sugerida al siguiente momento;
- plan B sin conexión;
- nota rápida de campo.

El cronómetro puede pausarse. Los botones **− 5 min** y **+ 5 min** recalculan el horario de toda la sesión; ningún momento puede quedar por debajo de cinco minutos.

## Después de clase

Registre brevemente:

- qué logró el grupo;
- principal dificultad;
- ajuste para la próxima aplicación;
- incidencias;
- nivel de logro del propósito;
- tiempo de preparación ahorrado;
- utilidad, claridad y apoyo a decisiones;
- si realizó una acción de acompañamiento.

Al finalizar se guarda una bitácora docente y puede descargarse en texto. En Analítica también puede exportarse el conjunto de bitácoras en CSV.

## Cómo evaluar el Modo Conducción durante el semestre

Utilice `instrumentos/evaluacion_modo_conduccion_v13.xlsx` en las semanas 1, 8 y 16. Observe seis tareas: preparar materiales, operar el cronómetro, localizar apoyos pedagógicos, ajustar el tiempo, activar el plan B y cerrar la bitácora.

Indicadores sugeridos:

- 90% o más de tareas completadas;
- utilidad, claridad y facilidad de adaptación de 4/5 o más;
- carga mental de 3/5 o menos al cierre;
- reducción del tiempo y de la ayuda requerida entre semanas 1 y 16;
- evidencia cualitativa de decisiones pedagógicas apoyadas por la plataforma.

Estos indicadores evalúan la plataforma y la planeación. No deben utilizarse para calificar automáticamente a docentes o estudiantes.

## Activación técnica

Además de publicar `public/course`, publique la versión incluida de `firestore.rules`. La colección `teacherSessionLogs` sólo permite lectura y escritura a la cuenta docente propietaria. Después de actualizar el sitio, recargue forzosamente el navegador para sustituir el caché de la versión anterior.
