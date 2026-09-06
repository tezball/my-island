from __future__ import annotations

import json
from pathlib import Path

import board_sync
import next_ticket

OPS = Path(__file__).resolve().parents[1]
REPO = OPS.parent

REQUIRED_VAULT = [
    "HOME.md",
    "BOARD.md",
    "CHARTER.md",
    "NAMING.md",
    "PLUGINS.md",
    "company/_index.md",
    "company/BRAND.md",
    "company/PRINCIPLES.md",
    "company/PEOPLE.md",
    "company/PRODUCT.md",
    "company/SCAFFOLDING.md",
    "company/DECISIONS.md",
    "agents/_index.md",
    "agents/GROK_VS_CURSOR.md",
    "agents/roles/orchestrator.md",
    "agents/roles/product.md",
    "agents/roles/automation-expert.md",
    "agents/roles/eng-frontend.md",
    "agents/roles/eng-backend.md",
    "agents/roles/eng-infra.md",
    "agents/roles/guest-support.md",
    "agents/roles/host-onboarding.md",
    "agents/roles/content-seo.md",
    "agents/roles/trust-safety.md",
    "agents/roles/ops-incidents.md",
    "runbooks/_index.md",
    "runbooks/ADD_SKILL.md",
    "runbooks/TICKET_LOOP.md",
    "runbooks/GUEST_SUPPORT.md",
    "runbooks/LISTING_ROLLOUT.md",
    "runbooks/PLACE_LISTING_SIM.md",
    "runbooks/WEEKLY_DIGEST.md",
    "data/_index.md",
    "data/listing-types.md",
    "data/regions.md",
    "daily/_index.md",
    "templates/epic.md",
    "templates/story.md",
    "templates/bug.md",
    "templates/incident.md",
    "templates/daily.md",
    ".obsidian/community-plugins.json",
    ".obsidian/daily-notes.json",
    "workflow/CI.md",
    "workflow/SKILLS.md",
    "tickets/E2E-001.md",
    "workshops/e2e-place-stub.md",
    "workflow/e2e-place-stub.canvas",
]

REQUIRED_TICKET_KEYS = ("id", "title", "status", "priority", "type")
VALID_STATUS = {
    "inbox",
    "ready",
    "plan",
    "implement",
    "review",
    "done",
    "blocked",
}
VALID_TYPE = {"epic", "story", "bug", "incident", "workflow"}


def test_required_vault_files_exist() -> None:
    missing = [rel for rel in REQUIRED_VAULT if not (OPS / rel).is_file()]
    assert missing == []


def test_repo_readme_points_at_obsidian_ops() -> None:
    text = (REPO / "README.md").read_text()
    assert "Open the company vault" in text
    assert "ops/" in text
    assert "Obsidian" in text
    assert "disposable scaffolding" in text.lower()


def test_automation_skill_exists() -> None:
    skill = REPO / ".cursor/skills/automation/SKILL.md"
    assert skill.is_file()
    body = skill.read_text()
    assert "automation-expert" in body
    assert (OPS / "agents/roles/automation-expert.md").is_file()


def test_tickets_have_required_frontmatter() -> None:
    for path, meta in next_ticket.tickets(OPS / "tickets"):
        missing = [k for k in REQUIRED_TICKET_KEYS if not meta.get(k)]
        assert missing == [], f"{path.name} missing {missing}"
        assert path.stem == meta["id"], f"{path.name} stem != id {meta['id']}"
        assert meta["status"] in VALID_STATUS, path.name
        assert meta["type"] in VALID_TYPE, path.name


def test_prd_app_code_tickets_are_not_implement() -> None:
    """Spring/PWA/import/marketplace stay gated except an approved implement ticket."""
    app_code = {"PRD-001", "PRD-002", "PRD-003", "PRD-004"}
    hot = [
        meta["id"]
        for _, meta in next_ticket.tickets(OPS / "tickets")
        if meta["id"] in app_code and meta.get("status") == "implement"
    ]
    assert hot == []


def test_starter_prd_tickets_exist() -> None:
    ids = {meta["id"] for _, meta in next_ticket.tickets(OPS / "tickets")}
    for ident in ("PRD-000", "PRD-001", "PRD-002", "PRD-003", "PRD-004", "PRD-006"):
        assert ident in ids
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    assert by_id["PRD-000"]["type"] == "epic"
    assert by_id["PRD-004"]["type"] == "epic"
    assert by_id["PRD-001"]["type"] == "story"


def test_obsidian_lists_kanban_and_dataview() -> None:
    import json

    plugins = json.loads((OPS / ".obsidian/community-plugins.json").read_text())
    assert "obsidian-kanban" in plugins
    assert "dataview" in plugins
    core = json.loads((OPS / ".obsidian/core-plugins.json").read_text())
    assert core.get("daily-notes") is True
    assert core.get("templates") is True


