from pathlib import Path

REPO = Path(__file__).resolve().parents[2]


def test_chaos_job_is_merge_ci_and_not_inside_fast_jobs() -> None:
    ci = (REPO / ".github" / "workflows" / "ci.yml").read_text()
    assert "\n  chaos:" in ci
    assert "RetryFallbackTest" in ci
    unit = ci.split("\n  unit:")[1].split("\n  catalog:")[0]
    catalog = ci.split("\n  catalog:")[1].split("\n  web:")[0]
    assert "RetryFallbackTest" not in unit
    assert "RetryFallbackTest" not in catalog
    assert "compose.chaos.yml" not in unit
    assert "compose.chaos.yml" not in catalog
    automerge = ci.split("\n  automerge:")[1].split("\n  mock-prod-signal:")[0]
    assert "chaos" in automerge
    assert "cron:" not in ci.split("\n  chaos:")[1].split("\n  stack:")[0]
    jenkins = (REPO / "Jenkinsfile").read_text()
    assert "RetryFallbackTest" in jenkins
    assert "chaos" not in (REPO / "scripts" / "deploy-mock-prod.sh").read_text().lower()
