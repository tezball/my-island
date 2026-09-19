from __future__ import annotations

import json
import re
import stat
import subprocess
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
    "runbooks/WORKTREE.md",
    "workflow/WORKTREES.md",
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
    "workflow/AGENT_DX.md",
    "workflow/TEST_STACK.md",
    "tickets/E2E-001.md",
    "tickets/WF-035.md",
    "workshops/e2e-place-stub.md",
    "workshops/cto-test-stack.md",
    "workflow/e2e-place-stub.canvas",
    "workflow/cto-test-stack.canvas",
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

HAPPY_PATH_CI_JOBS = ("unit", "catalog", "web", "stack", "automerge")


def gha_job_body(ci: str, job: str) -> str:
    """YAML body of a top-level GitHub Actions job (indent-2 key)."""
    marker = f"\n  {job}:"
    start = ci.find(marker)
    if start < 0:
        return ""
    rest = ci[start + len(marker) :]
    nxt = re.search(r"\n  [A-Za-z0-9_-]+:", rest)
    return rest[: nxt.start()] if nxt else rest


def assert_happy_path_ci_no_chaos(ci: str) -> None:
    for job in HAPPY_PATH_CI_JOBS:
        body = gha_job_body(ci, job)
        assert "compose.chaos.yml" not in body, job
        assert "SPRING_PROFILES_ACTIVE: chaos" not in body, job
        assert "--profile chaos" not in body, job


def test_required_vault_files_exist() -> None:
    missing = [rel for rel in REQUIRED_VAULT if not (OPS / rel).is_file()]
    assert missing == []
    for rel in (
        ".obsidian/community-plugins.json",
        ".obsidian/daily-notes.json",
        ".obsidian/core-plugins.json",
    ):
        assert (DOCS / rel).is_file(), rel


def test_worktrees_primary_stays_on_main() -> None:
    policy = (OPS / "workflow" / "WORKTREES.md").read_text()
    assert "Primary stays on `main`" in policy
    assert "Deploy from `main` only" in policy
    loop = (OPS / "workflow" / "LOOP.md").read_text()
    assert "sibling worktree" in loop
    skill = (REPO / ".cursor" / "skills" / "ops-loop" / "SKILL.md").read_text()
    assert "no worktree by default" not in skill
    assert "Sibling worktree" in skill
    runbook = (OPS / "runbooks" / "WORKTREE.md").read_text()
    assert "git worktree add" in runbook
    index = (OPS / "workflow" / "_index.md").read_text()
    assert "WORKTREES" in index


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
    """Marketplace stays gated; directory MVP children landed on #82."""
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    assert by_id["PRD-004"]["status"] != "implement"
    for ident in ("PRD-002", "PRD-003"):
        assert by_id[ident]["status"] == "done"
        assert f"plans/{ident}" in by_id[ident].get("plan", "")
        assert by_id[ident].get("pr", "") == "https://github.com/tezball/my-island/pull/82"
    assert (OPS / "runs" / "PRD-002-003-011-close.md").is_file()
    home = (REPO / "docs" / "HOME.md").read_text()
    doing = home.split("Doing / Review", 1)[1].split("Landed", 1)[0]
    landed = home.split("Landed", 1)[1].split("Ready / Up next", 1)[0]
    ready = home.split("Ready / Up next", 1)[1].split("Planning", 1)[0]
    assert "PRD-002" not in doing
    assert "PRD-003" not in doing
    assert "PRD-011" not in doing
    assert "PRD-002" in landed and "PRD-003" in landed and "PRD-011" in landed
    assert "pull/82" in landed
    assert "ops/tickets/PRD-002.md" not in ready
    assert "ops/tickets/PRD-003.md" not in ready


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
    assert by_id["PRD-003"]["status"] == "done"
    assert by_id["PRD-003"].get("pr", "") == "https://github.com/tezball/my-island/pull/82"
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
        "PRD-002": "https://github.com/tezball/my-island/pull/82",
        "PRD-003": "https://github.com/tezball/my-island/pull/82",
        "PRD-011": "https://github.com/tezball/my-island/pull/82",
    }
    for ident, pr in expected.items():
        assert by_id[ident]["status"] == "done", ident
        assert by_id[ident].get("pr", "") == pr, ident
    board = (OPS / "BOARD.md").read_text()
    review = board.split("## In review", 1)[1].split("## Blocked", 1)[0]
    done = board.split("## Done", 1)[1]
    for ident in ("WF-024", "WF-030", "WF-031", "PRD-002", "PRD-003", "PRD-011"):
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
    assert by_id["PRD-009"]["status"] == "plan"
    assert by_id["PRD-009"]["status"] != "implement"
    assert "plans/PRD-009" in by_id["PRD-009"].get("plan", "")
    assert by_id["PRD-009"].get("gate") == "human"
    assert by_id["PRD-007"]["owner"] == "product"
    assert by_id["PRD-008"]["owner"] == "eng-backend"
    assert by_id["PRD-009"]["owner"] == "product"
    assert (OPS / "plans" / "PRD-007.md").is_file()
    assert (OPS / "plans" / "PRD-008.md").is_file()
    assert (OPS / "plans" / "PRD-009.md").is_file()


