---
name: pr-loop
description: >-
  Drive one my-island pull request until it is reviewed, green, and ready for
  automerge. Use when a PR has failing GitHub Actions, review comments,
  changes requested, or is green but missing a valid Approve.
---

# PR loop

Read `docs/ops/workflow/PR-LOOP.md`, `docs/ops/workflow/SAFETY.md`, and `docs/ops/workflow/CI.md`. One PR, then stop.

Order:

1. Draft or fork: stop.
2. A required Actions check-run failed (`unit tests`, `catalog tests`, `web tests`, `compose stack`, or `chaos monkey` / `zap baseline`): push one fix on the PR branch. Jenkins commit statuses are not that failure.
3. `CHANGES_REQUESTED` or an open review comment: push one fix. Do not approve.
4. Those four checks are success and no valid non-author `APPROVED` on the head SHA: Approve or Request changes. Nits in the review body only. Do not push.
5. Else stop. `automerge.yml` squash-merges. Do not `gh pr merge`.

At most 3 `pr-loop fix` comments per PR. Never push `main`, force-push, close the PR, or mark a draft ready.
