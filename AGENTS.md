# Agent instructions

This repository’s **current work is the agent operations loop**, not the consumer MVP.

1. Read `ops/HOME.md` and `ops/BOARD.md`.
2. Follow `ops/workflow/LOOP.md` and `ops/workflow/SAFETY.md`.
3. Use the `ops-loop` skill for plan / implement / review.
4. Work **one ticket**. Update frontmatter `status`. Run `python3 ops/scripts/board_sync.py`.
5. Do not implement product features unless the ticket id is `PRD-*` and status is `implement`.
6. Do not merge PRs. Do not deploy production. Grafana and Postgres MCP are read-only.

Product canon (read-only until a PRD ticket): `product/`. Historical booking platform: `docs/` — not requirements.

Local MCP: `./scripts/dev up` (or `./ops/scripts/start-local.sh`) then reload MCP. Details: `ops/workflow/LOCAL.md`.

## Start and test

One Compose file (`compose.yml`) is the runtime for git-clone, Dev Containers, Cloud Agents, and GitHub Actions.

```bash
./scripts/dev up
./scripts/dev test
```

There is no consumer API yet. “The app” is the ops stack. Do not implement product features unless the ticket id is `PRD-*` and status is `implement`.

## Cursor Cloud specific instructions

`.cursor/environment.json` builds a VM with Docker-in-Docker. `start` runs `docker compose up` for Postgres and Grafana. After boot:

- Grafana: http://127.0.0.1:3030 (`admin` / `admin`)
- Postgres: `127.0.0.1:5433` · `ops_reader` / `ops_reader` · db `ops`
- Tests: `./scripts/dev test`

Do not merge PRs. Do not deploy production.
