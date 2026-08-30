#!/usr/bin/env bash
# Confirm production (or any deployed compose stack) is healthy.
# Usage: scripts/confirm-prod.sh [base-url]
# Example: scripts/confirm-prod.sh http://localhost
#          scripts/confirm-prod.sh http://host.docker.internal:80

set -euo pipefail

BASE_URL="${1:-${CONFIRM_BASE_URL:-http://localhost}}"
BASE_URL="${BASE_URL%/}"
RETRIES="${CONFIRM_RETRIES:-30}"
SLEEP_SECS="${CONFIRM_SLEEP_SECS:-5}"

log() { printf '[confirm-prod] %s\n' "$*"; }
fail() { log "FAIL: $*"; exit 1; }

wait_http() {
  local url="$1"
  local expect_code="${2:-200}"
  local i
  for i in $(seq 1 "${RETRIES}"); do
    code="$(curl -sS -o /tmp/confirm-prod.body -w '%{http_code}' --max-time 10 "${url}" || true)"
    if [[ "${code}" == "${expect_code}" ]]; then
      log "OK ${url} → ${code}"
      return 0
    fi
    log "waiting ${url} (got ${code:-err}) attempt ${i}/${RETRIES}"
    sleep "${SLEEP_SECS}"
  done
  fail "${url} did not return ${expect_code} after ${RETRIES} attempts"
}

log "Base URL: ${BASE_URL}"

# API health (Spring Actuator under context-path /api)
wait_http "${BASE_URL}/api/actuator/health" 200
if ! grep -q '"status"[[:space:]]*:[[:space:]]*"UP"' /tmp/confirm-prod.body \
  && ! grep -q '"status":"UP"' /tmp/confirm-prod.body; then
  cat /tmp/confirm-prod.body || true
  fail "actuator health JSON is not UP"
fi
log "Actuator status UP"

# Frontend (nginx SPA)
wait_http "${BASE_URL}/" 200

# API public campsites list (smoke of DB + app wiring)
wait_http "${BASE_URL}/api/campsites" 200

log "Production confirmation passed"
