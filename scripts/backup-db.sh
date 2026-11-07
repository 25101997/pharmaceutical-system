#!/usr/bin/env bash
set -euo pipefail
ENV_FILE="${ENV_FILE:-deploy/docker/.env.prod}"
COMPOSE_FILE="${COMPOSE_FILE:-deploy/docker/docker-compose.prod.yml}"
if [[ ! -f "$ENV_FILE" ]]; then echo "No existe $ENV_FILE"; exit 1; fi
set -a; source "$ENV_FILE"; set +a
STAMP=$(date +%Y%m%d_%H%M%S)
DUMP="farmacias_${STAMP}.dmp"; LOG="farmacias_${STAMP}.log"
mkdir -p backups
DC=(docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE")
"${DC[@]}" exec -T oracle bash -lc "expdp '${DB_USER}/${DB_PASSWORD}@XEPDB1' schemas=${DB_USER} directory=DATA_PUMP_DIR dumpfile=${DUMP} logfile=${LOG}"
CID=$("${DC[@]}" ps -q oracle)
REMOTE=$(docker exec "$CID" sh -lc "find /opt/oracle -type f -name '${DUMP}' 2>/dev/null | head -1")
[[ -n "$REMOTE" ]] || { echo "No se encontró el dump dentro del contenedor"; exit 1; }
docker cp "$CID:$REMOTE" "backups/$DUMP"
echo "Backup creado: backups/$DUMP"
