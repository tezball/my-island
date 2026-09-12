---
id: WF-035
ticket: "[[ops/tickets/WF-035]]"
role: planner
started: 2026-09-12
finished: 2026-09-12
pr: https://github.com/tezball/my-island/pull/79
cssclasses:
  - run
---

# Run WF-035 tighten lanes

## What happened

CTO: BDD and integration should be **one** (Gherkin = what, Testcontainers = how it runs). Too many overlapping sections. Collapsed TEST_STACK / workshop / canvas / DoD to **five lanes**: how · what (contract) · wiring · browser · operate.

## Result

success

## Follow-up

Gherkin skin on the existing `catalog` job (replace duplicate HTTP tests). Gatling stays operate, same lane as sim.
