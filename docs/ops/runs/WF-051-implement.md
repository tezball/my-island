---
id: WF-051
ticket: "[[ops/tickets/WF-051]]"
role: implementer
started: 2026-09-20
finished: 2026-09-20
pr:
cssclasses:
  - run
---

# Run WF-051

## What happened

Implementer. Worktree `wf/WF-051-jenkins-pr-checks`. Jenkinsfile posts the four GHA job names as commit statuses, copies `$WORKSPACE` to a host-visible `my-island-ci-<job>` tree, isolates stack compose (`my-island-ci` + remapped ports), persists Maven/npm caches. GHA test jobs left in place. Chat does not merge.

## Result

success (vault tests). Live Jenkins rebuild is the PR’s proof of statuses.

## Follow-up

Human: retarget branch protection after a green Jenkins PR. Then delete GHA test jobs + teach `gate_mock_prod_deploy.py` statuses. Then private repo.
