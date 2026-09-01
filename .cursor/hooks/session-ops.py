#!/usr/bin/env python3
"""sessionStart: point the agent at the ops vault, not the product MVP."""
from __future__ import annotations

import json
import sys

CONTEXT = """This repo’s current mandate is the ops agent loop, not the product MVP.
Read ops/HOME.md and ops/BOARD.md. Follow ops/workflow/LOOP.md.
One ticket per session. Do not merge PRs. Do not deploy prod.
Grafana/Postgres MCP is read-only. Ticket prefix WF- = workflow; PRD- = product (none until assigned).
python3 ops/scripts/next_ticket.py --role auto
"""


def main() -> None:
    sys.stdin.read()
    json.dump({"additional_context": CONTEXT.strip()}, sys.stdout)


if __name__ == "__main__":
    main()
