# Place leads

Source of truth for **unpublished place leads** collected by Research (campsites, B&Bs, experiences, POIs). Leads are **not** published places and are **not** the live catalog.

Engineering later imports leads into Spring (`PRD-002`). Curators promote a subset to published. This directory must never write the consumer catalog.

Seed file: [`places.jsonl`](places.jsonl) (one JSON object per line). Schema: [`schema.json`](schema.json). Intended sources: [`SOURCES.md`](SOURCES.md). Legal: [`LEGAL.md`](LEGAL.md).

## Who writes here

| Role | Does |
|---|---|
| Research (`content-seo`) | Append/update leads with provenance |
| Engineering | Read-only until a later import ticket |
| Curators | Change `status` (reviewed / rejected / promoted); do not treat this file as the public directory |

## Status lifecycle

```
lead → reviewed → promoted     (imported and published in Spring)
           ↘ rejected          (unsuitable; keep the record)
```

| Status | Meaning |
|---|---|
| `lead` | Newly collected. Not curator-checked. |
| `reviewed` | Facts checked. Still unpublished. |
| `rejected` | Do not promote. Keep for dedupe. |
| `promoted` | Curator published (or Engineering imported and curator published). Stop editing facts here; the catalog is then source of truth for the live listing. |

Do not skip to `promoted` from this store alone. Promotion is a curator action after import.

## Schema (one record)

Required: `id`, `name`, `place_type`, `country`, `source_url`, `source_name`, `fetched_at`, `licence`, `status`, `dedupe_key`.

| Field | Notes |
|---|---|
| `id` | Stable kebab-case. Never reuse. |
| `place_type` | `campsite` \| `bnb` \| `experience` \| `poi` \| `other` (same set as `ops/data/listing-types.md` plus `other`) |
| `county` | Omit when unknown. Do not invent. |
| `country` | `IE` (Republic) or `NI` (Northern Ireland) |
| `address`, `eircode`, `lat`, `lng`, `website`, `phone_public` | Omit rather than `"-"`. Do not invent coordinates. |
| `email_public` | Public **business** mailbox only. Omit Gmail/Yahoo and named personal inboxes. |
| `notes_original` | Short original research text (≤280 chars). Not marketing copy for publish. |
| `source_url` / `source_name` | Primary provenance (http(s) or repo-relative path). **Required.** |
| `raw_refs` | Extra URLs/paths (starter table, second listing). |
| `fetched_at` | ISO-8601 UTC (`YYYY-MM-DDTHH:MM:SSZ`) |
| `licence` | How we may use the captured *facts* (seed rows: `internal-research`). Not a licence to republish third-party prose or photos. |
| `dedupe_key` | `place_type:county-slug:name-slug` (`unknown` if county missing) |

## Rules

1. **No live catalog writes.** This folder does not update Spring, Postgres, or any published place.
2. **No copyrighted prose or photos in publish fields.** Do not copy aggregator or operator marketing copy, reviews, or image URLs into fields intended for the public directory. `notes_original` is a short original note only.
3. **Provenance required.** Every lead has `source_url` and `source_name`. Prefer operator sites over aggregators when both exist.
4. **No auth or CAPTCHA bypass** in any scraper note, plan, or script in this repo. If a source is behind a login or challenge, stop and record the URL only.
5. **Personal data.** Prefer omit personal emails and private phones. Public business contact details are facts for Research, not a mailing list.
6. **Dedup before append.** Same `dedupe_key` or same website host + similar name → update the existing line, do not duplicate.

## Research workflow

1. Pick a source from [`SOURCES.md`](SOURCES.md). Read [`LEGAL.md`](LEGAL.md).
2. Capture facts (name, type, county, country, public contact, website). Record `source_url`, `source_name`, `fetched_at`, `licence`.
3. Append one JSON object as a new line in `places.jsonl`. `status` starts as `lead`.
4. Do not implement scrapers in this ticket/folder. Collection may be manual or a later dedicated ticket.
5. Curators review → `reviewed` or `rejected`. Engineering import and curator publish → `promoted`.

Starter seed (2026-09-05): converted from [`docs/leads/CAMPSITE_LEADS.md`](../../docs/leads/CAMPSITE_LEADS.md). `fetched_at` on those rows is the conversion timestamp, not the original web fetch. That markdown file is archaeology; do not add new rows there.

## Ticket

Vault: [`ops/tickets/PRD-006.md`](../../ops/tickets/PRD-006.md) (store). Pipeline acceptance: [`ops/tickets/PRD-007.md`](../../ops/tickets/PRD-007.md). Promote-from-lead: [`ops/tickets/PRD-008.md`](../../ops/tickets/PRD-008.md). Counsel before publish: [`ops/tickets/PRD-009.md`](../../ops/tickets/PRD-009.md). Bulk import / coverage: [`ops/tickets/PRD-002.md`](../../ops/tickets/PRD-002.md).
