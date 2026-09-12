---
title: Company home
type: dashboard
owner: Product
created: 2026-09-06
updated: 2026-09-12
cssclasses:
  - dashboard
---

# Company home

Phone-first **Ireland directory** MVP plus a **company OS** in this vault. Public product name is **OPEN**.

Canon: [[product/SIGNED]] · [[product/README]] · [[product/MILESTONES]] · [[product/STACK]]. OS: [[ops/HOME]]. Design: [[ops/company/VAULT_DESIGN]].

> [!info] Snapshot
> **As of 2026-09-12.** Ticket frontmatter + [[ops/BOARD]] remain source of truth (`python3 ops/scripts/board_sync.py`).

## Role homes

Start here if you are human. Agents use the board + `next_ticket.py`.

| Lane | Dashboard |
|---|---|
| Architecture | [[ops/dashboards/architecture]] |
| Business | [[ops/dashboards/business]] |
| Product | [[ops/dashboards/product]] |
| Engineering (dev) | [[ops/dashboards/engineering]] |
| QA / test | [[ops/dashboards/qa]] |
| Automation / DX | [[ops/dashboards/automation]] |
| Infra | [[ops/dashboards/infra]] |
| Security | [[ops/dashboards/security]] |

Index: [[ops/dashboards/_index]]. Workshop: [[ops/workshops/vault-os-ux]] · canvas [[ops/workflow/vault-os-ux]].

## Right now

> [!todo] Doing / Review
> Epic [[ops/tickets/WF-000]] stays `implement` (automations still [[ops/tickets/WF-003]]). Vault UX: [[ops/tickets/WF-030]].

> [!info] Ready / Up next
> From [[ops/BOARD]] `ready`. `PRD-000` is an epic — children do the work. Pick with `python3 ops/scripts/next_ticket.py --role auto` (skip epics).

> [!warning] Blocked
> Host / staging still open — [[ops/tickets/WF-004]], [[ops/tickets/WF-010]], [[ops/tickets/WF-011]], [[ops/tickets/WF-013]]. Do not treat as pickable.

**Open decisions:** public brand **OPEN**. Host and OIDC open per [[product/SIGNED]].

Full kanban: [[ops/BOARD]].

## Live ticket tables

> [!tip] Bases + Dataview
> Role dashboards embed `.base` files (Obsidian Bases core plugin). Dataview below works when the vault root is **`docs/`**.

```dataview
TABLE status, priority, owner, title
FROM "ops/tickets"
WHERE id AND status != "done" AND type != "epic"
SORT priority ASC, id ASC
```

```dataview
TABLE status, priority, owner
FROM "ops/tickets"
WHERE status = "done" AND file.mtime >= date(today) - dur(7 days)
SORT file.mtime DESC
```

## Navigate

| Area | Links |
|---|---|
| Product canon | [[product/SIGNED]] · [[product/MILESTONES]] · [[product/MVP]] · [[product/STACK]] · [[product/NAMING]] |
| Company OS | [[ops/HOME]] · [[ops/BOARD]] · [[ops/MILESTONES]] · [[ops/CHARTER]] |
| Dashboards | [[ops/dashboards/_index]] |
| Workshops | [[ops/workshops/_index]] |
| Tickets | [[ops/tickets/_index]] |
| Workflow | [[ops/workflow/LOOP]] · [[ops/workflow/LOCAL]] · [[ops/workflow/CI]] |
| Agents | [[ops/agents/_index]] |
| Leads | [`data/leads/README.md`](data/leads/README.md) |
| History | [`leads/`](leads/CAMPSITE_LEADS.md) · [`automation/`](automation/OBSERVABILITY_MCP_OPTIONS.md) — **fence** |

## Agent rules

- **One ticket** per session (skip `type: epic`).
- **Ready PRs auto-merge** when CI is green (no prod). Chat agents do not merge from chat.
- **Product code** only on `PRD-*` with `status: implement`.

Full list: [`AGENTS.md`](AGENTS.md). Plugins: [[ops/PLUGINS]].
