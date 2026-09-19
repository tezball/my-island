---
id: WF-048
ticket: "[[ops/tickets/WF-048]]"
role: implementer
started: 2026-09-19
finished: 2026-09-19
pr: https://github.com/tezball/my-island/pull/100
cssclasses:
  - run
---

# Run WF-048

## What happened

Bug hunt after PRD-015 / WF-040 on `origin/main` (`2f96998`). fishing-journals.com never got that SHA: `/actuator/info` is still 13 Sep PWA HTML, password login and VisitIntent 404, anonymous Place POST 201, 101 published POIs, health UP. GHA `push` on `main` last ran 2026-09-06 — `GITHUB_TOKEN` squash-merge does not start push CI, so Jenkins `H/5` sees missing checks and skips.

VisitIntent on local compose (`2f96998`) passed the hunt (anon GET + `beenCount`, Place POST 401/403, password guest, upsert, private lists, public been only).

This PR: `workflow_dispatch` after automerge; gate falls back to merged PR head checks; Jenkins runs the gate script from `origin/main`. Rebased onto `origin/main` after #99 took WF-047 for the DX handbook; this follow-up is WF-048.

## Result

success (PR open; chat does not merge)

## Follow-up

Jenkins on the host with `MOCK_PROD_*` deploys after this lands and dispatch paints checks on the new `main` SHA. Agents never SSH.
