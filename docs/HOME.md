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

Phone-first **Ireland directory** MVP (list, map, one-tap check-off) plus a **company OS** of agent workflows in this repo (`my-island`). Public product name is **OPEN** — do not lock StayÉire, Éirelist, or any other ship name here.

Canon: [`product/SIGNED.md`](product/SIGNED.md) · [`product/README.md`](product/README.md) · [`product/MILESTONES.md`](product/MILESTONES.md) · [[product/SIGNED]] · [[product/README]] · [[product/MILESTONES]]. OS hub: [`ops/HOME.md`](ops/HOME.md) · [[ops/HOME]]. Design: [[ops/company/VAULT_DESIGN]].

> [!info] Snapshot
> **As of 2026-09-12.** Edit this section when the board moves. Ticket frontmatter + [`ops/BOARD.md`](ops/BOARD.md) remain source of truth (`python3 ops/scripts/board_sync.py`). Kanban plugin is optional on [[ops/BOARD]] (engineering) and [[ops/MILESTONES]] (product map, hand-maintained).

## Role homes

Humans start by hat. Agents use the board + `next_ticket.py`. Index: [[ops/dashboards/_index]].

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

## Right now

> [!todo] Doing / Review
> Epic [`WF-000`](ops/tickets/WF-000.md) · [[ops/tickets/WF-000]] stays `implement` (automations still [`WF-003`](ops/tickets/WF-003.md)). Vault UX in review: [`WF-030`](ops/tickets/WF-030.md) · [[ops/tickets/WF-030]].

