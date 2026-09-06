---
id: PRD-008
ticket: "[[tickets/PRD-008]]"
role: planner
started: 2026-09-06
finished: 2026-09-06
pr: https://github.com/tezball/my-island/pull/43
---

# Run PRD-008 plan

## What happened

Planner hat. Wave 1 vault PR #40 is merged. Wrote [[plans/PRD-008]] (`status: draft`) for a **small implementable slice** — no application/Java/Spring in this session.

Pick: `ops/scripts/import_leads.py` POSTs CreatePlaceRequest-style JSON at the catalog stub (`POST /api/v1/places`, `:8081`), plus the smallest stub expansion (provenance columns + `lead_dedupe_key` upsert). Catalog JSON camelCase; lead keys stay `schema.json`. Draft only; skip/reject per ticket; NI/IE map onto 32 county rows; no country table; PRD-009 not waived.

Ticket [[tickets/PRD-008]] → `status: plan`, `plan: [[plans/PRD-008]]`. Vault test updated so PRD-008 may be `plan`. Board sync.

## Result

success — human may merge the plan PR; set [[tickets/PRD-008]] `implement` before Eng codes the importer.

## Follow-up

Implementer session after `status: implement`. Counsel remains [[tickets/PRD-009]]. Do not import the seed JSONL until curators mark rows `reviewed`.
