#!/usr/bin/env bash
# Apply mechanical AI fixes for a changes_requested review and push to the PR branch.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# shellcheck source=lib.sh
source "${ROOT}/scripts/ci/lib.sh"

require_token

n="$(pr_number)"
attempts="$(autofix_attempt_count)"
max_attempts="${AI_AUTOFIX_MAX_ATTEMPTS:-3}"
if [[ "${attempts}" -ge "${max_attempts}" ]]; then
  log "Already made ${attempts} autofix commits (max ${max_attempts}) — leaving for a human"
  write_verdict "hold"
  github_api POST "/repos/${github_repo}/issues/${n}/comments" \
    -H "Content-Type: application/json" \
    -d "{\"body\":\"AI autofix stopped after ${attempts} attempts. Please update the PR (or remove the hold label).\"}" \
    >/dev/null
  exit 0
fi

review_path="${jenkins_dir}/review.json"
[[ -f "${review_path}" ]] || fail "missing ${review_path} — run ai-pr-review.sh first"

python3 - "${review_path}" "${jenkins_dir}/snippets.txt" <<'PY'
import json, os, sys
review = json.load(open(sys.argv[1]))
out = open(sys.argv[2], "w")
seen = set()
for finding in review.get("findings") or []:
    path = finding.get("path")
    if not path or path in seen:
        continue
    seen.add(path)
    if not os.path.isfile(path):
        out.write(f"===== {path} (missing) =====\n")
        continue
    text = open(path, errors="replace").read()
    if len(text) > 12000:
        text = text[:12000] + "\n[truncated]\n"
    out.write(f"===== {path} =====\n{text}\n\n")
PY

python3 -c 'import json,sys; print(json.dumps({"review": json.load(open(sys.argv[1])), "snippets": open(sys.argv[2]).read()}))' \
  "${review_path}" "${jenkins_dir}/snippets.txt" \
  | python3 "${ROOT}/scripts/ci/ai_ollama.py" autofix > "${jenkins_dir}/autofix.json"

python3 - "${jenkins_dir}/autofix.json" <<'PY'
import json, os, sys
data = json.load(open(sys.argv[1]))
edits = data.get("edits") or []
applied = 0
skipped = []
for edit in edits:
    path = edit.get("path")
    old, new = edit.get("old") or "", edit.get("new")
    if new is None or not path or not old:
        skipped.append(f"{path}: incomplete edit")
        continue
    if path.startswith("jenkins/secrets") or path.endswith(".env") or "/.env" in path:
        skipped.append(f"{path}: refused secret path")
        continue
    if not os.path.isfile(path):
        skipped.append(f"{path}: missing")
        continue
    text = open(path).read()
    count = text.count(old)
    if count != 1:
        skipped.append(f"{path}: old snippet matched {count} times")
        continue
    open(path, "w").write(text.replace(old, new, 1))
    applied += 1
open(".jenkins/autofix-applied", "w").write(str(applied))
open(".jenkins/autofix-skipped", "w").write("\n".join(skipped))
print(f"applied={applied} skipped={len(skipped)}")
for s in skipped:
    print(f"  skip: {s}")
PY

applied="$(cat "${jenkins_dir}/autofix-applied")"
if [[ "${applied}" == "0" ]]; then
  log "No mechanical edits applied — PR stays open for a human"
  write_verdict "hold"
  skip_notes="$(cat "${jenkins_dir}/autofix-skipped")"
  python3 - "${github_repo}" "${n}" "${skip_notes}" <<'PY'
import json, os, sys, urllib.request
repo, number, notes = sys.argv[1], sys.argv[2], sys.argv[3]
body = "AI review requested changes, but autofix could not apply a safe patch.\n\n" + (notes or "(no snippet matches)")
req = urllib.request.Request(
    f"https://api.github.com/repos/{repo}/issues/{number}/comments",
    data=json.dumps({"body": body[:65000]}).encode(),
    method="POST",
    headers={
        "Authorization": f"Bearer {os.environ['GITHUB_TOKEN']}",
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json",
    },
)
urllib.request.urlopen(req, timeout=30).read()
PY
  exit 0
fi

msg="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1])).get("commit_message") or "fix(ai-review): apply review findings")' "${jenkins_dir}/autofix.json")"
git add -A
if git diff --cached --quiet; then
  log "Working tree unchanged after edits"
  write_verdict "hold"
  exit 0
fi

git config user.email "jenkins@myisland.local"
git config user.name "my-island-jenkins"
git commit -m "${msg}"

branch="${CHANGE_BRANCH:-}"
if [[ -z "${branch}" ]]; then
  branch="$(github_api GET "/repos/${github_repo}/pulls/${n}" | python3 -c 'import json,sys; print(json.load(sys.stdin)["head"]["ref"])')"
fi

log "Pushing autofix to origin/${branch}"
git remote set-url origin "https://github.com/${github_repo}.git" >/dev/null
git -c http.extraheader="AUTHORIZATION: bearer ${GITHUB_TOKEN}" push origin "HEAD:refs/heads/${branch}"

write_verdict "autofixed"
log "Pushed autofix; a new PR build should run"