> [!success] Landed
> [`WF-019`](ops/tickets/WF-019.md) sim (#31), [`WF-021`](ops/tickets/WF-021.md) `./scripts/app` (#35), [`WF-001`](ops/tickets/WF-001.md) compose+MCP, [`WF-002`](ops/tickets/WF-002.md) rules/hook, [`WF-017`](ops/tickets/WF-017.md) STACK-E2E drill ([#36](https://github.com/tezball/my-island/pull/36)), [`WF-018`](ops/tickets/WF-018.md) stub fields ([#37](https://github.com/tezball/my-island/pull/37)), [`WF-022`](ops/tickets/WF-022.md) root `HOME.md` ([#39](https://github.com/tezball/my-island/pull/39)), [`PRD-007`](ops/tickets/PRD-007.md) Wave 1 leads ([#45](https://github.com/tezball/my-island/pull/45)), [`WF-016`](ops/tickets/WF-016.md) Cloud Agent mcp-grafana + Postgres-RO ([#48](https://github.com/tezball/my-island/pull/48)), [`WF-023`](ops/tickets/WF-023.md) living markdown under `docs/` ([#52](https://github.com/tezball/my-island/pull/52)), [`PRD-008`](ops/tickets/PRD-008.md) Eng import of **draft** Places ([#47](https://github.com/tezball/my-island/pull/47)) — all `done`.

> [!info] Ready / Up next
> From [[ops/BOARD]] `ready`. `PRD-000` is an epic — children do the work.

| Id | Pri | What |
|---|---|---|
| [`E2E-001`](ops/tickets/E2E-001.md) · [[ops/tickets/E2E-001]] | P0 | Place listing stub API — e2e workshop |
| [`PRD-000`](ops/tickets/PRD-000.md) · [[ops/tickets/PRD-000]] | P0 | Ireland directory MVP (epic) |
| [`PRD-002`](ops/tickets/PRD-002.md) · [[ops/tickets/PRD-002]] | P0 | Curator seed content pipeline |
| [`PRD-003`](ops/tickets/PRD-003.md) · [[ops/tickets/PRD-003]] | P0 | Light Vite+React PWA |
| [`PRD-009`](ops/tickets/PRD-009.md) · [[ops/tickets/PRD-009]] | P0 | Trust / counsel gate before publish |
| [`WF-003`](ops/tickets/WF-003.md) · [[ops/tickets/WF-003]] | P1 | Cursor Automations for plan / implement / review |

> [!info] Planning
> Empty. Next product plan is [`PRD-009`](ops/tickets/PRD-009.md) · [[ops/tickets/PRD-009]] (still `ready`).

> [!success] Workshop — E2E place-listing stub
> Field source of truth on the running stub: `categoryId` / `countyId` / `latitude` / `longitude` (not `categorySlug` / `countySlug` / `lon`+`lat`).
>
> - Ticket: [`ops/tickets/E2E-001.md`](ops/tickets/E2E-001.md) · [[ops/tickets/E2E-001]]
> - Canvas: [`ops/workflow/e2e-place-stub.canvas`](ops/workflow/e2e-place-stub.canvas) · [[ops/workflow/e2e-place-stub]]
> - Brief: [`ops/workshops/e2e-place-stub.md`](ops/workshops/e2e-place-stub.md) · [[ops/workshops/e2e-place-stub]]
> - Local: [`ops/workflow/LOCAL.md`](ops/workflow/LOCAL.md) · [[ops/workflow/LOCAL]]

> [!success] Workshop — Vault OS UX
> Colour, role dashboards (Bases + Dataview), templates. Ticket: [[ops/tickets/WF-030]] · brief [[ops/workshops/vault-os-ux]] · canvas [[ops/workflow/vault-os-ux]].

> [!warning] Blocked
> Host / staging still open. Do not treat these as pickable.

| Id | Pri | Why |
|---|---|---|
| [`WF-004`](ops/tickets/WF-004.md) · [[ops/tickets/WF-004]] | P1 | Remote Grafana MCP — needs always-on staging (WF-010) |
| [`WF-010`](ops/tickets/WF-010.md) · [[ops/tickets/WF-010]] | P1 | Always-on EU staging — host still open |
| [`WF-011`](ops/tickets/WF-011.md) · [[ops/tickets/WF-011]] | P1 | Required Playwright — no consumer UI yet |
| [`WF-013`](ops/tickets/WF-013.md) · [[ops/tickets/WF-013]] | P2 | Scriptable deploy path — host still open |

**Open decisions:** public brand **OPEN** (StayÉire vs Éirelist vs others — do not re-lock). Host and OIDC remain open per [`product/SIGNED.md`](product/SIGNED.md).

Full kanban: [`ops/BOARD.md`](ops/BOARD.md) · [[ops/BOARD]].

## Navigate

Wikilinks (`[[ops/BOARD]]`, `[[product/SIGNED]]`) resolve when the Obsidian vault is **`docs/`**. Relative markdown links work on GitHub and in Obsidian.

| Area | Links |
|---|---|
| Product canon | [`product/README.md`](product/README.md) · [`SIGNED`](product/SIGNED.md) · [`MILESTONES`](product/MILESTONES.md) · [`MVP`](product/MVP.md) · [`STACK`](product/STACK.md) · [`NAMING`](product/NAMING.md) · [[product/SIGNED]] · [[product/MILESTONES]] · [[product/MVP]] · [[product/STACK]] · [[product/NAMING]] |
| Company OS | [`ops/HOME.md`](ops/HOME.md) · [`BOARD.md`](ops/BOARD.md) · [`ops/MILESTONES.md`](ops/MILESTONES.md) · [`CHARTER`](ops/CHARTER.md) · [[ops/HOME]] · [[ops/BOARD]] · [[ops/MILESTONES]] · [[ops/CHARTER]] |
| Dashboards | [[ops/dashboards/_index]] |
| Tickets | [`ops/tickets/_index.md`](ops/tickets/_index.md) · [[ops/tickets/_index]] |
| Workflow | [`LOOP`](ops/workflow/LOOP.md) · [`LOCAL`](ops/workflow/LOCAL.md) · [`CI`](ops/workflow/CI.md) · [[ops/workflow/LOOP]] · [[ops/workflow/LOCAL]] · [[ops/workflow/CI]] |
| Workshops | [[ops/workshops/_index]] · [[ops/workshops/vault-os-ux]] · [[ops/workshops/e2e-place-stub]] |
| Leads | [`data/leads/README.md`](data/leads/README.md) |
| History | [`leads/`](leads/CAMPSITE_LEADS.md) · [`automation/`](automation/OBSERVABILITY_MCP_OPTIONS.md) — **fence: do not implement** |
| Agents | [`ops/agents/_index.md`](ops/agents/_index.md) · [[ops/agents/_index]] |

## Live queries

> [!tip] Dataview — vault root = `docs/`
> These queries use `FROM "ops/tickets"`. They run only if [Dataview](ops/PLUGINS.md) is installed **and** the Obsidian vault is **`docs/`**.

```dataview
TABLE status, priority, owner
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

## Agent rules

- **One ticket** per session (skip `type: epic`).
- **Ready PRs auto-merge** when CI is green (no prod; CEO 2026-09-12). Chat agents open PRs and comment; they do not merge from chat.
- **Product code** only on `PRD-*` with `status: implement`.

Full list: [`AGENTS.md`](AGENTS.md). Plugins: [[ops/PLUGINS]].
