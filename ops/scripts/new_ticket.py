#!/usr/bin/env python3
"""Create the next ticket file from a template. Prints the new path."""
from __future__ import annotations

import argparse
import pathlib
import re
import sys

from board_sync import parse_frontmatter, root

PREFIXES = ("WF", "PRD", "INC")
TYPES = ("epic", "story", "bug", "incident", "workflow")
TEMPLATE_BY_TYPE = {
    "epic": "epic.md",
    "story": "story.md",
    "bug": "bug.md",
    "incident": "incident.md",
    "workflow": "ticket.md",
}
DEFAULT_PREFIX = {
    "incident": "INC",
    "workflow": "WF",
}


def next_id(tickets_dir: pathlib.Path, prefix: str) -> str:
    max_n = 0
    pat = re.compile(rf"^{re.escape(prefix)}-(\d+)$")
    for path in tickets_dir.glob("*.md"):
        if path.name.startswith("_"):
            continue
        meta = parse_frontmatter(path.read_text())
        ident = meta.get("id") or path.stem
        m = pat.match(ident)
        if m:
            max_n = max(max_n, int(m.group(1)))
    return f"{prefix}-{max_n + 1:03d}"


def _set_key(text: str, key: str, value: str) -> str:
    if not value:
        return text
    quoted = value if value.startswith(("'", '"', "[")) else value
    return re.sub(rf"^{key}:.*$", f"{key}: {quoted}", text, count=1, flags=re.M)


def render(
    template: str,
    *,
    ident: str,
    title: str,
    typ: str,
    owner: str,
    area: str,
    priority: str,
    parent: str,
) -> str:
    text = template
    for placeholder in ("WF-XXX", "PRD-XXX", "INC-XXX"):
        text = text.replace(placeholder, ident)
    text = _set_key(text, "id", ident)
    text = _set_key(text, "title", title)
    text = _set_key(text, "type", typ)
    text = _set_key(text, "owner", owner)
    text = _set_key(text, "area", area)
    text = _set_key(text, "priority", priority)
    if parent:
        text = _set_key(text, "parent", f'"[[tickets/{parent}]]"')
    text = text.replace("{{title}}", title)
    # First markdown H1
    text = re.sub(r"^# .*$", f"# {ident} — {title}", text, count=1, flags=re.M)
    return text


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--prefix", choices=PREFIXES)
    parser.add_argument("--type", dest="typ", choices=TYPES, default="story")
    parser.add_argument("--title", required=True)
    parser.add_argument("--owner", default="")
    parser.add_argument("--area", default="")
    parser.add_argument("--priority", default="P2", choices=("P0", "P1", "P2", "P3"))
    parser.add_argument("--parent", default="")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    prefix = args.prefix or DEFAULT_PREFIX.get(args.typ, "PRD")
    ops = root()
    tickets_dir = ops / "tickets"
    ident = next_id(tickets_dir, prefix)
    template = (ops / "templates" / TEMPLATE_BY_TYPE[args.typ]).read_text()
    body = render(
        template,
        ident=ident,
        title=args.title,
        typ=args.typ,
        owner=args.owner,
        area=args.area,
        priority=args.priority,
        parent=args.parent,
    )
    dest = tickets_dir / f"{ident}.md"
    if dest.exists():
        print(f"refusing to overwrite {dest}", file=sys.stderr)
        return 1
    if args.dry_run:
        sys.stdout.write(f"{dest}\n")
        sys.stdout.write(body)
        return 0
    dest.write_text(body)
    print(dest)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
