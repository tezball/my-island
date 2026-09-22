#!/usr/bin/env python3
"""Post GitHub commit statuses from laptop Jenkins (WF-051).

Contexts match GHA job names so branch protection can retarget later.
Never prints the token. Exit 0 when the token is unset (local-ci without PAT).
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request

CONTEXTS = (
    "unit tests",
    "catalog tests",
    "web tests",
    "compose stack",
)
STATES = frozenset({"pending", "success", "failure", "error"})


class StatusError(RuntimeError):
    pass


def token_from_env() -> str:
    return (os.environ.get("JENKINS_GITHUB_TOKEN") or os.environ.get("GITHUB_TOKEN") or "").strip()


def skip_token(token: str) -> bool:
    return (not token) or token in {"changeme", "changeme-github"}


def repo_from_env() -> tuple[str, str]:
    raw = (os.environ.get("GITHUB_REPOSITORY") or "tezball/my-island").strip()
    if "/" not in raw:
        raise StatusError(f"bad GITHUB_REPOSITORY: {raw}")
    owner, repo = raw.split("/", 1)
    return owner, repo


def sha_from_env() -> str:
    sha = (
        os.environ.get("GIT_COMMIT")
        or os.environ.get("HEAD_SHA")
        or ""
    ).strip()
    if not sha:
        raise StatusError("GIT_COMMIT / HEAD_SHA missing")
    return sha


def payload(context: str, state: str, description: str) -> dict[str, str]:
    if context not in CONTEXTS:
        raise StatusError(f"unknown context: {context}")
    if state not in STATES:
        raise StatusError(f"unknown state: {state}")
    text = (description or state).strip() or state
    return {
        "state": state,
        "context": context,
        "description": text[:140],
    }


def post_status(
    owner: str,
    repo: str,
    sha: str,
    body: dict[str, str],
    token: str,
    timeout: float = 30,
) -> int:
    url = f"https://api.github.com/repos/{owner}/{repo}/statuses/{sha}"
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        method="POST",
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "my-island-wf-051",
            "X-GitHub-Api-Version": "2022-11-28",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return int(resp.status)
    except urllib.error.HTTPError as exc:
        err = exc.read().decode("utf-8", errors="replace")[:240]
        raise StatusError(f"HTTP {exc.code} posting status: {err}") from exc
    except urllib.error.URLError as exc:
        raise StatusError(f"status request failed: {exc.reason}") from exc


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--context", required=True, choices=CONTEXTS)
    parser.add_argument("--state", required=True, choices=sorted(STATES))
    parser.add_argument("--description", default="")
    args = parser.parse_args(argv)

    token = token_from_env()
    if skip_token(token):
        print(f"skip status ({args.context} {args.state}: no token)")
        return 0

    try:
        owner, repo = repo_from_env()
        sha = sha_from_env()
        body = payload(args.context, args.state, args.description)
        code = post_status(owner, repo, sha, body, token)
    except StatusError as exc:
        print(f"status skipped: {exc}")
        return 0

    print(f"{args.context} {args.state} http={code}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
