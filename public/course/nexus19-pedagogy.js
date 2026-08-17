(()=>{
  const sessions=window.NEXUS_TEACHER_DETAIL?.sessions||[];
  const depth=window.NEXUS_ACADEMIC_DEPTH?.lessons||[];
  const byLesson=id=>depth.find(x=>x.id===id);
  const uniq=a=>[...new Set(a.filter(Boolean))];
  const techniques=[
    ["Lluvia de ideas dirigida","Explicar","Activar ideas previas sin convertir la apertura en examen.","Individual → parejas → plenaria","10 min"],
    ["Cuadro comparativo","Analizar","Contrastar enfoques por propósito, datos, salida, riesgo y supervisión.","Parejas","15 min"],
    ["Diagrama de flujo","Aplicar","Representar percepción, estado, decisión, acción y retroalimentación.","Equipos de 3","18 min"],
    ["Estudio de casos","Analizar","Tomar decisiones sobre PEAS, límites y responsabilidad humana.","Equipos de 4","22 min"],
    ["Mapa conceptual","Sintetizar","Relacionar hechos, proposiciones, predicados y procedencia.","Parejas","16 min"],
    ["Demostración silenciosa","Aplicar","Observar una inferencia paso a paso antes de explicarla con palabras propias.","Plenaria + parejas","15 min"],
    ["Redes conceptuales","Sintetizar","Construir relaciones entre clases, instancias y propiedades.","Equipos de 3","20 min"],
    ["Práctica distribuida","Aplicar","Resolver BFS, DFS y A* en rondas cortas con recuperación entre intentos.","Individual → parejas","24 min"],
    ["Juego de roles","Analizar","Defender decisiones desde agente, adversario y persona supervisora.","Equipos de 3","18 min"],
    ["Valoración de decisiones","Analizar","Separar score, recomendación, decisión y acción según consecuencias.","Equipos de 4","20 min"],
    ["Gráfico estadístico","Analizar","Leer calibración y contrastar probabilidad predicha con frecuencia observada.","Parejas","18 min"],
    ["Análisis y consensos","Analizar","Negociar un umbral explicando costos FP/FN y capacidad de atención.","Equipos de 4","22 min"],
    ["Simulación","Aplicar","Probar abstención, escalamiento y deriva ante cambios controlados.","Equipos de 3","22 min"],
    ["Diagrama de flujo","Aplicar","Reconstruir la cadena señal → representación → inferencia → interpretación.","Parejas","18 min"],
    ["Estudio de casos","Analizar","Comparar clasificación, detección, segmentación y descripción ante variaciones de captura.","Equipos de 4","22 min"],
    ["Simulación","Aplicar","Variar ruido, distancia y canal alternativo para estudiar robustez.","Equipos de 3","22 min"],
    ["Controversia estructurada","Analizar","Contrastar utilidad, privacidad, contradicción modal y diseño inclusivo.","Equipos de 4","24 min"],
    ["Feynman","Explicar","Explicar generación token a token con vocabulario propio y detectar huecos.","Parejas","16 min"],
    ["Auto-explicación","Explicar","Justificar cada componente de una instrucción y una salida estructurada.","Individual → parejas","18 min"],
    ["Mapa semántico","Sintetizar","Relacionar fragmentos, embeddings, similitud y recuperación.","Equipos de 3","20 min"],
    ["Análisis de contenido","Analizar","Evaluar corpus, recuperación, citas y respuesta fundamentada.","Equipos de 4","24 min"],
    ["Juego de roles","Analizar","Representar usuario, agente, herramienta y supervisor para probar permisos.","Equipos de 4","22 min"],
    ["Mapeo de procesos","Sintetizar","Diseñar arquitectura y contratos verificables entre componentes.","Equipos de 3","24 min"],
    ["Análisis de hechos","Analizar","Clasificar casos normales, límite y adversariales y justificar cobertura.","Parejas","20 min"],
    ["Controversia estructurada","Analizar","Red team versus blue team con fallo seguro y gobernanza explícita.","Dos equipos","25 min"],
    ["Simposio","Construir","Defender una solución integrada con evidencia, límites, demostración y preguntas.","Equipos + panel","30 min"]
  ].map((x,i)=>({session:i+1,name:x[0],bloom:x[1],why:x[2],grouping:x[3],time:x[4],source:"100 técnicas didácticas · UnADM/SEP (2023)"}));

  const activityTypes=[
    "wordsearch","matching","sequence","escape","flashcards","dragdrop","mindmap","sudoku","roulette","decision",
    "quiz","slider","escape","sequence","dragdrop","quiz","decision","flashcards","builder","matching","escape","decision","mindmap","dragdrop","escape","roulette"
  ];
  const labels={wordsearch:"Sopa de conceptos",matching:"Emparejamiento",sequence:"Ordena el proceso",escape:"Escape room digital",flashcards:"Tarjetas de repaso",dragdrop:"Clasifica y arrastra",mindmap:"Mapa mental interactivo",sudoku:"Sudoku conceptual",roulette:"Ruleta argumentativa",decision:"Decisiones ramificadas",quiz:"Quiz interactivo",slider:"Simulador de umbral",builder:"Constructor interactivo"};
  const conceptBank={
    s1:["IA","AUTOMATIZACION","MODELO","SISTEMA","DECISION","EVIDENCIA"],
    s2:["SIMBOLICO","PREDICTIVO","GENERATIVO","AGENTICO","DATOS","REGLAS"],
    s3:["PERCEPCION","ESTADO","POLITICA","ACCION","FEEDBACK","AGENTE"],
    s4:["PEAS","ENTORNO","SENSOR","ACTUADOR","DESEMPENO","SUPERVISION"],
    s5:["HECHO","PREDICADO","PROPOSICION","ENTIDAD","VIGENCIA","FUENTE"],
    s6:["REGLA","INFERENCIA","PREMISA","CONCLUSION","TRAZA","COBERTURA"],
    s7:["ONTOLOGIA","CLASE","INSTANCIA","RELACION","GRAFO","CONSULTA"],
    s8:["BFS","DFS","ASTAR","FRONTERA","VISITADOS","HEURISTICA"],
    s9:["MINIMAX","UTILIDAD","ADVERSARIO","HEURISTICA","ARBOL","EXPLICACION"],
    s10:["SCORE","POLITICA","RECOMENDACION","DECISION","ACCION","REVISION"],
    s11:["PROBABILIDAD","CALIBRACION","CONFIANZA","FRECUENCIA","INCERTIDUMBRE","INTERVALO"],
    s12:["UMBRAL","COSTO","FALSO_POSITIVO","FALSO_NEGATIVO","CAPACIDAD","CONSECUENCIA"],
    s13:["ABSTENCION","ESCALAMIENTO","DERIVA","MONITOREO","ALERTA","FALLO"],
    s14:["SENAL","CAPTURA","DIGITALIZACION","PREPROCESO","INFERENCIA","PERCEPTO"],
    s15:["CLASIFICACION","DETECCION","SEGMENTACION","DESCRIPCION","OCLUSION","ILUMINACION"],
    s16:["AUDIO","RUIDO","DISTANCIA","POSTURA","ACCESIBILIDAD","CANAL"],
    s17:["FUSION","PRIVACIDAD","CONSENTIMIENTO","CONTRADICCION","MINIMIZACION","INCLUSION"],
    s18:["TOKEN","CONTEXTO","TRANSFORMER","PROBABILIDAD","DECODIFICACION","GENERACION"],
    s19:["INSTRUCCION","CONTEXTO","FORMATO","RESTRICCION","EJEMPLO","VALIDACION"],
    s20:["EMBEDDING","FRAGMENTO","VECTOR","SIMILITUD","RECUPERACION","INDICE"],
    s21:["RAG","CORPUS","RECUPERACION","CITA","EVIDENCIA","ABSTENCION"],
    s22:["AGENTE","HERRAMIENTA","MEMORIA","PERMISO","VALIDADOR","REGISTRO"],
    s23:["ARQUITECTURA","INTERFAZ","CONTRATO","REQUISITO","ENTRADA","SALIDA"],
    s24:["NORMAL","LIMITE","ADVERSARIAL","PRUEBA","COBERTURA","ORACULO"],
    s25:["REDTEAM","BLUETEAM","RIESGO","BLOQUEO","ESCALAMIENTO","GOBERNANZA"],
    s26:["DEMOSTRACION","EVIDENCIA","DOCUMENTACION","DEFENSA","LIMITES","TRAZABILIDAD"]
  };
  const curated={
    s1:{video:{title:"Machine Learning Crash Course · Intro & What's New",url:"https://www.youtube.com/watch?v=SAUeGtyLsrk",source:"Google for Developers",note:"Recurso complementario; contraste IA/ML y aprendizaje interactivo."},reading:{title:"Machine Learning Crash Course",url:"https://developers.google.com/machine-learning/crash-course",source:"Google for Developers"}},
    s8:{video:{title:"A* (A Star) Search Algorithm",url:"https://www.youtube.com/watch?v=ySN5Wnu88nE",source:"Computerphile / University of Nottingham",note:"Explicación visual de A* y su relación con Dijkstra."}},
    s18:{video:{title:"The Transformer architecture",url:"https://www.youtube.com/watch?v=H39Z_720T5s",source:"Hugging Face",note:"Introducción de alto nivel a Transformers."},reading:{title:"Hugging Face Course",url:"https://huggingface.co/learn",source:"Hugging Face"}},
    s21:{video:{title:"How to use Retrieval Augmented Generation (RAG)",url:"https://www.youtube.com/watch?v=oVtlp72f9NQ",source:"Google Cloud",note:"Flujo RAG y consideraciones para calidad."},reading:{title:"What is Retrieval-Augmented Generation?",url:"https://cloud.google.com/use-cases/retrieval-augmented-generation",source:"Google Cloud"}}
  };
  const activityData={
    s2:{pairs:[["Simbólico","Reglas y conocimiento explícito"],["Predictivo","Estima una salida a partir de datos"],["Generativo","Produce contenido condicionado por contexto"],["Agéntico","Decide pasos y usa herramientas bajo permisos"]]},
    s3:{sequence:["Percibir una señal","Actualizar el estado","Seleccionar una política","Ejecutar una acción","Observar retroalimentación"]},
    s4:{escape:[{q:"El agente cumple su métrica, pero perjudica al estudiante. ¿Qué revisar primero?",o:["El color de la interfaz","La medida de desempeño del PEAS","El nombre del agente"],a:1},{q:"Un caso queda fuera del alcance definido. ¿Qué conducta es más segura?",o:["Inventar una salida","Escalar o abstenerse","Ocultar el caso"],a:1},{q:"¿Quién debe conservar autoridad sobre una consecuencia académica de alto impacto?",o:["Una capa humana responsable","El sensor","La animación"],a:0}]},
    s6:{categories:{"Premisa":["Si tiene prerrequisito aprobado","Si el expediente está completo"],"Conclusión":["Puede inscribirse","Debe solicitar revisión"],"Control":["Registrar regla activada","Verificar vigencia de la norma"]}},
    s8:{sudoku:{symbols:["BFS","DFS","A*","Dijkstra"],solution:[[0,1,2,3],[2,3,0,1],[1,0,3,2],[3,2,1,0]],givens:[[0,0],[0,3],[1,1],[1,2],[2,1],[2,2],[3,0],[3,3]]}},
    s10:{decision:[{q:"Score 0.81 y consecuencia reversible",o:["Ejecutar automáticamente","Recomendar y registrar","Ignorar"],a:1,why:"El score informa; la política determina la acción."},{q:"Score 0.81, dato crítico faltante y consecuencia alta",o:["Actuar igual","Escalar/abstenerse","Redondear a 1"],a:1,why:"Información insuficiente requiere control adicional."}]},
    s11:{quiz:[{q:"Un sistema produce 100 predicciones cercanas a 0.8. Si está bien calibrado, ¿qué esperarías?",o:["Cerca de 80 aciertos en ese grupo","100 aciertos","Que 0.8 sea una certeza"],a:0,f:"Calibración compara probabilidad predicha con frecuencia observada."},{q:"¿Qué afirmación es correcta?",o:["Probabilidad y certeza son equivalentes","La confianza debe interpretarse con el contexto y la calibración","Un valor alto elimina el riesgo"],a:1,f:"La probabilidad no sustituye el análisis de incertidumbre y consecuencias."}]},
    s12:{slider:{min:20,max:80,start:50,positive:20,negative:80}},
    s13:{escape:[{q:"El volumen de casos se duplica y supera la capacidad humana. ¿Qué se ajusta?",o:["Nada","Política de priorización y escalamiento","El logo"],a:1},{q:"Cambió el formulario de entrada. ¿Qué señal puede indicar deriva?",o:["Cambio en distribución y errores","Más visitas al portal","Más diapositivas"],a:0},{q:"Caso crítico con evidencia insuficiente",o:["Abstener y escalar","Inventar probabilidad","Aprobar por defecto"],a:0}]},
    s14:{sequence:["Captura física","Digitalización","Preprocesamiento","Inferencia del modelo","Interpretación/decisión"]},
    s15:{categories:{"Clasificación":["Asignar una etiqueta global"],"Detección":["Localizar objetos con cajas"],"Segmentación":["Asignar clase a regiones/píxeles"],"Prueba de robustez":["Cambiar iluminación y oclusión"]}},
    s16:{quiz:[{q:"¿Qué prueba aporta más información sobre robustez de voz?",o:["Una grabación ideal repetida","Variar ruido y distancia con casos comparables","Cambiar el color del botón"],a:1,f:"La robustez se estudia variando condiciones relevantes de captura."},{q:"Si el canal de voz falla para una persona, ¿qué diseño es preferible?",o:["Excluirla","Canal alternativo accesible","Subir volumen"],a:1,f:"El diseño inclusivo ofrece alternativas y no presupone un único canal."}]},
    s17:{decision:[{q:"Cámara y audio contradicen la misma inferencia",o:["Promediar siempre","Declarar incertidumbre y aplicar política de contradicción","Elegir la cámara por defecto"],a:1,why:"La fusión requiere reglas explícitas para conflicto e incertidumbre."},{q:"Dato biométrico no es necesario para el propósito",o:["Recolectarlo por si acaso","No recolectarlo","Guardarlo indefinidamente"],a:1,why:"La minimización reduce exposición y debe responder al propósito."}]},
    s19:{sequence:["Propósito de la tarea","Contexto necesario","Restricciones","Formato de salida","Criterio de validación"]},
    s20:{pairs:[["Fragmentación","Divide documentos en unidades recuperables"],["Embedding","Representa contenido en un espacio vectorial"],["Similitud","Ordena candidatos por cercanía"],["Recuperación","Selecciona evidencia para responder"]]},
    s21:{escape:[{q:"El documento más parecido está derogado",o:["Citarlo","Aplicar filtro de vigencia","Ocultarlo"],a:1},{q:"La respuesta afirma algo que no aparece en los fragmentos",o:["Mantenerlo por fluidez","Eliminar/abstenerse y pedir evidencia","Inventar cita"],a:1},{q:"No se recuperó evidencia suficiente",o:["Abstenerse claramente","Responder con memoria","Cambiar temperatura"],a:0}]},
    s22:{decision:[{q:"El agente intenta usar una herramienta fuera de su permiso",o:["Ejecutar y avisar luego","Bloquear, registrar y escalar","Renombrar la herramienta"],a:1,why:"La autorización debe comprobarse antes de la acción."},{q:"La memoria contiene un dato sensible innecesario",o:["Retenerlo siempre","Minimizar/eliminar según política","Mostrarlo al grupo"],a:1,why:"La memoria debe tener finalidad, retención y límites."}]},
    s24:{categories:{"Normal":["Entrada completa y esperada"],"Límite":["Valor extremo pero permitido","Campo opcional ausente"],"Adversarial":["Inyección de instrucciones","Parámetro deliberadamente malicioso"],"Oráculo":["Resultado esperado definido antes de ejecutar"]}},
    s25:{escape:[{q:"Red team encuentra una ruta para ejecutar acción sensible sin permiso",o:["Documentar y bloquear antes del despliegue","Ignorar por ser caso raro","Ocultar la prueba"],a:0},{q:"El sistema no sabe responder",o:["Fallo seguro/abstención","Inventar","Reintentar indefinidamente"],a:0},{q:"¿Qué cierra el ciclo de gobernanza?",o:["Responsable, registro, criterio de cambio y seguimiento","Una insignia","Más datos sin propósito"],a:0}]}
  };
  function keyIdeas(s){const fromDepth=s.lessonIds.flatMap(id=>(byLesson(id)?.essential||[]));return uniq([...(s.keyIdeas||[]),...fromDepth]).slice(0,7)}
  function makeReading(s){
    const ideas=keyIdeas(s); const d=s.lessonIds.map(byLesson).filter(Boolean);
    return {title:`Lectura guiada · ${s.title}`,minutes:8,paras:[
      `Esta lectura prepara la sesión ${s.number}. El propósito es ${s.objective}`,
      ideas.slice(0,3).join(' '),
      `Caso de referencia: ${s.example}`,
      `Para evitar aprendizaje superficial, no basta con repetir términos. Durante la lectura identifica qué decisión se toma, qué evidencia la sostiene, qué límites existen y qué debería ocurrir cuando la evidencia es insuficiente.`,
      d.flatMap(x=>x.errors||[]).slice(0,3).length?`Errores que conviene vigilar: ${d.flatMap(x=>x.errors||[]).slice(0,3).join(' ')}`:`Contrasta el caso con una alternativa más simple y explica por qué elegirías una u otra.`,
      `Cierre de lectura: responde con tus palabras “${s.exit?.[0]||s.trigger}” y conserva una duda que pueda someterse a prueba.`
    ]};
  }
  function generatedActivity(s){
    const type=activityTypes[s.number-1], concepts=conceptBank[s.id]||[];
    const base={type,label:labels[type],bloom:techniques[s.number-1].bloom,concepts};
    if(activityData[s.id])Object.assign(base,activityData[s.id]);
    if(type==='flashcards')base.cards=concepts.slice(0,5).map((c,i)=>[c,(keyIdeas(s)[i]||s.explanation?.[i]||s.focus||s.objective).slice(0,240)]);
    if(type==='roulette')base.prompts=uniq([s.trigger,...(s.reflection||[]),...(s.exit||[])]).slice(0,6);
    if(type==='mindmap')base.nodes=concepts.slice(0,6);
    if(type==='wordsearch')base.words=concepts.slice(0,6);
    if(type==='builder'&&!base.sequence)base.sequence=["Propósito","Contexto","Restricción","Formato","Validación"];
    return base;
  }
  function richDeck(s){
    const ideas=keyIdeas(s), tech=techniques[s.number-1], activity=generatedActivity(s);
    const conceptCards=(conceptBank[s.id]||ideas.map(x=>x.split(' ')[0])).slice(0,6);
    return [
      {kind:'cover',kicker:`SESIÓN ${s.number} · SISTEMAS INTELIGENTES`,title:s.title,lead:s.objective,meta:[`${s.theoryMinutes} min comprensión`,`${s.practiceMinutes} min aplicación`,tech.name]},
      {kind:'question',kicker:'ACTIVACIÓN',title:s.trigger,lead:'Piensa 60 segundos. Escribe una razón y un caso que podría hacerte cambiar de opinión.'},
      {kind:'outcome',kicker:'RESULTADO DE APRENDIZAJE',title:'¿Qué podremos demostrar al terminar?',lead:s.objective,bloom:tech.bloom},
      {kind:'conceptmap',kicker:'MAPA DE IDEAS',title:'Conceptos que se conectan hoy',items:conceptCards},
      {kind:'explanation',kicker:'IDEA CLAVE 1',title:'Comprender antes de aplicar',lead:ideas[0]||s.focus,items:ideas.slice(1,4)},
      {kind:'explanation',kicker:'IDEA CLAVE 2',title:'Qué suele confundirse',lead:(s.misconceptions||[])[0]||'Distingue definición, evidencia y límite.',items:(s.misconceptions||[]).slice(1,4)},
      {kind:'process',kicker:'PROCESO',title:'Razonamiento paso a paso',items:(conceptBank[s.id]||[]).slice(0,5).map((x,i)=>({label:x,text:(ideas[i]||s.focus).slice(0,160)}))},
      {kind:'case',kicker:'CASO RAZONADO',title:'Del concepto a una decisión',lead:s.example,takeaway:(s.expected||[])[0]||s.focus},
      {kind:'technique',kicker:'TÉCNICA DIDÁCTICA',title:tech.name,lead:tech.why,meta:[tech.grouping,tech.time,`Bloom: ${tech.bloom}`]},
      {kind:'challenge',kicker:'ACTIVIDAD CENTRAL',title:activity.label,lead:s.guided,steps:['Propuesta individual','Contraste con otra persona','Resolución/producción','Justificación y revisión'],deliverable:s.product},
      {kind:'criteria',kicker:'CRITERIOS DE CALIDAD',title:'Antes de dar por terminado el trabajo',items:(s.expected||[]).concat(['Declara evidencia y límite.','Registra una corrección realizada.']).slice(0,6)},
      {kind:'checkpoint',kicker:'COMPROBACIÓN',title:'¿Podemos avanzar?',question:s.exit?.[0]||s.trigger,prompt:'Responde sin consultar tus notas y justifica en una frase.'},
      {kind:'summary',kicker:'SÍNTESIS',title:'Qué te llevas de esta sesión',items:ideas.slice(0,4),question:s.exit?.[1]||s.trigger,after:(s.independentDetailed||[]).map(x=>`${x.name} · ${x.min} min`).slice(0,4)}
    ];
  }
  function actionsFor(s,phaseIndex){
    const slideMap=[1,4,7,9,10,11];
    const actions=[{kind:'slide',label:`Proyectar lámina ${slideMap[phaseIndex]+1}`,slide:slideMap[phaseIndex]}];
    if(phaseIndex===0)actions.push({kind:'reading',label:'Abrir lectura guiada'});
    if(phaseIndex===1){actions.push({kind:'technique',label:`Cómo aplicar: ${techniques[s.number-1].name}`}); if(curated[s.id]?.video)actions.push({kind:'video',label:'Abrir video curado'});}
    if(phaseIndex===2)actions.push({kind:'teacher',label:'Ver solución y mediación'});
    if(phaseIndex===3)actions.push({kind:'activity',label:`Abrir ${labels[activityTypes[s.number-1]]}`});
    if(phaseIndex===4)actions.push({kind:'teacher',label:'Comparar respuestas esperadas'});
    if(phaseIndex===5)actions.push({kind:'activity',label:'Comprobación interactiva'});
    return actions;
  }
  sessions.forEach(s=>{
    const tech=techniques[s.number-1], activity=generatedActivity(s), reading=makeReading(s), external=curated[s.id]||{};
    const detailed=s.lessonIds.map(byLesson).filter(Boolean);
    s.n19={technique:tech,activity,reading,external,concepts:conceptBank[s.id]||[],depth:detailed,
      readiness:["Resultado de aprendizaje visible y evaluable","Contenido docente ampliado","Técnica didáctica justificada","Material proyectable ampliado","Actividad interactiva operativa","Recurso de lectura disponible","Respuesta/criterio docente disponible","Evidencia e instrumento vinculados","Plan B sin conexión","Accesibilidad y alternativa de participación"]};
    s.projectable=richDeck(s);
    s.teacherScript.forEach((p,i)=>p.n19Actions=actionsFor(s,i));
    s.preparation=uniq([...(s.preparation||[]),`Revisar la técnica ${tech.name} (${tech.grouping}; ${tech.time}).`,`Probar “${activity.label}” en modo docente antes de proyectarla.`,`Confirmar que lectura, presentación y plan B abren correctamente.`]);
  });
  window.NEXUS19_PEDAGOGY={sessions,techniques,labels,activityTypes,conceptBank,curated,activityData};
})();
