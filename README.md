# my-island — company OS

**Start here: [`docs/HOME.md`](docs/HOME.md)** — company dashboard (current-work snapshot). Company OS hub: [`docs/ops/HOME.md`](docs/ops/HOME.md). Agent instructions: [`docs/AGENTS.md`](docs/AGENTS.md).

This repository is the **operating system for an AI-operated company**: Obsidian vault, tickets, agent org, runbooks, CI, and automation skills. Grok Bot + Cursor agents run from here.

**Owner:** Terry ([tezball](https://github.com/tezball)).

**Application code is disposable scaffolding.** Do not polish, preserve, or refactor the current/legacy app for its own sake. It will be replaced as workflows develop. History: [`docs/leads/`](docs/leads/CAMPSITE_LEADS.md), [`docs/automation/`](docs/automation/OBSERVABILITY_MCP_OPTIONS.md), git tag `legacy-platform`. Details: [`docs/ops/company/SCAFFOLDING.md`](docs/ops/company/SCAFFOLDING.md).

## Open the company vault (Obsidian)

The vault is **`docs/`** only. Do not open `ops/` or the repo root as the vault.

1. Install [Obsidian](https://obsidian.md).
2. Open vault → Open folder as vault → select **`docs/`**.
3. Community plugins: turn off Restricted mode, install [`docs/ops/PLUGINS.md`](docs/ops/PLUGINS.md) (Kanban, Dataview, Tasks, Calendar, Templater; Homepage optional → `HOME.md`). Plugin binaries are not committed.
4. Start at [`docs/HOME.md`](docs/HOME.md) (dashboard) then [`docs/ops/HOME.md`](docs/ops/HOME.md) and [`docs/ops/BOARD.md`](docs/ops/BOARD.md).

Wikilinks are vault-relative (`docs/`): `[[ops/tickets/WF-001]]`, `[[product/STACK]]`. Dataview: `FROM "ops/tickets"`.

Tickets use YAML `status`. After a change: `python3 ops/scripts/board_sync.py`. Do not hand-edit `BOARD.md`.

## Layout

| Path | What |
|---|---|
| [`docs/HOME.md`](docs/HOME.md) | **Company dashboard** — snapshot + links |
| [`docs/ops/`](docs/ops/HOME.md) | **Company OS** notes: charter, agents, runbooks, tickets |
| [`docs/product/`](docs/product/README.md) | Product canon, **signed** 2026-09-05 ([`SIGNED.md`](docs/product/SIGNED.md), [`MILESTONES.md`](docs/product/MILESTONES.md)). Implement only on `PRD-*` + `implement` |
| [`docs/data/leads/`](docs/data/leads/README.md) | Research leads notes (JSON store stays in `data/leads/`) |
| [`docs/leads/`](docs/leads/CAMPSITE_LEADS.md) · [`docs/automation/`](docs/automation/OBSERVABILITY_MCP_OPTIONS.md) | Historical booking platform — not requirements, not a migration source |
| [`ops/scripts/`](ops/scripts) · [`ops/tests/`](ops/tests) · [`ops/observability/`](ops/observability) | CI/runtime (Python, SQL, compose sidecars) — not the vault |
| [`data/leads/`](data/leads) | Leads `schema.json` / `places.jsonl` |
| [`compose.yml`](compose.yml) + [`scripts/`](scripts/) | Local Postgres/PostGIS + Grafana + catalog API for agents |
| [`services/catalog/`](services/catalog) | Spring Boot place catalog stub ([`PRD-001`](docs/ops/tickets/PRD-001.md)) |
| `.github/` + `.cursor/skills/` | CI and agent skills (Automation Expert) |
| git tag `legacy-platform` | Old app dump. Disposable. |

Keep consumer UI and marketplace stubs **absent**. The first API stub is [`services/catalog/`](services/catalog) on [`PRD-001`](docs/ops/tickets/PRD-001.md).

## Agent rules (short)

One ticket per session (skip `type: epic`). Humans merge; agents open PRs and comment. Product code only on `PRD-*` with `status: implement`. Full list: [`docs/AGENTS.md`](docs/AGENTS.md).

## What we automate

1. Read [`docs/ops/HOME.md`](docs/ops/HOME.md), [`docs/ops/workflow/SAFETY.md`](docs/ops/workflow/SAFETY.md), [`docs/ops/agents/_index.md`](docs/ops/agents/_index.md).
2. `python3 ops/scripts/next_ticket.py --role auto` — one role, one ticket. Epics skipped.
3. Planner → plan. Implementer → PR. Reviewer → comment. **Humans merge.**
4. Skills/routines: [`docs/ops/workflow/SKILLS.md`](docs/ops/workflow/SKILLS.md). CI: [`docs/ops/workflow/CI.md`](docs/ops/workflow/CI.md).
5. Grok vs Cursor: [`docs/ops/agents/GROK_VS_CURSOR.md`](docs/ops/agents/GROK_VS_CURSOR.md). **Automation Expert:** [`docs/ops/agents/roles/automation-expert.md`](docs/ops/agents/roles/automation-expert.md).

New ticket: `python3 ops/scripts/new_ticket.py --prefix WF --type workflow --title "…"`.

Product direction (Ireland stays: campsites, B&Bs, experiences) is **signed** 2026-09-05 — [`docs/product/SIGNED.md`](docs/product/SIGNED.md). Marketplace epic (gated): [`docs/ops/tickets/PRD-004.md`](docs/ops/tickets/PRD-004.md). Do not implement it on this workflow mandate.

## Run (laptop, Dev Container, Cloud Agent, CI)

```bash
git clone https://github.com/tezball/my-island.git
cd my-island
./scripts/app start   # PostGIS + Grafana/Loki/Prometheus/Alertmanager + catalog API
./scripts/app test    # PASS/FAIL: pytest + catalog mvn + HTTP smoke
```

Same stack: `./scripts/dev up` / `test` / `down` (CI and agents). Open in Cursor / VS Code and **Reopen in Container**. Details: [`docs/ops/workflow/LOCAL.md`](docs/ops/workflow/LOCAL.md).

Grafana: http://127.0.0.1:3030 (`admin` / `admin`). Postgres: `127.0.0.1:5433` · `ops_reader` / `ops_reader` · db `ops`. Catalog: http://127.0.0.1:8081. Repeatable create→list→get: `./scripts/sim-place-listing.sh` after `./scripts/dev up`.

## Status

Company OS + agent loop is the work. **No consumer application to protect.**

Product canon is **signed** 2026-09-05 — [`docs/product/SIGNED.md`](docs/product/SIGNED.md). Signed house for *later* product work: Java / Spring Boot, Vite+React PWA (not Next), PostgreSQL 17 + PostGIS, Grafana MCP — [`docs/product/STACK.md`](docs/product/STACK.md). Do not start that skeleton unless a `PRD-*` ticket is `implement`. CEO locks: [`docs/ops/company/DECISIONS.md`](docs/ops/company/DECISIONS.md).
