---
id: PRD-008
ticket: "[[ops/tickets/PRD-008]]"
role: implementer
started: 2026-09-06
finished: 2026-09-06
pr: https://github.com/tezball/my-island/pull/47
---

# Run PRD-008 implement

## What happened

Implementer hat. CEO cleared after plan merge (#43). Branched from `main` tip `3120869`.

Landed the plan slice only:

- Flyway `V6__place_provenance.sql`: `source_url`, `source_name`, `licence`, unique nullable `lead_dedupe_key`
- Catalog POST upsert by `leadDedupeKey` (draft insert/update, 409 if published, force unpublished)
- `ops/scripts/import_leads.py` stdlib CLI; pytest without compose; CatalogTest for provenance / upsert / 409 / no country table

Ticket [[ops/tickets/PRD-008]] → `status: review`, `pr: https://github.com/tezball/my-island/pull/47`. Plan `approved`. Board sync.

Verify: `python3 -m pytest ops/tests -q -m "not stack"` (74 passed). `services/catalog/mvnw test` (17 tests, BUILD SUCCESS).

## Result

success — PR open, not merged (humans merge).

## Follow-up

Human merge when CI is green. Do not import the seed JSONL until curators mark rows `reviewed`. Counsel remains [[ops/tickets/PRD-009]].
