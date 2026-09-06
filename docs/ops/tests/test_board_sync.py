from __future__ import annotations

from pathlib import Path

import board_sync


def test_parse_frontmatter_skips_bad_input() -> None:
    assert board_sync.parse_frontmatter("") == {}
    assert board_sync.parse_frontmatter("---\nno-end") == {}


def test_parse_frontmatter_reads_yaml_like_keys() -> None:
    meta = board_sync.parse_frontmatter(
        "---\nid: WF-100\ntitle: Hello world\nstatus: ready\n---\n\n# Hello\n"
    )
    assert meta["id"] == "WF-100"
    assert meta["title"] == "Hello world"
    assert meta["status"] == "ready"


def test_render_board_groups_and_sorts(tmp_path: Path) -> None:
    tickets = tmp_path / "tickets"
    tickets.mkdir()
    (tickets / "WF-002.md").write_text(
        "---\nid: WF-002\ntitle: Later\nstatus: ready\npriority: P1\n---\n"
    )
    (tickets / "WF-001.md").write_text(
        "---\nid: WF-001\ntitle: First\nstatus: ready\npriority: P0\n---\n"
    )
    (tickets / "_skip.md").write_text("---\nid: WF-999\n---\n")
    (tickets / "no-id.md").write_text("---\ntitle: nope\n---\n")

    rendered = board_sync.render_board(board_sync.load_tickets(tickets))
    ready = rendered.split("## Ready", 1)[1].split("## Plan", 1)[0]
    assert "WF-001" in ready
    assert "WF-002" in ready
    assert ready.index("WF-001") < ready.index("WF-002")
    assert "WF-999" not in rendered


def test_write_board_roundtrip(tmp_path: Path) -> None:
    tickets = tmp_path / "tickets"
    tickets.mkdir()
    (tickets / "WF-010.md").write_text(
        "---\nid: WF-010\ntitle: Sync me\nstatus: implement\npriority: P0\n---\n"
    )
    board = board_sync.write_board(tmp_path)
    text = board.read_text()
    assert "WF-010" in text
    assert "Sync me" in text
    assert text == board_sync.render_board(board_sync.load_tickets(tickets))


def test_committed_board_matches_tickets() -> None:
    ops = Path(__file__).resolve().parents[1]
    expected = board_sync.render_board(board_sync.load_tickets(ops / "tickets"))
    assert (ops / "BOARD.md").read_text() == expected
