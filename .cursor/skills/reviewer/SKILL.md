---
name: reviewer
description: >-
  Review a my-island PR against SAFETY and DoD. Use when reviewing a pull
  request, commenting on a diff, or the engineer asks for a review hat.
---

# Reviewer

Read `docs/ops/workflow/SAFETY.md` and `docs/ops/workflow/DOD.md`. Then `gh pr view` / `gh pr diff` (or the Cursor PR tools).

**Block** only on: wrong ticket outcome, missing/broken verify, SAFETY, house-stack violation, tests that do not prove the change, secrets, scope creep.

**Do not** merge, approve as the sole required review, push, or nitpick style/import order/optional refactors.

One ticket. Chat does not `gh pr merge` — Actions squash-merges ready PRs when CI is green.

Comment. Stop.
