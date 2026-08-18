from pathlib import Path
import sqlite3,hashlib,datetime
ROOT=Path(__file__).resolve().parents[1]; data=ROOT/'nexus_data'; db=data/'nexus18.sqlite3'; out=data/'backups'; out.mkdir(parents=True,exist_ok=True)
stamp=datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ'); dest=out/f'nexus18-{stamp}.sqlite3'
s=sqlite3.connect(db); d=sqlite3.connect(dest); s.backup(d); d.close(); s.close(); h=hashlib.sha256(dest.read_bytes()).hexdigest(); dest.with_suffix('.sha256').write_text(h+'  '+dest.name+'\n'); print(dest); print(h)
