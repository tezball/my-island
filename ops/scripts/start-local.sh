#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
docker compose -f compose.yml up -d
echo "waiting for Grafana..."
for i in $(seq 1 40); do
  if curl -sf http://127.0.0.1:3030/api/health >/dev/null; then
    echo "Grafana http://127.0.0.1:3030  admin/admin"
    echo "Prometheus http://127.0.0.1:9091"
    echo "Loki http://127.0.0.1:3101"
    echo "Alertmanager http://127.0.0.1:9094"
    echo "Postgres 127.0.0.1:5433  ops_reader / ops_reader  db ops"
    echo "Reload Cursor MCP after this."
    exit 0
  fi
  sleep 2
done
echo "Grafana did not become ready. docker compose -f ops/compose.yml logs grafana" >&2
exit 1
