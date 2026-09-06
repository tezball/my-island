---
id: WF-019
ticket: "[[tickets/WF-019]]"
role: implementer
started: 2026-09-06
finished: 2026-09-06
pr: https://github.com/tezball/my-island/pull/31
---

# Run WF-019

Hat: [[agents/roles/eng-backend]]. Workshop step 6 — repeatable place-listing sim. Did not merge. Did not enable chaos. Did not overwrite [[tickets/WF-015]] / [[tickets/WF-016]] / [[tickets/WF-017]] / [[tickets/WF-018]].

## What happened

Rebased onto latest `main` after hotfix #33 restored live `ops/` (`b1aebb7`). Sim ticket is **WF-019**. Does not overwrite [[tickets/WF-016]]. Create body uses stub contract: `categoryId`, `countyId`, `latitude`, `longitude`.

Thin harness:

- `./scripts/sim-place-listing.sh` (one command) → `ops/scripts/sim_place_listing.py`
- Runbook [[runbooks/PLACE_LISTING_SIM]]
- Fast fake-HTTP tests; `@pytest.mark.stack` live iteration

## Result

success — PR https://github.com/tezball/my-island/pull/31

## Follow-up

Human merges. Agents do not merge.
