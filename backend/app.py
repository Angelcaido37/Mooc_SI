import json, os, sqlite3, uuid, shutil, hashlib, csv, io, base64, hmac, re
from pathlib import Path
from datetime import datetime, timezone, timedelta
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Header
from fastapi.responses import FileResponse, Response
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

ROOT=Path(__file__).resolve().parents[1]
WEB=ROOT/'public'/'course'
DATA=Path(os.getenv('NEXUS_DATA_DIR', str(ROOT/'nexus_data'))).expanduser().resolve()
UP=DATA/'uploads'
DATA.mkdir(parents=True,exist_ok=True)
UP.mkdir(parents=True,exist_ok=True)
DB=DATA/'nexus18.sqlite3'
DATABASE_URL=os.getenv('DATABASE_URL','').strip()
USE_POSTGRES=DATABASE_URL.startswith(('postgres://','postgresql://'))
TEACHER_PASSWORD=os.getenv('NEXUS_TEACHER_PASSWORD','cambiar-antes-de-publicar')
NEXUS_ENV=os.getenv('NEXUS_ENV','development').lower()
COURSE_CODE=os.getenv('NEXUS_COURSE_CODE','NEXUS18')
SESSION_HOURS=int(os.getenv('NEXUS_SESSION_HOURS','12'))
MAX_UPLOAD_MB=int(os.getenv('NEXUS_MAX_UPLOAD_MB','2'))
RETENTION_DAYS=int(os.getenv('NEXUS_RETENTION_DAYS','730'))
PRIVACY_NOTICE_VERSION=os.getenv('NEXUS_PRIVACY_NOTICE_VERSION','NEXUS19-PRIV-1')
SESSION_SECRET=(os.getenv('NEXUS_SESSION_SECRET') or hashlib.sha256(f'{TEACHER_PASSWORD}|{COURSE_CODE}|NEXUS19'.encode()).hexdigest()).encode()
ALLOWED_EXT={'.pdf','.doc','.docx','.ppt','.pptx','.xls','.xlsx','.csv','.txt','.md','.png','.jpg','.jpeg','.webp','.zip'}
try: STUDENT_KEYS=json.loads(os.getenv('NEXUS_STUDENT_KEYS','{}'))
except Exception: STUDENT_KEYS={}

DEFAULT_CATEGORIES=[{'id':'activities','name':'Actividades de aprendizaje','weight':20},{'id':'mastery','name':'Retos de dominio','weight':15},{'id':'evidence','name':'Evidencias de aprendizaje','weight':35},{'id':'project','name':'Proyecto integrador','weight':30}]
def gradebook_for(c, uid):
    pr=c.execute('SELECT data FROM progress WHERE uid=?',(uid,)).fetchone(); p=json.loads(pr['data']) if pr else {}
    cfg=c.execute("SELECT data FROM config WHERE key='evaluation'").fetchone(); cats=(json.loads(cfg['data']).get('categories') if cfg else None) or DEFAULT_CATEGORIES
    weights={x['id']:float(x.get('weight',0)) for x in cats}
    quizzes=len(set(p.get('quizzes') or [])); activities=(min(100,round(quizzes/30*100,1)) if quizzes>0 else None)
    games=len(set(p.get('games') or [])); mastery=(min(100,round(games/6*100,1)) if games>0 else None)
    erows=c.execute('SELECT evidence_id,grade FROM evidence WHERE uid=? AND grade IS NOT NULL',(uid,)).fetchall(); grades={r['evidence_id']:float(r['grade']) for r in erows}
    ev=[grades[k] for k in ['u1','u2','u3','u4','u5'] if k in grades]; evidence=round(sum(ev)/len(ev),1) if ev else None; project=grades.get('u6')
    scores={'activities':activities,'mastery':mastery,'evidence':evidence,'project':project}
    earned=0; used=0
    for k,w in weights.items():
        if scores.get(k) is not None: earned+=scores[k]*w/100; used+=w
    current=round(earned/(used/100),1) if used else None
    final=round(earned,1) if used>=99.999 else None
    return {'scores':scores,'weights':weights,'currentAverage':current,'finalAverage':final,'gradedWeight':round(used,1),'provisional':used<99.999,'calculationNote':'El promedio actual sólo pondera categorías con al menos una evidencia evaluada; el promedio final aparece al completar el 100 % del peso.','raw':{'quizzesPassed':quizzes,'masteryChallenges':games,'evidenceGrades':grades}}


def _sql(sql):
    return sql.replace('?', '%s') if USE_POSTGRES else sql

class DBConn:
    def __init__(self):
        if USE_POSTGRES:
            try:
                import psycopg
                from psycopg.rows import dict_row
            except Exception as exc:
                raise RuntimeError('DATABASE_URL está configurada, pero falta psycopg. Instale backend/requirements.txt') from exc
            self.raw=psycopg.connect(DATABASE_URL,row_factory=dict_row)
        else:
            self.raw=sqlite3.connect(DB)
            self.raw.row_factory=sqlite3.Row
    def execute(self,sql,params=()):
        return self.raw.execute(_sql(sql),params)
    def executescript(self,sql):
        if USE_POSTGRES:
            for stmt in [x.strip() for x in sql.split(';') if x.strip()]: self.execute(stmt)
        else:
            self.raw.executescript(sql)
    def __enter__(self): return self
    def __exit__(self,exc_type,exc,tb):
        try:
            self.raw.rollback() if exc_type else self.raw.commit()
        finally:
            self.raw.close()

