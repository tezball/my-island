from __future__ import annotations

import io
import json
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any
from uuid import uuid4

import pytest

import sim_place_listing as sim
from test_dev_env import _require_or_skip, catalog_base


class FakeCatalog:
    def __init__(self) -> None:
        self.places: dict[str, dict[str, Any]] = {}
        self.hide_from_list: set[str] = set()
        self.health_status = "UP"
        self.prometheus_ok = True


def _handler(state: FakeCatalog):
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, fmt: str, *args: Any) -> None:  # noqa: ARG002
            return

        def _send(self, code: int, body: str, content_type: str = "application/json") -> None:
            data = body.encode()
            self.send_response(code)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)

        def do_GET(self) -> None:  # noqa: N802
            path = self.path.split("?", 1)[0]
            if path == "/actuator/health":
                self._send(200, json.dumps({"status": state.health_status}))
                return
            if path == "/actuator/prometheus":
                if not state.prometheus_ok:
                    self._send(500, "nope", "text/plain")
                    return
                self._send(200, "jvm_memory_used_bytes 1\n", "text/plain")
                return
            if path == "/api/v1/places":
                listed = [
                    p for p in state.places.values() if str(p["id"]) not in state.hide_from_list
                ]
                self._send(200, json.dumps(listed))
                return
            prefix = "/api/v1/places/"
            if path.startswith(prefix):
                key = path[len(prefix) :]
                for place in state.places.values():
                    if str(place["id"]) == key or place["slug"] == key:
                        self._send(200, json.dumps(place))
                        return
                self._send(404, json.dumps({"error": "not found"}))
                return
            self._send(404, json.dumps({"error": "missing"}))

        def do_POST(self) -> None:  # noqa: N802
            length = int(self.headers.get("Content-Length", "0"))
            raw = self.rfile.read(length).decode() if length else "{}"
            payload = json.loads(raw)
            place_id = str(uuid4())
            place = {
                "id": place_id,
                "slug": payload.get("slug"),
                "name": payload.get("name"),
                "categoryId": payload.get("categoryId"),
                "countyId": payload.get("countyId"),
            }
            state.places[place_id] = place
            self._send(201, json.dumps(place))

    return Handler


@pytest.fixture
def fake_catalog():
    state = FakeCatalog()
    server = ThreadingHTTPServer(("127.0.0.1", 0), _handler(state))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    host, port = server.server_address[:2]
    base = f"http://{host}:{port}"
    try:
        yield state, base
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=2)


def test_happy_path_three_iterations(fake_catalog) -> None:
    state, base = fake_catalog
    buf = io.StringIO()
    code = sim.run(bases=[base], iterations=3, timeout=2.0, check_prom=True, out=buf)
    assert code == 0
    log = buf.getvalue()
    assert "ok: 3/3 create→list→get" in log
    assert "health: 200 UP" in log
    assert "prometheus: 200" in log
    assert len(state.places) == 3
    assert len({p["slug"] for p in state.places.values()}) == 3


def test_missing_id_in_list_fails(fake_catalog) -> None:
    state, base = fake_catalog
    payload = sim.payload_for(1)
    place_id, _slug, _ms = sim.create_place(base, payload, 2.0)
    state.hide_from_list.add(place_id)
    with pytest.raises(sim.SimError, match="list missing created id"):
        sim.list_contains(base, place_id, 2.0)


def test_unreachable_returns_2() -> None:
    assert sim.main(["--base", "http://127.0.0.1:1", "--iterations", "1"]) == 2


def test_prometheus_skip(fake_catalog) -> None:
    state, base = fake_catalog
    state.prometheus_ok = False
    buf = io.StringIO()
    code = sim.run(bases=[base], iterations=1, timeout=2.0, check_prom=False, out=buf)
    assert code == 0
    assert "prometheus: skipped" in buf.getvalue()


def test_prometheus_failure(fake_catalog) -> None:
    state, base = fake_catalog
    state.prometheus_ok = False
    buf = io.StringIO()
    with pytest.raises(sim.SimError, match="prometheus HTTP 500"):
        sim.run(bases=[base], iterations=1, timeout=2.0, check_prom=True, out=buf)


def test_cli_iterations_and_no_prometheus(fake_catalog, capsys) -> None:
    _state, base = fake_catalog
    code = sim.main(["--base", base, "--iterations", "2", "--no-prometheus"])
    assert code == 0
    out = capsys.readouterr().out
    assert "ok: 2/2" in out
    assert "prometheus: skipped" in out


def test_health_not_up_fails(fake_catalog) -> None:
    state, base = fake_catalog
    state.health_status = "DOWN"
    buf = io.StringIO()
    with pytest.raises(sim.SimError, match="health not UP"):
        sim.run(bases=[base], iterations=1, timeout=2.0, check_prom=False, out=buf)


def test_payload_uses_stub_field_names() -> None:
    payload = sim.payload_for(1)
    assert payload["categoryId"] == "poi"
    assert payload["countyId"] == "kerry"
    assert payload["latitude"] == 51.7708
    assert payload["longitude"] == -10.5406
    assert "categorySlug" not in payload
    assert "countySlug" not in payload
    assert payload["slug"].startswith("sim-1-")


def test_iterations_must_be_positive(fake_catalog) -> None:
    _state, base = fake_catalog
    with pytest.raises(sim.SimError, match="iterations"):
        sim.run(bases=[base], iterations=0, timeout=2.0, check_prom=False, out=io.StringIO())


@pytest.mark.stack
def test_live_compose_create_list_get() -> None:
    base = catalog_base()
    if not base:
        _require_or_skip("Catalog is not reachable")
        return
    buf = io.StringIO()
    code = sim.run(bases=[base], iterations=1, timeout=15.0, check_prom=True, out=buf)
    assert code == 0
    log = buf.getvalue()
    assert "create=201" in log
    assert "ok: 1/1" in log
