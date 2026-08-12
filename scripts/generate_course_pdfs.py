#!/usr/bin/env python3
from pathlib import Path
import json, subprocess, unicodedata
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, KeepTogether

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "public/course/course-data.js"
TEACHING = ROOT / "public/course/teaching-data.js"
OUT = ROOT / "public/course/materiales"
OUT.mkdir(parents=True, exist_ok=True)

node = r"""
const fs=require('fs'),vm=require('vm');
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync(process.argv[1],'utf8'),sandbox);
vm.runInNewContext(fs.readFileSync(process.argv[2],'utf8'),sandbox);
process.stdout.write(JSON.stringify({course:sandbox.window.NEXUS_COURSE,teaching:sandbox.window.NEXUS_TEACHING}));
"""
payload = json.loads(subprocess.check_output(["node", "-e", node, str(DATA), str(TEACHING)], text=True))
course = payload["course"]
teaching = payload["teaching"]

NAVY = colors.HexColor("#071329")
CYAN = colors.HexColor("#0AA79F")
PALE = colors.HexColor("#EAF7F6")
INK = colors.HexColor("#16233A")
MUTED = colors.HexColor("#52627A")
YELLOW = colors.HexColor("#FFCF57")

pdfmetrics.registerFont(TTFont("NexusSans", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("NexusSansBold", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="CoverTitle", parent=styles["Title"], fontName="NexusSansBold", fontSize=28, leading=34, textColor=colors.white, alignment=TA_CENTER, spaceAfter=18))
styles.add(ParagraphStyle(name="CoverSub", parent=styles["BodyText"], fontName="NexusSans", fontSize=11.5, leading=18, textColor=colors.HexColor("#D9E6F3"), alignment=TA_CENTER))
styles.add(ParagraphStyle(name="H1N", parent=styles["Heading1"], fontName="NexusSansBold", fontSize=22, leading=27, textColor=NAVY, spaceBefore=12, spaceAfter=10))
styles.add(ParagraphStyle(name="H2N", parent=styles["Heading2"], fontName="NexusSansBold", fontSize=15, leading=19, textColor=CYAN, spaceBefore=12, spaceAfter=7))
styles.add(ParagraphStyle(name="BodyN", parent=styles["BodyText"], fontName="NexusSans", fontSize=10.2, leading=15, textColor=INK, spaceAfter=8))
styles.add(ParagraphStyle(name="SmallN", parent=styles["BodyText"], fontName="NexusSans", fontSize=8.5, leading=12, textColor=MUTED))
styles.add(ParagraphStyle(name="CalloutN", parent=styles["BodyText"], fontName="NexusSansBold", fontSize=10, leading=15, textColor=NAVY, leftIndent=10, rightIndent=10, spaceBefore=8, spaceAfter=8))

def safe(text):
    return str(text).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("–", "-").replace("—", "-")

def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#D8E1EC")); canvas.line(2*cm, 1.35*cm, 19.5*cm, 1.35*cm)
    canvas.setFont("NexusSans", 8); canvas.setFillColor(MUTED)
    canvas.drawString(2*cm, .9*cm, "Mision NEXUS - Sistemas Inteligentes")
    canvas.drawRightString(19.5*cm, .9*cm, f"Pagina {doc.page}")
    canvas.restoreState()

def cover(story, unit):
    box = Table([[Paragraph(f"MISION {unit['number']}", styles["CoverSub"])], [Paragraph(safe(unit["title"]), styles["CoverTitle"])], [Paragraph(safe(unit["purpose"]), styles["CoverSub"])], [Paragraph(f"Cuaderno de estudio - Evidencia oficial: {unit['weight']}%", styles["CoverSub"])]], colWidths=[16.5*cm], rowHeights=[1.4*cm, 5*cm, 3.4*cm, 1.5*cm])
    box.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),NAVY),("BOX",(0,0),(-1,-1),0,NAVY),("VALIGN",(0,0),(-1,-1),"MIDDLE"),("LEFTPADDING",(0,0),(-1,-1),1.2*cm),("RIGHTPADDING",(0,0),(-1,-1),1.2*cm)]))
    story.extend([Spacer(1,2.3*cm),box,Spacer(1,1.2*cm),Paragraph("Universidad Autonoma de Nayarit - Licenciatura en Sistemas Computacionales",styles["SmallN"]),PageBreak()])

def slug(text):
    plain = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    return plain.lower().replace(" ", "-")

