---
id: WF-019
ticket: "[[tickets/WF-019]]"
role: implementer
started: 2026-09-06
finished: 2026-09-06
pr: https://github.com/tezball/my-island/pull/31
---

# Run WF-019 rebase

Hat: [[agents/roles/eng-backend]]. Rebase PR #31 onto latest `main` after hotfix #33 restored live `ops/` / `product/` / `data/leads/`. Did not merge. Did not overwrite [[tickets/WF-016]].

## What happened

`cursor/sim-place-listing-0d9f` was based on `be8562e` (pre-hotfix layout). That conflicted with #33 (`3193973`) and #32 (`b1aebb7`).

Replayed WF-019 onto repo-root `ops/` (ticket, plan, board, harness). Did not leave live notes under the old docs-folder tree:

- Kept `./scripts/sim-place-listing.sh` → `ops/scripts/sim_place_listing.py`
- Stub fields stay `categoryId` / `countyId` / `latitude` / `longitude`
- No `ops` symlink; Dockerfile still `COPY ops/tests/requirements.txt`
- WF-016 remains Automation mcp-grafana (ready). WF-020 stays the CI hotfix ticket.

## Result

success — PR https://github.com/tezball/my-island/pull/31 merged. Run closed.

## Follow-up

None. Ticket is `done`.