def test_signed_stack_is_spring_and_light_pwa() -> None:
    text = (REPO / "product/STACK.md").read_text()
    assert "CEO lock (2026-09-05)" in text
    assert "Java + Spring Boot" in text
    assert "Vite + React" in text
    assert "Not** Next.js" in text or "**Not** Next.js" in text
    assert "PostgreSQL 17 + PostGIS" in text
    assert "Flyway" in text
    assert "mcp-grafana" in text
    assert (OPS / "company/DECISIONS.md").is_file()
    assert "2026-09-05" in (OPS / "company/DECISIONS.md").read_text()


def test_agent_roles_do_not_prefer_next_or_fastapi() -> None:
    frontend = (OPS / "agents/roles/eng-frontend.md").read_text()
    backend = (OPS / "agents/roles/eng-backend.md").read_text()
    assert "Vite + React" in frontend
    assert "not** Next.js" in frontend or "**not** Next.js" in frontend or "not Next.js" in frontend
    assert "Spring Boot" in backend
    assert "FastAPI" in backend
    assert "Not FastAPI" in backend or "not a TypeScript API" in backend


def test_prd_001_is_done_with_plan() -> None:
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    assert by_id["PRD-001"]["status"] == "done"
    assert "plans/PRD-001" in by_id["PRD-001"].get("plan", "")
    assert "github.com/tezball/my-island/pull/21" in by_id["PRD-001"].get("pr", "")
    plan = (OPS / "plans/PRD-001.md").read_text()
    assert plan.startswith("---")
    assert "status: approved" in plan
    assert "No consumer" in plan or "no consumer" in plan
    assert "partner_id" in plan
    assert "Visit schema stub" in plan or "Visit Flyway" in plan
    assert "VISITED" in plan and "STAYED" in plan
    assert "datePrecision" in plan or "date_precision" in plan
    assert "including NI" in plan
    assert "No booking columns" in plan or "no booking columns" in plan
    assert by_id["PRD-003"]["status"] != "implement"
    assert by_id["WF-008"]["status"] == "done"
    assert by_id["PRD-005"]["status"] == "done"
    assert "github.com/tezball/my-island/pull/29" in by_id["PRD-005"].get("pr", "")


def test_merged_pr_tickets_are_done() -> None:
    """Merged PRs must not stay in review. Keep the existing pr: URLs."""
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    expected = {
        "WF-020": "https://github.com/tezball/my-island/pull/33",
        "WF-005": "https://github.com/tezball/my-island/pull/6",
        "WF-006": "https://github.com/tezball/my-island/pull/8",
        "WF-007": "https://github.com/tezball/my-island/pull/11",
        "PRD-006": "https://github.com/tezball/my-island/pull/14",
    }
    for ident, pr in expected.items():
        assert by_id[ident]["status"] == "done", ident
        assert by_id[ident].get("pr", "") == pr, ident


def test_leads_pipeline_tickets_exist() -> None:
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    for ident in ("PRD-007", "PRD-008", "PRD-009"):
        assert ident in by_id, ident
        assert by_id[ident]["type"] == "story"
        assert by_id[ident]["status"] == "ready"
        assert by_id[ident]["status"] != "implement"
    assert by_id["PRD-007"]["owner"] == "product"
    assert by_id["PRD-008"]["owner"] == "eng-backend"
    assert by_id["PRD-009"]["owner"] == "product"
    reason = by_id["PRD-008"].get("blocked_reason", "").lower()
    assert "prd-001" in reason
    assert "prd-006" in reason or "schema.json" in reason


def test_leads_pipeline_tickets_cite_landed_schema() -> None:
    schema = json.loads((REPO / "data" / "leads" / "schema.json").read_text())
    required = schema["required"]
    prd007 = (OPS / "tickets" / "PRD-007.md").read_text()
    prd008 = (OPS / "tickets" / "PRD-008.md").read_text()
    prd009 = (OPS / "tickets" / "PRD-009.md").read_text()
    for text, ident in ((prd007, "PRD-007"), (prd008, "PRD-008"), (prd009, "PRD-009")):
        assert "data/leads/schema.json" in text, ident
        assert "PR #14" in text, ident
    for key in required:
        assert f"`{key}`" in prd007, key
    for key in ("source_url", "source_name", "licence"):
        assert f"`{key}`" in prd008, key
    assert "`source`" not in prd008
    for status in ("lead", "reviewed", "rejected", "promoted"):
        assert f"`{status}`" in prd008
    assert "`licence`" in prd009
    assert "country: NI" in prd008
    assert "32 county" in prd008.lower().replace("-", " ")
    assert "country table" in prd008.lower() or "country enum" in prd008.lower()
    assert "32-county" in prd007


