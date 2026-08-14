(()=>{
  const $=(selector,root=document)=>root.querySelector(selector);
  const esc=value=>String(value??"").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]));
  const notify=message=>{const toast=$("#teacherToast");if(!toast)return;toast.textContent=message;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),3200);};
  let sessions=[],selectedSessionId="",courses=[],assignments=[],stopAssignments=null,hooks={};

  const session=()=>sessions.find(item=>item.id===selectedSessionId)||sessions[0];
  const futureDate=days=>{const date=new Date();date.setDate(date.getDate()+days);return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;};
  const defaultTitle=item=>item?`Sesión ${item.number} · ${item.title} — actividad posterior`:"Actividad posterior a clase";
  const defaultDescription=item=>item?.classroomText||"Revise la consigna, complete el producto solicitado y adjunte su evidencia en Google Classroom.";
  const dateLabel=item=>item.dueDate?new Intl.DateTimeFormat("es-MX",{dateStyle:"medium"}).format(new Date(`${item.dueDate}T12:00:00`)):"Sin fecha límite";

  function view(courseSessions,prefillId=""){
    sessions=courseSessions||[];selectedSessionId=sessions.some(item=>item.id===prefillId)?prefillId:(selectedSessionId||sessions[0]?.id||"");
    queueMicrotask(()=>bind());
    const current=session();
    return `<header class="page-head"><span class="eyebrow">INTEGRACIÓN ACADÉMICA</span><h1>Publicar actividades en Google Classroom</h1><p>Al finalizar la clase, seleccione el grupo y la sesión. NEXUS prepara la consigna y publica una tarea para que el alumnado adjunte y entregue sus archivos directamente en Classroom.</p></header>
      <section class="classroom-connection" id="classroomConnection" aria-live="polite">
        <div class="classroom-connection-icon" aria-hidden="true">C</div>
        <div><span class="eyebrow">CUENTA DOCENTE</span><h2 id="classroomConnectionTitle">Verificando conexión…</h2><p id="classroomConnectionText">NEXUS solicita sólo permiso para consultar sus grupos activos y publicar actividades.</p></div>
        <div class="button-row"><button class="btn btn-primary" type="button" data-classroom-connect>Conectar Google Classroom</button><button class="btn btn-outline" type="button" data-classroom-disconnect hidden>Desconectar</button></div>
      </section>
      <div class="classroom-workspace">
        <form id="classroomPublishForm" class="content-block classroom-publish-form">
          <div class="classroom-section-head"><div><span class="eyebrow">PUBLICACIÓN DIRECTA</span><h2>Nueva actividad</h2><p>La tarea se asignará a todo el grupo y quedará publicada inmediatamente.</p></div><span class="classroom-live-badge">Publicación real</span></div>
          <div class="classroom-form-grid">
            <label>Grupo de Classroom<select name="courseId" required disabled><option value="">Conecte Classroom para cargar sus grupos</option></select></label>
            <label>Sesión de NEXUS<select name="sessionId" required>${sessions.map(item=>`<option value="${esc(item.id)}" ${item.id===selectedSessionId?"selected":""}>Sesión ${item.number} · ${esc(item.title)}</option>`).join("")}</select></label>
            <label class="full">Título de la actividad<input name="title" maxlength="300" required value="${esc(defaultTitle(current))}"></label>
            <label class="full">Consigna para el alumnado<textarea name="description" rows="10" maxlength="30000" required>${esc(defaultDescription(current))}</textarea><small>Puede editar el texto antes de publicarlo.</small></label>
            <label>Fecha límite<input name="dueDate" type="date" value="${futureDate(7)}"></label>
            <label>Hora límite<input name="dueTime" type="time" value="23:59"></label>
            <label>Puntuación máxima<input name="maxPoints" type="number" min="0" max="1000" value="100"></label>
            <label class="classroom-check"><input name="includeNexusLink" type="checkbox" checked><span>Agregar enlace a la sesión estudiantil de NEXUS</span></label>
            <label class="classroom-confirm full"><input name="confirmed" type="checkbox" required><span>Revisé el grupo, la consigna y la fecha. Confirmo que deseo publicar esta actividad ahora.</span></label>
          </div>
          <div class="classroom-submit-row"><p id="classroomPublishStatus">La publicación no modifica automáticamente las calificaciones de NEXUS.</p><button class="btn btn-primary" type="submit" disabled>Publicar actividad en Classroom</button></div>
          <div id="classroomPublishResult" aria-live="polite"></div>
        </form>
        <aside class="content-block classroom-process">
          <span class="eyebrow">FLUJO DE ENTREGA</span><h2>Qué sucede después</h2>
          <ol><li><b>1</b><span><strong>NEXUS publica</strong>La actividad aparece en el grupo seleccionado.</span></li><li><b>2</b><span><strong>El estudiante recibe</strong>La tarea también se muestra en su portal NEXUS.</span></li><li><b>3</b><span><strong>El estudiante adjunta</strong>Sube documento, presentación, cuaderno o evidencia en Classroom.</span></li><li><b>4</b><span><strong>Usted retroalimenta</strong>Revisa, comenta y califica desde el flujo habitual de Classroom.</span></li></ol>
          <div class="classroom-security"><strong>Conexión protegida</strong><p>Las credenciales no se guardan en el navegador ni se muestran al alumnado. Puede retirar la autorización cuando lo necesite.</p></div>
        </aside>
      </div>
      <section class="content-block classroom-history"><div class="classroom-section-head"><div><span class="eyebrow">SEGUIMIENTO</span><h2>Actividades publicadas desde NEXUS</h2><p>Acceda a cada tarea para revisar entregas y retroalimentar.</p></div><span id="classroomPublishedCount" class="status-chip">0 actividades</span></div><div id="classroomAssignmentList" class="classroom-assignment-list"><p>Consultando publicaciones…</p></div></section>`;
  }

  function setConnection(connected,message=""){
    const card=$("#classroomConnection"),title=$("#classroomConnectionTitle"),text=$("#classroomConnectionText"),connect=$("[data-classroom-connect]"),disconnect=$("[data-classroom-disconnect]"),submit=$("#classroomPublishForm button[type=submit]");
    if(!card)return;
    card.classList.toggle("connected",connected);title.textContent=connected?"Google Classroom conectado":"Conecte su cuenta de Google Classroom";
    text.textContent=message||(connected?"Sus grupos activos están disponibles. Ya puede publicar la actividad posterior a clase.":"La conexión se solicita una sola vez y puede retirarse desde este mismo panel.");
    connect.hidden=connected;disconnect.hidden=!connected;if(submit)submit.disabled=!connected;
  }

  function drawCourses(){
    const select=$("#classroomPublishForm [name=courseId]");if(!select)return;
    select.disabled=false;
    select.innerHTML=courses.length?`<option value="">Seleccione un grupo</option>${courses.map(course=>`<option value="${esc(course.id)}" data-course-name="${esc(course.name)}">${esc(course.name)}${course.section?` · ${esc(course.section)}`:""}</option>`).join("")}`:'<option value="">No se encontraron grupos activos</option>';
  }

  function drawAssignments(){
    const list=$("#classroomAssignmentList"),count=$("#classroomPublishedCount");if(!list)return;
    if(count)count.textContent=`${assignments.length} actividad${assignments.length===1?"":"es"}`;
    list.innerHTML=assignments.length?assignments.map(item=>`<article class="classroom-assignment"><div><span class="eyebrow">${esc(item.courseName||"Google Classroom")} · SESIÓN ${Number(item.sessionNumber)||"—"}</span><h3>${esc(item.title)}</h3><p>${dateLabel(item)}${item.dueTime?` · ${esc(item.dueTime)} h`:""} · ${Number(item.maxPoints)||0} puntos</p></div>${item.alternateLink?`<a class="btn btn-outline" href="${esc(item.alternateLink)}" target="_blank" rel="noopener">Abrir tarea ↗</a>`:""}</article>`).join(""):'<div class="classroom-empty"><strong>Aún no hay actividades publicadas desde NEXUS.</strong><span>Cuando publique la primera, aparecerá aquí y en el portal estudiantil.</span></div>';
  }

  function updateSession(){
    const form=$("#classroomPublishForm"),current=session();if(!form||!current)return;
    form.elements.title.value=defaultTitle(current);form.elements.description.value=defaultDescription(current);form.elements.confirmed.checked=false;
  }

  async function loadConnection(){
    try{
      const status=await NEXUS_AUTH.classroomStatus();
      if(!status.connected){setConnection(false);return;}
      setConnection(true,"Conexión autorizada. Cargando sus grupos activos…");
      const result=await NEXUS_AUTH.listClassroomCourses();courses=result.courses||[];drawCourses();setConnection(true,courses.length?"Sus grupos activos están listos para publicar.":"La conexión está activa, pero no se encontraron grupos donde su cuenta figure como docente.");
    }catch(error){setConnection(false,error.message||"No fue posible verificar la conexión.");}
  }

  async function publish(event){
    event.preventDefault();const form=event.currentTarget,button=form.querySelector("button[type=submit]"),status=$("#classroomPublishStatus"),resultBox=$("#classroomPublishResult"),current=session();
    if(!current)return;button.disabled=true;button.textContent="Publicando…";status.textContent="Enviando la actividad al grupo seleccionado…";resultBox.innerHTML="";
    try{
      const data=Object.fromEntries(new FormData(form)),courseOption=form.elements.courseId.selectedOptions[0],link=data.includeNexusLink?new URL(`estudiante.html#/session/${encodeURIComponent(current.id)}`,location.href).href:"";
      const result=await NEXUS_AUTH.publishClassroomAssignment({courseId:data.courseId,courseName:courseOption?.dataset.courseName||courseOption?.textContent||"",sessionId:current.id,sessionNumber:current.number,unitId:current.unit,title:data.title,description:data.description,dueDate:data.dueDate,dueTime:data.dueTime,maxPoints:Number(data.maxPoints)||100,linkUrl:link});
      resultBox.innerHTML=`<div class="classroom-success"><span>✓</span><div><strong>Actividad publicada correctamente</strong><p>${esc(result.title)} ya está disponible para el grupo ${esc(result.courseName||"")}.</p></div>${result.alternateLink?`<a class="btn btn-dark" href="${esc(result.alternateLink)}" target="_blank" rel="noopener">Ver en Classroom ↗</a>`:""}</div>`;
      form.elements.confirmed.checked=false;status.textContent="Publicación confirmada. El alumnado ya puede abrir la tarea y adjuntar su entrega.";hooks.toast?.("Actividad publicada en Google Classroom");
    }catch(error){resultBox.innerHTML=`<div class="classroom-error"><strong>No se pudo publicar</strong><p>${esc(error.message||error)}</p></div>`;status.textContent="Revise la conexión y vuelva a intentarlo.";}
    finally{button.disabled=false;button.textContent="Publicar actividad en Classroom";}
  }

  function bind(options={}){
    stopAssignments?.();stopAssignments=null;hooks={toast:notify,...options};
    $("[data-classroom-connect]")?.addEventListener("click",async event=>{event.currentTarget.disabled=true;event.currentTarget.textContent="Abriendo autorización…";try{await NEXUS_AUTH.connectClassroom();}catch(error){event.currentTarget.disabled=false;event.currentTarget.textContent="Conectar Google Classroom";setConnection(false,error.message);}});
    $("[data-classroom-disconnect]")?.addEventListener("click",async event=>{if(!confirm("¿Desea retirar la conexión de Google Classroom? Las actividades ya publicadas no se eliminarán."))return;event.currentTarget.disabled=true;try{await NEXUS_AUTH.disconnectClassroom();courses=[];setConnection(false,"La conexión fue retirada. Las actividades publicadas permanecen en Classroom.");const select=$("#classroomPublishForm [name=courseId]");select.disabled=true;select.innerHTML='<option value="">Conecte Classroom para cargar sus grupos</option>';}catch(error){setConnection(true,error.message);}finally{event.currentTarget.disabled=false;}});
    $("#classroomPublishForm [name=sessionId]")?.addEventListener("change",event=>{selectedSessionId=event.target.value;updateSession();});
    $("#classroomPublishForm")?.addEventListener("submit",publish);
    try{stopAssignments=NEXUS_AUTH.watchClassroomAssignments(rows=>{assignments=rows;drawAssignments();},error=>{$("#classroomAssignmentList").innerHTML=`<div class="classroom-error"><strong>No fue posible consultar las publicaciones.</strong><p>${esc(error.message||error)}</p></div>`;});}catch(error){$("#classroomAssignmentList").innerHTML=`<div class="classroom-error"><p>${esc(error.message)}</p></div>`;}
    const callbackStatus=new URLSearchParams(location.search).get("classroom");
    if(callbackStatus==="connected")hooks.toast?.("Google Classroom quedó conectado");
    if(callbackStatus==="error")hooks.toast?.("Google no pudo completar la autorización");
    if(callbackStatus)history.replaceState({},"",`${location.pathname}${location.hash}`);
    loadConnection();
  }

  function cleanup(){stopAssignments?.();stopAssignments=null;hooks={};}
  document.addEventListener("click",event=>{const button=event.target.closest("[data-classroom-session]");if(button)location.hash=`classroom/${button.dataset.classroomSession}`;});
  window.NEXUS_CLASSROOM={view,bind,cleanup};
})();
