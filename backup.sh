#!/bin/bash
BACKUP_DIR="/var/backups/postgresql"
mkdir -p $BACKUP_DIR
TIMESTAMP=$(date +%Y%m%d_%H%M)
pg_dump "postgresql://fintech_user:Basketball%400615@localhost:5432/fintech_db" | gzip > "$BACKUP_DIR/fintech_db_$TIMESTAMP.sql.gz"
# Manter apenas últimos 7 dias
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
echo "$(date) - Backup concluído: fintech_db_$TIMESTAMP.sql.gz" >> /var/log/zurt-backup.log
