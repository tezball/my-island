---
title: Product scope (vault pointer)
type: company
cssclasses:
  - moc
---

# Product scope

Living spec is **outside** this vault. Do not fork it.

| Canon | Path |
|---|---|
| Signed decisions (CEO 2026-09-05) | [`product/SIGNED.md`](../../product/SIGNED.md) |
| VisitIntent slice (CEO 2026-09-19) | [`product/POI-VISITINTENT.md`](../../product/POI-VISITINTENT.md) · [[ops/tickets/PRD-015]] |
| Free Ireland directory (Terry 2026-09-26) | [`product/FREE-DIRECTORY.md`](../../product/FREE-DIRECTORY.md) · [[ops/tickets/WF-040]] then [[ops/tickets/PRD-030]]–[[ops/tickets/PRD-035]] |
| Booking-site program (parked 2026-09-26) | [`product/BOOKING-SITE.md`](../../product/BOOKING-SITE.md) · [[ops/tickets/PRD-016]]–[[ops/tickets/PRD-029]] stay inbox |
| CEO briefing | [`product/BRIEFING.md`](../../product/BRIEFING.md) |
| Vision | [`product/VISION.md`](../../product/VISION.md) |
| MVP (92 stories) | [`product/MVP.md`](../../product/MVP.md) |
| Milestones (M0–M7 + chunks) | [`product/MILESTONES.md`](../../product/MILESTONES.md) · vault [[ops/MILESTONES]] |
| Expansion / marketplace | [`product/EXPANSION.md`](../../product/EXPANSION.md) |
| Stack (signed) | [`product/STACK.md`](../../product/STACK.md) — Spring, Vite+React PWA, PostGIS, Grafana MCP |

## One sentence

A mobile directory of Irish POIs, experiences, campsites and B&Bs that you tick off as you go. **VisitIntent** is the current slice. **Booking-site** (campsites/B&Bs, mock-prod) is filed as [[ops/tickets/PRD-016]]–[[ops/tickets/PRD-029]] (`inbox`).

## MVP includes

Explore (list + map), place detail, one-tap check-off, My Places, accounts, curator tooling, admin GDPR, NFRs (PWA, offline queue, WCAG, MCP logs).

## MVP excludes

Booking, payments, partner portals, reviews, guest–host messaging, native apps.

## Tickets

- Directory epic: [[ops/tickets/PRD-000]]
- **This slice:** [[ops/tickets/PRD-015]] VisitIntent (`been` / `want` / `never`). Do not implement [[ops/tickets/PRD-012]] / [[ops/tickets/PRD-013]] as one-tap / My Places.
- Marketplace epic (never implement): [[ops/tickets/PRD-004]] — children [[ops/tickets/PRD-016]]–[[ops/tickets/PRD-029]] `inbox`

History of the camping booking build: [`docs/README.md`](../../README.md). Do not implement from `docs/`.

House (CEO 2026-09-05): Java / Spring Boot, light Vite+React PWA (**not** Next), PostgreSQL 17 + PostGIS, Flyway, Grafana OSS MCP. [[DECISIONS]]
