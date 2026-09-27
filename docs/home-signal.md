---
title: Home — signal
type: dashboard
cssclasses:
  - home-signal
aliases:
  - Signal
updated: 2026-09-27
---

# The signal

A free directory of Ireland, on one public host.

> [!quote] Where we are
> Listings are live on [fishing-journals.com](https://fishing-journals.com/). The page in front of the company is the review queue.

Live home stays [[HOME]]. This is the magazine. Desk: [[home-desk]]. Map: [[home-atlas]]. Plugins: [[home-plugins]].

## The company

Phone-first listings for points of interest, experiences, campsites, and B&Bs. Free to browse. The public host is fishing-journals.com. Local compose is how agents run the same stack. `main` is git, and the host follows `main`.

> [!info] House
> **Java / Spring Boot** · **Vite + React** PWA · **PostgreSQL 17 + PostGIS** · **Flyway** · **Grafana OSS** · **Jenkins** and GitHub Actions.
> [[product/STACK]]

## Live

The directory (list and map) is on the public host. VisitIntent — been, want, never — is done ([[ops/tickets/PRD-015]]). Place seed, Explore, and place detail are done with it.

> [!success] In review, on the product
> Visitor auth [[ops/tickets/PRD-010]] and been/want on the map [[ops/tickets/PRD-030]] lead the product notes in `status: review`. The rest of that queue is the deploy, CI, and observe pack. Cards below are every non-epic review note.

![[ops/dashboards/company-home.base#Review cards]]

## In hand

Four notes are `implement` (frontmatter, 2026-09-27): launch quality [[ops/tickets/PRD-014]], metrics from the host [[ops/tickets/WF-041]], the agent MCP pack [[ops/tickets/WF-042]], and worktrees [[ops/tickets/WF-038]]. The operations epic [[ops/tickets/WF-000]] stays `implement` and stays off this grid.

![[ops/dashboards/company-home.base#Implement cards]]

## Next

Counsel before publish [[ops/tickets/PRD-009]] and the mobile place-detail home control [[ops/tickets/PRD-031]] are `plan`. The directory epic [[ops/tickets/PRD-000]] is the container; its children do the work.

> [!warning]- Held
> Staging [[ops/tickets/WF-010]], sign-in [[ops/tickets/WF-014]] · [[ops/tickets/WF-033]], and the check-off pair [[ops/tickets/PRD-012]] · [[ops/tickets/PRD-013]] are `blocked`. Booking-site stories sit in `inbox` and are off this home.

## Open

Every ticket with an `id` that is not an epic, not `done`, and not `inbox`.

> [!example]- Open cards
> ![[ops/dashboards/company-home.base#Open cards]]

## Paths

| | |
|---|---|
| Architecture | [[product/STACK]] · [[atlas/engineering]] · [[ops/dashboards/architecture]] · [[ops/company/DECISIONS]] |
| Loop | [[ops/workflow/LOOP]] |
| CI | [[ops/workflow/CI]] |
| Board | [[ops/BOARD]] |
| Sitemap | [[ATLAS]] |
| Plugins | [[home-plugins]] |
