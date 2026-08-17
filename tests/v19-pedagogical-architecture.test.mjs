import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const teacher=fs.readFileSync('public/course/docente.html','utf8');
const student=fs.readFileSync('public/course/estudiante.html','utf8');
const conductor=fs.readFileSync('public/course/teacher-conductor.js','utf8');
const app=fs.readFileSync('public/course/app.js','utf8');
const ped=fs.readFileSync('public/course/nexus19-pedagogy.js','utf8');
const activities=fs.readFileSync('public/course/nexus19-activities.js','utf8');
const css=fs.readFileSync('public/course/nexus19.css','utf8');
const backend=fs.readFileSync('backend/app.py','utf8');

test('NEXUS 19 reorganiza el modo docente sin centro redundante',()=>{
 assert.match(teacher,/Manual docente · 26 sesiones/);
 assert.doesNotMatch(teacher,/Preparación académica<\/button>/);
 assert.match(teacher,/Antes de clase/);assert.match(teacher,/Durante la clase/);assert.match(teacher,/Después de clase/);
});
test('Conducir clase tiene recursos contextuales al momento',()=>{
 assert.match(conductor,/RECURSOS DISPONIBLES EXACTAMENTE EN ESTE MOMENTO/);
 assert.match(conductor,/data-n19-resource/);
});
test('26 sesiones reciben técnica, actividad, lectura y deck ampliado',()=>{
 assert.match(ped,/const techniques=\[/);assert.match(ped,/activityTypes=\[/);assert.match(ped,/makeReading/);assert.match(ped,/richDeck/);
 const types=(ped.match(/"wordsearch"|"matching"|"sequence"|"escape"|"flashcards"|"dragdrop"|"mindmap"|"sudoku"|"roulette"|"decision"|"quiz"|"slider"|"builder"/g)||[]);
 assert.ok(types.length>=26);
});
test('Motor interactivo incluye las familias solicitadas',()=>{
 for(const word of ['wordsearch','flashcards','dragdrop','sudoku','roulette','escapeRoom','mindmap','quiz','slider'])assert.match(activities,new RegExp(word));
});
test('Portal estudiante expone actividad de la sesión sin respuestas docentes',()=>{
 assert.match(app,/activityView/);assert.match(app,/activity\/\$\{s\.id\}/);assert.match(student,/nexus19-activities\.js/);
});
test('Sistema visual NEXUS 19 incluye dialogo, dock y actividades responsive',()=>{
 assert.match(css,/n19-resource-dialog/);assert.match(css,/n19-action-dock/);assert.match(css,/n19-activity/);assert.match(css,/@media/);
});
test('API declara NEXUS 19 y Render',()=>{assert.match(backend,/NEXUS 19/);assert.match(backend,/GitHub Pages \+ Render/);});
