#!/usr/bin/env bash
set -euo pipefail
ENVIRONMENT="${1:-prod}"
case "$ENVIRONMENT" in
  dev) make dev-build ;;
  qa) make qa-build ;;
  prod) make prod-build ;;
  *) echo "Uso: $0 dev|qa|prod"; exit 1 ;;
esac