def test_harvested_mvp_plans_and_children() -> None:
    """MVP plans/tickets on main; CEO pivots seed + password auth."""
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    for ident in ("PRD-010", "PRD-011", "PRD-012", "PRD-013", "PRD-014"):
        assert ident in by_id, ident
        assert by_id[ident]["type"] == "story"
        assert "tickets/PRD-000" in by_id[ident].get("parent", "")
    assert by_id["PRD-010"]["status"] == "implement"
    assert "plans/PRD-010" in by_id["PRD-010"].get("plan", "")
    assert "password" in by_id["PRD-010"]["title"].lower()
    assert by_id["PRD-003"]["status"] == "done"
    assert "plans/PRD-003" in by_id["PRD-003"].get("plan", "")
    assert by_id["PRD-002"]["status"] == "done"
    assert "plans/PRD-002" in by_id["PRD-002"].get("plan", "")
    assert "seed" in by_id["PRD-002"]["title"].lower()
    assert "plans/PRD-000" in by_id["PRD-000"].get("plan", "")
    assert "plans/E2E-001" in by_id["E2E-001"].get("plan", "")
    assert by_id["E2E-001"]["status"] == "done"
    for ident in ("PRD-011", "PRD-012", "PRD-013", "PRD-014"):
        if ident == "PRD-011":
            assert by_id[ident]["status"] == "done"
            assert by_id[ident].get("pr", "") == "https://github.com/tezball/my-island/pull/82"
        elif ident in ("PRD-012", "PRD-013"):
            assert by_id[ident]["status"] == "blocked"
        else:
            assert by_id[ident]["status"] == "implement"
        assert f"plans/{ident}" in by_id[ident].get("plan", "")
    plan010 = (OPS / "plans" / "PRD-010.md").read_text()
    assert "No OIDC stub" in plan010 or "no OIDC stub" in plan010.lower()
    plan002 = (OPS / "plans" / "PRD-002.md").read_text()
    assert "places.jsonl" in plan002
    assert "spreadsheet" in plan002.lower()
    team = (OPS / "agents" / "mvp-team.md").read_text()
    assert "mvp-seed" in team and "mvp-auth" in team and "mvp-explore" in team
    assert by_id["WF-003"]["status"] == "done"
    assert by_id["WF-003"].get("gate") in ("", None) or not by_id["WF-003"].get("gate")
    for name in (
        "PRD-000.md",
        "PRD-002.md",
        "PRD-003.md",
        "PRD-009.md",
        "PRD-010.md",
        "E2E-001.md",
        "WF-003.md",
    ):
        plan = (OPS / "plans" / name).read_text()
        assert "status: approved" in plan
    assert (OPS / "agents" / "mvp-team.md").is_file()
    assert (OPS / "runs" / "branch-docs-harvest.md").is_file()


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
    assert meta["status"] == "done"
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
    """Workshop pass files gaps; E2E-001 closed done after close-out plan."""
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
    assert by_id["E2E-001"]["status"] == "done"
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
    assert_happy_path_ci_no_chaos(ci)


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
    assert_happy_path_ci_no_chaos(ci)


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
    assert_happy_path_ci_no_chaos(ci)
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
    assert by_id["E2E-001"]["status"] == "done"
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
    assert "needs: [unit, catalog, web, stack]" in ci
    assert "github.event.pull_request.draft == false" in ci
    assert "head.repo.full_name == github.repository" in ci
    assert "merge_method: 'squash'" in ci
    automerge = ci.split("automerge:")[1]
    assert "compose.chaos.yml" not in automerge
    assert_happy_path_ci_no_chaos(ci)
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


