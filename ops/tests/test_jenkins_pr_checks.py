from __future__ import annotations

import os
from pathlib import Path

import pytest

import jenkins_github_status as status

REPO = Path(__file__).resolve().parents[2]


def test_status_contexts_match_gha_job_names() -> None:
    assert status.CONTEXTS == (
        "unit tests",
        "catalog tests",
        "web tests",
        "compose stack",
    )


def test_payload_rejects_unknown_context() -> None:
    with pytest.raises(status.StatusError):
        status.payload("not a job", "pending", "")


def test_payload_shape() -> None:
    body = status.payload("unit tests", "success", "Jenkins unit ok")
    assert body == {
        "state": "success",
        "context": "unit tests",
        "description": "Jenkins unit ok",
    }


def test_skip_token() -> None:
    assert status.skip_token("")
    assert status.skip_token("changeme")
    assert not status.skip_token("ghp_notreal")


def test_main_skips_without_token(capsys: pytest.CaptureFixture[str]) -> None:
    env = os.environ
    old = env.get("JENKINS_GITHUB_TOKEN")
    env.pop("JENKINS_GITHUB_TOKEN", None)
    env.pop("GITHUB_TOKEN", None)
    try:
        code = status.main(["--context", "web tests", "--state", "pending"])
    finally:
        if old is not None:
            env["JENKINS_GITHUB_TOKEN"] = old
    assert code == 0
    assert "skip status" in capsys.readouterr().out


def test_jenkinsfile_posts_four_contexts_and_isolates_stack() -> None:
    text = (REPO / "Jenkinsfile").read_text()
    for name in status.CONTEXTS:
        assert f'--context "{name}"' in text
        assert "--state pending" in text
        assert "--state success" in text
        assert "--state failure" in text
    assert "jenkins_ci_prepare" in text
    assert "jenkins_isolate_env" in text
    assert "COMPOSE_PROJECT_NAME" in (REPO / "ops" / "scripts" / "jenkins_ci.sh").read_text()
    helper = (REPO / "ops" / "scripts" / "jenkins_ci.sh").read_text()
    assert "my-island-ci" in helper
    assert "OPS_PG_HOST_PORT" in helper
    assert "15433" in helper
    assert "18081" in helper
    assert "host.docker.internal" in helper
    assert "my-island_ops_npm" in text
    assert "MAVEN_USER_HOME=/cache/m2" in text
    assert "docker compose down" in text


def test_compose_port_overrides_and_caches() -> None:
    compose = (REPO / "compose.yml").read_text()
    assert "${OPS_PG_HOST_PORT:-5433}:5432" in compose
    assert "${OPS_CATALOG_HOST_PORT:-8081}:8080" in compose
    assert "${OPS_GRAFANA_HOST_PORT:-3030}:3000" in compose
    assert "ops_m2:/cache/m2" in compose
    assert "ops_npm:/cache/npm" in compose
    assert "MAVEN_USER_HOME: /cache/m2" in compose


def test_gha_test_jobs_still_present() -> None:
    ci = (REPO / ".github" / "workflows" / "ci.yml").read_text()
    assert "name: unit tests" in ci
    assert "name: catalog tests" in ci
    assert "name: web tests" in ci
    assert "name: compose stack" in ci


def test_wf_051_ticket_and_docs() -> None:
    ticket = (REPO / "docs" / "ops" / "tickets" / "WF-051.md").read_text()
    plan = (REPO / "docs" / "ops" / "plans" / "WF-051.md").read_text()
    assert "status: implement" in ticket.split("---", 2)[1]
    assert "unit tests" in ticket
    assert "my-island-ci" in plan
    ci = (REPO / "docs" / "ops" / "workflow" / "CI.md").read_text()
    assert "WF-051" in ci
    runbook = (REPO / "docs" / "ops" / "runbooks" / "JENKINS_LOCAL.md").read_text()
    assert "WF-051" in runbook
