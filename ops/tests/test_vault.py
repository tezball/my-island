from __future__ import annotations

import json
from pathlib import Path

import board_sync
import next_ticket

RUNTIME = Path(__file__).resolve().parents[1]
REPO = RUNTIME.parent
OPS = REPO / "docs" / "ops"
DOCS = REPO / "docs"
PRODUCT = DOCS / "product"

REQUIRED_VAULT = [
    "HOME.md",
    "BOARD.md",
    "MILESTONES.md",
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
    "runbooks/STACK_E2E_PLACE_STUB.md",
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
    for rel in (
        ".obsidian/community-plugins.json",
        ".obsidian/daily-notes.json",
        ".obsidian/core-plugins.json",
    ):
        assert (DOCS / rel).is_file(), rel


def test_living_markdown_is_under_docs() -> None:
    root_md = sorted(path.name for path in REPO.glob("*.md"))
    assert root_md == ["README.md"], root_md
    assert not (REPO / "HOME.md").exists()
    assert not (REPO / "AGENTS.md").exists()
    assert not (REPO / "product" / "STACK.md").exists()
    assert not (REPO / "ops" / "HOME.md").exists()
    assert (DOCS / "HOME.md").is_file()
    assert (DOCS / "AGENTS.md").is_file()
    assert (PRODUCT / "STACK.md").is_file()
    assert (OPS / "tickets" / "WF-023.md").is_file()
    assert (RUNTIME / "tests" / "requirements.txt").is_file()
    assert (RUNTIME / "scripts" / "board_sync.py").is_file()


def test_repo_readme_points_at_obsidian_ops() -> None:
    text = (REPO / "README.md").read_text()
    assert "Open the company vault" in text
    assert "ops/" in text
    assert "Obsidian" in text
    assert "disposable scaffolding" in text.lower()
    assert "[`docs/HOME.md`](docs/HOME.md)" in text
    assert "docs/" in text


def test_repo_root_company_dashboard() -> None:
    home = REPO / "docs" / "HOME.md"
    assert home.is_file()
    text = home.read_text()
    assert "title: Company home" in text
    assert "type: dashboard" in text
    assert "owner: Product" in text
    assert "ops/HOME.md" in text
    assert "product/SIGNED.md" in text
    assert "product/MILESTONES.md" in text
    assert "[[ops/BOARD]]" in text
    assert "[[product/SIGNED]]" in text
    assert 'FROM "ops/tickets"' in text
    assert "categoryId" in text
    assert "countyId" in text
    assert "latitude" in text
    assert "longitude" in text
    assert "the Obsidian vault is **`docs/`**" in text
    assert "Obsidian vault is the **repo root**" not in text
    ops_home = (OPS / "HOME.md").read_text()
    assert "[`../HOME.md`](../HOME.md)" in ops_home
    plugins = (OPS / "PLUGINS.md").read_text()
    assert 'FROM "ops/tickets"' in plugins
    assert "docs/" in plugins.lower()
    agents = (DOCS / "AGENTS.md").read_text()
    assert "docs/HOME.md" in agents
    assert "docs/" in agents


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

    plugins = json.loads((DOCS / ".obsidian/community-plugins.json").read_text())
    assert "obsidian-kanban" in plugins
    assert "dataview" in plugins
    core = json.loads((DOCS / ".obsidian/core-plugins.json").read_text())
    assert core.get("daily-notes") is True
    assert core.get("templates") is True


def test_signed_stack_is_spring_and_light_pwa() -> None:
    text = (PRODUCT / "STACK.md").read_text()
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
        "WF-019": "https://github.com/tezball/my-island/pull/31",
        "WF-021": "https://github.com/tezball/my-island/pull/35",
        "WF-005": "https://github.com/tezball/my-island/pull/6",
        "WF-006": "https://github.com/tezball/my-island/pull/8",
        "WF-007": "https://github.com/tezball/my-island/pull/11",
        "PRD-006": "https://github.com/tezball/my-island/pull/14",
        "WF-001": "https://github.com/tezball/my-island/pull/6",
        "WF-002": "https://github.com/tezball/my-island/pull/8",
        "WF-017": "https://github.com/tezball/my-island/pull/36",
        "WF-018": "https://github.com/tezball/my-island/pull/37",
        "WF-022": "https://github.com/tezball/my-island/pull/39",
        "PRD-007": "https://github.com/tezball/my-island/pull/45",
        "WF-016": "https://github.com/tezball/my-island/pull/48",
        "PRD-008": "https://github.com/tezball/my-island/pull/47",
        "WF-023": "https://github.com/tezball/my-island/pull/52",
        "WF-024": "https://github.com/tezball/my-island/pull/63",
        "WF-025": "https://github.com/tezball/my-island/pull/64",
        "WF-030": "https://github.com/tezball/my-island/pull/65",
        "WF-031": "https://github.com/tezball/my-island/pull/66",
    }
    for ident, pr in expected.items():
        assert by_id[ident]["status"] == "done", ident
        assert by_id[ident].get("pr", "") == pr, ident
    board = (OPS / "BOARD.md").read_text()
    review = board.split("## In review", 1)[1].split("## Blocked", 1)[0]
    done = board.split("## Done", 1)[1]
    for ident in ("WF-024", "WF-030", "WF-031"):
        assert ident not in review, ident
        assert f"[[ops/tickets/{ident}|{ident}]]" in done, ident


