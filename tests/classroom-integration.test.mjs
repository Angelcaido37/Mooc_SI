import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root=path.resolve("public/course");
const read=file=>fs.readFileSync(path.join(root,file),"utf8");

test("el backend publica tareas reales con autorización docente",()=>{
  const functions=fs.readFileSync("functions/index.js","utf8");
  for(const exported of ["startClassroomOAuth","classroomOAuthCallback","classroomConnectionStatus","listClassroomCourses","createCoursework","disconnectClassroom"]){
    assert.match(functions,new RegExp(`export const ${exported}`));
  }
  assert.match(functions,/classroom\.courses\.readonly/);
  assert.match(functions,/classroom\.coursework\.students/);
  assert.match(functions,/requireTeacher\(req\)/);
  assert.match(functions,/workType:"ASSIGNMENT"/);
  assert.match(functions,/state:"PUBLISHED"/);
  assert.match(functions,/assigneeMode:"ALL_STUDENTS"/);
  assert.match(functions,/classroomAssignments\/\$\{data\.id\}/);
});

test("los tokens OAuth permanecen fuera del cliente",()=>{
  const functions=fs.readFileSync("functions/index.js","utf8"),rules=fs.readFileSync("firestore.rules","utf8");
  assert.match(functions,/classroomTokens\/\$\{uid\}/);
  assert.match(functions,/defineSecret\("GOOGLE_OAUTH_CLIENT_ID"\)/);
  assert.match(functions,/defineSecret\("GOOGLE_OAUTH_CLIENT_SECRET"\)/);
  assert.match(functions,/defineSecret\("GOOGLE_OAUTH_REDIRECT_URI"\)/);
  assert.match(rules,/match \/classroomTokens\/\{uid\} \{ allow read,write: if false; \}/);
  assert.match(rules,/match \/oauthStates\/\{id\} \{ allow read,write: if false; \}/);
});

test("el portal docente conecta, prepara y confirma la publicación",()=>{
  const html=read("docente.html"),module=read("classroom-teacher.js"),platform=read("platform.js");
  assert.match(html,/data-teacher-nav="classroom"/);
  assert.match(html,/classroom\.css\?v=prod1/);
  assert.match(html,/classroom-teacher\.js\?v=prod1/);
  for(const marker of ["data-classroom-connect","name=\"courseId\"","name=\"sessionId\"","name=\"dueDate\"","name=\"dueTime\"","name=\"confirmed\"","Publicar actividad en Classroom"]){
    assert.match(module,new RegExp(marker));
  }
  assert.match(module,/NEXUS_AUTH\.listClassroomCourses/);
  assert.match(module,/NEXUS_AUTH\.publishClassroomAssignment/);
  assert.match(platform,/httpsCallable\(functions,name\)/);
});

test("el cierre de clase enlaza directamente con Classroom",()=>{
  const conductor=read("teacher-conductor.js"),teacher=read("teacher-app.js");
  assert.match(conductor,/data-classroom-session/);
  assert.match(conductor,/Publicar actividad en Classroom/);
  assert.match(teacher,/Actividad posterior lista para Classroom/);
  assert.match(teacher,/Publicar esta actividad en Classroom/);
  assert.match(teacher,/NEXUS_CLASSROOM\?\.view/);
});

test("el estudiante recibe las tareas sin capturar identificadores técnicos",()=>{
  const html=read("estudiante.html"),app=read("app.js"),cloud=read("student-cloud.js");
  assert.match(html,/data-nav="classroom"/);
  assert.match(html,/Tareas en Classroom/);
  assert.doesNotMatch(html,/courseWorkId|submissionId|evidenceUpload/);
  assert.match(app,/function classroomStudent/);
  assert.match(app,/Abrir y entregar en Classroom/);
  assert.match(cloud,/watchClassroomAssignments/);
  assert.match(cloud,/NEXUS_CLASSROOM_ASSIGNMENTS/);
});

test("Firestore expone sólo publicaciones y reserva las escrituras al servidor",()=>{
  const rules=fs.readFileSync("firestore.rules","utf8"),platform=read("platform.js");
  assert.match(rules,/match \/classroomAssignments\/\{id\}/);
  assert.match(rules,/resource\.data\.state == 'PUBLISHED'/);
  assert.match(rules,/allow write: if false/);
  assert.match(platform,/where\("state","==","PUBLISHED"\)/);
  assert.match(platform,/where\("creatorUid","==",currentUser\.uid\)/);
});

test("Classroom está habilitado y disponible en la caché académica",()=>{
  const config=read("firebase-config.js"),sw=read("sw.js");
  assert.match(config,/classroomEnabled:true/);
  assert.match(config,/storageEnabled:false/);
  assert.match(sw,/nexus-plataforma-academica-classroom-produccion-r1/);
  assert.match(sw,/classroom\.css/);
  assert.match(sw,/classroom-teacher\.js/);
});

test("los portales presentan una identidad académica final",()=>{
  const html=`${read("docente.html")}\n${read("estudiante.html")}`,teacher=read("teacher-app.js"),measurement=read("measurement-student.js");
  assert.match(html,/Plataforma académica/);
  assert.match(html,/Curso activo/);
  assert.doesNotMatch(html,/v15\.2 ·|Vista de revisión|modo demostración/i);
  assert.doesNotMatch(teacher,/PILOTO SEMESTRAL/);
  assert.doesNotMatch(measurement,/PILOTO UNIVERSITARIO/);
});
