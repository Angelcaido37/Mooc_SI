import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const ui=fs.readFileSync('public/course/traceability-teacher.js','utf8'),css=fs.readFileSync('public/course/styles.css','utf8'),back=fs.readFileSync('backend/app.py','utf8'),teacher=fs.readFileSync('public/course/teacher-app.js','utf8');
test('banner docente profesional',()=>{assert.match(teacher,/n19-dashboard-hero/);assert.match(teacher,/n19-dashboard-actions/);assert.match(css,/teacher-release-action/)});
test('formulario trazabilidad en grid y campos separados',()=>{assert.match(ui,/trace-evidence-form/);assert.match(ui,/trace-field-wide/);assert.match(css,/grid-template-columns:minmax\(0,1fr\) minmax\(0,1fr\)/)});
test('evidencia docente genera hash SHA-256 y versión',()=>{assert.match(back,/evidence_hash=hashlib\.sha256/);assert.match(back,/resource_version/);assert.match(ui,/evidenceHash/);assert.match(ui,/resourceVersion/)});
test('texto obsoleto de hash futuro eliminado',()=>assert.doesNotMatch(ui,/conviene añadir versión\/hash/));
