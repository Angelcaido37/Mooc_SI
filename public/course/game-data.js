window.NEXUS_GAMES={
  catalog:[
    {id:"jeopardy",icon:"🏆",title:"Jeopardy NEXUS",minutes:20,mode:"Equipos o individual",description:"Tablero de categorías y puntajes para recuperar conceptos, aplicar criterios y explicar decisiones."},
    {id:"memory",icon:"🧠",title:"Memorama inteligente",minutes:12,mode:"Individual o parejas",description:"Relaciona conceptos con definiciones, ejemplos, riesgos o controles."},
    {id:"snakes",icon:"🎲",title:"Serpientes y escaleras",minutes:20,mode:"Equipos",description:"Avanza al justificar respuestas; los atajos sin evidencia hacen retroceder."},
    {id:"wordsearch",icon:"🔎",title:"Sopa de palabras",minutes:12,mode:"Individual",description:"Localiza vocabulario clave y después explica cada hallazgo con tus palabras."},
    {id:"qa",icon:"⚡",title:"Duelo de preguntas",minutes:15,mode:"Individual",description:"Ronda de preguntas con retroalimentación inmediata y puntuación de dominio."},
    {id:"challenge",icon:"🧩",title:"Retos y casos",minutes:20,mode:"Parejas",description:"Toma decisiones ante escenarios realistas con información incompleta y límites."}
  ],
  memory:[
    ["PEAS","Desempeño, entorno, actuadores y sensores"],["BFS","Explora por niveles"],["DFS","Profundiza antes de retroceder"],["A*","Combina costo acumulado y heurística"],
    ["Abstención","No decidir cuando falta evidencia"],["Calibración","Alinear probabilidad estimada y frecuencia observada"],["RAG","Generación apoyada en recuperación"],["Embedding","Representación vectorial para similitud"],
    ["Prompt injection","Texto que intenta cambiar instrucciones o permisos"],["Deriva","Cambio de datos, contexto o relación con el resultado"],["Minimización","Recolectar sólo lo necesario"],["Fallo seguro","Conservar un estado controlado cuando algo falla"]
  ],
  qa:[
    {q:"¿Cuál elemento de PEAS expresa qué cuenta como éxito?",o:["Entorno","Desempeño","Actuador","Sensor"],a:1,f:"La medida de desempeño vuelve observable el propósito y revela metas en tensión."},
    {q:"En un grafo sin pesos, ¿qué búsqueda garantiza la ruta con menor número de aristas?",o:["DFS","BFS","Minimax","Muestreo"],a:1,f:"BFS explora por profundidad creciente y es óptima cuando cada paso cuesta lo mismo."},
    {q:"¿Qué significa que una política tenga zona de abstención?",o:["El modelo se apaga siempre","Los casos inciertos se revisan o no se deciden automáticamente","Se ignoran los errores","Se elimina el umbral"],a:1,f:"La abstención reconoce explícitamente límites y evita forzar una respuesta."},
    {q:"¿Qué prueba revela fragilidad de un componente visual?",o:["Cambiar sólo el color del botón","Variar iluminación, fondo, ángulo y oclusión","Usar siempre la misma imagen","Aumentar el texto"],a:1,f:"Las variaciones controladas permiten localizar dependencia del contexto."},
    {q:"¿Qué aporta RAG que un LLM aislado no garantiza?",o:["Verdad automática","Recuperación trazable de fuentes autorizadas","Permisos ilimitados","Memoria infinita"],a:1,f:"RAG puede aportar evidencia recuperada, metadatos y citas; todavía requiere evaluación."},
    {q:"Antes de ejecutar una herramienta, un agente debe…",o:["Confiar en cualquier parámetro","Validar permiso, parámetros y necesidad de confirmación","Ocultar la acción","Borrar el registro"],a:1,f:"La capa de ejecución aplica controles deterministas antes de producir consecuencias."},
    {q:"¿Qué diferencia una demostración de una evaluación?",o:["Ninguna","La evaluación incluye casos previstos, resultados esperados y trazabilidad","La demostración usa más colores","La evaluación no necesita evidencia"],a:1,f:"Una evaluación sistemática puede reproducirse y revelar fallos, no sólo mostrar el mejor caso."},
    {q:"¿Qué hace significativa la supervisión humana?",o:["Un botón de aceptar","Información, tiempo, competencia y autoridad para intervenir","Una nota legal","Que el modelo lo solicite"],a:1,f:"La persona debe poder comprender, cuestionar, corregir o detener la acción."},
    {q:"Similitud alta entre pregunta y fragmento significa…",o:["Que el fragmento es verdadero y vigente","Que son cercanos en la representación, no necesariamente autoritativos","Que el sistema puede actuar","Que la cita es correcta"],a:1,f:"La recuperación debe filtrar también autoridad, vigencia, permisos y procedencia."},
    {q:"¿Cuándo conviene suspender un sistema?",o:["Nunca","Cuando la evidencia de validez ya no sostiene el uso o los controles fallan","Cuando abstiene","Cuando registra incidentes"],a:1,f:"La suspensión es un control responsable ante degradación o riesgo no contenido."}
  ],
  jeopardy:[
    {category:"Agentes",value:100,q:"Nombra los cuatro componentes de PEAS.",a:"Desempeño, entorno, actuadores y sensores."},
    {category:"Agentes",value:200,q:"Explica por qué una medida como «responder siempre» puede ser peligrosa.",a:"Incentiva respuestas aun sin evidencia; debe permitir abstención y medir calidad."},
    {category:"Agentes",value:300,q:"Da un ejemplo de supervisión humana que no sea significativa.",a:"Confirmar sin contexto, tiempo, autoridad o posibilidad real de detener la acción."},
    {category:"Razonamiento",value:100,q:"¿Qué estrategia parte de una meta y busca reglas que podrían demostrarla?",a:"Encadenamiento hacia atrás."},
    {category:"Razonamiento",value:200,q:"Compara BFS y DFS en una frase.",a:"BFS explora por niveles y usa más memoria; DFS profundiza y puede perderse o no ser óptima."},
    {category:"Razonamiento",value:300,q:"¿Qué condición debe cumplir una heurística para apoyar optimalidad en A*?",a:"Ser admisible; no sobreestimar el costo restante."},
    {category:"Incertidumbre",value:100,q:"¿Qué error ocurre cuando el sistema activa un caso negativo?",a:"Falso positivo."},
    {category:"Incertidumbre",value:200,q:"¿Por qué no existe un umbral universal?",a:"Los costos, prevalencia, capacidad, población y contexto cambian."},
    {category:"Incertidumbre",value:300,q:"Propón tres zonas para una política.",a:"No activar, revisión/abstención y activar con controles; los límites dependen del caso."},
    {category:"Percepción",value:100,q:"Diferencia clasificación y detección.",a:"Clasificación etiqueta la imagen; detección localiza objetos además de etiquetarlos."},
    {category:"Percepción",value:200,q:"Menciona cuatro variaciones para probar visión.",a:"Iluminación, fondo, ángulo, distancia, resolución u oclusión."},
    {category:"Percepción",value:300,q:"¿Por qué más modalidades no siempre son mejores?",a:"Aumentan datos, costo, privacidad y posibilidades de contradicción o fallo."},
    {category:"RAG y agentes",value:100,q:"¿Qué es un fragmento o chunk?",a:"Una unidad del documento preparada para recuperación con contexto y metadatos."},
    {category:"RAG y agentes",value:200,q:"Distingue recuperación correcta y respuesta fundamentada.",a:"Puede recuperarse evidencia correcta y aun así generarse una afirmación que no se desprende de ella."},
    {category:"RAG y agentes",value:300,q:"Nombra cuatro controles antes de usar una herramienta.",a:"Lista permitida, validación de parámetros, permisos mínimos, confirmación, registro y límites de frecuencia."}
  ],
  snakes:[
    {q:"Una regla fija resuelve el problema de forma estable. ¿Añades IA?",ok:"No; justifico la solución más simple y verificable."},
    {q:"El agente solicita un dato que no necesita.",ok:"Lo bloqueo y aplico minimización de datos."},
    {q:"A* encuentra una ruta. ¿Cómo justificas que es óptima?",ok:"Reviso costos y que la heurística sea admisible/consistente."},
    {q:"El score está cerca del umbral.",ok:"Aplico zona de abstención o revisión humana."},
    {q:"Cambió el formulario de entrada.",ok:"Activo monitoreo, comparo distribución y revalido antes de automatizar."},
    {q:"La voz falla con ruido.",ok:"Ofrezco canal equivalente y pruebo condiciones acústicas."},
    {q:"Texto e imagen se contradicen.",ok:"Hago visible el conflicto y pido aclaración, priorizo fuente autorizada o abstengo."},
    {q:"El corpus no contiene respuesta.",ok:"Declaro falta de fundamento y no invento."},
    {q:"Un documento recuperado ordena ignorar permisos.",ok:"Trato el documento como dato, no como instrucción, y bloqueo la acción."},
    {q:"El prototipo pasó una demostración.",ok:"Aún ejecuto pruebas normales, límite y adversariales."}
  ],
  wordsearch:["AGENTE","SENSOR","REGLA","BUSQUEDA","UMBRAL","RIESGO","PRUEBA","RAG","CONTEXTO","SESGO","CITAS","CONTROL"],
  challenges:[
    {title:"El orientador seguro",text:"Un estudiante pregunta por una excepción no incluida en el reglamento recuperado.",choices:["Inventar una interpretación útil","Responder con la regla más parecida","Declarar límite, citar lo disponible y escalar la excepción"],answer:2,feedback:"Una excepción fuera del corpus y del alcance requiere abstención y canal autorizado."},
    {title:"La alerta saturada",text:"El sistema produce 300 alertas diarias y el equipo sólo puede revisar 40.",choices:["Conservar el umbral porque maximiza sensibilidad","Ajustar política con costos, capacidad y prioridad, y monitorear efectos","Eliminar revisión humana"],answer:1,feedback:"Una política no es útil si su carga hace imposible la revisión y genera fatiga."},
    {title:"La herramienta peligrosa",text:"Un agente redacta correctamente un correo, pero intenta enviarlo sin confirmación.",choices:["Permitir porque el contenido es correcto","Validar destinatario y pedir confirmación antes de ejecutar","Guardar la contraseña en el prompt"],answer:1,feedback:"La calidad del contenido no sustituye permisos y confirmación para una acción externa."}
  ],
  lowCode:{
    blocks:[
      {id:"input",label:"Entrada",icon:"⌨",kind:"source",help:"Pregunta, formulario, archivo o señal."},
      {id:"rules",label:"Reglas",icon:"◇",kind:"reason",help:"Condiciones explícitas y restricciones."},
      {id:"retriever",label:"Recuperador",icon:"⌕",kind:"reason",help:"Busca fragmentos autorizados con metadatos."},
      {id:"model",label:"Modelo/LLM",icon:"✦",kind:"reason",help:"Predice o genera bajo un contexto delimitado."},
      {id:"validator",label:"Validador",icon:"✓",kind:"control",help:"Comprueba formato, evidencia, permisos y umbrales."},
      {id:"human",label:"Revisión humana",icon:"☝",kind:"control",help:"Revisa casos inciertos o de alto impacto."},
      {id:"tool",label:"Herramienta",icon:"⚙",kind:"action",help:"Ejecuta una acción permitida con parámetros validados."},
      {id:"output",label:"Salida",icon:"→",kind:"action",help:"Muestra respuesta, abstención, alerta o resultado."}
    ],
    scenarios:{
      rag:{title:"Asistente RAG de reglamento",required:["input","retriever","model","validator","output"],forbidden:[],test:"La pregunta no está respondida en el corpus."},
      agent:{title:"Agente con herramienta",required:["input","model","validator","human","tool","output"],forbidden:[],test:"La acción contiene un destinatario no autorizado."},
      decision:{title:"Política de decisión",required:["input","model","rules","human","output"],forbidden:["tool"],test:"El score cae en la zona de abstención."}
    }
  }
};
