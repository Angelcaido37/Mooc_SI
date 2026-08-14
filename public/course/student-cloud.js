(()=>{
  const app=document.querySelector("#app"),gate=document.querySelector("#studentGate");let ready=false,loggingOut=false,stopAssignments=null;
  const toast=message=>{const node=document.querySelector("#toast");if(node){node.textContent=message;node.classList.add("show");setTimeout(()=>node.classList.remove("show"),3000);}};
  const showApp=()=>{if(ready)return;ready=true;document.body.classList.remove("student-locked");gate.hidden=true;app.hidden=false;};
  const lessonInfo=id=>{for(const unit of window.NEXUS_COURSE?.units||[]){const lesson=unit.lessons.find(item=>item.id===id);if(lesson)return{u:unit,l:lesson};}return null;};
  const routeInfo=()=>{const route=location.hash.replace(/^#\/?/,"")||"home",[type,id]=route.split("/"),course=window.NEXUS_COURSE,teaching=window.NEXUS_TEACHING;const fixed={home:"Centro de mando",sessions:"Mapa de las 26 sesiones",route:"Ruta de aprendizaje",story:"Historia NEXUS y meta semanal",project:"Proyecto integrador",games:"Juegos y retos",bonus:"Arena de bonificación",shop:"Tienda de avatares",leaderboard:"Clasificación voluntaria",how:"Cómo jugar NEXUS",lowcode:"Laboratorio low/no-code",technical:"Python y FastAPI",classroom:"Actividades en Google Classroom",evidence:"Evidencias y rúbricas",glossary:"Glosario",help:"Cómo estudiar aquí"};if(type==="unit"){const unit=course?.units.find(item=>item.id===id);return{route,label:unit?`Misión ${unit.number} · ${unit.title}`:"Ruta de aprendizaje"};}if(type==="visual"||type==="lesson"){const hit=lessonInfo(id);return{route,label:hit?`Misión ${hit.u.number} · ${hit.l.title}`:"Lección"};}if(type==="session"){const item=teaching?.sessions.find(entry=>entry.id===id);return{route,label:item?`Sesión ${item.number} · ${item.title}`:"Sesión de clase"};}if(type==="game"){const unit=course?.units.find(item=>item.id===id);return{route,label:unit?`Laboratorio interactivo · Misión ${unit.number}`:"Juego o reto"};}if(type==="evidence"&&id){const unit=course?.units.find(item=>item.id===id);return{route,label:unit?`Evidencia · Misión ${unit.number}`:"Evidencia"};}return{route,label:fixed[type]||"Centro de mando"};};
  const recordCurrent=activityType=>{if(NEXUS_AUTH?.role!=="student")return Promise.resolve();const info=routeInfo();return NEXUS_AUTH.recordActivity({route:info.route,location:info.label,activityType}).catch(()=>{});};
  const receiveAssignments=rows=>{window.NEXUS_CLASSROOM_ASSIGNMENTS=rows;const latestByUnit={};rows.forEach(item=>{if(item.unitId&&item.alternateLink&&!latestByUnit[item.unitId])latestByUnit[item.unitId]=item.alternateLink;});window.CLASSROOM_LINKS={...(window.CLASSROOM_LINKS||{}),...latestByUnit};if(location.hash.includes("classroom")||location.hash.includes("evidence"))window.NEXUS_RENDER?.();};

  window.addEventListener("nexus-auth-change",event=>{
    const{user,role}=event.detail;if(loggingOut)return;
    if(!user){location.replace("index.html?acceso=requerido");return;}
    showApp();
    if(role==="teacher")toast("Está viendo el portal del estudiante como docente.");else{
      recordCurrent("access");stopAssignments?.();
      try{stopAssignments=NEXUS_AUTH.watchClassroomAssignments(receiveAssignments,error=>{console.warn("Classroom assignments unavailable",error?.message||error);});}catch(error){console.warn("Classroom assignments unavailable",error?.message||error);}
    }
    const note=document.querySelector(".privacy-note");if(note)note.textContent="Tu avance y última ubicación se guardan de forma segura. Las tareas se entregan directamente en Google Classroom.";
  });
  document.querySelector("#studentSignOut")?.addEventListener("click",async event=>{if(loggingOut)return;loggingOut=true;event.currentTarget.disabled=true;event.currentTarget.setAttribute("aria-busy","true");stopAssignments?.();try{await NEXUS_AUTH.signOut();}finally{location.replace(`index.html?salida=${Date.now()}`);}});
  window.addEventListener("hashchange",()=>recordCurrent("navigation"));
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")recordCurrent("return");});
  document.addEventListener("click",event=>{const link=event.target.closest('a[href*="laboratorios/"]');if(!link||NEXUS_AUTH?.role!=="student")return;const file=(link.getAttribute("href")||"").split("/").pop()||"laboratorio",label=link.closest("article")?.querySelector("h3")?.textContent?.trim()||link.textContent.trim()||"Laboratorio técnico";NEXUS_AUTH.markLabOpened(file,`Laboratorio abierto · ${label}`).catch(()=>{});});
  const original=localStorage.setItem.bind(localStorage);localStorage.setItem=(key,value)=>{original(key,value);if(key==="nexus-progress"&&window.NEXUS_AUTH?.user){NEXUS_AUTH.saveProgress(JSON.parse(value)).catch(()=>{});recordCurrent("progress");}};
})();
