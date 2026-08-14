(()=>{
  const M=window.NEXUS_MEASUREMENT,K=window.NEXUS_MEASUREMENT_KEYS;
  if(!M||!K)return;
  const teacherView=document.querySelector("#teacherView");
  let config={},studentDocs=[],teacherDocs=[],tracking=[],usage={},reflections=[],sessionLogs=[],stops=[],started=false,mounting=false;

  const week=()=>M.currentWeek(config);
  const myDoc=()=>teacherDocs.find(doc=>doc.uid===NEXUS_AUTH?.user?.uid)||{};
  const myResponses=()=>myDoc().responses||{};
  const teacherDeclined=()=>myResponses().t_pre?.participation==="declined";
  const statusOf=instrument=>{
    if(instrument.id!=="t_pre"&&myResponses().t_pre?.participation!=="accepted")return"not_applicable";
    return M.availability(instrument,week(),Boolean(myResponses()[instrument.id]),teacherDeclined());
  };
  const dueTeacher=()=>M.teacherInstruments.filter(item=>statusOf(item)==="due");
  const num=value=>Number.isFinite(Number(value))?Number(value):0;
  const avg=values=>values.length?values.reduce((sum,value)=>sum+num(value),0)/values.length:null;
  const pct=(value,total)=>total?Math.round(value/total*100):0;
  const safeDate=value=>{
    if(!value)return"";
    if(typeof value.toDate==="function")return value.toDate().toISOString().slice(0,10);
    const date=new Date(value);return Number.isNaN(date.getTime())?String(value).slice(0,10):date.toISOString().slice(0,10);
  };
  const notify=message=>{
    const existing=document.querySelector("#teacherToast");
    if(existing){existing.textContent=message;existing.classList.add("show");setTimeout(()=>existing.classList.remove("show"),3300);return;}
    const toast=document.createElement("div");toast.className="measurement-toast";toast.textContent=message;document.body.appendChild(toast);setTimeout(()=>toast.remove(),3300);
  };
  const ensureDialog=()=>{
    let dialog=document.querySelector("#measurementTeacherDialog");
    if(dialog)return dialog;
    dialog=document.createElement("dialog");dialog.id="measurementTeacherDialog";dialog.className="measurement-dialog";
    dialog.innerHTML='<div class="measurement-dialog-head"><strong>Instrumento para el docente</strong><button type="button" data-measurement-close aria-label="Cerrar">×</button></div><div class="measurement-dialog-body"></div>';
    document.body.appendChild(dialog);dialog.querySelector("[data-measurement-close]").onclick=()=>dialog.close();return dialog;
  };
  const hubHtml=()=>`
    <section id="measurementHub" class="measurement-section" aria-live="polite">
      <div class="measurement-dashboard-top">
        <article class="measurement-current-phase"><span class="eyebrow">CALENDARIO AUTOMÁTICO</span><strong id="measurementCurrentWeek">—</strong><span id="measurementCurrentPhase">Configure la fecha de inicio para activar los instrumentos.</span><div class="button-row"><button class="btn btn-primary" type="button" data-scroll-config>Configurar semestre</button><button class="btn btn-outline" type="button" data-export-integrated>Exportar medición integrada</button></div></article>
        <article class="measurement-completion"><h3>Instrumentos disponibles para usted</h3><div id="measurementTeacherDue"><p>Calculando fase…</p></div></article>
      </div>
      <section class="content-block measurement-section" id="measurementConfigSection"><div class="measurement-section-head"><div><span class="eyebrow">CONFIGURACIÓN DEL SEMESTRE</span><h2>Calendario académico</h2><p>La fecha se establece una sola vez y habilita automáticamente cada aplicación.</p></div></div><form id="pilotConfigForm" class="measurement-config"><label>Fecha de inicio<input name="startDate" type="date" required></label><label>Grupo o edición<input name="groupName" maxlength="80" placeholder="Sistemas Inteligentes · 2026-2"></label><button class="btn btn-dark" type="submit">Guardar calendario</button></form><p class="measurement-config-status" id="measurementConfigStatus">Sin configuración publicada.</p></section>
      <section class="content-block measurement-section"><div class="measurement-section-head"><div><span class="eyebrow">CAPTURA AUTOMÁTICA</span><h2>Uso y avance registrados por NEXUS</h2><p>Estos indicadores se actualizan sin encuesta y se interpretan junto con las evidencias.</p></div><div class="measurement-legend"><span>Automático</span><span>No equivale a aprendizaje</span></div></div><div id="measurementAutomatic" class="measurement-auto-grid"></div></section>
      <section class="content-block measurement-section"><div class="measurement-section-head"><div><span class="eyebrow">COBERTURA POR FASE</span><h2>Aplicación de instrumentos estudiantiles</h2><p>Porcentaje de estudiantes registrados que completó cada momento.</p></div></div><div id="measurementCoverage" class="measurement-completion"></div></section>
      <section class="content-block measurement-section"><div class="measurement-section-head"><div><span class="eyebrow">APRENDIZAJE PRE/POST</span><h2>Cambio observado en participantes emparejados</h2><p>Se comparan las mismas personas con diagnóstico y evaluación final.</p></div><span id="measurementPaired" class="status-chip">0 pares</span></div><div id="measurementPrePost"></div></section>
      <section class="content-block measurement-section"><div class="measurement-section-head"><div><span class="eyebrow">EXPERIENCIA ESTUDIANTIL</span><h2>Resultados por dimensión</h2><p>Promedios de 1 a 5 de los pulsos y la encuesta final.</p></div></div><div id="measurementDimensions" class="measurement-bars"></div></section>
      <section class="content-block measurement-section"><div class="measurement-section-head"><div><span class="eyebrow">EVALUACIÓN DE LA PLATAFORMA POR EL DOCENTE</span><h2>Utilidad, claridad y toma de decisiones</h2><p>Combina instrumentos por fase, uso real, reflexiones y bitácoras.</p></div></div><div id="measurementTeacherResults" class="measurement-result-grid"></div><div id="measurementTeacherSchedule" class="measurement-status-list"></div></section>
      <section class="content-block measurement-section measurement-privacy"><span>◉</span><div><strong>Criterio de interpretación</strong><br>Los resultados describen esta implementación. No prueban causalidad por sí solos. Para valorar aprendizaje, contraste el cambio pre/post con rúbricas, productos, bitácoras, observación docente y contexto del grupo.</div></section>
    </section>`;
  function mount(){
    if(mounting||!teacherView||!location.hash.replace(/^#\/?/,"").startsWith("analytics"))return;
    mounting=true;
    const pageHead=teacherView.querySelector(".page-head");
    if(pageHead){const title=pageHead.querySelector("h1"),description=pageHead.querySelector("p");if(title)title.textContent="Medición y resultados de NEXUS";if(description)description.textContent="Integre instrumentos programados, comparación pre/post y datos automáticos sin convertir la actividad digital en calificación automática.";}
    document.querySelectorAll("[data-teacher-nav]").forEach(item=>item.classList.toggle("active",item.dataset.teacherNav==="analytics"));
    if(!document.querySelector("#measurementHub")){
      const anchor=teacherView.querySelector("#analyticsStatus")||teacherView.querySelector(".page-head");
      anchor?.insertAdjacentHTML("afterend",hubHtml());
      bindHub();
      groupOperationalDetail();
    }
    renderDashboard();
    setTimeout(()=>{mounting=false;},0);
  }
  function groupOperationalDetail(){
    if(document.querySelector("#measurementOperationalDetails"))return;
    const overview=teacherView.querySelector(":scope > #analyticsOverview"),engagement=teacherView.querySelector(":scope > .content-block #engagementBars")?.closest(".content-block"),risk=teacherView.querySelector(":scope > .content-block #riskList")?.closest(".content-block"),teacherUse=teacherView.querySelector(":scope > .content-block #teacherUseMetrics")?.closest(".content-block"),semesterPlan=[...teacherView.querySelectorAll(":scope > .content-block")].find(section=>section.querySelector("h2")?.textContent.trim()==="Plan de medición del semestre");
    const nodes=[overview,engagement,risk,teacherUse,semesterPlan].filter(Boolean);if(!nodes.length)return;
    const details=document.createElement("details");details.id="measurementOperationalDetails";details.className="content-block measurement-section measurement-operational-details";details.innerHTML='<summary><span><strong>Analítica operativa y plan semestral</strong><small>Riesgo de inactividad, reflexión por sesión, exportaciones de resultados y calendario de aplicación.</small></span><b>Ver detalle</b></summary><div class="measurement-operational-body"></div>';
    teacherView.appendChild(details);const body=details.querySelector(".measurement-operational-body");nodes.forEach(node=>body.appendChild(node));
  }
  function bindHub(){
    document.querySelector("[data-scroll-config]")?.addEventListener("click",()=>document.querySelector("#measurementConfigSection")?.scrollIntoView({behavior:"smooth"}));
    document.querySelector("[data-export-integrated]")?.addEventListener("click",exportIntegrated);
    document.querySelector("#pilotConfigForm")?.addEventListener("submit",async event=>{
      event.preventDefault();const data=Object.fromEntries(new FormData(event.currentTarget));
      const button=event.currentTarget.querySelector("button");button.disabled=true;button.textContent="Guardando…";
      try{await NEXUS_AUTH.savePilotConfig({startDate:data.startDate,groupName:String(data.groupName||"").trim()});notify("Calendario académico actualizado.");}
      catch(error){notify(`No fue posible guardar: ${error.message}`);}finally{button.disabled=false;button.textContent="Guardar calendario";}
    });
  }
  function renderDashboard(){
    const hub=document.querySelector("#measurementHub");if(!hub)return;
    const current=week(),phase=current===null?"Calendario pendiente":current<1?"El semestre todavía no inicia":current>16?"Semestre concluido":`Semana ${current} de 16`;
    hub.querySelector("#measurementCurrentWeek").textContent=phase;
    hub.querySelector("#measurementCurrentPhase").textContent=config.groupName?`${config.groupName} · instrumentos activados por fase`:"Defina el grupo y la fecha de inicio.";
    const startInput=hub.querySelector('#pilotConfigForm [name="startDate"]'),groupInput=hub.querySelector('#pilotConfigForm [name="groupName"]');
    if(startInput&&document.activeElement!==startInput)startInput.value=safeDate(config.startDate);
    if(groupInput&&document.activeElement!==groupInput)groupInput.value=config.groupName||"";
    hub.querySelector("#measurementConfigStatus").innerHTML=config.startDate?`<strong>Calendario activo.</strong> Inicio: ${new Intl.DateTimeFormat("es-MX",{dateStyle:"long"}).format(new Date(`${safeDate(config.startDate)}T12:00:00`))}; aplicaciones en semanas 1, 4, 8, 12 y 15–16.`:"Sin configuración publicada; los instrumentos permanecen cerrados.";
    drawTeacherDue();drawAutomatic();drawCoverage();drawPrePost();drawDimensions();drawTeacherResults();
  }
  function drawTeacherDue(){
    const box=document.querySelector("#measurementTeacherDue");if(!box)return;
    const due=dueTeacher();
    if(teacherDeclined()){box.innerHTML='<div class="measurement-empty"><strong>Decisión registrada</strong>No se solicitarán instrumentos declarados posteriores.</div>';return;}
    box.innerHTML=due.length?due.map(item=>`<div class="measurement-status-row due"><span>◫</span><div><strong>${M.escape(item.title)}</strong><small>${item.minutes} minutos aproximados</small></div><button class="btn btn-primary" data-open-teacher-instrument="${item.id}">Responder</button></div>`).join(""):'<div class="measurement-empty"><strong>Sin pendientes en esta fase</strong>Los instrumentos aparecerán automáticamente en las semanas programadas.</div>';
    box.querySelectorAll("[data-open-teacher-instrument]").forEach(button=>button.addEventListener("click",()=>openTeacherInstrument(button.dataset.openTeacherInstrument)));
  }
  function drawAutomatic(){
    const box=document.querySelector("#measurementAutomatic");if(!box)return;
    const students=tracking.length,metrics=tracking.map(row=>row.progress?.pilotMetrics||{}),active7=tracking.filter(row=>{const value=row.lastActivityAt||row.progress?.updatedAt||row.updatedAt,date=typeof value?.toDate==="function"?value.toDate():new Date(value||0);return Date.now()-date.getTime()<=7*86400000;}).length;
    const minutes=metrics.reduce((sum,item)=>sum+num(item.activeSeconds),0)/60,visits=metrics.reduce((sum,item)=>sum+num(item.visits),0),attempts=metrics.reduce((sum,item)=>sum+num(item.quizAttempts),0),correct=metrics.reduce((sum,item)=>sum+num(item.quizCorrect),0),progress=students?tracking.reduce((sum,row)=>sum+Math.min(100,Math.round(((row.progress?.lessons||[]).length/30)*100)),0)/students:0;
    box.innerHTML=[
      [students,"estudiantes registrados"],[active7,"activos en 7 días"],[Math.round(progress)+"%","avance promedio"],[Math.round(minutes),"minutos activos aproximados"],[visits,"visitas acumuladas"],[attempts?pct(correct,attempts)+"%":"—","aciertos en controles"],[usage.totalViews||0,"consultas del portal docente"],[sessionLogs.filter(log=>log.status==="completed").length,"sesiones conducidas y cerradas"]
    ].map(([value,label])=>`<article class="measurement-metric"><strong>${value}</strong><span>${label}</span><em>Dato automático</em></article>`).join("");
  }
  function drawCoverage(){
    const box=document.querySelector("#measurementCoverage");if(!box)return;
    const total=tracking.length;
    box.innerHTML=M.studentInstruments.map(item=>{
      const complete=studentDocs.filter(doc=>Boolean(doc.responses?.[item.id])).length,value=pct(complete,total);
      return `<div class="measurement-progress-row"><strong>${M.escape(item.phase)} · ${M.escape(item.title)}</strong><span><i style="width:${value}%"></i></span><b>${complete}/${total||0}</b></div>`;
    }).join("")+(total?"":'<div class="measurement-empty"><strong>Sin estudiantes registrados</strong>La cobertura comenzará a calcularse con el primer acceso estudiantil.</div>');
  }
  const acceptedStudentDocs=()=>studentDocs.filter(doc=>doc.responses?.s_pre?.participation==="accepted");
  function drawPrePost(){
    const box=document.querySelector("#measurementPrePost"),pairedLabel=document.querySelector("#measurementPaired");if(!box)return;
    const paired=acceptedStudentDocs().filter(doc=>doc.responses?.s_pre?.answers&&doc.responses?.s_post?.answers),preScores=paired.map(doc=>K.scoreKnowledge(doc.responses.s_pre.answers).pct),postScores=paired.map(doc=>K.scoreKnowledge(doc.responses.s_post.answers).pct),preSelf=paired.map(doc=>doc.responses.s_pre.dimensionScores?.self_efficacy).filter(Number.isFinite),postSelf=paired.map(doc=>doc.responses.s_post.dimensionScores?.self_efficacy).filter(Number.isFinite),preMot=paired.map(doc=>doc.responses.s_pre.dimensionScores?.motivation).filter(Number.isFinite),postMot=paired.map(doc=>doc.responses.s_post.dimensionScores?.motivation).filter(Number.isFinite);
    if(pairedLabel)pairedLabel.textContent=`${paired.length} par${paired.length===1?"":"es"}`;
    if(!paired.length){box.innerHTML='<div class="measurement-empty"><strong>Aún no existe comparación emparejada.</strong>Se mostrará cuando una misma persona haya completado diagnóstico y evaluación final.</div>';return;}
    const pre=avg(preScores),post=avg(postScores),delta=post-pre;
    box.innerHTML=`<div class="measurement-prepost"><article><span>Conocimiento inicial</span><strong>${pre.toFixed(1)}%</strong><small>${paired.length} participantes emparejados</small></article><article class="delta"><span>Cambio medio</span><strong>${delta>=0?"+":""}${delta.toFixed(1)}</strong><small>puntos porcentuales</small></article><article><span>Conocimiento final</span><strong>${post.toFixed(1)}%</strong><small>Mismo banco de 12 reactivos</small></article></div><div class="measurement-result-grid" style="margin-top:.8rem"><article class="measurement-metric"><strong>${avg(preSelf)?.toFixed(2)||"—"} → ${avg(postSelf)?.toFixed(2)||"—"}</strong><span>autoeficacia · escala 1–5</span><em>Pre / post</em></article><article class="measurement-metric"><strong>${avg(preMot)?.toFixed(2)||"—"} → ${avg(postMot)?.toFixed(2)||"—"}</strong><span>motivación · escala 1–5</span><em>Pre / post</em></article><article class="measurement-metric"><strong>${paired.filter(doc=>K.scoreKnowledge(doc.responses.s_post.answers).pct>K.scoreKnowledge(doc.responses.s_pre.answers).pct).length}</strong><span>personas con incremento en conocimiento</span><em>Comparación individual</em></article><article class="measurement-metric"><strong>${paired.filter(doc=>K.scoreKnowledge(doc.responses.s_post.answers).pct===K.scoreKnowledge(doc.responses.s_pre.answers).pct).length}</strong><span>personas sin cambio en puntaje</span><em>Revisar evidencias</em></article></div><div class="measurement-caution">El cambio puede estar relacionado con múltiples factores. Repórtelo como diferencia observada y compleméntelo con productos evaluados mediante rúbrica.</div>`;
  }
  function drawDimensions(){
    const box=document.querySelector("#measurementDimensions");if(!box)return;
    const labels={clarity:"Claridad de objetivos",narrative:"Narrativa",rules:"Comprensión de reglas",feedback:"Retroalimentación",safe_learning:"Seguridad para aprender",self_regulation:"Autorregulación",motivation_design:"Motivación por diseño",technical_access:"Accesibilidad técnica",workload:"Carga de trabajo",engagement:"Compromiso",transfer:"Transferencia",support:"Acompañamiento",persistence:"Intención de permanencia",acceptance:"Aceptación final",trust:"Confianza y privacidad",perceived_learning:"Aprendizaje percibido",gamification_balance:"Equilibrio de gamificación"},buckets={};
    acceptedStudentDocs().forEach(doc=>Object.values(doc.responses||{}).forEach(response=>Object.entries(response.dimensionScores||{}).forEach(([key,value])=>{if(labels[key]&&Number.isFinite(value))(buckets[key]||=[]).push(value);})));const rows=Object.entries(labels).map(([key,label])=>[label,avg(buckets[key]||[]),buckets[key]?.length||0]).filter(([,value])=>value!==null);
    box.innerHTML=rows.length?rows.map(([label,value,n])=>`<div class="measurement-score-bar"><strong>${M.escape(label)} <small>(n=${n})</small></strong><span><i style="width:${value/5*100}%"></i></span><b>${value.toFixed(2)}</b></div>`).join(""):'<div class="measurement-empty"><strong>Aún no hay escalas respondidas.</strong>Los resultados aparecerán al completar el primer pulso estudiantil.</div>';
  }
  function drawTeacherResults(){
    const box=document.querySelector("#measurementTeacherResults"),schedule=document.querySelector("#measurementTeacherSchedule");if(!box||!schedule)return;
    const accepted=teacherDocs.filter(doc=>doc.responses?.t_pre?.participation==="accepted"),allResponses=accepted.flatMap(doc=>Object.values(doc.responses||{})),dimension=key=>avg(allResponses.map(response=>response.dimensionScores?.[key]).filter(Number.isFinite)),saved=allResponses.map(response=>num(response.answers?.saved_minutes)).filter(value=>value>0),actions=allResponses.filter(response=>response.answers?.action_taken==="yes").length,completed=sessionLogs.filter(log=>log.status==="completed").length;
    box.innerHTML=[
      [dimension("teacher_usefulness")?.toFixed(2)||"—","utilidad media / 5"],[dimension("teacher_clarity")?.toFixed(2)||"—","claridad media / 5"],[dimension("teacher_actionability")?.toFixed(2)||"—","apoyo a decisiones / 5"],[dimension("teacher_adaptation")?.toFixed(2)||"—","adaptabilidad / 5"],[saved.length?Math.round(avg(saved)):"—","minutos ahorrados por sesión"],[actions,"respuestas con acción pedagógica"],[reflections.length,"reflexiones posteriores a clase"],[completed,"sesiones cerradas en Modo Conducción"]
    ].map(([value,label])=>`<article class="measurement-metric"><strong>${value}</strong><span>${label}</span><em>${[reflections.length,completed].includes(value)?"Registro automático":"Instrumento docente"}</em></article>`).join("");
    schedule.innerHTML=M.teacherInstruments.map(item=>{const status=statusOf(item),response=myResponses()[item.id];return `<article class="measurement-status-row ${status}"><span>${status==="completed"?"✓":status==="due"?"◫":"○"}</span><div><strong>${M.escape(item.phase)} · ${M.escape(item.title)}</strong><small>${response?"Registro guardado":`Semanas ${item.openWeek}–${item.closeWeek}`} · ${M.labelForStatus(status)}</small></div>${status==="due"?`<button class="btn btn-primary" data-open-teacher-instrument="${item.id}">Responder</button>`:""}</article>`;}).join("");
    schedule.querySelectorAll("[data-open-teacher-instrument]").forEach(button=>button.addEventListener("click",()=>openTeacherInstrument(button.dataset.openTeacherInstrument)));
  }
  function openTeacherInstrument(id){
    const instrument=M.byId(id);if(!instrument||statusOf(instrument)!=="due"){notify("Este instrumento no está disponible en la fase actual.");return;}
    const dialog=ensureDialog(),body=dialog.querySelector(".measurement-dialog-body");body.innerHTML=M.formHtml(instrument);const form=body.querySelector("#measurementInstrumentForm");
    if(id==="t_pre"){
      const consentInputs=[...form.querySelectorAll('input[name="consent"]')],toggle=()=>{const no=consentInputs.some(input=>input.checked&&input.value==="1");[...form.elements].filter(element=>element.name&&element.name!=="consent").forEach(element=>{element.disabled=no;});form.classList.toggle("measurement-opted-out",no);};consentInputs.forEach(input=>input.addEventListener("change",toggle));
    }
    form.addEventListener("submit",async event=>{
      event.preventDefault();let answers=M.readAnswers(form,instrument);if(!answers)return;const button=form.querySelector('button[type="submit"]');button.disabled=true;button.textContent="Guardando…";const noConsent=id==="t_pre"&&Number(answers.consent)===1;if(noConsent)answers={consent:1};
      const payload={instrumentVersion:M.version,phase:instrument.phase,weekAtSubmission:week(),participation:noConsent?"declined":"accepted",answers,dimensionScores:noConsent?{}:M.dimensionScores(instrument,answers),automaticSnapshot:{portalViews:num(usage.totalViews),conductorViews:num(usage.conductorViews),sessionsCompleted:sessionLogs.filter(log=>log.status==="completed").length,reflections:reflections.length,planBUses:num(usage.conductorPlanBUses)},clientSubmittedAt:new Date().toISOString()};
      try{await NEXUS_AUTH.saveTeacherInstrumentResponse(id,payload);dialog.close();notify(noConsent?"Su decisión quedó registrada.":"Instrumento docente enviado.");}catch(error){button.disabled=false;button.textContent="Enviar instrumento";notify(`No fue posible guardar: ${error.message}`);}
    });dialog.showModal();
  }
  const csvCell=value=>`"${String(value??"").replaceAll('"','""')}"`;
  function exportIntegrated(){
    const studentByUid=new Map(studentDocs.map(doc=>[doc.uid,doc])),rows=[["participant_id","consentimiento","progreso_pct","visitas","minutos_activos","quiz_intentos","quiz_aciertos","pre_conocimiento","post_conocimiento","cambio_pp","pre_autoeficacia","post_autoeficacia","pre_motivacion","post_motivacion","sem4","sem8","sem12","cierre"]];
    tracking.forEach((row,index)=>{const doc=studentByUid.get(row.uid)||{},r=doc.responses||{},m=row.progress?.pilotMetrics||{},pre=r.s_pre?.answers?K.scoreKnowledge(r.s_pre.answers).pct:"",post=r.s_post?.answers?K.scoreKnowledge(r.s_post.answers).pct:"";rows.push([`E${String(index+1).padStart(3,"0")}`,r.s_pre?.participation||"pendiente",Math.min(100,Math.round(((row.progress?.lessons||[]).length/30)*100)),num(m.visits),Math.round(num(m.activeSeconds)/60),num(m.quizAttempts),num(m.quizCorrect),pre,post,pre!==""&&post!==""?post-pre:"",r.s_pre?.dimensionScores?.self_efficacy??"",r.s_post?.dimensionScores?.self_efficacy??"",r.s_pre?.dimensionScores?.motivation??"",r.s_post?.dimensionScores?.motivation??"",r.s_w4?"si":"no",r.s_w8?"si":"no",r.s_w12?"si":"no",r.s_post?"si":"no"]);});
    const text="\ufeff"+rows.map(row=>row.map(csvCell).join(",")).join("\r\n"),link=document.createElement("a");link.href=URL.createObjectURL(new Blob([text],{type:"text/csv;charset=utf-8"}));link.download="nexus-medicion-academica-seudonimizada.csv";link.click();URL.revokeObjectURL(link.href);NEXUS_AUTH.recordTeacherUsage?.("export").catch(()=>{});
  }
  function refresh(){if(document.querySelector("#measurementHub"))renderDashboard();else setTimeout(mount,0);}
  function stop(){stops.forEach(fn=>fn?.());stops=[];started=false;}
  function start(){
    if(started||NEXUS_AUTH?.role!=="teacher")return;
    started=true;
    let optionalWarning=false;
    const coreFail=error=>{
      const detail=String(error?.code||error?.message||error||"");
      notify(/permission-denied|insufficient permissions/i.test(detail)?"Permisos de medición desactualizados: publique el archivo raíz firestore.rules de NEXUS.":`Medición no disponible: ${error.message||error}`);
    };
    const optionalFail=()=>{
      if(optionalWarning)return;
      optionalWarning=true;
      notify("Los instrumentos siguen disponibles; algunos indicadores automáticos no pudieron cargarse.");
    };
    try{
      stops.push(NEXUS_AUTH.watchPilotConfig(data=>{config=data||{};refresh();},coreFail));
      stops.push(NEXUS_AUTH.watchAllStudentInstrumentResponses(data=>{studentDocs=data||[];refresh();},coreFail));
      stops.push(NEXUS_AUTH.watchAllTeacherInstrumentResponses(data=>{teacherDocs=data||[];refresh();},coreFail));
      stops.push(NEXUS_AUTH.watchTeacherTracking(data=>{tracking=data||[];refresh();},optionalFail));
      stops.push(NEXUS_AUTH.watchTeacherUsage(data=>{usage=data||{};refresh();},optionalFail));
      stops.push(NEXUS_AUTH.watchTeacherReflections(data=>{reflections=data||[];refresh();},optionalFail));
      stops.push(NEXUS_AUTH.watchTeacherSessionLogs(data=>{sessionLogs=data||[];refresh();},optionalFail));
    }catch(error){coreFail(error);}
  }
  window.addEventListener("hashchange",()=>setTimeout(mount,0));
  window.addEventListener("nexus-auth-change",event=>{if(event.detail.user&&event.detail.role==="teacher"){start();setTimeout(mount,0);}else if(!event.detail.user)stop();});
  new MutationObserver(()=>{if(!mounting)setTimeout(mount,0);}).observe(teacherView,{childList:true});
  if(window.NEXUS_AUTH?.user&&window.NEXUS_AUTH.role==="teacher"){start();setTimeout(mount,0);}
  window.NEXUS_MEASUREMENT_TEACHER={mount,openTeacherInstrument};
})();
