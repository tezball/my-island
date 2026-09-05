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

# Infra only — the Cloud Agent *is* the workspace.
docker compose up -d postgres loki prometheus alertmanager grafana \
  --wait --wait-timeout 300