def test_wf_034_agent_dx_pack_workshop() -> None:
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    assert "WF-034" in by_id
    meta = by_id["WF-034"]
    assert meta["owner"] == "automation-expert"
    assert meta["type"] == "workflow"
    assert meta["status"] == "done"
    assert meta.get("gate") in ("", None) or not meta.get("gate")
    assert "plans/WF-034" in meta.get("plan", "")
    assert (OPS / "plans" / "WF-034.md").is_file()
    assert (OPS / "workshops" / "agent-dx-pack.md").is_file()
    assert (OPS / "workflow" / "agent-dx-pack.canvas").is_file()
    assert (OPS / "workflow" / "AGENT_DX.md").is_file()
    brief = (OPS / "workshops" / "agent-dx-pack.md").read_text()
    assert "intellij" in brief.lower()
    assert "/next-ticket" in brief
    assert "disable-model-invocation" in brief
    assert "Grafana Cloud" in brief
    assert ".cursor/commands/" in brief
    assert "MUST" in brief
    assert "NO" in brief
    index = (OPS / "workshops" / "_index.md").read_text()
    assert "agent-dx-pack" in index
    mcp = (OPS / "workflow" / "MCP.md").read_text()
    assert "intellij" in mcp.lower()
    assert "WF-034" in mcp
    canvas = json.loads((OPS / "workflow" / "agent-dx-pack.canvas").read_text())
    assert "nodes" in canvas and "edges" in canvas
    files = {n.get("file") for n in canvas["nodes"] if n.get("type") == "file"}
    assert "ops/tickets/WF-034.md" in files
    assert "ops/workshops/agent-dx-pack.md" in files

    auto = (
        "clone-run",
        "reviewer",
        "mcp-observe",
        "intellij-ide",
        "spring-catalog",
    )
    slash = (
        "next-ticket",
        "plan",
        "implement",
        "review",
        "app-start",
        "app-test",
        "board-sync",
        "mcp-health",
        "new-ticket",
        "stack-e2e",
        "dod",
    )
    for name in auto + slash:
        path = REPO / ".cursor" / "skills" / name / "SKILL.md"
        assert path.is_file(), name
        text = path.read_text()
        assert f"name: {name}" in text
    for name in slash:
        text = (REPO / ".cursor" / "skills" / name / "SKILL.md").read_text()
        assert "disable-model-invocation: true" in text
    assert not (REPO / ".cursor" / "commands").exists()
    mcp_json = json.loads((REPO / ".cursor" / "mcp.json").read_text())
    idea = mcp_json["mcpServers"]["intellij"]
    assert "mcp-intellij" in idea["command"]
    assert "http://" not in json.dumps(idea)
    script = REPO / "scripts" / "mcp-intellij"
    assert script.is_file()
    assert script.stat().st_mode & stat.S_IXUSR
    help_out = subprocess.run(
        [str(script), "--help"],
        check=True,
        capture_output=True,
        text=True,
        timeout=5,
    )
    assert "MCP Server" in help_out.stdout
    dx = (OPS / "workflow" / "AGENT_DX.md").read_text()
    assert "/next-ticket" in dx
    assert "/app-test" in dx
    assert "intellij" in dx.lower()
    skills_md = (OPS / "workflow" / "SKILLS.md").read_text()
    assert "clone-run" in skills_md
    assert "AGENT_DX" in skills_md
    stack = (REPO / "docs" / "product" / "STACK.md").read_text()
    assert "IntelliJ MCP" in stack


