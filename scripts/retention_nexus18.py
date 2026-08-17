from pathlib import Path
import sqlite3,datetime,os,argparse
p=argparse.ArgumentParser();p.add_argument('--dry-run',action='store_true');a=p.parse_args();ROOT=Path(__file__).resolve().parents[1];db=ROOT/'nexus_data'/'nexus18.sqlite3';days=int(os.getenv('NEXUS_RETENTION_DAYS','730')); cutoff=(datetime.datetime.now(datetime.timezone.utc)-datetime.timedelta(days=days)).isoformat(); c=sqlite3.connect(db);
# Se depuran sesiones y logs técnicos; expedientes académicos NO se borran automáticamente.
for table in ['sessions','audit_log']:
 col='created_at'; n=c.execute(f'SELECT COUNT(*) FROM {table} WHERE {col}<?',(cutoff,)).fetchone()[0]; print(table,n,'registros candidatos');
 if not a.dry_run: c.execute(f'DELETE FROM {table} WHERE {col}<?',(cutoff,));
if not a.dry_run:c.commit();c.close()
