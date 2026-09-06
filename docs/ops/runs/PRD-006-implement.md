---
id: PRD-006
ticket: "[[ops/tickets/PRD-006]]"
role: implementer
started: 2026-09-05
finished: 2026-09-05
pr: https://github.com/tezball/my-island/pull/14
---

# Run PRD-006

## What happened

Added `data/leads/` as the Research source of truth. Migrated 29 campsites from `docs/leads/CAMPSITE_LEADS.md` into `places.jsonl` with provenance. Schema + README + LEGAL/SOURCES. Linked [[ops/tickets/PRD-002]] (import later; not this PR). No scrapers, no Spring, no `product/SIGNED.md` edits. Pytest unit tests green (30 passed, 2 stack deselected).

## Result

success — PR #14 merged. Run closed.

## Follow-up

None. Ticket is `done`. Do not implement Spring import until [[ops/tickets/PRD-002]] is `implement` with a plan. Counsel before publish (`data/leads/LEGAL.md`).
