const cfg=window.NEXUS_FIREBASE_CONFIG||{};
const opts=window.NEXUS_PLATFORM||{};
const configured=Boolean(cfg.apiKey&&cfg.projectId&&cfg.apiKey!=="REEMPLAZAR");
let currentUser=null,currentRole=null,db=null,auth=null,storage=null,functions=null,api=null;

const emit=(extra={})=>window.dispatchEvent(new CustomEvent("nexus-auth-change",{detail:{user:currentUser,role:currentRole,configured,...extra}}));
async function resolveRole(user){
  if(!user)return null;
  const snap=await api.getDoc(api.doc(db,"roles",user.uid));
  return snap.exists()&&snap.data().role==="teacher"?"teacher":"student";
}
async function init(){
  if(!configured){emit({error:"Firebase no está configurado. El acceso permanece bloqueado."});return;}
  const [{initializeApp},authSdk,firestoreSdk,storageSdk,functionsSdk]=await Promise.all([
    import("https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js"),
    import("https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js"),
    import("https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js"),
    import("https://www.gstatic.com/firebasejs/12.1.0/firebase-functions.js")
  ]);
  const app=initializeApp(cfg);
  auth=authSdk.getAuth(app);
  db=firestoreSdk.getFirestore(app);
  storage=storageSdk.getStorage(app);
  functions=functionsSdk.getFunctions(app,opts.functionsRegion||"us-central1");
  api={...authSdk,...firestoreSdk,...storageSdk,...functionsSdk};
  authSdk.onAuthStateChanged(auth,async user=>{
    try{
      currentUser=user;
      currentRole=await resolveRole(user);
      if(user){
        await firestoreSdk.setDoc(firestoreSdk.doc(db,"users",user.uid),{
          displayName:user.displayName||"",
          email:user.email||"",
          photoURL:user.photoURL||"",
          accountType:currentRole,
          updatedAt:firestoreSdk.serverTimestamp()
        },{merge:true});
      }
      emit();
    }catch(error){currentRole=null;emit({error:error.message});}
  });
}

