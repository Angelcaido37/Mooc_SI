from pathlib import Path
import sys,sqlite3,hashlib,shutil,datetime
if len(sys.argv)!=2: raise SystemExit('Uso: python scripts/restore_nexus18.py nexus_data/backups/archivo.sqlite3')
ROOT=Path(__file__).resolve().parents[1]; src=Path(sys.argv[1]).resolve(); dest=ROOT/'nexus_data'/'nexus18.sqlite3'
if not src.exists(): raise SystemExit('Respaldo no encontrado')
con=sqlite3.connect(src); ok=con.execute('PRAGMA integrity_check').fetchone()[0]; con.close();
if ok!='ok': raise SystemExit('Respaldo corrupto: '+ok)
if dest.exists(): shutil.copy2(dest,dest.with_suffix('.pre-restore-'+datetime.datetime.now().strftime('%Y%m%d%H%M%S')+'.sqlite3'))
shutil.copy2(src,dest); print('Restaurado',dest,'SHA256',hashlib.sha256(dest.read_bytes()).hexdigest())
