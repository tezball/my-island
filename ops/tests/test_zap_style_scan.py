from pathlib import Path

REPO = Path(__file__).resolve().parents[2]


def test_zap_job_scans_local_catalog_not_the_public_host() -> None:
    ci = (REPO / ".github" / "workflows" / "ci.yml").read_text()
    zap = ci.split("\n  zap:")[1].split("\n  chaos:")[0]
    assert "zap_style_scan.py" in zap
    assert "127.0.0.1:8081" in zap
    assert "fishing-journals.com" not in zap
    assert "cron:" not in zap
    unit = ci.split("\n  unit:")[1].split("\n  catalog:")[0]
    catalog = ci.split("\n  catalog:")[1].split("\n  web:")[0]
    assert "zap_style_scan.py" not in unit
    assert "zap_style_scan.py" not in catalog
    assert "playwright" not in unit.lower()
    automerge = ci.split("\n  automerge:")[1].split("\n  mock-prod-signal:")[0]
    assert "zap" in automerge
    jenkins = (REPO / "Jenkinsfile").read_text()
    assert "zap_style_scan.py" in jenkins
    script = (REPO / "ops" / "scripts" / "zap_style_scan.py").read_text()
    assert "fishing-journals.com" not in script
    assert "401" in script and "403" in script
