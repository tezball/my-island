---
title: POI directory — QA
type: workshop
owner: eng-qa
created: 2026-09-12
cssclasses:
  - workshop
---

# POI directory — QA

Live POC 2026-09-12: 112 published campsites, every `latitude`/`longitude` null. JSONL has 114 campsites and zero coords. Caddy `connect-src 'self'` plus `geolocation=()`.

## Map failure

Explore drops pins unless both coords are finite. All-null geometry → zero pins. Independently, OSM tile fetch is CSP-blocked. Ireland fallback must stay an overview — never invent pins at Dublin.

## Acceptance (this slice)

- List card: photo or placeholder, name, Point of interest, county.
- Map plots only rows with both coords inside Ireland bounds.
- Place detail: photo, original copy, directions when coords exist, nearby.
- Filters: county + search; category locked to POI (or only POI rows published).
- Missing image → paper placeholder, not a broken `<img>`.

## Tests

Vitest: haversine, filter reducer, pin eligibility. Catalog Testcontainers: image columns round-trip. Pytest: JSONL schema; campsites ≥105 remain; POIs have lat/lng. No Playwright job until [[ops/tickets/WF-011]].

## Host checklist

[[ops/runbooks/MOCK_HOST_CSP]] — `connect-src` tile hosts, `worker-src 'self' blob:`, `geolocation=(self)`.
