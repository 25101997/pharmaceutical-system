#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="deploy/docker/.env.prod"
if [ ! -f "$ENV_FILE" ]; then
  echo "No existe $ENV_FILE. Ejecuta: make prod-setup"
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

mkdir -p backups
STAMP=$(date +"%Y%m%d_%H%M%S")
DUMP="farmacias_${STAMP}.dmp"
LOG="farmacias_${STAMP}.log"

# Data Pump escribe primero dentro del contenedor.
docker exec farmacias-prod-database \
  expdp "${DB_USER}/${DB_PASSWORD}@XEPDB1" \
  DIRECTORY=DATA_PUMP_DIR \
  DUMPFILE="$DUMP" \
  LOGFILE="$LOG" \
  SCHEMAS="$DB_USER"

# En Oracle XE, DATA_PUMP_DIR normalmente apunta a /opt/oracle/admin/XE/dpdump.
docker cp "farmacias-prod-database:/opt/oracle/admin/XE/dpdump/$DUMP" "backups/$DUMP"
docker cp "farmacias-prod-database:/opt/oracle/admin/XE/dpdump/$LOG" "backups/$LOG"

echo "Backup creado: backups/$DUMP"
