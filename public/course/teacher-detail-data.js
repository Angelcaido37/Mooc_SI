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
  const make=s=>{
    const concepts=s.focus.split(/;|\.|:/).map(x=>x.trim()).filter(Boolean);
    const expectedCore=[`Distingue los conceptos centrales de ${s.title.toLowerCase()}.`,`Justifica decisiones con evidencia, límites y consecuencias.`,`Reconoce cuándo debe abstenerse o solicitar revisión humana.`];
    return {
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
      classroomText:`Sesión ${s.number}: ${s.title}\n\nPropósito: ${s.objective}\n\nActividad independiente (${s.independentMinutes} min): ${s.independent.map(x=>`${x[0]} (${x[1]} min): ${x[2]}`).join(" ")}\n\nEvidencia: ${s.product}\n\nAntes de entregar, verifique que su trabajo incluya procedimiento, evidencia, límites y una reflexión sobre responsabilidad.`
    };
  };
  window.NEXUS_TEACHER_DETAIL={sessions:T.sessions.map(make),firstCases};
})();
