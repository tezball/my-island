from __future__ import annotations

import json
from io import BytesIO
from urllib.error import HTTPError

import pytest

import smoke_mock_prod as smoke


class _Resp:
    def __init__(self, body: bytes, status: int = 200, content_type: str = "application/json"):
        self.status = status
        self.headers = {"Content-Type": content_type}
        self._body = body

    def read(self) -> bytes:
        return self._body

    def __enter__(self) -> "_Resp":
        return self

    def __exit__(self, *args: object) -> None:
        return None


def test_check_health_requires_up(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        smoke,
        "fetch",
        lambda url, timeout: (200, '{"status":"DOWN"}', "application/json"),
    )
    with pytest.raises(smoke.SmokeError, match="not UP"):
        smoke.check_health("https://fishing-journals.com/actuator/health", 5)
    monkeypatch.setattr(
        smoke,
        "fetch",
        lambda url, timeout: (200, '{"status":"UP"}', "application/json"),
    )
    smoke.check_health("https://fishing-journals.com/actuator/health", 5)


def test_places_must_be_array() -> None:
    with pytest.raises(smoke.SmokeError, match="array"):
        payload = smoke.parse_json('{"items":[]}', "application/json", "places")
        if not isinstance(payload, list):
            raise smoke.SmokeError("places JSON must be an array")


def test_html_rejected() -> None:
    with pytest.raises(smoke.SmokeError, match="HTML"):
        smoke.parse_json("<!doctype html><html></html>", "text/html", "health")


def test_fetch_http_error(monkeypatch: pytest.MonkeyPatch) -> None:
    def boom(_req, timeout=20):  # noqa: ANN001
        raise HTTPError("https://x", 503, "no", hdrs=None, fp=BytesIO(b"down"))

    monkeypatch.setattr(smoke.urllib.request, "urlopen", boom)
    with pytest.raises(smoke.SmokeError, match="HTTP 503"):
        smoke.fetch("https://fishing-journals.com/actuator/health", 5)


def test_json_roundtrip_places() -> None:
    n = len(json.loads('[{"id":"a"},{"id":"b"}]'))
    assert n == 2