SQLITE_SCHEMA='''
CREATE TABLE IF NOT EXISTS users(uid TEXT PRIMARY KEY,name TEXT,email TEXT,role TEXT,created_at TEXT,last_at TEXT);
CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,uid TEXT,created_at TEXT);
CREATE TABLE IF NOT EXISTS progress(uid TEXT PRIMARY KEY,data TEXT,updated_at TEXT);
CREATE TABLE IF NOT EXISTS evidence(id TEXT PRIMARY KEY,uid TEXT,evidence_id TEXT,title TEXT,text_answer TEXT,link_url TEXT,file_name TEXT,file_path TEXT,file_blob BLOB,file_mime TEXT,file_size INTEGER,file_sha256 TEXT,status TEXT,submitted_at TEXT,grade REAL,feedback TEXT,rubric_scores TEXT,graded_at TEXT);
CREATE TABLE IF NOT EXISTS config(key TEXT PRIMARY KEY,data TEXT,updated_at TEXT);
CREATE TABLE IF NOT EXISTS events(id INTEGER PRIMARY KEY AUTOINCREMENT,uid TEXT,type TEXT,payload TEXT,created_at TEXT);
CREATE TABLE IF NOT EXISTS teacher_records(id TEXT PRIMARY KEY,kind TEXT,data TEXT,created_at TEXT);
CREATE TABLE IF NOT EXISTS acknowledgements(id TEXT PRIMARY KEY,uid TEXT,indicator_id TEXT,session_id TEXT,statement TEXT,response TEXT,observation TEXT,resource_version TEXT,resource_hash TEXT,created_at TEXT);
CREATE TABLE IF NOT EXISTS practice_evidence(id TEXT PRIMARY KEY,indicator_id TEXT,session_id TEXT,kind TEXT,title TEXT,payload TEXT,resource_version TEXT,evidence_hash TEXT,created_at TEXT);
CREATE TABLE IF NOT EXISTS privacy_consents(id TEXT PRIMARY KEY,uid TEXT,notice_version TEXT,accepted INTEGER,purpose TEXT,created_at TEXT);
CREATE TABLE IF NOT EXISTS data_requests(id TEXT PRIMARY KEY,uid TEXT,kind TEXT,status TEXT,detail TEXT,created_at TEXT,resolved_at TEXT);
CREATE TABLE IF NOT EXISTS audit_log(id INTEGER PRIMARY KEY AUTOINCREMENT,uid TEXT,actor_role TEXT,action TEXT,target TEXT,payload_hash TEXT,created_at TEXT);
'''
POSTGRES_SCHEMA=[
'''CREATE TABLE IF NOT EXISTS users(uid TEXT PRIMARY KEY,name TEXT,email TEXT,role TEXT,created_at TEXT,last_at TEXT)''',
'''CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,uid TEXT,created_at TEXT)''',
'''CREATE TABLE IF NOT EXISTS progress(uid TEXT PRIMARY KEY,data TEXT,updated_at TEXT)''',
'''CREATE TABLE IF NOT EXISTS evidence(id TEXT PRIMARY KEY,uid TEXT,evidence_id TEXT,title TEXT,text_answer TEXT,link_url TEXT,file_name TEXT,file_path TEXT,file_blob BYTEA,file_mime TEXT,file_size BIGINT,file_sha256 TEXT,status TEXT,submitted_at TEXT,grade DOUBLE PRECISION,feedback TEXT,rubric_scores TEXT,graded_at TEXT)''',
'''CREATE TABLE IF NOT EXISTS config(key TEXT PRIMARY KEY,data TEXT,updated_at TEXT)''',
'''CREATE TABLE IF NOT EXISTS events(id BIGSERIAL PRIMARY KEY,uid TEXT,type TEXT,payload TEXT,created_at TEXT)''',
'''CREATE TABLE IF NOT EXISTS teacher_records(id TEXT PRIMARY KEY,kind TEXT,data TEXT,created_at TEXT)''',
'''CREATE TABLE IF NOT EXISTS acknowledgements(id TEXT PRIMARY KEY,uid TEXT,indicator_id TEXT,session_id TEXT,statement TEXT,response TEXT,observation TEXT,resource_version TEXT,resource_hash TEXT,created_at TEXT)''',
'''CREATE TABLE IF NOT EXISTS practice_evidence(id TEXT PRIMARY KEY,indicator_id TEXT,session_id TEXT,kind TEXT,title TEXT,payload TEXT,resource_version TEXT,evidence_hash TEXT,created_at TEXT)''',
'''CREATE TABLE IF NOT EXISTS privacy_consents(id TEXT PRIMARY KEY,uid TEXT,notice_version TEXT,accepted INTEGER,purpose TEXT,created_at TEXT)''',
'''CREATE TABLE IF NOT EXISTS data_requests(id TEXT PRIMARY KEY,uid TEXT,kind TEXT,status TEXT,detail TEXT,created_at TEXT,resolved_at TEXT)''',
'''CREATE TABLE IF NOT EXISTS audit_log(id BIGSERIAL PRIMARY KEY,uid TEXT,actor_role TEXT,action TEXT,target TEXT,payload_hash TEXT,created_at TEXT)'''
]

