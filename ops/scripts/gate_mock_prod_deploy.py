#!/usr/bin/env python3
"""Decide whether Jenkins should deploy origin/main to mock-prod (WF-040).

Prints one line: DEPLOY <sha> | SKIP <reason>
Exit 0 on DEPLOY/SKIP. Exit 1 when a deploy is required but secrets/branch are wrong.
Agents never SSH. Feature branches never deploy.
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import urllib.error
import urllib.request
from typing import Any

REQUIRED_CHECKS = (
    ("unit tests", ("unit tests", "unit")),
    ("catalog tests", ("catalog tests", "catalog")),
    ("web tests", ("web tests", "web")),
    ("compose stack", ("compose stack", "stack")),
)

class GateError(RuntimeError):
    pass


def git(*args: str, cwd: str | None = None) -> str:
    out = subprocess.check_output(["git", *args], cwd=cwd, text=True).strip()
    return out


def origin_main_sha(repo: str) -> str:
    try:
        git("fetch", "origin", "main", cwd=repo)
    except subprocess.CalledProcessError as exc:
        raise GateError(f"git fetch origin main failed: {exc}") from exc
    return git("rev-parse", "origin/main", cwd=repo).lower()


def current_branch(repo: str) -> str:
    return git("rev-parse", "--abbrev-ref", "HEAD", cwd=repo)


def fetch_json(url: str, token: str, timeout: float) -> Any:
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "my-island-wf-040",
    }
    if token and token not in ("changeme", "changeme-github"):
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise GateError(f"HTTP {exc.code} from {url}: {body[:180]}") from exc
    except urllib.error.URLError as exc:
        raise GateError(f"could not fetch {url}: {exc.reason}") from exc


def check_runs(owner: str, repo: str, sha: str, token: str, timeout: float) -> list[dict[str, Any]]:
    url = (
        f"https://api.github.com/repos/{owner}/{repo}/commits/{sha}/check-runs"
        "?per_page=100"
    )
    payload = fetch_json(url, token, timeout)
    if not isinstance(payload, dict):
        raise GateError("GitHub check-runs payload missing list")
    runs = payload.get("check_runs")
    if not isinstance(runs, list):
        raise GateError("GitHub check-runs payload missing list")
    return [r for r in runs if isinstance(r, dict)]


def required_conclusions(runs: list[dict[str, Any]]) -> dict[str, str]:
    """Map required job → success|failure|pending|missing."""
    out: dict[str, str] = {}
    for label, aliases in REQUIRED_CHECKS:
        matches = []
        for run in runs:
            name = str(run.get("name") or "").strip().lower()
            if name in aliases or any(name.startswith(a) for a in aliases):
                matches.append(run)
        if not matches:
            out[label] = "missing"
            continue
        conclusions = []
        for run in matches:
            status = str(run.get("status") or "").lower()
            conclusion = str(run.get("conclusion") or "").lower()
            if status and status != "completed":
                conclusions.append("pending")
            elif conclusion == "success":
                conclusions.append("success")
            else:
                conclusions.append("failure")
        if "success" in conclusions:
            out[label] = "success"
        elif "pending" in conclusions:
            out[label] = "pending"
        else:
            out[label] = "failure"
    return out


def pick_merged_pr_head(payload: Any) -> str | None:
    """Squash-merge SHA → merged PR head SHA (GITHUB_TOKEN push CI never ran)."""
    if not isinstance(payload, list):
        return None
    merged = [p for p in payload if isinstance(p, dict) and p.get("merged_at")]
    if not merged:
        return None
    merged.sort(key=lambda p: str(p.get("merged_at") or ""), reverse=True)
    head = merged[0].get("head")
    if not isinstance(head, dict):
        return None
    sha = str(head.get("sha") or "").strip().lower()
    return sha or None


def associated_pr_head_sha(
    owner: str, repo: str, sha: str, token: str, timeout: float
) -> str | None:
    url = f"https://api.github.com/repos/{owner}/{repo}/commits/{sha}/pulls"
    return pick_merged_pr_head(fetch_json(url, token, timeout))


def not_green(states: dict[str, str]) -> list[str]:
    return [f"{name}={state}" for name, state in states.items() if state != "success"]


def live_git_commit(info_url: str, timeout: float) -> str | None:
    req = urllib.request.Request(info_url, headers={"Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            body = response.read().decode("utf-8", errors="replace")
            if body.lstrip()[:15].lower().startswith("<!doctype") or body.lstrip().lower().startswith(
                "<html"
            ):
                return None
            parsed = json.loads(body)
    except (urllib.error.URLError, urllib.error.HTTPError, json.JSONDecodeError, TimeoutError):
        return None
    app = parsed.get("app") if isinstance(parsed, dict) else None
    if not isinstance(app, dict):
        return None
    commit = str(app.get("gitCommit") or "").strip().lower()
    if not commit or commit in {"unknown", "changeme"}:
        return None
    return commit


def secrets_ok() -> tuple[bool, str]:
    host = os.environ.get("MOCK_PROD_HOST", "")
    user = os.environ.get("MOCK_PROD_USER", "")
    key = os.environ.get("MOCK_PROD_SSH_KEY_PATH", "")
    if not host or host.startswith("changeme"):
        return False, "MOCK_PROD_HOST missing"
    if not user or user.startswith("changeme"):
        return False, "MOCK_PROD_USER missing"
    if not key or not os.path.isfile(key):
        return False, "MOCK_PROD_SSH_KEY_PATH missing or unreadable"
    return True, "ok"


def decide(
    *,
    repo: str,
    owner: str,
    gh_repo: str,
    token: str,
    info_url: str,
    timeout: float,
    allow_non_main_checkout: bool,
) -> str:
    branch = current_branch(repo)
    if branch != "main" and not allow_non_main_checkout:
        raise GateError(f"HOST_REPO is on {branch!r} — deploy only from main")
    sha = origin_main_sha(repo)
    runs = check_runs(owner, gh_repo, sha, token, timeout)
    states = required_conclusions(runs)
    missing = not_green(states)
    if missing:
        if any("=failure" in item for item in missing):
            return f"SKIP origin/main {sha} GHA not green: {', '.join(missing)}"
        pr_head = associated_pr_head_sha(owner, gh_repo, sha, token, timeout)
        if not pr_head or pr_head == sha:
            return f"SKIP origin/main {sha} GHA not green: {', '.join(missing)}"
        pr_states = required_conclusions(check_runs(owner, gh_repo, pr_head, token, timeout))
        pr_missing = not_green(pr_states)
        if pr_missing:
            return (
                f"SKIP origin/main {sha} GHA not green: {', '.join(missing)} "
                f"(merged PR head {pr_head}: {', '.join(pr_missing)})"
            )
        # Squash SHA has no push checks; the PR that produced it was green (WF-048).
    live = live_git_commit(info_url, timeout)
    if live == sha:
        return f"SKIP origin/main {sha} already live on mock-prod"
    ok, reason = secrets_ok()
    if not ok:
        raise GateError(f"green main needs deploy but {reason} (fail closed; key stays in Jenkins)")
    return f"DEPLOY {sha}"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", default=os.environ.get("HOST_REPO") or os.getcwd())
    parser.add_argument("--owner", default=os.environ.get("GITHUB_OWNER", "tezball"))
    parser.add_argument("--gh-repo", default=os.environ.get("GITHUB_REPO", "my-island"))
    parser.add_argument("--timeout", type=float, default=20)
    parser.add_argument(
        "--info-url",
        default=os.environ.get(
            "MOCK_PROD_PUBLIC_INFO_URL", "https://fishing-journals.com/actuator/info"
        ),
    )
    parser.add_argument(
        "--allow-non-main-checkout",
        action="store_true",
        help="Test-only: skip the local branch == main check",
    )
    args = parser.parse_args()
    token = os.environ.get("JENKINS_GITHUB_TOKEN") or os.environ.get("GITHUB_TOKEN") or ""
    try:
        line = decide(
            repo=args.repo,
            owner=args.owner,
            gh_repo=args.gh_repo,
            token=token,
            info_url=args.info_url,
            timeout=args.timeout,
            allow_non_main_checkout=args.allow_non_main_checkout,
        )
    except GateError as exc:
        print(f"FAIL {exc}", file=sys.stderr)
        return 1
    print(line)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
