---
title: Product scope (vault pointer)
type: company
---

# Product scope

Living spec is **outside** this vault. Do not fork it.

| Canon | Path |
|---|---|
| Signed decisions (CEO 2026-09-05) | [`product/SIGNED.md`](../../product/SIGNED.md) |
| CEO briefing | [`product/BRIEFING.md`](../../product/BRIEFING.md) |
| Vision | [`product/VISION.md`](../../product/VISION.md) |
| MVP (92 stories) | [`product/MVP.md`](../../product/MVP.md) |
| Expansion / marketplace | [`product/EXPANSION.md`](../../product/EXPANSION.md) |
| Stack (signed) | [`product/STACK.md`](../../product/STACK.md) — Spring, Vite+React PWA, PostGIS, Grafana MCP |
| Public brand | **Halfdoor** — Inis internal only. [`product/NAMING.md`](../../product/NAMING.md) |

## One sentence

**Halfdoor** — a mobile directory of Irish POIs, experiences, campsites and B&Bs that you tick off as you go. Later: hosts, booking, messages, reviews — only when expansion gates pass. Public brand is Halfdoor; Inis is internal only.

## MVP includes

Explore (list + map), place detail, one-tap check-off, My Places, accounts, curator tooling, admin GDPR, NFRs (PWA, offline queue, WCAG, MCP logs).

## MVP excludes

Booking, payments, partner portals, reviews, guest–host messaging, native apps.

## Tickets

- Directory epic: [[tickets/PRD-000]]
- Marketplace epic (gated): [[tickets/PRD-004]]

History of the camping booking build: [`docs/README.md`](../../docs/README.md). Do not implement from `docs/`.

House (CEO 2026-09-05): Java / Spring Boot, light Vite+React PWA (**not** Next), PostgreSQL 17 + PostGIS, Flyway, Grafana OSS MCP. [[DECISIONS]]
