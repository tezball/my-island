#!/usr/bin/env python3
"""WF-050: squash-merge a ready PR only after green CI and a valid Approve.

GitHub Actions is not permitted to createReview APPROVE. Chat never merges.
AUTOMERGE_POLL=1 lists open PRs and runs this same gate. A same-repo head
that is behind main, or dirty, is updated by merging main into that branch
first. That update is a merge commit, not a force-push. Forks are not
updated. A conflict posts one pull request comment and skips the squash.
A successful merge dispatches ci.yml on that head branch (workflow_dispatch).
A dispatch failure is logged and does not fail the poll. When a same-repo
head already has completed github-actions check runs for the four job names
and a name is missing from the pull request rollup, that conclusion is
copied onto a commit status (success or failure only). Nothing is invented.
An existing failure on that same context is not overwritten with success.
Forks are skipped. The rollup is re-fetched after posting. When the head
commit author is cursoragent (cursoragent@cursor.com), those four checks
are success, and there is no valid non-author APPROVED, the poll adds one
empty commit on that branch (message ``Trigger review for pull request
head``, authored by the Actions token, fast-forward, no force-push),
dispatches ci.yml there, and skips ready, mirror, and squash for that pull
request in that run. If the head message is already that trigger, it does
not push another. The new SHA still needs the four green checks and a
valid non-author APPROVED.

While a main-red issue is open and main still has a failure or error, squash
is skipped for every pull request except the one linked from that issue or
labeled main-fix. Reviews and the four checks still run. The fix pull
request still needs those four checks and a non-author APPROVED. The gate
posts a commit status named queue/main-fix only: success on the main-fix
head, failure on other same-repo heads ("held while main is red"). Pending
is not red. When the issue is closed or main is green, that status is
posted success so those heads are not stuck. This does not write the four
check names or jenkins/*, and it does not overwrite a failure on those
contexts with success.

Exit 0 for skip / waiting-for-review / waiting-for-CI / merge attempted.
Never fail the merge job red because Approve is missing.
"""
from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from typing import Any

from main_red_issue import is_red_state, latest_signal_states

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
    def __init__(self, message: str, status: int | None = None) -> None:
        super().__init__(message)
        self.status = status


class UpdateConflict(GateError):
    """Merging origin/main into the pull request head hit a conflict."""


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
        raise GateError(
            f"HTTP {exc.code} {method} {url}: {err_body[:240]}",
            status=exc.code,
        ) from exc
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


MARK_READY_MUTATION = """
mutation($id: ID!) {
  markPullRequestReadyForReview(input: {pullRequestId: $id}) {
    pullRequest { isDraft }
  }
}
"""


def _graphql(token: str, query: str, variables: dict[str, Any]) -> dict[str, Any]:
    payload, _ = _github_request(
        "POST",
        "https://api.github.com/graphql",
        token,
        {"query": query, "variables": variables},
    )
    if not isinstance(payload, dict):
        raise GateError("graphql payload missing")
    errors = payload.get("errors")
    if isinstance(errors, list) and errors:
        first = errors[0]
        message = first.get("message") if isinstance(first, dict) else str(first)
        raise GateError(f"graphql: {message}")
    data = payload.get("data")
    if not isinstance(data, dict):
        raise GateError("graphql data missing")
    return data


def mark_ready(owner: str, repo: str, number: int, token: str) -> dict[str, Any]:
    """Mark a draft ready and return the re-fetched pull request.

    The REST draft field is ignored. GitHub only clears draft via
    ``markPullRequestReadyForReview``. The caller must trust the re-fetched
    ``draft`` flag, not an in-memory flip.
    """
    current = fetch_pr(owner, repo, number, token)
    node_id = str(current.get("node_id") or "").strip()
    if not node_id:
        raise GateError("pull request node id missing")
    _graphql(token, MARK_READY_MUTATION, {"id": node_id})
    return fetch_pr(owner, repo, number, token)


def confirm_ready(number: int, pr: dict[str, Any], mark: Any | None) -> tuple[dict[str, Any], str]:
    """Return the pull request to decide on, plus the log line.

    ``marked ready`` only when the re-fetch has ``draft`` false. A failed
    mutation, or a re-fetch that is still a draft, leaves ``draft`` true so
    ``decide`` still skips it.
    """
    try:
        refreshed = mark(number) if mark is not None else None
    except GateError as exc:
        kept = dict(pr)
        kept["draft"] = True
        return kept, f"#{number} ready skipped: {exc}"
    if isinstance(refreshed, dict) and refreshed.get("draft") is False:
        return refreshed, f"#{number} marked ready"
    kept = dict(pr)
    kept["draft"] = True
    return kept, f"#{number} ready skipped: still a draft"


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


def _is_github_actions_run(run: dict[str, Any]) -> bool:
    app = run.get("app")
    if not isinstance(app, dict):
        return False
    return str(app.get("slug") or "").strip().lower() == "github-actions"


