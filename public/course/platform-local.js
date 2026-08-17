(()=>{
  const API=((window.NEXUS_CONFIG&&window.NEXUS_CONFIG.apiBase)||'/api').replace(/\/$/,''); let currentUser=null,currentRole=null; let token=localStorage.getItem('nexus18-token')||'';
  const emit=(extra={})=>window.dispatchEvent(new CustomEvent('nexus-auth-change',{detail:{user:currentUser,role:currentRole,configured:true,...extra}}));
  const headers=(json=true)=>({...(json?{'Content-Type':'application/json'}:{}),...(token?{Authorization:`Bearer ${token}`}:{})});
  async function request(path,opt={}){const r=await fetch(API+path,{...opt,headers:{...headers(!(opt.body instanceof FormData)),...(opt.headers||{})}});if(!r.ok){let d={};try{d=await r.json()}catch{}throw new Error(d.detail||`Error ${r.status}`)}return r.status===204?null:r.json();}
  async function init(){if(!token){emit();return;}try{const m=await request('/auth/me');currentUser=m.user;currentRole=m.role;emit();}catch{token='';localStorage.removeItem('nexus18-token');emit();}}
  async function signIn(data={}){const x=await request('/auth/login',{method:'POST',body:JSON.stringify(data)});token=x.token;localStorage.setItem('nexus18-token',token);currentUser=x.user;currentRole=x.role;emit();return x;}
  async function signOut(){try{await request('/auth/logout',{method:'POST'})}catch{} token='';currentUser=null;currentRole=null;localStorage.removeItem('nexus18-token');emit({signedOut:true});}
  async function saveProgress(progress){return request('/progress',{method:'POST',body:JSON.stringify({data:progress})});}
  async function loadProgress(){return request('/progress');}
  async function recordActivity(data={}){if(currentRole!=='student')return;return request('/events',{method:'POST',body:JSON.stringify({data})});}
  async function markLabOpened(labId,label){await recordActivity({route:`technical/${labId}`,location:label,activityType:'laboratory'});}
  async function saveExitTicket(sessionId,response){const p={exitTickets:{[sessionId]:{response,createdAt:new Date().toISOString()}}};await saveProgress(p);}
  async function saveLeaderboard(summary){await saveProgress({leaderboard:summary});}
  async function removeLeaderboard(){await saveProgress({leaderboard:null});}
  function poll(fn,cb,onError=()=>{},ms=5000){let stopped=false;const go=async()=>{if(stopped)return;try{cb(await fn())}catch(e){onError(e)}};go();const id=setInterval(go,ms);return()=>{stopped=true;clearInterval(id)}}
  function watchLeaderboard(cb,onError){return poll(async()=>{const rows=await request('/teacher/students').catch(()=>[]);return rows.filter(r=>r.progress?.leaderboard).map(r=>({uid:r.uid,...r.progress.leaderboard}))},cb,onError);}
  function watchTeacherTracking(cb,onError){return poll(()=>request('/teacher/students'),cb,onError);}
  async function recordTeacherUsage(area='dashboard'){if(currentRole!=='teacher')return;const old=await getConfig('teacher_usage').catch(()=>({}));const u={...(old||{})};u.totalViews=(u.totalViews||0)+1;u[`${area}Views`]=(u[`${area}Views`]||0)+1;u.lastArea=area;u.updatedAt=new Date().toISOString();return setConfig('teacher_usage',u);}
  function watchTeacherUsage(cb,onError){return poll(()=>getConfig('teacher_usage'),x=>cb(x||{}),onError,7000);}
  async function saveTeacherReflection(entry){return request('/teacher/records/reflections',{method:'POST',body:JSON.stringify({data:{...entry,createdAt:new Date().toISOString()}})});}
  function watchTeacherReflections(cb,onError){return poll(async()=>{const rows=await request('/teacher/records/reflections');return rows.map(r=>r.data)},cb,onError,7000);}
  async function saveTeacherSessionLog(sessionId,entry){return request(`/teacher/records/session_log/${encodeURIComponent(sessionId)}`,{method:'POST',body:JSON.stringify({data:{...entry,sessionId,updatedAt:new Date().toISOString()}})});}
  async function loadTeacherSessionLog(sessionId){const r=await request(`/teacher/records/session_log/${encodeURIComponent(sessionId)}`);return r?.data||null;}
  function watchTeacherSessionLogs(cb,onError){return poll(async()=>{const rows=await request('/teacher/records/session_log');return rows.map(r=>r.data)},cb,onError,7000);}
  async function recordTeacherConductorEvent(data={}){if(currentRole!=='teacher')return;return request('/teacher/records/conductor_event',{method:'POST',body:JSON.stringify({data:{...data,createdAt:new Date().toISOString()}})});}
  function watchPilotConfig(cb,onError){return poll(()=>getConfig('pilot_config'),x=>cb(x||{}),onError,7000);}
  async function savePilotConfig(config){return setConfig('pilot_config',config);}
  async function saveStudentInstrumentResponse(instrumentId,response){await saveProgress({measurementResponses:{[instrumentId]:{...response,instrumentId,submittedAt:new Date().toISOString()}}});}
  function watchMyStudentInstrumentResponses(cb,onError){return poll(async()=>{const p=await loadProgress();return{responses:p.measurementResponses||{},updatedAt:p.updatedAt}},cb,onError);}
  async function saveTeacherInstrumentResponse(instrumentId,response){return request(`/teacher/records/instrument/${encodeURIComponent(instrumentId)}`,{method:'POST',body:JSON.stringify({data:{...response,instrumentId,submittedAt:new Date().toISOString()}})});}
  function watchMyTeacherInstrumentResponses(cb,onError){return poll(async()=>{const rows=await request('/teacher/records/instrument');const responses={};rows.forEach(r=>responses[r.id]=r.data);return{responses}},cb,onError,7000);}
  function watchAllStudentInstrumentResponses(cb,onError){return poll(async()=>{const rows=await request('/teacher/students');return rows.map(r=>({uid:r.uid,responses:r.progress?.measurementResponses||{},updatedAt:r.progress?.updatedAt}))},cb,onError);}
  function watchAllTeacherInstrumentResponses(cb,onError){return poll(async()=>{const rows=await request('/teacher/records/instrument');const responses={};rows.forEach(r=>responses[r.id]=r.data);return[{uid:currentUser?.uid||'teacher',responses}]},cb,onError,7000);}
  async function uploadEvidence(file,metadata={}){const f=new FormData();f.append('evidenceId',metadata.evidenceId||String(Date.now()));f.append('title',metadata.title||'Evidencia');f.append('textAnswer',metadata.textAnswer||'');f.append('linkUrl',metadata.linkUrl||'');if(file)f.append('file',file);return request('/evidence/submit',{method:'POST',body:f});}
  const getMyEvidence=()=>request('/evidence/mine');
  const getAllEvidence=()=>request('/teacher/evidence');
  const gradeEvidence=(id,data)=>request(`/teacher/evidence/${encodeURIComponent(id)}/grade`,{method:'POST',body:JSON.stringify(data)});
  const getConfig=key=>request(`/config/${encodeURIComponent(key)}`);
  const setConfig=(key,data)=>request(`/config/${encodeURIComponent(key)}`,{method:'POST',body:JSON.stringify({data})});
  const getAnalytics=()=>request('/analytics');
  const getMyGradebook=()=>request('/gradebook/mine');
  const getTeacherGradebook=()=>request('/teacher/gradebook');
  const exportMyData=()=>request('/privacy/export');
  const requestDataRight=(kind,detail='')=>request('/privacy/request',{method:'POST',body:JSON.stringify({kind,detail})});
  window.NEXUS_AUTH={api:request,init,signIn,signOut,saveProgress,loadProgress,saveLeaderboard,removeLeaderboard,watchLeaderboard,recordActivity,recordTeacherUsage,watchTeacherUsage,saveTeacherReflection,watchTeacherReflections,saveTeacherSessionLog,loadTeacherSessionLog,watchTeacherSessionLogs,recordTeacherConductorEvent,markLabOpened,watchTeacherTracking,saveExitTicket,uploadEvidence,watchPilotConfig,savePilotConfig,saveStudentInstrumentResponse,watchMyStudentInstrumentResponses,saveTeacherInstrumentResponse,watchMyTeacherInstrumentResponses,watchAllStudentInstrumentResponses,watchAllTeacherInstrumentResponses,getMyEvidence,getAllEvidence,gradeEvidence,getConfig,setConfig,getAnalytics,getMyGradebook,getTeacherGradebook,exportMyData,requestDataRight,get user(){return currentUser},get role(){return currentRole},configured:true};
  init();
})();
