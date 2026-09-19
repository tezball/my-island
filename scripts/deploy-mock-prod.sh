#!/usr/bin/env bash
# Deploy my-island to mock-prod VPS at domain root and remove fishing-journals apps (WF-032).
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO"

MOCK_PROD_HOST="${MOCK_PROD_HOST:-}"
MOCK_PROD_USER="${MOCK_PROD_USER:-}"
MOCK_PROD_SSH_PORT="${MOCK_PROD_SSH_PORT:-22}"
MOCK_PROD_SSH_KEY_PATH="${MOCK_PROD_SSH_KEY_PATH:-}"
MOCK_PROD_REMOTE_DIR="${MOCK_PROD_REMOTE_DIR:-/opt/my-island}"
HEALTH_PORT="${MOCK_PROD_CATALOG_HEALTH_PORT:-18081}"
HEALTH_WAIT_SECS="${MOCK_PROD_HEALTH_WAIT_SECS:-600}"
# Public checks must be HTTPS apex. MOCK_PROD_URL is sometimes http://<ssh host>,
# which Caddy 308s; curl -f treats that as failure.
if [[ -n "${MOCK_PROD_PUBLIC_ORIGIN:-}" ]]; then
  PUBLIC_ORIGIN="${MOCK_PROD_PUBLIC_ORIGIN}"
elif [[ "${MOCK_PROD_URL:-}" == https://* ]]; then
  PUBLIC_ORIGIN="${MOCK_PROD_URL}"
else
  PUBLIC_ORIGIN="https://fishing-journals.com"
fi
PUBLIC_ORIGIN="${PUBLIC_ORIGIN%/}"
PUBLIC_HEALTH_URL="${MOCK_PROD_PUBLIC_HEALTH_URL:-${PUBLIC_ORIGIN}/actuator/health}"
PUBLIC_INFO_URL="${MOCK_PROD_PUBLIC_INFO_URL:-${PUBLIC_ORIGIN}/actuator/info}"
CADDYFILE_HOST="${MOCK_PROD_CADDYFILE:-/home/ubuntu/app/server/Caddyfile}"
FJ_COMPOSE_DIR="${MOCK_PROD_FJ_COMPOSE_DIR:-/home/ubuntu/app/server}"

if [[ -z "$MOCK_PROD_HOST" || "$MOCK_PROD_HOST" == changeme* ]]; then
  echo "MOCK_PROD_HOST is not set (see .env.example)." >&2
  exit 1
fi
if [[ -z "$MOCK_PROD_USER" || "$MOCK_PROD_USER" == changeme* ]]; then
  echo "MOCK_PROD_USER is not set." >&2
  exit 1
fi
if [[ ! -f "$MOCK_PROD_SSH_KEY_PATH" ]]; then
  echo "MOCK_PROD_SSH_KEY_PATH must point to a readable private key (got: ${MOCK_PROD_SSH_KEY_PATH:-empty})." >&2
  exit 1
fi

EXPECTED_COMMIT="$(git -C "$REPO" rev-parse HEAD)"
EXPECTED_SHORT="$(git -C "$REPO" rev-parse --short=12 HEAD)"
EXPECTED_BRANCH="$(git -C "$REPO" rev-parse --abbrev-ref HEAD)"
APP_VERSION="${APP_VERSION:-0.0.1-SNAPSHOT}"
APP_BUILD_TIME="${APP_BUILD_TIME:-$(date -u +%Y-%m-%dT%H:%M:%SZ)}"
if [[ -z "$EXPECTED_COMMIT" ]]; then
  echo "Could not resolve git HEAD for deploy stamp." >&2
  exit 1
fi
if [[ "$EXPECTED_BRANCH" != "main" ]]; then
  echo "Refuse to deploy branch ${EXPECTED_BRANCH} — mock-prod tracks origin/main only (WF-040)." >&2
  exit 1
fi
echo "==> Stamping catalog image GIT_COMMIT=${EXPECTED_COMMIT} version=${APP_VERSION} branch=${EXPECTED_BRANCH}"

SSH_BASE=(
  ssh
  -i "$MOCK_PROD_SSH_KEY_PATH"
  -p "$MOCK_PROD_SSH_PORT"
  -o BatchMode=yes
  -o StrictHostKeyChecking=accept-new
)
RSYNC_SSH="ssh -i $(printf '%q' "$MOCK_PROD_SSH_KEY_PATH") -p $MOCK_PROD_SSH_PORT -o BatchMode=yes -o StrictHostKeyChecking=accept-new"
DEST="${MOCK_PROD_USER}@${MOCK_PROD_HOST}:${MOCK_PROD_REMOTE_DIR}/"

echo "==> Ensuring remote directory ${MOCK_PROD_REMOTE_DIR}"
"${SSH_BASE[@]}" "${MOCK_PROD_USER}@${MOCK_PROD_HOST}" \
  "sudo mkdir -p '${MOCK_PROD_REMOTE_DIR}' && sudo chown \$(id -u):\$(id -g) '${MOCK_PROD_REMOTE_DIR}'"

echo "==> Rsync repository to VPS"
rsync -az --delete \
  --exclude '.git/' \
  --exclude '.env' \
  --exclude 'node_modules/' \
  --exclude 'web/node_modules/' \
  --exclude 'web/dist/' \
  --exclude 'services/catalog/target/' \
  --exclude 'docs/.obsidian/' \
  --exclude 'docs/.smart-env/' \
  --exclude '.idea/' \
  -e "$RSYNC_SSH" \
  "$REPO/" "$DEST"

REMOTE_ENV=$(mktemp)
trap 'rm -f "$REMOTE_ENV"' EXIT
chmod 600 "$REMOTE_ENV"
cat >"$REMOTE_ENV" <<EOF
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID:-}
GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET:-}
VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID:-${GOOGLE_CLIENT_ID:-}}
GIT_COMMIT=${EXPECTED_COMMIT}
GIT_COMMIT_SHORT=${EXPECTED_SHORT}
GIT_BRANCH=${EXPECTED_BRANCH}
APP_VERSION=${APP_VERSION}
APP_BUILD_TIME=${APP_BUILD_TIME}
EOF

