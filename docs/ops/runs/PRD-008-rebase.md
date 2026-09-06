---
id: PRD-008
ticket: "[[ops/tickets/PRD-008]]"
role: implementer
started: 2026-09-06
finished: 2026-09-06
pr: https://github.com/tezball/my-island/pull/47
---

# Run PRD-008 rebase

Hat: implementer. Rebase of [#47](https://github.com/tezball/my-island/pull/47) (`cursor/prd-008-import-leads-a81e`) onto `main` at `2d8617f` (#52). Did not open a second PR. Did not merge.

## What happened

Cherry-picked the three feature commits onto `2d8617f`. Dropped stale merge commits. Conflicts: ticket/plan/runs/BOARD moved under `docs/ops/` — kept `[[ops/tickets/…]]` wikilinks; Flyway V6 stays provenance (`source_url`/`source_name`/`licence`/`lead_dedupe_key`), not grants. Draft-only import gates unchanged: `status=reviewed` only, force unpublished, 409 if published, no PRD-009 bypass.

## Result

success — branch includes `2d8617f`; force-with-lease to the same branch.

## Follow-up

Wait for GitHub mergeable CLEAN and CI (unit tests, catalog tests, compose stack). Humans merge.
