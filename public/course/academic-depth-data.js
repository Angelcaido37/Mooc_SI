(()=>{
  const C=window.NEXUS_COURSE;
  const unitSupport={
    u1:{prior:"Diferencia entre automatizar, predecir, decidir y actuar; propósito de un sistema.",errors:["Llamar IA a cualquier automatización.","Confundir modelo con sistema completo.","Definir sensores o actuadores con palabras vagas."],transfer:"Delimitar un caso universitario real, decidir qué componente necesita IA y justificar dónde debe permanecer la decisión humana."},
    u2:{prior:"Representación de estados, reglas, grafos y costos.",errors:["Aplicar un algoritmo sin declarar estado inicial, objetivo y restricciones.","Confundir costo acumulado g(n) con heurística h(n).","Asumir que encontrar una ruta equivale a encontrar la mejor ruta."],transfer:"Cambiar costos o restricciones del problema y comprobar si la estrategia sigue siendo adecuada."},
    u3:{prior:"Probabilidad, clasificación, costos de error y criterios de decisión.",errors:["Usar 0.5 como umbral universal.","Interpretar probabilidad como certeza.","Evaluar sólo exactitud cuando los errores tienen costos distintos."],transfer:"Definir una política de decisión con costos FP/FN y justificar cuándo abstenerse o escalar."},
    u4:{prior:"Datos de entrada, condiciones de captura, métricas y variabilidad.",errors:["Confundir percepción con comprensión.","Evaluar sólo con ejemplos fáciles.","Ignorar iluminación, ruido, grupos o condiciones de captura."],transfer:"Construir pruebas por condición y documentar dónde falla el componente perceptual."},
    u5:{prior:"Generación probabilística, fuentes, recuperación y verificación.",errors:["Confiar en fluidez como evidencia de verdad.","Usar RAG sin evaluar recuperación.","Citar documentos que el sistema no recuperó realmente."],transfer:"Diseñar una prueba de RAG con preguntas contestables/no contestables, evidencia recuperada y criterio de abstención."},
    u6:{prior:"Interfaces, APIs, validación, seguridad, integración y observabilidad.",errors:["Integrar componentes sin contrato de entrada/salida.","Probar sólo el caso feliz.","Exponer acciones sensibles sin permisos ni registro."],transfer:"Publicar un componente mínimo como servicio verificable y someterlo a casos normales, límite y adversariales."}
  };
  function depthFor(u,l){const sup=unitSupport[u.id];return {
    id:l.id,unit:u.id,title:l.title,objective:l.objective,
    prior:sup.prior,
    essential:l.theory,
    teacherExpansion:[
      `Conecte el concepto con el resultado de aprendizaje: ${l.objective} No inicie por la herramienta; inicie por el problema, la evidencia que permitiría decidir si funciona y el costo de equivocarse.`,
      `Use el ejemplo del curso como primer caso: ${l.example} Después cambie una condición del caso y pida al grupo anticipar qué parte de la solución debería modificarse.`,
      `Cierre la explicación haciendo explícita la transferencia: el estudiante debe poder reconocer el mismo principio cuando cambien los datos, el contexto o la herramienta, no sólo repetir la definición.`
    ],
    errors:sup.errors,
    likelyQuestions:[
      `¿Cómo sé cuándo este concepto realmente aporta valor y cuándo una solución más simple es suficiente?`,
      `¿Qué evidencia observaríamos para afirmar que la solución funciona y no sólo que “parece funcionar”?`,
      `¿Qué cambia si el costo del error es alto o si falta información?`
    ],
    guided:l.practice,
    autonomous:`Resuelva nuevamente la práctica sin consultar el ejemplo. Después cambie una condición relevante y escriba qué decisión técnica o pedagógica debe cambiar y por qué.`,
    transfer:sup.transfer,
    mastery:`Explique el concepto con sus propias palabras, aplíquelo a un caso distinto, justifique una decisión, identifique un fallo plausible y proponga una prueba que pueda refutar su solución.`,
    remediation:`Si falla la comprobación, vuelva a distinguir entradas, objetivo, decisión, evidencia y riesgo. Reconstruya el ejemplo paso a paso y sólo después intente una variante.`,
    advanced:`Compare dos alternativas válidas para resolver el mismo problema y defienda cuál elegiría bajo restricciones distintas de costo, tiempo, explicabilidad o riesgo.`,
    references:u.references||[]
  }}
  window.NEXUS_ACADEMIC_DEPTH={lessons:C.units.flatMap(u=>u.lessons.map(l=>depthFor(u,l))),unitSupport};
})();