def test_leads_pipeline_tickets_exist() -> None:
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    for ident in ("PRD-007", "PRD-008", "PRD-009"):
        assert ident in by_id, ident
        assert by_id[ident]["type"] == "story"
    assert by_id["PRD-007"]["status"] == "done"
    assert by_id["PRD-007"].get("pr", "") == "https://github.com/tezball/my-island/pull/45"
    assert "pull/40" not in by_id["PRD-007"].get("pr", "")
    assert not by_id["PRD-007"].get("blocked_reason")
    assert "plans/PRD-007" in by_id["PRD-007"].get("plan", "")
    assert by_id["PRD-008"]["status"] == "done"
    assert by_id["PRD-008"].get("pr", "") == "https://github.com/tezball/my-island/pull/47"
    assert not by_id["PRD-008"].get("blocked_reason")
    assert "plans/PRD-008" in by_id["PRD-008"].get("plan", "")
    assert by_id["PRD-009"]["status"] == "ready"
    assert by_id["PRD-009"]["status"] != "implement"
    assert by_id["PRD-007"]["owner"] == "product"
    assert by_id["PRD-008"]["owner"] == "eng-backend"
    assert by_id["PRD-009"]["owner"] == "product"
    assert (OPS / "plans" / "PRD-007.md").is_file()
    assert (OPS / "plans" / "PRD-008.md").is_file()


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
    assert "WAVE-1.md" in prd007
    assert "WAVE-1.md" in prd008
    assert "114 campsite leads" in prd007
    assert "status=lead" in prd007
    assert "pull/45" in prd007
    assert "pull/40" not in prd007
    assert "does **not** waive counsel" in prd009 or "does **not** waive counsel for publish" in prd009
    assert "draft" in prd008.lower()
    assert "categoryId" in prd008
    assert "countyId" in prd008
    assert "latitude" in prd008
    assert "longitude" in prd008


