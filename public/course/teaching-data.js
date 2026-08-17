(() => {
  const course=window.NEXUS_COURSE;
  const lesson=id=>course.units.flatMap(u=>u.lessons).find(l=>l.id===id);
  const S=(number,unit,title,lessonIds,theoryMinutes,independentMinutes,focus,trigger,guided,product,game,lab)=>{
    const lessons=lessonIds.map(lesson).filter(Boolean);
    return {
      id:`s${number}`,number,unit,title,lessonIds,theoryMinutes,
      practiceMinutes:100-theoryMinutes,independentMinutes,focus,trigger,guided,product,game,lab,
      objective:lessons.map(l=>l.objective).join(" "),
      explanation:lessons.flatMap(l=>l.theory).slice(0,5),
      example:lessons.map(l=>l.example).join(" "),
      misconceptions:[
        `Confundir ${title.toLowerCase()} con una receta que funciona igual en cualquier contexto.`,
        "Aceptar una salida correcta sin poder explicar el procedimiento, los datos y sus límites.",
        "Evaluar sólo el caso ideal y omitir casos límite, errores y responsabilidad humana."
      ],
      reflection:[trigger,`¿Qué evidencia necesitaríamos para sostener la decisión central de “${title}”?`,`¿Qué debería hacer el sistema cuando la evidencia es insuficiente?`],
      timeline:[
        ["Activación y diagnóstico",10,trigger],
        ["Explicación dialogada",25,focus],
        ["Ejemplo comentado",15,lessons[0]?.example||focus],
        ["Ejercicio guiado",30,guided],
        ["Revisión y contraste",10,"Comparar estrategias, justificar diferencias y corregir errores frecuentes."],
        ["Cierre y consigna independiente",10,`Registrar la conclusión y preparar: ${product}`]
      ],
      independent:[
        ["Repaso activo",Math.round(independentMinutes*.22),`Revisar las lecciones ${lessonIds.join(", ")} y elaborar una síntesis de cinco ideas con un ejemplo propio.`],
        ["Entrenamiento",Math.round(independentMinutes*.30),`Resolver una variante de: ${guided}`],
        ["Juego o laboratorio",Math.round(independentMinutes*.18),`Completar ${game} y registrar un error que la retroalimentación ayudó a corregir.`],
        ["Evidencia o proyecto",independentMinutes-Math.round(independentMinutes*.22)-Math.round(independentMinutes*.30)-Math.round(independentMinutes*.18),product]
      ],
      exit:["Explica la decisión más importante de la sesión en una frase.","Menciona un caso en el que el método fallaría.","Escribe una duda concreta o una prueba que todavía falta."],
      teacherChecklist:["Abrir el recurso proyectable y probar el interactivo antes de la sesión.","Preparar equipos o parejas y distribuir el archivo de trabajo.","No mostrar la solución antes de la primera propuesta estudiantil.","Cerrar indicando exactamente qué continúa en la ruta independiente y qué se entrega en NEXUS."]
    };
  };

  const sessions=[
    S(1,"u1","IA, automatización y problemas pertinentes",["u1l1"],60,90,"Diferenciar automatización, modelo, sistema y producto; decidir cuándo una regla simple es suficiente.","¿Todo proceso que toma una decisión puede llamarse inteligente?","Clasificar ocho soluciones universitarias y defender cuáles requieren IA, cuáles sólo automatización y cuáles no conviene construir.","Ficha de un problema real con versión sin IA y versión con IA.","Radar IA o automatización","Lienzo de problema"),
    S(2,"u1","Enfoques simbólico, predictivo, generativo y agéntico",["u1l2"],50,90,"Comparar qué resuelve cada enfoque, qué datos necesita y qué tipo de error produce.","¿Usar un modelo más nuevo garantiza una mejor solución?","Descomponer un orientador académico híbrido en reglas, predicción, generación, herramientas y autorización humana.","Tabla comparativa y arquitectura híbrida preliminar.","Memorama de enfoques","Constructor de arquitectura"),
    S(3,"u1","Agentes y ciclo percepción-acción",["u1l3"],45,90,"Reconocer sensor, estado, política, acción, retroalimentación y fallo seguro.","¿Un chatbot es necesariamente un agente?","Representar el ciclo de un agente de atención estudiantil y simular tres rondas con información incompleta.","Diagrama percepción-razonamiento-acción con escalamiento.","Preguntas relámpago","Simulador de agente"),
    S(4,"u1","PEAS, entorno y responsabilidad humana",["u1l4","u1l5"],45,90,"Especificar desempeño, entorno, actuadores y sensores; delimitar permisos y supervisión significativa.","¿Qué ocurre cuando medimos éxito con una meta sustituta equivocada?","Completar PEAS para el caso elegido, clasificar el entorno y someterlo a un caso fuera de alcance.","Evidencia 1: análisis del caso y diseño PEAS.","Jeopardy de agentes","Lienzo PEAS"),

    S(5,"u2","Hechos, proposiciones y predicados",["u2l1"],50,84,"Formalizar conocimiento sin confundir ausencia de evidencia con negación.","¿Cómo representaría una computadora la frase «el estudiante puede titularse»?","Traducir un fragmento de reglamento a entidades, cinco hechos, tres predicados y supuestos explícitos.","Base de conocimiento inicial con procedencia y vigencia.","Sopa lógica","Editor de hechos"),
    S(6,"u2","Reglas, tablas y cadenas de inferencia",["u2l2"],50,84,"Aplicar encadenamiento hacia adelante y atrás y verificar cobertura de una tabla de decisión.","¿Una larga colección de condicionales constituye por sí sola un sistema experto?","Ejecutar dos cadenas de inferencia, registrar cada regla activada y detectar una combinación ausente.","Tabla de decisión y traza de inferencia.","Serpientes y escaleras lógico","Motor de reglas"),
    S(7,"u2","Ontologías y grafos de conocimiento",["u2l3"],45,84,"Modelar clases, instancias y relaciones con alcance controlado.","¿Qué información se pierde cuando todo se guarda en una sola tabla?","Construir un grafo de doce nodos y formular cinco preguntas que puedan responderse siguiendo relaciones.","Grafo de conocimiento con consultas y límites.","Memorama de relaciones","Constructor de grafos"),
    S(8,"u2","BFS, DFS y A* paso a paso",["u2l4"],40,84,"Comparar frontera, visitados, completitud, optimalidad, tiempo y memoria.","¿Por qué encontrar una ruta no significa haber encontrado la mejor ruta?","Resolver el mismo grafo con BFS, DFS y A*: registrar frontera y visitados en cada iteración y comparar el costo final.","Bitácora reproducible de tres búsquedas.","Carrera de búsqueda","Simulador BFS-DFS-A*"),
    S(9,"u2","Minimax, heurísticas e integración híbrida",["u2l5"],40,84,"Interpretar decisiones adversariales y combinar reglas con componentes generativos sin perder control.","¿Una buena heurística siempre conduce a la solución óptima?","Evaluar un árbol de juego de tres niveles, propagar utilidades y proponer una capa generativa que explique sin modificar la decisión.","Evidencia 2: representación y resolución explicable.","Jeopardy del conocimiento","Árbol Minimax"),

    S(10,"u3","Del modelo validado a la política",["u3l1"],45,90,"Separar score, recomendación, decisión, acción y responsabilidad.","¿Una probabilidad de 0.80 autoriza automáticamente una acción?","Convertir tres scores en políticas alternativas y localizar dónde se requiere regla, revisión o abstención.","Diagrama modelo-política-persona-acción.","Decide o escala","Constructor de políticas"),
    S(11,"u3","Probabilidad, confianza y calibración",["u3l2"],40,90,"Interpretar probabilidad sin convertirla en certeza y leer una tabla de calibración.","¿Ochenta por ciento de confianza significa que el sistema tiene razón en ocho de cada diez casos?","Agrupar veinte predicciones por rango, comparar frecuencia observada y redactar una explicación honesta para el usuario.","Nota de interpretación y advertencias de uso.","Verdadero, falso o depende","Laboratorio de calibración"),
    S(12,"u3","Umbrales, costos y consecuencias",["u3l3"],35,90,"Comparar falsos positivos y falsos negativos mediante una matriz de costos y capacidad operativa.","¿Existe un umbral correcto para todos los contextos?","Calcular resultados y costo esperado de tres umbrales; defender uno ante otro equipo que representa a usuarios afectados.","Matriz de costos y recomendación de umbral.","Serpientes y escaleras de decisiones","Simulador de umbral"),
    S(13,"u3","Abstención, escalamiento, deriva y monitoreo",["u3l4","u3l5"],30,90,"Diseñar una política de tres zonas, protocolo de caída e indicadores de deriva.","¿Abstenerse es un fallo o una conducta inteligente?","Someter la política a datos faltantes, cambio de formulario, volumen excesivo y caso urgente; decidir continuar, limitar o suspender.","Evidencia 3: política bajo incertidumbre y plan de monitoreo.","Escape de la zona gris","Tablero de monitoreo"),

    S(14,"u4","De la señal al percepto",["u4l1"],40,105,"Rastrear captura, digitalización, preprocesamiento, inferencia e interpretación.","¿Una cámara ve objetos o registra valores que un modelo interpreta?","Desarmar una cadena perceptiva e identificar en qué etapa nacen cinco errores observables.","Mapa sensor-representación-modelo-decisión.","Sopa de percepción","Cadena perceptiva"),
    S(15,"u4","Imagen y visión-lenguaje",["u4l2"],40,105,"Distinguir clasificación, detección, segmentación y descripción; diseñar variaciones de captura.","¿Una descripción fluida de una imagen demuestra que todos sus detalles son reales?","Probar un componente preconstruido con iluminación, fondo, ángulo y oclusión; registrar salida, confianza y causa probable.","Matriz de diez pruebas visuales.","Memorama visual","Banco de pruebas de imagen"),
    S(16,"u4","Audio, voz y postura",["u4l3"],35,105,"Evaluar ruido, distancia, diversidad de habla, oclusión y alternativas accesibles.","¿Puede inferirse emoción de una voz o postura sin contexto adicional?","Diseñar y ejecutar una prueba factorial pequeña con dos niveles de ruido, dos distancias y un canal alternativo.","Reporte de robustez y accesibilidad.","Jeopardy multimodal","Banco de pruebas de audio/postura"),
    S(17,"u4","Fusión multimodal, privacidad y diseño inclusivo",["u4l4","u4l5"],35,105,"Gestionar contradicción entre modalidades, minimización, consentimiento y criterio de no despliegue.","¿Agregar más sensores siempre mejora un sistema?","Resolver cuatro conflictos texto-imagen y aplicar una evaluación de necesidad a un dato biométrico.","Evidencia 4: experiencia perceptiva o multimodal.","Reto de señales contradictorias","Diseñador multimodal"),

    S(18,"u5","Cómo genera un LLM",["u5l1"],50,108,"Explicar tokens, contexto, atención y generación probabilística sin atribuir verdad automática.","¿Por qué una respuesta incorrecta puede sonar completamente convincente?","Reconstruir una generación token a token y distinguir conocimiento aparente, recuperación y ejecución de herramienta.","Modelo conceptual del LLM y límites de la analogía.","Preguntas relámpago LLM","Simulador de tokens"),
    S(19,"u5","Instrucciones, contexto y salidas estructuradas",["u5l2"],50,108,"Diseñar instrucciones verificables, separar autoridades y validar esquemas de salida.","¿Un prompt largo es necesariamente un buen prompt?","Mejorar una instrucción ambigua, definir JSON esperado y probar dato faltante, contradicción y solicitud fuera de alcance.","Plantilla de instrucción y esquema validable.","Jeopardy de prompts","Taller de prompts"),
    S(20,"u5","Embeddings, fragmentación y recuperación",["u5l3"],45,108,"Relacionar similitud, autoridad, metadatos y estrategias de fragmentación.","¿El fragmento más parecido es siempre la fuente correcta?","Fragmentar un reglamento de dos maneras, ejecutar diez consultas y medir si la evidencia correcta aparece en top-3.","Corpus preparado, metadatos y evaluación de recuperación.","Memorama RAG","Laboratorio visual RAG"),
    S(21,"u5","Arquitectura RAG, citas y evaluación",["u5l4"],40,108,"Separar fallos de recuperación, generación, fundamento y citación.","¿Una respuesta con cita puede estar mal fundamentada?","Construir un flujo RAG visual y probar preguntas respondibles, no respondibles, ambiguas y contradictorias.","Matriz de evaluación RAG con abstención.","Rescate RAG","Constructor no-code RAG"),
    S(22,"u5","Agentes, herramientas, memoria y seguridad",["u5l5"],40,108,"Aplicar lista de permisos, validación de parámetros, confirmación y defensa ante inyección.","¿Qué cambia cuando el modelo puede actuar y no sólo responder?","Configurar un agente visual con dos herramientas; intentar una llamada no autorizada y documentar bloqueo, registro y escalamiento.","Evidencia 5: prototipo RAG o agente con herramientas.","Escape room de agentes","Constructor de agente"),

    S(23,"u6","Arquitectura y requisitos verificables",["u6l1"],45,135,"Convertir propósito y riesgos en componentes, interfaces y criterios de aceptación.","¿Cómo se demuestra que una arquitectura satisface una necesidad real?","Construir el diagrama completo del proyecto y convertir seis expectativas vagas en requisitos comprobables.","Arquitectura v1 y lista de aceptación.","Arquitecto contrarreloj","Lienzo de arquitectura"),
    S(24,"u6","Pruebas normales, límite y adversariales",["u6l2"],40,135,"Diseñar casos con entrada, precondición, resultado esperado, resultado observado y decisión.","¿Una demostración exitosa equivale a una evaluación?","Crear y ejecutar seis pruebas normales, seis límite y seis adversariales con identificadores reproducibles.","Matriz mínima de 18 pruebas.","Serpientes y escaleras de pruebas","Gestor de pruebas"),
    S(25,"u6","Red teaming, fallo seguro y gobernanza",["u6l3","u6l4"],35,135,"Responder a abuso, datos sensibles, contradicción y exceso de autonomía mediante Govern, Map, Measure y Manage.","¿Qué riesgo permanece aunque el prototipo funcione como fue diseñado?","Intercambiar proyectos, intentar cuatro ataques autorizados y convertir cada hallazgo en control, responsable e indicador.","Registro de riesgos y plan de tratamiento.","Escape room responsable","Tablero Govern-Map-Measure-Manage"),
    S(26,"u6","Demostración, documentación y defensa",["u6l5"],30,135,"Presentar evidencia reproducible, explicar decisiones y modificar el prototipo en vivo.","¿Qué distingue dominar un proyecto de sólo saber presentarlo?","Ensayar demostración de siete minutos, responder preguntas de decisión y realizar una modificación sorteada sin perder trazabilidad.","Evidencia 6: proyecto integrador, bitácora y defensa individual.","Gran torneo NEXUS","Mesa de demostración"),
  ];

  window.NEXUS_TEACHING={
    sessions,
    totals:{officialTheoryHours:22,officialPracticeHours:30,officialIndependentHours:44,teacherRealMinutes:2600,independentMinutes:2640},
    note:"Las 52 horas con conducción docente equivalen a 26 sesiones de 100 minutos reales (dos horas académicas de 50 minutos). Las 44 horas independientes se contabilizan aparte y no duplican actividades de clase.",
    roles:{teacher:"Explica, pregunta, ejemplifica, organiza la práctica, observa procedimientos, retroalimenta y cierra.",student:"Anticipa, pregunta, argumenta, practica, compara, corrige y registra evidencia.",platform:"Proporciona información, recursos proyectables, ejercicios, simuladores, juegos, retroalimentación y continuidad.",evidence:"Publica consignas oficiales, recibe evidencias, conserva rúbricas, comentarios y calificaciones."}
  };
})();