def test_wf_035_test_stack_today_vs_want() -> None:
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    assert "WF-035" in by_id
    meta = by_id["WF-035"]
    assert meta["owner"] == "eng-qa"
    assert meta["type"] == "workflow"
    assert meta["priority"] == "P1"
    assert meta["status"] == "done"
    assert "tickets/WF-000" in meta.get("parent", "")
    assert "plans/WF-035" in meta.get("plan", "")
    assert (OPS / "plans" / "WF-035.md").is_file()
    stack = (OPS / "workflow" / "TEST_STACK.md").read_text()
    for needle in (
        "Shift-left",
        "Five lanes",
        "BDD = integration",
        "Gherkin",
        "Testcontainers",
        "Gatling",
        "Cucumber",
        "Playwright",
        "./scripts/dev sim",
        "./scripts/dev traffic",
        "No chaos in merge",
        "Tests as tools",
        "only browser E2E",
    ):
        assert needle in stack, needle
    assert_happy_path_ci_no_chaos((REPO / ".github" / "workflows" / "ci.yml").read_text())
    brief = (OPS / "workshops" / "cto-test-stack.md").read_text()
    assert "[[ops/tickets/WF-035]]" in brief
    assert "Gatling" in brief
    assert "shift left" in brief.lower() or "Shift left" in brief
    canvas = json.loads((OPS / "workflow" / "cto-test-stack.canvas").read_text())
    assert "nodes" in canvas and "edges" in canvas
    assert 15 <= len(canvas["nodes"]) <= 40
    files = {n.get("file") for n in canvas["nodes"] if n.get("type") == "file"}
    assert "ops/tickets/WF-035.md" in files
    assert "ops/workflow/TEST_STACK.md" in files
    assert "ops/workshops/cto-test-stack.md" in files
    blob = json.dumps(canvas)
    assert "Gatling" in blob
    assert "Gherkin" in blob
    assert "Testcontainers" in blob
    assert "shift" in blob.lower()
    index = (OPS / "workflow" / "_index.md").read_text()
    assert "TEST_STACK" in index
    assert "cto-test-stack" in (OPS / "workshops" / "_index.md").read_text()
    dod = (OPS / "workflow" / "DOD.md").read_text()
    assert "[[TEST_STACK]]" in dod
    assert "BDD = integration" in dod or "Gherkin vs Testcontainers" in dod
    ci = (OPS / "workflow" / "CI.md").read_text()
    assert "TEST_STACK" in ci
    qa = (OPS / "dashboards" / "qa.md").read_text()
    assert "TEST_STACK" in qa
    dx = (OPS / "workflow" / "AGENT_DX.md").read_text()
    assert "TEST_STACK" in dx
    app_test = (REPO / ".cursor" / "skills" / "app-test" / "SKILL.md").read_text()
    assert "TEST_STACK" in app_test


