---
title: QA dashboard
type: dashboard
owner: eng-qa
cssclasses:
  - role-home
---

# QA / test

Role: [[ops/agents/roles/eng-qa]]. Mix: [[ops/workflow/TEST_STACK]] · [[ops/workshops/cto-test-stack]]. E2E workshop: [[ops/workshops/e2e-place-stub]] · [[ops/tickets/E2E-001]].

> [!check] Focus
> Verify steps, sims, E2E. Tests are gates **and** agent tools. Playwright waits for a consumer UI.

- Today vs want: [[ops/workflow/TEST_STACK]]
- Sim: [[ops/runbooks/PLACE_LISTING_SIM]]
- STACK-E2E: [[ops/runbooks/STACK_E2E_PLACE_STUB]]

![[ops/dashboards/qa.base]]

## Dataview

```dataview
TABLE status, priority, owner, title
FROM "ops/tickets"
WHERE id AND (startswith(file.name, "E2E-") OR owner = "eng-qa")
SORT status ASC, id ASC
```
