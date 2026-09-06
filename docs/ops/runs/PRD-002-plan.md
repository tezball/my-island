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

Ticket [[ops/tickets/PRD-002]] → `status: plan`, `plan: [[ops/plans/PRD-002]]`. Board sync. Vault test `test_prd_002_curator_seed_plan`. `python3 -m pytest ops/tests -q -m "not stack"` → 79 passed, 4 deselected.

Branch `cursor/prd-002-plan-8f51` pushed. Draft PR create returned **403** (GitHub MCP PAT and git integration token both lack pulls:write). Compare: https://github.com/tezball/my-island/compare/main...cursor/prd-002-plan-8f51?expand=1

## Result

success on the plan — human (or a token with `pull_requests: write`) opens the draft PR titled `PRD-002: plan curator seed pipeline`, then may merge; set [[ops/tickets/PRD-002]] `implement` before Eng codes the spreadsheet importer.

## Follow-up

Implementer session after `status: implement`. Do not publish. Do not import `data/leads/places.jsonl` with the spreadsheet script.
