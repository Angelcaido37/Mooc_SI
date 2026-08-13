const cfg=window.NEXUS_FIREBASE_CONFIG||{};
const opts=window.NEXUS_PLATFORM||{};
const configured=Boolean(cfg.apiKey&&cfg.projectId&&cfg.apiKey!=="REEMPLAZAR");
let currentUser=null,currentRole=null,db=null,auth=null,storage=null,functions=null,api=null;
const emit=(extra={})=>window.dispatchEvent(new CustomEvent("nexus-auth-change",{detail:{user:currentUser,role:currentRole,configured,...extra}}));
async function resolveRole(user){if(!user)return null;const snap=await api.getDoc(api.doc(db,"roles",user.uid));return snap.exists()&&snap.data().role==="teacher"?"teacher":"student";}
async function init(){
  if(!configured){emit({error:"Firebase no está configurado. El acceso permanece bloqueado."});return;}
  const [{initializeApp},authSdk,firestoreSdk,storageSdk,functionsSdk]=await Promise.all([
    import("https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js"),import("https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js"),import("https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js"),import("https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js"),import("https://www.gstatic.com/firebasejs/12.1.0/firebase-functions.js")]);
  const app=initializeApp(cfg);auth=authSdk.getAuth(app);db=firestoreSdk.getFirestore(app);storage=storageSdk.getStorage(app);functions=functionsSdk.getFunctions(app,opts.functionsRegion||"us-central1");api={...authSdk,...firestoreSdk,...storageSdk,...functionsSdk};
  authSdk.onAuthStateChanged(auth,async user=>{try{currentUser=user;currentRole=await resolveRole(user);if(user)await firestoreSdk.setDoc(firestoreSdk.doc(db,"users",user.uid),{displayName:user.displayName||"",email:user.email||"",photoURL:user.photoURL||"",updatedAt:firestoreSdk.serverTimestamp()},{merge:true});emit();}catch(error){currentRole=null;emit({error:error.message});}});
}
async function signIn(){if(!configured)throw new Error("Firebase no está configurado; no se permite acceso sin autenticación.");const result=await api.signInWithPopup(auth,new api.GoogleAuthProvider());currentUser=result.user;currentRole=await resolveRole(result.user);emit();return{user:currentUser,role:currentRole};}
async function signOutUser(){if(auth)await api.signOut(auth);currentUser=null;currentRole=null;emit({signedOut:true});}
async function saveProgress(progress){if(!currentUser)throw new Error("Inicie sesión para guardar el avance.");await api.setDoc(api.doc(db,"progress",currentUser.uid),{...progress,updatedAt:api.serverTimestamp()},{merge:true});}
async function saveExitTicket(sessionId,response){if(!currentUser)throw new Error("Inicie sesión.");await api.setDoc(api.doc(db,"users",currentUser.uid,"exitTickets",sessionId),{response,createdAt:api.serverTimestamp()},{merge:true});}
async function uploadEvidence(file,metadata={}){if(!currentUser)throw new Error("Inicie sesión.");if(!opts.storageEnabled)throw new Error("La carga interna está desactivada. Entregue el archivo directamente en Classroom.");const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,"_");const path=`evidence/${currentUser.uid}/${Date.now()}-${safe}`;const snap=await api.uploadBytes(api.ref(storage,path),file,{contentType:file.type});const url=await api.getDownloadURL(snap.ref);await api.setDoc(api.doc(db,"users",currentUser.uid,"evidence",metadata.evidenceId||String(Date.now())),{...metadata,fileName:file.name,path,url,status:"uploaded",updatedAt:api.serverTimestamp()},{merge:true});return{path,url};}
async function callClassroom(name,data){if(!configured||!opts.classroomEnabled)throw new Error("Classroom aún no está configurado.");return(await api.httpsCallable(functions,name)(data)).data;}
window.NEXUS_AUTH={init,signIn,signOut:signOutUser,saveProgress,saveExitTicket,uploadEvidence,callClassroom,get user(){return currentUser},get role(){return currentRole},configured};
init().catch(error=>emit({error:error.message}));
