#!/usr/bin/env bash
# AI-review the current PR via Ollama and post a GitHub pull-request review.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# shellcheck source=lib.sh
source "${ROOT}/scripts/ci/lib.sh"

require_token

n="$(pr_number)"
target="${CHANGE_TARGET:-main}"
git fetch origin "${target}" --depth=50 >/dev/null 2>&1 || true

diff_file="${jenkins_dir}/pr.diff"
if git rev-parse --verify "origin/${target}" >/dev/null 2>&1; then
  git diff "origin/${target}...HEAD" > "${diff_file}"
else
  github_api GET "/repos/${github_repo}/pulls/${n}" \
    -H "Accept: application/vnd.github.diff" > "${diff_file}"
fi

log "Reviewing PR #${n} ($(wc -l < "${diff_file}") diff lines)"

python3 "${ROOT}/scripts/ci/ai_ollama.py" review < "${diff_file}" > "${jenkins_dir}/review.json"

verdict="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1])).get("verdict","changes_requested"))' "${jenkins_dir}/review.json")"
summary="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1])).get("summary",""))' "${jenkins_dir}/review.json")"

if pr_has_hold_label; then
  log "PR has hold/do-not-merge/wip label — will not auto-merge"
  write_verdict "hold"
else
  write_verdict "${verdict}"
fi

event="COMMENT"
if [[ "${verdict}" == "approve" ]]; then
  event="APPROVE"
elif [[ "${verdict}" == "changes_requested" ]]; then
  event="REQUEST_CHANGES"
fi

python3 - "${github_repo}" "${n}" "$(head_sha)" "${event}" "${jenkins_dir}/review.json" <<'PY'
import json, os, sys, urllib.error, urllib.request

repo, number, sha, event, path = sys.argv[1:6]
review = json.load(open(path))
comments = []
for finding in review.get("findings") or []:
    p = finding.get("path")
    body = finding.get("body") or finding.get("title") or ""
    if finding.get("title") and finding["title"] not in body:
        body = f"**{finding['title']}** ({finding.get('severity','')})\n\n{body}"
    if not p or not body:
        continue
    item = {"path": p, "body": body[:65536]}
    line = finding.get("line")
    if isinstance(line, int) and line > 0:
        item["line"] = line
        item["side"] = "RIGHT"
    comments.append(item)
    if len(comments) >= 12:
        break

payload = {
    "commit_id": sha,
    "body": (review.get("summary") or "AI review").strip()[:65536],
    "event": event,
    "comments": comments,
}
data = json.dumps(payload).encode()
req = urllib.request.Request(
    f"https://api.github.com/repos/{repo}/pulls/{number}/reviews",
    data=data,
    method="POST",
    headers={
        "Authorization": f"Bearer {os.environ['GITHUB_TOKEN']}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
    },
)
try:
    with urllib.request.urlopen(req, timeout=60) as resp:
        print(resp.read().decode()[:500])
except urllib.error.HTTPError as exc:
    detail = exc.read().decode("utf-8", errors="replace")
    # Fallback: top-level comment if inline comments were rejected (stale lines)
    if event != "COMMENT" or comments:
        fallback = {
            "commit_id": sha,
            "body": payload["body"] + "\n\n(Inline comments skipped: " + detail[:300] + ")",
            "event": event,
            "comments": [],
        }
        req2 = urllib.request.Request(
            f"https://api.github.com/repos/{repo}/pulls/{number}/reviews",
            data=json.dumps(fallback).encode(),
            method="POST",
            headers=req.headers,
        )
        try:
            with urllib.request.urlopen(req2, timeout=60) as resp:
                print(resp.read().decode()[:500])
            sys.exit(0)
        except urllib.error.HTTPError as exc2:
            print(exc2.read().decode("utf-8", errors="replace"), file=sys.stderr)
            sys.exit(1)
    print(detail, file=sys.stderr)
    sys.exit(1)
PY

log "Posted GitHub review event=${event} summary=${summary:0:120}"
