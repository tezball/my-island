# docs/ — Obsidian vault

Open **this folder** as the Obsidian vault. Living company notes and product canon live here. Root `README.md` is the only living markdown outside `docs/`.

| Path | What |
|---|---|
| [`HOME.md`](HOME.md) | Company dashboard |
| [`AGENTS.md`](AGENTS.md) | Agent instructions |
| [`ops/`](ops/HOME.md) | Company OS — tickets, board, runbooks, agents |
| [`product/`](product/README.md) | Product canon (signed 2026-09-05) |
| [`data/leads/`](data/leads/README.md) | Research leads notes (JSONL stays in repo `data/leads/`) |
| [`leads/`](leads/CAMPSITE_LEADS.md) · [`automation/`](automation/OBSERVABILITY_MCP_OPTIONS.md) | **History** of the booking platform — not requirements, not a migration source |

> **History fence (CEO 2026-09-05).** Do not implement from `leads/`, `automation/`, or git tag `legacy-platform`. Canon is [`product/`](product/README.md). Company OS is [`ops/`](ops/HOME.md).

Workshop spine lives in `services/catalog`, root `compose.yml`, and `ops/` runtime (scripts/tests/observability). Implementable marketplace / booking / UI / domain trees were removed.

Dataview: `FROM "ops/tickets"`. Wikilinks: `[[ops/BOARD]]`, `[[product/STACK]]`.
