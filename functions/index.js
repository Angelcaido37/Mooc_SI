import {initializeApp} from "firebase-admin/app";
import {getFirestore,FieldValue} from "firebase-admin/firestore";
import {onCall,HttpsError,onRequest} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import {google} from "googleapis";
import crypto from "node:crypto";

initializeApp();
const db=getFirestore();
const CLIENT_ID=defineSecret("GOOGLE_OAUTH_CLIENT_ID");
const CLIENT_SECRET=defineSecret("GOOGLE_OAUTH_CLIENT_SECRET");
const OAUTH_REDIRECT=defineSecret("GOOGLE_OAUTH_REDIRECT_URI");
const CLASSROOM_SCOPES=[
  "https://www.googleapis.com/auth/classroom.courses.readonly",
  "https://www.googleapis.com/auth/classroom.coursework.students"
];

const client=()=>new google.auth.OAuth2(CLIENT_ID.value(),CLIENT_SECRET.value(),OAUTH_REDIRECT.value());
const text=(value,max=30000)=>String(value??"").trim().slice(0,max);

async function requireUser(req){
  if(!req.auth)throw new HttpsError("unauthenticated","Inicie sesión para continuar.");
  return req.auth.uid;
}

async function requireTeacher(req){
  const uid=await requireUser(req),role=await db.doc(`roles/${uid}`).get();
  if(!role.exists||role.data().role!=="teacher")throw new HttpsError("permission-denied","Se requiere una cuenta docente autorizada.");
  return uid;
}

async function authorized(uid){
  const snap=await db.doc(`classroomTokens/${uid}`).get();
  if(!snap.exists)throw new HttpsError("failed-precondition","Conecte primero su cuenta docente de Google Classroom.");
  const auth=client();
  auth.setCredentials(snap.data());
  auth.on("tokens",tokens=>db.doc(`classroomTokens/${uid}`).set({...tokens,updatedAt:FieldValue.serverTimestamp()},{merge:true}));
  return auth;
}

function classroomError(error,fallback="Google Classroom no pudo completar la operación."){
  if(error instanceof HttpsError)return error;
  const status=Number(error?.response?.status||error?.code||0);
  if(status===401)return new HttpsError("unauthenticated","La autorización de Classroom venció. Vuelva a conectar su cuenta.");
  if(status===403)return new HttpsError("permission-denied","Google Classroom rechazó la operación. Verifique que sea docente del grupo y que la institución autorice la integración.");
  if(status===404)return new HttpsError("not-found","El grupo o la actividad ya no está disponible en Classroom.");
  return new HttpsError("internal",fallback);
}

export const startClassroomOAuth=onCall({secrets:[CLIENT_ID,CLIENT_SECRET,OAUTH_REDIRECT]},async req=>{
  const uid=await requireTeacher(req);
  const state=crypto.randomBytes(32).toString("hex");
  await db.doc(`oauthStates/${state}`).set({uid,purpose:"classroom-teacher",expiresAt:Date.now()+10*60*1000,createdAt:FieldValue.serverTimestamp()});
  return{url:client().generateAuthUrl({access_type:"offline",prompt:"consent",scope:CLASSROOM_SCOPES,state,include_granted_scopes:true})};
});

export const classroomOAuthCallback=onRequest({secrets:[CLIENT_ID,CLIENT_SECRET,OAUTH_REDIRECT]},async(req,res)=>{
  const errorRedirect="/docente.html?classroom=error#classroom";
  try{
    const code=text(req.query.code,4096),state=text(req.query.state,256);
    if(!code||!state)throw new Error("Respuesta OAuth incompleta.");
    const stateRef=db.doc(`oauthStates/${state}`),stateSnap=await stateRef.get();
    if(!stateSnap.exists||stateSnap.data().purpose!=="classroom-teacher"||stateSnap.data().expiresAt<Date.now())throw new Error("La solicitud de autorización venció.");
    const {tokens}=await client().getToken(code);
    if(!tokens.refresh_token){
      const existing=await db.doc(`classroomTokens/${stateSnap.data().uid}`).get();
      if(existing.exists&&existing.data().refresh_token)tokens.refresh_token=existing.data().refresh_token;
    }
    await db.doc(`classroomTokens/${stateSnap.data().uid}`).set({...tokens,scope:CLASSROOM_SCOPES.join(" "),updatedAt:FieldValue.serverTimestamp()},{merge:true});
    await stateRef.delete();
    res.redirect("/docente.html?classroom=connected#classroom");
  }catch(error){
    console.error("Classroom OAuth callback failed",error?.message||error);
    res.redirect(errorRedirect);
  }
});

export const classroomConnectionStatus=onCall(async req=>{
  const uid=await requireTeacher(req),snap=await db.doc(`classroomTokens/${uid}`).get();
  return{connected:snap.exists,updatedAt:snap.exists&&snap.data().updatedAt?.toDate?.().toISOString?.()||null};
});

