#!/usr/bin/env python3
"""Open one GitHub issue per red main SHA, and close it when main is green.

Runs from the Main red workflow on the default branch. A check run
conclusion of failure, or a commit status of failure or error, is red.
Pending, success, skipped, cancelled, and neutral are not. A SHA that is
not the current main HEAD does not open an issue. One issue per SHA
(label main-red). A later new failing check is a comment. This script
does not post commit statuses and does not merge.
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
from typing import Any, Protocol

LABEL = "main-red"
RED_STATES = frozenset({"failure", "error"})
_TITLE = re.compile(r"^main red ([0-9a-f]{40})$")


class MainRedError(RuntimeError):
    def __init__(self, message: str, status: int | None = None) -> None:
        super().__init__(message)
        self.status = status


@dataclass(frozen=True)
class Check:
    source: str  # check | status
    name: str
    description: str
    target_url: str
    state: str

    @property
    def key(self) -> str:
        return f"{self.source}:{self.name}"


@dataclass
class Issue:
    number: int
    title: str
    state: str
    body: str
    comments: list[str]


class Store(Protocol):
    def main_head(self) -> str: ...

    def issues(self) -> list[Issue]: ...

    def checks(self, sha: str) -> list[Check]: ...

    def ensure_label(self) -> None: ...

    def create_issue(self, title: str, body: str) -> Issue: ...

    def comment(self, number: int, body: str) -> None: ...

    def close(self, number: int) -> None: ...

    def reopen(self, number: int) -> None: ...


def normalize_sha(sha: str) -> str:
    return (sha or "").strip().lower()


def is_red_state(state: str) -> bool:
    """Failure and error are red. Pending is not."""
    return (state or "").strip().lower() in RED_STATES


def is_main_head(sha: str, main_head: str) -> bool:
    left = normalize_sha(sha)
    right = normalize_sha(main_head)
    return bool(left) and left == right


def one_line(text: str, limit: int = 300) -> str:
    flat = " ".join((text or "").split())
    if not flat:
        return "(no description)"
    if len(flat) > limit:
        return flat[: limit - 1] + "…"
    return flat


def issue_title(sha: str) -> str:
    return f"main red {normalize_sha(sha)}"


def sha_from_title(title: str) -> str:
    match = _TITLE.match((title or "").strip())
    return match.group(1) if match else ""


def latest_by_key(checks: list[Check]) -> list[Check]:
    by_key: dict[str, Check] = {}
    for check in checks:
        if check.name:
            by_key[check.key] = check
    return list(by_key.values())


def red_checks(checks: list[Check]) -> list[Check]:
    return [check for check in latest_by_key(checks) if is_red_state(check.state)]


def _check_description(run: dict[str, Any], fallback: str) -> str:
    output = run.get("output") if isinstance(run.get("output"), dict) else {}
    title = str(output.get("title") or "").strip()
    if title:
        return title
    summary = str(output.get("summary") or "").strip()
    if summary:
        return summary
    return fallback


def checks_from_check_runs(runs: list[dict[str, Any]]) -> list[Check]:
    """Latest check run per name. The conclusion is the state when completed."""
    ordered = sorted(
        (run for run in runs if isinstance(run, dict)),
        key=lambda run: (
            str(run.get("completed_at") or run.get("started_at") or ""),
            int(run.get("id") or 0),
        ),
    )
    by_name: dict[str, Check] = {}
    for run in ordered:
        name = str(run.get("name") or "").strip()
        if not name:
            continue
        status = str(run.get("status") or "").strip().lower()
        conclusion = str(run.get("conclusion") or "").strip().lower()
        state = conclusion if status == "completed" and conclusion else (status or conclusion)
        url = str(run.get("html_url") or run.get("details_url") or "").strip()
        by_name[name] = Check(
            source="check",
            name=name,
            description=_check_description(run, state or "(no description)"),
            target_url=url,
            state=state,
        )
    return list(by_name.values())


def checks_from_statuses(rows: list[dict[str, Any]]) -> list[Check]:
    """Latest status per context. The combined-status list is newest first."""
    seen: set[str] = set()
    out: list[Check] = []
    for row in rows:
        if not isinstance(row, dict):
            continue
        name = str(row.get("context") or "").strip()
        if not name or name in seen:
            continue
        seen.add(name)
        out.append(
            Check(
                source="status",
                name=name,
                description=str(row.get("description") or "").strip(),
                target_url=str(row.get("target_url") or "").strip(),
                state=str(row.get("state") or "").strip().lower(),
            )
        )
    return out


def latest_signal_states(
    check_runs: list[dict[str, Any]], statuses: list[dict[str, Any]]
) -> list[str]:
    """Latest state per check name and per status context.

    A pending status does not replace a different check's failure. A
    Jenkins status named like a GitHub check stays its own signal.
    """
    checks = checks_from_check_runs(check_runs) + checks_from_statuses(statuses)
    return [check.state for check in latest_by_key(checks)]


def format_checks(checks: list[Check]) -> str:
    lines: list[str] = []
    for check in sorted(checks, key=lambda item: (item.source, item.name)):
        lines.append(f"- name: {check.name}")
        lines.append(f"  source: {check.source}")
        lines.append(f"  description: {one_line(check.description)}")
        lines.append(f"  target: {check.target_url or '(none)'}")
    return "\n".join(lines)


def issue_body(sha: str, checks: list[Check]) -> str:
    return f"SHA: {normalize_sha(sha)}\n\nFailing checks:\n{format_checks(checks)}\n"


def new_check_comment(sha: str, checks: list[Check]) -> str:
    return f"New failing check on {normalize_sha(sha)}:\n{format_checks(checks)}\n"


def known_check_ids(text: str) -> set[str]:
    found: set[str] = set()
    name: str | None = None
    for line in (text or "").splitlines():
        if line.startswith("- name: "):
            name = line[len("- name: ") :].strip()
            continue
        if name and line.startswith("  source: "):
            source = line[len("  source: ") :].strip()
            if source in {"check", "status"}:
                found.add(f"{source}:{name}")
            name = None
    return found


def issue_known_ids(issue: Issue) -> set[str]:
    return known_check_ids(issue.body + "\n" + "\n".join(issue.comments))


def find_issue(issues: list[Issue], sha: str) -> Issue | None:
    title = issue_title(sha)
    matches = [issue for issue in issues if issue.title == title]
    if not matches:
        return None
    matches.sort(key=lambda issue: (issue.state != "open", issue.number))
    return matches[0]


def parse_event(event_name: str, event: dict[str, Any] | None) -> tuple[str, list[Check]]:
    payload = event if isinstance(event, dict) else {}
    if event_name == "check_run":
        run = payload.get("check_run") if isinstance(payload.get("check_run"), dict) else {}
        sha = str(run.get("head_sha") or "").strip()
        if not sha:
            suite = run.get("check_suite") if isinstance(run.get("check_suite"), dict) else {}
            sha = str(suite.get("head_sha") or "").strip()
        return normalize_sha(sha), checks_from_check_runs([run] if run else [])
    if event_name == "status":
        sha = normalize_sha(str(payload.get("sha") or ""))
        return sha, checks_from_statuses([payload] if payload.get("context") else [])
    return "", []


def close_comment(sha: str, main_head: str, reason: str) -> str:
    if reason == "moved":
        return f"Closing: {sha} is no longer main HEAD ({main_head})."
    return f"Closing: {sha} is green."


def _close_reason(sha: str, main_head: str, failing: list[Check]) -> str | None:
    if not is_main_head(sha, main_head):
        return "moved"
    if not failing:
        return "green"
    return None


def handle(event_name: str, event: dict[str, Any] | None, store: Store) -> list[str]:
    """Open, comment, or close main-red issues for this event.

    Pending is not a failing check. A feature-branch SHA is ignored for
    opening. An existing issue for the SHA is reused.
    """
    logs: list[str] = []
    main_head = normalize_sha(store.main_head())
    event_sha, event_checks = parse_event(event_name, event)

    def checks_for(sha: str) -> list[Check]:
        found = list(store.checks(sha))
        if sha and sha == event_sha:
            found = latest_by_key([*found, *event_checks])
        else:
            found = latest_by_key(found)
        return found

    if event_sha and is_main_head(event_sha, main_head):
        failing = red_checks(checks_for(event_sha))
        if failing:
            logs.extend(_record_failure(store, event_sha, failing))
        else:
            logs.append(f"ignore {event_sha}: not red")
    elif event_sha:
        logs.append(f"ignore {event_sha}: not main HEAD {main_head}")

    for issue in list(store.issues()):
        if issue.state != "open":
            continue
        sha = sha_from_title(issue.title)
        if not sha:
            continue
        reason = _close_reason(sha, main_head, red_checks(checks_for(sha)))
        if reason is None:
            continue
        store.comment(issue.number, close_comment(sha, main_head, reason))
        store.close(issue.number)
        logs.append(f"#{issue.number} closed: {reason}")

    logs.extend(_collapse_duplicates(store))
    return logs


def _record_failure(store: Store, sha: str, failing: list[Check]) -> list[str]:
    existing = find_issue(store.issues(), sha)
    if existing is None:
        store.ensure_label()
        created = store.create_issue(issue_title(sha), issue_body(sha, failing))
        return [f"opened #{created.number} for {sha}"]
    fresh = [check for check in failing if check.key not in issue_known_ids(existing)]
    if existing.state == "closed":
        store.reopen(existing.number)
        if fresh:
            store.comment(existing.number, new_check_comment(sha, fresh))
        else:
            store.comment(existing.number, f"Reopened: {sha} is red again.")
        return [f"reopened #{existing.number}"]
    if not fresh:
        return [f"#{existing.number} already open for {sha}"]
    store.comment(existing.number, new_check_comment(sha, fresh))
    return [f"#{existing.number} commented"]


def _collapse_duplicates(store: Store) -> list[str]:
    groups: dict[str, list[Issue]] = {}
    for issue in store.issues():
        if issue.state != "open":
            continue
        if not sha_from_title(issue.title):
            continue
        groups.setdefault(issue.title, []).append(issue)
    logs: list[str] = []
    for group in groups.values():
        if len(group) < 2:
            continue
        group.sort(key=lambda issue: issue.number)
        keeper = group[0]
        for dup in group[1:]:
            store.comment(dup.number, f"Duplicate of #{keeper.number}.")
            store.close(dup.number)
            logs.append(f"#{dup.number} duplicate of #{keeper.number}")
    return logs


def _github_request(
    method: str,
    url: str,
    token: str,
    payload: dict[str, Any] | None = None,
    timeout: float = 30,
) -> tuple[Any, str]:
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "my-island-main-red",
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
        raise MainRedError(
            f"HTTP {exc.code} {method} {url}: {err_body[:240]}",
            status=exc.code,
        ) from exc
    except urllib.error.URLError as exc:
        raise MainRedError(f"request failed {method} {url}: {exc.reason}") from exc


def _next_link(link: str) -> str | None:
    for part in link.split(","):
        bit = part.strip()
        if 'rel="next"' in bit:
            start = bit.find("<")
            end = bit.find(">")
            if start >= 0 and end > start:
                return bit[start + 1 : end]
    return None


class GitHubStore:
    """Issues and check reads. Does not post commit statuses."""

    def __init__(self, owner: str, repo: str, token: str) -> None:
        self.owner = owner
        self.repo = repo
        self.token = token
        self._base = f"https://api.github.com/repos/{owner}/{repo}"

    def _request(
        self, method: str, url: str, payload: dict[str, Any] | None = None
    ) -> tuple[Any, str]:
        return _github_request(method, url, self.token, payload)

    def _paginate(self, url: str) -> list[Any]:
        out: list[Any] = []
        while url:
            payload, link = self._request("GET", url)
            if not isinstance(payload, list):
                raise MainRedError("list payload missing")
            out.extend(payload)
            url = _next_link(link) or ""
        return out

    def main_head(self) -> str:
        payload, _ = self._request("GET", f"{self._base}/git/ref/heads/main")
        if not isinstance(payload, dict):
            raise MainRedError("main ref payload missing")
        obj = payload.get("object") if isinstance(payload.get("object"), dict) else {}
        return normalize_sha(str(obj.get("sha") or ""))

    def issues(self) -> list[Issue]:
        url = f"{self._base}/issues?state=all&labels={LABEL}&per_page=100"
        rows = self._paginate(url)
        out: list[Issue] = []
        for row in rows:
            if not isinstance(row, dict) or "pull_request" in row:
                continue
            number = int(row.get("number") or 0)
            if not number:
                continue
            comments = [
                str(item.get("body") or "")
                for item in self._paginate(
                    f"{self._base}/issues/{number}/comments?per_page=100"
                )
                if isinstance(item, dict)
            ]
            out.append(
                Issue(
                    number=number,
                    title=str(row.get("title") or ""),
                    state=str(row.get("state") or ""),
                    body=str(row.get("body") or ""),
                    comments=comments,
                )
            )
        return out

    def checks(self, sha: str) -> list[Check]:
        quoted = urllib.parse.quote(normalize_sha(sha), safe="")
        runs_url = f"{self._base}/commits/{quoted}/check-runs?per_page=100"
        runs: list[dict[str, Any]] = []
        while runs_url:
            payload, link = self._request("GET", runs_url)
            if not isinstance(payload, dict):
                raise MainRedError("check-runs payload missing")
            batch = payload.get("check_runs")
            if not isinstance(batch, list):
                raise MainRedError("check-runs payload missing list")
            runs.extend(item for item in batch if isinstance(item, dict))
            runs_url = _next_link(link) or ""
        statuses: list[dict[str, Any]] = []
        try:
            payload, _ = self._request("GET", f"{self._base}/commits/{quoted}/status")
        except MainRedError as exc:
            if exc.status != 404:
                raise
            payload = None
        if isinstance(payload, dict) and isinstance(payload.get("statuses"), list):
            statuses = [item for item in payload["statuses"] if isinstance(item, dict)]
        return latest_by_key(checks_from_check_runs(runs) + checks_from_statuses(statuses))

    def ensure_label(self) -> None:
        quoted = urllib.parse.quote(LABEL, safe="")
        try:
            self._request("GET", f"{self._base}/labels/{quoted}")
        except MainRedError as exc:
            if exc.status != 404:
                raise
            self._request(
                "POST",
                f"{self._base}/labels",
                {
                    "name": LABEL,
                    "color": "b60205",
                    "description": "Red main SHA",
                },
            )

    def create_issue(self, title: str, body: str) -> Issue:
        payload, _ = self._request(
            "POST",
            f"{self._base}/issues",
            {"title": title, "body": body, "labels": [LABEL]},
        )
        if not isinstance(payload, dict):
            raise MainRedError("issue payload missing")
        return Issue(
            number=int(payload.get("number") or 0),
            title=str(payload.get("title") or title),
            state=str(payload.get("state") or "open"),
            body=str(payload.get("body") or body),
            comments=[],
        )

    def comment(self, number: int, body: str) -> None:
        self._request(
            "POST",
            f"{self._base}/issues/{number}/comments",
            {"body": body},
        )

    def close(self, number: int) -> None:
        self._request(
            "PATCH",
            f"{self._base}/issues/{number}",
            {"state": "closed", "state_reason": "completed"},
        )

    def reopen(self, number: int) -> None:
        self._request("PATCH", f"{self._base}/issues/{number}", {"state": "open"})


def main(argv: list[str] | None = None) -> int:
    del argv
    token = os.environ.get("GITHUB_TOKEN") or ""
    repository = os.environ.get("GITHUB_REPOSITORY") or ""
    event_name = os.environ.get("GITHUB_EVENT_NAME") or ""
    event_path = os.environ.get("GITHUB_EVENT_PATH") or ""
    if "/" not in repository or not token:
        print("main-red skipped: missing GITHUB_REPOSITORY or GITHUB_TOKEN")
        return 1
    owner, repo = repository.split("/", 1)
    event: dict[str, Any] = {}
    if event_path:
        try:
            loaded = json.loads(open(event_path, encoding="utf-8").read())
        except (OSError, json.JSONDecodeError) as exc:
            print(f"main-red skipped: {exc}")
            return 1
        event = loaded if isinstance(loaded, dict) else {}
    try:
        for line in handle(event_name, event, GitHubStore(owner, repo, token)):
            print(line)
    except MainRedError as exc:
        print(f"main-red skipped: {exc}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
