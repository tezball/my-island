#!/usr/bin/env python3
"""Post-deploy HTTP/API smoke for fishing-journals.com (WF-040).

Not Playwright. Not Chaos. Not ZAP. Not Gatling load.
Proves: health UP, info SHA matches origin/main, public Place list JSON.
"""
from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
from typing import Any

from check_deploy_info import VerifyError, parse_info, verify


class SmokeError(RuntimeError):
    pass


def fetch(url: str, timeout: float) -> tuple[int, str, str]:
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            body = response.read().decode("utf-8", errors="replace")
            content_type = response.headers.get("Content-Type") or ""
            return response.status, body, content_type
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise SmokeError(f"HTTP {exc.code} from {url}: {body[:180]}") from exc
    except urllib.error.URLError as exc:
        raise SmokeError(f"could not fetch {url}: {exc.reason}") from exc


def parse_json(body: str, content_type: str, label: str) -> Any:
    snippet = body.lstrip()[:80].lower()
    if "text/html" in content_type.lower() or snippet.startswith("<!doctype") or snippet.startswith(
        "<html"
    ):
        raise SmokeError(f"{label} returned HTML (PWA) instead of JSON")
    try:
        return json.loads(body)
    except json.JSONDecodeError as exc:
        raise SmokeError(f"{label} is not JSON: {exc}") from exc


def check_health(url: str, timeout: float) -> None:
    _status, body, content_type = fetch(url, timeout)
    payload = parse_json(body, content_type, "health")
    if not isinstance(payload, dict):
        raise SmokeError("health JSON must be an object")
    status = str(payload.get("status") or "").upper()
    if status != "UP":
        raise SmokeError(f"health status {status!r} is not UP")


def check_places(url: str, timeout: float) -> int:
    _status, body, content_type = fetch(url, timeout)
    payload = parse_json(body, content_type, "places")
    if not isinstance(payload, list):
        raise SmokeError("places JSON must be an array")
    return len(payload)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--origin", default="https://fishing-journals.com")
    parser.add_argument("--expect-commit", required=True)
    parser.add_argument("--timeout", type=float, default=20)
    args = parser.parse_args()
    origin = args.origin.rstrip("/")
    try:
        check_health(f"{origin}/actuator/health", args.timeout)
        _status, body, content_type = fetch(f"{origin}/actuator/info", args.timeout)
        info = parse_info(body, content_type)
        verify(info, expect_commit=args.expect_commit, expect_env="mock-prod")
        count = check_places(f"{origin}/api/v1/places?published=true", args.timeout)
    except (SmokeError, VerifyError) as exc:
        print(f"MOCK-PROD SMOKE FAILED: {exc}", file=sys.stderr)
        return 1
    print(
        f"HTTP/API smoke OK: health UP, info {args.expect_commit}, "
        f"{count} published places (no Playwright / Chaos / ZAP)"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
