#!/usr/bin/env bash
# Per-boot: nested Docker, then the same compose stack local/CI use.
set -euo pipefail

sudo service docker start

for _ in $(seq 1 60); do
  if docker info >/dev/null 2>&1; then
    break
  fi
  sleep 1
done
docker info >/dev/null

# Infra + catalog. Cloud Agent *is* the workspace (do not start that service).
REPO="$(cd "$(dirname "$0")/.." && pwd)"
exec "$REPO/scripts/dev" up
