import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const html=fs.readFileSync('public/course/index.html','utf8'),css=fs.readFileSync('public/course/login.css','utf8'),backend=fs.readFileSync('backend/app.py','utf8');
test('NEXUS 18.1 login separa estudiante y docente',()=>{assert.match(html,/data-role="student"/);assert.match(html,/data-role="teacher"/);assert.match(html,/studentFields/);assert.match(html,/teacherFields/)});
test('login ya no expone texto técnico heredado',()=>{assert.doesNotMatch(html,/FastAPI \+ SQLite|Firebase, Google Cloud|Classroom/)});
test('privacidad es dinámica por rol',()=>{assert.match(html,/privacyCheck\.required=!teacher/);assert.match(html,/password\.required=teacher/)});
test('diseño responsive y accesible',()=>{assert.match(css,/@media\(max-width:560px\)/);assert.match(html,/aria-pressed/);assert.match(html,/aria-live="polite"/)});
test('backend identifica versión vigente y Render',()=>{assert.match(backend,/NEXUS 19/);assert.match(backend,/GitHub Pages \+ Render/)});
