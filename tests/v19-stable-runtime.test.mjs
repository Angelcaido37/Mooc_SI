import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const api=fs.readFileSync('backend/app.py','utf8');
const platform=fs.readFileSync('public/course/platform-local.js','utf8');
const evalmod=fs.readFileSync('public/course/evaluation-module.js','utf8');
const traceS=fs.readFileSync('public/course/traceability-student.js','utf8');
const traceT=fs.readFileSync('public/course/traceability-teacher.js','utf8');
const student=fs.readFileSync('public/course/student-local.js','utf8');

test('sesiones firmadas no dependen de tabla efímera',()=>{assert.match(api,/issue_token/);assert.match(api,/hmac\.compare_digest/);assert.doesNotMatch(api,/JOIN users u ON u\.uid=s\.uid WHERE s\.token/)});
test('backend soporta PostgreSQL persistente por DATABASE_URL',()=>{assert.match(api,/DATABASE_URL/);assert.match(api,/USE_POSTGRES/);assert.match(api,/psycopg\.connect/);assert.match(api,/productionReady/)});
test('archivos de evidencia pueden persistir en base de datos',()=>{assert.match(api,/file_blob/);assert.match(api,/file_sha256/);assert.match(api,/hashlib\.sha256\(blob\)/)});
test('frontend no usa rutas API del origen GitHub Pages',()=>{assert.doesNotMatch(evalmod,/fetch\(['"]\/api\//);assert.doesNotMatch(traceS,/api\(['"]\/api\//);assert.doesNotMatch(traceT,/api\(['"]\/api\//)});
test('tabla de posiciones tiene endpoint apto para estudiante',()=>{assert.match(api,/@app\.get\('\/api\/leaderboard'\)/);assert.match(platform,/request\('\/leaderboard'\)/)});
test('descarga de evidencia usa API remota y Authorization',()=>{assert.match(platform,/downloadEvidenceFile/);assert.match(platform,/headers\(false\)/);assert.match(evalmod,/downloadEvidenceFile/)});
test('vista docente en portal estudiante no guarda progreso como estudiante',()=>{assert.match(student,/NEXUS_AUTH\.role==='student'/)});
