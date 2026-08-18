import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const legacy=fs.readFileSync('public/course/student.html','utf8');
const local=fs.readFileSync('public/course/student-local.js','utf8');
const teacher=fs.readFileSync('public/course/docente.html','utf8');
const sw=fs.readFileSync('public/course/sw.js','utf8');

test('student.html heredado redirige al portal vigente',()=>{
  assert.match(legacy,/estudiante\.html/);
});
test('portal estudiante revalida sesión al cargar',()=>{
  assert.match(local,/bootStudentAccess/);
  assert.match(local,/NEXUS_AUTH\?\.init/);
});
test('portal docente enlaza al estudiante vigente',()=>{
  assert.match(teacher,/href="estudiante\.html"/);
  assert.doesNotMatch(teacher,/href="student\.html"/);
});
test('service worker invalida caché y contempla alias heredado',()=>{
  assert.match(sw,/nexus-19-final-r2/);
  assert.match(sw,/student\.html/);
});
