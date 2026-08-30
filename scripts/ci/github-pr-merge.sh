#!/usr/bin/env bash
# Approve (if needed) and squash-merge the current PR.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# shellcheck source=lib.sh
source "${ROOT}/scripts/ci/lib.sh"

require_token

if [[ "${AUTO_MERGE_PRS:-true}" != "true" ]]; then
  log "AUTO_MERGE_PRS is not true — skipping merge"
  exit 0
fi

n="$(pr_number)"
verdict="$(cat "${jenkins_dir}/verdict" 2>/dev/null || echo approve)"

if [[ "${verdict}" != "approve" ]]; then
  log "verdict=${verdict} — not merging"
  exit 0
fi

if [[ -n "${CHANGE_FORK:-}" ]]; then
  log "Fork PR (${CHANGE_FORK}) — review only, no auto-merge"
  write_verdict "hold"
  exit 0
fi

if pr_has_hold_label; then
  log "hold/do-not-merge/wip label present — skipping merge"
  exit 0
fi

sha="$(head_sha)"
title="$(github_api GET "/repos/${github_repo}/pulls/${n}" | python3 -c 'import json,sys; d=json.load(sys.stdin); print(d.get("title") or "PR")')"

code="$(github_api_code PUT "/repos/${github_repo}/pulls/${n}/merge" \
  -H "Content-Type: application/json" \
  -d "$(python3 -c 'import json,sys; print(json.dumps({
    "merge_method": "squash",
    "sha": sys.argv[1],
    "commit_title": sys.argv[2][:72],
    "commit_message": "Auto-merged by Jenkins after AI review + CI."
  }))' "${sha}" "${title}")")"

if [[ "${code}" == "200" ]]; then
  log "Squash-merged PR #${n}"
  write_verdict "merged"
  exit 0
fi

body="$(cat "${jenkins_dir}/github-last.json")"
if printf '%s' "${body}" | grep -qi 'already merged'; then
  log "PR #${n} already merged"
  write_verdict "merged"
  exit 0
fi

log "Merge returned HTTP ${code}: ${body}"
fail "Could not merge PR #${n}"