def _latest_actions_check(runs: list[dict[str, Any]], label: str) -> dict[str, Any] | None:
    """Latest completed-or-not github-actions check run with this exact name.

    ``jenkins/compose stack`` is a different context and does not match
    ``compose stack``.
    """
    matches = [
        run
        for run in runs
        if isinstance(run, dict)
        and str(run.get("name") or "").strip() == label
        and _is_github_actions_run(run)
    ]
    if not matches:
        return None
    matches.sort(
        key=lambda run: (
            str(run.get("started_at") or run.get("completed_at") or ""),
            int(run.get("id") or 0),
        )
    )
    return matches[-1]


def statuses_to_mirror(
    runs: list[dict[str, Any]],
    rollup_names: set[str],
    existing_states: dict[str, str],
) -> list[tuple[str, str]]:
    """Commit statuses to copy from completed github-actions check runs.

    A name already on the rollup is left alone. Only ``success`` and
    ``failure`` are copied. A missing or unfinished run posts nothing.
    An existing ``failure`` on that exact context is not replaced with
    ``success``.
    """
    plan: list[tuple[str, str]] = []
    for label in REQUIRED_CHECK_NAMES:
        if label in rollup_names:
            continue
        latest = _latest_actions_check(runs, label)
        if latest is None:
            continue
        status = str(latest.get("status") or "").lower()
        if status != "completed":
            continue
        conclusion = str(latest.get("conclusion") or "").lower()
        if conclusion not in {"success", "failure"}:
            continue
        existing = str(existing_states.get(label) or "").lower()
        if existing == "failure" and conclusion == "success":
            continue
        plan.append((label, conclusion))
    return plan


def fetch_pr_rollup_names(
    owner: str, repo: str, number: int, head_sha: str, token: str
) -> set[str]:
    """Names and contexts on this pull request head's status check rollup."""
    query = """
    query($owner: String!, $name: String!, $number: Int!, $cursor: String) {
      repository(owner: $owner, name: $name) {
        pullRequest(number: $number) {
          commits(last: 1) {
            nodes {
              commit {
                oid
                statusCheckRollup {
                  contexts(first: 100, after: $cursor) {
                    pageInfo { hasNextPage endCursor }
                    nodes {
                      __typename
                      ... on CheckRun { name }
                      ... on StatusContext { context }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    """
    names: set[str] = set()
    cursor: str | None = None
    seen_cursors: set[str] = set()
    while True:
        data = _graphql(
            token,
            query,
            {"owner": owner, "name": repo, "number": number, "cursor": cursor},
        )
        repository = data.get("repository") if isinstance(data.get("repository"), dict) else {}
        pull = repository.get("pullRequest") if isinstance(repository.get("pullRequest"), dict) else {}
        commits = pull.get("commits") if isinstance(pull.get("commits"), dict) else {}
        nodes = commits.get("nodes") if isinstance(commits.get("nodes"), list) else []
        commit = nodes[0].get("commit") if nodes and isinstance(nodes[0], dict) else {}
        if not isinstance(commit, dict):
            return names
        oid = str(commit.get("oid") or "").strip().lower()
        wanted = (head_sha or "").strip().lower()
        if wanted and oid and oid != wanted:
            return set()
        rollup = commit.get("statusCheckRollup")
        if not isinstance(rollup, dict):
            return names
        contexts = rollup.get("contexts") if isinstance(rollup.get("contexts"), dict) else {}
        context_nodes = contexts.get("nodes") if isinstance(contexts.get("nodes"), list) else []
        for node in context_nodes:
            if not isinstance(node, dict):
                continue
            label = str(node.get("name") or node.get("context") or "").strip()
            if label:
                names.add(label)
        page = contexts.get("pageInfo") if isinstance(contexts.get("pageInfo"), dict) else {}
        if not page.get("hasNextPage"):
            return names
        cursor = str(page.get("endCursor") or "").strip() or None
        if cursor is None or cursor in seen_cursors:
            return names
        seen_cursors.add(cursor)


def fetch_commit_status_states(
    owner: str, repo: str, sha: str, token: str
) -> dict[str, str]:
    """Latest commit-status state for each exact context on ``sha``."""
    quoted = urllib.parse.quote(sha, safe="")
    url = f"https://api.github.com/repos/{owner}/{repo}/commits/{quoted}/status"
    payload, _ = _github_request("GET", url, token)
    states: dict[str, str] = {}
    if not isinstance(payload, dict):
        return states
    rows = payload.get("statuses")
    if not isinstance(rows, list):
        return states
    for row in rows:
        if not isinstance(row, dict):
            continue
        context = str(row.get("context") or "").strip()
        state = str(row.get("state") or "").strip().lower()
        if context and context not in states:
            states[context] = state
    return states


def post_commit_status(
    owner: str, repo: str, sha: str, context: str, state: str, token: str
) -> None:
    """POST a commit status. Refuses any state other than success or failure."""
    if context not in REQUIRED_CHECK_NAMES:
        raise GateError("refuse to post a status outside the four check names")
    if state not in {"success", "failure"}:
        raise GateError("refuse to post a status that is not success or failure")
    quoted = urllib.parse.quote(sha, safe="")
    url = f"https://api.github.com/repos/{owner}/{repo}/statuses/{quoted}"
    _github_request(
        "POST",
        url,
        token,
        {
            "state": state,
            "context": context,
            "description": "copied from github-actions check run",
        },
    )


