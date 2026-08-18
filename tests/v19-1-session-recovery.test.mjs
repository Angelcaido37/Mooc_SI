import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const platform=fs.readFileSync('public/course/platform-local.js','utf8');
const teacher=fs.readFileSync('public/course/teacher-app.js','utf8');
const measurement=fs.readFileSync('public/course/measurement-teacher.js','utf8');
const index=fs.readFileSync('public/course/index.html','utf8');

test('401 invalida token local y emite sessionExpired',()=>{
  assert.match(platform,/r\.status===401/);
  assert.match(platform,/invalidateLocalSession/);
  assert.match(platform,/sessionExpired:true/);
  assert.match(platform,/removeItem\('nexus18-token'\)/);
});
test('portal docente muestra recuperación amigable de sesión',()=>{
  assert.match(teacher,/sessionExpired/);
  assert.match(teacher,/servidor fue actualizado/);
});
test('medición no presenta Sesión inválida como fallo académico',()=>{
  assert.match(measurement,/sesión \(inválida\|expirada\|requerida\)/i);
});
test('login explica sesión expirada',()=>{
  assert.match(index,/sesion/);
  assert.match(index,/Inicia sesión nuevamente/);
});
