---
title: Product
type: product
status: signed
owner: Product
created: 2026-09-01
signed: 2026-09-05
cssclasses:
  - product
  - moc
---

# Product

[[ATLAS]] · [[atlas/product]] · [[HOME]]

Product definition for the rebuild. Start here.

| Document | What it is |
|---|---|
| [`SIGNED.md`](SIGNED.md) | CEO sign-off 2026-09-05 — directory MVP, kill list, house bar |
| [`POI-VISITINTENT.md`](POI-VISITINTENT.md) | **2026-09-19 slice** — been / want / never on the live POI directory (`PRD-015`). Does not replace `MVP.md` |
| [`WAVE-1.md`](WAVE-1.md) | Research Wave 1 acceptance — leads in `data/leads/` (not publish; counsel still PRD-009) |
| [`BRIEFING.md`](BRIEFING.md) | CEO briefing — what the repo is, what we are building, what was built before, open decisions |
| [`VISION.md`](VISION.md) | What we are building and why. Principles, roles, decisions made, open questions for the business |
| [`MVP.md`](MVP.md) | Release 1 — the checkable directory. 92 stories, data model, success criteria, definition of done |
| [`MILESTONES.md`](MILESTONES.md) | Frozen map — MVP M0–M7 and gated chunks 1–8. Visual: [`ops/MILESTONES.md`](../ops/MILESTONES.md) |
| [`EXPANSION.md`](EXPANSION.md) | Everything after, in 10 chunks. Each with the question it answers and the evidence needed to start it |
| [`NAMING.md`](NAMING.md) | Candidate names, trademark landmines to avoid, and the selection criteria |
| [`STACK.md`](STACK.md) | **Signed house** (CEO 2026-09-05): Java / Spring Boot; Vite+React PWA (not Next); PostgreSQL 17 + PostGIS; Flyway; Grafana OSS MCP |
| [`ENGINEERING.md`](ENGINEERING.md) | CTO review — agent loop and safety. Does not compete with `STACK.md` |
| [`READINESS.md`](READINESS.md) | Can a team implement yet? What is enough, what forks, what to freeze |

Day-to-day engineering is not this folder. The company OS, tickets, and agent loop live in [`../ops/`](../ops/HOME.md). Open **`docs/`** in Obsidian (vault root).

## The short version

A mobile directory of places in Ireland worth going to — points of interest, experiences, campsites
and B&Bs — that you tick off as you go.

The MVP tests one thing: **will people bother to record where they have been?** Everything else is
gated on the answer.

## Status

**Signed** by CEO 2026-09-05 — [`SIGNED.md`](SIGNED.md). **Directory browse is live** on local compose and mock-prod (101 Ireland POIs). Next slice: [`POI-VISITINTENT.md`](POI-VISITINTENT.md) ([[ops/tickets/PRD-015]]).
House is **signed** in [`STACK.md`](STACK.md): Java / Spring Boot, light
Vite+React PWA (not Next.js), PostgreSQL 17 + PostGIS, Flyway, Jenkins + GitHub Actions,
Grafana OSS MCP. Mock-prod is fishing-journals.com (no GitHub `production` Environment).
Do not start a new stack. Do not implement product unless a `PRD-*` ticket is `implement`.

The previous camping-platform build has had its code removed from the working tree; its
documentation is retained in [`../leads/`](../leads/CAMPSITE_LEADS.md) and [`../automation/`](../automation/OBSERVABILITY_MCP_OPTIONS.md) for reference. That material describes a booking platform
and is superseded by this directory — read it as history, not as requirements. The full previous
codebase remains in git history at tag `legacy-platform`. Draft PRs that implement from historical
`docs/leads/` or `docs/automation/` (#2, #4, #5) are to be closed or ignored.
