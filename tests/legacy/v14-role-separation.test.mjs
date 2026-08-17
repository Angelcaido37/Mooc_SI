import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root=path.resolve("public/course");
const read=file=>fs.readFileSync(path.join(root,file),"utf8");

test("el mapa de sesiones muestra sólo la ruta del estudiante",()=>{
  const app=read("app.js"),html=read("estudiante.html");
  assert.match(app,/RUTA DEL ESTUDIANTE/);
  assert.match(app,/studentSessionResources/);
  assert.match(app,/Ver lámina visual/);
  assert.match(app,/Explicación completa/);
  assert.match(app,/Vista exclusiva para estudiantes/);
  assert.doesNotMatch(app,/teacherChecklist|Guion proyectable de 100 minutos|T\.roles\.teacher|Abrir guion/);
  assert.doesNotMatch(html,/teacher-detail-data\.js/);
});

test("la tabla de posiciones es visible desde menú e inicio",()=>{
  const html=read("estudiante.html"),pilot=read("pilot.js");
  assert.match(html,/data-nav="leaderboard"[^>]*>[\s\S]*?Tabla de posiciones/);
  assert.match(pilot,/Ver tabla de posiciones/);
  assert.match(pilot,/Tabla de posiciones semanal/);
  assert.match(pilot,/leader-board-head/);
  assert.match(pilot,/function leaderboardError/);
});

test("el módulo docente presenta identidad académica de producción",()=>{
  const html=read("docente.html"),teacher=read("teacher-app.js"),conductor=read("teacher-conductor.js");
  assert.match(html,/Plataforma académica/);
  assert.match(html,/data-teacher-nav="conductor"/);
  assert.match(teacher,/EVALUACIÓN SEMESTRAL/);
  assert.match(teacher,/Medición y resultados/);
  assert.match(conductor,/Plan B sin conexión/);
});

test("la publicación de producción reemplaza cachés anteriores",()=>{
  const sw=read("sw.js"),version=read("version.js"),student=read("estudiante.html"),teacher=read("docente.html"),login=read("index.html");
  assert.match(sw,/nexus-plataforma-academica-classroom-produccion-r1/);
  assert.match(sw,/skipWaiting/);
  assert.match(sw,/clients\.claim/);
  assert.match(sw,/version\.js/);
  assert.match(version,/updateViaCache:"none"/);
  for(const html of [student,teacher,login])assert.match(html,/version\.js\?v=15/);
});
