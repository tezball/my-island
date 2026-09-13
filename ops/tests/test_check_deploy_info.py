from __future__ import annotations

import pytest

from check_deploy_info import VerifyError, parse_info, verify

SHA = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
INFO = {
    "app": {
        "service": "catalog",
        "version": "0.0.1-SNAPSHOT",
        "env": "mock-prod",
        "gitCommit": SHA,
        "gitCommitShort": "aaaaaaaaaaaa",
        "gitBranch": "main",
        "buildTime": "2026-09-13T12:00:00Z",
    }
}


def test_verify_accepts_matching_sha_and_version() -> None:
    landed = verify(INFO, expect_commit=SHA, expect_version="0.0.1-SNAPSHOT", expect_env="mock-prod")
    assert landed["gitCommit"] == SHA
    assert landed["version"] == "0.0.1-SNAPSHOT"


def test_verify_rejects_wrong_sha() -> None:
    with pytest.raises(VerifyError, match="did not land"):
        verify(INFO, expect_commit="bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb")


def test_verify_rejects_unknown_stamp() -> None:
    bad = {"app": {**INFO["app"], "gitCommit": "unknown"}}
    with pytest.raises(VerifyError, match="placeholder"):
        verify(bad, expect_commit=SHA)


def test_parse_info_rejects_spa_html() -> None:
    html = "<!doctype html><html><title>Explore</title></html>"
    with pytest.raises(VerifyError, match="HTML"):
        parse_info(html, "text/html; charset=utf-8")