for unit in course["units"]:
    unit_sessions = [s for s in teaching["sessions"] if s["unit"] == unit["id"]]
    path = OUT / f"unidad-{unit['number']}-{slug(unit['short'])}.pdf"
    doc = SimpleDocTemplate(str(path), pagesize=letter, rightMargin=2*cm, leftMargin=2*cm, topMargin=1.8*cm, bottomMargin=1.8*cm, title=f"Mision NEXUS - Unidad {unit['number']}", author="Universidad Autonoma de Nayarit")
    story=[]; cover(story,unit)
    story += [Paragraph("Mapa de la unidad",styles["H1N"]),Paragraph("Resultados de aprendizaje",styles["H2N"])]
    for x in unit["outcomes"]: story.append(Paragraph("• "+safe(x),styles["BodyN"]))
    story += [Spacer(1,6),Paragraph("Evidencia academica",styles["H2N"]),Paragraph(safe(unit["evidence"]),styles["CalloutN"]),Paragraph("Fuentes base",styles["H2N"])]
    for x in unit["references"]: story.append(Paragraph("• "+safe(x),styles["SmallN"]))
    story.append(PageBreak())
    for index, lesson in enumerate(unit["lessons"],1):
        story += [Paragraph(f"Leccion {index}. {safe(lesson['title'])}",styles["H1N"]),Paragraph(f"Tiempo guiado estimado: {lesson['minutes']} minutos",styles["SmallN"]),Paragraph("Objetivo",styles["H2N"]),Paragraph(safe(lesson["objective"]),styles["CalloutN"]),Paragraph("Desarrollo conceptual",styles["H2N"])]
        for p in lesson["theory"]: story.append(Paragraph(safe(p),styles["BodyN"]))
        example = Table([[Paragraph("EJEMPLO RAZONADO",styles["SmallN"])],[Paragraph(safe(lesson["example"]),styles["BodyN"])]],colWidths=[16.5*cm])
        example.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),PALE),("BOX",(0,0),(-1,-1),.8,CYAN),("LEFTPADDING",(0,0),(-1,-1),12),("RIGHTPADDING",(0,0),(-1,-1),12),("TOPPADDING",(0,0),(-1,-1),9),("BOTTOMPADDING",(0,0),(-1,-1),9)]))
        story += [Spacer(1,5),example,Paragraph("Practica autonoma",styles["H2N"]),Paragraph(safe(lesson["practice"]),styles["BodyN"]),Paragraph("Punto de control",styles["H2N"]),Paragraph(safe(lesson["check"]["q"]),styles["CalloutN"])]
        for i,opt in enumerate(lesson["check"]["o"]): story.append(Paragraph(f"{chr(65+i)}. {safe(opt)}",styles["BodyN"]))
        story += [Paragraph("Comprueba tu respuesta en la plataforma para recibir retroalimentacion. La clave se conserva en el kit docente.",styles["SmallN"]),Paragraph("Sintesis",styles["H2N"])]
        for x in lesson["video"]: story.append(Paragraph("• "+safe(x),styles["BodyN"]))
        if index < len(unit["lessons"]): story.append(PageBreak())
    story += [PageBreak(),Paragraph("Ruta independiente de la unidad",styles["H1N"]),Paragraph("Estas actividades comienzan despues de la clase y no duplican el ejercicio guiado realizado con el docente.",styles["BodyN"])]
    session_rows=[[Paragraph("Sesion",styles["SmallN"]),Paragraph("Min",styles["SmallN"]),Paragraph("Actividades",styles["SmallN"])]]
    for session in unit_sessions:
        activities="; ".join(f"{x[0]} ({x[1]} min)" for x in session["independent"])
        session_rows.append([Paragraph(str(session["number"]),styles["BodyN"]),Paragraph(str(session["independentMinutes"]),styles["BodyN"]),Paragraph(safe(activities),styles["SmallN"])])
    session_table=Table(session_rows,colWidths=[1.5*cm,1.5*cm,13.5*cm],repeatRows=1)
    session_table.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),NAVY),("TEXTCOLOR",(0,0),(-1,0),colors.white),("GRID",(0,0),(-1,-1),.4,colors.HexColor("#D8E1EC")),("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),7),("RIGHTPADDING",(0,0),(-1,-1),7),("TOPPADDING",(0,0),(-1,-1),7),("BOTTOMPADDING",(0,0),(-1,-1),7)]))
    story += [session_table,PageBreak(),Paragraph("Lista de preparacion para la evidencia",styles["H1N"])]
    for text in ["Puedo explicar los conceptos sin leer una definicion.","Conservo un ejemplo reproducible y sus resultados.","Justifico por que elegi el metodo y reconozco sus limites.","Documente el uso de IA generativa y verifique sus aportes.","Puedo modificar mi solucion y explicar el efecto esperado."]:
        story.append(Paragraph("[ ] "+safe(text),styles["BodyN"]))
    story.append(Spacer(1,18)); story.append(Paragraph("Notas y bitacora",styles["H2N"]))
    for _ in range(12): story.append(Paragraph("________________________________________________________________________________",styles["SmallN"]))
    doc.build(story,onFirstPage=footer,onLaterPages=footer)
    print(path)
