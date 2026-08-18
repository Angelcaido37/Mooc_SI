import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
test('NEXUS 16 academic depth and traceability are wired',()=>{
 const st=read('public/course/estudiante.html'), app=read('public/course/app.js'), evalmod=read('public/course/evaluation-module.js'), te=read('public/course/docente.html'), api=read('backend/app.py'), trace=read('public/course/traceability-data.js'), depth=read('public/course/academic-depth-data.js');
 assert.match(app,/APRENDER CON PROFUNDIDAD/);assert.match(evalmod,/Mis constancias académicas/);assert.match(te,/Manual docente/);assert.match(te,/Trazabilidad docente/);
 assert.match(api,/\/api\/acknowledgements/);assert.match(api,/\/api\/teacher\/traceability/);assert.match(api,/practice_evidence/);
 assert.match(trace,/"id": 20/);assert.match(trace,/Explicación clara del programa/);assert.match(depth,/transfer/);assert.match(depth,/remediation/);
});