def test_wave1_acceptance_note() -> None:
    wave = (PRODUCT / "WAVE-1.md").read_text()
    assert "data/leads/places.jsonl" in wave
    assert "schema.json" in wave
    assert "PRD-006" in wave and "PRD-007" in wave and "PRD-008" in wave and "PRD-009" in wave
    assert "counsel" in wave.lower()
    assert "latitude" in wave and "longitude" in wave
    assert "categoryId" in wave and "countyId" in wave
    assert "dedupe_key" in wave
    assert "SIGNED.md" in wave
    assert "LEGAL.md" in wave
    readme = (DOCS / "data" / "leads" / "README.md").read_text()
    assert "WAVE-1.md" in readme
    assert "PRD-007" in readme
    plan = (OPS / "plans" / "PRD-007.md").read_text()
    assert "WAVE-1.md" in plan
    assert "schema.json" in plan
    assert "test_leads.py" in plan
    assert "dedupe_key" in plan
    signed = (PRODUCT / "SIGNED.md").read_text()
    assert "WAVE-1.md" in signed
    product_index = (PRODUCT / "README.md").read_text()
    assert "WAVE-1.md" in product_index
    plan008 = (OPS / "plans" / "PRD-008.md").read_text()
    assert "WAVE-1.md" in plan008
    assert "schema.json" in plan008
    assert "CreatePlaceRequest" in plan008
    assert "dedupe_key" in plan008
    assert "published" in plan008
    assert "PRD-009" in plan008
    assert "country table" in plan008.lower() or "country enum" in plan008.lower()


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
    assert "`categoryId`" in ticket
    assert "`countyId`" in ticket
    assert "`latitude`" in ticket
    assert "`longitude`" in ticket
    assert "categorySlug" not in ticket
    assert "countySlug" not in ticket
    assert "workshop exception" in ticket.lower()
    assert "tezball/my-island" in ticket
    assert "Public brand naming is OPEN" in ticket
    board = (OPS / "BOARD.md").read_text()
    assert "[[ops/tickets/E2E-001|E2E-001]] P0" in board
    index = (OPS / "tickets" / "_index.md").read_text()
    assert "E2E-" in index
    brief = (OPS / "workshops" / "e2e-place-stub.md").read_text()
    assert "[[ops/tickets/E2E-001]]" in brief
    assert "workflow/e2e-place-stub" in brief
    canvas_path = OPS / "workflow" / "e2e-place-stub.canvas"
    assert canvas_path.is_file()
    found = {p.resolve() for p in REPO.rglob("e2e-place-stub.canvas")}
    assert found == {canvas_path.resolve()}, found
    assert not (REPO / "docs" / "e2e-place-stub.canvas").exists()
    assert (REPO / "docs" / "ops" / "workflow" / "e2e-place-stub.canvas").is_file()
    assert list(OPS.glob("*.canvas")) == []
    for path in (OPS / "workflow").glob("*.canvas"):
        assert path.name == path.name.lower()
        assert not any(part.isdigit() and len(part) == 4 for part in path.stem.split("-"))
    canvas = json.loads(canvas_path.read_text())
    assert "nodes" in canvas and "edges" in canvas
    assert 15 <= len(canvas["nodes"]) <= 40
    assert canvas["edges"]
    files = {n.get("file") for n in canvas["nodes"] if n.get("type") == "file"}
    assert "ops/tickets/E2E-001.md" in files
    assert "ops/workshops/e2e-place-stub.md" in files
    blob = json.dumps(canvas)
    assert "create" in blob.lower()
    assert "STACK" in blob or "stack" in blob.lower()
    assert "categoryId" in blob
    assert "countyId" in blob
    assert "latitude" in blob
    assert "longitude" in blob
    assert "categorySlug" not in blob
    assert "countySlug" not in blob


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
    assert "[[ops/tickets/E2E-001]]" in text
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
    assert "[[ops/tickets/WF-016]]" in text
    assert "[[ops/tickets/WF-017]]" in text
    assert "[[ops/tickets/WF-018]]" in text
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    assert by_id["E2E-001"]["status"] == "ready"
    assert by_id["WF-015"]["status"] == "done"
    assert "spine strip" in by_id["WF-015"]["title"].lower()
    assert "WF-018" in by_id
    assert by_id["WF-018"]["status"] == "done"
    assert by_id["WF-018"]["owner"] == "automation-expert"
    assert by_id["WF-018"]["type"] == "workflow"
    assert "tickets/E2E-001" in by_id["WF-018"].get("parent", "")
    assert by_id["WF-018"].get("pr", "") == "https://github.com/tezball/my-island/pull/37"
    wf018 = (OPS / "tickets" / "WF-018.md").read_text()
    assert "[[ops/tickets/E2E-001]]" in wf018
    assert "[[ops/workflow/STACK-E2E-place-stub]]" in wf018
    assert by_id["WF-016"]["owner"] == "automation-expert"
    assert by_id["WF-016"]["type"] == "workflow"
    assert "tickets/E2E-001" in by_id["WF-016"].get("parent", "")
    assert by_id["WF-016"]["status"] == "done"
    assert "plans/WF-016" in by_id["WF-016"].get("plan", "")
    assert by_id["WF-016"].get("pr", "") == "https://github.com/tezball/my-island/pull/48"
    assert by_id["WF-017"]["status"] == "done"
    assert by_id["WF-017"].get("pr", "") == "https://github.com/tezball/my-island/pull/36"
    wf017 = (OPS / "tickets" / "WF-017.md").read_text()
    assert "[[ops/tickets/E2E-001]]" in wf017
    assert "[[ops/workflow/STACK-E2E-place-stub]]" in wf017
    assert "[[ops/runbooks/STACK_E2E_PLACE_STUB]]" in wf017
    assert by_id["WF-017"]["owner"] == "automation-expert"
    assert by_id["WF-017"]["type"] == "workflow"
    assert "tickets/E2E-001" in by_id["WF-017"].get("parent", "")
    assert by_id["WF-017"]["status"] == "done"
    assert "plans/WF-017" in by_id["WF-017"].get("plan", "")
    assert "github.com/tezball/my-island/pull/36" in by_id["WF-017"].get("pr", "")
    ci = (REPO / ".github" / "workflows" / "ci.yml").read_text()
    assert "compose.chaos.yml" not in ci
    assert "SPRING_PROFILES_ACTIVE: chaos" not in ci
    assert "--profile chaos" not in ci