QUEUE_CONTEXT = "queue/main-fix"
QUEUE_HELD_DESCRIPTION = "held while main is red"
MAIN_FIX_LABEL = "main-fix"
MAIN_RED_LABEL = "main-red"
_PULL_NUMBER = re.compile(r"/pull/(\d+)\b")


@dataclass(frozen=True)
class MainRedHold:
    active: bool
    linked: frozenset[int]


def pr_label_names(pr: dict[str, Any]) -> set[str]:
    labels = pr.get("labels")
    names: set[str] = set()
    if not isinstance(labels, list):
        return names
    for label in labels:
        if isinstance(label, str):
            text = label.strip()
        elif isinstance(label, dict):
            text = str(label.get("name") or "").strip()
        else:
            text = ""
        if text:
            names.add(text)
    return names


def linked_pull_numbers(text: str) -> set[int]:
    return {int(match.group(1)) for match in _PULL_NUMBER.finditer(text or "")}


def pull_numbers_from_timeline(events: list[dict[str, Any]]) -> set[int]:
    """Pull requests GitHub linked from the issue timeline."""
    numbers: set[int] = set()
    for event in events:
        if not isinstance(event, dict):
            continue
        if str(event.get("event") or "") not in {"cross-referenced", "connected"}:
            continue
        source = event.get("source") if isinstance(event.get("source"), dict) else {}
        issue = source.get("issue") if isinstance(source.get("issue"), dict) else {}
        if not isinstance(issue.get("pull_request"), dict):
            continue
        try:
            number = int(issue.get("number") or 0)
        except (TypeError, ValueError):
            continue
        if number:
            numbers.add(number)
    return numbers


def is_main_fix_pull(pr: dict[str, Any], linked: set[int] | frozenset[int]) -> bool:
    if MAIN_FIX_LABEL in pr_label_names(pr):
        return True
    try:
        number = int(pr.get("number") or 0)
    except (TypeError, ValueError):
        return False
    return bool(number) and number in linked


def hold_is_active(*, open_issues: int, states: list[str] | None) -> bool:
    """Hold only while a main-red issue is open and a signal is still red.

    ``states is None`` means the issue is open and the SHA signals could
    not be read. Pending, success, skipped, cancelled, and neutral do not
    keep the hold.
    """
    if open_issues <= 0:
        return False
    if states is None:
        return True
    return any(is_red_state(state) for state in states)


def squash_held(
    pr: dict[str, Any], *, active: bool, linked: set[int] | frozenset[int]
) -> bool:
    """Skip squash for every pull request except the open main-fix one.

    Reviews and CI are unchanged. The caller still runs ``decide``, so the
    main-fix pull request needs the four checks and a non-author approval.
    """
    if not active:
        return False
    return not is_main_fix_pull(pr, linked)


def queue_status_plan(
    pr: dict[str, Any], *, active: bool, linked: set[int] | frozenset[int]
) -> tuple[str, str] | None:
    """State and description for ``queue/main-fix``. None on a fork.

    The context is never one of the four check names and never ``jenkins/*``.
    """
    if _is_fork(pr) or not _head_sha(pr):
        return None
    if not active:
        return ("success", "main is not red")
    if is_main_fix_pull(pr, linked):
        return ("success", "main-fix")
    return ("failure", QUEUE_HELD_DESCRIPTION)


def should_post_queue(existing: str, desired: str) -> bool:
    """Post when the queue state changes, including failure to success."""
    return (existing or "") != (desired or "")


def post_queue_status(
    owner: str,
    repo: str,
    sha: str,
    state: str,
    description: str,
    token: str,
) -> None:
    """POST ``queue/main-fix`` only.

    This context may move from failure to success when the hold ends.
    It does not write the four check names or a ``jenkins/*`` context.
    """
    if QUEUE_CONTEXT in REQUIRED_CHECK_NAMES or QUEUE_CONTEXT.startswith("jenkins/"):
        raise GateError("refuse to post queue/main-fix on a real check name")
    if state not in {"success", "failure"}:
        raise GateError("refuse to post a status that is not success or failure")
    if state == "failure" and description != QUEUE_HELD_DESCRIPTION:
        raise GateError("refuse to post a held status with another description")
    quoted = urllib.parse.quote(sha, safe="")
    url = f"https://api.github.com/repos/{owner}/{repo}/statuses/{quoted}"
    _github_request(
        "POST",
        url,
        token,
        {"state": state, "context": QUEUE_CONTEXT, "description": description},
    )


