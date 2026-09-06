---
id: WF-003
ticket: "[[ops/tickets/WF-003]]"
role: planner
started: 2026-09-06
finished: 2026-09-06
pr:
---

# Run WF-003

## What happened

Planner only (callsign mvp-factory, hat automation-expert). Ticket [[ops/tickets/WF-003]] was `ready`. Wrote [[ops/plans/WF-003]] from [[ops/templates/plan]]: three automations (PR reviewer, board runner one-ticket, re-review on push), paste-ready prompts, exact Automations editor clicks. Board runner skips epics and skips product code unless `PRD-*` **and** `status: implement`. No auto-merge. No prod. No Jenkins.

Set ticket `status: plan` and `plan: "[[ops/plans/WF-003]]"`. `python3 ops/scripts/board_sync.py`. Pointed [[ops/workflow/AUTOMATIONS]] enablement at the plan. Moved WF-003 on [[docs/HOME]] from Ready to Planning. Vault test `test_wf_003_automations_plan`. `python3 -m pytest ops/tests -q -m "not stack"` → 79 passed, 4 deselected.

Did not Save/Activate automations (cannot from chat). Did not merge. Did not add product UI.

## Result

success

## Follow-up

Human: merge this plan PR; then Save + Activate the three automations using the click list in [[ops/plans/WF-003]]. Paste dashboard URLs (UUIDs only) on the ticket. Set plan `approved` / ticket `implement` then `done` after they are Enabled. Do not ask an agent to finish the Automations UI.