echo "==> Upload deploy env (Google OAuth names only; values not printed)"
scp -i "$MOCK_PROD_SSH_KEY_PATH" -P "$MOCK_PROD_SSH_PORT" -o BatchMode=yes -o StrictHostKeyChecking=accept-new \
  "$REMOTE_ENV" "${MOCK_PROD_USER}@${MOCK_PROD_HOST}:${MOCK_PROD_REMOTE_DIR}/.env.mock-prod"

echo "==> Reuse fishing-journals Google client if local env was empty"
"${SSH_BASE[@]}" "${MOCK_PROD_USER}@${MOCK_PROD_HOST}" bash -s <<REMOTE
set -euo pipefail
python3 - <<'PY'
from pathlib import Path
dest = Path("${MOCK_PROD_REMOTE_DIR}/.env.mock-prod")
fj = Path("${FJ_COMPOSE_DIR}/.env")
vals = {}
for line in dest.read_text().splitlines():
    if "=" in line and not line.startswith("#"):
        k, v = line.split("=", 1)
        vals[k] = v
need = not vals.get("GOOGLE_CLIENT_ID")
if need and fj.exists():
    for line in fj.read_text().splitlines():
        if line.startswith("GOOGLE_CLIENT_ID=") or line.startswith("GOOGLE_CLIENT_SECRET=") or line.startswith("VITE_GOOGLE_CLIENT_ID="):
            k, v = line.split("=", 1)
            vals[k] = v
    vals.setdefault("VITE_GOOGLE_CLIENT_ID", vals.get("GOOGLE_CLIENT_ID", ""))
    dest.write_text("".join(f"{k}={vals[k]}\n" for k, v in vals.items() if v is not None))
