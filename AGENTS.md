# Agent instructions

This repository’s **current work is the agent operations loop**, not the consumer MVP.

1. Read `ops/HOME.md` and `ops/BOARD.md`.
2. Follow `ops/workflow/LOOP.md` and `ops/workflow/SAFETY.md`.
3. Use the `ops-loop` skill for plan / implement / review.
4. Work **one ticket**. Update frontmatter `status`. Run `python3 ops/scripts/board_sync.py`.
5. Do not implement product features unless the ticket id is `PRD-*` and status is `implement`.
6. Do not merge PRs. Do not deploy production. Grafana and Postgres MCP are read-only.

Product canon (read-only until a PRD ticket): `product/`. Historical booking platform: `docs/` — not requirements.

Local MCP: `./ops/scripts/start-local.sh` then reload MCP. Details: `ops/workflow/LOCAL.md`.
