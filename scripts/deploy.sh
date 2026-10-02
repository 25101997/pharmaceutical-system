#!/usr/bin/env bash
set -euo pipefail

if [ ! -f deploy/docker/.env.prod ]; then
  echo "Falta deploy/docker/.env.prod. Ejecuta: make prod-setup"
  exit 1
fi

make prod-up
make prod-ps
