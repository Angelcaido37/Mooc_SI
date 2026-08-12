import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root=process.cwd();
const courseRoot=path.join(root,"public/course");
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(courseRoot,"course-data.js"),"utf8"),sandbox);
vm.runInNewContext(fs.readFileSync(path.join(courseRoot,"teaching-data.js"),"utf8"),sandbox);
vm.runInNewContext(fs.readFileSync(path.join(courseRoot,"teacher-detail-data.js"),"utf8"),sandbox);
vm.runInNewContext(fs.readFileSync(path.join(courseRoot,"game-data.js"),"utf8"),sandbox);
const C=sandbox.window.NEXUS_COURSE;
const T=sandbox.window.NEXUS_TEACHING;
const D=sandbox.window.NEXUS_TEACHER_DETAIL;
const G=sandbox.window.NEXUS_GAMES;

test("estructura curricular oficial completa",()=>{
  assert.equal(C.units.length,6);
  assert.equal(C.units.flatMap(u=>u.lessons).length,30);
  assert.equal(C.units.reduce((s,u)=>s+u.weight,0),100);
  assert.equal(C.units.reduce((s,u)=>s+u.xp,0),1000);
  assert.deepEqual([C.meta.theory,C.meta.practice,C.meta.independent,C.meta.hours],[22,30,44,96]);
});

test("26 sesiones separan conduccion docente y trabajo independiente",()=>{
  assert.equal(T.sessions.length,26);
  assert.equal(T.sessions.reduce((s,x)=>s+x.theoryMinutes,0),1100);
  assert.equal(T.sessions.reduce((s,x)=>s+x.practiceMinutes,0),1500);
  assert.equal(T.sessions.reduce((s,x)=>s+x.independentMinutes,0),2640);
  for(const s of T.sessions){
    assert.equal(s.timeline.reduce((n,x)=>n+x[1],0),100);
    assert.equal(s.independent.reduce((n,x)=>n+x[1],0),s.independentMinutes);
    assert.ok(s.explanation.length>=3);
    assert.ok(s.guided&&s.product&&s.game&&s.lab);
  }
});

test("portal docente contiene guion pedagogico detallado para las 26 sesiones",()=>{
  assert.equal(D.sessions.length,26);
  for(const s of D.sessions){
    assert.equal(s.teacherScript.reduce((n,p)=>n+p.minutes,0),100);
    assert.equal(s.teacherScript.length,6);
    for(const p of s.teacherScript){
      assert.ok(p.teacher.length>100);
      assert.ok(p.student&&p.expected.length>=2&&p.intervene&&p.resource&&p.check);
    }
    assert.equal(s.independentDetailed.reduce((n,x)=>n+x.min,0),s.independentMinutes);
    assert.ok(s.classroomText.length>200);
  }
  assert.equal(D.sessions[0].firstCases.length,8);
});

test("juegos y laboratorio low no-code tienen contenido suficiente",()=>{
  assert.equal(G.catalog.length,6);
  assert.ok(G.jeopardy.length>=15);
  assert.ok(G.memory.length>=12);
  assert.ok(G.qa.length>=10);
  assert.ok(G.wordsearch.length>=12);
  assert.ok(G.lowCode.blocks.length>=8);
  assert.deepEqual(Object.keys(G.lowCode.scenarios),["rag","agent","decision"]);
});

test("cada leccion incluye enseñanza practica evaluacion y microleccion",()=>{
  for(const u of C.units) for(const l of u.lessons){
    assert.ok(l.title&&l.objective&&l.example&&l.practice);
    assert.ok(l.theory.length>=3);
    assert.ok(l.video.length>=3);
    assert.equal(l.check.o.length,4);
    assert.ok(Number.isInteger(l.check.a)&&l.check.a>=0&&l.check.a<4);
    assert.ok(l.check.f.length>30);
  }
});

test("materiales descargables y archivos web presentes",()=>{
  for(const file of ["index.html","estudiante.html","docente.html","styles.css","portal.css","app.js","teacher-app.js","course-data.js","teaching-data.js","teacher-detail-data.js","game-data.js","firebase-config.js","platform.js","manifest.webmanifest","sw.js"])
    assert.ok(fs.existsSync(path.join(courseRoot,file)),file);
  for(const file of ["unidad-1-fundamentos.pdf","unidad-2-conocimiento.pdf","unidad-3-decision.pdf","unidad-4-percepcion.pdf","unidad-5-generativa-y-rag.pdf","unidad-6-integracion.pdf"])
    assert.ok(fs.statSync(path.join(courseRoot,"materiales",file)).size>10000,file);
  for(const file of ["u1_lienzo_peas.csv","u2_traza_razonamiento.csv","u3_politica_umbral.csv","u4_matriz_percepcion.csv","u5_evaluacion_rag.csv","u6_matriz_pruebas.csv","bitacora_proyecto.csv"])
    assert.ok(fs.statSync(path.join(courseRoot,"plantillas",file)).size>100,file);
});

test("banco docente contiene 60 reactivos",()=>{
  const lines=fs.readFileSync(path.join(root,"docente/BANCO_PREGUNTAS.csv"),"utf8").trim().split(/\r?\n/);
  assert.equal(lines.length,61);
});

test("no quedan marcadores de contenido",()=>{
  const combined=["index.html","app.js","course-data.js"].map(f=>fs.readFileSync(path.join(courseRoot,f),"utf8")).join("\n");
  assert.doesNotMatch(combined,/lorem ipsum|starter project|contenido pendiente/i);
  assert.doesNotMatch(combined,/\bTODO\b/);
});