def init_storage():
    with DBConn() as c:
        if USE_POSTGRES:
            for stmt in POSTGRES_SCHEMA: c.execute(stmt)
            for stmt in [
                'ALTER TABLE evidence ADD COLUMN IF NOT EXISTS file_blob BYTEA',
                'ALTER TABLE evidence ADD COLUMN IF NOT EXISTS file_mime TEXT',
                'ALTER TABLE evidence ADD COLUMN IF NOT EXISTS file_size BIGINT',
                'ALTER TABLE evidence ADD COLUMN IF NOT EXISTS file_sha256 TEXT',
                'ALTER TABLE practice_evidence ADD COLUMN IF NOT EXISTS resource_version TEXT',
                'ALTER TABLE practice_evidence ADD COLUMN IF NOT EXISTS evidence_hash TEXT'
            ]: c.execute(stmt)
        else:
            c.executescript(SQLITE_SCHEMA)
            for table, additions in {
                'practice_evidence':[('resource_version','TEXT'),('evidence_hash','TEXT')],
                'evidence':[('file_blob','BLOB'),('file_mime','TEXT'),('file_size','INTEGER'),('file_sha256','TEXT')]
            }.items():
                cols={r['name'] for r in c.execute(f'PRAGMA table_info({table})').fetchall()}
                for name,typ in additions:
                    if name not in cols: c.execute(f'ALTER TABLE {table} ADD COLUMN {name} {typ}')

def conn(): return DBConn()

def now(): return datetime.now(timezone.utc).isoformat()
def audit(c,uid,role,action,target='',payload=None):
    raw=json.dumps(payload or {},sort_keys=True,ensure_ascii=False).encode('utf-8')
    c.execute('INSERT INTO audit_log(uid,actor_role,action,target,payload_hash,created_at) VALUES(?,?,?,?,?,?)',(uid,role,action,target,hashlib.sha256(raw).hexdigest(),now()))

def deepmerge(a,b):
    out=dict(a or {})
    for k,v in (b or {}).items(): out[k]=deepmerge(out.get(k,{}),v) if isinstance(v,dict) and isinstance(out.get(k),dict) else v
    return out

def _b64e(raw:bytes): return base64.urlsafe_b64encode(raw).decode().rstrip('=')
def _b64d(txt:str): return base64.urlsafe_b64decode(txt + '='*((4-len(txt)%4)%4))
def issue_token(user:dict):
    ts=int(datetime.now(timezone.utc).timestamp())
    payload={k:user[k] for k in ('uid','name','email','role')}
    payload.update({'iat':ts,'exp':ts+SESSION_HOURS*3600,'jti':uuid.uuid4().hex})
    body=_b64e(json.dumps(payload,separators=(',',':'),ensure_ascii=False).encode())
    sig=_b64e(hmac.new(SESSION_SECRET,body.encode(),hashlib.sha256).digest())
    return f'nxs1.{body}.{sig}'
def user_from(token):
    if not token: raise HTTPException(401,'Sesión requerida')
    try:
        prefix,body,sig=token.split('.',2)
        if prefix!='nxs1': raise ValueError('formato')
        expected=_b64e(hmac.new(SESSION_SECRET,body.encode(),hashlib.sha256).digest())
        if not hmac.compare_digest(sig,expected): raise ValueError('firma')
        data=json.loads(_b64d(body))
        if int(data.get('exp',0)) < int(datetime.now(timezone.utc).timestamp()): raise HTTPException(401,'Sesión expirada')
        if data.get('role') not in ('teacher','student'): raise ValueError('rol')
        return {k:data.get(k,'') for k in ('uid','name','email','role')}
    except HTTPException: raise
    except Exception: raise HTTPException(401,'Sesión inválida')

def authz(authorization): return user_from((authorization or '').replace('Bearer ','',1))
def teacher(authorization):
    u=authz(authorization)
    if u['role']!='teacher': raise HTTPException(403,'Se requiere rol docente')
    return u
class Login(BaseModel): role:str; name:str=''; email:str=''; password:str=''; courseCode:str=''; accessKey:str=''; privacyAccepted:bool=False
class Obj(BaseModel): data:dict
class Grade(BaseModel): grade:float; feedback:str=''; rubricScores:dict=Field(default_factory=dict); status:str='graded'

class Ack(BaseModel):
    indicatorId:str
    sessionId:str=''
    statement:str
    response:str
    observation:str=''
    resourceVersion:str=''
    resourceHash:str=''
class PracticeEvidence(BaseModel):
    indicatorId:str
    sessionId:str=''
    kind:str='system'
    title:str
    payload:dict=Field(default_factory=dict)
    resourceVersion:str='NEXUS19'

app=FastAPI(title='NEXUS 19 Stable API')
_allowed_origins=[x.strip() for x in os.getenv('NEXUS_ALLOWED_ORIGINS','').split(',') if x.strip()]
if _allowed_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=_allowed_origins,
        allow_credentials=False,
        allow_methods=['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
        allow_headers=['Authorization','Content-Type'],
    )
@app.on_event('startup')
def production_guard():
    if NEXUS_ENV in ('production','prod') and TEACHER_PASSWORD=='cambiar-antes-de-publicar':
        raise RuntimeError('Defina NEXUS_TEACHER_PASSWORD antes de iniciar NEXUS en producción')
    init_storage()
