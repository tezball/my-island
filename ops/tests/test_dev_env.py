from __future__ import annotations

import json
import os
import socket
import urllib.error
import urllib.request
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[2]


def test_compose_lists_required_services() -> None:
    text = (REPO / "compose.yml").read_text()
    for name in (
        "postgres:",
        "loki:",
        "prometheus:",
        "alertmanager:",
        "grafana:",
        "workspace:",
    ):
        assert name in text
    assert "dockerfile: .devcontainer/Dockerfile" in text


def test_devcontainer_uses_compose_workspace() -> None:
    data = json.loads((REPO / ".devcontainer" / "devcontainer.json").read_text())
    assert data["dockerComposeFile"] == ["../compose.yml", "docker-compose.yml"]
    assert data["service"] == "workspace"
    assert data["workspaceFolder"] == "/workspace"


def test_environment_json_starts_compose() -> None:
    data = json.loads((REPO / ".cursor" / "environment.json").read_text())
    assert data["build"]["dockerfile"] == "Dockerfile"
    assert data["install"] == "bash .cursor/install.sh"
    assert data["start"] == "bash .cursor/start.sh"
    assert data["user"] == "ubuntu"


def test_ops_compose_is_include_wrapper() -> None:
    text = (REPO / "ops" / "compose.yml").read_text()
    assert "../compose.yml" in text


def _try_http(url: str) -> bool:
    try:
        with urllib.request.urlopen(url, timeout=3) as response:
            return 200 <= response.status < 300
    except (urllib.error.URLError, TimeoutError, ConnectionError, OSError):
        return False


def grafana_base() -> str | None:
    env = os.environ.get("GRAFANA_URL")
    candidates = [c for c in (env, "http://grafana:3000", "http://127.0.0.1:3030") if c]
    for base in candidates:
        if _try_http(f"{base}/api/health"):
            return base
    return None


def postgres_reachable() -> bool:
    host = os.environ.get("POSTGRES_HOST")
    port = int(os.environ.get("POSTGRES_PORT", "5432"))
    candidates: list[tuple[str, int]] = []
    if host:
        candidates.append((host, port))
    candidates.extend([("postgres", 5432), ("127.0.0.1", 5433)])
    seen: set[tuple[str, int]] = set()
    for item in candidates:
        if item in seen:
            continue
        seen.add(item)
        try:
            with socket.create_connection(item, timeout=2):
                return True
        except OSError:
            continue
    return False


def _require_or_skip(reason: str) -> None:
    if os.environ.get("REQUIRE_STACK") == "1":
        pytest.fail(reason)
    pytest.skip(reason)


@pytest.mark.stack
def test_grafana_health() -> None:
    base = grafana_base()
    if not base:
        _require_or_skip("Grafana is not reachable")
        return
    with urllib.request.urlopen(f"{base}/api/health", timeout=5) as response:
        body = response.read().decode()
    assert "database" in body or "ok" in body.lower()


@pytest.mark.stack
def test_postgres_accepts_tcp() -> None:
    if not postgres_reachable():
        _require_or_skip("Postgres is not reachable")
