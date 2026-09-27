---
title: Free Ireland directory
type: product
status: active
owner: Product
created: 2026-09-26
cssclasses:
  - product
---

# Free Ireland directory

Terry, 2026-09-26. Build this. The booking program in [`BOOKING-SITE.md`](BOOKING-SITE.md) stays filed and **does not get promoted**.

House: [`STACK.md`](STACK.md). Host: decision 39 in [[ops/company/DECISIONS]] — https://fishing-journals.com. That VPS is still **one machine** (the same box as mock-prod) until a later split. Deploy is Jenkins `deploy-mock-prod` from `main` (Mac mini, decision 37). Agents never SSH. No GitHub Environment named `production`, no `compose.prod`, no prod SSH path.

## What this is

A free Ireland-only directory: campsites, B&Bs, points of interest, experiences, and local suppliers (farm shops and other small businesses). Guests, hosts, and suppliers do not pay. There is no checkout and no payment gateway in this program.

A signed-in person tracks places they have been and ticks them off on a journey across the island. That work is [[ops/tickets/PRD-030]]. Do not file a second been/want ticket.

## Build order

One ticket at a time. `next_ticket.py` picks `implement` by priority then id. Product tickets below stay `plan` until the previous one is `done`. Only then does a planner set the next single ticket to `implement`.

| # | Ticket | Status to keep until the previous is done | Done when |
|---|---|---|---|
| 1 | [[ops/tickets/WF-040]] | **`implement` now** | Public `/actuator/info` `gitCommit` equals `origin/main` after an unattended deploy |
| 2 | [[ops/tickets/PRD-030]] | `review` (code is on `main`; do not re-implement) | Journey map of been/want confirmed on the public host after step 1 |
| 3 | [[ops/tickets/PRD-032]] | `plan` | Campsite, B&B, experience, and supplier kinds on the map |
| 4 | [[ops/tickets/PRD-033]] | `plan` | Host and supplier authenticated drafts; curator publishes; anonymous Place POST stays closed |
| 5 | [[ops/tickets/PRD-034]] | `plan` | Guest, host, supplier, curator/admin, and support self-serve, with role homes and a support help path |
| 6 | [[ops/tickets/PRD-035]] | `plan` | Phone-first look-and-feel refactor of the current Vite PWA |

[[ops/tickets/WF-048]] and [[ops/tickets/WF-049]] already describe the deploy trigger. They stay `review`. Do not open a third pipeline ticket for the same SHA outcome.

[[ops/tickets/WF-041]] and [[ops/tickets/WF-042]] stay `implement` in the vault tests, but they sort **after** WF-040. When WF-040 leaves `implement`, the next planner must set [[ops/tickets/PRD-032]] to `implement` in that same docs change. Otherwise `next_ticket.py` picks WF-041 and the directory waits.

[[ops/tickets/PRD-014]] is parked at `plan` so it does not sort ahead of WF-040.

## Still later

Payments, checkout, calendars, payouts: [[ops/tickets/PRD-016]]–[[ops/tickets/PRD-029]] stay `inbox`. Do not promote them.

## Confirm

Every implementer after this note deploys with the existing mock-prod path and confirms on https://fishing-journals.com. This planning session does not deploy.