def test_wf_036_second_brain_atlas() -> None:
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    assert "WF-036" in by_id
    meta = by_id["WF-036"]
    assert meta["owner"] == "architecture"
    assert meta["type"] == "workflow"
    assert meta["priority"] == "P1"
    assert "tickets/WF-000" in meta.get("parent", "")
    assert "plans/WF-036" in meta.get("plan", "")
    assert (OPS / "plans" / "WF-036.md").is_file()
    assert (DOCS / "ATLAS.md").is_file()
    for stem in ("work", "product", "engineering", "company", "knowledge", "archive"):
        assert (DOCS / "atlas" / f"{stem}.md").is_file(), stem
    assert (DOCS / "notes" / "_index.md").is_file()
    assert (DOCS / "notes" / "adr" / "_index.md").is_file()
    assert (DOCS / "notes" / "meetings" / "_index.md").is_file()
    for tmpl in ("moc.md", "wiki.md", "note.md", "adr.md", "meeting.md"):
        assert (OPS / "templates" / tmpl).is_file(), tmpl
    css = (DOCS / ".obsidian" / "snippets" / "company-os.css").read_text()
    assert "nav-folder-title[data-path=" in css
    assert "data-path=\"ops/tickets\"]" in css or 'data-path="ops/tickets"' in css
    assert ".markdown-preview-view.ticket" in css
    assert ".markdown-preview-view.note" in css
    appearance = json.loads((DOCS / ".obsidian" / "appearance.json").read_text())
    assert "company-os" in appearance.get("enabledCssSnippets", [])
    plugins = json.loads((DOCS / ".obsidian" / "community-plugins.json").read_text())
    for pid in ("dataview", "homepage", "templater-obsidian", "calendar"):
        assert pid in plugins, pid
    app = json.loads((DOCS / ".obsidian" / "app.json").read_text())
    assert app.get("newFileFolderPath") == "notes"
    graph = json.loads((DOCS / ".obsidian" / "graph.json").read_text())
    queries = {g["query"] for g in graph["colorGroups"]}
    assert "path:ops/tickets" in queries
    assert "path:notes" in queries
    atlas = (DOCS / "ATLAS.md").read_text()
    assert 'FROM "ops/tickets"' in atlas
    assert "[[atlas/work]]" in atlas
    home = (DOCS / "HOME.md").read_text()
    assert "[[ATLAS]]" in home
    naming = (OPS / "NAMING.md").read_text()
    assert "notes/" in naming
    assert "ATLAS.md" in naming
    plugins_md = (OPS / "PLUGINS.md").read_text()
    assert "nav-folder-title" in plugins_md
    brief = (OPS / "workshops" / "second-brain.md").read_text()
    assert "[[ops/tickets/WF-036]]" in brief
    canvas = json.loads((OPS / "workflow" / "second-brain.canvas").read_text())
    files = {n.get("file") for n in canvas["nodes"] if n.get("type") == "file"}
    assert "ATLAS.md" in files
    assert "atlas/work.md" in files
    assert "ops/tickets/WF-036.md" in files
    assert "second-brain" in (OPS / "workshops" / "_index.md").read_text()
    design = (OPS / "company" / "VAULT_DESIGN.md").read_text()
    assert "Folder groups" in design
    assert "heather" in design.lower()
    assert not (DOCS / ".obsidian" / "plugins" / "homepage" / "main.js").exists()


def test_wf_037_mock_prod_info_probe() -> None:
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    assert "WF-037" in by_id
    meta = by_id["WF-037"]
    assert meta["owner"] == "automation-expert"
    assert meta["type"] == "workflow"
    assert "tickets/WF-032" in meta.get("parent", "")
    assert "plans/WF-037" in meta.get("plan", "")
    assert (OPS / "plans" / "WF-037.md").is_file()
    caddy = (RUNTIME / "deploy" / "caddy_apex.py").read_text()
    assert "handle /actuator/health" in caddy
    assert "handle /actuator/info" in caddy
    deploy = (REPO / "scripts" / "deploy-mock-prod.sh").read_text()
    assert "check_deploy_info.py" in deploy
    assert "GIT_COMMIT" in deploy
    assert "--force-recreate catalog web" in deploy
    verifier = (RUNTIME / "scripts" / "check_deploy_info.py").read_text()
    assert "gitCommit" in verifier
    runbook = (OPS / "runbooks" / "MOCK_PROD_DEPLOY.md").read_text()
    assert "/actuator/info" in runbook
    compose = (REPO / "compose.yml").read_text()
    assert "GIT_COMMIT: ${GIT_COMMIT:-unknown}" in compose
    app = (REPO / "services" / "catalog" / "src" / "main" / "resources" / "application.yml").read_text()
    assert "gitCommit: ${GIT_COMMIT:unknown}" in app
    assert "env:\n      enabled: true" in app


def test_inc_001_mutes_legacy_fj_alerts() -> None:
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    assert "INC-001" in by_id
    meta = by_id["INC-001"]
    assert meta["type"] == "incident"
    assert meta["owner"] == "ops-incidents"
    assert "tickets/WF-032" in meta.get("parent", "")
    assert "plans/INC-001" in meta.get("plan", "")
    assert (OPS / "plans" / "INC-001.md").is_file()
    mute = (RUNTIME / "deploy" / "disable_legacy_alerts.py").read_text()
    assert "receiver: keep" in mute
    assert "groups: []" in mute
    assert "email_configs" not in mute
    deploy = (REPO / "scripts" / "deploy-mock-prod.sh").read_text()
    assert "disable_legacy_alerts.py" in deploy
    runbook = (OPS / "runbooks" / "MOCK_PROD_DEPLOY.md").read_text()
    assert "INC-001" in runbook
    assert (OPS / "runs" / "INC-001-implement.md").is_file()


