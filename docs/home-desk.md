---
title: Home — desk
type: dashboard
cssclasses:
  - home-desk
aliases:
  - Desk
updated: 2026-09-27
---

# The desk

| | |
|---|---|
| Product | Ireland listings. Free to browse. |
| Host | [fishing-journals.com](https://fishing-journals.com/) |
| API | Java / Spring Boot |
| Client | Vite + React PWA |
| Data | PostgreSQL 17 + PostGIS · Flyway |
| Observe | Grafana OSS |
| CI | Jenkins local · GitHub Actions dual-run |
| Runtime | Local compose. `main` is git. The host follows `main`. |
| Canon | [[product/STACK]] |
| Live home | [[HOME]] |
| Other homes | [[home-signal]] · [[home-atlas]] |
| Plugins | [[home-plugins]] |

## Now

Directory browse is on the public host and on local compose. VisitIntent is done ([[ops/tickets/PRD-015]]).

| Lane | What it is |
|---|---|
| Implement | [[ops/tickets/PRD-014]] launch quality · [[ops/tickets/WF-041]] host metrics · [[ops/tickets/WF-042]] MCP pack · [[ops/tickets/WF-038]] worktrees |
| Review | Product: [[ops/tickets/PRD-010]] visitor auth · [[ops/tickets/PRD-030]] been/want on the map. With them: deploy, CI, chaos, ZAP, Gatling, Place writes. |
| Plan | [[ops/tickets/PRD-009]] counsel before publish · [[ops/tickets/PRD-031]] mobile place-detail home control |
| Held | [[ops/tickets/WF-010]] staging · [[ops/tickets/WF-014]] · [[ops/tickets/WF-033]] sign-in · [[ops/tickets/PRD-012]] · [[ops/tickets/PRD-013]] check-off |

Epic [[ops/tickets/WF-000]] stays `implement` and is excluded below (`type: epic`). `inbox` (booking-site stories) is excluded. Source of truth: ticket frontmatter. Generated board: [[ops/BOARD]].

## Count

> [!info] Dataview — tally only
> The tables under this are Bases: one note per row, Open grouped by `status`. Bases does not replace that list with a count per status. This block is that tally. Same filter as Open: `id` set, `type` not epic, `status` not `done` and not `inbox`. [[home-signal]] and [[home-atlas]] do not use it.

```dataview
TABLE length(rows) AS tickets
FROM "ops/tickets"
WHERE id AND type != "epic" AND status != "done" AND status != "inbox"
GROUP BY status
SORT status ASC
```

## Implement

`status` is `implement`.

![[ops/dashboards/company-home.base#Implement]]

## Review

`status` is `review`.

![[ops/dashboards/company-home.base#Review]]

## Open

`status` is anything still open: `ready`, `plan`, `implement`, `review`, `blocked`.

![[ops/dashboards/company-home.base#Open]]

## Paths

| | |
|---|---|
| Architecture | [[product/STACK]] · [[atlas/engineering]] · [[ops/dashboards/architecture]] · [[notes/adr/_index]] · [[ops/company/DECISIONS]] |
| Loop | [[ops/workflow/LOOP]] · [[ops/workflow/WORKTREES]] · [[ops/workflow/DOD]] |
| CI | [[ops/workflow/CI]] |
| Board | [[ops/BOARD]] |
| Sitemap | [[ATLAS]] · [[ops/HOME]] |
| Plugins | [[home-plugins]] |