def fetch_main_head_sha(owner: str, repo: str, token: str) -> str:
    url = f"https://api.github.com/repos/{owner}/{repo}/git/ref/heads/main"
    payload, _ = _github_request("GET", url, token)
    if not isinstance(payload, dict):
        raise GateError("main ref payload missing")
    obj = payload.get("object") if isinstance(payload.get("object"), dict) else {}
    sha = str(obj.get("sha") or "").strip()
    if not sha:
        raise GateError("main ref sha missing")
    return sha


def fetch_open_main_red_issues(owner: str, repo: str, token: str) -> list[dict[str, Any]]:
    url = (
        f"https://api.github.com/repos/{owner}/{repo}/issues"
        f"?state=open&labels={MAIN_RED_LABEL}&per_page=100"
    )
    out: list[dict[str, Any]] = []
    while url:
        payload, link = _github_request("GET", url, token)
        if not isinstance(payload, list):
            raise GateError("main-red issues payload missing list")
        for row in payload:
            if isinstance(row, dict) and row.get("number") and "pull_request" not in row:
                out.append(row)
        url = _next_link(link) or ""
    return out


def fetch_issue_timeline(
    owner: str, repo: str, number: int, token: str
) -> list[dict[str, Any]]:
    url = (
        f"https://api.github.com/repos/{owner}/{repo}/issues/{number}/timeline"
        "?per_page=100"
    )
    out: list[dict[str, Any]] = []
    while url:
        payload, link = _github_request("GET", url, token)
        if not isinstance(payload, list):
            raise GateError("timeline payload missing list")
        out.extend(row for row in payload if isinstance(row, dict))
        url = _next_link(link) or ""
    return out


def load_main_red_hold(owner: str, repo: str, token: str) -> MainRedHold:
    """Active when an open main-red issue still has a red main signal."""
    issues = fetch_open_main_red_issues(owner, repo, token)
    if not issues:
        return MainRedHold(False, frozenset())
    linked: set[int] = set()
    for issue in issues:
        try:
            number = int(issue.get("number") or 0)
        except (TypeError, ValueError):
            number = 0
        chunks = [str(issue.get("body") or "")]
        if number:
            try:
                comments = fetch_issue_comments(owner, repo, number, token)
            except GateError:
                comments = []
            chunks.extend(
                str(item.get("body") or "") for item in comments if isinstance(item, dict)
            )
            try:
                linked |= pull_numbers_from_timeline(
                    fetch_issue_timeline(owner, repo, number, token)
                )
            except GateError:
                pass
        linked |= linked_pull_numbers("\n".join(chunks))
    states: list[str] | None
    try:
        sha = fetch_main_head_sha(owner, repo, token)
        runs = fetch_check_runs(owner, repo, sha, token)
        states_map = fetch_commit_status_states(owner, repo, sha, token)
        statuses = [
            {"context": context, "state": state, "description": "", "target_url": ""}
            for context, state in states_map.items()
        ]
        states = latest_signal_states(runs, statuses)
    except GateError:
        states = None
    return MainRedHold(
        active=hold_is_active(open_issues=len(issues), states=states),
        linked=frozenset(linked),
    )


def post_queue_for_pull(
    owner: str, repo: str, pr: dict[str, Any], hold: MainRedHold, token: str
) -> list[str]:
    plan = queue_status_plan(pr, active=hold.active, linked=hold.linked)
    if plan is None:
        return []
    state, description = plan
    sha = _head_sha(pr)
    existing = fetch_commit_status_states(owner, repo, sha, token).get(QUEUE_CONTEXT, "")
    if not should_post_queue(existing, state):
        return []
    post_queue_status(owner, repo, sha, state, description, token)
    number = int(pr.get("number") or 0)
    return [f"#{number} {QUEUE_CONTEXT} {state}"]


def mirror_missing_check_statuses(
    owner: str,
    repo: str,
    number: int,
    sha: str,
    runs: list[dict[str, Any]],
    token: str,
) -> list[str]:
    """Copy missing rollup names from completed check runs, then re-fetch.

    The second fetch is what a later step in this poll observes. Forks are
    the caller's responsibility.
    """
    if not sha:
        return []
    rollup_names = fetch_pr_rollup_names(owner, repo, number, sha, token)
    existing = fetch_commit_status_states(owner, repo, sha, token)
    plan = statuses_to_mirror(runs, rollup_names, existing)
    if not plan:
        return []
    lines: list[str] = []
    for context, state in plan:
        post_commit_status(owner, repo, sha, context, state, token)
        lines.append(f"#{number} mirrored {context} {state}")
    refreshed = fetch_pr_rollup_names(owner, repo, number, sha, token)
    lines.append(f"#{number} rollup refreshed")
    for context, _state in plan:
        if context not in refreshed:
            lines.append(f"#{number} rollup still missing {context}")
    return lines


TRIGGER_REVIEW_MESSAGE = "Trigger review for pull request head"
CURSORAGENT_EMAIL = "cursoragent@cursor.com"


def _commit_git(commit: dict[str, Any]) -> dict[str, Any]:
    git = commit.get("commit")
    return git if isinstance(git, dict) else {}


def _commit_author(commit: dict[str, Any]) -> dict[str, Any]:
    author = _commit_git(commit).get("author")
    return author if isinstance(author, dict) else {}


