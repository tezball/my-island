from __future__ import annotations

import pytest

from gate_mock_prod_deploy import GateError, required_conclusions


def _run(name: str, *, status: str = "completed", conclusion: str = "success") -> dict:
    return {"name": name, "status": status, "conclusion": conclusion}


def test_required_conclusions_all_success() -> None:
    runs = [
        _run("unit tests"),
        _run("catalog tests"),
        _run("web tests"),
        _run("compose stack"),
    ]
    assert set(required_conclusions(runs).values()) == {"success"}


def test_required_conclusions_short_gha_names() -> None:
    runs = [_run("unit"), _run("catalog"), _run("web"), _run("stack")]
    assert required_conclusions(runs)["compose stack"] == "success"


def test_required_conclusions_pending_and_missing() -> None:
    runs = [
        _run("unit tests"),
        _run("catalog tests", status="in_progress", conclusion=""),
        _run("web tests", conclusion="failure"),
    ]
    states = required_conclusions(runs)
    assert states["unit tests"] == "success"
    assert states["catalog tests"] == "pending"
    assert states["web tests"] == "failure"
    assert states["compose stack"] == "missing"


def test_required_conclusions_success_wins_over_rerun_failure() -> None:
    runs = [
        _run("unit tests", conclusion="failure"),
        _run("unit tests", conclusion="success"),
        _run("catalog tests"),
        _run("web tests"),
        _run("compose stack"),
    ]
    assert required_conclusions(runs)["unit tests"] == "success"


def test_gate_error_type() -> None:
    with pytest.raises(GateError):
        raise GateError("HOST_REPO is on 'wf/x' — deploy only from main")
