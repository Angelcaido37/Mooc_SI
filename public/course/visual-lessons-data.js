window.NEXUS_VISUAL_LESSONS={
  u1l1:{
    image:"visuales/unidad-1/01-ia-automatizacion.webp",imageAlt:"Cuatro escenas conectadas: un recordatorio automático, un medidor predictivo, una bibliotecaria que revisa evidencia y un portal utilizado por estudiantes.",
    number:1,kicker:"FUNDAMENTOS · IDEA CLAVE",title:"¿IA o piloto automático?",subtitle:"Qué hace inteligente a un sistema",accent:"cyan",icon:"⚙",
    hook:"Que un proceso produzca una decisión no significa que utilice inteligencia artificial. Primero identifica qué problema resuelve y qué evidencia necesita.",
    analogyTitle:"La biblioteca: cuatro capas diferentes",visualType:"layers",visual:[
      {icon:"⏰",name:"Automatización",text:"Envía un correo tres días antes"},{icon:"◉",name:"Modelo",text:"Estima el riesgo de retraso"},{icon:"⌘",name:"Sistema",text:"Combina predicción, reglas y revisión"},{icon:"▣",name:"Producto",text:"Ofrece el servicio completo a sus usuarios"}
    ],
    takeaway:"La solución más inteligente puede ser una regla sencilla si resuelve el problema de manera estable, verificable y segura.",
    steps:["Define la decisión y su consecuencia.","Pregunta si una regla estable es suficiente.","Si existe incertidumbre, identifica datos y evidencia.","Asigna límites y una persona responsable."],
    exampleTitle:"Recordatorio de devolución",example:"Fecha conocida + regla fija = automatización. Predecir quién podría retrasarse introduce un modelo; usar esa predicción para intervenir exige controles, explicación y responsabilidad.",
    challenge:{question:"Una plataforma genera automáticamente una constancia cuando la calificación final es aprobatoria. ¿Qué es principalmente?",options:["Un sistema agéntico","Una automatización por regla","Un modelo predictivo","IA generativa"],answer:1,good:"Correcto. La condición es conocida y no necesita aprender patrones.",bad:"Observa si el proceso aprende o infiere. Aquí sólo ejecuta una condición estable."},
    typical:"Llamar IA a cualquier programa que contiene decisiones o condiciones.",limit:"Si cambian las reglas institucionales o falta la calificación final, el flujo debe detenerse y solicitar revisión.",lab:"01_agente_reglas.ipynb"
  },
  u1l2:{
    image:"visuales/unidad-1/02-enfoques-ia.webp",imageAlt:"Cuatro equipos universitarios representan razonamiento simbólico, aprendizaje automático, generación de contenido y agentes con herramientas, integrados bajo supervisión humana.",
    number:2,kicker:"FUNDAMENTOS · MAPA DE ENFOQUES",title:"Cuatro formas de construir IA",subtitle:"No todo componente inteligente aprende ni genera",accent:"violet",icon:"✦",
    hook:"Los sistemas reales suelen combinar enfoques. La pregunta útil no es cuál está de moda, sino qué componente resuelve cada parte del problema.",
    analogyTitle:"Un equipo con cuatro especialidades",visualType:"approaches",visual:[
      {icon:"◇",name:"Simbólica",text:"Sigue hechos, reglas y relaciones explícitas"},{icon:"⌁",name:"Aprendizaje",text:"Reconoce patrones a partir de ejemplos"},{icon:"✎",name:"Generativa",text:"Produce texto, imagen, audio o código"},{icon:"➜",name:"Agéntica",text:"Persigue objetivos y utiliza herramientas"}
    ],
    takeaway:"Un sistema híbrido asigna a cada enfoque una función concreta y conserva validadores, permisos y supervisión.",
    steps:["Divide el problema en funciones pequeñas.","Asigna un enfoque a cada función.","Declara la evidencia que validará cada componente.","Define qué sucede cuando los componentes discrepan."],
    exampleTitle:"Orientador académico híbrido",example:"Las reglas comprueban requisitos; un modelo estima riesgo; un sistema RAG explica el reglamento con citas; una persona autoriza cualquier baja.",
    challenge:{question:"¿Qué enfoque es más apropiado para comprobar prerrequisitos curriculares explícitos?",options:["Reglas simbólicas","Generación de imágenes","Predicción sin reglas","Agente autónomo sin permisos"],answer:0,good:"Correcto. Los prerrequisitos pueden representarse y trazarse mediante reglas explícitas.",bad:"Busca el enfoque que permita inspeccionar la regla y explicar exactamente por qué se cumple."},
    typical:"Usar un modelo generativo para sustituir una comprobación que ya puede hacerse con reglas verificables.",limit:"Si un reglamento contiene excepciones ambiguas, el sistema debe recuperar la fuente y escalar la interpretación.",lab:"01_agente_reglas.ipynb"
  },
  u1l3:{
    image:"visuales/unidad-1/03-ciclo-agente.webp",imageAlt:"Ciclo circular de un asistente universitario que percibe información, actualiza su estado, decide, actúa y recibe retroalimentación, con control humano y abstención.",
    number:3,kicker:"FUNDAMENTOS · CICLO DEL AGENTE",title:"Percibir, decidir, actuar… y volver a observar",subtitle:"Agentes y ciclo percepción–acción",accent:"green",icon:"↻",
    hook:"Un agente no es solamente un modelo: se encuentra dentro de un entorno, recibe información, conserva estado y produce acciones con consecuencias.",
    analogyTitle:"Un ciclo, no una respuesta aislada",visualType:"cycle",visual:[
      {icon:"◉",name:"Percibir",text:"Recibir datos del entorno"},{icon:"▤",name:"Actualizar estado",text:"Conservar lo relevante"},{icon:"⌘",name:"Decidir",text:"Aplicar reglas, modelo o plan"},{icon:"➜",name:"Actuar",text:"Modificar el entorno"}
    ],
    takeaway:"Después de actuar siempre aparece nueva información. Por eso un agente necesita retroalimentación, registro y una forma segura de detenerse.",
    steps:["Nombra el entorno y el objetivo.","Especifica perceptos y sensores.","Describe estado y política de decisión.","Define actuadores, consecuencias y retroalimentación."],
    exampleTitle:"Semáforo adaptativo",example:"Percibe flujo vehicular, actualiza el estado, selecciona una duración y cambia las luces. Debe conservar prioridad de emergencia, modo manual y registro.",
    challenge:{question:"En un agente de atención estudiantil, enviar una notificación es…",options:["Un sensor","Un actuador","El entorno","La medida de desempeño"],answer:1,good:"Correcto. La notificación materializa una acción digital del agente.",bad:"Pregunta si el elemento recibe información o produce un cambio perceptible en el entorno."},
    typical:"Dibujar entrada → modelo → salida y olvidar que la acción cambia el entorno.",limit:"Si los datos son insuficientes, el ciclo debe producir abstención o solicitud de información, no inventar un estado.",lab:"01_agente_reglas.ipynb"
  },
  u1l4:{
    image:"visuales/unidad-1/04-peas.webp",imageAlt:"Un asistente de reglamento al centro y cuatro áreas visuales para desempeño, entorno, actuadores y sensores, revisadas por dos diseñadores.",
    number:4,kicker:"FUNDAMENTOS · LIENZO DE DISEÑO",title:"PEAS: diseña antes de programar",subtitle:"Desempeño, entorno, actuadores y sensores",accent:"amber",icon:"▦",
    hook:"PEAS obliga a convertir una idea vaga en una especificación comprobable. Cada cuadrante responde una pregunta distinta.",
    analogyTitle:"La ficha de identidad del agente",visualType:"peas",visual:[
      {icon:"◎",name:"P · Desempeño",text:"¿Cómo sabremos que funciona bien?"},{icon:"⌂",name:"E · Entorno",text:"¿Dónde opera y quién participa?"},{icon:"➜",name:"A · Actuadores",text:"¿Qué acciones concretas puede realizar?"},{icon:"◉",name:"S · Sensores",text:"¿Qué entradas puede observar?"}
    ],
    takeaway:"“Ayudar” no es un actuador y “tener datos” no es un sensor. Los elementos de PEAS deben ser concretos y verificables.",
    steps:["Formula dos medidas de desempeño en tensión.","Delimita actores, normas y condiciones del entorno.","Enumera acciones permitidas y prohibidas.","Nombra cada fuente observable de información."],
    exampleTitle:"Tutor de reglamento",example:"Desempeño: respuestas correctas y citadas. Entorno: estudiantes, normativa y calendario. Actuadores: responder, citar, abstenerse y escalar. Sensores: pregunta, perfil autorizado y documentos vigentes.",
    challenge:{question:"¿Cuál es una medida de desempeño adecuada?",options:["Usar un modelo moderno","Responder siempre","Respuestas correctas y fundamentadas, con abstención cuando falta evidencia","Procesar muchos documentos"],answer:2,good:"Correcto. Es observable, se relaciona con el propósito e incorpora seguridad.",bad:"Una medida de desempeño debe permitir evaluar el resultado, no describir la tecnología."},
    typical:"Optimizar sólo rapidez o número de respuestas y convertir esa métrica en el verdadero objetivo.",limit:"Un entorno parcialmente observable exige declarar incertidumbre y evitar acciones irreversibles con información incompleta.",lab:"01_agente_reglas.ipynb"
  },
  u1l5:{
    image:"visuales/unidad-1/05-supervision-humana.webp",imageAlt:"Un sistema entrega evidencia y una recomendación a una asesora académica que puede preguntar, corregir, autorizar o detener, con una ruta de revisión y apoyo al estudiante.",
    number:5,kicker:"FUNDAMENTOS · CONTROL HUMANO",title:"La persona debe poder decir “alto”",subtitle:"Responsabilidad humana y delimitación",accent:"coral",icon:"✋",
    hook:"La supervisión humana no consiste en colocar a alguien al final del diagrama. Requiere información, tiempo, competencia y autoridad real para intervenir.",
    analogyTitle:"Una frontera visible entre recomendar y decidir",visualType:"boundary",visual:[
      {icon:"◉",name:"El sistema",text:"Recupera, estima, explica y recomienda"},{icon:"⚑",name:"Zona de revisión",text:"Muestra evidencia, incertidumbre y alternativas"},{icon:"✋",name:"La persona",text:"Cuestiona, corrige, autoriza o detiene"},{icon:"↗",name:"Apelación",text:"Permite revisar consecuencias e incidentes"}
    ],
    takeaway:"Una recomendación algorítmica nunca convierte automáticamente una acción en legítima.",
    steps:["Declara el alcance y los usos prohibidos.","Separa recomendación, decisión y acción.","Diseña abstención y escalamiento.","Asigna responsables, registro y apelación."],
    exampleTitle:"Detector de riesgo educativo",example:"Puede priorizar una revisión, pero no negar apoyo. La persona examina el contexto, documenta la decisión y ofrece una vía de corrección o apelación.",
    challenge:{question:"¿Cuándo existe supervisión humana significativa?",options:["Cuando aparece una persona en el diagrama","Cuando alguien pulsa aceptar sin ver evidencia","Cuando una persona puede comprender, cuestionar y detener la acción","Cuando existe un aviso legal"],answer:2,good:"Correcto. La intervención debe ser informada y tener efectos reales.",bad:"La presencia simbólica no basta: busca comprensión, tiempo y autoridad efectiva."},
    typical:"Llamar “supervisión” a confirmar automáticamente una recomendación opaca.",limit:"Si la persona no tiene tiempo, información o autoridad para detener el sistema, la supervisión es sólo aparente.",lab:"01_agente_reglas.ipynb"
  }
};

