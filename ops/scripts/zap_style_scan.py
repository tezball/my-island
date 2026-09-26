#!/usr/bin/env python3
"""ZAP-style deny scan for public Place writes (WF-044).

Documented equivalent of an OWASP ZAP baseline: the house severity bar is an
anonymous Place POST/PUT/PATCH/DELETE that is not 401 or 403. The target is
local compose (127.0.0.1), never the public host. No secrets.
"""

from __future__ import annotations

import json
import sys
import urllib.error
import urllib.request

DENY = {401, 403}


def status(base: str, method: str, path: str) -> int:
    request = urllib.request.Request(
        base.rstrip("/") + path,
        data=b"{}" if method != "GET" else None,
        method=method,
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            return response.status
    except urllib.error.HTTPError as exc:
        return exc.code


def scan(base: str) -> list[str]:
    findings: list[str] = []
    listed = status(base, "GET", "/api/v1/places")
    if listed != 200:
        findings.append(f"GET /api/v1/places -> {listed} (want 200)")
    for method in ("POST", "PUT", "PATCH", "DELETE"):
        path = "/api/v1/places" if method == "POST" else "/api/v1/places/missing"
        code = status(base, method, path)
        if code not in DENY:
            findings.append(f"{method} {path} -> {code} (want 401 or 403)")
    return findings


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: zap_style_scan.py http://127.0.0.1:8081", file=sys.stderr)
        return 2
    findings = scan(sys.argv[1])
    print(json.dumps({"target": sys.argv[1], "findings": findings}))
    return 1 if findings else 0


if __name__ == "__main__":
    raise SystemExit(main())