def test_wf_017_stack_e2e_skill_and_runbook() -> None:
    skill = REPO / ".cursor/skills/stack-e2e-place-stub/SKILL.md"
    assert skill.is_file()
    skill_text = skill.read_text()
    desc = skill_text.split("---", 2)[1]
    for needle in (
        "E2E-001",
        "STACK-E2E",
        "chaos overlay",
        "mcp-grafana catalog scrape",
    ):
        assert needle in desc, needle
    assert "required CI" in skill_text.lower() or "required CI" in skill_text
    assert "Spring profile" in skill_text or "Spring profile `chaos`" in skill_text
    runbook = (OPS / "runbooks" / "STACK_E2E_PLACE_STUB.md").read_text()
    assert "./scripts/dev up" in runbook
    assert "docker compose -f compose.yml -f compose.chaos.yml --profile chaos up -d catalog --wait" in runbook
    assert "POST" in runbook and "/api/v1/places" in runbook
    assert "/actuator/health" in runbook
    assert "/actuator/prometheus" in runbook
    assert "127.0.0.1:9091/api/v1/query" in runbook
    assert "up{job=\"catalog\"}" in runbook or 'up{job="catalog"}' in runbook
    assert "api/ds/query" in runbook
    assert "docker compose -f compose.yml up -d catalog" in runbook
    assert "Required CI must not" in runbook or "required CI must not" in runbook.lower()
    for needle in ("categoryId", "countyId", "latitude", "longitude"):
        assert needle in skill_text, needle
        assert needle in runbook, needle
    assert "Ticket ACs still say" not in skill_text
    assert "not the E2E-001 AC names" not in runbook
    skills = (OPS / "workflow" / "SKILLS.md").read_text()
    assert "[[ops/runbooks/STACK_E2E_PLACE_STUB]]" in (OPS / "workflow" / "STACK-E2E-place-stub.md").read_text()
    assert "stack-e2e-place-stub" in skills
    index = (OPS / "runbooks" / "_index.md").read_text()
    assert "STACK_E2E_PLACE_STUB" in index
    ci = (REPO / ".github" / "workflows" / "ci.yml").read_text()
    assert "compose.chaos.yml" not in ci
    assert "SPRING_PROFILES_ACTIVE: chaos" not in ci


