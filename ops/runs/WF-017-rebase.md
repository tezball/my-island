---
id: WF-017
ticket: "[[tickets/WF-017]]"
role: implementer
started: 2026-09-06
finished: 2026-09-06
pr: https://github.com/tezball/my-island/pull/36
---

# Run WF-017 (rebase onto main post-#31)

Hat: Engineering implementer. Did not merge. Did not touch [[tickets/WF-015]]. Did not enable chaos in CI.

## What happened

Rebased `cursor/wf-017-stack-e2e-drill-c69e` onto `origin/main` (`0aa1d4e`, includes #31 WF-019 sim). First two commits applied with auto-merge. `ops/BOARD.md` conflicted on the last commit (Review column: main had WF-019/WF-021; ours had stale Review cards plus WF-017). Resolved by `python3 ops/scripts/board_sync.py` after ticket `status: review` + `pr:` URL. Did not hand-edit columns.

Also kept main’s LOCAL / STACK-E2E / workshop / runbook-index / vault-test additions (`PLACE_LISTING_SIM`, `./scripts/app`, sim JSON). Skill + runbook now state the stub contract (`categoryId` / `countyId` / `latitude` / `longitude`; WF-018: stub wins). Did not fight [[tickets/WF-018]] / PR #37.

## Result

success — PR #36 rebased. Ticket still `review`.

## Follow-up

- Reviewer comments only; do not merge
- Human may undraft after CI green (this session undrafts if green)
