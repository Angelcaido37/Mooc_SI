# Medición semestral integrada · NEXUS v15

## Qué cambió

Los instrumentos dejaron de depender únicamente de archivos CSV. Ahora se aplican dentro de NEXUS, se guardan en Firestore y alimentan el tablero docente. Los CSV y el XLSX se conservan como respaldo para una aplicación externa o una auditoría.

## Calendario de aplicación

| Fase | Estudiante | Docente |
|---|---|---|
| Semanas 1–2 | Diagnóstico de 12 conocimientos, autoeficacia y motivación | Línea base de preparación, confianza y expectativas |
| Semanas 4–5 | Claridad, narrativa, reglas, retroalimentación y seguridad para aprender | Utilidad, claridad, carga, decisiones y tiempo ahorrado |
| Semanas 8–9 | Autorregulación, motivación, funcionamiento y carga | Usabilidad del Modo Conducción, adaptación y plan B |
| Semanas 12–13 | Compromiso, transferencia, apoyo y permanencia | Acompañamiento, alineación y sostenibilidad |
| Semanas 15–16 | Posprueba equivalente y experiencia final | Evaluación final de la plataforma por el docente |

La fecha de inicio se configura en **Portal docente → Medición y resultados → Calendario del piloto**. NEXUS calcula la semana vigente y abre únicamente los instrumentos correspondientes.

## Información automática

NEXUS continúa recopilando los datos operativos que ya generaba:

- accesos, visitas y última ubicación;
- avance y lecciones completadas;
- tiempo visible aproximado;
- intentos y aciertos en controles;
- retos, metas y laboratorios;
- consultas del portal docente;
- aperturas y cierres del Modo Conducción;
- uso del plan B, reflexiones y bitácoras.

Estos registros no se interpretan como aprendizaje por sí solos. El tablero los presenta separados de las respuestas declaradas y de la comparación pre/post.

## Resultados disponibles

El tablero muestra:

1. cobertura de cada aplicación;
2. promedio de conocimiento inicial y final entre participantes emparejados;
3. cambio medio en puntos porcentuales;
4. autoeficacia y motivación pre/post;
5. promedios de experiencia por dimensión, en escala de 1 a 5;
6. utilidad, claridad, adaptabilidad y apoyo a decisiones docentes;
7. datos automáticos de uso y conducción;
8. exportación CSV seudonimizada.

## Privacidad e interpretación

- La decisión de participar no modifica calificación, acceso, XP o recompensas.
- Las preguntas abiertas solicitan no incluir datos personales.
- Las exportaciones usan códigos `E001`, `E002`, etcétera.
- La comparación pre/post sólo utiliza registros de la misma persona en ambos momentos.
- Una diferencia observada no demuestra causalidad. Debe contrastarse con evidencias, rúbricas, observación, bitácoras y contexto del grupo.

## Publicación indispensable

Al actualizar desde v14:

1. sustituya la carpeta completa `public/course`;
2. publique el archivo raíz `firestore.rules`;
3. recargue la aplicación hasta verificar la etiqueta `v15`;
4. configure la fecha de inicio desde el portal docente.

Las nuevas colecciones son `pilotConfig`, `studentInstrumentResponses` y `teacherInstrumentResponses`. Las reglas permiten al estudiante escribir únicamente su propio registro y reservan la lectura agregada para cuentas con rol docente.
