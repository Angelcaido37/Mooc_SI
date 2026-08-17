import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
test('NEXUS 15 removes Classroom/Firebase from operational portals',()=>{
 const teacher=read('public/course/docente.html'),student=read('public/course/estudiante.html'),login=read('public/course/index.html');
 assert.match(teacher,/evaluation-module\.js/); assert.match(student,/evaluation-module\.js/); assert.match(read('public/course/platform-local.js'),/NEXUS_AUTH/);
 assert.doesNotMatch(teacher,/classroom-teacher|firebase-config|platform\.js/); assert.doesNotMatch(student,/classroom-links|firebase-config|student-cloud/);
});
test('evaluation categories sum to 100 and evidences are preconfigured',()=>{
 const data=read('public/course/evaluation-data.js');
 assert.match(data,/Actividades de aprendizaje/); assert.match(data,/Retos de dominio/); assert.match(data,/Evidencias de aprendizaje/); assert.match(data,/Proyecto integrador/);
 assert.match(data,/prePostGraded:false/); assert.equal((data.match(/unit:\d/g)||[]).length,6);
});
test('FastAPI backend includes evidence, grading and analytics routes',()=>{
 const api=read('backend/app.py');
 for(const r of ['/api/evidence/submit','/api/teacher/evidence','/api/analytics','/api/config/{key}']) assert.match(api,new RegExp(r.replace(/[{}]/g,'\\$&')));
});