def test_e2e_001_place_stub_workshop() -> None:
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    assert "E2E-001" in by_id
    meta = by_id["E2E-001"]
    assert meta["status"] == "ready"
    assert meta["priority"] == "P0"
    assert meta["type"] == "story"
    assert meta["owner"] == "eng-backend"
    assert meta.get("area") == "catalog"
    assert "tickets/PRD-001" in meta.get("parent", "")
    ticket = (OPS / "tickets" / "E2E-001.md").read_text()
    assert "POST /api/v1/places" in ticket
    assert "GET /api/v1/places" in ticket
    assert "GET /api/v1/places/{id}" in ticket
    assert "workshop exception" in ticket.lower()
    assert "tezball/my-island" in ticket
    assert "Public brand naming is OPEN" in ticket
    board = (OPS / "BOARD.md").read_text()
    assert "[[tickets/E2E-001|E2E-001]] P0" in board
    index = (OPS / "tickets" / "_index.md").read_text()
    assert "E2E-" in index
    brief = (OPS / "workshops" / "e2e-place-stub.md").read_text()
    assert "[[tickets/E2E-001]]" in brief
    assert "workflow/e2e-place-stub" in brief
    canvas_path = OPS / "workflow" / "e2e-place-stub.canvas"
    assert canvas_path.is_file()
    found = {p.resolve() for p in REPO.rglob("e2e-place-stub.canvas")}
    assert found == {canvas_path.resolve()}, found
    assert not (REPO / "docs" / "e2e-place-stub.canvas").exists()
    assert not (REPO / "docs" / "ops" / "workflow" / "e2e-place-stub.canvas").exists()
    assert list(OPS.glob("*.canvas")) == []
    for path in (OPS / "workflow").glob("*.canvas"):
        assert path.name == path.name.lower()
        assert not any(part.isdigit() and len(part) == 4 for part in path.stem.split("-"))
    canvas = json.loads(canvas_path.read_text())
    assert "nodes" in canvas and "edges" in canvas
    assert 15 <= len(canvas["nodes"]) <= 40
    assert canvas["edges"]
    files = {n.get("file") for n in canvas["nodes"] if n.get("type") == "file"}
    assert "tickets/E2E-001.md" in files
    assert "workshops/e2e-place-stub.md" in files
    blob = json.dumps(canvas)
    assert "create" in blob.lower()
    assert "STACK" in blob or "stack" in blob.lower()


def test_inherited_app_trees_stripped_for_workshop_spine() -> None:
    """Architecture KEEP/DROP: workshop spine only. Tag legacy-platform is archaeology."""
    assert (REPO / "services" / "catalog" / "pom.xml").is_file()
    assert (REPO / "compose.yml").is_file()
    assert (REPO / "compose.chaos.yml").is_file()
    assert (REPO / "ops" / "observability" / "prometheus.yml").is_file()
    assert (REPO / "docs" / "automation" / "OBSERVABILITY_MCP_OPTIONS.md").is_file()
    for rel in (
        "docs/domain",
        "docs/Designs",
        "docs/MVP.md",
        "docs/USER_STORIES.md",
        "docs/ROADMAP.md",
        "docs/automation/JENKINS.md",
    ):
        assert not (REPO / rel).exists(), rel


def test_stack_e2e_place_stub_architecture_handoff() -> None:
    path = OPS / "workflow" / "STACK-E2E-place-stub.md"
    assert path.is_file()
    text = path.read_text()
    assert "[[tickets/E2E-001]]" in text
    assert "POST /api/v1/places" in text
    assert "GET /api/v1/places" in text
    assert "/actuator/health" in text
    assert "/actuator/prometheus" in text
    assert "./scripts/dev up" in text
    assert "--profile chaos" in text
    assert "de.codecentric:chaos-monkey-spring-boot" in text
    assert "Toxiproxy" in text and "Gremlin" in text and "Chaos Mesh" in text
    assert "mcp-grafana" in text
    assert "product/STACK.md" in text
    assert "ops/workflow/e2e-place-stub.canvas" in text
    assert "compose.chaos.yml" in text
    assert "./scripts/sim-place-listing.sh" in text
    assert "PLACE_LISTING_SIM" in text
    index = (OPS / "workflow" / "_index.md").read_text()
    assert "STACK-E2E-place-stub" in index
    brief = (OPS / "workshops" / "e2e-place-stub.md").read_text()
    assert "STACK-E2E-place-stub" in brief


