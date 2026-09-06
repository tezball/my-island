---
id: PRD-002
ticket: "[[ops/tickets/PRD-002]]"
role: planner
started: 2026-09-06
finished: 2026-09-06
pr:
---

# Run PRD-002 plan

## What happened

Planner hat only (Wave 1 callsign **mvp-seed**). Wrote [[ops/plans/PRD-002]] (`status: draft`) for curator **create**, UTF-8 **spreadsheet** → `CreatePlaceRequest`, **name + 250 m proximity** dedup, required **source/licence**, and **coverage** by 32 counties × category data. No application/Java/Spring in this session.

Leads JSONL stays [`data/leads/schema.json`](../../data/leads/schema.json). Do not redo [[ops/tickets/PRD-008]] `import_leads.py`. Counsel/publish remains [[ops/tickets/PRD-009]]. No auto-publish, no booking, no consumer PWA.

Ticket [[ops/tickets/PRD-002]] → `status: plan`, `plan: [[ops/plans/PRD-002]]`. Board sync. Vault test `test_prd_002_curator_seed_plan`.

## Result

success — human may merge the plan PR; set [[ops/tickets/PRD-002]] `implement` before Eng codes the spreadsheet importer.

## Follow-up

Implementer session after `status: implement`. Do not publish. Do not import `data/leads/places.jsonl` with the spreadsheet script.
