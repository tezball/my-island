from __future__ import annotations

from pathlib import Path

import new_ticket


def test_next_id_uses_max_plus_one(tmp_path: Path) -> None:
    tickets = tmp_path / "tickets"
    tickets.mkdir()
    (tickets / "PRD-000.md").write_text("---\nid: PRD-000\n---\n")
    (tickets / "PRD-003.md").write_text("---\nid: PRD-003\n---\n")
    (tickets / "_index.md").write_text("# skip\n")
    assert new_ticket.next_id(tickets, "PRD") == "PRD-004"
    assert new_ticket.next_id(tickets, "INC") == "INC-001"


def test_render_fills_frontmatter_and_heading() -> None:
    template = (Path(__file__).resolve().parents[1] / "templates" / "story.md").read_text()
    body = new_ticket.render(
        template,
        ident="PRD-009",
        title="Add county filter",
        typ="story",
        owner="eng-frontend",
        area="explore",
        priority="P1",
        parent="PRD-000",
    )
    meta = __import__("board_sync").parse_frontmatter(body)
    assert meta["id"] == "PRD-009"
    assert meta["title"] == "Add county filter"
    assert meta["type"] == "story"
    assert meta["owner"] == "eng-frontend"
    assert meta["area"] == "explore"
    assert meta["priority"] == "P1"
    assert "tickets/PRD-000" in meta["parent"]
    assert "# PRD-009 — Add county filter" in body


def test_dry_run_does_not_write(tmp_path: Path, monkeypatch, capsys) -> None:
    monkeypatch.setenv("OPS_ROOT", str(tmp_path))
    (tmp_path / "tickets").mkdir()
    (tmp_path / "templates").mkdir()
    (tmp_path / "templates" / "story.md").write_text(
        Path(__file__).resolve().parents[1].joinpath("templates/story.md").read_text()
    )
    monkeypatch.setattr(
        "sys.argv",
        ["new_ticket.py", "--prefix", "PRD", "--type", "story", "--title", "Hello", "--dry-run"],
    )
    assert new_ticket.main() == 0
    assert list((tmp_path / "tickets").glob("*.md")) == []
    out = capsys.readouterr().out
    assert "PRD-001" in out