print("google_client_id_set", bool(vals.get("GOOGLE_CLIENT_ID")))
print("google_secret_set", bool(vals.get("GOOGLE_CLIENT_SECRET")))
print("git_commit_set", bool(vals.get("GIT_COMMIT")))
PY
REMOTE

echo "==> Patch Caddy to apex my-island (GIS paths /api/auth*)"
"${SSH_BASE[@]}" "${MOCK_PROD_USER}@${MOCK_PROD_HOST}" bash -s <<REMOTE
set -euo pipefail
python3 '${MOCK_PROD_REMOTE_DIR}/ops/deploy/caddy_apex.py' '${CADDYFILE_HOST}'
docker exec server-caddy-1 caddy reload --config /etc/caddy/Caddyfile
REMOTE

echo "==> Mute leftover fishing-journals down-alert email (mock-prod is not prod)"
"${SSH_BASE[@]}" "${MOCK_PROD_USER}@${MOCK_PROD_HOST}" bash -s <<REMOTE
set -euo pipefail
python3 '${MOCK_PROD_REMOTE_DIR}/ops/deploy/disable_legacy_alerts.py'
# Restart so bind-mounted files are re-read (in-place write + reload can miss an inode).
if docker ps --format '{{.Names}}' | grep -qx server-alertmanager-1; then
  docker restart server-alertmanager-1
fi
if docker ps --format '{{.Names}}' | grep -qx server-prometheus-1; then
  docker restart server-prometheus-1
fi
REMOTE

echo "==> docker compose build + up (project my-island)"
"${SSH_BASE[@]}" "${MOCK_PROD_USER}@${MOCK_PROD_HOST}" bash -s <<REMOTE
set -euo pipefail
cd '${MOCK_PROD_REMOTE_DIR}'
# Fresh catalog volume if a previous mock-prod Flyway V7 conflicts with main.
if docker exec my-island-postgres-1 psql -U ops -d catalog -tAc "select description from flyway_schema_history where version = '7'" 2>/dev/null | grep -qi 'user'; then
  echo "Resetting catalog volume (legacy V7 user_auth vs V7 place_image)"
  docker compose -f compose.yml -f compose.mock-prod.yml --env-file .env.mock-prod down
  docker volume rm my-island_ops_pg 2>/dev/null || true
fi
docker compose -f compose.yml -f compose.mock-prod.yml --env-file .env.mock-prod build
docker compose -f compose.yml -f compose.mock-prod.yml --env-file .env.mock-prod up -d --wait --wait-timeout 900 --force-recreate catalog web
REMOTE

echo "==> Dump then stop fishing-journals app services (keep Caddy + Grafana)"
"${SSH_BASE[@]}" "${MOCK_PROD_USER}@${MOCK_PROD_HOST}" bash -s <<REMOTE
set -euo pipefail
sudo mkdir -p /opt/backups
sudo chown "\$(id -u):\$(id -g)" /opt/backups
if docker ps --format '{{.Names}}' | grep -qx server-postgres-1; then
  stamp=\$(date -u +%Y%m%dT%H%M%SZ)
  echo "Dumping fishing-journals postgres to /opt/backups/fishing-journals-\${stamp}.sql.gz"
  docker exec server-postgres-1 bash -c 'pg_dumpall -U "\${POSTGRES_USER:-postgres}"' | gzip > "/opt/backups/fishing-journals-\${stamp}.sql.gz"
fi
cd '${FJ_COMPOSE_DIR}'
if [[ -f docker-compose.prod.yml ]]; then
  docker compose -f docker-compose.prod.yml stop api website admin-console venues-portal postgres || true
  docker compose -f docker-compose.prod.yml rm -f api website admin-console venues-portal postgres || true
fi
if [[ -f docker-compose.observability.yml ]]; then
  docker stop server-postgres-exporter-1 || true
fi
rm -rf /var/www/app || true
echo "fishing-journals app containers stopped"
docker ps --format 'table {{.Names}}\t{{.Status}}' | head -40
REMOTE