def test_wf_039_gis_origin_mismatch() -> None:
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    assert "WF-039" in by_id
    meta = by_id["WF-039"]
    assert meta["type"] == "bug"
    assert meta["owner"] == "eng-backend"
    assert "tickets/WF-032" in meta.get("parent", "")
    assert "plans/WF-039" in meta.get("plan", "")
    assert (OPS / "plans" / "WF-039.md").is_file()
    runbook = (OPS / "runbooks" / "GOOGLE_GIS.md").read_text()
    for origin in (
        "https://fishing-journals.com",
        "https://app.fishing-journals.com",
        "http://localhost",
        "http://localhost:5173",
    ):
        assert origin in runbook
    assert "Authorized JavaScript origins" in runbook
    assert "console.cloud.google.com/auth/clients" in runbook
    assert "127.0.0.1:5173" in runbook
    assert "/login/oauth2/code/google" in runbook
    assert "production host" in runbook.lower() or "no prod" in runbook.lower() or "Not production" in runbook
    index = (OPS / "runbooks" / "_index.md").read_text()
    assert "GOOGLE_GIS" in index
    compose = (REPO / "compose.yml").read_text()
    assert "VITE_GOOGLE_CLIENT_ID: ${VITE_GOOGLE_CLIENT_ID:-${GOOGLE_CLIENT_ID:-}}" in compose
    login = (REPO / "web" / "src" / "auth" / "GoogleLogin.tsx").read_text()
    assert "gisCanonicalUrl" in login
    assert "login_uri" not in login
    vite = (REPO / "web" / "vite.config.ts").read_text()
    assert "no-referrer-when-downgrade" in vite
    mock = (OPS / "runbooks" / "MOCK_PROD_DEPLOY.md").read_text()
    assert "GOOGLE_GIS" in mock