def is_cursoragent_commit(commit: dict[str, Any]) -> bool:
    """True when the git author is cursoragent, not the GitHub login."""
    author = _commit_author(commit)
    email = str(author.get("email") or "").strip().lower()
    name = str(author.get("name") or "").strip()
    return email == CURSORAGENT_EMAIL or name == "cursoragent"


def is_trigger_review_commit(commit: dict[str, Any]) -> bool:
    message = str(_commit_git(commit).get("message") or "")
    first = message.split("\n", 1)[0].strip()
    return first == TRIGGER_REVIEW_MESSAGE


def should_trigger_cursoragent_review(
    commit: dict[str, Any],
    pr: dict[str, Any],
    reviews: list[dict[str, Any]],
    runs: list[dict[str, Any]],
) -> bool:
    """Whether the poll should push one empty review-trigger commit.

    Same-repo only. Requires the four checks success and no valid
    non-author APPROVED. Does not approve and does not weaken that gate.
    """
    if not isinstance(pr, dict) or _is_fork(pr):
        return False
    if not is_cursoragent_commit(commit) or is_trigger_review_commit(commit):
        return False
    ok, _why = four_checks_success(runs)
    if not ok:
        return False
    approved, _why = has_valid_approve(pr, reviews, _head_sha(pr))
    return not approved


def fetch_commit(owner: str, repo: str, sha: str, token: str) -> dict[str, Any]:
    quoted = urllib.parse.quote(sha, safe="")
    url = f"https://api.github.com/repos/{owner}/{repo}/commits/{quoted}"
    payload, _ = _github_request("GET", url, token)
    if not isinstance(payload, dict):
        raise GateError("commit payload missing")
    return payload


def create_empty_commit(
    owner: str, repo: str, parent_sha: str, tree_sha: str, token: str
) -> str:
    """Create a commit with the parent's tree. The token user is the author.

    Omitting author and committer lets GitHub attribute the commit to the
    authenticated Actions token. This is not a force-push.
    """
    url = f"https://api.github.com/repos/{owner}/{repo}/git/commits"
    payload, _ = _github_request(
        "POST",
        url,
        token,
        {
            "message": TRIGGER_REVIEW_MESSAGE,
            "tree": tree_sha,
            "parents": [parent_sha],
        },
    )
    if not isinstance(payload, dict):
        raise GateError("empty commit payload missing")
    sha = str(payload.get("sha") or "").strip()
    if not sha:
        raise GateError("empty commit sha missing")
    return sha


def fast_forward_branch(owner: str, repo: str, branch: str, sha: str, token: str) -> None:
    """Move ``branch`` to ``sha`` only when it fast-forwards. Never force."""
    ref = branch.strip().removeprefix("refs/heads/")
    if not ref:
        raise GateError("pull request head ref missing")
    if ref == "main":
        raise GateError("refuse to update main")
    quoted = urllib.parse.quote(ref, safe="/")
    url = f"https://api.github.com/repos/{owner}/{repo}/git/refs/heads/{quoted}"
    _github_request("PATCH", url, token, {"sha": sha, "force": False})


def trigger_cursoragent_review(
    owner: str,
    repo: str,
    pr: dict[str, Any],
    reviews: list[dict[str, Any]],
    runs: list[dict[str, Any]],
    token: str,
) -> list[str] | None:
    """Push one trigger commit and dispatch CI, or return None to continue.

    A returned list means this poll run must skip ready, mirror, and squash
    for the pull request. Forks and an existing trigger commit return None.
    """
    if _is_fork(pr):
        return None
    sha = _head_sha(pr)
    number = int(pr.get("number") or 0)
    if not sha:
        return None
    commit = fetch_commit(owner, repo, sha, token)
    if not should_trigger_cursoragent_review(commit, pr, reviews, runs):
        return None
    tree = _commit_git(commit).get("tree")
    tree_sha = str(tree.get("sha") or "").strip() if isinstance(tree, dict) else ""
    if not tree_sha:
        raise GateError("commit tree missing")
    new_sha = create_empty_commit(owner, repo, sha, tree_sha, token)
    ref = _head_ref(pr)
    fast_forward_branch(owner, repo, ref, new_sha, token)
    lines = [f"#{number} triggered review"]
    try:
        dispatch_head_ci(owner, repo, ref, token)
    except GateError as exc:
        lines.append(f"#{number} CI dispatch skipped: {exc}")
    else:
        lines.append(f"#{number} dispatched CI on {ref}")
    return lines


def dispatch_head_ci(owner: str, repo: str, head_ref: str, token: str) -> None:
    """Dispatch ci.yml on a pull request head branch.

    GITHUB_TOKEN may call workflow_dispatch. The ref is the branch name.
    Refuses main so a behind-merge cannot start CI on the default branch.
    """
    ref = head_ref.strip()
    if not ref:
        raise GateError("pull request head ref missing")
    if ref in {"main", "refs/heads/main"}:
        raise GateError("refuse to dispatch CI on main")
    url = f"https://api.github.com/repos/{owner}/{repo}/actions/workflows/ci.yml/dispatches"
    _github_request("POST", url, token, {"ref": ref})


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


