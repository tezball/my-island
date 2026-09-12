---
title: POI directory MVP — employee workshop
type: workshop
created: 2026-09-12
cssclasses:
  - workshop
---

# POI directory MVP — employee workshop

CEO 2026-09-12: POC is live at `https://fishing-journals.com/explore/`. Next is a **finished-looking directory of Irish POIs** (not campsites). Phone-first. Fix the map. Populate seed. Tell Terry what we cannot close.

Hats in this session: **product**, **eng-frontend**, **content-seo**, **architecture**, **eng-qa**. Orchestrator synthesizes. Public brand **OPEN**. House: Spring catalog + Vite/React PWA + PostGIS. No Next.js / FastAPI.

## Goal

A visitor on a phone can browse a curated **point-of-interest** directory as a list and a map, open a place with a real photo and original copy, and get directions. It looks like a real Ireland guide, not an empty campsite spreadsheet.

## Success bar (this slice)

- Every **published** Place is `category=poi`, has WGS84 coords, original description, and a Commons hero (or a category placeholder if Commons has no free file).
- Map plots those pins, clusters, Ireland fallback when location is off.
- Place detail: photo, copy, mini-map, directions, nearby, website when known.
- Campsite JSONL remains Research (`status=lead`). Not published.
- Local compose (`./scripts/app start`) is the demo. fishing-journals.com needs host CSP (runbook).

**Not the signed kill metric.** Return **tick** rate is deferred with check-off. This slice measures browse: return visits, detail opens, directions taps.

## Hats

| Hat | Lock |
|---|---|
| **product** | Cut CHK / ME / ACC from this slice. No greyed-out tick. POI-only public catalog. Reuse [[ops/tickets/PRD-002]] + [[ops/tickets/PRD-003]] + [[ops/tickets/PRD-011]]. |
| **eng-frontend** | Phone-first Explore + Place. MapLibre + OSM/Carto. Cards with photo. Routes `/` and `/places/:slug`. |
| **content-seo** | Wikidata CC0 facts + Commons File: images. Original notes. ~80–120 POIs, 32-county mix. |
| **architecture** | Flyway V7 image trio. Extend `import_leads.py`, do not Flyway-dump JSONL. `APP_SEED_PUBLISH` local only. |
| **eng-qa** | Map fails because coords are null **and** live CSP blocks tiles. Tests: Vitest + catalog Testcontainers + JSONL schema. |

## Map diagnosis (live POC)

1. `GET /api/v1/places?published=true` — 112 campsites, **all** `latitude`/`longitude` null.
2. `data/leads/places.jsonl` — 114 campsites, **0** coords.
3. Caddy: `connect-src 'self'` (+ Google) → MapLibre tile **fetch** blocked. `Permissions-Policy: geolocation=()`.

Fix in-repo: seed POIs with P625. Fix on host: [[ops/runbooks/MOCK_HOST_CSP]].

## Out

Booking, payments, reviews, My Places, auth, check-off, campsite/B&B/experience publish, 500-place launch DoD, Playwright CI ([[ops/tickets/WF-011]]), counsel waiver ([[ops/tickets/PRD-009]]).

## CEO questions (need answers; not blockers for local demo)

1. Confirm CHK / ME / ACC stay **off** this public slice (sequencing, not a product kill).
2. Unpublish the 112 campsites on fishing-journals.com in favour of POIs?
3. Apply the CSP / geolocation headers on that host (this git tree cannot).
4. Accept Wikimedia Commons attribution on Place as the photo path (not aggregator scrape).
5. fishing-journals.com is a fishing domain — throwaway POC URL, or move OPEN off it?

## Links

- Tickets: [[ops/tickets/PRD-002]] · [[ops/tickets/PRD-003]] · [[ops/tickets/PRD-011]]
- Content: [[ops/workshops/poi-directory-content]]
- QA: [[ops/workshops/poi-directory-qa]]
- Host: [[ops/runbooks/MOCK_HOST_CSP]]
- Legal: [`data/leads/LEGAL.md`](../../data/leads/LEGAL.md)
