#!/usr/bin/env python3
"""Call Ollama for PR review / autofix. Stdlib only."""

from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.request

REVIEW_SCHEMA = """Return ONLY JSON (no markdown) with this shape:
{
  "verdict": "approve" | "changes_requested",
  "summary": "one-paragraph review for the GitHub PR",
  "findings": [
    {
      "severity": "blocking" | "important" | "nit",
      "path": "repo-relative/file.ext",
      "line": 1,
      "title": "short title",
      "body": "what is wrong and how to fix it"
    }
  ]
}

Rules:
- verdict=changes_requested if any finding is blocking or important.
- verdict=approve if there are no findings, or only nits.
- Do not invent files that are not in the diff.
- Flag security issues (authz, secrets, injection, Stripe/payment, PII) as blocking.
- Flag broken booking/payment/auth logic as blocking.
- Style-only comments are nits.
- If the diff is docs-only or trivial, approve.
"""

AUTOFIX_SCHEMA = """Return ONLY JSON (no markdown) with this shape:
{
  "commit_message": "fix(ai-review): short description",
  "edits": [
    {
      "path": "repo-relative/file.ext",
      "old": "exact existing snippet to replace (must match the file)",
      "new": "replacement snippet"
    }
  ]
}

Rules:
- Only edit files that appear in the review findings.
- old must be an exact substring of the current file, unique in that file.
- Prefer the smallest possible snippet.
- If you cannot produce a safe mechanical fix, return {"commit_message":"","edits":[]}.
- Never modify jenkins/secrets, .env, or credential files.
"""


def ollama_urls() -> list[str]:
    primary = os.environ.get("OLLAMA_BASE_URL", "http://127.0.0.1:11434").rstrip("/")
    extras = [
        "http://ollama:11434",
        "http://host.docker.internal:11434",
        "http://127.0.0.1:11434",
    ]
    seen: list[str] = []
    for url in [primary, *extras]:
        if url not in seen:
            seen.append(url)
    return seen


def post_json(url: str, payload: dict, timeout: int = 180) -> dict:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def chat(messages: list[dict]) -> str:
    model = os.environ.get("OLLAMA_MODEL", "llama3.2")
    body = {
        "model": model,
        "stream": False,
        "format": "json",
        "options": {"temperature": 0.1},
        "messages": messages,
    }
    last_err: Exception | None = None
    for base in ollama_urls():
        url = f"{base}/api/chat"
        for attempt in range(1, 9):
            try:
                result = post_json(url, body)
                content = result.get("message", {}).get("content", "")
                if not content:
                    raise RuntimeError(f"empty Ollama response from {url}")
                return content
            except urllib.error.HTTPError as exc:
                last_err = exc
                detail = exc.read().decode("utf-8", errors="replace")
                if exc.code in (404, 500) and "not found" in detail.lower() and attempt < 8:
                    time.sleep(5)
                    continue
                break
            except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
                last_err = exc
                time.sleep(2)
                break
    raise SystemExit(f"Ollama chat failed: {last_err}")


def extract_json(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.startswith("json"):
            text = text[4:]
        text = text.strip()
    start = text.find("{")
    end = text.rfind("}")
    if start < 0 or end < 0:
        raise ValueError(f"No JSON object in model output: {text[:400]}")
    return json.loads(text[start : end + 1])


def cmd_review() -> None:
    diff = sys.stdin.read()
    if not diff.strip():
        print(json.dumps({"verdict": "approve", "summary": "Empty diff.", "findings": []}))
        return
    max_chars = int(os.environ.get("AI_REVIEW_MAX_CHARS", "80000"))
    if len(diff) > max_chars:
        diff = diff[:max_chars] + "\n\n[diff truncated]\n"
    title = os.environ.get("CHANGE_TITLE", "")
    body = os.environ.get("CHANGE_BODY", "")
    user = (
        f"PR title: {title}\n\nPR body:\n{body}\n\nUnified diff:\n{diff}"
    )
    raw = chat(
        [
            {
                "role": "system",
                "content": "You are the My Island CI reviewer (camping/glamping booking platform: React + Spring Boot). "
                + REVIEW_SCHEMA,
            },
            {"role": "user", "content": user},
        ]
    )
    parsed = extract_json(raw)
    verdict = parsed.get("verdict", "changes_requested")
    findings = parsed.get("findings") or []
    blocking = [f for f in findings if f.get("severity") in ("blocking", "important")]
    if blocking:
        verdict = "changes_requested"
    elif verdict not in ("approve", "changes_requested"):
        verdict = "approve" if not findings else "changes_requested"
    parsed["verdict"] = verdict
    parsed["findings"] = findings
    parsed.setdefault("summary", "")
    print(json.dumps(parsed, indent=2))


def cmd_autofix() -> None:
    payload = json.loads(sys.stdin.read())
    review = json.dumps(payload.get("review", {}), indent=2)
    snippets = payload.get("snippets", "")
    raw = chat(
        [
            {
                "role": "system",
                "content": "You apply mechanical fixes for a CI AI review on My Island. "
                + AUTOFIX_SCHEMA,
            },
            {
                "role": "user",
                "content": f"Review JSON:\n{review}\n\nCurrent file excerpts:\n{snippets}",
            },
        ]
    )
    parsed = extract_json(raw)
    parsed.setdefault("edits", [])
    parsed.setdefault("commit_message", "fix(ai-review): apply review findings")
    print(json.dumps(parsed, indent=2))


def main() -> None:
    if len(sys.argv) < 2 or sys.argv[1] not in ("review", "autofix"):
        print("usage: ai_ollama.py review|autofix < stdin", file=sys.stderr)
        sys.exit(2)
    if sys.argv[1] == "review":
        cmd_review()
    else:
        cmd_autofix()


if __name__ == "__main__":
    main()
