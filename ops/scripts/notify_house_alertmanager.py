#!/usr/bin/env python3
"""Tell house Alertmanager a Gatling job failed. No SMTP. No secrets."""

from __future__ import annotations

import json
import os
import sys
import urllib.request

def main() -> int:
    url = os.environ.get("HOUSE_ALERTMANAGER_URL", "").rstrip("/")
    job = os.environ.get("GATLING_JOB", "gatling")
    if not url:
        print("HOUSE_ALERTMANAGER_URL unset; Jenkins stays red. No leftover FJ email.")
        return 0
    payload = [
        {
            "labels": {
                "alertname": "GatlingJobFailed",
                "job": job,
                "severity": "warning",
            },
            "annotations": {"summary": f"{job} failed"},
        }
    ]
    request = urllib.request.Request(
        url + "/api/v2/alerts",
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=10) as response:
        print(f"house alertmanager {response.status} for {job}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
