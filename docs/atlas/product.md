---
title: Product
type: moc
group: product
cssclasses:
  - moc
  - product
---

# Product — Confluence canon

[[HOME]] · [[ATLAS]] · [`product/README.md`](../product/README.md)

Gorse gold. Signed product truth. **Do not implement** unless the ticket is `PRD-*` and `status: implement`. Do not duplicate specs into `ops/` — link here.

## Start here

| Note | What |
|---|---|
| [[product/README]] | Product hub |
| [[product/SIGNED]] | CEO sign-off 2026-09-05 |
| [[product/POI-VISITINTENT]] | 2026-09-19 VisitIntent slice (been / want / never) |
| [[product/VISION]] | Why |
| [[product/MVP]] | Release 1 directory |
| [[product/MILESTONES]] | M0–M7 + gated chunks |
| [[product/STACK]] | House stack (Java / Spring, Vite PWA, PostGIS, Grafana) |
| [[product/NAMING]] | Public name still OPEN |
| [[ops/MILESTONES]] | Visual product map (hand-maintained) |
| [[ops/dashboards/product]] | Product role home |

## Live — product tickets

```dataview
TABLE status, priority, owner, title
FROM "ops/tickets"
WHERE id AND startswith(id, "PRD") AND status != "done"
SORT priority ASC, id ASC
```
