import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root=path.resolve("public/course");
const read=file=>fs.readFileSync(path.join(root,file),"utf8");

test("las 26 sesiones incluyen microplaneación operativa y plan alternativo",()=>{
  const context={window:{}};
  vm.createContext(context);
  for(const file of ["course-data.js","teaching-data.js","teacher-detail-data.js"])vm.runInContext(read(file),context);
  const sessions=context.window.NEXUS_TEACHER_DETAIL.sessions;
  assert.equal(sessions.length,26);
  for(const session of sessions){
    assert.equal(session.teacherScript.length,6);
    assert.equal(session.teacherScript.reduce((sum,phase)=>sum+phase.minutes,0),100);
    assert.equal(session.resources.length,5);
    for(const phase of session.teacherScript){
      assert.ok(phase.teacher.length>80);
      assert.ok(phase.expected.length>=2);
      assert.ok(phase.fallback.length>80);
      assert.ok(phase.transition.length>50);
    }
  }
});

test("el portal docente ofrece el Modo Conducción como ruta principal",()=>{
  const html=read("docente.html"),teacher=read("teacher-app.js"),conductor=read("teacher-conductor.js"),css=read("conductor.css");
  assert.match(html,/data-teacher-nav="conductor"/);
  assert.match(html,/teacher-conductor\.js/);
  assert.match(html,/conductor\.css/);
  assert.match(teacher,/NEXUS_CONDUCTOR\.view/);
  assert.match(teacher,/NEXUS_CONDUCTOR\.bind/);
  assert.match(conductor,/data-timer-toggle/);
  assert.match(conductor,/data-adjust="-5"/);
  assert.match(conductor,/Plan B sin conexión/);
  assert.match(conductor,/data-finish-session/);
  assert.match(conductor,/Descargar bitácora/);
  assert.match(css,/conductor-phase-strip/);
});

test("la bitácora se sincroniza sólo para la cuenta docente propietaria",()=>{
  const platform=read("platform.js"),rules=fs.readFileSync("firestore.rules","utf8");
  assert.match(platform,/saveTeacherSessionLog/);
  assert.match(platform,/loadTeacherSessionLog/);
  assert.match(platform,/watchTeacherSessionLogs/);
  assert.match(platform,/recordTeacherConductorEvent/);
  assert.match(rules,/match \/teacherSessionLogs\/\{uid\}\/sessions\/\{sessionId\}/);
  assert.match(rules,/owner\(uid\) && teacher\(\)/);
});

test("la analítica y los instrumentos integrados permiten evaluar el modo durante el semestre",()=>{
  const teacher=read("teacher-app.js"),sw=read("sw.js"),measurement=read("measurement-data.js");
  assert.match(teacher,/conductorPlanBUses/);
  assert.match(teacher,/exportConductorLogs/);
  assert.match(measurement,/t_w8/);
  assert.match(measurement,/Modo Conducción/);
  assert.doesNotMatch(teacher,/evaluacion_modo_conduccion_v13\.xlsx/);
  assert.match(sw,/nexus-plataforma-academica-classroom-produccion-r1/);
  assert.match(sw,/teacher-conductor\.js/);
  assert.doesNotMatch(sw,/evaluacion_modo_conduccion_v13\.xlsx/);
  assert.ok(fs.statSync("instrumentos/evaluacion_modo_conduccion_v13.xlsx").size>8000);
});
