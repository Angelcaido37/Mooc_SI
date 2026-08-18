import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const html=fs.readFileSync('public/course/estudiante.html','utf8');
const app=fs.readFileSync('public/course/app.js','utf8');
const evalmod=fs.readFileSync('public/course/evaluation-module.js','utf8');
const css=fs.readFileSync('public/course/nexus19.css','utf8');

test('menú primario del estudiante mantiene ocho decisiones claras incluyendo Mensajes',()=>{
 const sidebar=html.match(/<aside id="sidebar"[\s\S]*?<\/aside>/)?.[0]||'';
 const buttons=[...sidebar.matchAll(/class="nav-item/g)];
 assert.equal(buttons.length,8);
 for(const label of ['Inicio / Continuar','Mi ruta','Actividades y juegos','Proyecto integrador','Evidencias y calificaciones','Mensajes','Recursos y apoyo','Mi perfil']) assert.match(sidebar,new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
 for(const old of ['26 sesiones de clase','Centro de aprendizaje','Laboratorio low/no-code','Python y FastAPI','Tienda de avatares','Tabla de posiciones']) assert.doesNotMatch(sidebar,new RegExp(old));
});
test('profundidad académica queda integrada en la lección',()=>{
 assert.match(app,/function depthIntegrated/);
 assert.match(app,/APRENDER CON PROFUNDIDAD/);
 assert.match(app,/Practica con guía/);
 assert.match(app,/Ruta de recuperación/);
 assert.match(app,/type==="learn"\?\(id\?lessonView\(id\):route\(\)\)/);
});
test('evidencias distinguen peso de categoría y aporte de producto',()=>{
 assert.match(evalmod,/peso global/);
 assert.match(evalmod,/itemWeight/);
 assert.match(evalmod,/evidence-score">E\$\{e\.unit\}/);
 assert.doesNotMatch(evalmod,/evidence-score">\$\{cat\(e\.category\)\.weight\}%/);
});
test('menú móvil tiene backdrop, cierre exterior y Escape',()=>{
 assert.match(html,/sidebarBackdrop/);assert.match(html,/sidebarClose/);
 assert.match(app,/sidebarBackdrop\?\.addEventListener\('click',closeSidebar\)/);
 assert.match(app,/e\.key==='Escape'/);assert.match(app,/aria-expanded/);
 assert.match(css,/sidebar-backdrop/);
});
test('recursos y apoyo consolida laboratorios y orientación',()=>{
 assert.match(app,/function resources\(\)/);
 for(const label of ['Laboratorio visual','Laboratorio de código','Cómo jugar NEXUS','Privacidad y mis datos'])assert.match(app,new RegExp(label));
});
test('sesiones llaman lección principal al contenido nuclear',()=>{
 assert.match(app,/lección\$\{s\.lessonIds\.length===1\?' principal':'es principales'\}/);
});