async function signIn(){
  if(!configured)throw new Error("Firebase no está configurado; no se permite acceso sin autenticación.");
  const result=await api.signInWithPopup(auth,new api.GoogleAuthProvider());
  currentUser=result.user;
  currentRole=await resolveRole(result.user);
  emit();
  return{user:currentUser,role:currentRole};
}
async function signOutUser(){if(auth)await api.signOut(auth);currentUser=null;currentRole=null;emit({signedOut:true});}
async function saveProgress(progress){if(!currentUser)throw new Error("Inicie sesión para guardar el avance.");await api.setDoc(api.doc(db,"progress",currentUser.uid),{...progress,updatedAt:api.serverTimestamp()},{merge:true});}
async function saveLeaderboard(summary){if(!currentUser||currentRole!=="student")throw new Error("Se requiere una cuenta estudiantil.");await api.setDoc(api.doc(db,"leaderboard",currentUser.uid),{...summary,updatedAt:api.serverTimestamp()});}
async function removeLeaderboard(){if(!currentUser||currentRole!=="student")return;await api.deleteDoc(api.doc(db,"leaderboard",currentUser.uid));}
function watchLeaderboard(callback,onError=()=>{}){if(!currentUser)throw new Error("Inicie sesión para consultar la clasificación.");return api.onSnapshot(api.collection(db,"leaderboard"),snap=>callback(snap.docs.map(d=>({uid:d.id,...d.data()}))),onError);}
async function recordActivity({route="home",location="Centro de mando",activityType="access"}={}){
  if(!currentUser||currentRole!=="student")return;
  await api.setDoc(api.doc(db,"users",currentUser.uid),{
    displayName:currentUser.displayName||"",email:currentUser.email||"",photoURL:currentUser.photoURL||"",accountType:"student",
    currentRoute:route,currentLocation:location,activityType,activityCount:api.increment(1),lastActivityAt:api.serverTimestamp(),updatedAt:api.serverTimestamp()
  },{merge:true});
}
async function recordTeacherUsage(area="dashboard"){
  if(!currentUser||currentRole!=="teacher")return;
  const allowed=new Set(["dashboard","conductor","sessions","projectables","slides","labs","students","analytics","measurement","classroom","export"]),key=allowed.has(area)?area:"dashboard";
  await api.setDoc(api.doc(db,"teacherUsage",currentUser.uid),{totalViews:api.increment(1),[`${key}Views`]:api.increment(1),lastArea:key,lastActionAt:api.serverTimestamp(),updatedAt:api.serverTimestamp()},{merge:true});
}
function watchTeacherUsage(callback,onError=()=>{}){if(!currentUser||currentRole!=="teacher")throw new Error("Se requiere autorización docente.");return api.onSnapshot(api.doc(db,"teacherUsage",currentUser.uid),snap=>callback(snap.exists()?snap.data():{}),onError);}
async function saveTeacherReflection(entry){if(!currentUser||currentRole!=="teacher")throw new Error("Se requiere autorización docente.");await api.addDoc(api.collection(db,"teacherReflections",currentUser.uid,"entries"),{...entry,createdAt:api.serverTimestamp()});}
function watchTeacherReflections(callback,onError=()=>{}){if(!currentUser||currentRole!=="teacher")throw new Error("Se requiere autorización docente.");return api.onSnapshot(api.collection(db,"teacherReflections",currentUser.uid,"entries"),snap=>callback(snap.docs.map(d=>({id:d.id,...d.data()}))),onError);}
async function saveTeacherSessionLog(sessionId,entry){if(!currentUser||currentRole!=="teacher")throw new Error("Se requiere autorización docente.");await api.setDoc(api.doc(db,"teacherSessionLogs",currentUser.uid,"sessions",sessionId),{...entry,sessionId,updatedAt:api.serverTimestamp()},{merge:true});}
async function loadTeacherSessionLog(sessionId){if(!currentUser||currentRole!=="teacher")throw new Error("Se requiere autorización docente.");const snap=await api.getDoc(api.doc(db,"teacherSessionLogs",currentUser.uid,"sessions",sessionId));return snap.exists()?snap.data():null;}
function watchTeacherSessionLogs(callback,onError=()=>{}){if(!currentUser||currentRole!=="teacher")throw new Error("Se requiere autorización docente.");return api.onSnapshot(api.collection(db,"teacherSessionLogs",currentUser.uid,"sessions"),snap=>callback(snap.docs.map(d=>({id:d.id,...d.data()}))),onError);}
async function recordTeacherConductorEvent(event,sessionId){
  if(!currentUser||currentRole!=="teacher")return;
  const fields={start:"conductorStarts",phase:"conductorPhaseAdvances",complete:"conductorCompletions",planB:"conductorPlanBUses",export:"conductorExports"},field=fields[event];
  if(!field)return;
  await api.setDoc(api.doc(db,"teacherUsage",currentUser.uid),{[field]:api.increment(1),lastConductorEvent:event,lastConductorSession:sessionId,lastActionAt:api.serverTimestamp(),updatedAt:api.serverTimestamp()},{merge:true});
}
async function markLabOpened(labId,label){if(!currentUser||currentRole!=="student")return;await api.setDoc(api.doc(db,"progress",currentUser.uid),{labsOpened:api.arrayUnion(labId),updatedAt:api.serverTimestamp()},{merge:true});await recordActivity({route:location.hash.replace(/^#\/?/,"")||"home",location:label||"Laboratorio técnico",activityType:"laboratory"});}
async function saveExitTicket(sessionId,response){if(!currentUser)throw new Error("Inicie sesión.");await api.setDoc(api.doc(db,"users",currentUser.uid,"exitTickets",sessionId),{response,createdAt:api.serverTimestamp()},{merge:true});}
async function uploadEvidence(file,metadata={}){
  if(!currentUser)throw new Error("Inicie sesión.");
  if(!opts.storageEnabled)throw new Error("La carga interna está desactivada. Entregue el archivo directamente en Classroom.");
  const evidenceId=metadata.evidenceId||String(Date.now()),safe=file.name.replace(/[^a-zA-Z0-9._-]/g,"_"),path=`evidence/${currentUser.uid}/${Date.now()}-${safe}`;
  const snap=await api.uploadBytes(api.ref(storage,path),file,{contentType:file.type}),url=await api.getDownloadURL(snap.ref);
  await api.setDoc(api.doc(db,"users",currentUser.uid,"evidence",evidenceId),{...metadata,fileName:file.name,path,url,status:"uploaded",updatedAt:api.serverTimestamp()},{merge:true});
  await api.setDoc(api.doc(db,"progress",currentUser.uid),{evidences:api.arrayUnion(evidenceId),updatedAt:api.serverTimestamp()},{merge:true});
  await recordActivity({route:`evidence/${evidenceId}`,location:`Evidencia ${evidenceId.replace(/^u/,"")} guardada`,activityType:"evidence"});
  return{path,url};
}
function watchTeacherTracking(callback,onError=()=>{}){
  if(!currentUser||currentRole!=="teacher")throw new Error("Se requiere autorización docente.");
  const users=new Map(),progress=new Map();let usersReady=false,progressReady=false;
  const publish=()=>{if(!usersReady||!progressReady)return;const rows=[...users.entries()].filter(([uid,u])=>uid!==currentUser.uid&&u.accountType!=="teacher").map(([uid,u])=>({uid,...u,progress:progress.get(uid)||{}})).sort((a,b)=>timestampMs(b.lastActivityAt||b.updatedAt||b.progress.updatedAt)-timestampMs(a.lastActivityAt||a.updatedAt||a.progress.updatedAt));callback(rows);};
  const stopUsers=api.onSnapshot(api.collection(db,"users"),snap=>{users.clear();snap.forEach(d=>users.set(d.id,d.data()));usersReady=true;publish();},onError);
  const stopProgress=api.onSnapshot(api.collection(db,"progress"),snap=>{progress.clear();snap.forEach(d=>progress.set(d.id,d.data()));progressReady=true;publish();},onError);
  return()=>{stopUsers();stopProgress();};
}
function timestampMs(value){if(!value)return 0;if(typeof value.toMillis==="function")return value.toMillis();if(typeof value.toDate==="function")return value.toDate().getTime();const parsed=Date.parse(value);return Number.isFinite(parsed)?parsed:0;}

function watchPilotConfig(callback,onError=()=>{}){
  if(!currentUser)throw new Error("Inicie sesión para consultar el calendario del piloto.");
  return api.onSnapshot(api.doc(db,"coursework","nexusPilotConfig"),snap=>callback(snap.exists()?snap.data():{}),onError);
}
async function savePilotConfig(config){
  if(!currentUser||currentRole!=="teacher")throw new Error("Se requiere autorización docente.");
  await api.setDoc(api.doc(db,"coursework","nexusPilotConfig"),{...config,recordType:"nexusPilotConfig",durationWeeks:16,updatedBy:currentUser.uid,updatedAt:api.serverTimestamp()},{merge:true});
}
async function saveStudentInstrumentResponse(instrumentId,response){
  if(!currentUser||currentRole!=="student")throw new Error("Se requiere una cuenta estudiantil.");
  await api.setDoc(api.doc(db,"progress",currentUser.uid),{
    measurementResponses:{[instrumentId]:{...response,instrumentId,submittedAt:api.serverTimestamp()}},
    updatedAt:api.serverTimestamp()
  },{merge:true});
  await recordActivity({route:"measurement",location:`Instrumento ${instrumentId} completado`,activityType:"instrument"});
}
function watchMyStudentInstrumentResponses(callback,onError=()=>{}){
  if(!currentUser||currentRole!=="student")throw new Error("Se requiere una cuenta estudiantil.");
  return api.onSnapshot(api.doc(db,"progress",currentUser.uid),snap=>{
    const data=snap.exists()?snap.data():{};
    callback({responses:data.measurementResponses||{},updatedAt:data.updatedAt});
  },onError);
}
async function saveTeacherInstrumentResponse(instrumentId,response){
  if(!currentUser||currentRole!=="teacher")throw new Error("Se requiere autorización docente.");
  await api.setDoc(api.doc(db,"teacherUsage",currentUser.uid),{
    measurementResponses:{[instrumentId]:{...response,instrumentId,submittedAt:api.serverTimestamp()}},
    updatedAt:api.serverTimestamp()
  },{merge:true});
}
function watchMyTeacherInstrumentResponses(callback,onError=()=>{}){
  if(!currentUser||currentRole!=="teacher")throw new Error("Se requiere autorización docente.");
  return api.onSnapshot(api.doc(db,"teacherUsage",currentUser.uid),snap=>{
    const data=snap.exists()?snap.data():{};
    callback({responses:data.measurementResponses||{},updatedAt:data.updatedAt});
  },onError);
}
function watchAllStudentInstrumentResponses(callback,onError=()=>{}){
  if(!currentUser||currentRole!=="teacher")throw new Error("Se requiere autorización docente.");
  return api.onSnapshot(api.collection(db,"progress"),snap=>callback(snap.docs.map(d=>{
    const data=d.data();
    return{uid:d.id,responses:data.measurementResponses||{},updatedAt:data.updatedAt};
  })),onError);
}
function watchAllTeacherInstrumentResponses(callback,onError=()=>{}){
  if(!currentUser||currentRole!=="teacher")throw new Error("Se requiere autorización docente.");
  return api.onSnapshot(api.doc(db,"teacherUsage",currentUser.uid),snap=>{
    const data=snap.exists()?snap.data():{};
    callback([{uid:currentUser.uid,responses:data.measurementResponses||{},updatedAt:data.updatedAt}]);
  },onError);
}

async function callClassroom(name,data){if(!configured||!opts.classroomEnabled)throw new Error("Classroom aún no está configurado.");return(await api.httpsCallable(functions,name)(data)).data;}

window.NEXUS_AUTH={
  init,signIn,signOut:signOutUser,saveProgress,saveLeaderboard,removeLeaderboard,watchLeaderboard,recordActivity,
  recordTeacherUsage,watchTeacherUsage,saveTeacherReflection,watchTeacherReflections,saveTeacherSessionLog,loadTeacherSessionLog,watchTeacherSessionLogs,
  recordTeacherConductorEvent,markLabOpened,watchTeacherTracking,saveExitTicket,uploadEvidence,
  watchPilotConfig,savePilotConfig,saveStudentInstrumentResponse,watchMyStudentInstrumentResponses,
  saveTeacherInstrumentResponse,watchMyTeacherInstrumentResponses,watchAllStudentInstrumentResponses,watchAllTeacherInstrumentResponses,
  callClassroom,get user(){return currentUser},get role(){return currentRole},configured
};
init().catch(error=>emit({error:error.message}));
