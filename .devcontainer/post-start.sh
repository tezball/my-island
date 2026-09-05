#!/usr/bin/env bash
# Map laptop/cloud localhost ports onto 127.0.0.1 inside the workspace
# container so .cursor/mcp.json (127.0.0.1:3030 / 5433) keeps working.
set -euo pipefail

forwards=(
  3030:grafana:3000
  5433:postgres:5432
  9091:prometheus:9090
  3101:loki:3100
  9094:alertmanager:9093
)

port_open() {
  local port="$1"
  bash -c "echo >/dev/tcp/127.0.0.1/${port}" >/dev/null 2>&1
}

for spec in "${forwards[@]}"; do
  listen="${spec%%:*}"
  rest="${spec#*:}"
  host="${rest%%:*}"
  port="${rest##*:}"
  if port_open "${listen}"; then
    continue
  fi
  socat TCP-LISTEN:"${listen}",bind=127.0.0.1,fork,reuseaddr TCP:"${host}":"${port}" &
done