def test_wf_019_place_listing_sim() -> None:
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    assert by_id["WF-016"]["owner"] == "automation-expert"
    assert "mcp-grafana" in by_id["WF-016"]["title"].lower() or "postgres" in by_id["WF-016"]["title"].lower()
    assert "WF-019" in by_id
    meta = by_id["WF-019"]
    assert meta["status"] == "done"
    assert meta.get("pr", "") == "https://github.com/tezball/my-island/pull/31"
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
        assert "docs/ops/tickets" not in text, rel
    assert (OPS / "tickets" / "WF-019.md").is_file()
    assert not (REPO / "ops" / "tickets" / "WF-019.md").exists()
    assert "./scripts/sim-place-listing.sh" in ticket
    assert "categoryId" in ticket
    assert "countyId" in ticket
    assert "latitude" in ticket
    assert "longitude" in ticket
    assert "compose.chaos.yml" in ticket
    for reserved in ("WF-015", "WF-016", "WF-017", "WF-018"):
        assert f"[[ops/tickets/{reserved}]]" in ticket
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
    sim = (RUNTIME / "scripts" / "sim_place_listing.py").read_text()
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
    assert (OPS / "plans" / "WF-016.md").is_file()


def test_wf_016_cloud_mcp_attach_docs() -> None:
    """WF-016 closed after #48 grants; docs/MCP attach was #46."""
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    meta = by_id["WF-016"]
    assert meta["status"] == "done"
    assert meta.get("pr", "") == "https://github.com/tezball/my-island/pull/48"
    assert not meta.get("blocked_reason")
    close = (OPS / "runs" / "WF-016-close.md").read_text()
    assert "pull/48" in close
    assert "grants landed" in close.lower()
    assert "reopen" in close.lower()
    home = (REPO / "docs" / "HOME.md").read_text()
    doing = home.split("Doing / Review", 1)[1].split("Landed", 1)[0]
    landed = home.split("Landed", 1)[1].split("Ready / Up next", 1)[0]
    ready = home.split("Ready / Up next", 1)[1].split("Planning", 1)[0]
    assert "WF-016" not in doing
    assert "Review is empty" not in doing
    assert "In review" not in doing
    assert "WF-016" not in ready
    assert "WF-016" in landed
    assert "pull/48" in landed
    assert meta["owner"] == "automation-expert"
    assert meta["type"] == "workflow"
    assert "plans/WF-016" in meta.get("plan", "")
    plan = (OPS / "plans" / "WF-016.md").read_text()
    assert "status: approved" in plan
    assert "Engineering" in plan
    ticket = (OPS / "tickets" / "WF-016.md").read_text()
    assert "pull/46" in ticket
    assert "pull/48" in ticket
    assert "postgres-grant-catalog-reader.sql" in ticket
    assert "postgres-catalog" in ticket
    assert "Catalog SELECT verify" in ticket
    assert "no PR yet" not in ticket.lower()

    sql = (RUNTIME / "observability" / "postgres-grant-catalog-reader.sql").read_text()
    assert "GRANT CONNECT ON DATABASE catalog TO ops_reader" in sql
    assert "GRANT USAGE ON SCHEMA public TO ops_reader" in sql
    assert "GRANT SELECT ON ALL TABLES IN SCHEMA public TO ops_reader" in sql
    assert "ALTER DEFAULT PRIVILEGES FOR ROLE ops IN SCHEMA public GRANT SELECT ON TABLES TO ops_reader" in sql
    assert "REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA public FROM ops_reader" in sql
    compose = (REPO / "compose.yml").read_text()
    assert "postgres-grant-catalog-reader.sql" in compose
    assert "02-catalog-reader.sql" in compose
    dev = (REPO / "scripts" / "dev").read_text()
    assert "ensure_catalog_reader_grants" in dev
    up_block = dev.split("cmd_up()")[1].split("cmd_down()")[0]
    assert "compose.chaos.yml" not in up_block
    assert "ensure_catalog_reader_grants" in up_block
    migrations = {
        path.name
        for path in (
            REPO / "services" / "catalog" / "src" / "main" / "resources" / "db" / "migration"
        ).glob("V*.sql")
    }
    assert "V6__place_provenance.sql" in migrations
    v6 = (
        REPO
        / "services"
        / "catalog"
        / "src"
        / "main"
        / "resources"
        / "db"
        / "migration"
        / "V6__place_provenance.sql"
    ).read_text().lower()
    assert "grant" not in v6
    assert "ops_reader" not in v6

    mcp = json.loads((REPO / ".cursor" / "mcp.json").read_text())
    grafana = mcp["mcpServers"]["grafana"]
    assert "--disable-write" in grafana["args"]
    assert grafana["env"]["GRAFANA_URL"] == "http://127.0.0.1:3030"
    postgres_args = " ".join(mcp["mcpServers"]["postgres"]["args"])
    assert "ops_reader" in postgres_args
    assert "127.0.0.1:5433/ops" in postgres_args
    catalog_args = " ".join(mcp["mcpServers"]["postgres-catalog"]["args"])
    assert "ops_reader" in catalog_args
    assert "127.0.0.1:5433/catalog" in catalog_args
    for name in mcp["mcpServers"]:
        blob = json.dumps(mcp["mcpServers"][name])
        assert "ops:ops@" not in blob

    env = json.loads((REPO / ".cursor" / "environment.json").read_text())
    assert "mcpServers" not in env

    mcp_md = (OPS / "workflow" / "MCP.md").read_text()
    assert "stdio" in mcp_md.lower()
    assert "cursor.com/agents" in mcp_md
    assert "Integrations" in mcp_md
    assert "environment.json" in mcp_md
    assert "does **not** follow" in mcp_md or "does not follow" in mcp_md
    assert "127.0.0.1:9091/api/v1/query" in mcp_md
    assert "TODO (Engineering" in mcp_md or "TODO Engineering" in mcp_md
    assert "WF-004" in mcp_md
    local = (OPS / "workflow" / "LOCAL.md").read_text()
    assert "stdio" in local.lower()
    assert "TODO" in local
    stack = (OPS / "workflow" / "STACK-E2E-place-stub.md").read_text()
    assert "stdio" in stack.lower()
    assert "postgres-catalog" in stack
    assert "via grants" in stack
    assert "docs/ops/workflow/STACK-E2E-place-stub.md" in stack
    assert "TODO Engineering" not in stack
    runbook = (OPS / "runbooks" / "STACK_E2E_PLACE_STUB.md").read_text()
    assert "127.0.0.1:9091/api/v1/query" in runbook
    assert "Engineering grants" in runbook or "TODO" in runbook
    agents = (DOCS / "AGENTS.md").read_text()
    assert "stdio" in agents.lower()
    assert "does **not** attach" in agents or "does not attach" in agents
    assert "TODO Engineering" in agents
    ci = (REPO / ".github" / "workflows" / "ci.yml").read_text()
    assert "compose.chaos.yml" not in ci
    assert "SPRING_PROFILES_ACTIVE: chaos" not in ci
    assert "--profile chaos" not in ci
    assert by_id["WF-004"]["status"] == "blocked"
    assert by_id["WF-010"]["status"] == "blocked"