def test_poi_visitintent_planner_land() -> None:
    """CEO 2026-09-19 VisitIntent slice + unattended mock-prod tickets on main."""
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    for ident, typ, owner, parent in (
        ("WF-041", "workflow", "eng-infra", "WF-032"),
        ("WF-042", "workflow", "automation-expert", "WF-000"),
        ("WF-043", "workflow", "automation-expert", "WF-000"),
        ("WF-044", "workflow", "eng-security", "WF-000"),
        ("WF-045", "workflow", "eng-infra", "WF-042"),
        ("WF-046", "workflow", "eng-backend", "WF-000"),
        ("PRD-015", "story", "eng-backend", "PRD-000"),
    ):
        meta = by_id[ident]
        expected_status = "review" if ident == "PRD-015" else "implement"
        assert meta["status"] == expected_status, ident
        assert meta["type"] == typ, ident
        assert meta["priority"] == "P0", ident
        assert meta["owner"] == owner, ident
        assert f"tickets/{parent}" in meta.get("parent", ""), ident
        assert f"plans/{ident}" in meta.get("plan", ""), ident
        plan = (OPS / "plans" / f"{ident}.md").read_text()
        assert "status: approved" in plan, ident
        assert "gh pr merge" not in plan.lower() or "do not" in plan.lower()
    assert by_id["PRD-012"]["status"] == "blocked"
    assert by_id["PRD-013"]["status"] == "blocked"
    assert "tickets/PRD-000" in by_id["PRD-012"].get("parent", "")
    assert "plans/PRD-012" in by_id["PRD-012"].get("plan", "")
    prd012 = (OPS / "tickets" / "PRD-012.md").read_text()
    prd013 = (OPS / "tickets" / "PRD-013.md").read_text()
    for text in (prd012, prd013):
        assert "PRD-015" in text
        assert "VisitIntent" in text
        assert "wrong shape" in text
    assert by_id["WF-004"]["status"] == "blocked"
    assert by_id["WF-010"]["status"] == "blocked"
    wf011 = by_id["WF-011"]
    assert wf011["status"] == "implement"
    assert wf011["type"] == "workflow"
    assert wf011["owner"] == "automation-expert"
    assert "tickets/WF-007" in wf011.get("parent", "")
    assert "plans/WF-011" in wf011.get("plan", "")
    assert "status: approved" in (OPS / "plans" / "WF-011.md").read_text()
    decisions = (OPS / "company" / "DECISIONS.md").read_text()
    assert "2026-09-19" in decisions
    assert "VisitIntent" in decisions
    assert "Agents never SSH" in decisions
    assert "has no production environment and probably never will" in decisions
    slice_note = (PRODUCT / "POI-VISITINTENT.md").read_text()
    assert "been" in slice_note and "want" in slice_note and "never" in slice_note
    assert "VisitIntent" in slice_note
    assert "PRD-012" in slice_note and "PRD-013" in slice_note
    workshop = (OPS / "workshops" / "poi-visitintent.md").read_text()
    assert "WF-040" in workshop and "PRD-015" in workshop
    assert "WF-045" in workshop
    assert "Alerts lock C" in workshop
    pipeline = (OPS / "workflow" / "PIPELINE.md").read_text()
    assert "WF-040" in pipeline
    assert "Agents never SSH" in pipeline
    assert "WF-045" in pipeline
    assert "Jenkins red" in pipeline
    mcp = (OPS / "workflow" / "MCP.md").read_text()
    assert "WF-041" in mcp and "WF-042" in mcp
    assert "WF-043" in mcp and "WF-044" in mcp
    assert "WF-045" in mcp
    assert "TODO (Engineering" in mcp or "TODO Engineering" in mcp
    assert "Alerts lock C" in mcp
    assert "WF-046" in mcp
    assert "Catalog writes lock C" in mcp
    assert "VisitIntent privacy" in mcp
    assert "Public counts lock A" in mcp
    assert (OPS / "runs" / "WF-040-planner.md").is_file()
    wf041 = (OPS / "tickets" / "WF-041.md").read_text() + (
        OPS / "plans" / "WF-041.md"
    ).read_text()
    assert "fishing-journals.com" in wf041
    assert "local-compose-only" in wf041
    assert "HTTP/SSE" in wf041
    assert "same" in wf041.lower() and "datasource" in wf041.lower()
    assert "public internet" in wf041.lower()
    assert by_id["PRD-010"]["status"] == "implement"
    assert "password" in by_id["PRD-010"]["title"].lower()
    prd010 = (OPS / "tickets" / "PRD-010.md").read_text()
    assert "Google SSO" in prd010 or "GIS" in prd010
    assert "No OIDC stub" in (OPS / "plans" / "PRD-010.md").read_text()
    assert "Observe lock C" in decisions or "test server" in decisions.lower()
    assert "username/password AND Google SSO" in decisions
    assert "Chaos lock C" in decisions
    assert "Security lock B" in decisions
    assert "retries and default fallbacks" in decisions
    assert "ZAP-style" in decisions
    assert "Alerts lock C" in decisions
    assert "Jenkins red" in decisions
    assert "Alertmanager" in decisions
    assert "light trickle" in decisions.lower()
    assert "not a merge-CI load test" in decisions
    assert "Catalog writes lock C" in decisions
    assert "POST /api/v1/places" in decisions
    assert "VisitIntent privacy" in decisions
    assert "anonymous counts only" in decisions
    assert "been count" in decisions
    assert "Public counts lock A" in decisions
    assert "Q&A is **closed**" in decisions or "Q&A is closed" in decisions
    assert "Want" in decisions and "never" in decisions.lower() and "private to the Guest" in decisions
    wf046 = (OPS / "tickets" / "WF-046.md").read_text() + (
        OPS / "plans" / "WF-046.md"
    ).read_text()
    assert "POST /api/v1/places" in wf046
    assert "seed/import" in wf046.lower()
    assert "VisitIntent" in wf046
    prd015 = (OPS / "tickets" / "PRD-015.md").read_text() + (
        OPS / "plans" / "PRD-015.md"
    ).read_text()
    assert "private" in prd015.lower()
    assert "been count" in prd015.lower()
    assert "Public counts lock A" in prd015
    assert "want" in prd015.lower() and "never" in prd015.lower()
    assert "PII" in prd015 or "pii" in prd015.lower()
    assert "no PII" in prd015 or "no pii" in prd015.lower()
    slice_privacy = (PRODUCT / "POI-VISITINTENT.md").read_text()
    assert "private" in slice_privacy.lower()
    assert "been count" in slice_privacy.lower()
    assert "Public counts lock A" in slice_privacy
    assert "private to the Guest" in slice_privacy
    wf042 = (OPS / "tickets" / "WF-042.md").read_text() + (
        OPS / "plans" / "WF-042.md"
    ).read_text()
    assert "light trickle" in wf042.lower()
    assert "not a merge-CI load test" in wf042
    assert "weekly" in wf042.lower()
    wf045 = (OPS / "tickets" / "WF-045.md").read_text() + (
        OPS / "plans" / "WF-045.md"
    ).read_text()
    assert "Jenkins red" in wf045
    assert "Alertmanager" in wf045
    assert "leftover" in wf045.lower()
    inc001 = (OPS / "tickets" / "INC-001.md").read_text()
    assert "WF-045" in inc001
    assert "muted" in inc001.lower()
    wf043 = (OPS / "tickets" / "WF-043.md").read_text() + (
        OPS / "plans" / "WF-043.md"
    ).read_text()
    assert "fishing-journals.com" in wf043
    assert "retries" in wf043.lower()
    assert "unit" in wf043 and "catalog" in wf043
    assert "required chaos lane" in wf043.lower()
    wf044 = (OPS / "tickets" / "WF-044.md").read_text() + (
        OPS / "plans" / "WF-044.md"
    ).read_text()
    assert "ZAP" in wf044
    assert "Testcontainers" in wf044
    assert "every merge" in wf044.lower()
    assert "fishing-journals.com" in wf044
    assert "not" in wf044.lower() and "primary" in wf044.lower()
    forbidden = ("BEGIN OPENSSH", "ghp_", "github_pat_", "-----BEGIN")
    for ident in (
        "WF-011",
        "WF-040",
        "WF-041",
        "WF-042",
        "WF-043",
        "WF-044",
        "WF-045",
        "WF-046",
        "PRD-015",
    ):
        blob = (OPS / "tickets" / f"{ident}.md").read_text() + (
            OPS / "plans" / f"{ident}.md"
        ).read_text()
        for needle in forbidden:
            assert needle not in blob, ident
        assert "MOCK_PROD_SSH_KEY" not in blob


