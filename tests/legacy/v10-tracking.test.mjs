import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root=path.resolve("public/course");
const read=file=>fs.readFileSync(path.join(root,file),"utf8");

test("el primer acceso y la navegación registran ubicación académica",()=>{
  const platform=read("platform.js"),student=read("student-cloud.js");
  assert.match(platform,/async function recordActivity/);
  assert.match(platform,/currentLocation/);
  assert.match(platform,/lastActivityAt:api\.serverTimestamp\(\)/);
  assert.match(student,/recordCurrent\(["']access["']\)/);
  assert.match(student,/addEventListener\(["']hashchange["']/);
  assert.match(student,/Misión \$\{hit\.u\.number\}/);
});

test("el panel docente escucha usuarios y progreso en tiempo real",()=>{
  const platform=read("platform.js"),teacher=read("teacher-app.js");
  assert.match(platform,/function watchTeacherTracking/);
  assert.match(platform,/onSnapshot\(api\.collection\(db,"users"\)/);
  assert.match(platform,/onSnapshot\(api\.collection\(db,"progress"\)/);
  assert.match(teacher,/NEXUS_AUTH\.watchTeacherTracking/);
  assert.match(teacher,/id="trackingRows"/);
  assert.doesNotMatch(teacher,/<td>Sin registros todavía<\/td>/);
});

test("laboratorios abiertos y evidencias se registran sin confundirlos con avance",()=>{
  const platform=read("platform.js"),student=read("student-cloud.js"),teacher=read("teacher-app.js");
  assert.match(platform,/labsOpened:api\.arrayUnion/);
  assert.match(platform,/evidences:api\.arrayUnion/);
  assert.match(student,/a\[href\*="laboratorios\/"\]/);
  assert.match(teacher,/realizados/);
  assert.match(teacher,/técnicos abiertos/);
});

test("el service worker identifica la plataforma académica de producción",()=>{
  assert.match(read("sw.js"),/nexus-plataforma-academica-classroom-produccion-r1/);
  assert.match(read("sw.js"),/tracking\.css/);
});
