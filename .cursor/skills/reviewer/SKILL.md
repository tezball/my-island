---
name: reviewer
description: >-
  Review a my-island PR against SAFETY and DoD. Use when reviewing a pull
  request, commenting on a diff, or the engineer asks for a review hat.
---

# Reviewer

Read `docs/ops/workflow/SAFETY.md` and `docs/ops/workflow/DOD.md`. Then `gh pr view` / `gh pr diff` (or the Cursor PR tools).

**Block** only on: wrong ticket outcome, missing/broken verify, SAFETY, house-stack violation, tests that do not prove the change, secrets, scope creep.

**May** submit GitHub **Approve** or **Request changes**. Nits belong in the review **body**, not inline threads.

**Do not** merge, push, nitpick style/import order/optional refactors, or Approve a PR you implemented.

One ticket. Chat does not `gh pr merge` — Actions squash-merges ready PRs when the four GHA jobs are green **and** a valid non-author `APPROVED` exists ([[ops/tickets/WF-050]]).

Comment (or Approve / Request changes). Stop.
