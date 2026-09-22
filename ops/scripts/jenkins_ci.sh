#!/usr/bin/env bash
# Sourced by Jenkinsfile (WF-051). Not for humans.
# Copies $WORKSPACE onto a host path Docker Desktop can bind-mount.

jenkins_ci_host_root() {
  local host="${HOST_REPO:-}"
  local ws="${WORKSPACE:-}"
  if [ -n "$host" ] && [ -n "$ws" ] && [ -f "$ws/Jenkinsfile" ] && [ "$ws" != "$host" ]; then
    local safe
    safe="$(printf '%s' "${JOB_BASE_NAME:-ci}" | tr -c 'A-Za-z0-9._-' '-')"
    printf '%s' "${host%/*}/my-island-ci-${safe}"
  elif [ -n "$ws" ] && [ -f "$ws/Jenkinsfile" ]; then
    printf '%s' "$ws"
  else
    printf '%s' "${host:-$PWD}"
  fi
}

jenkins_ci_prepare() {
  local dest ws
  dest="$(jenkins_ci_host_root)"
  ws="${WORKSPACE:-}"
  if [ -n "$ws" ] && [ -f "$ws/Jenkinsfile" ] && [ "$dest" != "$ws" ]; then
    rm -rf "$dest"
    mkdir -p "$dest"
    cp -a "$ws"/. "$dest"/
  fi
  printf '%s\n' "$dest" > "${WORKSPACE:-.}/.ci-root"
  echo "CI_ROOT=$dest"
}

jenkins_ci_cd() {
  local root
  root="$(cat "${WORKSPACE:-.}/.ci-root" 2>/dev/null || jenkins_ci_host_root)"
  cd "$root"
}

jenkins_isolate_env() {
  export COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-my-island-ci}"
  export OPS_PG_HOST_PORT="${OPS_PG_HOST_PORT:-15433}"
  export OPS_LOKI_HOST_PORT="${OPS_LOKI_HOST_PORT:-13101}"
  export OPS_PROM_HOST_PORT="${OPS_PROM_HOST_PORT:-19091}"
  export OPS_AM_HOST_PORT="${OPS_AM_HOST_PORT:-19094}"
  export OPS_GRAFANA_HOST_PORT="${OPS_GRAFANA_HOST_PORT:-13030}"
  export OPS_CATALOG_HOST_PORT="${OPS_CATALOG_HOST_PORT:-18081}"
  export OPS_WEB_HOST_PORT="${OPS_WEB_HOST_PORT:-15173}"
  export SKIP_JENKINS=1
  export SKIP_WEB=1
  export CATALOG_URL="${CATALOG_URL:-http://host.docker.internal:${OPS_CATALOG_HOST_PORT}}"
}

jenkins_status() {
  local root
  root="$(cat "${WORKSPACE:-.}/.ci-root" 2>/dev/null || jenkins_ci_host_root)"
  python3 "$root/ops/scripts/jenkins_github_status.py" "$@"
}
