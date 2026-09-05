from __future__ import annotations

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


def test_prd_tickets_are_not_implement() -> None:
    hot = [
        meta["id"]
        for _, meta in next_ticket.tickets(OPS / "tickets")
        if meta["id"].startswith("PRD-") and meta.get("status") == "implement"
    ]
    assert hot == []


def test_starter_prd_tickets_exist() -> None:
    ids = {meta["id"] for _, meta in next_ticket.tickets(OPS / "tickets")}
    for ident in ("PRD-000", "PRD-001", "PRD-002", "PRD-003", "PRD-004"):
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
