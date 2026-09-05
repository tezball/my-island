# my-island — company OS

This repository is **everything the company needs to function**: product canon, the agent-operated handbook, tickets, and the local ops runtime. It is not an empty app repo and not a second copy of the old camping marketplace.

**Owner:** Terry ([tezball](https://github.com/tezball)). **Operators:** Grok Bot teammates (coordination/ops) and Cursor agents (changes in this git repo).

## Open the company vault (Obsidian)

The vault is **`ops/`**, not the repo root and not `docs/`.

1. Install [Obsidian](https://obsidian.md).
2. Open vault → Open folder as vault → select `ops/`.
3. Community plugins: turn off Restricted mode, install the list in [`ops/PLUGINS.md`](ops/PLUGINS.md) (Kanban, Dataview, Tasks, Calendar, Templater). Plugin binaries are not committed.
4. Start at [`ops/HOME.md`](ops/HOME.md) and [`ops/BOARD.md`](ops/BOARD.md).

Tickets live in markdown with YAML `status`. After you change a ticket, run `python3 ops/scripts/board_sync.py`. Do not hand-edit `BOARD.md`.

## Layout

| Path | What |
|---|---|
| [`ops/`](ops/HOME.md) | **Company OS** (Obsidian): charter, agents, runbooks, tickets, plans, dailies |
| [`product/`](product/README.md) | Living product canon (directory MVP → gated marketplace) |
| [`docs/`](docs/README.md) | **History** — previous camping/glamping booking platform. Not requirements |
| [`compose.yml`](compose.yml) + [`scripts/`](scripts/) | Local Postgres + Grafana stack for agents |
| git tag `legacy-platform` | Full previous application codebase |

Nothing valuable was deleted for this OS. `docs/` and `product/` stay put. `ops/` is the expanded vault (it already existed as the work tracker).

## What we are building

Long-term: an Ireland stays marketplace (campsites, B&Bs, experiences) — search/book/message for guests; listing/calendar/pricing for hosts; trust, reviews, cancellations, GDPR.

**Release 1** is a checkable directory, not booking. Canon: [`product/BRIEFING.md`](product/BRIEFING.md), [`product/VISION.md`](product/VISION.md), [`product/MVP.md`](product/MVP.md). Marketplace epic (gated): [`ops/tickets/PRD-004.md`](ops/tickets/PRD-004.md). Do not implement product code unless a `PRD-*` ticket is `implement`.

## How agents work

1. Read [`ops/HOME.md`](ops/HOME.md), [`ops/workflow/SAFETY.md`](ops/workflow/SAFETY.md), [`ops/agents/_index.md`](ops/agents/_index.md).
2. `python3 ops/scripts/next_ticket.py --role auto` — one role, one ticket. Epics are skipped.
3. Planner → plan. Implementer → PR. Reviewer → comment. **Humans merge.**
4. Grok vs Cursor: [`ops/agents/GROK_VS_CURSOR.md`](ops/agents/GROK_VS_CURSOR.md).

New ticket: `python3 ops/scripts/new_ticket.py --prefix PRD --type story --title "…"`.

## Run (laptop, Dev Container, Cloud Agent, CI)

```bash
git clone https://github.com/tezball/my-island.git
cd my-island
./scripts/dev up      # Postgres + Grafana/Loki/Prometheus/Alertmanager
./scripts/dev test    # same pytest CI runs
```

Open the folder in Cursor / VS Code and **Reopen in Container** to attach to the `workspace` service in [`compose.yml`](compose.yml). Details: [`ops/workflow/LOCAL.md`](ops/workflow/LOCAL.md).

Grafana: http://127.0.0.1:3030 (`admin` / `admin`). Postgres: `127.0.0.1:5433` · `ops_reader` / `ops_reader` · db `ops`.

## Status

Company OS is in `ops/`. Product definition is in `product/`, awaiting sign-off. **No consumer application code yet.** Backend house is **Java / Spring**. Logs/metrics/alerts via MCP, OSS first — [`product/STACK.md`](product/STACK.md).
