---
id: WF-049
ticket: "[[ops/tickets/WF-049]]"
role: planner
started: 2026-09-20
finished: 2026-09-20
pr: https://github.com/tezball/my-island/pull/103
cssclasses:
  - run
---

# Run WF-049 plan

## What happened

Planner/docs. Terry asked B vs C for Cloud→Jenkins deploy. **Lock C:** self-hosted Cursor worker on the Mac mini that already has Jenkins + `MOCK_PROD_*` + the SSH key. Do not pick B (cloud HTTPS to Jenkins) or D (GHA SSH). Key stays in Jenkins. Agents never SSH. Not a GitHub production Environment.

Filed [[ops/tickets/WF-049]] + approved plan. Pointed [[ops/tickets/WF-042]] verify at the worker path (MCP trigger shape stays on 042). [[ops/tickets/WF-040]] / [[ops/tickets/WF-048]] stay git-done / `review`.

## Result

success

## Follow-up

Implementer: worker on the mini; loopback Jenkins trigger; no secrets in docs.