def test_e2e_place_stub_mcp_chaos_followups() -> None:
    """Workshop pass files gaps; E2E-001 stays ready (not done)."""
    run = OPS / "runs" / "e2e-place-stub-mcp-chaos-2026-09-06.md"
    assert run.is_file()
    text = run.read_text()
    assert "POST http://127.0.0.1:8081/api/v1/places" in text
    assert "**201**" in text
    assert "/actuator/health" in text
    assert "/actuator/prometheus" in text
    assert "SPRING_PROFILES_ACTIVE" in text
    assert "compose.chaos.yml" in text
    assert "mcp-grafana" in text
    assert "[[tickets/WF-016]]" in text
    assert "[[tickets/WF-017]]" in text
    assert "[[tickets/WF-018]]" in text
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    assert by_id["E2E-001"]["status"] == "ready"
    assert by_id["WF-015"]["status"] == "done"
    assert "spine strip" in by_id["WF-015"]["title"].lower()
    for ident in ("WF-016", "WF-017", "WF-018"):
        assert ident in by_id, ident
        assert by_id[ident]["status"] == "ready"
        assert by_id[ident]["owner"] == "automation-expert"
        assert by_id[ident]["type"] == "workflow"
        assert "tickets/E2E-001" in by_id[ident].get("parent", "")
        body = (OPS / "tickets" / f"{ident}.md").read_text()
        assert "[[tickets/E2E-001]]" in body
        assert "[[workflow/STACK-E2E-place-stub]]" in body
    ci = (REPO / ".github" / "workflows" / "ci.yml").read_text()
    assert "compose.chaos.yml" not in ci
    assert "SPRING_PROFILES_ACTIVE: chaos" not in ci


def test_wf_019_place_listing_sim() -> None:
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    assert by_id["WF-016"]["owner"] == "automation-expert"
    assert "mcp-grafana" in by_id["WF-016"]["title"].lower() or "postgres" in by_id["WF-016"]["title"].lower()
    assert "WF-019" in by_id
    meta = by_id["WF-019"]
    assert meta["type"] == "workflow"
    assert meta["owner"] == "eng-backend"
    assert meta["priority"] == "P0"
    assert "tickets/E2E-001" in meta.get("parent", "")
    ticket = (OPS / "tickets" / "WF-019.md").read_text()
    plan = (OPS / "plans" / "WF-019.md").read_text()
    board = (OPS / "BOARD.md").read_text()
    for rel, text in (
        ("tickets/WF-019.md", ticket),
        ("plans/WF-019.md", plan),
        ("BOARD.md", board),
    ):
        assert "docs/ops" not in text, rel
    assert (OPS / "tickets" / "WF-019.md").is_file()
    assert not (REPO / "docs" / "ops" / "tickets" / "WF-019.md").exists()
    assert "./scripts/sim-place-listing.sh" in ticket
    assert "categoryId" in ticket
    assert "countyId" in ticket
    assert "latitude" in ticket
    assert "longitude" in ticket
    assert "compose.chaos.yml" in ticket
    for reserved in ("WF-015", "WF-016", "WF-017", "WF-018"):
        assert f"[[tickets/{reserved}]]" in ticket
    runbook = (OPS / "runbooks" / "PLACE_LISTING_SIM.md").read_text()
    assert "./scripts/sim-place-listing.sh" in runbook
    assert "POST /api/v1/places" in runbook
    assert "GET /api/v1/places/{id}" in runbook
    assert "/actuator/health" in runbook
    assert "/actuator/prometheus" in runbook
    assert "--iterations" in runbook
    wrapper = (REPO / "scripts" / "sim-place-listing.sh").read_text()
    assert "sim_place_listing.py" in wrapper
    assert "compose.chaos.yml" not in wrapper
    sim = (OPS / "scripts" / "sim_place_listing.py").read_text()
    assert "compose.chaos.yml" not in sim
    assert "SPRING_PROFILES_ACTIVE" not in sim
    assert '"categoryId"' in sim
    assert '"countyId"' in sim
    assert '"latitude"' in sim
    assert '"longitude"' in sim
    assert "categorySlug" not in sim
    assert "countySlug" not in sim
    index = (OPS / "runbooks" / "_index.md").read_text()
    assert "PLACE_LISTING_SIM" in index
    local = (OPS / "workflow" / "LOCAL.md").read_text()
    assert "sim-place-listing.sh" in local
    assert (OPS / "plans" / "WF-019.md").is_file()
    assert not (OPS / "plans" / "WF-016.md").exists()


def test_wf_021_human_cli_ticket() -> None:
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    assert "WF-021" in by_id
    meta = by_id["WF-021"]
    assert meta["owner"] == "automation-expert"
    assert meta["type"] == "workflow"
    assert meta["priority"] == "P1"
    assert "tickets/WF-005" in meta.get("parent", "")
    body = (OPS / "tickets" / "WF-021.md").read_text()
    assert "./scripts/app start" in body
    assert "./scripts/app stop" in body
    assert "./scripts/app test" in body
    assert "WF-019" in body
    local = (OPS / "workflow" / "LOCAL.md").read_text()
    assert "./scripts/app start" in local
    plan = (OPS / "plans" / "WF-021.md").read_text()
    assert "status: approved" in plan
    assert "./scripts/app" in plan
