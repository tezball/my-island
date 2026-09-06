---
id: WF-016
ticket: "[[tickets/WF-016]]"
role: implementer
started: 2026-09-06
finished: 2026-09-06
pr: https://github.com/tezball/my-island/pull/46
---

# Run WF-016

Hat: [[agents/roles/automation-expert]] implementer. Did not merge. Did not expand [[tickets/WF-004]] / [[tickets/WF-010]].

## What happened

Sole implementer for grants **and** Cloud Agent MCP docs (prior docs-only / split instructions cancelled).

- Plan [[plans/WF-016]] (`approved`).
- `ops_reader` SELECT-only on db `catalog` via `ops/observability/postgres-grant-catalog-reader.sql` (compose init `02` + `./scripts/dev up`). Not Flyway.
- `.cursor/mcp.json` adds `postgres-catalog` → db `catalog`. Grafana `--disable-write`.
- [[workflow/MCP]] documents dashboard **stdio** attach (cursor.com MCP dropdown / team Integrations). `.cursor/environment.json` cannot register MCP. HTTP PromQL is the equivalent until a human attaches stdio. Same in [[workflow/LOCAL]], [[workflow/STACK-E2E-place-stub]], `AGENTS.md`, [[runbooks/STACK_E2E_PLACE_STUB]].

This Cloud Agent toolbox still has no `grafana` / `postgres` namespaces (GitHub, Gmail, Calendar, Drive, cursor-cloud). Repo cannot attach them.

Cloud VM prove (compose already up; grants applied via SQL then `./scripts/dev up`):

- PromQL HTTP `up{job="catalog"}` → **1** (`127.0.0.1:9091/api/v1/query`). Grafana `/api/ds/query` status 200, value 1.
- `ops_reader` `SELECT` on `catalog.place` returned slug `skellig-michael`. `INSERT`/`UPDATE`/`DELETE` → permission denied. `mcp_ping` on db `ops` still works.
- `python3 -m pytest ops/tests -q -m "not stack"` → 63 passed.

## Result

success — PR #46. Ticket `review`. Human may merge.

## Follow-up

- Reviewer comments only; do not merge
- Human: add stdio `grafana` / `postgres` / `postgres-catalog` on cursor.com if Cloud Agents should get MCP tools, not only HTTP
