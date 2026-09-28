#!/usr/bin/env python3
"""Start Jenkins job deploy-mock-prod after CI succeeds on the default branch.

Called from GitHub Actions job ``mock-prod signal`` only. That job already
waits until unit, catalog, web, stack, chaos, and zap have succeeded on main.

Reads ``JENKINS_URL`` and ``JENKINS_ADMIN_PASSWORD`` from the environment
(same names as ``.env``). The password is Jenkins credential
``deploy-mock-prod-trigger``. Nothing here is a webhook URL or a token value.

Does not SSH. Does not print the password. Feature-branch deploys stay in
``gate_mock_prod_deploy.py`` on the Jenkins job.
"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from typing import Any

JOB_NAME = "deploy-mock-prod"
INVOKE_PATH = "generic-webhook-trigger/invoke"


class TriggerError(RuntimeError):
    pass


@dataclass(frozen=True)
class TriggerRequest:
    url: str
    body: bytes
    headers: dict[str, str]


def redact(text: str, secret: str) -> str:
    if secret and secret in text:
        return text.replace(secret, "[redacted]")
    return text


def invoke_url(jenkins_url: str) -> str:
    raw = (jenkins_url or "").strip()
    if not raw:
        raise TriggerError("JENKINS_URL is empty")
    parsed = urllib.parse.urlsplit(raw)
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        raise TriggerError("JENKINS_URL must be an http(s) base URL")
    if parsed.username or parsed.password:
        raise TriggerError("JENKINS_URL must not include credentials")
    if parsed.query or parsed.fragment:
        raise TriggerError("JENKINS_URL must not include a query or fragment")
    path = parsed.path.rstrip("/")
    base = urllib.parse.urlunsplit((parsed.scheme, parsed.netloc, path + "/", "", ""))
    return urllib.parse.urljoin(base, INVOKE_PATH)


def build_request(jenkins_url: str, token: str, sha: str) -> TriggerRequest:
    secret = (token or "").strip()
    if not secret:
        raise TriggerError("JENKINS_ADMIN_PASSWORD is empty")
    payload = {
        "ref": "refs/heads/main",
        "conclusion": "success",
        "workflow": "CI",
        "sha": (sha or "").strip(),
    }
    return TriggerRequest(
        url=invoke_url(jenkins_url),
        body=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {secret}",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "my-island-mock-prod-signal",
        },
    )


def job_triggered(payload: Any, job: str = JOB_NAME) -> bool:
    if not isinstance(payload, dict):
        return False
    jobs = payload.get("jobs")
    if not isinstance(jobs, dict):
        return False
    item = jobs.get(job)
    if not isinstance(item, dict):
        for key, value in jobs.items():
            if isinstance(key, str) and (key == job or key.endswith("/" + job)) and isinstance(value, dict):
                item = value
                break
    if not isinstance(item, dict):
        return False
    return item.get("triggered") is True


def _read_response(response: Any) -> str:
    raw = response.read()
    if isinstance(raw, bytes):
        return raw.decode("utf-8", errors="replace")
    return str(raw)


def post_trigger(request: TriggerRequest, opener: Any, timeout: float, secret: str) -> dict[str, Any]:
    req = urllib.request.Request(
        request.url,
        data=request.body,
        headers=request.headers,
        method="POST",
    )
    try:
        with opener(req, timeout=timeout) as response:
            text = _read_response(response)
            status = getattr(response, "status", 200)
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise TriggerError(
            f"HTTP {exc.code} from Jenkins trigger: {redact(body[:180], secret)}"
        ) from exc
    except urllib.error.URLError as exc:
        raise TriggerError(f"could not reach Jenkins: {redact(str(exc.reason), secret)}") from exc
    if status < 200 or status >= 300:
        raise TriggerError(f"HTTP {status} from Jenkins trigger: {redact(text[:180], secret)}")
    try:
        parsed = json.loads(text) if text.strip() else {}
    except json.JSONDecodeError as exc:
        raise TriggerError(f"Jenkins trigger returned non-JSON: {redact(text[:180], secret)}") from exc
    if not isinstance(parsed, dict):
        raise TriggerError("Jenkins trigger JSON was not an object")
    if not job_triggered(parsed):
        message = str(parsed.get("message") or "job was not triggered")
        raise TriggerError(redact(message, secret))
    return parsed


def main() -> int:
    token = os.environ.get("JENKINS_ADMIN_PASSWORD", "")
    try:
        request = build_request(
            os.environ.get("JENKINS_URL", ""),
            token,
            os.environ.get("MOCK_PROD_SHA", ""),
        )
        post_trigger(request, urllib.request.urlopen, timeout=30, secret=token.strip())
    except TriggerError as exc:
        print(redact(str(exc), token.strip()), file=sys.stderr)
        return 1
    sha = (os.environ.get("MOCK_PROD_SHA") or "").strip()
    print(f"triggered {JOB_NAME} for {sha or 'origin/main'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
