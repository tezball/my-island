---
id: WF-015
ticket: "[[ops/tickets/WF-015]]"
role: implementer
started: 2026-09-06
finished: 2026-09-06
pr:
---

# Run WF-015

## What happened

Terry authorized KEEP/DROP strip onto `main`. Deleted inherited `docs/` marketplace/booking/UI/domain trees and `.idea`. Catalog stub, compose happy path, `compose.chaos.yml`, Actuator health+prometheus, obs sidecars, `scripts/dev`, STACK-E2E / E2E-001 / canvas / `product/STACK.md` kept. Chaos Monkey not stripped.

Local: vault 41 passed; catalog `mvnw test` 12 passed; compose create/list/get 201/200/200; health UP + PostGIS; prometheus scrapeable; default catalog has no chaos profile.

Pushed strip to `main` at `07bf00c`. No follow-up PR.

## Result

success

## Follow-up

None for this strip. Product SIGNED kill-list pointer remains on [[ops/tickets/PRD-005]].
