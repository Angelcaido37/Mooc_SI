import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root=path.resolve("public/course");
const read=file=>fs.readFileSync(path.join(root,file),"utf8");

test("la narrativa conecta seis misiones con un conflicto y desenlace",()=>{
  const context={window:{}};vm.createContext(context);vm.runInContext(read("pilot-data.js"),context);
  const data=context.window.NEXUS_PILOT_DATA;
  assert.equal(data.chapters.length,6);
  assert.ok(data.story.premise.length>100);
  assert.ok(data.story.finale.length>80);
  for(const chapter of data.chapters){assert.ok(chapter.problem);assert.ok(chapter.mission);assert.ok(chapter.success);}
  assert.match(read("app.js"),/type==="story"/);
});

test("cómo jugar centraliza reglas y conserva la evaluación oficial",()=>{
  const data=read("pilot-data.js"),pilot=read("pilot.js"),html=read("estudiante.html");
  assert.match(data,/Competencia voluntaria/);
  assert.match(data,/La evidencia decide/);
  assert.match(pilot,/Cómo jugar NEXUS/);
  assert.match(html,/id="pilotOnboarding"/);
  assert.match(html,/data-nav="how"/);
});

test("las metas semanales y los desbloqueos dependen del progreso",()=>{
  const pilot=read("pilot.js"),css=read("pilot.css");
  assert.match(pilot,/weeklyGoal/);
  assert.match(pilot,/lessonsTarget/);
  assert.match(pilot,/bonusTarget/);
  assert.match(pilot,/goalWeeksCompleted/);
  assert.match(pilot,/levelRewards/);
  assert.match(css,/data-pilot-level/);
});

test("la clasificación es voluntaria, seudónima, semanal y no académica",()=>{
  const pilot=read("pilot.js"),platform=read("platform.js"),rules=fs.readFileSync("firestore.rules","utf8");
  assert.match(pilot,/Acepto aparecer mediante mi alias/);
  assert.match(pilot,/Sin efecto en calificación/);
  assert.match(pilot,/weeklyScore/);
  assert.match(platform,/saveLeaderboard/);
  assert.match(platform,/removeLeaderboard/);
  assert.match(rules,/match \/leaderboard\/\{uid\}/);
  assert.match(rules,/hasOnly\(\['alias','team','avatar'/);
  assert.doesNotMatch(rules,/leaderboard[\s\S]{0,500}email/);
});

test("los retos explican el criterio antes de continuar",()=>{
  const arcade=read("arcade.js");
  assert.match(arcade,/function speedFeedback/);
  assert.match(arcade,/q\.f/);
  assert.match(arcade,/La reparación no es válida/);
  assert.match(arcade,/una IA responsable no adivina, oculta ni actúa sin límites/);
});

test("el portal docente mide estudiantes y su propia utilidad",()=>{
  const teacher=read("teacher-app.js"),platform=read("platform.js"),html=read("docente.html");
  assert.match(html,/data-teacher-nav="analytics"/);
  assert.match(teacher,/Analítica pedagógica de NEXUS/);
  assert.match(teacher,/activeSeconds/);
  assert.match(teacher,/quizAttempts/);
  assert.match(teacher,/Estudiantes que podrían requerir acompañamiento/);
  assert.match(teacher,/Minutos que estimas haber ahorrado/);
  assert.match(teacher,/Exportar datos seudonimizados/);
  assert.match(platform,/recordTeacherUsage/);
  assert.match(platform,/saveTeacherReflection/);
});

test("la versión piloto funciona sin conexión",()=>{
  const sw=read("sw.js");
  assert.match(sw,/nexus-v(?:12-piloto-semestral-analitica|13-modo-conduccion-docente)/);
  for(const file of ["pilot.css","pilot-data.js","pilot.js"])assert.match(sw,new RegExp(file.replace(".","\\.")));
});
