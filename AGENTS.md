# Agent instructions

This repository is the **company OS**. Mandate: **fully automated agent workflows**, not the consumer app.

1. Read `ops/HOME.md`, `ops/CHARTER.md`, `ops/company/SCAFFOLDING.md`, and `ops/BOARD.md`.
2. Follow `ops/workflow/LOOP.md`, `ops/workflow/SAFETY.md`, `ops/workflow/CI.md`, `ops/runbooks/TICKET_LOOP.md`.
3. Use the `ops-loop` skill. For CI/skills/DX use the `automation` skill. Wear one hat from `ops/agents/_index.md`.
4. Work **one ticket** (skip `type: epic`). Update `status`. Run `python3 ops/scripts/board_sync.py`.
5. Do not implement product features unless the ticket id is `PRD-*` and status is `implement`.
6. Do not polish, preserve, or refactor application code for its own sake. It is disposable scaffolding.
7. Do not merge PRs. Do not deploy production. Grafana and Postgres MCP are read-only.

Product canon (read-only until `PRD-*` + `implement`): `product/`. Historical app: `docs/` and tag `legacy-platform` — not a migration source. Open **`ops/`** in Obsidian, not `docs/`.

Local MCP: `./scripts/dev up` then reload MCP. Details: `ops/workflow/LOCAL.md`.

## Start and test

```bash
./scripts/dev up
./scripts/dev test
```

“The app” today is the **ops stack**. Keep consumer stubs minimal. Do not add a marketplace skeleton on a `WF-*` ticket.

## Cursor Cloud specific instructions

`.cursor/environment.json` builds a VM with Docker-in-Docker. `start` runs `docker compose up` for Postgres and Grafana. After boot:

- Grafana: http://127.0.0.1:3030 (`admin` / `admin`)
- Postgres: `127.0.0.1:5433` · `ops_reader` / `ops_reader` · db `ops`
- Tests: `./scripts/dev test`

Do not merge PRs. Do not deploy production.
