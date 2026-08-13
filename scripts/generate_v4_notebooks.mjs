import fs from "node:fs";
import path from "node:path";
const out=path.resolve("public/course/laboratorios");fs.mkdirSync(out,{recursive:true});
const md=(s)=>({cell_type:"markdown",metadata:{},source:s.split("\n").map(x=>x+"\n")});
const code=(s)=>({cell_type:"code",execution_count:null,metadata:{},outputs:[],source:s.split("\n").map(x=>x+"\n")});
const base=(title,goal,cells)=>({cells:[md(`# ${title}\n\n**Propósito:** ${goal}\n\nRuta: explorar sin código → formular una hipótesis → programar → probar casos límite → documentar evidencia. Ejecuta cada celda en orden y sustituye los espacios marcados como **TU TURNO**.`),...cells,md("## Entrega\n\n1. Comparte este cuaderno con todas las celdas ejecutadas.\n2. Incluye una captura o tabla del resultado.\n3. Escribe qué evidencia apoya tu decisión, cuándo fallaría y qué revisión humana requiere.\n4. No uses datos personales reales.")],metadata:{kernelspec:{display_name:"Python 3",language:"python",name:"python3"},language_info:{name:"python",version:"3"}},nbformat:4,nbformat_minor:5});
const labs=[
["01_agente_reglas.ipynb","Laboratorio 1 · Reglas, agentes y decisiones","Distinguir automatización de una decisión contextual y explicable",[
md("## A. Antes de programar (15 min)\n\nDibuja con bloques: **entrada → regla → acción → explicación**. Usa tres entradas ficticias: días para vencer, número de recordatorios y solicitud de no recibir mensajes."),
code(`casos = [\n {"dias": 3, "recordatorios": 0, "consentimiento": True},\n {"dias": -1, "recordatorios": 1, "consentimiento": True},\n {"dias": 2, "recordatorios": 0, "consentimiento": False}\n]\n\ndef decidir(caso):\n    if not caso["consentimiento"]:\n        return {"accion":"no_enviar", "explicacion":"No existe consentimiento"}\n    if caso["dias"] < 0:\n        return {"accion":"revisar", "explicacion":"La devolución ya venció"}\n    if caso["dias"] <= 3 and caso["recordatorios"] == 0:\n        return {"accion":"recordar", "explicacion":"Vence en tres días o menos"}\n    return {"accion":"esperar", "explicacion":"No se activa ninguna regla"}\n\nfor c in casos: print(c, decidir(c))`),
md("## TU TURNO (35 min)\n\nAgrega una regla de abstención cuando falte un dato. Después escribe cuatro pruebas: caso normal, límite, dato faltante y consentimiento falso."),
code(`# Completa sin borrar las pruebas existentes\nassert decidir(casos[0])["accion"] == "recordar"\nassert decidir(casos[2])["accion"] == "no_enviar"\n# assert ...`)
]],
["02_busqueda_bfs_astar.ipynb","Laboratorio 2 · BFS y A*","Comparar estrategias de búsqueda con métricas observables",[
md("## A. Modelo visual (20 min)\n\nRepresenta el campus como nodos y aristas. Señala inicio, meta y costo. Predice qué algoritmo explorará menos nodos."),
code(`from collections import deque\ngrafo={"A":{"B":1,"C":4},"B":{"D":2,"E":5},"C":{"E":1},"D":{"F":3},"E":{"F":1},"F":{}}\n\ndef bfs(inicio,meta):\n q=deque([(inicio,[inicio])]); vistos={inicio}; explorados=[]\n while q:\n  nodo,ruta=q.popleft(); explorados.append(nodo)\n  if nodo==meta:return ruta,explorados\n  for vecino in grafo[nodo]:\n   if vecino not in vistos: vistos.add(vecino);q.append((vecino,ruta+[vecino]))\n return None,explorados\nprint(bfs("A","F"))`),
md("## TU TURNO (50 min)\n\nImplementa A* usando una heurística declarada. Registra ruta, costo y nodos explorados. Cambia un costo y explica cuándo la heurística deja de ser útil."),
code(`heuristica={"A":4,"B":3,"C":2,"D":2,"E":1,"F":0}\n# Implementa astar(inicio, meta) con heapq\n# Resultado esperado: una ruta, su costo y la lista de explorados`)
]],
["03_decision_umbral.ipynb","Laboratorio 3 · Umbrales y costos de error","Justificar una política con probabilidades, consecuencias y abstención",[
md("## A. Exploración (20 min)\n\nEn una hoja de cálculo crea un control de umbral entre 0 y 1. Antes de moverlo, define cuál error cuesta más: intervenir sin necesidad o no intervenir a tiempo."),
code(`datos=[(0.92,1),(0.76,1),(0.63,0),(0.51,1),(0.40,0),(0.22,0)]\ndef evaluar(umbral):\n pred=[int(p>=umbral) for p,_ in datos]; real=[y for _,y in datos]\n tp=sum(a==b==1 for a,b in zip(pred,real)); fp=sum(a==1 and b==0 for a,b in zip(pred,real))\n fn=sum(a==0 and b==1 for a,b in zip(pred,real)); tn=sum(a==b==0 for a,b in zip(pred,real))\n return {"TP":tp,"FP":fp,"FN":fn,"TN":tn}\nfor u in (.4,.6,.8): print(u,evaluar(u))`),
md("## TU TURNO (40 min)\n\nDefine costo(FP)=1 y costo(FN)=4. Encuentra el umbral de menor costo. Agrega una zona de abstención de ±0.05 alrededor del umbral."),
code(`# Calcula costo = FP + 4*FN para umbrales de 0.10 a 0.90\n# Documenta la política elegida y quién revisa las abstenciones.`)
]],
["04_percepcion_imagenes.ipynb","Laboratorio 4 · Percepción con imágenes","Evaluar un clasificador más allá de una demostración ideal",[
md("## A. Sin código (45 min)\n\nAbre Teachable Machine, crea dos clases no sensibles y captura ejemplos con fondos e iluminación variados. Reserva imágenes que el modelo no haya visto. Exporta sólo las predicciones; no publiques rostros ni datos personales."),
code(`reales       =["A","A","A","B","B","B","B","A"]\npredicciones =["A","B","A","B","B","A","B","A"]\nclases=["A","B"]\nmatriz={r:{p:0 for p in clases} for r in clases}\nfor r,p in zip(reales,predicciones): matriz[r][p]+=1\nprint(matriz)\nexactitud=sum(r==p for r,p in zip(reales,predicciones))/len(reales)\nprint("exactitud",exactitud)`),
md("## TU TURNO (35 min)\n\nReemplaza las listas por 20 pruebas de tu modelo. Separa resultados por condición de luz o fondo. Identifica el grupo con peor desempeño y propone una mejora verificable."),
code(`# Calcula exactitud por condición y registra al menos dos fallos reales.`)
]],
["05_rag_minimo.ipynb","Laboratorio 5 · RAG mínimo y verificable","Recuperar evidencia y responder citando el fragmento usado",[
md("## A. Flujo visual (20 min)\n\nOrdena estos bloques: documentos → fragmentos → consulta → similitud → fragmento recuperado → respuesta con fuente. Indica dónde puede aparecer una respuesta sin respaldo."),
code(`import re, math\ndocs={"D1":"BFS explora por niveles y usa una cola.","D2":"A estrella combina costo acumulado y una heurística.","D3":"Una regla fija automatiza una decisión sin aprender."}\ndef tokens(t): return set(re.findall(r"[a-záéíóúñ]+",t.lower()))\ndef recuperar(pregunta):\n q=tokens(pregunta); ranking=[]\n for clave,texto in docs.items():\n  d=tokens(texto); score=len(q&d)/math.sqrt(max(1,len(q)*len(d)))\n  ranking.append((score,clave,texto))\n return max(ranking)\nprint(recuperar("¿Qué algoritmo usa una heurística?"))`),
md("## TU TURNO (50 min)\n\nAgrega cinco fragmentos de tus propias notas. Si la similitud es menor a 0.15, el sistema debe responder «evidencia insuficiente». Devuelve siempre el identificador de fuente."),
code(`def responder(pregunta):\n score,fuente,fragmento=recuperar(pregunta)\n # Completa la abstención y una respuesta sustentada\n return {"score":score,"fuente":fuente,"evidencia":fragmento}\nprint(responder("¿Cuándo se usa una cola?"))`)
]],
["06_fastapi_servicio.ipynb","Laboratorio 6 · Servicio inteligente con FastAPI","Publicar una decisión explicable y comprobarla con pruebas automáticas",[
md("## A. Contrato antes del código (20 min)\n\nEntrada: probabilidad y consentimiento. Salida: acción, explicación y revisión_humana. Decide qué datos inválidos rechazará la API."),
code(`!pip -q install fastapi uvicorn httpx`),
code(`from fastapi import FastAPI\nfrom pydantic import BaseModel, Field\nfrom fastapi.testclient import TestClient\n\napp=FastAPI(title="Servicio de decisión NEXUS")\nclass Solicitud(BaseModel):\n probabilidad: float=Field(ge=0,le=1)\n consentimiento: bool\n\n@app.get("/health")\ndef health(): return {"status":"ok"}\n\n@app.post("/decide")\ndef decide(s:Solicitud):\n if not s.consentimiento:\n  return {"accion":"no_actuar","explicacion":"Sin consentimiento","revision_humana":False}\n if .45 <= s.probabilidad <= .55:\n  return {"accion":"abstener","explicacion":"Evidencia insuficiente","revision_humana":True}\n return {"accion":"intervenir" if s.probabilidad>.55 else "esperar","explicacion":"Política de umbral 0.55","revision_humana":False}\n\nclient=TestClient(app)\nprint(client.get("/health").json())\nprint(client.post("/decide",json={"probabilidad":.8,"consentimiento":True}).json())`),
md("## TU TURNO (50 min)\n\nEjecuta las pruebas, agrega un caso límite y comprueba que una probabilidad 1.2 produzca error 422. Luego abre `/docs` sólo si ejecutas un túnel autorizado por tu institución; el cuaderno funciona sin publicarlo en Internet."),
code(`def test_salud(): assert client.get("/health").status_code==200\ndef test_abstencion(): assert client.post("/decide",json={"probabilidad":.5,"consentimiento":True}).json()["accion"]=="abstener"\ndef test_invalido(): assert client.post("/decide",json={"probabilidad":1.2,"consentimiento":True}).status_code==422\ntest_salud();test_abstencion();test_invalido();print("3 pruebas superadas")`)
]]];
for(const [file,title,goal,cells] of labs)fs.writeFileSync(path.join(out,file),JSON.stringify(base(title,goal,cells),null,2));
console.log(`Generados ${labs.length} cuadernos en ${out}`);
