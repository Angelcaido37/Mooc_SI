import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root=path.resolve("public/course");
const read=file=>fs.readFileSync(path.join(root,file),"utf8");

test("las insignias separan icono, nombre, significado y estado",()=>{
  const app=read("app.js"),css=read("arcade.css");
  for(const marker of ["badge-name","badge-desc","badge-status"])assert.match(app,new RegExp(marker));
  assert.match(css,/\.badge \.badge-name/);
  assert.match(css,/\.badge \.badge-desc/);
  assert.match(app,/Insignias automáticas/);
  assert.match(app,/Las insignias no se compran/);
});

test("la moneda de bonificación está separada de XP y calificación",()=>{
  const app=read("app.js"),arcade=read("arcade.js");
  assert.match(app,/state\.coins/);
  assert.match(app,/NexoCoins se ganan en retos opcionales y sólo compran elementos cosméticos/);
  assert.match(arcade,/cada premio se acredita una sola vez/i);
  assert.match(arcade,/no dan ventajas ni modifican la evaluación/i);
});

test("hay cuatro retos de rapidez, memoria, clasificación y reparación",()=>{
  const context={window:{}};vm.createContext(context);vm.runInContext(read("arcade-data.js"),context);
  const data=context.window.NEXUS_ARCADE_DATA;
  assert.equal(data.bonuses.length,4);
  assert.deepEqual(Array.from(data.bonuses,x=>x.id),["speed","memory","hunt","glitch"]);
  assert.ok(data.bonuses.find(x=>x.id==="speed").time<=60);
  const arcade=read("arcade.js");
  for(const fn of ["startSpeed","startMemoryRound","startHunt","startGlitch"])assert.match(arcade,new RegExp(`function ${fn}`));
});

test("la tienda contiene avatares originales y selección persistente",()=>{
  const context={window:{}};vm.createContext(context);vm.runInContext(read("arcade-data.js"),context);
  const avatars=context.window.NEXUS_ARCADE_DATA.avatars;
  assert.equal(avatars.length,6);
  assert.ok(avatars.some(x=>x.cost===0));
  assert.ok(avatars.filter(x=>x.cost>0).length>=5);
  const names=avatars.map(x=>x.name).join(" ");
  assert.doesNotMatch(names,/Deadpool|Spider-Man|Minecraft|Mario|Simi/i);
  assert.match(read("arcade.js"),/ownedAvatars/);
  assert.match(read("app.js"),/state\.avatar/);
});

test("el jingle original es opcional y acompaña logros",()=>{
  const arcade=read("arcade.js");
  assert.match(arcade,/function playJingle/);
  assert.match(arcade,/AudioContext/);
  assert.match(arcade,/state\(\)\?\.sound===false/);
  for(const event of ["badge","level","purchase","reward"])assert.match(arcade,new RegExp(`playJingle\\('${event}'\\)`));
});

test("las nuevas rutas y archivos funcionan sin conexión",()=>{
  const html=read("estudiante.html"),app=read("app.js"),sw=read("sw.js");
  for(const route of ["bonus","shop"])assert.match(html,new RegExp(`data-nav="${route}"`));
  assert.match(app,/type==="bonus"/);
  assert.match(app,/type==="shop"/);
  for(const file of ["arcade.css","arcade-data.js","arcade.js"])assert.match(sw,new RegExp(file.replace(".","\\.")));
  assert.match(sw,/nexus-v(?:11-arcade-avatares-tienda|12-piloto-semestral-analitica|13-modo-conduccion-docente)/);
});
