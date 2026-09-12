---
title: POI directory — content / curator
type: workshop
owner: content-seo
created: 2026-09-12
cssclasses:
  - workshop
---

# POI directory — content / curator

**content-seo.** CEO workshop 2026-09-12. Irish **POIs only**. Wikidata CC0 facts + Commons File: images. No Fáilte / Camping Ireland / Pitchup copy or photos. Do not invent coordinates. [[ops/tickets/PRD-009]] still gates public launch; local `published=true` is demo-only.

## Source

Wikidata SPARQL (`P625` required). Commons `P18` → File: page, free licence only (CC BY / BY-SA / CC0 / PD). OSM only if P625 is missing. `notes_original` ≤280 **original**. Catalog `description` is original curator copy (not Wikipedia paste).

## Coverage

~80–120 POIs with coords. Famous floor plus at least one pin per county where a free image exists. Campsite rows stay `status=lead`. Do not seed them published.

## Schema

Extend [`schema.json`](../../../data/leads/schema.json): optional `town`, `description`, `image_url`, `image_credit`, `image_licence`, `facility_ids`, `price_band`. Same file — no sidecar.

## Campsites

Keep the 114 Wave 1 campsites as research. Do not invent their coordinates. Later category wave + counsel.
