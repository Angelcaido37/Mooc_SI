import fs from "node:fs/promises";
import {Presentation,PresentationFile} from "/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";
const W=1280,H=720,NAVY="#071329",CYAN="#08A6B5",YELLOW="#FFC857",INK="#10233D",MUTED="#52647A",PALE="#EEF8F9",WHITE="#FFFFFF";
const deck=Presentation.create({slideSize:{width:W,height:H}});
const box=(s,x,y,w,h,fill=WHITE,line="#DCE5EC",radius="rounded-xl")=>s.shapes.add({geometry:"roundRect",position:{left:x,top:y,width:w,height:h},fill,line:{style:"solid",fill:line,width:1},borderRadius:radius});
const txt=(s,text,x,y,w,h,size=28,color=INK,bold=false,align="left")=>{const t=s.shapes.add({geometry:"textbox",position:{left:x,top:y,width:w,height:h},fill:"none",line:{style:"solid",fill:"none",width:0}});t.text=text;t.text.style={fontSize:size,typeface:"Aptos",color,bold,alignment:align,verticalAlignment:"middle",autoFit:"shrinkText",insets:{top:4,right:4,bottom:4,left:4}};return t};
function base(section,num,dark=false){const s=deck.slides.add();s.background.fill=dark?NAVY:"#F7FAFC";txt(s,section.toUpperCase(),64,34,700,28,14,dark?"#9FE8EE":CYAN,true);txt(s,String(num).padStart(2,"0"),1150,30,66,34,18,dark?WHITE:MUTED,true,"right");return s}
function title(s,t,sub,dark=false){txt(s,t,64,82,1120,115,48,dark?WHITE:NAVY,true);if(sub)txt(s,sub,68,200,1080,70,22,dark?"#C5D4E8":MUTED)}
{
 const s=base("Sistemas Inteligentes · Sesión 1",1,true);txt(s,"IA, automatización y\nproblemas pertinentes",72,145,760,210,54,WHITE,true);txt(s,"Decidir cuándo una regla simple es suficiente",78,384,650,58,25,"#A9EAF0");box(s,902,120,250,400,"#0C2546","#1D456D");txt(s,"100",940,168,175,100,74,YELLOW,true,"center");txt(s,"minutos",940,264,175,42,22,WHITE,true,"center");txt(s,"60 min teoría\n40 min práctica",930,340,195,100,25,WHITE,true,"center");txt(s,"Pregunta detonante →",76,586,280,30,16,YELLOW,true);txt(s,"¿Todo proceso que toma una decisión puede llamarse inteligente?",350,566,820,70,25,WHITE,true);
}
{
 const s=base("Activación · 10 minutos",2);title(s,"Piensa antes de definir","Responde individualmente; después contrasta con una pareja.");box(s,82,305,1116,250,PALE,"#B7E5E9");txt(s,"¿Todo proceso que toma una decisión\npuede llamarse inteligente?",125,338,1030,115,39,NAVY,true,"center");txt(s,"Escribe una razón y un contraejemplo.",264,474,750,40,21,MUTED,false,"center");
}
{
 const s=base("Explicación dialogada · 25 minutos",3);title(s,"Cuatro capas que no significan lo mismo","Clasifica por lo que hace realmente cada componente.");const items=[["AUTOMATIZACIÓN","Ejecuta reglas definidas","Si fecha − hoy = 3 → enviar correo"],["MODELO","Estima o predice","Probabilidad de retraso"],["SISTEMA","Coordina datos, reglas y personas","Predicción + consentimiento + revisión"],["PRODUCTO","Entrega valor en un contexto","Portal completo de biblioteca"]];items.forEach((a,i)=>{const x=64+i*294;box(s,x,300,270,260,i===1?"#FFF8E4":WHITE,i===1?YELLOW:"#DCE5EC");txt(s,a[0],x+20,320,230,34,15,i===1?"#9A6500":CYAN,true);txt(s,a[1],x+20,372,230,70,25,NAVY,true);txt(s,a[2],x+20,462,230,64,17,MUTED);});
}
{
 const s=base("Ejemplo comentado · 15 minutos",4,true);title(s,"El caso de la biblioteca","La inteligencia no aparece por añadir una etiqueta.",true);const steps=[["1","REGLA","Correo 3 días antes"],["2","MODELO","Predice riesgo"],["3","SISTEMA","Explica, pide consentimiento y permite revisión"]];steps.forEach((a,i)=>{const x=90+i*385;box(s,x,320,330,210,"#102D52","#1E537F");txt(s,a[0],x+20,342,52,52,30,YELLOW,true,"center");txt(s,a[1],x+86,342,210,42,15,"#9FE8EE",true);txt(s,a[2],x+28,410,274,80,25,WHITE,true,"center");if(i<2)txt(s,"→",x+337,390,42,50,34,YELLOW,true,"center")});
}
{
 const s=base("Ejercicio guiado · 30 minutos",5);title(s,"Clasificar no basta: hay que defender","Ocho soluciones universitarias · tres decisiones posibles");const cols=[["REQUIERE IA","La variación exige aprender, inferir o percibir"],["BASTA AUTOMATIZAR","Una regla estable resuelve el caso"],["NO CONVIENE CONSTRUIR","Riesgo, falta de evidencia o propósito injustificado"]];cols.forEach((a,i)=>{const x=66+i*398;box(s,x,303,370,235,i===2?"#FFF0ED":i===1?"#FFF8E4":PALE,i===2?"#F2B5A8":i===1?YELLOW:"#B7E5E9");txt(s,a[0],x+22,326,326,42,18,i===2?"#B43A24":i===1?"#9A6500":CYAN,true,"center");txt(s,a[1],x+30,390,310,105,23,NAVY,true,"center");});txt(s,"Criterio común: evidencia · límites · responsabilidad",290,574,700,40,20,MUTED,true,"center");
}
{
 const s=base("Procedimiento de trabajo",6,true);title(s,"De la intuición a una decisión defendible",null,true);const steps=[["01","Propuesta individual","2 min"],["02","Contraste en pareja","localiza una diferencia"],["03","Resolución por equipo","usa el instrumento"],["04","Puesta en común","compara evidencia y límites"]];steps.forEach((a,i)=>{const y=245+i*92;txt(s,a[0],80,y,70,54,23,YELLOW,true,"center");box(s,170,y-4,960,66,"#102D52","#1E537F");txt(s,a[1],198,y+4,430,44,25,WHITE,true);txt(s,a[2],650,y+4,440,44,20,"#A9EAF0",false,"right")});
}
{
 const s=base("Revisión y cierre · 20 minutos",7);title(s,"Una respuesta correcta no es evidencia suficiente","Antes de aceptar una solución, pregunte:");const qs=["¿Qué datos y procedimiento sostienen la salida?","¿Qué ocurre en casos límite o con evidencia insuficiente?","¿Quién responde por la consecuencia y puede detenerla?"];qs.forEach((q,i)=>{box(s,100,284+i*104,1080,78,i===1?"#FFF8E4":WHITE,i===1?YELLOW:"#DCE5EC");txt(s,String(i+1),120,297+i*104,44,48,26,CYAN,true,"center");txt(s,q,186,297+i*104,930,48,24,NAVY,true)});
}
{
 const s=base("Después de clase · 90 minutos",8,true);title(s,"Continuación independiente","Actividades distintas a las realizadas en el aula.",true);const acts=[["20 min","REPASO","Síntesis de 5 ideas + ejemplo propio"],["27 min","ENTRENAMIENTO","Nueva variante de clasificación"],["16 min","LABORATORIO","Radar IA o automatización"],["27 min","EVIDENCIA","Problema real: versión sin IA y con IA"]];acts.forEach((a,i)=>{const x=65+i*294;box(s,x,300,270,255,"#102D52","#1E537F");txt(s,a[0],x+20,324,230,40,24,YELLOW,true,"center");txt(s,a[1],x+20,380,230,35,15,"#9FE8EE",true,"center");txt(s,a[2],x+24,438,222,76,21,WHITE,true,"center")});txt(s,"Salida de clase: decisión principal · caso de fallo · duda o prueba pendiente",130,596,1020,42,20,"#C5D4E8",true,"center");
}
await fs.mkdir("docente/presentaciones/previews",{recursive:true});
for(const [i,s] of deck.slides.items.entries()){const p=await deck.export({slide:s,format:"png",scale:1});await fs.writeFile(`docente/presentaciones/previews/sesion01-${String(i+1).padStart(2,"0")}.png`,new Uint8Array(await p.arrayBuffer()));}
const montage=await deck.export({format:"webp",montage:true,scale:0.5});await fs.writeFile("docente/presentaciones/previews/sesion01-montage.webp",new Uint8Array(await montage.arrayBuffer()));
const pptx=await PresentationFile.exportPptx(deck);await pptx.save("docente/presentaciones/Sesion_01_IA_automatizacion.pptx");
console.log("Presentación creada: 8 diapositivas");
