# my-island — company OS

This repository is the **operating system for an AI-operated company**: Obsidian vault, tickets, agent org, runbooks, CI, and automation skills. Grok Bot + Cursor agents run from here.

**Owner:** Terry ([tezball](https://github.com/tezball)).

**Application code is disposable scaffolding.** Do not polish, preserve, or refactor the current/legacy app for its own sake. It will be replaced as workflows develop. History: [`docs/`](docs/README.md), git tag `legacy-platform`. Details: [`ops/company/SCAFFOLDING.md`](ops/company/SCAFFOLDING.md).

## Open the company vault (Obsidian)

The vault is **`ops/`**, not the repo root and not `docs/`.

1. Install [Obsidian](https://obsidian.md).
2. Open vault → Open folder as vault → select `ops/`.
3. Community plugins: turn off Restricted mode, install [`ops/PLUGINS.md`](ops/PLUGINS.md) (Kanban, Dataview, Tasks, Calendar, Templater). Plugin binaries are not committed.
4. Start at [`ops/HOME.md`](ops/HOME.md) and [`ops/BOARD.md`](ops/BOARD.md).

Tickets use YAML `status`. After a change: `python3 ops/scripts/board_sync.py`. Do not hand-edit `BOARD.md`.

## Layout

| Path | What |
|---|---|
| [`ops/`](ops/HOME.md) | **Company OS** (Obsidian): charter, agents, runbooks, tickets, CI/skills docs |
| [`product/`](product/README.md) | Product canon, **signed** 2026-09-05 ([`SIGNED.md`](product/SIGNED.md)). Implement only on `PRD-*` + `implement` |
| [`data/leads/`](data/leads/README.md) | Research place leads (not the published catalog) |
| [`docs/`](docs/README.md) | Historical booking platform — not requirements, not a migration source |
| [`compose.yml`](compose.yml) + [`scripts/`](scripts/) | Local Postgres + Grafana **ops** stack for agents |
| `.github/` + `.cursor/skills/` | CI and agent skills (Automation Expert) |
| git tag `legacy-platform` | Old app dump. Disposable. |

Keep app stubs **minimal or absent**. Empty tree beats a fake marketplace.

## What we automate

1. Read [`ops/HOME.md`](ops/HOME.md), [`ops/workflow/SAFETY.md`](ops/workflow/SAFETY.md), [`ops/agents/_index.md`](ops/agents/_index.md).
2. `python3 ops/scripts/next_ticket.py --role auto` — one role, one ticket. Epics skipped.
3. Planner → plan. Implementer → PR. Reviewer → comment. **Humans merge.**
4. Skills/routines: [`ops/workflow/SKILLS.md`](ops/workflow/SKILLS.md). CI: [`ops/workflow/CI.md`](ops/workflow/CI.md).
5. Grok vs Cursor: [`ops/agents/GROK_VS_CURSOR.md`](ops/agents/GROK_VS_CURSOR.md). **Automation Expert:** [`ops/agents/roles/automation-expert.md`](ops/agents/roles/automation-expert.md).

New ticket: `python3 ops/scripts/new_ticket.py --prefix WF --type workflow --title "…"`.

Product direction (Ireland stays: campsites, B&Bs, experiences) is **signed** 2026-09-05 — [`product/SIGNED.md`](product/SIGNED.md). Marketplace epic (gated): [`ops/tickets/PRD-004.md`](ops/tickets/PRD-004.md). Do not implement it on this workflow mandate.

## Run (laptop, Dev Container, Cloud Agent, CI)

```bash
git clone https://github.com/tezball/my-island.git
cd my-island
./scripts/dev up      # Postgres + Grafana/Loki/Prometheus/Alertmanager
./scripts/dev test    # same pytest CI runs (ops stack, not a consumer app)
```

Open in Cursor / VS Code and **Reopen in Container**. Details: [`ops/workflow/LOCAL.md`](ops/workflow/LOCAL.md).

Grafana: http://127.0.0.1:3030 (`admin` / `admin`). Postgres: `127.0.0.1:5433` · `ops_reader` / `ops_reader` · db `ops`.

## Status

Company OS + agent loop is the work. **No consumer application to protect.**

Product canon is **signed** 2026-09-05 — [`product/SIGNED.md`](product/SIGNED.md). Signed house for *later* product work: Java / Spring Boot, Vite+React PWA (not Next), PostgreSQL 17 + PostGIS, Grafana MCP — [`product/STACK.md`](product/STACK.md). Do not start that skeleton unless a `PRD-*` ticket is `implement`. CEO locks: [`ops/company/DECISIONS.md`](ops/company/DECISIONS.md).
