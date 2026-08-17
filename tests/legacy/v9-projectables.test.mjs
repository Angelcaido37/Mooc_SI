import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root=path.resolve("public/course");
const read=file=>fs.readFileSync(path.join(root,file),"utf8");
const context={window:{}};
vm.createContext(context);
for(const file of ["course-data.js","teaching-data.js","teacher-detail-data.js"]){
  vm.runInContext(read(file),context);
}
const sessions=context.window.NEXUS_TEACHER_DETAIL.sessions;
const kinds=["cover","question","explanation","concepts","process","case","challenge","criteria","summary"];

test("las 26 sesiones generan 234 diapositivas explicativas",()=>{
  assert.equal(sessions.length,26);
  assert.equal(sessions.flatMap(s=>s.projectable).length,234);
  for(const s of sessions){
    assert.equal(s.projectable.length,9,`sesión ${s.number}`);
    assert.deepEqual(Array.from(s.projectable,d=>d.kind),kinds,`sesión ${s.number}`);
  }
});

test("la presentación contiene explicación, conceptos, proceso y ejemplo desarrollados",()=>{
  for(const s of sessions){
    const byKind=Object.fromEntries(s.projectable.map(d=>[d.kind,d]));
    assert.ok(byKind.explanation.lead.length>80,`sesión ${s.number}: explicación`);
    assert.ok(byKind.explanation.items.length>=2,`sesión ${s.number}: ampliación`);
    assert.ok(byKind.concepts.items.length>=3,`sesión ${s.number}: conceptos`);
    assert.ok(byKind.process.items.length>=3,`sesión ${s.number}: proceso`);
    assert.ok(byKind.case.lead.length>80,`sesión ${s.number}: caso razonado`);
    assert.ok(byKind.case.takeaway.length>25,`sesión ${s.number}: conclusión`);
    assert.ok(byKind.criteria.items.length===4,`sesión ${s.number}: criterios`);
    assert.ok(byKind.summary.items.length>=3,`sesión ${s.number}: síntesis`);
  }
});

test("el guion docente no se usa como contenido proyectado",()=>{
  const app=read("teacher-app.js");
  assert.match(app,/const deck=s\.projectable\|\|\[\]/);
  assert.doesNotMatch(app,/const deck=\[\[s\.title,s\.objective\]/);
  for(const s of sessions){
    const explanatory=s.projectable.filter(d=>!["question","challenge"].includes(d.kind));
    const visible=JSON.stringify(explanatory);
    assert.doesNotMatch(visible,/\b(?:Explique|Pregunte|Presente|Proyecte|Conceda|Solicite|Organice|Recupere)\b/i,`sesión ${s.number}`);
  }
});

test("el modo proyección declara estructura visual completa",()=>{
  const app=read("teacher-app.js"),css=read("v4.css");
  for(const marker of ["projector-explanation","projector-card-grid","projector-flow","projector-case","projector-challenge","projector-criteria","projector-summary"]){
    assert.match(app+css,new RegExp(marker));
  }
  assert.match(app,/Presentaciones explicativas para el grupo/);
});
