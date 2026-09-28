---
id: WF-040
ticket: "[[ops/tickets/WF-040]]"
role: implementer
started: 2026-09-28
finished: 2026-09-28
pr: https://github.com/tezball/my-island/pull/146
cssclasses:
  - run
---

# Run WF-040 signal

## What happened

Replaced the `H/5` timer on Jenkins `deploy-mock-prod`. `mock-prod signal` starts that one job after CI succeeds on `main`. Job DSL `genericTrigger` in `triggers { }`, credential `deploy-mock-prod-trigger` (`JENKINS_ADMIN_PASSWORD`). URL name `JENKINS_URL`. Gate unchanged. No SSH. Did not click Build. Did not merge.

## Result

success

## Follow-up

Reviewer comments only. Do not `gh pr merge`. Public `gitCommit` still has to match `origin/main` after the host Jenkins image is recreated with `generic-webhook-trigger` and the Actions secrets are set.