@app.post('/api/auth/login')
def login(x:Login):
    role='teacher' if x.role=='teacher' else 'student'
    if role=='teacher' and x.password!=TEACHER_PASSWORD: raise HTTPException(401,'Contraseña docente incorrecta')
    if role=='student' and x.courseCode.strip().upper()!=COURSE_CODE.upper(): raise HTTPException(401,'Código de curso incorrecto')
    if role=='student' and not x.privacyAccepted: raise HTTPException(400,'Debe confirmar que leyó el aviso de privacidad')
    email=(x.email or f"{x.name.lower().replace(' ','_')}@local.nexus").strip().lower()
    if role=='student' and STUDENT_KEYS:
        expected=STUDENT_KEYS.get(email)
        if not expected or x.accessKey != expected: raise HTTPException(401,'Clave individual de estudiante incorrecta')
    uid=('t-' if role=='teacher' else 's-')+uuid.uuid5(uuid.NAMESPACE_DNS,email).hex[:20]; ts=now(); token=issue_token({'uid':uid,'name':x.name or ('Docente' if role=='teacher' else 'Estudiante'),'email':email,'role':role})
    with conn() as c:
        c.execute('INSERT INTO users(uid,name,email,role,created_at,last_at) VALUES(?,?,?,?,?,?) ON CONFLICT(uid) DO UPDATE SET name=excluded.name,email=excluded.email,last_at=excluded.last_at',(uid,x.name or ('Docente' if role=='teacher' else 'Estudiante'),email,role,ts,ts))
        audit(c,uid,role,'login','session',{'course':COURSE_CODE})
        if role=='student':
            c.execute('INSERT INTO privacy_consents(id,uid,notice_version,accepted,purpose,created_at) VALUES(?,?,?,?,?,?)',(uuid.uuid4().hex,uid,PRIVACY_NOTICE_VERSION,1,'academic_course',ts)); audit(c,uid,role,'privacy_notice_ack',PRIVACY_NOTICE_VERSION,{'accepted':True})
    return {'token':token,'user':{'uid':uid,'displayName':x.name or ('Docente' if role=='teacher' else 'Estudiante'),'email':email},'role':role}
@app.get('/api/auth/me')
def me(authorization:str|None=Header(None)):
    u=authz(authorization); return {'user':{'uid':u['uid'],'displayName':u['name'],'email':u['email']},'role':u['role']}
@app.post('/api/auth/logout')
def logout(authorization:str|None=Header(None)):
    return {'ok':True}
@app.get('/api/progress')
def get_progress(authorization:str|None=Header(None)):
    u=authz(authorization)
    with conn() as c:r=c.execute('SELECT data FROM progress WHERE uid=?',(u['uid'],)).fetchone()
    return json.loads(r['data']) if r else {}
@app.post('/api/progress')
def put_progress(x:Obj,authorization:str|None=Header(None)):
    u=authz(authorization); ts=now()
    with conn() as c:
        r=c.execute('SELECT data FROM progress WHERE uid=?',(u['uid'],)).fetchone(); old=json.loads(r['data']) if r else {}; new=deepmerge(old,x.data)
        c.execute('INSERT INTO progress(uid,data,updated_at) VALUES(?,?,?) ON CONFLICT(uid) DO UPDATE SET data=excluded.data,updated_at=excluded.updated_at',(u['uid'],json.dumps(new),ts))
    return new
@app.post('/api/events')
def event(x:Obj,authorization:str|None=Header(None)):
    u=authz(authorization)
    with conn() as c:c.execute('INSERT INTO events(uid,type,payload,created_at) VALUES(?,?,?,?)',(u['uid'],x.data.get('activityType','event'),json.dumps(x.data),now())); c.execute('UPDATE users SET last_at=? WHERE uid=?',(now(),u['uid']))
    return {'ok':True}
@app.get('/api/teacher/students')
def students(authorization:str|None=Header(None)):
    teacher(authorization)
    with conn() as c:
        rows=c.execute("SELECT * FROM users WHERE role='student' ORDER BY last_at DESC").fetchall(); out=[]
        for r in rows:
            p=c.execute('SELECT data,updated_at FROM progress WHERE uid=?',(r['uid'],)).fetchone(); ev=c.execute('SELECT COUNT(*) n FROM evidence WHERE uid=?',(r['uid'],)).fetchone()['n']
            out.append({'uid':r['uid'],'displayName':r['name'],'email':r['email'],'lastActivityAt':r['last_at'],'updatedAt':r['last_at'],'progress':json.loads(p['data']) if p else {},'evidenceCount':ev})
    return out

@app.get('/api/leaderboard')
def public_leaderboard(authorization:str|None=Header(None)):
    authz(authorization)
    with conn() as c:
        rows=c.execute("SELECT uid,data FROM progress").fetchall(); out=[]
        for r in rows:
            try: p=json.loads(r['data'] or '{}')
            except Exception: p={}
            item=p.get('leaderboard')
            if item and isinstance(item,dict) and item.get('alias'):
                out.append({'uid':r['uid'],'alias':str(item.get('alias'))[:24],'team':item.get('team'),'avatar':item.get('avatar'),'level':item.get('level'), 'weeklyKey':item.get('weeklyKey'),'weeklyLessons':item.get('weeklyLessons',0),'weeklyBonuses':item.get('weeklyBonuses',0),'weeklyScore':item.get('weeklyScore',0),'goalMet':bool(item.get('goalMet'))})
    return out
