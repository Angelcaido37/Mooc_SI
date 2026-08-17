# NEXUS 18 · Respaldos, restauración y retención

- `python scripts/backup_nexus18.py`: copia consistente SQLite + SHA-256.
- `python scripts/restore_nexus18.py <archivo>`: verifica integridad SQLite y restaura dejando copia previa.
- `python scripts/retention_nexus18.py --dry-run`: muestra candidatos conforme a `NEXUS_RETENTION_DAYS`.

Por seguridad jurídica/académica, la rutina automática sólo depura sesiones y bitácoras técnicas antiguas; no elimina calificaciones, evidencias ni acuses sin una política institucional explícita.
