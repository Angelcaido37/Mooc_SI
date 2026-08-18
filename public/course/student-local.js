(()=>{
 const app=document.querySelector('#app'),gate=document.querySelector('#studentGate');let ready=false,loggingOut=false;
 async function bootStudentAccess(){
   if(NEXUS_AUTH?.user){show();return;}
   try{await NEXUS_AUTH?.init?.();}catch{}
   setTimeout(()=>{
     if(NEXUS_AUTH?.user){show();}
     else if(!localStorage.getItem('nexus18-token')) location.replace('index.html?acceso=requerido');
   },250);
 }
 const show=()=>{if(ready)return;ready=true;document.body.classList.remove('student-locked');gate.hidden=true;app.hidden=false;};
 window.addEventListener('nexus-auth-change',async e=>{const{user,role,sessionExpired}=e.detail;if(loggingOut)return;if(!user){location.replace(sessionExpired?'index.html?sesion=expirada':'index.html?acceso=requerido');return}show();if(role==='teacher'){const t=document.querySelector('#toast');if(t){t.textContent='Vista estudiante abierta desde una cuenta docente';t.classList.add('show')}} else {try{const p=await NEXUS_AUTH.loadProgress();if(p&&Object.keys(p).length)localStorage.setItem('nexus-progress',JSON.stringify({...JSON.parse(localStorage.getItem('nexus-progress')||'{}'),...p}))}catch{} NEXUS_AUTH.recordActivity({route:location.hash.replace(/^#\/?/,'')||'home',location:'Portal estudiante',activityType:'access'}).catch(()=>{})}});
 document.querySelector('#studentSignOut')?.addEventListener('click',async()=>{loggingOut=true;await NEXUS_AUTH.signOut();location.replace('index.html')});
 window.addEventListener('hashchange',()=>NEXUS_AUTH.recordActivity({route:location.hash.replace(/^#\/?/,'')||'home',location:'Navegación académica',activityType:'navigation'}).catch(()=>{}));
 bootStudentAccess();
 const original=localStorage.setItem.bind(localStorage);localStorage.setItem=(key,value)=>{original(key,value);if(key==='nexus-progress'&&NEXUS_AUTH.role==='student')NEXUS_AUTH.saveProgress(JSON.parse(value)).catch(()=>{})};
})();
