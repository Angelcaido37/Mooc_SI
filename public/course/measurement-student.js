(()=>{
  const M=window.NEXUS_MEASUREMENT;
  if(!M)return;
  const view=document.querySelector("#view"),nav=document.querySelector("[data-measurement-nav]");
  let config={},responseDoc={},stops=[],started=false,rendering=false;

  const responses=()=>responseDoc.responses||{};
  const week=()=>M.currentWeek(config);
  const declined=()=>responses().s_pre?.participation==="declined";
  const state=()=>window.NEXUS_STATE||(()=>{try{return JSON.parse(localStorage.getItem("nexus-progress")||"{}");}catch{return{};}})();
  const percent=()=>Math.min(100,Math.round(((state().lessons||[]).length/30)*100));
  const statusOf=instrument=>{
    if(instrument.id!=="s_pre"&&responses().s_pre?.participation!=="accepted")return"not_applicable";
    return M.availability(instrument,week(),Boolean(responses()[instrument.id]),declined());
  };
  const due=()=>M.studentInstruments.filter(item=>statusOf(item)==="due");
  const notify=message=>{
    const existing=document.querySelector("#toast");
    if(existing){existing.textContent=message;existing.classList.add("show");setTimeout(()=>existing.classList.remove("show"),3200);return;}
    const toast=document.createElement("div");toast.className="measurement-toast";toast.textContent=message;document.body.appendChild(toast);setTimeout(()=>toast.remove(),3200);
  };
  const ensureDialog=()=>{
    let dialog=document.querySelector("#measurementStudentDialog");
    if(dialog)return dialog;
    dialog=document.createElement("dialog");
    dialog.id="measurementStudentDialog";
    dialog.className="measurement-dialog";
    dialog.innerHTML='<div class="measurement-dialog-head"><strong>Instrumento NEXUS</strong><button type="button" data-measurement-close aria-label="Cerrar">×</button></div><div class="measurement-dialog-body"></div>';
    document.body.appendChild(dialog);
    dialog.querySelector("[data-measurement-close]").onclick=()=>dialog.close();
    return dialog;
  };
  const responseDate=response=>{
    const value=response?.submittedAt;
    if(!value)return"Registro guardado";
    const date=typeof value.toDate==="function"?value.toDate():new Date(value);
    return Number.isNaN(date.getTime())?"Registro guardado":new Intl.DateTimeFormat("es-MX",{dateStyle:"medium"}).format(date);
  };
  const phaseCard=instrument=>{
    const status=statusOf(instrument),response=responses()[instrument.id],canOpen=status==="due";
    const action=canOpen?`<button class="btn btn-primary" data-open-student-instrument="${instrument.id}">Responder ahora</button>`:"";
    const detail=response?(response.participation==="declined"?"Decisión de participación registrada":responseDate(response)):`Semanas ${instrument.openWeek}–${instrument.closeWeek}`;
    return `<article class="measurement-phase-card ${status}"><span class="eyebrow">${M.escape(instrument.phase)}</span><strong>${M.escape(instrument.title)}</strong><small>${M.escape(detail)}</small><span class="phase-status">${M.labelForStatus(status)}</span>${action}</article>`;
  };
  const automaticMetrics=()=>{
    const s=state(),metrics=s.pilotMetrics||{},attempts=Number(metrics.quizAttempts||0),correct=Number(metrics.quizCorrect||0);
    return [
      [percent()+"%","avance en lecciones"],
      [Math.round(Number(metrics.activeSeconds||0)/60),"minutos activos aproximados"],
      [Number(metrics.visits||0),"visitas registradas"],
      [attempts?Math.round(correct/attempts*100)+"%":"—","aciertos en controles"]
    ].map(([value,label])=>`<article class="measurement-metric"><strong>${value}</strong><span>${label}</span><em>Dato automático</em></article>`).join("");
  };
  function renderPage(){
    if(!view||!location.hash.replace(/^#\/?/,"").startsWith("measurement"))return;
    rendering=true;
    const current=week(),completed=M.studentInstruments.filter(item=>responses()[item.id]).length,dueNow=due();
    document.querySelectorAll(".nav-item").forEach(item=>item.classList.remove("active"));
    nav?.classList.add("active");
    view.innerHTML=`
      <section class="measurement-hero">
        <span class="eyebrow">EVALUACIÓN FORMATIVA DEL CURSO</span>
        <h1>Mi participación en NEXUS</h1>
        <p>Aquí encontrarás únicamente los instrumentos correspondientes a la fase actual. Tus respuestas no modifican la calificación; permiten comparar el inicio, el proceso y el cierre para mejorar la experiencia.</p>
        <div class="measurement-hero-meta"><span>${config.startDate?`Semana actual: ${current<1?"antes del inicio":current}`:"Calendario pendiente"}</span><span>${completed} de ${M.studentInstruments.length} instrumentos registrados</span><span>${dueNow.length?`${dueNow.length} disponible${dueNow.length===1?"":"s"} ahora`:"Sin pendientes actuales"}</span></div>
      </section>
      <section class="content-block measurement-section">
        <div class="measurement-section-head"><div><span class="eyebrow">REGISTRO PASO A PASO</span><h2>Fases del semestre</h2><p>La disponibilidad se calcula automáticamente desde la fecha de inicio configurada por el docente.</p></div><div class="measurement-legend"><span>Disponible</span><span>Completado</span><span>Próximo</span></div></div>
        <div class="measurement-phase-grid">${M.studentInstruments.map(phaseCard).join("")}</div>
        ${!config.startDate?'<div class="measurement-empty"><strong>El calendario aún no está configurado.</strong>Los instrumentos se habilitarán cuando el docente indique la fecha de inicio del semestre.</div>':""}
        ${declined()?'<div class="measurement-privacy"><span>◉</span><div><strong>Tu decisión fue registrada.</strong><br>No se solicitarán los instrumentos posteriores y tus respuestas declaradas no se incluirán en la evaluación académica de la plataforma. La actividad operativa necesaria para guardar tu avance seguirá funcionando.</div></div>':""}
      </section>
      <section class="content-block measurement-section">
        <div class="measurement-section-head"><div><span class="eyebrow">CAPTURA AUTOMÁTICA</span><h2>Datos de mi recorrido</h2><p>Se actualizan al usar la plataforma; no equivalen por sí solos a aprendizaje.</p></div></div>
        <div class="measurement-auto-grid">${automaticMetrics()}</div>
        <div class="measurement-caution"><strong>Interpretación responsable:</strong> el tiempo visible, las visitas y los clics sirven para reconocer patrones de uso. El aprendizaje se contrasta con diagnóstico, posprueba, evidencias, rúbricas y valoración docente.</div>
      </section>
      <section class="content-block measurement-section measurement-privacy"><span>🔒</span><div><strong>Privacidad y autonomía</strong><br>El tablero docente presenta resultados agregados y exportaciones seudonimizadas. Evita escribir nombres, situaciones clínicas o información personal en los comentarios abiertos.</div></section>`;
    bindPage();
    NEXUS_AUTH.recordActivity?.({route:"measurement",location:"Instrumentos del semestre",activityType:"measurement"}).catch(()=>{});
    setTimeout(()=>{rendering=false;},0);
  }
  function bindPage(){
    view.querySelectorAll("[data-open-student-instrument]").forEach(button=>button.addEventListener("click",()=>openInstrument(button.dataset.openStudentInstrument)));
  }
  function openInstrument(id){
    const instrument=M.byId(id);
    if(!instrument||statusOf(instrument)!=="due"){notify("Este instrumento no está disponible en la fase actual.");return;}
    const dialog=ensureDialog(),body=dialog.querySelector(".measurement-dialog-body");
    body.innerHTML=M.formHtml(instrument);
    const form=body.querySelector("#measurementInstrumentForm");
    if(id==="s_pre"){
      const consentInputs=[...form.querySelectorAll('input[name="consent"]')];
      const toggleConsent=()=>{
        const optedOut=consentInputs.some(input=>input.checked&&input.value==="1");
        [...form.elements].filter(element=>element.name&&element.name!=="consent").forEach(element=>{element.disabled=optedOut;});
        form.classList.toggle("measurement-opted-out",optedOut);
      };
      consentInputs.forEach(input=>input.addEventListener("change",toggleConsent));
    }
    form.addEventListener("submit",async event=>{
      event.preventDefault();
      let answers=M.readAnswers(form,instrument);
      if(!answers)return;
      const button=form.querySelector("button[type=submit]");button.disabled=true;button.textContent="Guardando…";
      const noConsent=id==="s_pre"&&Number(answers.consent)===1;
      if(noConsent)answers={consent:1};
      const s=state(),metrics=s.pilotMetrics||{};
      const payload={
        instrumentVersion:M.version,phase:instrument.phase,weekAtSubmission:week(),
        participation:noConsent?"declined":"accepted",answers,
        dimensionScores:noConsent?{}:M.dimensionScores(instrument,answers),
        automaticSnapshot:{progressPct:percent(),lessons:(s.lessons||[]).length,visits:Number(metrics.visits||0),activeMinutes:Math.round(Number(metrics.activeSeconds||0)/60),quizAttempts:Number(metrics.quizAttempts||0),quizCorrect:Number(metrics.quizCorrect||0),bonusAttempts:Number(metrics.bonusAttempts||0)},
        clientSubmittedAt:new Date().toISOString()
      };
      try{
        await NEXUS_AUTH.saveStudentInstrumentResponse(id,payload);
        dialog.close();notify(noConsent?"Tu decisión de participación quedó registrada.":"Instrumento enviado. Gracias por tu participación.");
      }catch(error){button.disabled=false;button.textContent="Enviar instrumento";notify(`No fue posible guardar: ${error.message}`);}
    });
    dialog.showModal();
  }
  function injectDueBanner(){
    if(rendering||!view||location.hash.replace(/^#\/?/,"").startsWith("measurement"))return;
    const existing=view.querySelector(".measurement-due-banner");
    const pending=due();
    if(!pending.length){existing?.remove();return;}
    if(existing)return;
    const banner=document.createElement("section");
    banner.className="measurement-due-banner";
    banner.innerHTML=`<span>◫</span><div><strong>${pending.length===1?pending[0].title:`Tienes ${pending.length} instrumentos disponibles`}</strong><p>Corresponde a ${pending.length===1?pending[0].phase:"la fase actual del semestre"} y no afecta tu calificación.</p></div><button class="btn btn-primary" type="button">Abrir</button>`;
    banner.querySelector("button").onclick=()=>{location.hash="measurement";};
    view.prepend(banner);
  }
  function refresh(){
    const pending=due();
    if(nav){let badge=nav.querySelector(".measurement-nav-badge");if(pending.length){if(!badge){badge=document.createElement("b");badge.className="measurement-nav-badge";nav.appendChild(badge);}badge.textContent=String(pending.length);}else badge?.remove();}
    if(location.hash.replace(/^#\/?/,"").startsWith("measurement"))renderPage();else setTimeout(injectDueBanner,0);
  }
  function stop(){stops.forEach(fn=>fn?.());stops=[];started=false;}
  const readableError=(label,error)=>{
    const detail=String(error?.code||error?.message||error||"");
    return /permission-denied|insufficient permissions/i.test(detail)
      ? `${label}: no fue posible acceder al backend de NEXUS. Verifique su conexión e inténtelo de nuevo.`
      : `${label}: ${error?.message||error}`;
  };
  function start(){
    if(started||NEXUS_AUTH?.role!=="student")return;
    started=true;
    try{
      stops.push(NEXUS_AUTH.watchPilotConfig(data=>{config=data||{};refresh();},error=>notify(readableError("Calendario no disponible",error))));
      stops.push(NEXUS_AUTH.watchMyStudentInstrumentResponses(data=>{responseDoc=data||{};refresh();},error=>notify(readableError("Respuestas no disponibles",error))));
    }catch(error){notify(error.message);}
  }
  nav?.addEventListener("click",()=>{location.hash="measurement";});
  window.addEventListener("hashchange",()=>{if(location.hash.replace(/^#\/?/,"").startsWith("measurement"))setTimeout(renderPage,0);else setTimeout(injectDueBanner,20);});
  window.addEventListener("nexus-auth-change",event=>{if(event.detail.user&&event.detail.role==="student")start();else if(!event.detail.user)stop();});
  new MutationObserver(()=>{if(!rendering)setTimeout(()=>location.hash.replace(/^#\/?/,"").startsWith("measurement")?renderPage():injectDueBanner(),0);}).observe(view,{childList:true});
  if(window.NEXUS_AUTH?.user&&window.NEXUS_AUTH.role==="student")start();
  window.NEXUS_MEASUREMENT_STUDENT={render:renderPage,openInstrument};
})();
