---
id: PRD-009
ticket: "[[ops/tickets/PRD-009]]"
role: planner
started: 2026-09-06
finished: 2026-09-06
pr:
---

# Run PRD-009 plan

## What happened

Planner hat (`mvp-trust`). Callsign from [[ops/agents/mvp-team]]. One ticket: [[ops/tickets/PRD-009]].

Wrote [[ops/plans/PRD-009]] (`status: draft`) as the **policy note**: leads ≠ publish; counsel required before bulk publish from scraped/aggregated content; sign-off is a human name+date in git; [`data/leads/schema.json`](../../../data/leads/schema.json) (PR #14) is the only lead schema; [`product/BRIEFING.md`](../../product/BRIEFING.md) §6 linked as **partially** answered; [`product/SIGNED.md`](../../product/SIGNED.md) and [`data/leads/LEGAL.md`](../../data/leads/LEGAL.md) linked, not rewritten; no STACK rewrite.

Ticket → `status: plan`, `plan: [[ops/plans/PRD-009]]`. Vault test `test_leads_pipeline_tickets_exist` allows `plan` and still asserts `!= implement`. HOME snapshot no longer says PRD-009 is “still `ready`”. `python3 ops/scripts/board_sync.py`. `python3 -m pytest ops/tests -q -m "not stack"` → 78 passed, 4 deselected.

No application code. Did not set `implement`. Did not edit PRD-002 / PRD-003 / PRD-010 / E2E-001 / WF-003 / PRD-000 plan.

## Result

success — human may merge the plan PR; set [[ops/tickets/PRD-009]] `implement` only after reading the plan. Counsel sign-off table stays empty until Terry + counsel.

## Follow-up

Implementer session after `status: implement`: docs-only audit (runbooks still unpublished-leads); do not fill sign-off; do not merge.