json_up() {
  local url="$1"
  local body
  body="$(curl -sfSL --max-time 15 -H 'Accept: application/json' "$url")" || return 1
  echo "$body" | grep -q '"status"[[:space:]]*:[[:space:]]*"UP"'
}

echo "==> Waiting for catalog health on VPS loopback :${HEALTH_PORT}"
deadline=$((SECONDS + HEALTH_WAIT_SECS))
until "${SSH_BASE[@]}" "${MOCK_PROD_USER}@${MOCK_PROD_HOST}" \
  "curl -sfS --max-time 8 -H 'Accept: application/json' 'http://127.0.0.1:${HEALTH_PORT}/actuator/health' | grep -q '\"status\"[[:space:]]*:[[:space:]]*\"UP\"'"; do
  if (( SECONDS >= deadline )); then
    echo "Timed out waiting for JSON UP at http://127.0.0.1:${HEALTH_PORT}/actuator/health (on VPS)" >&2
    "${SSH_BASE[@]}" "${MOCK_PROD_USER}@${MOCK_PROD_HOST}" \
      "docker compose -f '${MOCK_PROD_REMOTE_DIR}/compose.yml' -f '${MOCK_PROD_REMOTE_DIR}/compose.mock-prod.yml' --env-file '${MOCK_PROD_REMOTE_DIR}/.env.mock-prod' ps; docker logs --tail 80 my-island-catalog-1" >&2 || true
    exit 1
  fi
  sleep 5
done
echo "Direct catalog health 200 UP at VPS :${HEALTH_PORT}"

echo "==> Public health: ${PUBLIC_HEALTH_URL}"
pub_deadline=$((SECONDS + 120))
until json_up "$PUBLIC_HEALTH_URL"; do
  if (( SECONDS >= pub_deadline )); then
    echo "Timed out waiting for JSON UP at ${PUBLIC_HEALTH_URL}" >&2
    curl -sS -D - -o /tmp/island-health.body --max-time 15 "$PUBLIC_HEALTH_URL" | head -20 >&2 || true
    head -c 300 /tmp/island-health.body >&2 || true
    exit 1
  fi
  sleep 5
done
echo "Public catalog health 200 UP at ${PUBLIC_HEALTH_URL}"

echo "==> Public info must match GIT_COMMIT=${EXPECTED_COMMIT}: ${PUBLIC_INFO_URL}"
info_deadline=$((SECONDS + 120))
until python3 "$REPO/ops/scripts/check_deploy_info.py" \
  --url "$PUBLIC_INFO_URL" \
  --expect-commit "$EXPECTED_COMMIT" \
  --expect-version "$APP_VERSION" \
  --expect-env mock-prod; do
  if (( SECONDS >= info_deadline )); then
    echo "Timed out waiting for stamped catalog info at ${PUBLIC_INFO_URL}" >&2
    curl -sS -D - -o /tmp/island-info.body --max-time 15 -H 'Accept: application/json' "$PUBLIC_INFO_URL" | head -20 >&2 || true
    head -c 400 /tmp/island-info.body >&2 || true
    echo >&2
    exit 1
  fi
  sleep 5
done

echo "==> Seed published POIs (idempotent)"
"${SSH_BASE[@]}" "${MOCK_PROD_USER}@${MOCK_PROD_HOST}" bash -s <<REMOTE
set -euo pipefail
cd '${MOCK_PROD_REMOTE_DIR}'
python3 ops/scripts/import_leads.py --place-type poi --require-coords --publish-local \
  --base-url 'http://127.0.0.1:${HEALTH_PORT}'
REMOTE

echo "Apex Explore: ${PUBLIC_ORIGIN}/"
echo "Health: ${PUBLIC_HEALTH_URL}"
echo "Info:   ${PUBLIC_INFO_URL}  (version + git SHA — CI gate)"
echo "Google GIS: POST ${PUBLIC_ORIGIN}/api/auth/google  (idToken) — same path as fishing-journals"
echo "Deploy OK"