@app.get('/api/evidence/mine')
def mine(authorization:str|None=Header(None)):
    u=authz(authorization)
    fields='id,uid,evidence_id,title,text_answer,link_url,file_name,file_path,file_mime,file_size,file_sha256,status,submitted_at,grade,feedback,rubric_scores,graded_at'
    with conn() as c: rows=c.execute(f'SELECT {fields} FROM evidence WHERE uid=? ORDER BY submitted_at DESC',(u['uid'],)).fetchall()
    return [dict(r) | {'rubric_scores':json.loads(r['rubric_scores'] or '{}')} for r in rows]

def _safe_http_url(value:str):
    value=(value or '').strip()
    if not value: return ''
    if not re.match(r'^https?://',value,re.I): raise HTTPException(400,'El enlace debe iniciar con http:// o https://')
    return value

@app.post('/api/evidence/submit')
def submit_evidence(evidenceId:str=Form(...),title:str=Form(''),textAnswer:str=Form(''),linkUrl:str=Form(''),file:UploadFile|None=File(None),authorization:str|None=Header(None)):
    u=authz(authorization)
    if u['role']!='student': raise HTTPException(403,'Solo estudiantes entregan evidencias')
    eid=f"{u['uid']}:{evidenceId}"; fn=''; blob=None; mime=''; size=0; digest=''; linkUrl=_safe_http_url(linkUrl)
    if file and file.filename:
        ext=Path(file.filename).suffix.lower()
        if ext not in ALLOWED_EXT: raise HTTPException(400,'Tipo de archivo no permitido')
        fn=Path(file.filename).name[:160]
        buf=io.BytesIO()
        while True:
            chunk=file.file.read(1024*1024)
            if not chunk: break
            size+=len(chunk)
            if size > MAX_UPLOAD_MB*1024*1024: raise HTTPException(413,f'Archivo mayor a {MAX_UPLOAD_MB} MB')
            buf.write(chunk)
        blob=buf.getvalue(); mime=(file.content_type or 'application/octet-stream')[:120]; digest=hashlib.sha256(blob).hexdigest()
    ts=now()
    with conn() as c:
        c.execute('''INSERT INTO evidence(id,uid,evidence_id,title,text_answer,link_url,file_name,file_path,file_blob,file_mime,file_size,file_sha256,status,submitted_at,rubric_scores)
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET
        title=excluded.title,text_answer=excluded.text_answer,link_url=excluded.link_url,
        file_name=CASE WHEN excluded.file_name<>'' THEN excluded.file_name ELSE evidence.file_name END,
        file_blob=CASE WHEN excluded.file_name<>'' THEN excluded.file_blob ELSE evidence.file_blob END,
        file_mime=CASE WHEN excluded.file_name<>'' THEN excluded.file_mime ELSE evidence.file_mime END,
        file_size=CASE WHEN excluded.file_name<>'' THEN excluded.file_size ELSE evidence.file_size END,
        file_sha256=CASE WHEN excluded.file_name<>'' THEN excluded.file_sha256 ELSE evidence.file_sha256 END,
        status='submitted',submitted_at=excluded.submitted_at''',
        (eid,u['uid'],evidenceId,title,textAnswer,linkUrl,fn,'',blob,mime,size,digest,'submitted',ts,'{}'))
        audit(c,u['uid'],'student','evidence_submitted',eid,{'evidenceId':evidenceId,'fileName':fn,'fileSha256':digest,'fileSize':size})
    return {'ok':True,'id':eid,'submittedAt':ts,'fileSha256':digest or None}

@app.get('/api/teacher/evidence')
def all_evidence(authorization:str|None=Header(None)):
    teacher(authorization)
    fields='e.id,e.uid,e.evidence_id,e.title,e.text_answer,e.link_url,e.file_name,e.file_path,e.file_mime,e.file_size,e.file_sha256,e.status,e.submitted_at,e.grade,e.feedback,e.rubric_scores,e.graded_at,u.name student_name,u.email student_email'
    with conn() as c: rows=c.execute(f'SELECT {fields} FROM evidence e JOIN users u ON u.uid=e.uid ORDER BY e.submitted_at DESC').fetchall()
    return [dict(r)|{'rubric_scores':json.loads(r['rubric_scores'] or '{}')} for r in rows]

@app.post('/api/teacher/evidence/{eid}/grade')
def grade(eid:str,x:Grade,authorization:str|None=Header(None)):
    u=teacher(authorization)
    if not 0 <= float(x.grade) <= 100: raise HTTPException(400,'La calificación debe estar entre 0 y 100')
    with conn() as c:
        exists=c.execute('SELECT id FROM evidence WHERE id=?',(eid,)).fetchone()
        if not exists: raise HTTPException(404,'Evidencia no encontrada')
        c.execute('UPDATE evidence SET grade=?,feedback=?,rubric_scores=?,status=?,graded_at=? WHERE id=?',(x.grade,x.feedback,json.dumps(x.rubricScores),x.status,now(),eid)); audit(c,u['uid'],'teacher','grade_evidence',eid,{'grade':x.grade,'status':x.status})
    return {'ok':True}

