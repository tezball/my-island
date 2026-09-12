---
id: WF-035
ticket: "[[ops/tickets/WF-035]]"
role: implementer
started: 2026-09-12
finished: 2026-09-12
pr: https://github.com/tezball/my-island/pull/80
cssclasses:
  - run
---

# Run WF-035 Gherkin plumbing

## What happened

Enough app exists for **contract** E2E (catalog create/list/get). No `web/` — Playwright stays out. Landed Cucumber-JVM on Testcontainers: `features/place_catalog.feature` (publish + 404 + 400). Moved those HTTP cases out of `CatalogTest`. `./mvnw -B test`: 18 run, 0 fail (3 Gherkin).

## Result

success

## Follow-up

Browser plumbing waits on [[ops/tickets/PRD-003]]. More Gherkin when auth exists.
