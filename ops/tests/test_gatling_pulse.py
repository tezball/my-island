from __future__ import annotations

from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
OPS = REPO / "ops"

CHAINS = (
    "health",
    "listPublishedPlaces",
    "getPlace",
    "listCounties",
    "listCategories",
    "passwordLogin",
    "me",
    "saveVisitIntent",
    "getVisitIntent",
    "listVisitIntents",
    "logout",
)


def test_hundred_user_pulse_is_on_demand_and_holds_ten_minutes() -> None:
    sim = (
        OPS
        / "gatling"
        / "src"
        / "test"
        / "java"
        / "island"
        / "gatling"
        / "GuestPulseSimulation.java"
    ).read_text()
    assert "HOLD_MINUTES = 10" in sim
    assert "Duration.ofMinutes(HOLD_MINUTES)" in sim
    assert "during(" in sim
    assert "atOnceUsers(PulseUsers.POOL)" in sim
    assert "GuestFeatureChains.walkOnce()" in sim
    assert 'gte(99.0)' in sim
    assert "http://127.0.0.1:8081" in sim
    assert "https://fishing-journals.com" not in sim

    chains = (
        OPS
        / "gatling"
        / "src"
        / "test"
        / "java"
        / "island"
        / "gatling"
        / "GuestFeatureChains.java"
    ).read_text()
    for chain in CHAINS:
        assert f"ChainBuilder {chain}()" in chains
        assert f"exec({chain}())" in chains
    assert "pause(THINK_SECONDS)" in chains
    assert "/actuator/health" in chains
    assert "/api/v1/places?published=true" in chains
    assert "/api/v1/places/#{placeId}" in chains
    assert "/api/v1/counties" in chains
    assert "/api/v1/categories" in chains
    assert "/api/auth/login" in chains
    assert "/api/v1/me" in chains
    assert "/visit-intent" in chains
    assert "/api/v1/me/visit-intents" in chains
    assert "/api/auth/logout" in chains

    users = (
        OPS / "gatling" / "src" / "test" / "java" / "island" / "gatling" / "PulseUsers.java"
    ).read_text()
    assert "POOL = 100" in users
    assert "TRICKLE = 10" in users
    assert 'PASSWORD = "guest"' in users
    assert "pulse-%03d" in users

    script = (OPS / "scripts" / "gatling_pulse.sh").read_text()
    assert "set -euo pipefail" in script
    assert "GuestPulseSimulation" in script
    assert "-Dgatling.simulationClass=island.gatling.GuestPulseSimulation" in script
    assert "GATLING_BASE_URL:-http://127.0.0.1:8081" in script
    assert "MOCK_PROD_PUBLIC_ORIGIN" not in script

    pom = (OPS / "gatling" / "pom.xml").read_text()
    assert (
        "<gatling.simulationClass>island.gatling.GuestTrickleSimulation</gatling.simulationClass>"
        in pom
    )
    assert "<simulationClass>${gatling.simulationClass}</simulationClass>" in pom
    assert "<simulationClass>island.gatling." not in pom

    dev = (REPO / "scripts" / "dev").read_text()
    assert "cmd_pulse()" in dev
    pulse = dev.split("cmd_pulse()")[1].split("cmd_wait()")[0]
    assert "gatling_pulse.sh" in pulse
    assert "gatling_trickle.sh" not in pulse

    job = (OPS / "jenkins" / "casc" / "jobs" / "gatling-pulse.groovy").read_text()
    assert "pipelineJob('gatling-pulse')" in job
    assert "https://fishing-journals.com" in job
    assert "gatling_pulse.sh" in job
    assert "archiveArtifacts" in job
    assert "gatling-report/**/*" in job
    assert "cron(" not in job
    assert "triggers" not in job
    assert "upstreamProjects" not in job
    assert "build job:" not in job.lower()

    casc = (OPS / "jenkins" / "casc" / "jenkins.yaml").read_text()
    assert "gatling-pulse.groovy" in casc

    deploy_job = (OPS / "jenkins" / "casc" / "jobs" / "deploy-mock-prod.groovy").read_text()
    assert "gatling-pulse" not in deploy_job
    assert "gatling_pulse" not in deploy_job
    deploy_sh = (REPO / "scripts" / "deploy-mock-prod.sh").read_text()
    assert "gatling_pulse" not in deploy_sh
    assert "GuestPulseSimulation" not in deploy_sh

    trickle_job = (OPS / "jenkins" / "casc" / "jobs" / "gatling-trickle.groovy").read_text()
    assert "cron('H/15 * * * *')" in trickle_job
    assert "scripts/dev traffic" in trickle_job
    assert "gatling_pulse" not in trickle_job

    ci = (REPO / ".github" / "workflows" / "ci.yml").read_text()
    automerge = (REPO / ".github" / "workflows" / "automerge.yml").read_text()
    assert "gatling:test" not in ci
    assert "gatling_pulse" not in ci
    assert "gatling:test" not in automerge
    assert "needs: [unit, catalog, web, stack, chaos, zap]" in ci

    seed = (
        REPO
        / "services"
        / "catalog"
        / "src"
        / "main"
        / "resources"
        / "db"
        / "migration"
        / "V11__gatling_pulse_seed.sql"
    ).read_text()
    assert "generate_series(1, 100)" in seed
    assert "pulse-" in seed
    assert "visit_intent" in seed
    assert "FROM place" in seed
    assert "INSERT INTO place" not in seed.upper()
    assert "DO NOTHING" in seed
    assert "volume" not in seed.lower() or "does not wipe" in seed.lower()

    note = (REPO / "docs" / "ops" / "workflow" / "GATLING.md").read_text()
    assert "named chain" in note
    assert "GuestFeatureChains" in note
    assert "gatling-pulse" in note
    assert "ten minutes" in note.lower() or "10 minutes" in note
    dod = (REPO / "docs" / "ops" / "workflow" / "DOD.md").read_text()
    assert "GuestFeatureChains" in dod
