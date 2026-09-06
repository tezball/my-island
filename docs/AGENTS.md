# Agent instructions

This repository is the **company OS**. Mandate: **fully automated agent workflows**, not the consumer app.

Company dashboard: `docs/HOME.md`. Obsidian vault: **`docs/`** only.

1. Read `docs/ops/HOME.md`, `docs/ops/CHARTER.md`, `docs/ops/company/SCAFFOLDING.md`, and `docs/ops/BOARD.md`.
2. Follow `docs/ops/workflow/LOOP.md`, `docs/ops/workflow/SAFETY.md`, `docs/ops/workflow/CI.md`, `docs/ops/runbooks/TICKET_LOOP.md`.
3. Use the `ops-loop` skill. For CI/skills/DX use the `automation` skill. Wear one hat from `docs/ops/agents/_index.md`.
4. Work **one ticket** (skip `type: epic`). Update `status`. Run `python3 ops/scripts/board_sync.py`.
5. Do not implement product features unless the ticket id is `PRD-*` and status is `implement`.
6. Do not polish, preserve, or refactor application code for its own sake. It is disposable scaffolding.
7. Do not merge PRs. Do not deploy production. Grafana and Postgres MCP are read-only.

Product canon (read-only until `PRD-*` + `implement`): `docs/product/`. House stack (CEO 2026-09-05): **Java / Spring Boot**, **Vite + React PWA** (not Next.js), **PostgreSQL 17 + PostGIS**, Flyway, Grafana OSS MCP — `docs/product/STACK.md`. Historical app: `docs/leads/`, `docs/automation/`, and tag `legacy-platform` — not a migration source. Open **`docs/`** in Obsidian (not repo root, not `ops/`). Do not recommend FastAPI, Neon, or Vercel as defaults.

Living markdown lives under `docs/` except root `README.md`. CI Python/SQL/compose stay in `ops/scripts`, `ops/tests`, `ops/observability`.

Local MCP: `./scripts/dev up` then reload MCP. Details: `docs/ops/workflow/LOCAL.md`.

## Start and test

```bash
./scripts/dev up
./scripts/dev test
```

“The app” today is the **ops stack** plus the PRD-001 catalog stub. Do not add a marketplace skeleton on a `WF-*` ticket.

## Cursor Cloud specific instructions

`.cursor/environment.json` builds a VM with Docker-in-Docker. `start` runs `./scripts/dev up` (PostGIS, Grafana stack, catalog API). After boot:

- Grafana: http://127.0.0.1:3030 (`admin` / `admin`)
- Prometheus: http://127.0.0.1:9091 (PromQL fallback: `up{job="catalog"}`)
- Postgres: `127.0.0.1:5433` · `ops_reader` / `ops_reader` · db `ops`
- Catalog: http://127.0.0.1:8081
- Tests: `./scripts/dev test` (ops pytest) and `services/catalog/mvnw test`

**MCP:** laptop `.cursor/mcp.json` (`grafana --disable-write`, `postgres` → db `ops`) does **not** attach to Cloud Agent runs. `environment.json` cannot register MCP. A human adds the same servers as **stdio** on cursor.com/agents (MCP dropdown) or Dashboard → Integrations & MCP so they run in this VM against loopback. Do not use HTTP MCP pointed at `127.0.0.1` (proxied off-VM). Until then, curl Prometheus/Grafana — `docs/ops/workflow/MCP.md` and `docs/ops/runbooks/STACK_E2E_PLACE_STUB.md`. Catalog `place` SELECT for `ops_reader` is TODO Engineering (no grants PR yet).

Do not merge PRs. Do not deploy production.
