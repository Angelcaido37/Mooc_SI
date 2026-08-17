window.NEXUS_EVAL_DATA={
  categories:[
    {id:'activities',name:'Actividades de aprendizaje',weight:20,description:'Actividades evaluables de aplicación y comprensión.'},
    {id:'mastery',name:'Retos de dominio',weight:15,description:'Retos que exigen demostrar conocimiento o resolver problemas; XP cosmético no se califica.'},
    {id:'evidence',name:'Evidencias de aprendizaje',weight:35,description:'Productos auténticos revisados con rúbrica.'},
    {id:'project',name:'Proyecto integrador',weight:30,description:'Proyecto progresivo, defensa y reflexión individual.'}
  ],
  measurement:{prePostGraded:false,description:'El pretest y postest miden cambio de aprendizaje; no alteran por defecto la calificación.'},
  rubrics:{
    analytical:{id:'analytical',name:'Rúbrica analítica NEXUS',criteria:[
      {id:'understanding',name:'Comprensión conceptual',weight:25},
      {id:'application',name:'Aplicación y solución',weight:25},
      {id:'argumentation',name:'Argumentación y evidencia',weight:20},
      {id:'responsibility',name:'Límites, ética y responsabilidad',weight:15},
      {id:'communication',name:'Comunicación y trazabilidad',weight:15}
    ]},
    project:{id:'project',name:'Proyecto integrador',criteria:[
      {id:'problem',name:'Pertinencia del problema',weight:15},{id:'design',name:'Diseño de la solución',weight:25},{id:'validation',name:'Pruebas y validación',weight:25},{id:'responsibility',name:'IA responsable',weight:20},{id:'defense',name:'Defensa individual',weight:15}
    ]}
  },
  evidences:[
    {id:'u1',unit:1,title:'Ficha del problema, PEAS y delimitación responsable',category:'evidence',points:100,rubric:'analytical',delivery:['text','link','file'],result:'RA1'},
    {id:'u2',unit:2,title:'Modelo de conocimiento, búsqueda e inferencia',category:'evidence',points:100,rubric:'analytical',delivery:['text','link','file'],result:'RA2'},
    {id:'u3',unit:3,title:'Política de decisión, costos y umbrales',category:'evidence',points:100,rubric:'analytical',delivery:['text','link','file'],result:'RA3'},
    {id:'u4',unit:4,title:'Prueba de percepción, robustez y accesibilidad',category:'evidence',points:100,rubric:'analytical',delivery:['text','link','file'],result:'RA4'},
    {id:'u5',unit:5,title:'Arquitectura RAG/agéntica con evaluación y seguridad',category:'evidence',points:100,rubric:'analytical',delivery:['text','link','file'],result:'RA5'},
    {id:'u6',unit:6,title:'Proyecto integrador, demo y defensa',category:'project',points:100,rubric:'project',delivery:['text','link','file'],result:'RA6'}
  ],
  alerts:{inactiveDays:7,lowScore:60,lowParticipationPercent:50,staleActivityDays:10,consecutiveLow:2}
};
