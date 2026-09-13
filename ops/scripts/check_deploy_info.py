#!/usr/bin/env python3
"""Prove mock-prod catalog /actuator/info matches the SHA we just built (WF-037)."""
from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
from typing import Any

UNKNOWN = frozenset({"", "unknown", "changeme", "null", "none", "undefined"})


class VerifyError(RuntimeError):
    pass


def app_block(info: dict[str, Any]) -> dict[str, Any]:
    app = info.get("app")
    if not isinstance(app, dict):
        raise VerifyError("info JSON missing object 'app' (Caddy may be serving the PWA)")
    return app


def field(app: dict[str, Any], key: str) -> str:
    value = app.get(key)
    if value is None:
        raise VerifyError(f"info.app.{key} missing")
    return str(value).strip()


def reject_placeholder(label: str, value: str) -> str:
    if value.lower() in UNKNOWN:
        raise VerifyError(f"{label} is a placeholder ({value!r}) — image was not stamped")
    return value


def parse_info(body: str, content_type: str = "") -> dict[str, Any]:
    lowered = (content_type or "").lower()
    snippet = body.lstrip()[:200].lower()
    if "text/html" in lowered or snippet.startswith("<!doctype") or snippet.startswith("<html"):
        raise VerifyError(
            "got HTML instead of catalog info JSON — Caddy is not proxying /actuator/info"
        )
    try:
        parsed = json.loads(body)
    except json.JSONDecodeError as exc:
        raise VerifyError(f"info body is not JSON: {exc}") from exc
    if not isinstance(parsed, dict):
        raise VerifyError("info JSON must be an object")
    return parsed


def verify(
    info: dict[str, Any],
    *,
    expect_commit: str,
    expect_version: str | None = None,
    expect_env: str | None = None,
) -> dict[str, str]:
    expect = reject_placeholder("expect-commit", expect_commit.strip().lower())
    app = app_block(info)
    commit = reject_placeholder("app.gitCommit", field(app, "gitCommit")).lower()
    version = field(app, "version")
    env = field(app, "env")
    if commit != expect:
        raise VerifyError(
            f"live gitCommit {commit} != expected {expect} — deploy did not land this SHA"
        )
    if expect_version and version != expect_version:
        raise VerifyError(f"live version {version!r} != expected {expect_version!r}")
    if expect_env and env != expect_env:
        raise VerifyError(f"live env {env!r} != expected {expect_env!r}")
    return {
        "service": str(app.get("service") or "catalog"),
        "version": version,
        "gitCommit": commit,
        "gitCommitShort": str(app.get("gitCommitShort") or ""),
        "gitBranch": str(app.get("gitBranch") or ""),
        "env": env,
        "buildTime": str(app.get("buildTime") or ""),
    }


def fetch(url: str, timeout: float) -> tuple[str, str]:
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            body = response.read().decode("utf-8", errors="replace")
            content_type = response.headers.get("Content-Type") or ""
            return body, content_type
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise VerifyError(f"HTTP {exc.code} from {url}: {body[:180]}") from exc
    except urllib.error.URLError as exc:
        raise VerifyError(f"could not fetch {url}: {exc.reason}") from exc


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", required=True, help="Public catalog /actuator/info URL")
    parser.add_argument("--expect-commit", required=True, help="Full git SHA that must be live")
    parser.add_argument("--expect-version", default="")
    parser.add_argument("--expect-env", default="")
    parser.add_argument("--timeout", type=float, default=15)
    args = parser.parse_args()
    try:
        body, content_type = fetch(args.url, args.timeout)
        info = parse_info(body, content_type)
        landed = verify(
            info,
            expect_commit=args.expect_commit,
            expect_version=args.expect_version or None,
            expect_env=args.expect_env or None,
        )
    except VerifyError as exc:
        print(f"DEPLOY INFO CHECK FAILED: {exc}", file=sys.stderr)
        return 1
    print(
        "Deploy landed: "
        f"{landed['service']} {landed['version']} "
        f"git {landed['gitCommit']} ({landed['gitCommitShort'] or 'no-short'}) "
        f"env={landed['env']} built={landed['buildTime']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
