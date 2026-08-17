(()=>{
  const PREFIX="nexus-conductor-v13-";
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const esc=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));
  let current=null,currentSession=null,timer=null,saveTimer=null,hooks={};

  const storageKey=id=>`${PREFIX}${id}`;
  const phaseMinutes=(session,state,index)=>Math.max(5,session.teacherScript[index].minutes+(Number(state.adjustments?.[index])||0));
  const totalMinutes=(session,state)=>session.teacherScript.reduce((sum,_,index)=>sum+phaseMinutes(session,state,index),0);
  const phaseStartMinute=(session,state,index)=>session.teacherScript.slice(0,index).reduce((sum,_,offset)=>sum+phaseMinutes(session,state,offset),0);
  const nowIso=()=>new Date().toISOString();

  function blankState(session){
    return {
      version:13,sessionId:session.id,sessionNumber:session.number,status:"not-started",phaseIndex:0,
      remainingSeconds:phaseMinutes(session,{adjustments:{}},0)*60,adjustments:{},completedPhases:[],precheck:[],
      phaseNotes:{},summary:{achievement:"",difficulty:"",nextAdjustment:"",incidentCount:0,goalLevel:4,planBUsed:false,savedMinutes:15,usefulness:4,clarity:4,actionability:4,actionTaken:"no"},
      activeSeconds:0,running:false,anchorTime:null,anchorRemaining:null,startedAt:null,finishedAt:null,updatedAtLocal:nowIso()
    };
  }

  function normalize(session,raw){
    const base=blankState(session),state={...base,...raw};
    state.adjustments={...base.adjustments,...(raw?.adjustments||{})};
    state.completedPhases=Array.isArray(raw?.completedPhases)?raw.completedPhases:[];
    state.precheck=Array.isArray(raw?.precheck)?raw.precheck:[];
    state.phaseNotes={...base.phaseNotes,...(raw?.phaseNotes||{})};
    state.summary={...base.summary,...(raw?.summary||{})};
    state.phaseIndex=Math.max(0,Math.min(session.teacherScript.length-1,Number(state.phaseIndex)||0));
    if(state.running&&state.anchorTime&&state.anchorRemaining!=null){
      const elapsed=Math.max(0,Math.floor((Date.now()-Number(state.anchorTime))/1000));
      const used=Math.min(Number(state.anchorRemaining)||0,elapsed);
      state.activeSeconds=(Number(state.activeSeconds)||0)+used;
      state.remainingSeconds=Math.max(0,(Number(state.anchorRemaining)||0)-elapsed);
      state.running=state.remainingSeconds>0&&state.status==="active";
      state.anchorTime=state.running?Date.now():null;
      state.anchorRemaining=state.running?state.remainingSeconds:null;
    }
    if(!Number.isFinite(Number(state.remainingSeconds)))state.remainingSeconds=phaseMinutes(session,state,state.phaseIndex)*60;
    return state;
  }

  function readState(session){
    try{return normalize(session,JSON.parse(localStorage.getItem(storageKey(session.id))||"null"));}
    catch{return blankState(session);}
  }

  function cloudPayload(state){
    return {
      version:13,sessionId:state.sessionId,sessionNumber:state.sessionNumber,status:state.status,phaseIndex:state.phaseIndex,
      remainingSeconds:Math.round(Number(state.remainingSeconds)||0),adjustments:state.adjustments,completedPhases:state.completedPhases,
      precheck:state.precheck,phaseNotes:state.phaseNotes,summary:state.summary,activeSeconds:Math.round(Number(state.activeSeconds)||0),
      running:Boolean(state.running),anchorTime:state.anchorTime,anchorRemaining:state.anchorRemaining,startedAt:state.startedAt,
      finishedAt:state.finishedAt,updatedAtLocal:state.updatedAtLocal
    };
  }

  function persist({cloud=true,immediate=false}={}){
    if(!current)return;
    current.updatedAtLocal=nowIso();
    localStorage.setItem(storageKey(current.sessionId),JSON.stringify(cloudPayload(current)));
    if(!cloud||!window.NEXUS_AUTH?.saveTeacherSessionLog)return;
    clearTimeout(saveTimer);
    const write=()=>NEXUS_AUTH.saveTeacherSessionLog(current.sessionId,cloudPayload(current)).catch(()=>{});
    if(immediate)write();else saveTimer=setTimeout(write,450);
  }

  function derivedRemaining(){
    if(!current)return 0;
    if(!current.running)return Math.max(0,Number(current.remainingSeconds)||0);
    return Math.max(0,(Number(current.anchorRemaining)||0)-Math.floor((Date.now()-Number(current.anchorTime))/1000));
  }

  function materializeElapsed(){
    if(!current?.running)return;
    const remaining=derivedRemaining();
    const used=Math.max(0,(Number(current.anchorRemaining)||0)-remaining);
    current.activeSeconds=(Number(current.activeSeconds)||0)+used;
    current.remainingSeconds=remaining;
    current.running=false;
    current.anchorTime=null;
    current.anchorRemaining=null;
  }

  function formatClock(seconds){
    const safe=Math.max(0,Math.round(seconds)),minutes=Math.floor(safe/60),rest=safe%60;
    return `${String(minutes).padStart(2,"0")}:${String(rest).padStart(2,"0")}`;
  }

  function progressPercent(session,state,remaining=state.remainingSeconds){
    const before=phaseStartMinute(session,state,state.phaseIndex)*60;
    const duration=phaseMinutes(session,state,state.phaseIndex)*60;
    const elapsed=before+Math.max(0,duration-remaining);
    return Math.min(100,Math.round(elapsed/(totalMinutes(session,state)*60)*100));
  }

  function statusLabel(state){
    if(state.status==="completed")return["Completada","complete"];
    if(state.status==="closing")return["En cierre","closing"];
    if(state.status==="active")return[`Momento ${state.phaseIndex+1} de 6`,"active"];
    return["Sin iniciar","pending"];
  }

  function list(sessions){
    return `<header class="page-head"><span class="eyebrow">MODO CONDUCCIÓN DE CLASE</span><h1>26 sesiones guiadas, minuto a minuto</h1><p>Abra una sesión y NEXUS le mostrará qué hacer, qué decir, qué observar y qué recurso usar en cada momento. El guion orienta; usted conserva el criterio para adaptarlo al grupo.</p></header>
      <section class="conductor-principles" aria-label="Cómo funciona"><article><b>1</b><strong>Prepare</strong><span>Lista previa y materiales directos.</span></article><article><b>2</b><strong>Conduzca</strong><span>Un momento visible con cronómetro.</span></article><article><b>3</b><strong>Adapte</strong><span>Tiempo ajustable y plan alternativo.</span></article><article><b>4</b><strong>Registre</strong><span>Bitácora y reflexión posterior.</span></article></section>
      <section class="session-list conductor-session-list">${sessions.map(session=>{const state=readState(session),[label,kind]=statusLabel(state);return `<article class="session-card conductor-session-card"><div><span class="eyebrow">SESIÓN ${session.number} · ${session.theoryMinutes} MIN T + ${session.practiceMinutes} MIN P</span><h2>${esc(session.title)}</h2><p>${esc(session.objective)}</p><span class="conductor-status ${kind}">${label}</span></div><div class="conductor-list-actions"><button class="btn btn-primary" data-go="conductor/${session.id}">${state.status==="not-started"?"Preparar y conducir":"Continuar conducción"} →</button><button class="btn btn-outline" data-go="session/${session.id}">Ver guion completo</button></div></article>`;}).join("")}</section>`;
  }

  function resourceCards(session){
    return (session.resources||[]).map(resource=>`<a class="conductor-resource" href="${esc(resource.href)}" ${resource.download?"download":'target="_blank" rel="noopener"'}><span>${esc(resource.kind)}</span><strong>${esc(resource.label)}</strong><small>${resource.download?"Descargar archivo":"Abrir recurso"} ↗</small></a>`).join("");
  }

  function preflight(session,state){
    const ready=state.precheck.length,total=session.preparation.length;
    return `<details class="conductor-preflight" ${state.status==="not-started"?"open":""}><summary><span><small>ANTES DE CLASE</small><strong>Preparación y materiales</strong></span><b id="precheckCount">${ready}/${total} listo</b></summary><div class="conductor-preflight-body"><div><h2>Lista de preparación</h2><p>Marque lo que ya está listo. Puede iniciar aunque falte algo y usar el plan alternativo.</p><ul class="check-list conductor-checks">${session.preparation.map((item,index)=>`<li><label><input type="checkbox" data-precheck="${index}" ${state.precheck.includes(index)?"checked":""}> <span>${esc(item)}</span></label></li>`).join("")}</ul></div><div><h2>Kit de la sesión</h2><div class="conductor-resources">${resourceCards(session)}</div><div class="button-row"><button class="btn btn-dark" data-go="slides/${session.id}">▰ Abrir presentación</button><button class="btn btn-outline" data-go="session/${session.id}">Abrir guía completa</button></div></div></div></details>`;
  }

  function phaseStrip(session,state){
    return `<nav class="conductor-phase-strip" aria-label="Momentos de la sesión">${session.teacherScript.map((phase,index)=>{const start=phaseStartMinute(session,state,index),end=start+phaseMinutes(session,state,index);return `<button data-phase-target="${index}" class="${index===state.phaseIndex?"current":""} ${state.completedPhases.includes(index)?"done":""}" aria-current="${index===state.phaseIndex?"step":"false"}"><b>${state.completedPhases.includes(index)?"✓":index+1}</b><span>${esc(phase.title)}</span><small>${start}–${end} min</small></button>`;}).join("")}</nav>`;
  }

  function phaseView(session,state){
    const index=state.phaseIndex,phase=session.teacherScript[index],minutes=phaseMinutes(session,state,index),remaining=derivedRemaining();
    const start=phaseStartMinute(session,state,index),end=start+minutes,pct=progressPercent(session,state,remaining);
    return `<section class="conductor-live" data-conductor-live><header class="conductor-live-head"><div><span class="eyebrow">MOMENTO ${index+1} DE ${session.teacherScript.length} · MINUTOS ${start}–${end}</span><h2>${esc(phase.title)}</h2><p>${state.status==="not-started"?"Revise la preparación y comience cuando el grupo esté listo.":"Mantenga visible sólo lo necesario para este momento."}</p></div><div class="conductor-clock-wrap"><span id="conductorClock" class="conductor-clock ${remaining<=60?"urgent":""}">${formatClock(remaining)}</span><small>restantes de ${minutes} min</small></div></header>
      <div class="conductor-progress" aria-label="${pct}% de la sesión"><i id="conductorProgress" style="width:${pct}%"></i></div>
      <div class="conductor-timer-actions"><button class="btn btn-primary" data-timer-toggle>${state.running?"Pausar cronómetro":"Iniciar cronómetro"}</button><button class="btn btn-outline" data-adjust="-5">− 5 min</button><button class="btn btn-outline" data-adjust="5">+ 5 min</button><span id="conductorTotal">Plan ajustado: ${totalMinutes(session,state)} min</span></div>
      <div class="conductor-instruction-grid"><article class="conductor-instruction teacher"><span>DOCENTE · QUÉ HACER Y DECIR</span><p>${esc(phase.teacher)}</p></article><article class="conductor-instruction student"><span>ESTUDIANTES · QUÉ HACEN</span><p>${esc(phase.student)}</p></article><article class="conductor-instruction expected"><span>RESPUESTAS O DESEMPEÑOS ESPERADOS</span><ul>${phase.expected.map(item=>`<li>${esc(item)}</li>`).join("")}</ul></article><article class="conductor-instruction intervene"><span>SI HAY DIFICULTAD</span><p>${esc(phase.intervene)}</p></article></div>
      <div class="conductor-checkpoint"><div><span>RECURSO DEL MOMENTO</span><p>${esc(phase.resource)}</p></div><div><span>COMPROBACIÓN ANTES DE AVANZAR</span><p>${esc(phase.check)}</p></div></div>
      <details class="conductor-fallback"><summary>⌁ Plan B sin conexión o si el recurso falla</summary><p>${esc(phase.fallback)}</p><label><input type="checkbox" data-planb ${state.summary.planBUsed?"checked":""}> Registrar que utilicé el plan B</label></details>
      <label class="conductor-notes"><span>Nota rápida de este momento</span><textarea rows="3" maxlength="700" data-phase-note placeholder="Ideas correctas, confusiones, ajuste de tiempo o incidencia sin datos personales…">${esc(state.phaseNotes[index]||"")}</textarea></label>
      <div class="conductor-transition"><span>TRANSICIÓN SUGERIDA</span><p>${esc(phase.transition)}</p><div class="button-row"><button class="btn btn-outline" data-prev-phase ${index===0?"disabled":""}>← Momento anterior</button><button class="btn btn-dark" data-next-phase>${index===session.teacherScript.length-1?"Ir al cierre de sesión →":"Comprobado · siguiente momento →"}</button></div></div></section>`;
  }

  function closeView(session,state){
    const summary=state.summary;
    return `<section class="conductor-close"><span class="eyebrow">DESPUÉS DE CLASE · MENOS DE DOS MINUTOS</span><h2>Cierre y reflexión docente</h2><p>El registro permite medir si la planeación realmente ahorra tiempo, orienta decisiones y se ajusta al grupo.</p><div class="conductor-close-grid"><label>¿Qué logró el grupo?<textarea data-summary="achievement" rows="3" maxlength="700">${esc(summary.achievement)}</textarea></label><label>¿Dónde estuvo la principal dificultad?<textarea data-summary="difficulty" rows="3" maxlength="700">${esc(summary.difficulty)}</textarea></label><label>¿Qué ajustaré la próxima vez?<textarea data-summary="nextAdjustment" rows="3" maxlength="700">${esc(summary.nextAdjustment)}</textarea></label><label>Incidencias técnicas o didácticas<input data-summary="incidentCount" type="number" min="0" max="99" value="${Number(summary.incidentCount)||0}"></label><label>Nivel de logro del propósito<select data-summary="goalLevel">${[1,2,3,4,5].map(value=>`<option value="${value}" ${Number(summary.goalLevel)===value?"selected":""}>${value} / 5</option>`).join("")}</select></label><label>Minutos de preparación ahorrados<input data-summary="savedMinutes" type="number" min="0" max="180" value="${Number(summary.savedMinutes)||0}"></label><label>Utilidad para conducir<select data-summary="usefulness">${ratingOptions(summary.usefulness)}</select></label><label>Claridad del guion<select data-summary="clarity">${ratingOptions(summary.clarity)}</select></label><label>Apoyo para decidir ajustes<select data-summary="actionability">${ratingOptions(summary.actionability)}</select></label><label>¿Realizó una acción de acompañamiento?<select data-summary="actionTaken"><option value="no" ${summary.actionTaken!=="yes"?"selected":""}>No</option><option value="yes" ${summary.actionTaken==="yes"?"selected":""}>Sí</option></select></label></div><div class="button-row"><button class="btn btn-primary" data-finish-session>Guardar y finalizar sesión</button><button class="btn btn-outline" data-back-to-phase>Volver al último momento</button></div></section>`;
  }

  function ratingOptions(selected){return [1,2,3,4,5].map(value=>`<option value="${value}" ${Number(selected)===value?"selected":""}>${value} / 5</option>`).join("");}

  function completedView(session,state){
    const summary=state.summary,minutes=Math.round((Number(state.activeSeconds)||0)/60);
    return `<section class="conductor-completed"><span class="conductor-complete-mark">✓</span><span class="eyebrow">SESIÓN REGISTRADA</span><h2>Conducción completada</h2><p>La bitácora quedó guardada. El tiempo activo es aproximado y nunca se convierte automáticamente en calificación.</p><div class="conductor-summary-stats"><article><strong>${minutes}</strong><span>min activos</span></article><article><strong>${state.completedPhases.length}/6</strong><span>momentos recorridos</span></article><article><strong>${Number(summary.goalLevel)||"—"}/5</strong><span>logro del propósito</span></article><article><strong>${summary.planBUsed?"Sí":"No"}</strong><span>uso de plan B</span></article></div><div class="conductor-summary-copy"><p><strong>Logro:</strong> ${esc(summary.achievement||"Sin nota")}</p><p><strong>Dificultad:</strong> ${esc(summary.difficulty||"Sin nota")}</p><p><strong>Próximo ajuste:</strong> ${esc(summary.nextAdjustment||"Sin nota")}</p></div><div class="button-row"><button class="btn btn-primary" data-download-log>Descargar bitácora</button><button class="btn btn-outline" data-reopen-session>Reabrir último momento</button><button class="btn btn-outline" data-go="conductor">Volver a sesiones</button></div></section>`;
  }

  function view(session){
    currentSession=session;
    current=readState(session);
    const state=current;
    if(state.status==="completed")queueMicrotask(()=>{const actions=$(".conductor-completed .button-row");if(actions&&!actions.querySelector("[data-evaluation-center]"))actions.insertAdjacentHTML("afterbegin",`<button class="btn btn-primary" data-evaluation-center>Revisar evidencia y evaluación</button>`);$("[data-evaluation-center]")?.addEventListener("click",()=>hooks.go?.("evaluation"));});
    return `<header class="page-head conductor-page-head"><span class="eyebrow">SESIÓN ${session.number} · MODO CONDUCCIÓN</span><h1>${esc(session.title)}</h1><p>${esc(session.objective)}</p><div class="conductor-head-meta"><span>100 min con docente</span><span>${session.theoryMinutes} min teoría</span><span>${session.practiceMinutes} min práctica</span><span>${session.independentMinutes} min independientes</span></div></header><div class="session-toolbar"><button class="btn btn-outline" data-go="conductor">← Sesiones</button><button class="btn btn-outline" data-go="session/${session.id}">Ver guion completo</button><button class="btn btn-dark" data-go="slides/${session.id}">▰ Presentación</button><button class="btn btn-outline" onclick="print()">Imprimir</button></div>${preflight(session,state)}${phaseStrip(session,state)}${state.status==="completed"?completedView(session,state):state.status==="closing"?closeView(session,state):phaseView(session,state)}`;
  }

  function begin(){
    if(current.status==="not-started"){
      current.status="active";current.startedAt=current.startedAt||nowIso();
      NEXUS_AUTH.recordTeacherConductorEvent?.("start",current.sessionId).catch(()=>{});
    }
    current.running=true;current.anchorTime=Date.now();current.anchorRemaining=current.remainingSeconds;
    persist({immediate:true});startTicker();hooks.rerender();
  }

  function toggleTimer(){
    if(current.running){materializeElapsed();persist({immediate:true});stopTicker();hooks.rerender();}
    else begin();
  }

  function adjustTime(delta){
    materializeElapsed();
    const index=current.phaseIndex,old=Number(current.adjustments[index])||0;
    current.adjustments[index]=Math.max(5-currentSession.teacherScript[index].minutes,old+delta);
    const applied=current.adjustments[index]-old;
    current.remainingSeconds=Math.max(0,current.remainingSeconds+applied*60);
    persist({immediate:true});hooks.toast(applied?`${applied>0?"Se añadieron":"Se restaron"} ${Math.abs(applied)} minutos`:"Este momento ya está en el mínimo de 5 minutos");hooks.rerender();
  }

  function movePhase(target){
    materializeElapsed();
    const previous=current.phaseIndex;
    if(target>previous&&!current.completedPhases.includes(previous))current.completedPhases.push(previous);
    current.phaseIndex=Math.max(0,Math.min(currentSession.teacherScript.length-1,target));
    current.status="active";current.remainingSeconds=phaseMinutes(currentSession,current,current.phaseIndex)*60;
    current.running=false;current.anchorTime=null;current.anchorRemaining=null;
    persist({immediate:true});NEXUS_AUTH.recordTeacherConductorEvent?.("phase",current.sessionId).catch(()=>{});hooks.rerender();
  }

  function nextPhase(){
    if(current.phaseIndex<currentSession.teacherScript.length-1)movePhase(current.phaseIndex+1);
    else{
      materializeElapsed();
      if(!current.completedPhases.includes(current.phaseIndex))current.completedPhases.push(current.phaseIndex);
      current.status="closing";persist({immediate:true});hooks.rerender();
    }
  }

  async function finish(){
    materializeElapsed();current.status="completed";current.finishedAt=nowIso();persist({immediate:true});
    const summary=current.summary,note=[summary.achievement&&`Logro: ${summary.achievement}`,summary.difficulty&&`Dificultad: ${summary.difficulty}`,summary.nextAdjustment&&`Próximo ajuste: ${summary.nextAdjustment}`].filter(Boolean).join(" | ");
    try{
      await Promise.all([
        NEXUS_AUTH.recordTeacherConductorEvent?.("complete",current.sessionId),
        NEXUS_AUTH.saveTeacherReflection?.({session:current.sessionId,savedMinutes:Number(summary.savedMinutes)||0,usefulness:Number(summary.usefulness)||0,clarity:Number(summary.clarity)||0,actionability:Number(summary.actionability)||0,actionTaken:summary.actionTaken||"no",note,source:"conductor-v13"})
      ]);
      hooks.toast("Sesión y reflexión docente registradas");
    }catch{hooks.toast("La bitácora quedó guardada localmente; revise la sincronización");}
    hooks.rerender();
  }

  function downloadLog(){
    const s=currentSession,state=current,summary=state.summary;
    const lines=[`Misión NEXUS · Bitácora docente`, `Sesión ${s.number}: ${s.title}`,`Estado: ${state.status}`,`Inicio: ${state.startedAt||"No registrado"}`,`Cierre: ${state.finishedAt||"No registrado"}`,`Tiempo activo aproximado: ${Math.round((Number(state.activeSeconds)||0)/60)} min`,`Momentos completados: ${state.completedPhases.length}/6`,`Plan B utilizado: ${summary.planBUsed?"Sí":"No"}`,`Nivel de logro: ${summary.goalLevel}/5`,`Incidencias: ${summary.incidentCount||0}`,"",`Logro del grupo: ${summary.achievement||"Sin nota"}`,`Dificultad principal: ${summary.difficulty||"Sin nota"}`,`Próximo ajuste: ${summary.nextAdjustment||"Sin nota"}`,"","Notas por momento:",...s.teacherScript.map((phase,index)=>`${index+1}. ${phase.title}: ${state.phaseNotes[index]||"Sin nota"}`)];
    const link=document.createElement("a");link.href=URL.createObjectURL(new Blob([lines.join("\n")],{type:"text/plain;charset=utf-8"}));link.download=`nexus-sesion-${String(s.number).padStart(2,"0")}-bitacora.txt`;link.click();URL.revokeObjectURL(link.href);NEXUS_AUTH.recordTeacherConductorEvent?.("export",s.id).catch(()=>{});
  }

  function updateClock(){
    if(!current?.running)return;
    const remaining=derivedRemaining(),clock=$("#conductorClock"),bar=$("#conductorProgress");
    if(clock){clock.textContent=formatClock(remaining);clock.classList.toggle("urgent",remaining<=60);}
    if(bar)bar.style.width=`${progressPercent(currentSession,current,remaining)}%`;
    if(remaining<=0){materializeElapsed();persist({immediate:true});stopTicker();hooks.toast("Tiempo previsto cumplido; compruebe antes de avanzar");hooks.rerender();}
  }

  function startTicker(){stopTicker();timer=setInterval(updateClock,1000);}
  function stopTicker(){if(timer)clearInterval(timer);timer=null;}

  function bind(session,options){
    currentSession=session;current=readState(session);hooks=options;
    $$('[data-precheck]').forEach(input=>input.addEventListener("change",()=>{const index=Number(input.dataset.precheck),set=new Set(current.precheck);input.checked?set.add(index):set.delete(index);current.precheck=[...set].sort((a,b)=>a-b);persist();const count=$("#precheckCount");if(count)count.textContent=`${current.precheck.length}/${session.preparation.length} listo`;}));
    $("[data-timer-toggle]")?.addEventListener("click",toggleTimer);
    $$('[data-adjust]').forEach(button=>button.addEventListener("click",()=>adjustTime(Number(button.dataset.adjust))));
    $$('[data-phase-target]').forEach(button=>button.addEventListener("click",()=>movePhase(Number(button.dataset.phaseTarget))));
    $("[data-prev-phase]")?.addEventListener("click",()=>movePhase(current.phaseIndex-1));
    $("[data-next-phase]")?.addEventListener("click",nextPhase);
    $("[data-back-to-phase]")?.addEventListener("click",()=>{current.status="active";persist({immediate:true});hooks.rerender();});
    $("[data-finish-session]")?.addEventListener("click",finish);
    $("[data-download-log]")?.addEventListener("click",downloadLog);
    $("[data-reopen-session]")?.addEventListener("click",()=>{current.status="active";current.finishedAt=null;persist({immediate:true});hooks.rerender();});
    $("[data-phase-note]")?.addEventListener("input",event=>{current.phaseNotes[current.phaseIndex]=event.target.value;persist();});
    $$('[data-summary]').forEach(input=>input.addEventListener("input",()=>{const key=input.dataset.summary;current.summary[key]=input.type==="number"?Number(input.value):input.value;persist();}));
    $("[data-planb]")?.addEventListener("change",event=>{const firstUse=!current.summary.planBUsed&&event.target.checked;current.summary.planBUsed=event.target.checked;persist({immediate:true});if(firstUse)NEXUS_AUTH.recordTeacherConductorEvent?.("planB",current.sessionId).catch(()=>{});});
    if(current.running)startTicker();
    if(!localStorage.getItem(storageKey(session.id))&&window.NEXUS_AUTH?.loadTeacherSessionLog){
      NEXUS_AUTH.loadTeacherSessionLog(session.id).then(remote=>{if(!remote||localStorage.getItem(storageKey(session.id)))return;current=normalize(session,remote);persist({cloud:false});hooks.rerender();}).catch(()=>{});
    }
  }

  function cleanup(){
    if(current)persist({immediate:true});
    stopTicker();clearTimeout(saveTimer);current=null;currentSession=null;hooks={};
  }

  function localLogs(sessions){return sessions.map(session=>readState(session)).filter(state=>state.startedAt||state.status!=="not-started");}
  window.NEXUS_CONDUCTOR={list,view,bind,cleanup,localLogs};
})();