def test_wf_040_unattended_mock_prod() -> None:
    by_id = {meta["id"]: meta for _, meta in next_ticket.tickets(OPS / "tickets")}
    meta = by_id["WF-040"]
    assert meta["type"] == "workflow"
    assert meta["owner"] == "automation-expert"
    assert meta["status"] == "review"
    assert "tickets/WF-032" in meta.get("parent", "")
    groovy = (REPO / "ops" / "jenkins" / "casc" / "jobs" / "deploy-mock-prod.groovy").read_text()
    assert "cron('H/5 * * * *')" in groovy
    assert "gate_mock_prod_deploy.py" in groovy
    assert "smoke_mock_prod.py" in groovy
    assert "production" in groovy.lower()
    deploy = (REPO / "scripts" / "deploy-mock-prod.sh").read_text()
    assert "WF-040" in deploy
    assert 'EXPECTED_BRANCH" != "main"' in deploy
    ci = (REPO / ".github" / "workflows" / "ci.yml").read_text()
    assert "mock-prod-signal" in ci
    assert "environment: production" not in ci
    pipeline = (OPS / "workflow" / "PIPELINE.md").read_text()
    assert "human click" not in pipeline.lower() or "no human" in pipeline.lower()
    assert "gate_mock_prod_deploy" in pipeline or "cron" in pipeline.lower()
    runbook = (OPS / "runbooks" / "MOCK_PROD_DEPLOY.md").read_text()
    assert "Agents never SSH" in runbook
    assert "human click" in runbook.lower() or "do not run this script" in runbook.lower()
    assert (RUNTIME / "scripts" / "gate_mock_prod_deploy.py").is_file()
    assert (RUNTIME / "scripts" / "smoke_mock_prod.py").is_file()
    jenkins = (OPS / "runbooks" / "JENKINS_LOCAL.md").read_text()
    assert "H/5" in jenkins or "cron" in jenkins.lower()
    assert "Agents never SSH" in jenkins

