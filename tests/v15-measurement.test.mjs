import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root=path.resolve("public/course");
const read=file=>fs.readFileSync(path.join(root,file),"utf8");

function measurementData(){
  const context={window:{},Date};
  vm.createContext(context);
  vm.runInContext(read("measurement-data.js"),context);
  return context.window.NEXUS_MEASUREMENT;
}

test("cinco instrumentos estudiantiles y cinco docentes cubren el semestre",()=>{
  const data=measurementData();
  assert.equal(data.version,"15.0");
  assert.equal(data.studentInstruments.length,5);
  assert.equal(data.teacherInstruments.length,5);
  assert.deepEqual(Array.from(data.studentInstruments,item=>item.openWeek),[1,4,8,12,15]);
  assert.deepEqual(Array.from(data.teacherInstruments,item=>item.openWeek),[1,4,8,12,15]);
  assert.ok(data.studentInstruments.every(item=>item.minutes>0&&item.questions.length>=5));
  assert.ok(data.teacherInstruments.every(item=>item.minutes>0&&item.questions.length>=5));
});

test("diagnóstico y cierre usan el mismo banco de doce conocimientos",()=>{
  const data=measurementData(),pre=data.byId("s_pre"),post=data.byId("s_post"),knowledge=instrument=>instrument.questions.filter(q=>q.dimension==="knowledge").map(q=>q.id);
  assert.equal(knowledge(pre).length,12);
  assert.deepEqual(Array.from(knowledge(pre)),Array.from(knowledge(post)));
  assert.equal(pre.questions[0].id,"consent");
  assert.doesNotMatch(read("measurement-data.js"),/correct\s*:/);
  assert.doesNotMatch(read("estudiante.html"),/measurement-scoring\.js/);
  assert.match(read("docente.html"),/measurement-scoring\.js/);
});

test("el calendario calcula la fase y bloquea aplicaciones fuera de periodo",()=>{
  const data=measurementData(),config={startDate:"2026-08-10"};
  assert.equal(data.currentWeek(config,new Date("2026-08-10T12:00:00")),1);
  assert.equal(data.currentWeek(config,new Date("2026-09-01T12:00:00")),4);
  const pulse=data.byId("s_w4");
  assert.equal(data.availability(pulse,4,false,false),"due");
  assert.equal(data.availability(pulse,3,false,false),"upcoming");
  assert.equal(data.availability(pulse,6,false,false),"closed");
  assert.equal(data.availability(pulse,4,true,false),"completed");
});

test("el estudiante recibe avisos, línea de tiempo y captura automática separada",()=>{
  const html=read("estudiante.html"),student=read("measurement-student.js"),css=read("measurement.css");
  assert.match(html,/data-measurement-nav/);
  assert.match(html,/Mi participación y encuestas/);
  assert.match(student,/measurement-due-banner/);
  assert.match(student,/Fases del semestre/);
  assert.match(student,/automaticSnapshot/);
  assert.match(student,/Dato automático/);
  assert.match(student,/no modifican la calificación/i);
  assert.match(css,/\.measurement-phase-grid/);
  assert.match(css,/\.measurement-dialog/);
});

test("Firestore guarda calendario e instrumentos con separación por rol",()=>{
  const platform=read("platform.js"),rules=fs.readFileSync("firestore.rules","utf8");
  for(const method of ["watchPilotConfig","savePilotConfig","saveStudentInstrumentResponse","watchMyStudentInstrumentResponses","saveTeacherInstrumentResponse","watchAllStudentInstrumentResponses","watchAllTeacherInstrumentResponses"])assert.match(platform,new RegExp(`function ${method}`));
  assert.match(rules,/match \/pilotConfig\/\{id\}/);
  assert.match(rules,/match \/studentInstrumentResponses\/\{uid\}/);
  assert.match(rules,/allow create,update: if owner\(uid\);/);
  assert.match(rules,/match \/teacherInstrumentResponses\/\{uid\}/);
  assert.match(rules,/allow read: if teacher\(\);/);
});

test("el tablero docente integra cobertura, pre post, experiencia y resultados docentes",()=>{
  const html=read("docente.html"),teacher=read("measurement-teacher.js");
  assert.match(html,/Medición y resultados/);
  for(const marker of ["measurementCoverage","measurementPrePost","measurementDimensions","measurementTeacherResults","measurementAutomatic"])assert.match(teacher,new RegExp(marker));
  assert.match(teacher,/scoreKnowledge/);
  assert.match(teacher,/participantes emparejados/);
  assert.match(teacher,/Exportar medición integrada/);
  assert.match(teacher,/seudonimizada/);
  assert.match(teacher,/No prueban causalidad/);
});

test("la versión 15 invalida caché y conserva los instrumentos como respaldo",()=>{
  const sw=read("sw.js"),version=read("version.js");
  assert.match(sw,/nexus-v15-medicion-semestral-integrada/);
  for(const file of ["measurement.css","measurement-data.js","measurement-student.js","measurement-teacher.js","measurement-scoring.js"])assert.match(sw,new RegExp(file.replace(".","\\.")));
  assert.match(version,/VERSION="15\.0"/);
  assert.match(sw,/encuesta_experiencia_estudiante_v12\.csv/);
  assert.match(sw,/evaluacion_modo_conduccion_v13\.xlsx/);
});