CONFLICT_COMMENT_LEAD = "update skipped: merge of origin/main conflicts"


def _head_ref(pr: dict[str, Any]) -> str:
    head = pr.get("head") if isinstance(pr.get("head"), dict) else {}
    return str(head.get("ref") or "").strip()


def _base_ref(pr: dict[str, Any]) -> str:
    base = pr.get("base") if isinstance(pr.get("base"), dict) else {}
    return str(base.get("ref") or "main").strip() or "main"


def branch_update_reason(pr: dict[str, Any], compare: dict[str, Any] | None) -> str | None:
    """Why a same-repo head should receive a merge of origin/main.

    ``behind`` is behind the base, including a diverged compare. ``dirty``
    is a merge conflict. Forks are never updated.
    """
    if _is_fork(pr) or pr.get("merged") or pr.get("merged_at"):
        return None
    state = str(pr.get("mergeable_state") or "").strip().lower()
    if pr.get("mergeable") is False or state == "dirty":
        return "dirty"
    if state == "behind":
        return "behind"
    if isinstance(compare, dict):
        try:
            behind = int(compare.get("behind_by") or 0)
        except (TypeError, ValueError):
            behind = 0
        status = str(compare.get("status") or "").strip().lower()
        if behind > 0 or status in {"behind", "diverged"}:
            return "behind"
    return None


def conflict_comment_body(head_sha: str) -> str:
    sha = (head_sha or "").strip()
    return (
        f"{CONFLICT_COMMENT_LEAD}\n\n"
        f"Merging origin/main into `{sha}` hit a conflict. "
        "This run did not force-push and did not squash-merge."
    )


def conflict_comment_exists(comments: list[dict[str, Any]], head_sha: str) -> bool:
    body = conflict_comment_body(head_sha)
    for comment in comments:
        if isinstance(comment, dict) and str(comment.get("body") or "") == body:
            return True
    return False


def merge_main_into_head(owner: str, repo: str, head_ref: str, token: str) -> bool:
    """Merge main into ``head_ref``. True when a merge commit was created.

    Uses the merges API (a merge commit). Does not force-push. Refuses to
    take ``main`` as the branch being updated. HTTP 409 is a conflict.
    HTTP 204 means the branch already contains main.
    """
    ref = head_ref.strip()
    if not ref:
        raise GateError("pull request head ref missing")
    if ref == "main" or ref == "refs/heads/main":
        raise GateError("refuse to merge into main")
    url = f"https://api.github.com/repos/{owner}/{repo}/merges"
    try:
        payload, _ = _github_request(
            "POST",
            url,
            token,
            {
                "base": ref,
                "head": "main",
                "commit_message": "Merge origin/main into pull request head",
            },
        )
    except GateError as exc:
        if exc.status == 409:
            raise UpdateConflict(str(exc)) from exc
        raise
    return payload is not None


def fetch_compare(owner: str, repo: str, base_ref: str, head_sha: str, token: str) -> dict[str, Any]:
    base_q = urllib.parse.quote(base_ref, safe="")
    head_q = urllib.parse.quote(head_sha, safe="")
    url = f"https://api.github.com/repos/{owner}/{repo}/compare/{base_q}...{head_q}"
    payload, _ = _github_request("GET", url, token)
    if not isinstance(payload, dict):
        raise GateError("compare payload missing")
    return payload


def fetch_pr_for_update(owner: str, repo: str, number: int, token: str) -> dict[str, Any]:
    """GET the pull request, once more if mergeability is still unknown."""
    pr = fetch_pr(owner, repo, number, token)
    state = str(pr.get("mergeable_state") or "").strip().lower()
    if pr.get("mergeable") is None or state in {"", "unknown"}:
        pr = fetch_pr(owner, repo, number, token)
    return pr


def fetch_issue_comments(owner: str, repo: str, number: int, token: str) -> list[dict[str, Any]]:
    url = (
        f"https://api.github.com/repos/{owner}/{repo}/issues/{number}/comments"
        "?per_page=100"
    )
    out: list[dict[str, Any]] = []
    while url:
        payload, link = _github_request("GET", url, token)
        if not isinstance(payload, list):
            raise GateError("issue comments payload missing list")
        out.extend(row for row in payload if isinstance(row, dict))
        url = _next_link(link) or ""
    return out


def comment_on_conflict(owner: str, repo: str, number: int, head_sha: str, token: str) -> bool:
    """Post one issue comment for this head. Not a review. True if posted."""
    if conflict_comment_exists(fetch_issue_comments(owner, repo, number, token), head_sha):
        return False
    url = f"https://api.github.com/repos/{owner}/{repo}/issues/{number}/comments"
    _github_request("POST", url, token, {"body": conflict_comment_body(head_sha)})
    return True


