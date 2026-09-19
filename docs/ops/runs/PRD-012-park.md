---
id: PRD-012
ticket: "[[ops/tickets/PRD-012]]"
role: planner
started: 2026-09-19
finished: 2026-09-19
pr: "https://github.com/tezball/my-island/pull/95"
cssclasses:
  - run
---

# Run PRD-012 park (wrong-shape CHK/ME)

## What happened

Follow-up after [PR #94](https://github.com/tezball/my-island/pull/94) merged. Reviewer hazard: `next_ticket.py` implementer pick is `status: implement` by P0 then id, so PRD-012/013 would beat [[ops/tickets/PRD-015]].

Set [[ops/tickets/PRD-012]] and [[ops/tickets/PRD-013]] to `blocked` (script skips anything except `ready` / `implement` / `review`). `blocked_reason` notes wrong shape; VisitIntent is the slice. Synced [[ops/BOARD]]. Vault tests updated. No app code. Did not push the merged `cursor/poi-mvp-planner-17f0` branch.

## Result

success (docs PR; chat does not merge)

## Follow-up

Implementers take [[ops/tickets/PRD-010]] then other `implement` P0s (WF-040…, PRD-015). Unblock 012/013 only when Product wants signed CHK/ME.
