import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function load(files){
  const store=new Map();
  const context={console,window:null,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)}};
  context.window=context;
  vm.createContext(context);
  for(const f of files)vm.runInContext(fs.readFileSync(f,'utf8'),context,{filename:f});
  return context;
}

test('NEXUS 19 aprovisiona las 26 sesiones en runtime',()=>{
  const x=load(['public/course/course-data.js','public/course/teaching-data.js','public/course/teacher-detail-data.js','public/course/academic-depth-data.js','public/course/nexus19-pedagogy.js']);
  assert.equal(x.NEXUS19_PEDAGOGY.sessions.length,26);
  for(const s of x.NEXUS19_PEDAGOGY.sessions){
    assert.equal(s.projectable.length,13,`deck ${s.id}`);
    assert.ok(s.n19.technique?.name,`technique ${s.id}`);
    assert.ok(s.n19.activity?.type,`activity ${s.id}`);
    assert.ok(s.n19.reading?.paras?.length>=5,`reading ${s.id}`);
    assert.equal(s.teacherScript.length,6);
    assert.ok(s.teacherScript.every(p=>p.n19Actions?.length>=2),`actions ${s.id}`);
  }
});

test('los 26 interactivos pueden renderizarse sin exponer soluciones docentes',()=>{
  const x=load(['public/course/course-data.js','public/course/teaching-data.js','public/course/teacher-detail-data.js','public/course/academic-depth-data.js','public/course/nexus19-pedagogy.js','public/course/nexus19-activities.js']);
  for(const s of x.NEXUS19_PEDAGOGY.sessions){
    const html=x.NEXUS19_ACTIVITY.view(s.id,{teacher:false});
    assert.match(html,/n19-activity/);
    assert.doesNotMatch(html,/SOLO DOCENTE|Cómo intervenir y retroalimentar/);
  }
});
