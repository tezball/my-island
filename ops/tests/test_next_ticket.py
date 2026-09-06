from __future__ import annotations

from pathlib import Path

import next_ticket


def _ticket(
    dir: Path, ident: str, status: str, priority: str = "P1", typ: str = "story"
) -> None:
    (dir / f"{ident}.md").write_text(
        f"---\nid: {ident}\ntitle: {ident} title\nstatus: {status}\n"
        f"priority: {priority}\ntype: {typ}\n---\n"
    )


def test_pick_planner_then_priority(tmp_path: Path) -> None:
    tickets = tmp_path / "tickets"
    tickets.mkdir()
    _ticket(tickets, "WF-002", "ready", "P1")
    _ticket(tickets, "WF-001", "ready", "P0")
    _ticket(tickets, "WF-003", "implement", "P0")
    rows = next_ticket.tickets(tickets)
    path, meta = next_ticket.pick("planner", rows)
    assert meta["id"] == "WF-001"
    path, meta = next_ticket.pick("implementer", rows)
    assert meta["id"] == "WF-003"
    assert next_ticket.pick("reviewer", rows) is None


def test_pick_skips_epics(tmp_path: Path) -> None:
    tickets = tmp_path / "tickets"
    tickets.mkdir()
    _ticket(tickets, "WF-000", "implement", "P0", typ="epic")
    _ticket(tickets, "WF-001", "implement", "P1", typ="workflow")
    rows = next_ticket.tickets(tickets)
    path, meta = next_ticket.pick("implementer", rows)
    assert meta["id"] == "WF-001"


def test_auto_prefers_planner(tmp_path: Path, monkeypatch, capsys) -> None:
    tickets = tmp_path / "tickets"
    tickets.mkdir()
    _ticket(tickets, "WF-020", "ready", "P2")
    _ticket(tickets, "WF-021", "implement", "P0")
    monkeypatch.setenv("OPS_ROOT", str(tmp_path))
    monkeypatch.setattr("sys.argv", ["next_ticket.py", "--role", "auto"])
    assert next_ticket.main() == 0
    out = capsys.readouterr().out
    assert "role=planner" in out
    assert "id=WF-020" in out