def test_wf_021_human_cli_ticket() -> None:
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    assert "WF-021" in by_id
    meta = by_id["WF-021"]
    assert meta["status"] == "done"
    assert meta.get("pr", "") == "https://github.com/tezball/my-island/pull/35"
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


def test_product_milestones_freeze() -> None:
    path = PRODUCT / "MILESTONES.md"
    assert path.is_file()
    text = path.read_text()
    for needle in (
        "Release 1",
        "**M0**",
        "**M1**",
        "**M7**",
        "return rate",
        "Chunk 1",
        "6a",
        "6b",
        "MVP.md",
        "EXPANSION.md",
        "SIGNED.md",
        "WF-018",
        "PRD-003",
    ):
        assert needle in text, needle
    readme = (PRODUCT / "README.md").read_text()
    assert "MILESTONES.md" in readme
    signed = (PRODUCT / "SIGNED.md").read_text()
    assert "MILESTONES.md" in signed
    dash = (REPO / "docs" / "HOME.md").read_text()
    assert "product/MILESTONES.md" in dash
    root_readme = (REPO / "README.md").read_text()
    assert "MILESTONES.md" in root_readme
    kanban = (OPS / "MILESTONES.md").read_text()
    assert "kanban-plugin: basic" in kanban
    assert "board_sync" in kanban
    assert "[[ops/BOARD]]" in kanban
    assert "**M0**" in kanban
    assert "Chunk 1" in kanban
    home = (OPS / "HOME.md").read_text()
    assert "[[ops/MILESTONES]]" in home
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    assert by_id["WF-000"]["status"] == "implement"
    assert by_id["E2E-001"]["status"] == "ready"
    assert by_id["WF-018"]["status"] == "done"
    assert by_id["WF-018"].get("pr", "") == "https://github.com/tezball/my-island/pull/37"
    board = (OPS / "BOARD.md").read_text()
    assert "## Upcoming" in board
    assert "## Doing" in board
    assert "## In review" in board
    assert "## Planning" in board
    assert "## Inbox" not in board


