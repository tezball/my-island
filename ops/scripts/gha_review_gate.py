#!/usr/bin/env python3
"""WF-050: squash-merge a ready PR only after green CI and a valid Approve.

GitHub Actions is not permitted to createReview APPROVE. Chat never merges.
AUTOMERGE_POLL=1 lists open PRs and runs this same gate.

Exit 0 for skip / waiting-for-review / waiting-for-CI / merge attempted.
Never fail the merge job red because Approve is missing.
"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from dataclasses import dataclass
from typing import Any

REQUIRED_CHECK_NAMES = (
    "unit tests",
    "catalog tests",
    "web tests",
    "compose stack",
)
CHECK_ALIASES = {
    "unit tests": ("unit tests", "unit"),
    "catalog tests": ("catalog tests", "catalog"),
    "web tests": ("web tests", "web"),
    "compose stack": ("compose stack", "stack"),
}
BOT_LOGINS = frozenset({"github-actions[bot]"})
# REST listReviews state. Creating a review uses event APPROVE.
APPROVED = "APPROVED"
CHANGES_REQUESTED = "CHANGES_REQUESTED"
DISMISSED = "DISMISSED"
COMMENTED = "COMMENTED"
PENDING = "PENDING"


@dataclass(frozen=True)
class Decision:
    action: str  # skip | wait | merge
    reason: str


class GateError(RuntimeError):
    pass


def _login(user: Any) -> str:
    if not isinstance(user, dict):
        return ""
    return str(user.get("login") or "").strip()


def latest_vote_by_user(reviews: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    """Latest non-comment review per login. COMMENTED does not replace a vote."""
    ordered = sorted(
        (r for r in reviews if isinstance(r, dict)),
        key=lambda r: (str(r.get("submitted_at") or ""), int(r.get("id") or 0)),
    )
    votes: dict[str, dict[str, Any]] = {}
    for review in ordered:
        login = _login(review.get("user"))
        if not login:
            continue
        state = str(review.get("state") or "").upper()
        if state in {COMMENTED, PENDING}:
            continue
        if state == DISMISSED:
            votes.pop(login, None)
            continue
        votes[login] = review
    return votes


def changes_requested_blocks(reviews: list[dict[str, Any]]) -> bool:
    """Any latest (non-dismissed) CHANGES_REQUESTED blocks, even with an Approve."""
    for review in latest_vote_by_user(reviews).values():
        if str(review.get("state") or "").upper() == CHANGES_REQUESTED:
            return True
    return False


def has_valid_approve(
    pr: dict[str, Any], reviews: list[dict[str, Any]], head_sha: str
) -> tuple[bool, str]:
    author = _login(pr.get("user"))
    head = (head_sha or "").strip().lower()
    if not head:
        return False, "waiting for review"
    for login, review in latest_vote_by_user(reviews).items():
        if str(review.get("state") or "").upper() != APPROVED:
            continue
        if login in BOT_LOGINS:
            continue
        if author and login == author:
            continue
        commit_id = str(review.get("commit_id") or "").strip().lower()
        if commit_id != head:
            continue
        return True, f"valid APPROVED from {login}"
    return False, "waiting for review"


def _latest_check_for_label(
    runs: list[dict[str, Any]], label: str
) -> dict[str, Any] | None:
    aliases = CHECK_ALIASES[label]
    matches = []
    for run in runs:
        name = str(run.get("name") or "").strip().lower()
        if name in aliases or any(name.startswith(a) for a in aliases):
            matches.append(run)
    if not matches:
        return None
    matches.sort(
        key=lambda r: (
            str(r.get("started_at") or r.get("completed_at") or ""),
            int(r.get("id") or 0),
        )
    )
    return matches[-1]


def four_checks_success(runs: list[dict[str, Any]]) -> tuple[bool, str]:
    """True only when the four GHA job names succeeded on this SHA.

    ``runs`` are check-runs. Jenkins commit statuses reuse these context
    names but are a different API; they are not in this list, so a failing
    Jenkins status cannot hide a green Actions check-run. The latest
    check-run of each name wins (a later failure still blocks).
    """
    for label in REQUIRED_CHECK_NAMES:
        latest = _latest_check_for_label(runs, label)
        if latest is None:
            return False, f"waiting for CI ({label} missing)"
        status = str(latest.get("status") or "").lower()
        conclusion = str(latest.get("conclusion") or "").lower()
        if status and status != "completed":
            return False, f"waiting for CI ({label} {status})"
        if conclusion != "success":
            return False, f"waiting for CI ({label} {conclusion or 'unknown'})"
    return True, "four checks success"


def _is_fork(pr: dict[str, Any]) -> bool:
    head = pr.get("head") if isinstance(pr.get("head"), dict) else {}
    base = pr.get("base") if isinstance(pr.get("base"), dict) else {}
    head_repo = head.get("repo") if isinstance(head.get("repo"), dict) else {}
    base_repo = base.get("repo") if isinstance(base.get("repo"), dict) else {}
    head_full = str(head_repo.get("full_name") or "")
    base_full = str(base_repo.get("full_name") or "")
    return bool(head_full and base_full and head_full != base_full)


def should_mark_ready(
    *,
    pr: dict[str, Any],
    checks_green: bool,
    check_runs: list[dict[str, Any]] | None,
) -> bool:
    """A same-repo draft becomes ready only after the four checks succeeded.

    Agents open pull requests as drafts. CI still runs. This gate used to
    skip the draft and never come back, so a green PR stayed a draft.
    Forks stay drafts. A failed or pending check stays a draft.
    """
    if not pr.get("draft"):
        return False
    if pr.get("merged") or pr.get("merged_at"):
        return False
    if _is_fork(pr):
        return False
    if checks_green:
        return True
    ok, _why = four_checks_success(check_runs or [])
    return ok


def decide(
    *,
    pr: dict[str, Any],
    reviews: list[dict[str, Any]],
    head_sha: str,
    checks_green: bool,
    check_runs: list[dict[str, Any]] | None,
) -> Decision:
    if pr.get("merged") or pr.get("merged_at"):
        return Decision("skip", "already merged")
    if pr.get("draft"):
        return Decision("skip", "draft — skip")
    if _is_fork(pr):
        return Decision("skip", "fork — skip")

    if not checks_green:
        ok, why = four_checks_success(check_runs or [])
        if not ok:
            return Decision("wait", why)

    if changes_requested_blocks(reviews):
        return Decision("wait", "CHANGES_REQUESTED blocks")

    ok, why = has_valid_approve(pr, reviews, head_sha)
    if not ok:
        return Decision("wait", why)

    return Decision("merge", why)


def _github_request(
    method: str, url: str, token: str, payload: dict[str, Any] | None = None, timeout: float = 30
) -> tuple[Any, str]:
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "my-island-wf-050",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    data = None
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = resp.read().decode("utf-8")
            link = resp.headers.get("Link") or ""
            return (json.loads(body) if body else None), link
    except urllib.error.HTTPError as exc:
        err_body = exc.read().decode("utf-8", errors="replace")
        raise GateError(f"HTTP {exc.code} {method} {url}: {err_body[:240]}") from exc
    except urllib.error.URLError as exc:
        raise GateError(f"request failed {method} {url}: {exc.reason}") from exc


def _next_link(link: str) -> str | None:
    for part in link.split(","):
        bit = part.strip()
        if 'rel="next"' in bit:
            start = bit.find("<")
            end = bit.find(">")
            if start >= 0 and end > start:
                return bit[start + 1 : end]
    return None


def fetch_pr(owner: str, repo: str, number: int, token: str) -> dict[str, Any]:
    url = f"https://api.github.com/repos/{owner}/{repo}/pulls/{number}"
    payload, _ = _github_request("GET", url, token)
    if not isinstance(payload, dict):
        raise GateError("pull request payload missing")
    return payload


def fetch_reviews(owner: str, repo: str, number: int, token: str) -> list[dict[str, Any]]:
    url = (
        f"https://api.github.com/repos/{owner}/{repo}/pulls/{number}/reviews"
        "?per_page=100"
    )
    out: list[dict[str, Any]] = []
    while url:
        payload, link = _github_request("GET", url, token)
        if not isinstance(payload, list):
            raise GateError("reviews payload missing list")
        out.extend(r for r in payload if isinstance(r, dict))
        url = _next_link(link) or ""
    return out


def fetch_check_runs(owner: str, repo: str, sha: str, token: str) -> list[dict[str, Any]]:
    url = (
        f"https://api.github.com/repos/{owner}/{repo}/commits/{sha}/check-runs"
        "?per_page=100"
    )
    out: list[dict[str, Any]] = []
    while url:
        payload, link = _github_request("GET", url, token)
        if not isinstance(payload, dict):
            raise GateError("check-runs payload missing")
        runs = payload.get("check_runs")
        if not isinstance(runs, list):
            raise GateError("check-runs payload missing list")
        out.extend(r for r in runs if isinstance(r, dict))
        url = _next_link(link) or ""
    return out


def mark_ready(owner: str, repo: str, number: int, token: str) -> None:
    """Convert a draft to ready for review. REST draft=false."""
    url = f"https://api.github.com/repos/{owner}/{repo}/pulls/{number}"
    _github_request("PATCH", url, token, {"draft": False})


def squash_merge(owner: str, repo: str, number: int, sha: str, token: str) -> str:
    url = f"https://api.github.com/repos/{owner}/{repo}/pulls/{number}/merge"
    payload, _ = _github_request(
        "PUT",
        url,
        token,
        {"merge_method": "squash", "sha": sha},
    )
    if isinstance(payload, dict) and payload.get("merged"):
        return str(payload.get("sha") or "merged")
    return "merged"


def pick_pr_number(payload: Any) -> int | None:
    """Open PR on a commit, else any associated PR (workflow_run often omits PRs)."""
    if not isinstance(payload, list):
        return None
    rows = [p for p in payload if isinstance(p, dict) and p.get("number")]
    if not rows:
        return None
    open_prs = [p for p in rows if p.get("state") == "open"]
    chosen = open_prs[0] if open_prs else rows[0]
    try:
        return int(chosen["number"])
    except (TypeError, ValueError):
        return None


def fetch_commit_pulls(owner: str, repo: str, sha: str, token: str) -> list[dict[str, Any]]:
    url = f"https://api.github.com/repos/{owner}/{repo}/commits/{sha}/pulls?per_page=100"
    payload, _ = _github_request("GET", url, token)
    if not isinstance(payload, list):
        raise GateError("commit pulls payload missing list")
    return [p for p in payload if isinstance(p, dict)]


def dispatch_main_ci(owner: str, repo: str, token: str) -> None:
    url = f"https://api.github.com/repos/{owner}/{repo}/actions/workflows/ci.yml/dispatches"
    _github_request("POST", url, token, {"ref": "main"})


def env_flag(name: str) -> bool:
    return os.environ.get(name, "").strip() in {"1", "true", "TRUE", "yes"}


def _head_sha(pr: dict[str, Any]) -> str:
    head = pr.get("head") if isinstance(pr.get("head"), dict) else {}
    return str(head.get("sha") or "")


def list_open_pulls(owner: str, repo: str, token: str) -> list[dict[str, Any]]:
    """Open pull requests only. The poll applies the same ready and merge gate."""
    url = (
        f"https://api.github.com/repos/{owner}/{repo}/pulls"
        "?state=open&per_page=100"
    )
    out: list[dict[str, Any]] = []
    while url:
        payload, link = _github_request("GET", url, token)
        if not isinstance(payload, list):
            raise GateError("open pulls payload missing list")
        out.extend(row for row in payload if isinstance(row, dict) and row.get("number"))
        url = _next_link(link) or ""
    return out


def poll_ready(
    rows: list[dict[str, Any]],
    load: Any,
    merge: Any,
    dispatch: Any,
    mark: Any | None = None,
) -> list[str]:
    """Same ready and ``decide`` path as one-PR automerge.

    Forks and already-merged PRs are skipped before check-runs are fetched.
    A same-repo draft is marked ready when the four checks succeeded, then
    the review gate runs. A failed or pending check stays a draft. Merge
    errors do not stop the list. This does not approve, close, or update
    the branch.
    """
    lines: list[str] = []
    for row in rows:
        try:
            number = int(row["number"])
        except (KeyError, TypeError, ValueError):
            continue
        preview = decide(
            pr=row,
            reviews=[],
            head_sha=_head_sha(row) or "pending",
            checks_green=True,
            check_runs=None,
        )
        if preview.action == "skip" and not row.get("draft"):
            lines.append(f"#{number} {preview.reason}")
            continue
        try:
            pr, reviews, runs = load(number)
        except GateError as exc:
            lines.append(f"#{number} merge skipped: {exc}")
            continue
        head_sha = _head_sha(pr) if isinstance(pr, dict) else ""
        current = pr if isinstance(pr, dict) else row
        runs_list = runs if isinstance(runs, list) else []
        if should_mark_ready(pr=current, checks_green=False, check_runs=runs_list):
            try:
                if mark is not None:
                    mark(number)
            except GateError as exc:
                lines.append(f"#{number} ready skipped: {exc}")
                continue
            current = dict(current)
            current["draft"] = False
            lines.append(f"#{number} marked ready")
        decision = decide(
            pr=current,
            reviews=reviews,
            head_sha=head_sha,
            checks_green=False,
            check_runs=runs_list,
        )
        lines.append(f"#{number} {decision.reason}")
        if decision.action != "merge":
            continue
        try:
            merge(number, head_sha)
        except GateError as exc:
            lines.append(f"#{number} merge skipped: {exc}")
            continue
        lines.append(f"#{number} squash-merged")
        try:
            dispatch(number)
        except GateError as exc:
            lines.append(f"#{number} main CI dispatch skipped: {exc}")
            continue
        lines.append(f"#{number} dispatched CI on main")
    return lines


def poll_open(owner: str, repo: str, token: str) -> int:
    try:
        rows = list_open_pulls(owner, repo, token)
    except GateError as exc:
        print(f"poll skipped: {exc}")
        return 0
    print(f"poll: {len(rows)} open pull request(s)")

    def load(number: int) -> tuple[dict[str, Any], list[dict[str, Any]], list[dict[str, Any]]]:
        pr = fetch_pr(owner, repo, number, token)
        head_sha = _head_sha(pr)
        reviews = fetch_reviews(owner, repo, number, token)
        runs = fetch_check_runs(owner, repo, head_sha, token) if head_sha else []
        return pr, reviews, runs

    def merge(number: int, sha: str) -> None:
        squash_merge(owner, repo, number, sha, token)

    def dispatch(_number: int) -> None:
        dispatch_main_ci(owner, repo, token)

    def mark(number: int) -> None:
        mark_ready(owner, repo, number, token)

    for line in poll_ready(rows, load, merge, dispatch, mark):
        print(line)
    return 0


def main(argv: list[str] | None = None) -> int:
    del argv  # GHA env-driven; no CLI flags in the job.
    token = os.environ.get("GITHUB_TOKEN") or ""
    repository = os.environ.get("GITHUB_REPOSITORY") or ""
    pr_number_raw = (os.environ.get("PR_NUMBER") or "").strip()
    head_sha_env = (os.environ.get("HEAD_SHA") or "").strip()
    checks_green = env_flag("AUTOMERGE_CHECKS_GREEN")

    if "/" not in repository:
        print("waiting for review (missing GITHUB_REPOSITORY)")
        return 0
    owner, repo = repository.split("/", 1)
    if env_flag("AUTOMERGE_POLL"):
        return poll_open(owner, repo, token)

    number: int | None = None
    if pr_number_raw:
        try:
            number = int(pr_number_raw)
        except ValueError:
            number = None

    try:
        if number is None:
            if not head_sha_env:
                print("waiting for review (no PR_NUMBER or HEAD_SHA)")
                return 0
            number = pick_pr_number(fetch_commit_pulls(owner, repo, head_sha_env, token))
        if number is None:
            print("skip — no pull request for this SHA")
            return 0
        pr = fetch_pr(owner, repo, number, token)
        # Reviews are on the PR head SHA, not the pull_request merge commit
        # that workflow_run.head_sha may point at.
        head_sha = str((pr.get("head") or {}).get("sha") or "") or head_sha_env
        reviews = fetch_reviews(owner, repo, number, token)
        check_runs = None if checks_green else fetch_check_runs(owner, repo, head_sha, token)
        if should_mark_ready(pr=pr, checks_green=checks_green, check_runs=check_runs):
            mark_ready(owner, repo, number, token)
            pr = dict(pr)
            pr["draft"] = False
            print(f"#{number} marked ready")
        decision = decide(
            pr=pr,
            reviews=reviews,
            head_sha=head_sha,
            checks_green=checks_green,
            check_runs=check_runs,
        )
    except GateError as exc:
        print(f"waiting ({exc})")
        return 0

    print(decision.reason)
    if decision.action != "merge":
        return 0

    try:
        squash_merge(owner, repo, number, head_sha, token)
        print("squash-merged")
    except GateError as exc:
        print(f"merge skipped: {exc}")
        return 0

    try:
        dispatch_main_ci(owner, repo, token)
        print("dispatched CI on main")
    except GateError as exc:
        print(f"main CI dispatch skipped: {exc}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