@app.get('/api/evidence/file/{eid}')
def evidence_file(eid:str,token:str='',authorization:str|None=Header(None)):
    u=authz(authorization or (f'Bearer {token}' if token else None))
    with conn() as c:r=c.execute('SELECT uid,file_name,file_path,file_blob,file_mime FROM evidence WHERE id=?',(eid,)).fetchone()
    if not r or (u['role']!='teacher' and r['uid']!=u['uid']): raise HTTPException(404,'Archivo no encontrado')
    if r['file_blob'] is not None:
        blob=bytes(r['file_blob']); headers={'Content-Disposition':f'attachment; filename="{Path(r['file_name'] or "evidencia.bin").name}"'}
        return Response(content=blob,media_type=r['file_mime'] or 'application/octet-stream',headers=headers)
    if r['file_path']:
        p=DATA/r['file_path']
        if p.exists(): return FileResponse(p,filename=r['file_name'])
    raise HTTPException(404,'El archivo ya no está disponible')

@app.get('/api/config/{key}')
def get_config(key:str,authorization:str|None=Header(None)):
    authz(authorization)
    with conn() as c:r=c.execute('SELECT data FROM config WHERE key=?',(key,)).fetchone()
    return json.loads(r['data']) if r else {}
@app.post('/api/config/{key}')
def set_config(key:str,x:Obj,authorization:str|None=Header(None)):
    teacher(authorization)
    with conn() as c:c.execute('INSERT INTO config(key,data,updated_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET data=excluded.data,updated_at=excluded.updated_at',(key,json.dumps(x.data),now()))
    return x.data

@app.get('/api/gradebook/mine')
def my_gradebook(authorization:str|None=Header(None)):
    u=authz(authorization)
    with conn() as c:return gradebook_for(c,u['uid'])
@app.get('/api/teacher/gradebook')
def teacher_gradebook(authorization:str|None=Header(None)):
    teacher(authorization)
    with conn() as c:
        users=c.execute("SELECT * FROM users WHERE role='student' ORDER BY name").fetchall()
        return [dict(uid=u['uid'],displayName=u['name'],email=u['email'],**gradebook_for(c,u['uid'])) for u in users]

@app.get('/api/analytics')
def analytics(authorization:str|None=Header(None)):
    teacher(authorization)
    with conn() as c:
        n=c.execute("SELECT COUNT(*) n FROM users WHERE role='student'").fetchone()['n']; submissions=c.execute('SELECT evidence_id,COUNT(*) n,AVG(grade) avg_grade FROM evidence GROUP BY evidence_id').fetchall(); events=c.execute("SELECT type,COUNT(*) n FROM events GROUP BY type").fetchall()
    return {'students':n,'submissions':[dict(x) for x in submissions],'events':[dict(x) for x in events]}


@app.post('/api/acknowledgements')
def save_ack(x:Ack,authorization:str|None=Header(None)):
    u=authz(authorization)
    if u['role']!='student': raise HTTPException(403,'Solo estudiantes confirman recepción o percepción')
    ts=now(); aid=uuid.uuid4().hex
    if x.response not in ('confirm','cannot_confirm','observation'): raise HTTPException(400,'Respuesta inválida')
    version=x.resourceVersion or 'NEXUS19'
    content_hash=x.resourceHash or hashlib.sha256(f'{version}|{x.indicatorId}|{x.sessionId}|{x.statement}'.encode('utf-8')).hexdigest()
    with conn() as c:
        c.execute('INSERT INTO acknowledgements(id,uid,indicator_id,session_id,statement,response,observation,resource_version,resource_hash,created_at) VALUES(?,?,?,?,?,?,?,?,?,?)',(aid,u['uid'],x.indicatorId,x.sessionId,x.statement,x.response,x.observation,version,content_hash,ts))
        c.execute('INSERT INTO events(uid,type,payload,created_at) VALUES(?,?,?,?)',(u['uid'],'practice_ack',json.dumps({'indicatorId':x.indicatorId,'sessionId':x.sessionId,'response':x.response}),ts))
    return {'ok':True,'id':aid,'createdAt':ts,'resourceVersion':version,'resourceHash':content_hash}

@app.get('/api/acknowledgements/mine')
def my_acks(authorization:str|None=Header(None)):
    u=authz(authorization)
    with conn() as c: rows=c.execute('SELECT * FROM acknowledgements WHERE uid=? ORDER BY created_at DESC',(u['uid'],)).fetchall()
    return [dict(r) for r in rows]

@app.get('/api/teacher/traceability')
def traceability(authorization:str|None=Header(None)):
    teacher(authorization)
    with conn() as c:
        students=c.execute("SELECT COUNT(*) n FROM users WHERE role='student'").fetchone()['n']
        acks=c.execute('SELECT indicator_id,response,COUNT(*) n,MAX(created_at) last_at FROM acknowledgements GROUP BY indicator_id,response').fetchall()
        ev=c.execute('SELECT * FROM practice_evidence ORDER BY created_at DESC').fetchall()
        sessions=c.execute("SELECT payload,created_at FROM events WHERE type IN ('session_open','session_close','practice_ack') ORDER BY created_at DESC").fetchall()
    return {'students':students,'acknowledgements':[dict(r) for r in acks],'practiceEvidence':[dict(r)|{'payload':json.loads(r['payload'] or '{}')} for r in ev],'sessionEvents':[dict(r)|{'payload':json.loads(r['payload'] or '{}')} for r in sessions]}