def test_wf_022_home_dashboard_retrospective() -> None:
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    assert "WF-022" in by_id
    meta = by_id["WF-022"]
    assert meta["status"] == "done"
    assert "pull/39" in meta.get("pr", "")
    assert meta["type"] == "workflow"
    board = (OPS / "BOARD.md").read_text()
    assert "- [x] [[ops/tickets/WF-022|WF-022]]" in board
    home = (REPO / "docs" / "HOME.md").read_text()
    doing = home.split("Doing / Review", 1)[1].split("Landed", 1)[0]
    assert "WF-000" in doing
    assert "PRD-008" not in doing
    assert "WF-023" not in doing
    assert "Review is empty" not in doing
    assert "In review" not in doing
    assert "WF-016" not in doing
    assert "WF-017" not in doing
    assert "WF-018" not in doing
    assert "WF-019" not in doing
    assert "WF-021" not in doing
    assert "WF-017" in home
    assert "WF-018" in home
    assert "pull/36" in home
    assert "pull/37" in home
    assert "pull/45" in home
    landed = home.split("Landed", 1)[1].split("Ready / Up next", 1)[0]
    assert "PRD-007" in landed
    assert "WF-016" in landed
    assert "pull/48" in landed
    assert "PRD-008" in landed
    assert "pull/47" in landed
    assert "WF-023" in landed
    assert "pull/52" in landed
    ready = home.split("Ready / Up next", 1)[1].split("Planning", 1)[0]
    assert "WF-016" not in ready
    planning = home.split("Planning", 1)[1].split("Workshop", 1)[0]
    assert "PRD-008" not in planning
    assert "PRD-007" not in planning
    assert "| P0 | review | Repeatable place listing" not in home
    assert "| P1 | review | Simple local CLI" not in home
    assert "Public product name is **OPEN**" in home
    ticket = (OPS / "tickets" / "WF-022.md").read_text()
    assert "retrospective" in ticket.lower()
    assert not (OPS / "plans" / "WF-022.md").exists()


