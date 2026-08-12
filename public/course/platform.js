const cfg=window.NEXUS_FIREBASE_CONFIG||{};
const opts=window.NEXUS_PLATFORM||{};
const configured=cfg.apiKey&&cfg.apiKey!=="REEMPLAZAR";

const demoUser={uid:"demo-estudiante",displayName:"Estudiante de demostración",email:"estudiante@demo.nexus",photoURL:""};
let currentUser=null,currentRole=null,db=null,auth=null,storage=null,functions=null;

const emit=()=>window.dispatchEvent(new CustomEvent("nexus-auth-change",{detail:{user:currentUser,role:currentRole,configured}}));
const localKey=(name)=>`nexus-cloud-demo:${currentUser?.uid||"anon"}:${name}`;

async function init(){
  if(!configured){
    const saved=JSON.parse(sessionStorage.getItem("nexus-demo-user")||"null");
    if(saved){currentUser=saved.user;currentRole=saved.role;}
    emit(); return;
  }
  const [{initializeApp},{getAuth,GoogleAuthProvider,onAuthStateChanged,signInWithPopup,signOut},{getFirestore,doc,getDoc,setDoc,serverTimestamp},{getStorage,ref,uploadBytes,getDownloadURL},{getFunctions,httpsCallable}]=await Promise.all([
    import("https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js"),
    import("https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js"),
    import("https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js"),
    import("https://www.gstatic.com/firebasejs/12.1.0/firebase-functions.js")
  ]);
  const app=initializeApp(cfg); auth=getAuth(app); db=getFirestore(app); storage=getStorage(app); functions=getFunctions(app,opts.functionsRegion||"us-central1");
  window.__NEXUS_FIREBASE={GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged,doc,getDoc,setDoc,serverTimestamp,ref,uploadBytes,getDownloadURL,httpsCallable};
  onAuthStateChanged(auth,async user=>{
    currentUser=user;
    if(user){
      const roleSnap=await getDoc(doc(db,"roles",user.uid)); currentRole=roleSnap.exists()&&roleSnap.data().role==="teacher"?"teacher":"student";
      await setDoc(doc(db,"users",user.uid),{displayName:user.displayName||"",email:user.email||"",photoURL:user.photoURL||"",updatedAt:serverTimestamp()},{merge:true});
    }else currentRole=null;
    emit();
  });
}

async function signIn(role="student"){
  if(!configured){
    currentUser={...demoUser,uid:role==="teacher"?"demo-docente":"demo-estudiante",displayName:role==="teacher"?"Docente de demostración":"Estudiante de demostración",email:role==="teacher"?"docente@demo.nexus":"estudiante@demo.nexus"};
    currentRole=role;sessionStorage.setItem("nexus-demo-user",JSON.stringify({user:currentUser,role}));emit();return {user:currentUser,role};
  }
  const {GoogleAuthProvider,signInWithPopup}=window.__NEXUS_FIREBASE;
  const result=await signInWithPopup(auth,new GoogleAuthProvider());
  return {user:result.user,role:currentRole};
}
async function signOutUser(){
  if(!configured){sessionStorage.removeItem("nexus-demo-user");currentUser=null;currentRole=null;emit();return;}
  await window.__NEXUS_FIREBASE.signOut(auth);
}
async function saveProgress(progress){
  if(!currentUser)throw new Error("Inicie sesión para guardar el avance.");
  if(!configured){localStorage.setItem(localKey("progress"),JSON.stringify(progress));return;}
  const {doc,setDoc,serverTimestamp}=window.__NEXUS_FIREBASE;
  await setDoc(doc(db,"progress",currentUser.uid),{...progress,updatedAt:serverTimestamp()},{merge:true});
}
async function saveExitTicket(sessionId,response){
  if(!currentUser)throw new Error("Inicie sesión.");
  if(!configured){localStorage.setItem(localKey(`exit:${sessionId}`),JSON.stringify({response,createdAt:new Date().toISOString()}));return;}
  const {doc,setDoc,serverTimestamp}=window.__NEXUS_FIREBASE;
  await setDoc(doc(db,"users",currentUser.uid,"exitTickets",sessionId),{response,createdAt:serverTimestamp()},{merge:true});
}
async function uploadEvidence(file,metadata={}){
  if(!currentUser)throw new Error("Inicie sesión.");
  if(!configured)throw new Error("La carga de archivos se activa al configurar Firebase.");
  const {ref,uploadBytes,getDownloadURL,doc,setDoc,serverTimestamp}=window.__NEXUS_FIREBASE;
  const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,"_"); const path=`evidence/${currentUser.uid}/${Date.now()}-${safe}`;
  const snap=await uploadBytes(ref(storage,path),file,{contentType:file.type}); const url=await getDownloadURL(snap.ref);
  await setDoc(doc(db,"users",currentUser.uid,"evidence",metadata.evidenceId||String(Date.now())),{...metadata,fileName:file.name,path,url,status:"uploaded",updatedAt:serverTimestamp()},{merge:true});
  return {path,url};
}
async function callClassroom(name,data){
  if(!configured||!opts.classroomEnabled)throw new Error("Classroom aún no está configurado. Consulte CONFIGURACION_FIREBASE_CLASSROOM.md.");
  return (await window.__NEXUS_FIREBASE.httpsCallable(functions,name)(data)).data;
}

window.NEXUS_AUTH={init,signIn,signOut:signOutUser,saveProgress,saveExitTicket,uploadEvidence,callClassroom,get user(){return currentUser},get role(){return currentRole},configured};
init().catch(error=>window.dispatchEvent(new CustomEvent("nexus-platform-error",{detail:error})));
