---
title: Wave 1 — Research leads acceptance
type: product
status: accepted
owner: Product
created: 2026-09-06
---

# Wave 1 — Research leads acceptance

Terry (via CEO, 2026-09-06) green-lit **Research Wave 1**: deposit and update place **leads** in git. This note is Product-owned acceptance. It does **not** rewrite the signed directory MVP ([`SIGNED.md`](SIGNED.md)).

## What Wave 1 is

Research deposits and updates leads in [`data/leads/places.jsonl`](../data/leads/places.jsonl) using the **landed** contract in [`data/leads/schema.json`](../data/leads/schema.json) (PR #14 / [`PRD-006`](../ops/tickets/PRD-006.md), **done**). One JSON object per line. No second schema.

**Leads are not published places.** The live directory stays curator-seeded ([`SIGNED.md`](SIGNED.md)). A row in `places.jsonl` is Research inventory, not a catalog Place.

## Create / update

| Step | Who | What |
|---|---|---|
| 1. Lead create/update | Research (`content-seo`) | Append a new line, or **update the existing line** when `dedupe_key` matches (`place_type:county-slug:name-slug`). Same website host + similar name → update, do not duplicate `id`. |
| 2. Promote / create draft Place | Curator + Eng ([`PRD-008`](../ops/tickets/PRD-008.md)) | Import or API-create a **draft** Place from lead fields. Optional Eng import path from `data/leads` is the same rule: draft only. |
| 3. Publish | Curator, after counsel | Explicit publish. **Blocked** on [`PRD-009`](../ops/tickets/PRD-009.md). Wave 1 green-light does **not** waive counsel. |

## Promote stub field map

Do not fork lead keys. Map onto the catalog Place / `CreatePlaceRequest`-style shape:

| Lead (`schema.json`) | Catalog |
|---|---|
| `name` | `name` |
| `place_type` | `categoryId` (`poi` / `experience` / `campsite` / `bnb` per [`ops/data/listing-types.md`](../ops/data/listing-types.md); `other` needs a curator pick — not a catalog category) |
| `county` | `countyId` — slug on the **32-county** model (incl. NI). No second country table. Lead `country` (`IE` \| `NI`) is a jurisdiction hint for that mapping only. |
| `lat` | `latitude` |
| `lng` | `longitude` |
| `website` | `website` |
| `phone_public` | `phone` |
| `source_url`, `source_name`, `licence` | provenance on the Place (copy; do not rename on the lead) |

Omit unknown optionals. Do not invent coordinates or county names. Draft Places stay unpublished (`published` false / not set). Auto-publish is forbidden.

## Out of Wave 1

Scrapers in this repo, Spring import code (ticket ACs on [`PRD-008`](../ops/tickets/PRD-008.md) only), consumer PWA, booking, brand lock, waiving [`PRD-009`](../ops/tickets/PRD-009.md).

## Links

| | |
|---|---|
| Store (done) | [`PRD-006`](../ops/tickets/PRD-006.md) · [`data/leads/README.md`](../data/leads/README.md) |
| Pipeline acceptance | [`PRD-007`](../ops/tickets/PRD-007.md) · plan [`ops/plans/PRD-007.md`](../ops/plans/PRD-007.md) |
| Curator promote / Eng draft import | [`PRD-008`](../ops/tickets/PRD-008.md) |
| Counsel before publish | [`PRD-009`](../ops/tickets/PRD-009.md) · [`data/leads/LEGAL.md`](../data/leads/LEGAL.md) |
| Broader curator seed | [`PRD-002`](../ops/tickets/PRD-002.md) |
| Signed MVP (curator-seeded directory) | [`SIGNED.md`](SIGNED.md) |
