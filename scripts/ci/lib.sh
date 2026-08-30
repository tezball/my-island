#!/usr/bin/env bash
# Shared helpers for Jenkins PR automation scripts.
# shellcheck disable=SC2034

set -euo pipefail

github_repo="${GITHUB_REPO:-tezball/my-island}"
github_api_root="${GITHUB_API:-https://api.github.com}"
jenkins_dir="${JENKINS_WORK_DIR:-.jenkins}"
mkdir -p "${jenkins_dir}"

log() { printf '[pr-bot] %s\n' "$*"; }
fail() { log "FAIL: $*"; exit 1; }

require_token() {
  if [[ -z "${GITHUB_TOKEN:-}" ]]; then
    fail "GITHUB_TOKEN is not set. Put a PAT in jenkins/secrets/github-token (repo scope)."
  fi
}

github_api() {
  local method="$1" path="$2"
  shift 2
  require_token
  curl -sS -X "${method}" \
    -H "Authorization: Bearer ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "${github_api_root}${path}" \
    "$@"
}

github_api_code() {
  local method="$1" path="$2"
  shift 2
  require_token
  curl -sS -o "${jenkins_dir}/github-last.json" -w '%{http_code}' -X "${method}" \
    -H "Authorization: Bearer ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "${github_api_root}${path}" \
    "$@"
}

pr_number() {
  if [[ -n "${CHANGE_ID:-}" ]]; then
    printf '%s' "${CHANGE_ID}"
    return
  fi
  if [[ -n "${PR_NUMBER:-}" ]]; then
    printf '%s' "${PR_NUMBER}"
    return
  fi
  fail "No CHANGE_ID or PR_NUMBER — not a pull-request build"
}

head_sha() {
  git rev-parse HEAD
}

write_verdict() {
  printf '%s\n' "$1" > "${jenkins_dir}/verdict"
  log "verdict=$1"
}

pr_has_hold_label() {
  local n labels
  n="$(pr_number)"
  labels="$(github_api GET "/repos/${github_repo}/issues/${n}/labels")"
  printf '%s' "${labels}" | grep -Eqi '"name"[[:space:]]*:[[:space:]]*"(hold|do-not-merge|wip)"'
}

autofix_attempt_count() {
  local target="${CHANGE_TARGET:-main}"
  git log --oneline "origin/${target}..HEAD" 2>/dev/null | grep -c 'fix(ai-review):' || true
}
