(()=>{
  const likertAgreement={
    1:"Totalmente en desacuerdo",
    2:"En desacuerdo",
    3:"Ni de acuerdo ni en desacuerdo",
    4:"De acuerdo",
    5:"Totalmente de acuerdo"
  };

  const knowledgeQuestions=[
    {id:"k01",type:"choice",dimension:"knowledge",prompt:"¿Cuándo conviene considerar un sistema de inteligencia artificial en lugar de una regla fija?",options:["Cuando la decisión no importa","Cuando existen patrones o incertidumbre que una regla estable no resuelve adecuadamente","Siempre que haya muchos datos","Cuando se desea eliminar la supervisión humana"]},
    {id:"k02",type:"choice",dimension:"knowledge",prompt:"En una especificación PEAS, ¿qué describen los sensores?",options:["Las metas de negocio","Las acciones que puede ejecutar el agente","Las entradas observables que recibe del entorno","Las sanciones para el usuario"]},
    {id:"k03",type:"choice",dimension:"knowledge",prompt:"¿Qué diferencia principal tiene A* frente a una búsqueda en anchura?",options:["A* usa una heurística además del costo acumulado","A* nunca necesita memoria","La búsqueda en anchura sólo sirve con números","A* siempre garantiza una respuesta correcta aunque la heurística sea arbitraria"]},
    {id:"k04",type:"choice",dimension:"knowledge",prompt:"¿Qué aporta una traza de inferencia en un sistema basado en reglas?",options:["Oculta las reglas internas","Permite reconstruir qué hechos y reglas produjeron una conclusión","Sustituye las pruebas del sistema","Convierte toda regla en aprendizaje automático"]},
    {id:"k05",type:"choice",dimension:"knowledge",prompt:"Si un falso negativo tiene un costo mucho mayor que un falso positivo, ¿qué debe revisarse primero?",options:["El color de la interfaz","El umbral de decisión y la matriz de costos","El nombre del modelo","La cantidad de insignias"]},
    {id:"k06",type:"choice",dimension:"knowledge",prompt:"¿Cuál es la función de una zona de abstención?",options:["Obligar al sistema a responder siempre","Separar casos inciertos para revisión o escalamiento","Eliminar la necesidad de monitoreo","Aumentar automáticamente la calificación"]},
    {id:"k07",type:"choice",dimension:"knowledge",prompt:"¿Cuál es una prueba adecuada para evaluar robustez perceptiva?",options:["Usar una sola imagen ideal","Cambiar iluminación, ruido, dispositivo y condiciones de accesibilidad","Probar únicamente el caso con mayor confianza","Medir sólo la velocidad"]},
    {id:"k08",type:"choice",dimension:"knowledge",prompt:"Si una interfaz depende de reconocimiento visual, ¿qué medida favorece la inclusión?",options:["Impedir cualquier entrada alternativa","Ofrecer un canal equivalente accesible y una revisión humana","Aumentar el tamaño del modelo","Conservar imágenes sin consentimiento"]},
    {id:"k09",type:"choice",dimension:"knowledge",prompt:"Durante la generación, un modelo de lenguaje principalmente…",options:["demuestra cada afirmación","estima tokens sucesivos condicionados por el contexto","consulta siempre una fuente oficial","ejecuta herramientas sin autorización"]},
    {id:"k10",type:"choice",dimension:"knowledge",prompt:"En un sistema RAG, una respuesta bien fundamentada debe…",options:["usar cualquier cita aunque no respalde la afirmación","relacionar sus afirmaciones con fragmentos recuperados pertinentes y vigentes","evitar la abstención","confiar sólo en la fluidez del texto"]},
    {id:"k11",type:"choice",dimension:"knowledge",prompt:"¿Qué control ayuda ante una instrucción maliciosa encontrada dentro de un documento recuperado?",options:["Tratar el documento como autoridad superior","Separar autoridades, validar acciones y no ejecutar instrucciones del contenido","Ocultar las citas","Dar acceso total a herramientas"]},
    {id:"k12",type:"choice",dimension:"knowledge",prompt:"¿Cuál requisito es verificable?",options:["El sistema será muy inteligente","El sistema responderá preguntas del reglamento con cita o se abstendrá en menos de diez segundos","El sistema nunca fallará","La experiencia será perfecta"]}
  ];

  const commonAttitudes=[
    {id:"se01",type:"likert",dimension:"self_efficacy",prompt:"Puedo explicar por qué una solución necesita —o no necesita— inteligencia artificial."},
    {id:"se02",type:"likert",dimension:"self_efficacy",prompt:"Puedo identificar límites, riesgos y condiciones de abstención de un sistema inteligente."},
    {id:"se03",type:"likert",dimension:"self_efficacy",prompt:"Puedo justificar una decisión técnica mediante evidencia y pruebas."},
    {id:"mot01",type:"likert",dimension:"motivation",prompt:"Me interesa aprender a construir sistemas inteligentes responsables."},
    {id:"mot02",type:"likert",dimension:"motivation",prompt:"Estoy dispuesto(a) a practicar y corregir mis errores durante el curso."},
    {id:"mot03",type:"likert",dimension:"motivation",prompt:"Considero útil lo aprendido para mi formación profesional."}
  ];

  const consentQuestion={
    id:"consent",
    type:"choice",
    dimension:"consent",
    prompt:"Autorizo que mis respuestas se analicen de forma seudonimizada para evaluar y mejorar el piloto NEXUS. Mi decisión no modifica mi calificación ni mi acceso al curso.",
    options:["Sí, acepto participar","No acepto participar"]
  };

  const studentInstruments=[
    {
      id:"s_pre",audience:"student",phase:"Inicio",openWeek:1,closeWeek:2,minutes:10,
      title:"Diagnóstico inicial",subtitle:"Conocimientos, autoeficacia y motivación antes de comenzar.",
      questions:[consentQuestion,...knowledgeQuestions,...commonAttitudes]
    },
    {
      id:"s_w4",audience:"student",phase:"Semana 4",openWeek:4,closeWeek:5,minutes:4,
      title:"Pulso de experiencia · semana 4",subtitle:"Claridad, narrativa, reglas y seguridad para aprender.",
      questions:[
        {id:"clarity_goal",type:"likert",dimension:"clarity",prompt:"Comprendo qué debo lograr en cada misión."},
        {id:"narrative_connection",type:"likert",dimension:"narrative",prompt:"La historia me ayuda a relacionar las actividades del curso."},
        {id:"rules_clear",type:"likert",dimension:"rules",prompt:"Entiendo la diferencia entre XP, insignias, NexoCoins y calificación."},
        {id:"feedback_learning",type:"likert",dimension:"feedback",prompt:"La retroalimentación me ayuda a corregir mis errores."},
        {id:"safe_failure",type:"likert",dimension:"safe_learning",prompt:"Los retos me permiten practicar sin temor a equivocarme."},
        {id:"w4_comment",type:"text",required:false,dimension:"comment",prompt:"¿Qué ajuste facilitaría tu aprendizaje en esta etapa?"}
      ]
    },
    {
      id:"s_w8",audience:"student",phase:"Semana 8",openWeek:8,closeWeek:9,minutes:4,
      title:"Pulso de experiencia · semana 8",subtitle:"Autorregulación, motivación y funcionamiento técnico.",
      questions:[
        {id:"weekly_goals",type:"likert",dimension:"self_regulation",prompt:"Las metas semanales me ayudan a organizar mi avance."},
        {id:"rewards_interest",type:"likert",dimension:"motivation_design",prompt:"Los avatares y recompensas aumentan mi interés sin distraerme."},
        {id:"device_access",type:"likert",dimension:"technical_access",prompt:"La plataforma funciona adecuadamente en mi dispositivo."},
        {id:"workload_balance",type:"likert",dimension:"workload",prompt:"La cantidad de actividades es manejable junto con mis demás responsabilidades."},
        {id:"w8_comment",type:"text",required:false,dimension:"comment",prompt:"Menciona una función que conservarías y una que cambiarías."}
      ]
    },
    {
      id:"s_w12",audience:"student",phase:"Semana 12",openWeek:12,closeWeek:13,minutes:4,
      title:"Pulso de permanencia · semana 12",subtitle:"Compromiso, transferencia y acompañamiento oportuno.",
      questions:[
        {id:"sustained_participation",type:"likert",dimension:"engagement",prompt:"He mantenido mi participación a lo largo del curso."},
        {id:"transfer_evidence",type:"likert",dimension:"transfer",prompt:"Puedo aplicar lo practicado en mis evidencias."},
        {id:"teacher_support",type:"likert",dimension:"support",prompt:"La orientación docente me ayuda a superar dificultades."},
        {id:"continue_intention",type:"likert",dimension:"persistence",prompt:"Tengo intención de completar todas las misiones y el proyecto."},
        {id:"w12_barrier",type:"text",required:false,dimension:"comment",prompt:"¿Qué obstáculo podría impedirte concluir y qué apoyo sería útil?"}
      ]
    },
    {
      id:"s_post",audience:"student",phase:"Cierre",openWeek:15,closeWeek:16,minutes:12,
      title:"Evaluación final y experiencia",subtitle:"Compara tu aprendizaje con el inicio y valora el recorrido completo.",
      questions:[
        ...knowledgeQuestions,...commonAttitudes,
        {id:"recommend",type:"likert",dimension:"acceptance",prompt:"Recomendaría utilizar NEXUS en otra unidad de aprendizaje."},
        {id:"privacy",type:"likert",dimension:"trust",prompt:"La plataforma respetó mi privacidad y autonomía."},
        {id:"learning_value",type:"likert",dimension:"perceived_learning",prompt:"NEXUS favoreció mi comprensión y aplicación de los contenidos."},
        {id:"gamification_balance",type:"likert",dimension:"gamification_balance",prompt:"Los elementos de juego apoyaron el aprendizaje sin desplazar los objetivos académicos."},
        {id:"final_comment",type:"text",required:false,dimension:"comment",prompt:"¿Qué conservarías y qué modificarías para una siguiente edición?"}
      ]
    }
  ];

  const teacherInstruments=[
    {
      id:"t_pre",audience:"teacher",phase:"Inicio",openWeek:1,closeWeek:2,minutes:7,
      title:"Línea base docente",subtitle:"Expectativas, preparación habitual y condiciones de implementación.",
      questions:[
        consentQuestion,
        {id:"prep_minutes_baseline",type:"number",min:0,max:300,dimension:"prep_time",prompt:"Antes de NEXUS, ¿cuántos minutos solías dedicar a preparar una sesión de 100 minutos?"},
        {id:"planning_clarity",type:"likert",dimension:"planning",prompt:"Tengo claridad sobre la secuencia didáctica de las 26 sesiones."},
        {id:"digital_confidence",type:"likert",dimension:"teacher_self_efficacy",prompt:"Me siento capaz de conducir la clase utilizando los recursos digitales disponibles."},
        {id:"assessment_confidence",type:"likert",dimension:"teacher_self_efficacy",prompt:"Me siento capaz de interpretar los datos de seguimiento sin confundir actividad con aprendizaje."},
        {id:"baseline_expectation",type:"text",required:false,dimension:"comment",prompt:"¿Qué esperas que NEXUS mejore en tu práctica docente?"}
      ]
    },
    {
      id:"t_w4",audience:"teacher",phase:"Semana 4",openWeek:4,closeWeek:5,minutes:6,
      title:"Valoración docente · semana 4",subtitle:"Primer uso real del portal, los guiones y el seguimiento.",
      questions:[
        {id:"usefulness",type:"likert",dimension:"teacher_usefulness",prompt:"NEXUS ha sido útil para preparar o conducir las sesiones."},
        {id:"clarity",type:"likert",dimension:"teacher_clarity",prompt:"La información del portal docente es clara y localizable."},
        {id:"actionability",type:"likert",dimension:"teacher_actionability",prompt:"La analítica me ayuda a tomar decisiones de acompañamiento."},
        {id:"cognitive_load",type:"likert",dimension:"teacher_load",prompt:"Puedo utilizar el Modo Conducción sin una carga mental excesiva."},
        {id:"saved_minutes",type:"number",min:0,max:300,dimension:"saved_time",prompt:"¿Cuántos minutos estimas haber ahorrado por sesión?"},
        {id:"action_taken",type:"yesno",dimension:"action",prompt:"¿La información generó alguna acción pedagógica concreta?"},
        {id:"w4_teacher_comment",type:"text",required:false,dimension:"comment",prompt:"Describe un ajuste realizado, sin incluir datos personales del estudiante."}
      ]
    },
    {
      id:"t_w8",audience:"teacher",phase:"Semana 8",openWeek:8,closeWeek:9,minutes:7,
      title:"Evaluación intermedia docente",subtitle:"Usabilidad del Modo Conducción y adaptación a la clase real.",
      questions:[
        {id:"usefulness",type:"likert",dimension:"teacher_usefulness",prompt:"NEXUS ha sido útil para preparar o conducir las sesiones."},
        {id:"clarity",type:"likert",dimension:"teacher_clarity",prompt:"Localizo con facilidad las respuestas esperadas y las intervenciones sugeridas."},
        {id:"adaptation",type:"likert",dimension:"teacher_adaptation",prompt:"Puedo adaptar tiempos y actividades sin perder el objetivo de aprendizaje."},
        {id:"student_response",type:"likert",dimension:"observed_engagement",prompt:"Observo participación sostenida del grupo durante las actividades."},
        {id:"saved_minutes",type:"number",min:0,max:300,dimension:"saved_time",prompt:"¿Cuántos minutos estimas haber ahorrado por sesión?"},
        {id:"plan_b_used",type:"yesno",dimension:"plan_b",prompt:"¿Has utilizado el plan B sin conexión o recursos alternativos?"},
        {id:"action_taken",type:"yesno",dimension:"action",prompt:"¿La información generó alguna acción pedagógica concreta?"},
        {id:"w8_teacher_comment",type:"text",required:false,dimension:"comment",prompt:"¿Qué cambio necesita el Modo Conducción?"}
      ]
    },
    {
      id:"t_w12",audience:"teacher",phase:"Semana 12",openWeek:12,closeWeek:13,minutes:6,
      title:"Seguimiento docente · semana 12",subtitle:"Decisiones, acompañamiento y sostenibilidad del uso.",
      questions:[
        {id:"actionability",type:"likert",dimension:"teacher_actionability",prompt:"Las señales de avance e inactividad me ayudan a priorizar acompañamientos."},
        {id:"evidence_alignment",type:"likert",dimension:"alignment",prompt:"Las actividades de NEXUS se relacionan claramente con las evidencias evaluables."},
        {id:"sustainable_use",type:"likert",dimension:"sustainability",prompt:"El uso de NEXUS es sostenible dentro de mi carga docente."},
        {id:"student_response",type:"likert",dimension:"observed_engagement",prompt:"Observo que los estudiantes transfieren lo practicado a sus productos."},
        {id:"action_taken",type:"yesno",dimension:"action",prompt:"¿Realizaste alguna acción de acompañamiento a partir del tablero?"},
        {id:"w12_teacher_comment",type:"text",required:false,dimension:"comment",prompt:"Describe la decisión pedagógica más útil tomada con apoyo de NEXUS."}
      ]
    },
    {
      id:"t_post",audience:"teacher",phase:"Cierre",openWeek:15,closeWeek:16,minutes:9,
      title:"Evaluación final de la plataforma por el docente",subtitle:"Utilidad, impacto percibido, carga y decisión de continuidad.",
      questions:[
        {id:"usefulness",type:"likert",dimension:"teacher_usefulness",prompt:"NEXUS mejoró la preparación y conducción de mis sesiones."},
        {id:"clarity",type:"likert",dimension:"teacher_clarity",prompt:"La organización del portal docente resultó clara durante el semestre."},
        {id:"actionability",type:"likert",dimension:"teacher_actionability",prompt:"La analítica apoyó decisiones pedagógicas oportunas."},
        {id:"adaptation",type:"likert",dimension:"teacher_adaptation",prompt:"Los guiones pudieron adaptarse a las necesidades reales del grupo."},
        {id:"sustainable_use",type:"likert",dimension:"sustainability",prompt:"Volvería a utilizar NEXUS en otra edición de la unidad de aprendizaje."},
        {id:"saved_minutes",type:"number",min:0,max:300,dimension:"saved_time",prompt:"¿Cuántos minutos promedio ahorraste por sesión?"},
        {id:"action_taken",type:"yesno",dimension:"action",prompt:"¿El tablero produjo acciones de acompañamiento durante el semestre?"},
        {id:"final_teacher_comment",type:"text",required:false,dimension:"comment",prompt:"¿Qué debe conservarse y qué debe modificarse antes de escalar NEXUS?"}
      ]
    }
  ];

  const all=[...studentInstruments,...teacherInstruments];
  const byId=id=>all.find(item=>item.id===id);
  const dateValue=value=>{
    if(!value)return null;
    if(typeof value.toDate==="function")return value.toDate();
    if(typeof value==="string")return new Date(`${value.slice(0,10)}T12:00:00`);
    const date=new Date(value);
    return Number.isNaN(date.getTime())?null:date;
  };
  const currentWeek=(config,now=new Date())=>{
    const start=dateValue(config?.startDate);
    if(!start)return null;
    const today=new Date(now.getFullYear(),now.getMonth(),now.getDate(),12);
    const base=new Date(start.getFullYear(),start.getMonth(),start.getDate(),12);
    return Math.floor((today-base)/604800000)+1;
  };
  const availability=(instrument,week,completed=false,declined=false)=>{
    if(completed)return"completed";
    if(declined&&instrument.id!=="s_pre"&&instrument.id!=="t_pre")return"not_applicable";
    if(week===null)return"configuration";
    if(week<instrument.openWeek)return"upcoming";
    if(week>instrument.closeWeek)return"closed";
    return"due";
  };
  const dimensionScores=(instrument,answers)=>{
    const buckets={};
    instrument.questions.filter(q=>q.type==="likert").forEach(q=>{
      const value=Number(answers?.[q.id]);
      if(!Number.isFinite(value))return;
      (buckets[q.dimension]||=[]).push(value);
    });
    return Object.fromEntries(Object.entries(buckets).map(([key,values])=>[key,Number((values.reduce((sum,value)=>sum+value,0)/values.length).toFixed(2))]));
  };
  const escape=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));
  const optionField=(question,index,label,value,checked="")=>`<label class="measurement-option"><input type="radio" name="${question.id}" value="${value}" ${checked} ${question.required===false?"":"required"}><span><b>${index}</b>${escape(label)}</span></label>`;
  const questionHtml=(question,answer)=>{
    const required=question.required===false?"":" <span aria-hidden=\"true\">*</span>";
    let field="";
    if(question.type==="likert")field=`<div class="measurement-scale" role="radiogroup" aria-label="Escala de 1 a 5">${Object.entries(likertAgreement).map(([value,label])=>optionField(question,value,label,value,String(answer)===value?"checked":"")).join("")}</div>`;
    if(question.type==="choice")field=`<div class="measurement-choices">${question.options.map((label,index)=>optionField(question,index+1,label,index,String(answer)===String(index)?"checked":"")).join("")}</div>`;
    if(question.type==="yesno")field=`<div class="measurement-choices compact">${[["Sí","yes"],["No","no"]].map(([label,value],index)=>optionField(question,index+1,label,value,String(answer)===value?"checked":"")).join("")}</div>`;
    if(question.type==="number")field=`<input class="measurement-number" type="number" name="${question.id}" min="${question.min??0}" max="${question.max??999}" value="${escape(answer??"")}" ${question.required===false?"":"required"}>`;
    if(question.type==="text")field=`<textarea name="${question.id}" rows="3" maxlength="700" ${question.required===false?"":"required"} placeholder="Respuesta opcional; no incluyas datos personales.">${escape(answer??"")}</textarea>`;
    return `<fieldset class="measurement-question"><legend>${escape(question.prompt)}${required}</legend>${field}</fieldset>`;
  };
  const formHtml=(instrument,answers={})=>`<form id="measurementInstrumentForm" class="measurement-form" data-instrument="${instrument.id}"><div class="measurement-form-head"><span class="eyebrow">${escape(instrument.phase)} · ${instrument.minutes} MIN APROX.</span><h2>${escape(instrument.title)}</h2><p>${escape(instrument.subtitle)}</p><div class="measurement-notice"><strong>Uso responsable de datos</strong><span>Las respuestas se guardan con tu cuenta para evitar duplicados, pero el análisis docente se presenta de forma agregada o seudonimizada.</span></div></div>${instrument.questions.map((q,index)=>`<div class="measurement-question-number">${index+1}</div>${questionHtml(q,answers[q.id])}`).join("")}<div class="measurement-submit"><p><strong>Revisa antes de enviar.</strong> El instrumento se marcará como completado.</p><button class="btn btn-primary" type="submit">Enviar instrumento</button></div></form>`;
  const readAnswers=(form,instrument)=>{
    if(!form.reportValidity())return null;
    const data=new FormData(form),answers={};
    instrument.questions.forEach(question=>{
      const raw=data.get(question.id);
      if(raw===null||raw==="")return;
      answers[question.id]=["likert","choice","number"].includes(question.type)?Number(raw):String(raw).trim();
    });
    return answers;
  };
  const labelForStatus=status=>({completed:"Completado",due:"Disponible ahora",upcoming:"Próximamente",closed:"Periodo concluido",configuration:"Esperando calendario",not_applicable:"Participación no autorizada"}[status]||status);

  window.NEXUS_MEASUREMENT={
    version:"15.1",
    likertAgreement,
    studentInstruments,
    teacherInstruments,
    all,
    byId,
    currentWeek,
    availability,
    dimensionScores,
    formHtml,
    readAnswers,
    labelForStatus,
    escape
  };
})();
