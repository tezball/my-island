---
id: PRD-007
ticket: "[[ops/tickets/PRD-007]]"
role: planner
started: 2026-09-06
finished: 2026-09-06
pr: https://github.com/tezball/my-island/pull/40
---

# Run PRD-007 plan (Wave 1 vault)

## What happened

Product hat. Terry (via CEO) green-lit Research Wave 1. Vault/docs only:

- [`product/WAVE-1.md`](../../product/WAVE-1.md) — acceptance (leads ≠ publish; create/update = JSONL by `dedupe_key` then PRD-008 draft Place; counsel PRD-009 intact; stub field map)
- [[ops/plans/PRD-007]] — schema-only bar, pytest, idempotency, provenance
- Ticket notes: [[ops/tickets/PRD-007]] → `plan`; [[ops/tickets/PRD-008]] draft-Place AC + CreatePlaceRequest-style map; [[ops/tickets/PRD-009]] Wave 1 does not waive counsel
- Pointers: `data/leads/README.md`, `product/README.md`, `product/SIGNED.md` Status (no MVP rewrite)

No app/Java/Spring. No scrapers. No auto-publish.

## Result

success — human may merge the docs PR; set [[ops/tickets/PRD-007]] `implement` before Research deposits.

## Follow-up

Eng plans import against [[ops/tickets/PRD-008]]. Counsel remains [[ops/tickets/PRD-009]].
