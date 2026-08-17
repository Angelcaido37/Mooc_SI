window.NEXUS_PEDAGOGY={
 principles:['Aprendizaje activo y situado','Problemas antes que respuestas','Cooperación con responsabilidad individual','Evaluación auténtica y mejora','Gamificación con propósito','Analítica para acompañar, no sancionar','IA responsable con supervisión docente'],
 methodologies:[
  {id:'pbl_problem',name:'Aprendizaje basado en problemas',cycle:['Problema auténtico','Qué sabemos','Qué necesitamos saber','Investigar','Proponer','Contrastar','Reflexionar']},
  {id:'pbl_project',name:'Aprendizaje basado en proyectos',cycle:['Reto','Plan','Construcción','Prueba','Iteración','Producto','Defensa']},
  {id:'cooperative',name:'Aprendizaje cooperativo',cycle:['Meta compartida','Roles','Responsabilidad individual','Interdependencia','Coevaluación','Reflexión de equipo']},
  {id:'steam',name:'STEAM',cycle:['Ciencia','Tecnología','Ingeniería','Arte y diseño','Matemáticas','Impacto social']},
  {id:'inquiry',name:'Indagación',cycle:['Pregunta','Hipótesis','Evidencia','Análisis','Conclusión','Nueva pregunta']}
 ],
 competencies:[
  {id:'critical',name:'Pensamiento crítico',evidence:['u1','u3','u5']},
  {id:'problem',name:'Resolución de problemas',evidence:['u1','u2','u6']},
  {id:'computational',name:'Pensamiento computacional',evidence:['u2','u4','u6']},
  {id:'responsible',name:'IA responsable',evidence:['u1','u3','u4','u5','u6']},
  {id:'collaboration',name:'Colaboración y comunicación',evidence:['u6']}
 ],
 missionMethods:{u1:['pbl_problem','steam'],u2:['inquiry','pbl_problem'],u3:['pbl_problem','inquiry'],u4:['steam','cooperative'],u5:['pbl_project','cooperative'],u6:['pbl_project','steam','cooperative']}
};
