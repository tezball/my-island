---
id: PRD-008
ticket: "[[tickets/PRD-008]]"
role: product
started: 2026-09-05
finished: 2026-09-05
pr: https://github.com/tezball/my-island/pull/16
---

# Run PRD-008 product AC amend

## What happened

Product ticket amend only. CEO (2026-09-05): Architecture + Product agreed leads schema uses `country: IE|NI`; catalog seeds 32 counties as data (NI included). Promote must map NI leads onto those county rows — do not grow a second country model in Spring.

- [[tickets/PRD-008]] Notes: one Ireland geography model; map `country: NI` (and `IE`) onto the catalog’s 32 county rows; no Spring country table/enum. Verify checklist item for that mapping.
- [[tickets/PRD-007]] Notes: Research county hints must fit the same 32-county list.

No application code. No STACK rewrite. Tickets stay `ready`.

## Result

success

## Follow-up

Humans merge. Planner still writes `ops/plans/PRD-008.md` when the ticket is picked.