def test_prd_008_and_wf_023_closed() -> None:
    """Merged #47 and #52 must not stay in review. Vault root wording is docs/."""
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    assert by_id["PRD-008"]["status"] == "done"
    assert by_id["PRD-008"].get("pr", "") == "https://github.com/tezball/my-island/pull/47"
    assert not by_id["PRD-008"].get("blocked_reason")
    assert by_id["WF-023"]["status"] == "done"
    assert by_id["WF-023"].get("pr", "") == "https://github.com/tezball/my-island/pull/52"
    assert not by_id["WF-023"].get("blocked_reason")
    board = (OPS / "BOARD.md").read_text()
    review = board.split("## In review", 1)[1].split("## Blocked", 1)[0]
    done = board.split("## Done", 1)[1]
    assert "PRD-008" not in review
    assert "WF-023" not in review
    assert "- [x] [[ops/tickets/PRD-008|PRD-008]]" in done
    assert "- [x] [[ops/tickets/WF-023|WF-023]]" in done
    home = (REPO / "docs" / "HOME.md").read_text()
    doing = home.split("Doing / Review", 1)[1].split("Landed", 1)[0]
    landed = home.split("Landed", 1)[1].split("Ready / Up next", 1)[0]
    assert "PRD-008" not in doing
    assert "WF-023" not in doing
    assert "PRD-008" in landed and "pull/47" in landed
    assert "WF-023" in landed and "pull/52" in landed
    assert "the Obsidian vault is **`docs/`**" in home
    assert "Obsidian vault is the **repo root**" not in home
    skills = (OPS / "workflow" / "SKILLS.md").read_text()
    assert "open **`docs/`** in Obsidian" in skills
    assert "open `ops/` in Obsidian" not in skills
    assert (OPS / "runs" / "PRD-008-close.md").is_file()
    assert (OPS / "runs" / "WF-023-close.md").is_file()


def test_wf_025_no_prod_and_automerge() -> None:
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    assert "WF-025" in by_id
    meta = by_id["WF-025"]
    assert meta["owner"] == "automation-expert"
    assert meta["type"] == "workflow"
    assert meta["priority"] == "P0"
    assert "tickets/WF-000" in meta.get("parent", "")
    assert "plans/WF-025" in meta.get("plan", "")
    decisions = (OPS / "company" / "DECISIONS.md").read_text()
    assert "has no production environment and probably never will" in decisions
    assert "Ready PRs auto-review, approve, and squash-merge" in decisions
    rule = (REPO / ".cursor" / "rules" / "no-prod.mdc").read_text()
    assert "alwaysApply: true" in rule
    assert "no prod" in rule.lower()
    safety = (OPS / "workflow" / "SAFETY.md").read_text()
    assert "Ready PRs merge themselves" in safety
    assert "There is no production" in safety
    ci = (REPO / ".github" / "workflows" / "ci.yml").read_text()
    assert "name: auto-review approve merge" in ci
    assert "needs: [unit, catalog, stack]" in ci
    assert "github.event.pull_request.draft == false" in ci
    assert "head.repo.full_name == github.repository" in ci
    assert "merge_method: 'squash'" in ci
    automerge = ci.split("automerge:")[1]
    assert "compose.chaos.yml" not in automerge
    assert (OPS / "plans" / "WF-025.md").is_file()


def test_wf_031_jenkins_local_house_ci() -> None:
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    assert "WF-031" in by_id
    meta = by_id["WF-031"]
    assert meta["owner"] == "automation-expert"
    assert meta["type"] == "workflow"
    assert "plans/WF-031" in meta.get("plan", "")
    decisions = (OPS / "company" / "DECISIONS.md").read_text()
    assert "Jenkins local house CI" in decisions
    safety = (OPS / "workflow" / "SAFETY.md").read_text()
    assert "Do not restore legacy Jenkins" in safety
    ci_yml = (REPO / ".github" / "workflows" / "ci.yml").read_text()
    assert "SKIP_JENKINS" in ci_yml
    compose = (REPO / "compose.yml").read_text()
    assert "jenkins:" in compose
    assert "ops_jenkins" in compose
    assert (REPO / "ops" / "jenkins" / "casc" / "jenkins.yaml").is_file()
    assert (REPO / "ops" / "jenkins" / "plugins.txt").is_file()
    assert (REPO / "Jenkinsfile").is_file()
    assert (OPS / "runbooks" / "JENKINS_LOCAL.md").is_file()
    assert (OPS / "plans" / "WF-031.md").is_file()
    assert (OPS / "workshops" / "jenkins-local-ci.md").is_file()
    stack = (REPO / "docs" / "product" / "STACK.md").read_text()
    assert "Jenkins" in stack
    assert "SKIP_JENKINS" in (REPO / "scripts" / "dev").read_text()