export const listClassroomCourses=onCall({secrets:[CLIENT_ID,CLIENT_SECRET,OAUTH_REDIRECT]},async req=>{
  const uid=await requireTeacher(req);
  try{
    const auth=await authorized(uid),classroom=google.classroom({version:"v1",auth}),courses=[];
    let pageToken;
    do{
      const {data}=await classroom.courses.list({teacherId:"me",courseStates:["ACTIVE"],pageSize:100,pageToken});
      for(const course of data.courses||[])courses.push({id:course.id,name:course.name,section:course.section||"",room:course.room||"",alternateLink:course.alternateLink||""});
      pageToken=data.nextPageToken;
    }while(pageToken&&courses.length<300);
    return{courses:courses.sort((a,b)=>a.name.localeCompare(b.name,"es"))};
  }catch(error){throw classroomError(error,"No fue posible cargar sus grupos de Classroom.");}
});

export const createCoursework=onCall({secrets:[CLIENT_ID,CLIENT_SECRET,OAUTH_REDIRECT]},async req=>{
  const uid=await requireTeacher(req);
  try{
    const input=req.data||{},courseId=text(input.courseId,256),courseName=text(input.courseName,750),title=text(input.title,3000),description=text(input.description,30000);
    const sessionId=text(input.sessionId,120),unitId=text(input.unitId,40),linkUrl=text(input.linkUrl,2000);
    if(!courseId||!title||!sessionId)throw new HttpsError("invalid-argument","Seleccione un grupo y una sesión, y escriba el título de la actividad.");
    const auth=await authorized(uid),classroom=google.classroom({version:"v1",auth});
    const maxPoints=Math.max(0,Math.min(1000,Number(input.maxPoints)||100));
    const work={title,description,workType:"ASSIGNMENT",state:"PUBLISHED",assigneeMode:"ALL_STUDENTS",maxPoints};
    if(/^https?:\/\//i.test(linkUrl))work.materials=[{link:{url:linkUrl,title:"Abrir Misión NEXUS"}}];
    if(/^\d{4}-\d{2}-\d{2}$/.test(input.dueDate||"")){
      const [year,month,day]=input.dueDate.split("-").map(Number),[hours,minutes]=/^\d{2}:\d{2}$/.test(input.dueTime||"")?input.dueTime.split(":").map(Number):[23,59];
      work.dueDate={year,month,day};work.dueTime={hours,minutes};
    }
    const {data}=await classroom.courses.courseWork.create({courseId,requestBody:work});
    const record={
      recordType:"classroomAssignment",creatorUid:uid,courseId,courseName,courseWorkId:data.id,title:data.title||title,
      description:data.description||description,sessionId,sessionNumber:Number(input.sessionNumber)||0,unitId,
      state:data.state||"PUBLISHED",maxPoints:data.maxPoints??maxPoints,dueDate:input.dueDate||"",dueTime:input.dueTime||"",
      alternateLink:data.alternateLink||"",nexusLink:/^https?:\/\//i.test(linkUrl)?linkUrl:"",creationTime:data.creationTime||"",createdAt:FieldValue.serverTimestamp(),updatedAt:FieldValue.serverTimestamp()
    };
    await db.doc(`classroomAssignments/${data.id}`).set(record);
    return{id:data.id,title:record.title,alternateLink:record.alternateLink,state:record.state,courseName:record.courseName};
  }catch(error){throw classroomError(error,"No fue posible publicar la actividad en Classroom.");}
});

export const disconnectClassroom=onCall({secrets:[CLIENT_ID,CLIENT_SECRET,OAUTH_REDIRECT]},async req=>{
  const uid=await requireTeacher(req),ref=db.doc(`classroomTokens/${uid}`),snap=await ref.get();
  if(snap.exists){
    const token=snap.data().refresh_token||snap.data().access_token;
    if(token)try{await client().revokeToken(token);}catch(error){console.warn("Classroom token revoke failed",error?.message||error);}
    await ref.delete();
  }
  return{connected:false};
});

// Compatibilidad con entregas y calificaciones creadas en ediciones anteriores.
export const submitEvidence=onCall({secrets:[CLIENT_ID,CLIENT_SECRET,OAUTH_REDIRECT]},async req=>{
  const uid=await requireUser(req),{courseId,courseWorkId,submissionId,evidenceUrl}=req.data||{},auth=await authorized(uid),classroom=google.classroom({version:"v1",auth});
  if(evidenceUrl)await classroom.courses.courseWork.studentSubmissions.modifyAttachments({courseId,courseWorkId,id:submissionId,requestBody:{addAttachments:[{link:{url:evidenceUrl,title:"Evidencia Misión NEXUS"}}]}});
  await classroom.courses.courseWork.studentSubmissions.turnIn({courseId,courseWorkId,id:submissionId});
  return{status:"TURNED_IN"};
});

export const syncGrade=onCall({secrets:[CLIENT_ID,CLIENT_SECRET,OAUTH_REDIRECT]},async req=>{
  const uid=await requireTeacher(req),{courseId,courseWorkId,submissionId,grade,returnToStudent=true}=req.data||{},auth=await authorized(uid),classroom=google.classroom({version:"v1",auth});
  await classroom.courses.courseWork.studentSubmissions.patch({courseId,courseWorkId,id:submissionId,updateMask:"draftGrade,assignedGrade",requestBody:{draftGrade:grade,assignedGrade:grade}});
  if(returnToStudent)await classroom.courses.courseWork.studentSubmissions.return({courseId,courseWorkId,id:submissionId});
  return{status:"RETURNED",grade};
});
