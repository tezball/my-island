"""mock-prod signal starts deploy-mock-prod; the H/5 poll is gone."""
from __future__ import annotations

import io
import json
import urllib.error
from pathlib import Path

import pytest

from trigger_deploy_mock_prod import (
    JOB_NAME,
    TriggerError,
    build_request,
    invoke_url,
    job_triggered,
    post_trigger,
    redact,
)

REPO = Path(__file__).resolve().parents[2]


def test_invoke_url_joins_the_generic_webhook_path() -> None:
    assert (
        invoke_url("http://127.0.0.1:8085/")
        == "http://127.0.0.1:8085/generic-webhook-trigger/invoke"
    )
    assert (
        invoke_url("https://jenkins.example/")
        == "https://jenkins.example/generic-webhook-trigger/invoke"
    )


def test_invoke_url_rejects_credentials_and_queries() -> None:
    with pytest.raises(TriggerError, match="credentials"):
        invoke_url("http://admin:secret@127.0.0.1:8085/")
    with pytest.raises(TriggerError, match="query"):
        invoke_url("http://127.0.0.1:8085/?token=nope")


def test_build_request_keeps_the_token_out_of_the_url_and_body() -> None:
    request = build_request("http://127.0.0.1:8085/", "s3cret-value", "abc123")
    assert "s3cret-value" not in request.url
    assert "token=" not in request.url
    assert request.headers["Authorization"] == "Bearer s3cret-value"
    body = json.loads(request.body)
    assert body == {
        "ref": "refs/heads/main",
        "conclusion": "success",
        "workflow": "CI",
        "sha": "abc123",
    }
    assert "s3cret-value" not in request.body.decode()


def test_redact_and_triggered_flag() -> None:
    assert redact("HTTP 403 s3cret-value", "s3cret-value") == "HTTP 403 [redacted]"
    payload = {"jobs": {JOB_NAME: {"triggered": True}}, "message": "Triggered jobs."}
    assert job_triggered(payload)
    assert not job_triggered({"jobs": {JOB_NAME: {"triggered": False}}})
    assert not job_triggered({"message": "Did not find any jobs"})


def test_http_error_does_not_keep_the_password() -> None:
    request = build_request("http://127.0.0.1:8085/", "s3cret-value", "abc")

    def opener(req, timeout):  # noqa: ARG001
        raise urllib.error.HTTPError(
            req.full_url,
            403,
            "forbidden",
            hdrs=None,
            fp=io.BytesIO(b"rejected s3cret-value"),
        )

    with pytest.raises(TriggerError) as caught:
        post_trigger(request, opener, timeout=1, secret="s3cret-value")
    assert "s3cret-value" not in str(caught.value)
    assert "[redacted]" in str(caught.value)


def test_empty_env_names_fail_closed() -> None:
    with pytest.raises(TriggerError, match="JENKINS_URL"):
        build_request("", "secret", "abc")
    with pytest.raises(TriggerError, match="JENKINS_ADMIN_PASSWORD"):
        build_request("http://127.0.0.1:8085/", "", "abc")


def test_deploy_job_trigger_is_job_dsl_not_a_cron() -> None:
    groovy = (REPO / "ops" / "jenkins" / "casc" / "jobs" / "deploy-mock-prod.groovy").read_text()
    dsl, script = groovy.split("script(", 1)
    assert "triggers {" in dsl
    assert "genericTrigger {" in dsl
    assert "tokenCredentialId('deploy-mock-prod-trigger')" in dsl
    assert "regexpFilterExpression('^success refs/heads/main$')" in dsl
    assert "printPostContent(false)" in dsl
    assert "cron(" not in groovy
    assert "H/5" not in groovy
    assert "http://" not in dsl
    assert "https://" not in dsl
    assert "cron(" not in script
    casc = (REPO / "ops" / "jenkins" / "casc" / "jenkins.yaml").read_text()
    assert 'id: "deploy-mock-prod-trigger"' in casc
    assert "JENKINS_ADMIN_PASSWORD" in casc
    plugins = (REPO / "ops" / "jenkins" / "plugins.txt").read_text()
    assert "generic-webhook-trigger" in plugins


def test_mock_prod_signal_starts_the_one_job_after_main_is_green() -> None:
    ci = (REPO / ".github" / "workflows" / "ci.yml").read_text()
    signal = ci.split("\n  mock-prod-signal:")[1]
    assert "needs: [unit, catalog, web, stack, chaos, zap]" in signal
    assert "github.ref == 'refs/heads/main'" in signal
    assert "trigger_deploy_mock_prod.py" in signal
    assert "secrets.JENKINS_URL" in signal
    assert "secrets.JENKINS_ADMIN_PASSWORD" in signal
    assert "cron" not in signal
    assert "H/5" not in signal
    assert signal.count("deploy-mock-prod") >= 1
    # One deployer. The signal starts that job; it does not rsync.
    assert "deploy-mock-prod.sh" not in signal