@app.post('/api/teacher/practice-evidence')
def save_practice_evidence(x:PracticeEvidence,authorization:str|None=Header(None)):
    u=teacher(authorization); ts=now(); eid=uuid.uuid4().hex
    version=(x.resourceVersion or 'NEXUS19').strip()
    canonical=json.dumps({'indicatorId':x.indicatorId,'sessionId':x.sessionId,'kind':x.kind,'title':x.title,'payload':x.payload,'resourceVersion':version},sort_keys=True,ensure_ascii=False,separators=(',',':'))
    evidence_hash=hashlib.sha256(canonical.encode('utf-8')).hexdigest()
    with conn() as c:
        c.execute('INSERT INTO practice_evidence(id,indicator_id,session_id,kind,title,payload,resource_version,evidence_hash,created_at) VALUES(?,?,?,?,?,?,?,?,?)',(eid,x.indicatorId,x.sessionId,x.kind,x.title,json.dumps(x.payload,ensure_ascii=False),version,evidence_hash,ts))
        audit(c,u['uid'],'teacher','practice_evidence_created',eid,{'indicatorId':x.indicatorId,'resourceVersion':version,'evidenceHash':evidence_hash})
    return {'ok':True,'id':eid,'createdAt':ts,'resourceVersion':version,'evidenceHash':evidence_hash}

@app.get('/api/teacher/records/{kind}')
def list_teacher_records(kind:str,authorization:str|None=Header(None)):
    teacher(authorization)
    with conn() as c: rows=c.execute('SELECT * FROM teacher_records WHERE kind=? ORDER BY created_at DESC',(kind,)).fetchall()
    return [dict(r)|{'data':json.loads(r['data'] or '{}')} for r in rows]

@app.get('/api/teacher/records/{kind}/{record_id}')
def get_teacher_record(kind:str,record_id:str,authorization:str|None=Header(None)):
    teacher(authorization)
    with conn() as c:r=c.execute('SELECT * FROM teacher_records WHERE kind=? AND id=?',(kind,record_id)).fetchone()
    return (dict(r)|{'data':json.loads(r['data'] or '{}')}) if r else {}

@app.post('/api/teacher/records/{kind}/{record_id}')
def put_teacher_record(kind:str,record_id:str,x:Obj,authorization:str|None=Header(None)):
    teacher(authorization); ts=now()
    with conn() as c:c.execute('INSERT INTO teacher_records(id,kind,data,created_at) VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET kind=excluded.kind,data=excluded.data,created_at=excluded.created_at',(record_id,kind,json.dumps(x.data),ts))
    return {'id':record_id,'kind':kind,'data':x.data,'created_at':ts}

@app.post('/api/teacher/records/{kind}')
def add_teacher_record(kind:str,x:Obj,authorization:str|None=Header(None)):
    teacher(authorization); ts=now(); rid=uuid.uuid4().hex
    with conn() as c:c.execute('INSERT INTO teacher_records(id,kind,data,created_at) VALUES(?,?,?,?)',(rid,kind,json.dumps(x.data),ts))
    return {'id':rid,'kind':kind,'data':x.data,'created_at':ts}


class DataRequest(BaseModel):
    kind:str
    detail:str=''

@app.post('/api/privacy/consent')
def privacy_consent(x:Obj,authorization:str|None=Header(None)):
    u=authz(authorization); data=x.data or {}; aid=uuid.uuid4().hex
    if not data.get('accepted'): raise HTTPException(400,'Se requiere aceptación explícita')
    version=data.get('noticeVersion') or PRIVACY_NOTICE_VERSION
    with conn() as c:
        c.execute('INSERT INTO privacy_consents(id,uid,notice_version,accepted,purpose,created_at) VALUES(?,?,?,?,?,?)',(aid,u['uid'],version,1,data.get('purpose','academic'),now()))
        audit(c,u['uid'],u['role'],'privacy_consent',version,{'purpose':data.get('purpose','academic')})
    return {'ok':True,'noticeVersion':version}

@app.get('/api/privacy/export')
def privacy_export(authorization:str|None=Header(None)):
    u=authz(authorization)
    with conn() as c:
        progress=c.execute('SELECT data,updated_at FROM progress WHERE uid=?',(u['uid'],)).fetchone()
        evidence=c.execute('SELECT evidence_id,title,status,submitted_at,grade,feedback,graded_at FROM evidence WHERE uid=?',(u['uid'],)).fetchall()
        acks=c.execute('SELECT indicator_id,session_id,response,observation,resource_version,resource_hash,created_at FROM acknowledgements WHERE uid=?',(u['uid'],)).fetchall()
        consents=c.execute('SELECT notice_version,purpose,created_at FROM privacy_consents WHERE uid=?',(u['uid'],)).fetchall()
    return {'identity':{'uid':u['uid'],'name':u['name'],'email':u['email']},'progress':json.loads(progress['data']) if progress else {},'progressUpdatedAt':progress['updated_at'] if progress else None,'evidence':[dict(r) for r in evidence],'acknowledgements':[dict(r) for r in acks],'consents':[dict(r) for r in consents]}

