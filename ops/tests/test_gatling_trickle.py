from __future__ import annotations

from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
OPS = REPO / "ops"


def test_light_trickle_gatling_exists_and_is_not_merge_load() -> None:
    sim = (
        OPS
        / "gatling"
        / "src"
        / "test"
        / "java"
        / "island"
        / "gatling"
        / "GuestTrickleSimulation.java"
    ).read_text()
    assert "password-login" in sim
    assert "/api/v1/places" in sim
    assert "visit-intent" in sim
    assert "atOnceUsers(1)" in sim
    assert "google" not in sim.lower()
    pom = (OPS / "gatling" / "pom.xml").read_text()
    assert "gatling-maven-plugin" in pom
    assert "GuestTrickleSimulation" in pom
    script = (OPS / "scripts" / "gatling_trickle.sh").read_text()
    assert "set -euo pipefail" in script
    assert "gatling:test" in script
    assert "CATALOG_SEED_GUEST" in script
    assert "not weekly" in script.lower()
    dev = (REPO / "scripts" / "dev").read_text()
    assert "cmd_traffic()" in dev
    traffic = dev.split("cmd_traffic()")[1].split("cmd_wait()")[0]
    assert "gatling_trickle.sh" in traffic
    assert "compose.chaos.yml" not in traffic
    groovy = (OPS / "jenkins" / "casc" / "jobs" / "gatling-trickle.groovy").read_text()
    assert "cron('H/15 * * * *')" in groovy
    assert "scripts/dev traffic" in groovy
    assert "set -euo pipefail" in groovy
    assert "Not weekly" in groovy
    casc = (OPS / "jenkins" / "casc" / "jenkins.yaml").read_text()
    assert "gatling-trickle.groovy" in casc
    ci = (REPO / ".github" / "workflows" / "ci.yml").read_text()
    automerge = (REPO / ".github" / "workflows" / "automerge.yml").read_text()
    assert "needs: [unit, catalog, web, stack, chaos]" in ci
    assert "gatling" not in automerge.lower()
    assert "gatling:test" not in ci
    assert "gatling:test" not in automerge
    jobs = list((OPS / "jenkins" / "casc" / "jobs").glob("*.groovy"))
    assert not any("weekly" in p.name for p in jobs)
