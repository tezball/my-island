#!/usr/bin/env python3
"""Print the next ticket for a role. Default: planner then implementer."""
from __future__ import annotations

import argparse
import os
import pathlib
import sys

PRIORITY_RANK = {"P0": 0, "P1": 1, "P2": 2, "P3": 3}


def root() -> pathlib.Path:
    env = os.environ.get("OPS_ROOT")
    if env:
        return pathlib.Path(env)
    return pathlib.Path(__file__).resolve().parents[1]


def parse_frontmatter(text: str) -> dict[str, str]:
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    data: dict[str, str] = {}
    for line in text[4:end].splitlines():
        if ":" not in line:
            continue
        key, val = line.split(":", 1)
        data[key.strip()] = val.strip().strip('"').strip("'")
    return data


def tickets(
    tickets_dir: pathlib.Path | None = None,
) -> list[tuple[pathlib.Path, dict[str, str]]]:
    tickets_dir = tickets_dir or (root() / "tickets")
    rows = []
    for path in tickets_dir.glob("*.md"):
        if path.name.startswith("_"):
            continue
        meta = parse_frontmatter(path.read_text())
        if meta.get("id"):
            rows.append((path, meta))
    rows.sort(
        key=lambda r: (PRIORITY_RANK.get(r[1].get("priority", "P2"), 9), r[1]["id"])
    )
    return rows


def pick(
    role: str,
    rows: list[tuple[pathlib.Path, dict[str, str]]] | None = None,
) -> tuple[pathlib.Path, dict[str, str]] | None:
    want = {
        "planner": "ready",
        "implementer": "implement",
        "reviewer": "review",
    }[role]
    for path, meta in rows if rows is not None else tickets():
        if meta.get("type") == "epic":
            continue
        if meta.get("status") == want:
            return path, meta
    return None


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--role",
        choices=("planner", "implementer", "reviewer", "auto"),
        default="auto",
    )
    args = parser.parse_args()
    order = (
        ["planner", "implementer", "reviewer"]
        if args.role == "auto"
        else [args.role]
    )
    rows = tickets()
    for role in order:
        hit = pick(role, rows)
        if hit:
            path, meta = hit
            print(f"role={role}")
            print(f"id={meta['id']}")
            print(f"status={meta.get('status')}")
            print(f"priority={meta.get('priority')}")
            print(f"title={meta.get('title')}")
            print(f"path={path}")
            return 0
    print("no ticket", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
