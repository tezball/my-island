from __future__ import annotations

import pytest

from gate_mock_prod_deploy import (
    GateError,
    not_green,
    pick_merged_pr_head,
    required_conclusions,
)


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


def test_pick_merged_pr_head_uses_latest_merged() -> None:
    payload = [
        {
            "merged_at": "2026-09-19T18:42:01Z",
            "head": {"sha": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"},
        },
        {
            "merged_at": "2026-09-19T18:57:04Z",
            "head": {"sha": "5579DE2175D442E786D2A13C6F9C694959B0E3CB"},
        },
        {"merged_at": None, "head": {"sha": "bbbb"}},
    ]
    assert pick_merged_pr_head(payload) == "5579de2175d442e786d2a13c6f9c694959b0e3cb"


def test_pick_merged_pr_head_empty() -> None:
    assert pick_merged_pr_head([]) is None
    assert pick_merged_pr_head({"pulls": []}) is None


def test_not_green_missing_is_not_failure() -> None:
    missing = not_green(
        {
            "unit tests": "missing",
            "catalog tests": "missing",
            "web tests": "missing",
            "compose stack": "missing",
        }
    )
    assert missing
    assert not any("=failure" in item for item in missing)


def test_squash_sha_missing_uses_green_pr_head() -> None:
    """GITHUB_TOKEN squash has no push checks; merged PR head was green."""
    squash = required_conclusions([])
    pr = required_conclusions(
        [
            _run("unit tests"),
            _run("catalog tests"),
            _run("web tests"),
            _run("compose stack"),
        ]
    )
    assert not_green(squash)
    assert not any("=failure" in item for item in not_green(squash))
    assert not_green(pr) == []