def _as_loaded(
    loaded: Any,
) -> tuple[dict[str, Any], list[dict[str, Any]], list[dict[str, Any]], dict[str, Any] | None]:
    if not isinstance(loaded, tuple) or len(loaded) < 3:
        raise GateError("load payload missing")
    pr = loaded[0] if isinstance(loaded[0], dict) else {}
    reviews = loaded[1] if isinstance(loaded[1], list) else []
    runs = loaded[2] if isinstance(loaded[2], list) else []
    compare = loaded[3] if len(loaded) > 3 and isinstance(loaded[3], dict) else None
    return pr, reviews, runs, compare


def poll_ready(
    rows: list[dict[str, Any]],
    load: Any,
    merge: Any,
    dispatch: Any,
    mark: Any | None = None,
    update: Any | None = None,
    on_conflict: Any | None = None,
    dispatch_head: Any | None = None,
    mirror: Any | None = None,
    trigger: Any | None = None,
    hold: Any | None = None,
    queue: Any | None = None,
) -> list[str]:
    """Same ready and ``decide`` path as one-PR automerge.

    Forks and already-merged PRs are skipped before check-runs are fetched.
    A same-repo draft is marked ready when the four checks succeeded, then
    the review gate runs. A failed or pending check stays a draft. Merge
    errors do not stop the list. This does not approve or close.

    When ``update`` is set, a same-repo head that is behind main or dirty
    is updated first. Forks are not updated. A conflict calls ``on_conflict``
    and skips that pull request. A new merge commit dispatches ci.yml on
    that head branch, then skips ready and squash until a later run sees
    the new SHA. A dispatch failure is logged and does not stop the list.

    When ``mirror`` is set, a same-repo head copies completed github-actions
    conclusions onto commit statuses for any of the four names missing from
    the rollup, then re-fetches that rollup. Forks are not mirrored.

    When ``trigger`` returns lines, a same-repo cursoragent head was given
    one empty commit and CI was dispatched. Ready, mirror, and squash are
    skipped for that pull request in this run.

    When ``hold`` returns true, squash is skipped after ``decide``. Reviews,
    ready, mirror, and CI updates still run. ``queue`` posts ``queue/main-fix``
    on a same-repo head and does not run for a fork.
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
            pr, reviews, runs, compare = _as_loaded(load(number))
        except GateError as exc:
            lines.append(f"#{number} merge skipped: {exc}")
            continue
        head_sha = _head_sha(pr) if isinstance(pr, dict) else ""
        current = pr if isinstance(pr, dict) else row
        runs_list = runs if isinstance(runs, list) else []
        if queue is not None and isinstance(current, dict) and not _is_fork(current):
            try:
                queued = queue(current) or []
            except GateError as exc:
                lines.append(f"#{number} queue skipped: {exc}")
            else:
                lines.extend(str(line) for line in queued)
        reason = branch_update_reason(current, compare) if update is not None else None
        if reason and update is not None:
            try:
                changed = bool(update(current, reason))
            except UpdateConflict:
                if on_conflict is not None:
                    try:
                        on_conflict(number, head_sha)
                    except GateError as exc:
                        lines.append(f"#{number} comment skipped: {exc}")
                lines.append(f"#{number} {CONFLICT_COMMENT_LEAD}")
                continue
            except GateError as exc:
                lines.append(f"#{number} update skipped: {exc}")
                continue
            if changed:
                lines.append(f"#{number} updated: merged origin/main ({reason})")
                if dispatch_head is not None:
                    try:
                        dispatch_head(current)
                    except GateError as exc:
                        lines.append(f"#{number} CI dispatch skipped: {exc}")
                    else:
                        ref = _head_ref(current) if isinstance(current, dict) else ""
                        lines.append(f"#{number} dispatched CI on {ref}")
                continue
        if (
            trigger is not None
            and isinstance(current, dict)
            and not _is_fork(current)
        ):
            try:
                triggered = trigger(current, reviews, runs_list)
            except GateError as exc:
                lines.append(f"#{number} trigger skipped: {exc}")
            else:
                if triggered is not None:
                    lines.extend(str(line) for line in triggered)
                    continue
        if (
            mirror is not None
            and isinstance(current, dict)
            and not _is_fork(current)
        ):
            try:
                mirrored = mirror(current, runs_list) or []
            except GateError as exc:
                lines.append(f"#{number} mirror skipped: {exc}")
            else:
                lines.extend(str(line) for line in mirrored)
        if should_mark_ready(pr=current, checks_green=False, check_runs=runs_list):
            current, ready_line = confirm_ready(number, current, mark)
            lines.append(ready_line)
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
        if hold is not None:
            try:
                held = bool(hold(current))
            except GateError as exc:
                lines.append(f"#{number} squash skipped: {exc}")
                continue
            if held:
                lines.append(f"#{number} squash skipped: held while main is red")
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

    def load(
        number: int,
    ) -> tuple[dict[str, Any], list[dict[str, Any]], list[dict[str, Any]], dict[str, Any] | None]:
        pr = fetch_pr_for_update(owner, repo, number, token)
        head_sha = _head_sha(pr)
        reviews = fetch_reviews(owner, repo, number, token)
        runs = fetch_check_runs(owner, repo, head_sha, token) if head_sha else []
        compare = None
        if head_sha and not _is_fork(pr):
            try:
                compare = fetch_compare(owner, repo, _base_ref(pr), head_sha, token)
            except GateError:
                compare = None
        return pr, reviews, runs, compare

    def merge(number: int, sha: str) -> None:
        squash_merge(owner, repo, number, sha, token)

    def dispatch(_number: int) -> None:
        dispatch_main_ci(owner, repo, token)

    def mark(number: int) -> dict[str, Any]:
        return mark_ready(owner, repo, number, token)

    def update(pr: dict[str, Any], reason: str) -> bool:
        del reason
        return merge_main_into_head(owner, repo, _head_ref(pr), token)

    def on_conflict(number: int, head_sha: str) -> None:
        comment_on_conflict(owner, repo, number, head_sha, token)

    def dispatch_head(pr: dict[str, Any]) -> None:
        dispatch_head_ci(owner, repo, _head_ref(pr), token)

    def mirror(pr: dict[str, Any], runs: list[dict[str, Any]]) -> list[str]:
        return mirror_missing_check_statuses(
            owner,
            repo,
            int(pr.get("number") or 0),
            _head_sha(pr),
            runs,
            token,
        )

    def trigger(
        pr: dict[str, Any],
        reviews: list[dict[str, Any]],
        runs: list[dict[str, Any]],
    ) -> list[str] | None:
        return trigger_cursoragent_review(owner, repo, pr, reviews, runs, token)

    try:
        red_hold = load_main_red_hold(owner, repo, token)
    except GateError as exc:
        print(f"hold skipped: {exc}")
        red_hold = MainRedHold(False, frozenset())
    else:
        print("hold: active" if red_hold.active else "hold: inactive")

    def queue(pr: dict[str, Any]) -> list[str]:
        return post_queue_for_pull(owner, repo, pr, red_hold, token)

    def hold_skip(pr: dict[str, Any]) -> bool:
        return squash_held(pr, active=red_hold.active, linked=red_hold.linked)

    for line in poll_ready(
        rows,
        load,
        merge,
        dispatch,
        mark,
        update,
        on_conflict,
        dispatch_head,
        mirror,
        trigger,
        hold_skip,
        queue,
    ):
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
        pr = fetch_pr_for_update(owner, repo, number, token)
        # Reviews are on the PR head SHA, not the pull_request merge commit
        # that workflow_run.head_sha may point at.
        head_sha = str((pr.get("head") or {}).get("sha") or "") or head_sha_env
        compare = None
        if head_sha and not _is_fork(pr):
            try:
                compare = fetch_compare(owner, repo, _base_ref(pr), head_sha, token)
            except GateError as exc:
                print(f"compare skipped: {exc}")
        reason = branch_update_reason(pr, compare)
        if reason:
            try:
                changed = merge_main_into_head(owner, repo, _head_ref(pr), token)
            except UpdateConflict:
                try:
                    comment_on_conflict(owner, repo, number, head_sha, token)
                except GateError as exc:
                    print(f"#{number} comment skipped: {exc}")
                print(f"#{number} {CONFLICT_COMMENT_LEAD}")
                return 0
            if changed:
                print(f"#{number} updated: merged origin/main ({reason})")
                head_ref = _head_ref(pr)
                try:
                    dispatch_head_ci(owner, repo, head_ref, token)
                    print(f"#{number} dispatched CI on {head_ref}")
                except GateError as exc:
                    print(f"#{number} CI dispatch skipped: {exc}")
                return 0
        reviews = fetch_reviews(owner, repo, number, token)
        check_runs = None if checks_green else fetch_check_runs(owner, repo, head_sha, token)
        if head_sha and not _is_fork(pr):
            mirror_runs = (
                check_runs
                if check_runs is not None
                else fetch_check_runs(owner, repo, head_sha, token)
            )
            try:
                for line in mirror_missing_check_statuses(
                    owner, repo, number, head_sha, mirror_runs, token
                ):
                    print(line)
            except GateError as exc:
                print(f"#{number} mirror skipped: {exc}")
        if should_mark_ready(pr=pr, checks_green=checks_green, check_runs=check_runs):
            pr, ready_line = confirm_ready(
                number,
                pr,
                lambda n: mark_ready(owner, repo, n, token),
            )
            print(ready_line)
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
    hold = MainRedHold(False, frozenset())
    if not _is_fork(pr):
        try:
            hold = load_main_red_hold(owner, repo, token)
        except GateError as exc:
            print(f"#{number} hold skipped: {exc}")
        else:
            try:
                for line in post_queue_for_pull(owner, repo, pr, hold, token):
                    print(line)
            except GateError as exc:
                print(f"#{number} queue skipped: {exc}")
    if decision.action != "merge":
        return 0
    if squash_held(pr, active=hold.active, linked=hold.linked):
        print("squash skipped: held while main is red")
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
