import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {fileURLToPath} from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const sandbox={window:{}};
for(const file of ["course-data.js","teaching-data.js","game-data.js"])
  vm.runInNewContext(fs.readFileSync(path.join(root,"public/course",file),"utf8"),sandbox);
const {NEXUS_COURSE:C,NEXUS_TEACHING:T,NEXUS_GAMES:G}=sandbox.window;
const lines=[
  "# Kit docente completo - Misión NEXUS",
  "",
  "Este documento acompaña las 26 sesiones presenciales. El sitio público contiene las consignas formativas; este kit conserva la conducción, los criterios de respuesta y la organización docente.",
  "",
  "## Contabilidad de tiempo",
  "",
  "| Componente | Tiempo | Regla |",
  "|---|---:|---|",
  "| Conducción docente | 2,600 min reales | 26 sesiones de 100 minutos |",
  "| Teoría oficial | 22 h académicas | 1,100 min dentro de las sesiones |",
  "| Práctica oficial | 30 h académicas | 1,500 min dentro de las sesiones |",
  "| Trabajo independiente | 44 h | 2,640 min fuera de clase |",
  "",
  `> ${T.note}`,
  "",
  "## Uso recomendado",
  "",
  "1. Antes: abra el guion de la sesión, pruebe el juego o laboratorio y revise y habilite en NEXUS la evidencia o consigna independiente.",
  "2. Durante: explique, permita dudas, resuelva el ejemplo con el grupo, observe el procedimiento y retroalimente.",
  "3. Después: indique la ruta independiente y la evidencia; no vuelva a contabilizar lo ya realizado en clase.",
  "4. NEXUS conserva entregas, rúbricas y calificaciones; los XP son formativos y no alteran la nota académica.",
  ""
];
for(const s of T.sessions){
  const unit=C.units.find(u=>u.id===s.unit);
  lines.push(`# Sesión ${s.number}. ${s.title}`,"",`**Misión:** ${unit.number}. ${unit.title}  `,`**Tiempo:** 100 min con docente (${s.theoryMinutes} teoría + ${s.practiceMinutes} práctica) y ${s.independentMinutes} min independientes.  `,`**Propósito:** ${s.objective}`,"",`**Pregunta detonante:** ${s.trigger}`,"","## Secuencia de clase","","| Momento | Min | Acción |","|---|---:|---|");
  for(const [name,min,action] of s.timeline)lines.push(`| ${name} | ${min} | ${action.replaceAll("|","/")} |`);
  lines.push("","## Contenido para preparar la explicación","");
  s.explanation.forEach((x,i)=>lines.push(`${i+1}. ${x}`));
  lines.push("","## Ejemplo comentado","",s.example,"","## Ejercicio guiado","",s.guided,"","**Producto observable:** "+s.product,"","## Preguntas de reflexión","");
  s.reflection.forEach(x=>lines.push(`- ${x}`));
  lines.push("","## Criterios para revisar el ejercicio","");
  ["Identifica entradas, método, salida y responsable.","Explica el procedimiento, no sólo el resultado.","Usa evidencia o regla pertinente y reconoce supuestos.","Incluye al menos un caso límite o fallo seguro.","Registra correcciones en la bitácora."].forEach(x=>lines.push(`- ${x}`));
  lines.push("","## Continuación independiente","","| Actividad | Min | Consigna |","|---|---:|---|");
  s.independent.forEach(([n,m,a])=>lines.push(`| ${n} | ${m} | ${a.replaceAll("|","/")} |`));
  lines.push("",`**Recurso gamificado:** ${s.game}.  `,`**Laboratorio:** ${s.lab}.`,"","## Boleto de salida","");
  s.exit.forEach(x=>lines.push(`- ${x}`));
  lines.push("","---","");
}
lines.push("# Claves del banco de juegos","","## Jeopardy","",...G.jeopardy.map(x=>`- **${x.category} ${x.value}:** ${x.q} — *${x.a}*`),"","## Duelo de preguntas","",...G.qa.map((x,i)=>`- **${i+1}. ${x.q}** Respuesta: ${x.o[x.a]}. ${x.f}`),"","## Serpientes y escaleras","",...G.snakes.map(x=>`- ${x.q} — *Criterio:* ${x.ok}`));
fs.writeFileSync(path.join(root,"docente/GUIA_26_SESIONES_Y_CLAVES.md"),lines.join("\n"));
console.log("docente/GUIA_26_SESIONES_Y_CLAVES.md");
