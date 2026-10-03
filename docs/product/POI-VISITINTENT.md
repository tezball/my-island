---
title: POI VisitIntent slice
type: product
status: active
owner: Product
created: 2026-09-19
cssclasses:
  - product
---

# POI VisitIntent slice

CEO lock **2026-09-19** — [[ops/company/DECISIONS]]. This note is the product shape for the **next public slice** on the live Ireland directory. It does **not** rewrite [`SIGNED.md`](SIGNED.md) or [`MVP.md`](MVP.md) (those remain the longer Release 1 canon: one-tap check-off + My Places).

Ticket: [[ops/tickets/PRD-015]] (`status: done`, #97 on `main`). Map/list of the marks is [[ops/tickets/PRD-030]]. **Do not** implement [[ops/tickets/PRD-012]] / [[ops/tickets/PRD-013]]. Workshop: [[ops/workshops/poi-visitintent]]. House: [`STACK.md`](STACK.md).

## Slice

List of places (POI) plus three personal marks. Terry locked the screen names on **2026-10-03**. The stored mark does not change.

| Screen | Stored mark | Meaning | Privacy | Map |
|---|---|---|---|---|
| **Visited** | `been` | Places we have been to | The list is private. This mark stays the public been count | Can show |
| **Next** | `want` | The small set for the trip we plan next | Private | Can show |
| **Saved** | `never` | Places of interest. An explicit mark, not “everything else” | Private | Shows, the same way Visited and Next do |

There is one mark per Guest + Place. Changing it replaces the old one. Do not add multiple named trips.

**Not in this slice:** campsite / B&B / experience booking, and not the one-mock-per-county listings. Those start after this MVP works on the test server.

**Browse:** anyone can see the list. Signing in is required to tick marks.

**Geography:** Ireland only for seed data. Other countries later.

**UI:** keep the live Explore app (county chips, search, list, map, place detail). This slice adds ticks and personal lists on top — it does not rebuild the directory. Chips and ticks read **Visited**, **Next**, and **Saved**.

**Privacy:** Guest lists are **private**. **Public counts lock A:** the public count is **Visited / `been` only** (anonymous integer, no PII — no names, guest ids, or other identifiers). **Next** and **Saved** stay private to the Guest. API values, the database enum, and the JSON mark stay `been`, `want`, and `never`. Existing rows and Gatling stay valid.

## Domain language

| Term | Meaning |
|---|---|
| **Place** | A point of interest people can visit |
| **County** | Irish county the Place sits in |
| **Guest** | A person using the site to browse and tick places |
| **Host / Experience owner / Support** | Named in the glossary only; no UI in this slice |
| **VisitIntent** | The Guest’s mark on a Place. Screen: **Visited**, **Next**, or **Saved**. Stored: `been`, `want`, or `never` |
| **Rule** | One VisitIntent per Guest + Place. Changing the mark replaces the old one. No multiple named trips |
| **Kind** | Place already has kinds (`poi`, `campsite`, `bnb`, `experience`). Only `poi` is shown in Explore. Leave that as-is |

## Tickets

**Do not** implement [[ops/tickets/PRD-012]] / [[ops/tickets/PRD-013]] as written (one-tap check-off / My Places). VisitIntent API/ticks/lists: [[ops/tickets/PRD-015]] (`done`). Profile map **or** list: [[ops/tickets/PRD-030]]. Saved (`never`) shows on that map with Visited and Next.

**Build order C:** stream 1 = [[ops/tickets/WF-040]] + [[ops/tickets/WF-041]] + [[ops/tickets/WF-042]] + [[ops/tickets/WF-043]] + [[ops/tickets/WF-044]] + [[ops/tickets/WF-045]] + [[ops/tickets/WF-046]]; stream 2 = [[ops/tickets/PRD-010]] + this ticket. Parallel. Do not wait on deploy.

## Stack (unchanged house)

Java / Spring Boot catalog (one API). Vite + React TypeScript PWA. PostgreSQL 17 + PostGIS, Flyway. Grafana OSS + Prometheus + Loki + Alertmanager. Jenkins local compose + GitHub Actions dual-run. No Next.js, FastAPI, Neon, or Datadog as system of record. **No production Environment.** fishing-journals.com is mock-prod.

## Identity

Guest signs in with **username/password and Google SSO**. GIS can stay (`POST /api/auth/google`). Seed **password** Guests for automation (env, never `docs/`). VisitIntent requires a signed-in Guest. Auth ticket: [[ops/tickets/PRD-010]]. No OIDC stub. Spring redirect OIDC is later ([[ops/tickets/WF-014]]).

**Writes:** no public POST/PUT/PATCH/DELETE of Places. Seed/import in CI/deploy only. Guests write **VisitIntent only**. Close `POST /api/v1/places` ([[ops/tickets/WF-046]]).

## Done looks like

A Guest can browse the live list, sign in (password **or** Google), mark a Place Visited / Next / Saved (`been` / `want` / `never`), and see those **private** lists. All three can show on the map. Place API/UI expose an **anonymous been count** only (Visited; no PII); Next and Saved stay private to the Guest. A merged ticket reaches fishing-journals.com without a human SSH (**commit → deploy → test → confirm**). An agent can, via MCP: check the site, read metrics/logs, trigger Gatling as a seed Guest, and troubleshoot without SSH.

Campsite / B&B booking is **not this slice**. The current build is the free directory ([`FREE-DIRECTORY.md`](FREE-DIRECTORY.md)). Journey map of been/want is [[ops/tickets/PRD-030]]. Checkout stays parked: [`BOOKING-SITE.md`](BOOKING-SITE.md) ([[ops/tickets/PRD-016]]–[[ops/tickets/PRD-029]] inbox).