@app.post('/api/privacy/request')
def privacy_request(x:DataRequest,authorization:str|None=Header(None)):
    u=authz(authorization); allowed={'access','rectification','deletion','restriction','objection'}
    if x.kind not in allowed: raise HTTPException(400,'Tipo de solicitud no reconocido')
    rid=uuid.uuid4().hex
    with conn() as c:
        c.execute('INSERT INTO data_requests(id,uid,kind,status,detail,created_at) VALUES(?,?,?,?,?,?)',(rid,u['uid'],x.kind,'received',x.detail,now()))
        audit(c,u['uid'],u['role'],'data_request',x.kind,{'id':rid})
    return {'ok':True,'id':rid,'status':'received','note':'La solicitud requiere resolución institucional; NEXUS no elimina automáticamente expedientes sujetos a obligaciones de conservación.'}

@app.get('/api/teacher/data-requests')
def teacher_data_requests(authorization:str|None=Header(None)):
    teacher(authorization)
    with conn() as c: rows=c.execute('SELECT d.*,u.name,u.email FROM data_requests d JOIN users u ON u.uid=d.uid ORDER BY d.created_at DESC').fetchall()
    return [dict(r) for r in rows]

@app.post('/api/teacher/backup')
def create_backup(authorization:str|None=Header(None)):
    teacher(authorization)
    if USE_POSTGRES:
        return {'ok':True,'managed':True,'storage':'PostgreSQL','createdAt':now(),'note':'La persistencia está en PostgreSQL. Use las funciones de restauración/backup del proveedor para copias físicas; NEXUS mantiene exportaciones académicas desde el portal.'}
    backups=DATA/'backups'; backups.mkdir(exist_ok=True); stamp=datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ'); dest=backups/f'nexus19-{stamp}.sqlite3'
    src=sqlite3.connect(DB); dst=sqlite3.connect(dest); src.backup(dst); dst.close(); src.close()
    digest=hashlib.sha256(dest.read_bytes()).hexdigest(); manifest=dest.with_suffix('.sha256'); manifest.write_text(digest+'  '+dest.name+'\n')
    return {'ok':True,'file':dest.name,'sha256':digest,'createdAt':now(),'warning':'En Render Free este archivo local puede perderse en un redeploy; configure DATABASE_URL para persistencia externa.'}

@app.get('/api/teacher/backups')
def list_backups(authorization:str|None=Header(None)):
    teacher(authorization)
    if USE_POSTGRES: return []
    backups=DATA/'backups'; backups.mkdir(exist_ok=True)
    return [{'file':p.name,'bytes':p.stat().st_size,'modifiedAt':datetime.fromtimestamp(p.stat().st_mtime,timezone.utc).isoformat(),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(backups.glob('*.sqlite3'),reverse=True)]

@app.get('/api/teacher/research-export')
def research_export(authorization:str|None=Header(None)):
    teacher(authorization)
    with conn() as c:
        users=c.execute("SELECT uid,name,email,created_at,last_at FROM users WHERE role='student' ORDER BY uid").fetchall(); rows=[]
        for u in users:
            g=gradebook_for(c,u['uid']); pr=c.execute('SELECT data FROM progress WHERE uid=?',(u['uid'],)).fetchone(); pdata=json.loads(pr['data']) if pr else {}
            pre=(pdata.get('measurementResponses') or {}).get('pretest',{}); post=(pdata.get('measurementResponses') or {}).get('posttest',{})
            rows.append({'uid':u['uid'],'name':u['name'],'email':u['email'],'last_at':u['last_at'],'pretest':pre,'posttest':post,'gradebook':g})
    return {'schemaVersion':'NEXUS19-RESEARCH-1','generatedAt':now(),'students':rows,'warning':'Participación, desempeño, aprendizaje y percepción deben analizarse por separado. Este archivo no demuestra causalidad.'}

@app.get('/api/teacher/audit-log')
def audit_log(authorization:str|None=Header(None)):
    teacher(authorization)
    with conn() as c: rows=c.execute('SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 2000').fetchall()
    return [dict(r) for r in rows]

@app.get('/health')
def health():
    db_ok=True; db_error=''
    try:
        with conn() as c: c.execute('SELECT 1').fetchone()
    except Exception as exc:
        db_ok=False; db_error=str(exc)[:220]
    return {
        'ok':db_ok,
        'product':'NEXUS 19',
        'release':'stable',
        'storage':'PostgreSQL' if USE_POSTGRES else 'SQLite',
        'persistent':USE_POSTGRES,
        'fileStorage':'database',
        'dataDir':None if USE_POSTGRES else str(DATA),
        'environment':NEXUS_ENV,
        'teacherPasswordConfigured':TEACHER_PASSWORD!='cambiar-antes-de-publicar',
        'sessionMode':'signed-stateless',
        'retentionDays':RETENTION_DAYS,
        'privacyNoticeVersion':PRIVACY_NOTICE_VERSION,
        'allowedOrigins':_allowed_origins,
        'deployment':'GitHub Pages + Render',
        'databaseOk':db_ok,
        'databaseError':db_error or None,
        'productionReady':bool(db_ok and USE_POSTGRES and TEACHER_PASSWORD!='cambiar-antes-de-publicar' and _allowed_origins),
        'warning':None if USE_POSTGRES else 'SQLite local es apropiado sólo para pruebas; configure DATABASE_URL antes de trabajar con datos reales.'
    }

app.mount('/',StaticFiles(directory=WEB,html=True),name='course')
