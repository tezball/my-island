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
3. `CHANGES_REQUESTED` or an open review comment: push one fix. Do not approve. A fixer updates the ticket and the docs to match the PR and leaves the change in place.
4. Those four checks are success and no valid non-author `APPROVED` on the head SHA: Approve or Request changes. The change and the text of the PR are the path forward. If the docs say something else, that is an oversight and the docs need updating. Every PR leaves the ticket, the code, and the docs in sync. A review that finds them apart asks for the stale ticket or doc to be updated in that same PR. It does not ask to revert the change the PR describes. Nits in the review body only. Do not push.
5. Else stop. `automerge.yml` squash-merges. Do not `gh pr merge`.

At most 3 `pr-loop fix` comments per PR. Never push `main`, force-push, or close the PR. Automerge marks a same-repo draft ready after CI succeeds. Forks and red checks stay drafts.