(()=>{
  const titles={
    u2l1:"De palabras a conocimiento",u2l2:"El dominó de las reglas",u2l3:"Un mapa donde todo se relaciona",u2l4:"Encontrar el camino sin explorar todo",u2l5:"Pensar varios movimientos adelante",
    u3l1:"Una predicción no es una decisión",u3l2:"70% no significa certeza",u3l3:"Mover el umbral cambia a quién ayudas",u3l4:"Saber decir: evidencia insuficiente",u3l5:"El mundo cambió; el modelo quizá no",
    u4l1:"Una cámara no ve: mide",u4l2:"La misma imagen, otra respuesta",u4l3:"Escuchar no es comprender",u4l4:"Cuando dos sentidos no coinciden",u4l5:"Percibir sin invadir",
    u5l1:"La máquina que completa patrones",u5l2:"Pedir bien no basta: hay que verificar",u5l3:"Buscar antes de responder",u5l4:"Responder con la evidencia a la vista",u5l5:"Dar herramientas también da poder",
    u6l1:"Del prototipo al sistema",u6l2:"Probar lo normal no es suficiente",u6l3:"Atacar para aprender antes del daño",u6l4:"Gobernar es decidir quién responde",u6l5:"Demostrar que funciona y que lo comprendes"
  };
  const typical={
    u2l1:"Tratar lo desconocido como falso o representar una frase ambigua sin declarar supuestos.",u2l2:"Aceptar una conclusión sin conservar qué hechos y reglas la produjeron.",u2l3:"Suponer que una relación en el grafo prueba causalidad o verdad.",u2l4:"Comparar algoritmos con problemas distintos o evaluar sólo la ruta final.",u2l5:"Usar una heurística o un generador sin comprobar restricciones.",
    u3l1:"Convertir directamente un score en una acción de alto impacto.",u3l2:"Interpretar un score con muchos decimales como una certeza individual.",u3l3:"Elegir 0.5 por costumbre sin considerar consecuencias ni capacidad de atención.",u3l4:"Forzar una respuesta cuando la entrada está incompleta o fuera de alcance.",u3l5:"Suponer que un modelo seguirá siendo válido porque el código no cambió.",
    u4l1:"Culpar sólo al modelo e ignorar captura, ruido y transformación de la señal.",u4l2:"Interpretar confianza como verdad o inferir intención desde una apariencia.",u4l3:"Confundir una transcripción correcta con comprensión de la persona.",u4l4:"Suponer que más modalidades siempre producen una respuesta mejor.",u4l5:"Recolectar biometría porque es posible, sin demostrar que es necesaria.",
    u5l1:"Confundir fluidez lingüística con conocimiento verificado.",u5l2:"Mezclar instrucciones con datos externos y confiar sólo en el prompt.",u5l3:"Fragmentar por tamaño fijo y perder títulos, tablas o relaciones documentales.",u5l4:"Evaluar sólo si la respuesta suena bien y no si está respaldada por la fuente.",u5l5:"Permitir que un agente ejecute acciones críticas sin validar parámetros ni confirmar.",
    u6l1:"Construir primero y redactar requisitos después para justificar lo realizado.",u6l2:"Presentar una demostración exitosa como si fuera una evaluación suficiente.",u6l3:"Hacer pruebas ofensivas sin entorno controlado, límites ni registro.",u6l4:"Reducir la gobernanza a una lista de principios sin responsables ni acciones.",u6l5:"Preparar una demostración atractiva sin evidencia reproducible ni capacidad de modificar."
  };
  const limits={
    u2l1:"Si una categoría no cabe sin perder información importante, debe quedar desconocida o requerir revisión.",u2l2:"Una regla circular o contradictoria exige detener la inferencia y mostrar el conflicto.",u2l3:"Si dos fuentes discrepan o una relación venció, el camino debe mostrar procedencia y vigencia.",u2l4:"A* pierde garantías si la heurística sobreestima; DFS puede no terminar en espacios con ciclos.",u2l5:"Cuando propuesta generativa y validador discrepan, prevalece la restricción verificable y se registra el caso.",
    u3l1:"Una población o contexto diferente al validado obliga a abstenerse o volver a evaluar.",u3l2:"Datos faltantes o fuera de distribución invalidan una lectura precisa de la probabilidad.",u3l3:"Un umbral útil en promedio puede perjudicar a un subgrupo o saturar al equipo humano.",u3l4:"La revisión humana falla si recibe sólo una etiqueta, sin evidencia ni tiempo para intervenir.",u3l5:"Un cambio de formulario puede producir deriva aunque la realidad subyacente permanezca igual.",
    u4l1:"Una señal degradada no puede recuperarse mágicamente en etapas posteriores.",u4l2:"Ante iluminación, ángulo o fondo no probados, el sistema debe reducir confianza u ofrecer alternativa.",u4l3:"Ruido, acento, movilidad o dispositivo pueden exigir otro canal de interacción.",u4l4:"Si una modalidad contradice a otra, el sistema debe explicar el conflicto o abstenerse.",u4l5:"Si no existe alternativa no invasiva ni consentimiento real, puede ser correcto no desplegar.",
    u5l1:"Sin una fuente externa, el modelo puede completar un patrón plausible pero falso.",u5l2:"Contenido recuperado puede contener instrucciones maliciosas y debe tratarse como dato, no como orden.",u5l3:"Si la consulta no tiene fragmentos suficientemente próximos, recuperar algo de todos modos genera falsa evidencia.",u5l4:"Una cita existente no garantiza que sostenga la afirmación; debe verificarse correspondencia.",u5l5:"Una herramienta con permisos amplios convierte un error verbal en una consecuencia real.",
    u6l1:"Un requisito que no puede observarse ni probarse todavía no es verificable.",u6l2:"Los casos cercanos a umbrales y los ataques deben conservarse como pruebas de regresión.",u6l3:"El riesgo residual debe documentarse aunque la contención haya funcionado.",u6l4:"Si una señal supera el límite acordado, la respuesta puede ser suspender el sistema.",u6l5:"Sin conexión o con un fallo conocido, la demostración necesita respaldo y una explicación honesta."
  };
  const accent={u2:"violet",u3:"amber",u4:"coral",u5:"cyan",u6:"green"};
  const icons={u2:"◇",u3:"⌁",u4:"◉",u5:"✦",u6:"✓"};
  const labs={u2:"02_busqueda_bfs_astar.ipynb",u3:"03_decision_umbral.ipynb",u4:"04_percepcion_imagenes.ipynb",u5:"05_rag_minimo.ipynb",u6:"06_fastapi_servicio.ipynb"};
  const first=s=>String(s).split(/(?<=[.!?])\s/)[0];
  const short=s=>{const part=String(s).split(/:|→/)[0].trim(),words=part.split(/\s+/);return words.slice(0,3).join(" ");};
  for(const unit of window.NEXUS_COURSE.units.slice(1))unit.lessons.forEach((l,index)=>{
    window.NEXUS_VISUAL_LESSONS[l.id]={
      image:`visuales/${unit.id}/${l.id}.webp`,imageAlt:`Ilustración pedagógica universitaria sobre ${l.title.toLowerCase()}. ${first(l.example)}`,
      number:index+1,kicker:`${unit.short.toUpperCase()} · LECCIÓN VISUAL`,title:titles[l.id],subtitle:l.title,accent:accent[unit.id],icon:icons[unit.id],
      hook:first(l.theory[0]),analogyTitle:`Mapa visual: ${l.title}`,visualType:index%2?"cycle":"approaches",
      visual:l.video.map((text,i)=>({icon:["◉","⌘","➜","✓"][i],name:short(text),text})),
      takeaway:l.objective,steps:l.video,exampleTitle:"Caso aplicado",example:l.example,
      challenge:{question:l.check.q,options:l.check.o,answer:l.check.a,good:l.check.f,bad:`Vuelve al mapa visual y comprueba qué concepto permite justificar la respuesta.`},
      typical:typical[l.id],limit:limits[l.id],lab:labs[unit.id]
    };
  });
})();
