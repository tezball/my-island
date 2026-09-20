---
name: ops-loop
description: >-
  Plan, implement, or review work from the docs/ Obsidian vault. Use when the
  user mentions tickets, the board, WF- ids, writing a plan, opening a PR, or
  reviewing a PR for this repo. Also use at the start of any implementation
  session in my-island.
---

# Ops loop

Read `docs/ops/HOME.md`, `docs/ops/CHARTER.md`, `docs/ops/workflow/LOOP.md`, `docs/ops/workflow/WORKTREES.md`, `docs/ops/workflow/SAFETY.md`. Then:

```bash
python3 ops/scripts/next_ticket.py --role auto
```

Pick **one** role. Skip `type: epic`. Do not plan and implement and review in the same session.

**Docs on `main`.** If the session is docs-only (tickets, plans, runs, BOARD, workflow notes, `.cursor` skills/rules), add a **short-lived worktree from `origin/main`**, open a docs PR, let CI merge, **delete the branch and remove the worktree**, then **confirm `main` CI is green** (fix on a new PR if red). Primary clone stays on `main`. **Exception:** already in a `wf/…` / `prd/…` worktree for code — fold related docs into that PR. Layout: `docs/ops/workflow/WORKTREES.md`.

**`main` docs = company state.** Prefer no human gate; use `gate: human` / `blocked` only when required.

Roster: `docs/ops/agents/_index.md`. Runbook: `docs/ops/runbooks/TICKET_LOOP.md`. House stack: `docs/product/STACK.md`.

## Planner (`--role planner`)

1. Ensure ticket is on `main` (or land intake on `main` first).
2. Write `docs/ops/plans/<id>.md` (`status: approved` by default).
3. Set ticket `plan:` and usually `status: implement` (unless `gate: human`).
4. `board_sync.py`. Land via docs PR on `main`. Delete branch + remove worktree after merge.
5. Run note. Stop — do not implement code in this session.

## Implementer (`--role implementer`)

1. Plan + `status: implement` already on `main`.
2. Sibling worktree `wf/<id>-short-slug` from latest `main` (`docs/ops/runbooks/WORKTREE.md`). Do not feature-commit in the primary clone.
3. Boot stack if needed: `./scripts/app start`.
4. Implement only that ticket; meet [[ops/workflow/DOD]] (draft) + verify; `gh pr create`.
5. Set `pr:` + `status: review`; board_sync; run note. Do not merge from chat.

## Reviewer (`--role reviewer`)

1. `gh pr view` / `gh pr diff`.
2. SAFETY + DoD (blockers only). **May** submit Approve or Request changes. Nits in the review body only — no inline threads for nits. Do not merge or push. Do not approve a PR you implemented.

## Board hygiene

Ticket frontmatter change → `board_sync.py`. After any docs or feature PR merges → delete the remote/local branch, remove the worktree, `git pull --ff-only` on the primary → confirm Actions on `main` are green (else fix).
