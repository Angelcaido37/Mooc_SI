(()=>{
  const T=window.NEXUS_TEACHING;
  const firstCases=[
    ["Recordatorio de pago","Enviar un aviso en una fecha definida.","Automatización","La fecha y la acción son reglas claras."],
    ["Riesgo de abandono","Estimar qué estudiantes podrían abandonar.","Podría usar IA","Requiere predicción, validación, explicación y apoyo humano."],
    ["Control de temperatura","Encender el aire al superar 28 °C.","Automatización","Una regla transparente es suficiente."],
    ["Solicitud de beca","Aplicar criterios reglamentarios explícitos.","Automatización con revisión","No debe sustituirse la interpretación de excepciones ni el derecho a aclarar."],
    ["Daños en edificios","Detectar indicios en fotografías.","Podría usar IA","La visión puede priorizar revisiones, pero no sustituye la inspección."],
    ["Expulsión automática","Decidir expulsión usando historial.","No conviene construirla así","Es una decisión de alto impacto que exige debido proceso y responsabilidad humana."],
    ["Recursos de aprendizaje","Recomendar apoyos según dificultades.","Depende","Puede resolverse con reglas o IA según escala, diversidad y evidencia."],
    ["Asistencia facial","Reconocer rostros en un grupo pequeño.","No conviene","La invasión y el riesgo biométrico son desproporcionados frente a alternativas simples."]
  ];
  const phase=(title,minutes,teacher,student,expected,intervene,resource,check)=>({title,minutes,teacher,student,expected,intervene,resource,check});
  const lessonById=id=>window.NEXUS_COURSE.units.flatMap(u=>u.lessons).find(l=>l.id===id);
  const firstSentence=text=>{
    const match=String(text||"").match(/^.*?[.!?](?:\s|$)/);
    return (match?match[0]:String(text||"")).trim();
  };
  const compact=(text,max=255)=>{
    const value=String(text||"").replace(/\s+/g," ").trim();
    if(value.length<=max)return value;
    const cut=value.slice(0,max),stop=Math.max(cut.lastIndexOf(". "),cut.lastIndexOf("; "),cut.lastIndexOf(", "));
    return `${cut.slice(0,stop>max*.55?stop:max).trim()}…`;
  };
  const audienceText=text=>String(text||"")
    .replace(/Antes de proponer IA pregunte:/i,"La pertinencia de la IA se evalúa con estas preguntas:")
    .replace(/^Prepare un conjunto de preguntas/i,"Una evaluación sólida incluye un conjunto de preguntas")
    .replace(/^Pruebe inyección/i,"Las pruebas incluyen inyección")
    .replace(/^Defina qué se guarda/i,"La gobernanza de la memoria define qué se guarda")
    .replace(/^Priorice un alcance pequeño/i,"Es preferible un alcance pequeño")
    .replace(/^Diseñe comportamiento ante falta de evidencia/i,"El comportamiento ante falta de evidencia debe quedar definido")
    .replace(/^Siempre que sea posible se procesa/i,"Cuando es viable, el procesamiento se realiza");
  const nounLabel=(text,index)=>{
    const value=String(text||"").replace(/^(Definir|Diseñar|Aplicar|Evaluar|Preparar|Registrar|Comparar|Controlar|Explicar|Separar|Gestionar|Limitar|Probar|Construir|Seleccionar|Validar|Confirmar|Documentar)\s+/i,"");
    return value?value.charAt(0).toUpperCase()+value.slice(1):`Componente ${index+1}`;
  };
  const projectable=s=>{
    const lessons=s.lessonIds.map(lessonById).filter(Boolean);
    const theory=lessons.flatMap(l=>l.theory||[]).map(audienceText);
    const sequence=lessons.flatMap(l=>l.video||[]).slice(0,4);
    const feedback=lessons.map(l=>l.check?.f).filter(Boolean);
    const concepts=theory.slice(0,4).map((text,i)=>({
      label:nounLabel(sequence[i],i),
      text:compact(text,165)
    }));
    const essentials=theory.slice(0,3).map(firstSentence);
    const criteria=[
      `El procedimiento distingue entradas, transformación, salida y responsable.`,
      `La decisión se sostiene con evidencia y no sólo con una respuesta plausible.`,
      `Los límites, casos inciertos y mecanismos de revisión quedan visibles.`,
      feedback[0]||`La conclusión puede explicarse y comprobarse con un caso de prueba.`
    ];
    return [
      {kind:"cover",kicker:`SESIÓN ${s.number} · SISTEMAS INTELIGENTES`,title:s.title,lead:firstSentence(theory[0]),meta:[`${s.theoryMinutes} min de comprensión`,`${s.practiceMinutes} min de aplicación`,`${s.independentMinutes} min de continuidad`]},
      {kind:"question",kicker:"ACTIVACIÓN",title:s.trigger,lead:"Formula una respuesta inicial y un contraejemplo. Después contrasta el criterio que utilizaste con una pareja."},
      {kind:"explanation",kicker:"EXPLICACIÓN CONCEPTUAL",title:"La idea central",lead:compact(theory[0],260),items:concepts.slice(1,4)},
      {kind:"concepts",kicker:"CONCEPTOS ESENCIALES",title:"Las piezas no significan lo mismo",items:concepts},
      {kind:"process",kicker:"RELACIÓN ENTRE COMPONENTES",title:"Así se construye el razonamiento",items:sequence.map((label,i)=>({label:nounLabel(label,i),text:compact(theory[i]||theory[0],145)}))},
      {kind:"case",kicker:"EJEMPLO RAZONADO",title:"Del concepto a una decisión verificable",lead:compact(s.example,560),takeaway:feedback[0]||essentials.at(-1)},
      {kind:"challenge",kicker:"APLICACIÓN EN EQUIPO",title:"Ahora utiliza el criterio",lead:compact(s.guided,470),steps:["Propuesta individual","Contraste de supuestos","Resolución documentada","Defensa con evidencia y límites"],deliverable:s.product},
      {kind:"criteria",kicker:"CRITERIOS DE CALIDAD",title:"Una solución sólida debe mostrar",items:criteria},
      {kind:"summary",kicker:"SÍNTESIS Y TRANSFERENCIA",title:"Lo esencial de la sesión",items:essentials,question:s.exit[0],after:s.independentDetailed.map(x=>`${x.name} · ${x.min} min`)}
    ];
  };
  const resourceByUnit={
    u1:{pdf:"materiales/unidad-1-fundamentos.pdf",template:"plantillas/u1_lienzo_peas.csv",lab:"laboratorios/01_agente_reglas.ipynb"},
    u2:{pdf:"materiales/unidad-2-conocimiento.pdf",template:"plantillas/u2_traza_razonamiento.csv",lab:"laboratorios/02_busqueda_bfs_astar.ipynb"},
    u3:{pdf:"materiales/unidad-3-decision.pdf",template:"plantillas/u3_politica_umbral.csv",lab:"laboratorios/03_decision_umbral.ipynb"},
    u4:{pdf:"materiales/unidad-4-percepcion.pdf",template:"plantillas/u4_matriz_percepcion.csv",lab:"laboratorios/04_percepcion_imagenes.ipynb"},
    u5:{pdf:"materiales/unidad-5-generativa-y-rag.pdf",template:"plantillas/u5_evaluacion_rag.csv",lab:"laboratorios/05_rag_minimo.ipynb"},
    u6:{pdf:"materiales/unidad-6-integracion.pdf",template:"plantillas/u6_matriz_pruebas.csv",lab:"laboratorios/06_fastapi_servicio.ipynb"}
  };
  const fallbackByMoment=[
    "Escriba la pregunta detonante en el pizarrón. El grupo responde en una hoja, contrasta en pareja y usted registra cuatro ideas en dos columnas.",
    "Explique con un mapa de conceptos dibujado en el pizarrón y use el cuaderno PDF descargado o impreso. Mantenga las pausas de predicción.",
    "Dicte o escriba el caso por etapas. Cada pareja reconstruye el procedimiento en papel y muestra el siguiente paso antes de continuar.",
    "Use la plantilla impresa o una hoja dividida en entrada, decisión, evidencia y límite. Asigne roles: portavoz, verificador y relator.",
    "Haga una galería rápida con hojas o fotografías locales. Compare dos soluciones mediante los criterios visibles en el pizarrón.",
    "Aplique un boleto de salida en papel. Lea en voz alta la actividad independiente y pida a una persona que la explique con sus palabras."
  ];
  const make=s=>{
    const concepts=s.focus.split(/;|\.|:/).map(x=>x.trim()).filter(Boolean);
    const expectedCore=[`Distingue los conceptos centrales de ${s.title.toLowerCase()}.`,`Justifica decisiones con evidencia, límites y consecuencias.`,`Reconoce cuándo debe abstenerse o solicitar revisión humana.`];
    const detail={
      ...s,
      preparation:[...s.teacherChecklist,`Revisar el propósito: ${s.objective}`,`Preparar una versión visible del producto esperado: ${s.product}`],
      keyIdeas:concepts,
      teacherScript:[
        phase("Activación y diagnóstico",10,
          `Presente el propósito sin anticipar la respuesta. Proyecte: “${s.trigger}”. Conceda 2 minutos individuales, 3 para contraste en pareja y recupere 3 respuestas en plenaria.`,
          "Formula una postura inicial, la contrasta y registra una diferencia.",
          ["Una respuesta razonada, aunque todavía incompleta.","Identificación de al menos un supuesto o criterio."],
          "No corrija de inmediato. Pregunte: ¿qué evidencia respalda eso?, ¿en qué caso cambiaría tu respuesta?",
          "Pregunta detonante, cuaderno o formulario de diagnóstico.",
          "Registre dos ideas correctas y dos confusiones para retomarlas durante la explicación."),
        phase("Explicación dialogada",25,
          `Explique por segmentos: ${concepts.join("; ")}. Después de cada segmento haga una pausa de predicción o un ejemplo breve. Use las notas conceptuales de las lecciones ${s.lessonIds.join(", ")}; no lea la pantalla literalmente.`,
          "Escucha activamente, pregunta, propone ejemplos y completa un organizador de conceptos.",
          expectedCore,
          `Si sólo repiten definiciones, solicite una comparación. Si generalizan, pregunte por un caso límite. Cierre el bloque retomando “${s.trigger}”.`,
          "Contenido ampliado, esquema proyectable y glosario de la sesión.",
          "Solicite una explicación con palabras propias y un contraejemplo."),
        phase("Ejemplo comentado",15,
          `Presente el caso sin solución. Pida una propuesta inicial; después resuelva paso a paso: ${s.example}. Verbalice la decisión, la evidencia utilizada, el límite y la responsabilidad.`,
          "Predice el siguiente paso, compara su propuesta y anota una corrección.",
          ["Reconoce la secuencia del procedimiento.","Puede explicar por qué se toma cada decisión, no sólo el resultado."],
          "Ante una respuesta correcta sin justificación, pregunte: ¿cómo lo comprobarías? Ante un error, localice el primer paso donde cambió el razonamiento.",
          "Caso proyectable y solución comentada en modo docente.",
          "Pida que una pareja reconstruya oralmente el procedimiento."),
        phase("Ejercicio guiado",30,
          `Indique el reto: ${s.guided} Organice 2 minutos individuales, 5 de contraste en parejas, 13 de resolución por equipos y 10 para preparar la defensa. Recorra el aula usando preguntas, sin mostrar la solución.`,
          "Propone, contrasta, resuelve con el instrumento, documenta evidencia y prepara una defensa breve.",
          ["Producto parcial trazable.","Justificación de criterios y límites.","Registro de desacuerdos y correcciones."],
          "Pregunte: ¿qué dato sostiene su decisión?, ¿qué alternativa descartaron?, ¿qué ocurriría si falla?, ¿quién responde por la consecuencia?",
          `${s.lab}; hoja de trabajo; ${s.game}.`,
          "Compruebe que cada equipo pueda explicar una decisión y un límite."),
        phase("Revisión y contraste",10,
          `Seleccione dos soluciones diferentes. Compare procedimiento, evidencia y consecuencias. Corrija los errores frecuentes sin exhibir a nadie: ${s.misconceptions.join(" ")}`,
          "Defiende, pregunta, compara y corrige su producto con otro color o registro de cambios.",
          expectedCore,
          "Si el grupo busca una única respuesta, distinga lo que sí es criterio obligatorio de lo que depende del contexto.",
          "Pizarra de contraste y orientaciones docentes.",
          "Cada equipo registra una corrección y su motivo."),
        phase("Cierre, salida y consigna",10,
          `Recupere tres ideas centrales. Elija una pregunta de salida. Finalmente explique, con pantalla visible, cada actividad independiente y precise qué se guarda aquí y qué se entrega en Classroom: ${s.product}`,
          "Sintetiza, responde individualmente la salida y verifica la consigna posterior.",
          ["Conclusión breve y específica.","Una duda o límite auténtico.","Comprensión de la actividad independiente."],
          "Si la salida es vaga, pida un ejemplo o una evidencia concreta. No convierta este momento en una nueva exposición.",
          "Formulario de salida, ruta independiente y enlace a Classroom.",
          "Antes de salir, cada estudiante identifica la primera acción que realizará fuera de clase.")
      ],
      independentDetailed:s.independent.map(([name,min,action],i)=>({
        name,min,action,
        mode:i===3?"Individual o por equipo según la evidencia":"Individual",
        platform:i<3?"Se registra avance, intento y retroalimentación":"Se guarda borrador y estado de evidencia",
        classroom:i===3?`Entregar: ${s.product}`:"No se entrega; es actividad formativa",
        teacherFollowUp:i===0?"Revisar ideas que el grupo marcó como difíciles.":i===1?"Observar patrones de error.":i===2?"Recuperar el error más frecuente al iniciar la siguiente sesión.":"Retroalimentar con la rúbrica correspondiente."
      })),
      materials:["Diapositivas o modo proyección","Hoja de trabajo descargable",s.lab,s.game,"Formulario de salida","Consigna y rúbrica de Classroom"],
      firstCases:s.number===1?firstCases:null,
      expected:expectedCore,
      classroomText:`Sesión ${s.number}: ${s.title}\n\nPropósito: ${s.objective}\n\nActividad independiente (${s.independentMinutes} min): ${s.independent.map(x=>`${x[0]} (${x[1]} min): ${x[2]}`).join(" ")}\n\nEvidencia: ${s.product}\n\nAntes de entregar, verifique que su trabajo incluya procedimiento, evidencia, límites y una reflexión sobre responsabilidad.`,
      projectable:null
    };
    const resources=resourceByUnit[s.unit];
    detail.resources=[
      {label:"Cuaderno PDF de la misión",href:resources.pdf,kind:"Consulta",download:false},
      {label:"Instrumento editable",href:resources.template,kind:"Actividad",download:true},
      {label:"Laboratorio Python",href:resources.lab,kind:"Práctica",download:true},
      {label:"Bitácora del proyecto",href:"plantillas/bitacora_proyecto.csv",kind:"Evidencia",download:true},
      {label:"Vista del estudiante",href:`estudiante.html#visual/${s.lessonIds[0]}`,kind:"Portal",download:false}
    ];
    detail.teacherScript=detail.teacherScript.map((moment,index,all)=>({
      ...moment,
      fallback:fallbackByMoment[index],
      transition:all[index+1]
        ? `Cuando se cumpla la comprobación, anuncie: “Cerramos ${moment.title.toLowerCase()} y pasamos a ${all[index+1].title.toLowerCase()}”.`
        : "Confirme la primera acción independiente, recoja la salida y cierre la sesión sin añadir una nueva explicación."
    }));
    return detail;
  };
  const sessions=T.sessions.map(make);
  sessions.forEach(s=>{s.projectable=projectable(s)});
  window.NEXUS_TEACHER_DETAIL={sessions,firstCases};
})();
