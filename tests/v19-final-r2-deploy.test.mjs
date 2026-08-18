import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const st=fs.readFileSync('public/course/estudiante.html','utf8');
const te=fs.readFileSync('public/course/docente.html','utf8');
const be=fs.readFileSync('backend/app.py','utf8');
const sw=fs.readFileSync('public/course/sw.js','utf8');
test('R2 hace mensajería visible en ambos portales',()=>{assert.match(st,/data-nav="messages"/);assert.match(st,/studentMessagesBtn/);assert.match(te,/data-teacher-nav="communication"/)});
test('R2 deja marcador de versión verificable',()=>{assert.match(st,/FINAL R2/);assert.match(te,/FINAL R2/);assert.match(be,/19-final-r2/);assert.match(sw,/nexus-19-final-r2/);assert.ok(fs.existsSync('public/course/verificar-despliegue.html'));assert.ok(fs.existsSync('public/course/release.json'))});
