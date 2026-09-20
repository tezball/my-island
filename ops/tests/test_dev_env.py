from __future__ import annotations

import json
import os
import socket
import stat
import subprocess
import urllib.error
import urllib.request
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[2]
POSTGIS_IMAGE = "ghcr.io/baosystems/postgis:17-3.5"


def _compose_postgres_image_line() -> str:
    for line in (REPO / "compose.yml").read_text().splitlines():
        stripped = line.strip()
        if stripped.startswith("image:") and "postgis" in stripped:
            return stripped
    raise AssertionError("compose.yml postgres PostGIS image line not found")


def _postgres_image() -> str:
    return _compose_postgres_image_line().split("image:", 1)[1].strip()


def test_compose_lists_required_services() -> None:
    text = (REPO / "compose.yml").read_text()
    for name in (
        "postgres:",
        "loki:",
        "prometheus:",
        "alertmanager:",
        "grafana:",
        "workspace:",
        "catalog:",
        "web:",
    ):
        assert name in text
    assert "dockerfile: .devcontainer/Dockerfile" in text
    assert _postgres_image() == POSTGIS_IMAGE
    assert "postgis/postgis:" not in _compose_postgres_image_line()


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
    assert "mcpServers" not in data


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


def catalog_base() -> str | None:
    candidates = ["http://catalog:8080", "http://127.0.0.1:8081"]
    for base in candidates:
        if _try_http(f"{base}/actuator/health"):
            return base
    return None


@pytest.mark.stack
def test_catalog_health() -> None:
    base = catalog_base()
    if not base:
        _require_or_skip("Catalog is not reachable")
        return
    with urllib.request.urlopen(f"{base}/actuator/health", timeout=5) as response:
        body = response.read().decode()
    assert "UP" in body
    assert "postgis" in body.lower() or "db" in body.lower()


def test_app_cli_help_and_no_chaos() -> None:
    app = REPO / "scripts" / "app"
    assert app.is_file()
    assert app.stat().st_mode & stat.S_IXUSR
    help_out = subprocess.check_output([str(app), "help"], text=True)
    for word in ("start", "stop", "test"):
        assert word in help_out
    text = app.read_text()
    start_arm = text.split("start)")[1].split("stop)")[0]
    assert "compose.chaos.yml" not in start_arm
    assert 'exec "$DEV" start' in start_arm
    assert "categoryId" in text
    assert "countyId" in text
    assert "latitude" in text
    assert "longitude" in text
    assert "X-Catalog-Import-Key" in text
    assert "CATALOG_IMPORT_KEY" in text
    unknown = subprocess.run(
        [str(app), "not-a-command"], capture_output=True, text=True, check=False
    )
    assert unknown.returncode != 0


def test_seed_and_compose_share_catalog_import_key() -> None:
    compose = (REPO / "compose.yml").read_text()
    assert "CATALOG_IMPORT_KEY: ${CATALOG_IMPORT_KEY:-local-import}" in compose
    dev = (REPO / "scripts" / "dev").read_text()
    seed = dev.split("seed_local_pois()")[1].split("ensure_catalog_db()")[0]
    assert "CATALOG_IMPORT_KEY" in seed
    assert "local-import" in seed
    assert "import_leads.py" in seed
    assert "http://catalog:8080" in seed
    importer = (REPO / "ops" / "scripts" / "import_leads.py").read_text()
    assert 'DEFAULT_IMPORT_KEY = "local-import"' in importer
    assert "X-Catalog-Import-Key" in importer


@pytest.mark.stack
def test_seeded_pois_and_place_post_requires_import_key() -> None:
    """GHA compose stack: seed must write Places; anonymous POST stays 401."""
    base = catalog_base()
    if not base:
        _require_or_skip("Catalog is not reachable")
        return
    with urllib.request.urlopen(f"{base}/api/v1/places?published=true", timeout=15) as response:
        published = json.loads(response.read().decode())
    assert isinstance(published, list)
    assert len(published) >= 90, f"seed expected ~101 POIs, got {len(published)}"

    payload = json.dumps(
        {
            "name": "Anon write blocked",
            "slug": "anon-write-blocked-stack",
            "categoryId": "poi",
            "countyId": "kerry",
            "published": True,
            "latitude": 51.77,
            "longitude": -10.54,
        }
    ).encode()
    anon = urllib.request.Request(
        f"{base}/api/v1/places",
        data=payload,
        method="POST",
        headers={"Content-Type": "application/json", "Accept": "application/json"},
    )
    try:
        urllib.request.urlopen(anon, timeout=10)
        pytest.fail("anonymous Place POST must not succeed")
    except urllib.error.HTTPError as exc:
        assert exc.code in {401, 403}

    keyed = urllib.request.Request(
        f"{base}/api/v1/places",
        data=payload.replace(b"anon-write-blocked-stack", b"import-key-stack-ok"),
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Catalog-Import-Key": os.environ.get("CATALOG_IMPORT_KEY", "local-import"),
        },
    )
    with urllib.request.urlopen(keyed, timeout=10) as response:
        assert response.status in {200, 201}


def test_dev_start_stop_skip_gui_and_no_chaos() -> None:
    dev = (REPO / "scripts" / "dev").read_text()
    assert "cmd_start()" in dev
    assert "cmd_stop()" in dev
    assert "xdg-open" in dev
    assert "No display" in dev
    up_block = dev.split("cmd_up()")[1].split("ensure_catalog_db")[0]
    assert "compose.chaos.yml" not in up_block
    start_block = dev.split("cmd_start()")[1].split("cmd_stop()")[0]
    assert "cmd_up" in start_block
    assert "compose.chaos.yml" not in start_block
    help_out = subprocess.check_output([str(REPO / "scripts" / "dev"), "help"], text=True)
    assert "start" in help_out
    assert "stop" in help_out


def test_local_md_documents_app_cli() -> None:
    text = (REPO / "docs" / "ops" / "workflow" / "LOCAL.md").read_text()
    assert "./scripts/app start" in text
    assert "./scripts/app stop" in text
    assert "./scripts/app test" in text
    assert "WF-021" in text
    assert "Chaos stays" in text or "chaos" in text.lower()
    assert POSTGIS_IMAGE in text
    assert "WF-024" in text
    assert "linux/arm64" in text


def test_catalog_testcontainers_uses_compose_postgis_image() -> None:
    catalog = (
        REPO
        / "services"
        / "catalog"
        / "src"
        / "test"
        / "java"
        / "island"
        / "catalog"
        / "support"
        / "CatalogPostgis.java"
    ).read_text()
    assert POSTGIS_IMAGE in catalog
    assert "postgis/postgis:" not in catalog
