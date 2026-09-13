---
title: Agent loop
type: workflow
---

# Agent loop

Fully automated path, local-first. Cloud automations are the same loop with a git trigger.

**`main` docs are company state** (Jira + Confluence). Tickets, plans, board, and handbook live on `main` so every agent sees what is in flight.

**Prefer no human in the loop.** Keep status keys; agents / Automations / CI advance them. Humans only for `gate: human`, `blocked`, counsel before customer prod, or IdP console credentials.

```
docs-only (tickets, plans, runs, BOARD, LOOP, skills, rules)
  → worktree from origin/main; land via short-lived docs PR (CI auto-merges)
  → delete the branch + remove worktree after merge
  → confirm main CI green; if red, fix on a new PR
code / mixed implement
  → ticket+plan already on main at implement
  → sibling worktree + branch wf/<id>-… from main ([[WORKTREES]]); PR includes docs for that ticket
  → same close-out: delete branch + remove worktree → confirm main CI green, else fix
```

Happy path: pick → plan/docs on `main` → implement in a worktree + PR → review comment → CI → squash-merge → delete branch + remove worktree → **confirm `main` CI green, else fix**.

`main` is what the playground VPS should run ([[ops/tickets/WF-032]]). Feature branches never deploy there. Checkout layout: [[WORKTREES]].

## Docs on `main` (house rule)

| Situation | Do this |
|---|---|
| Session is docs-only (ticket status, plans, run notes, workflow notes, skills/rules under `.cursor/`, vault tests for those) | **Worktree from `origin/main`.** Tiny docs PR; CI squash-merges; **delete the branch and remove the worktree**. Primary clone stays on `main`. |
| Already on `wf/…` or `prd/…` implementing code | Fold related docs into **that** PR. Do not open a second docs worktree mid-flight. |
| Intake / plan / status flip with no app code | Land on `main` first (docs PR from a short worktree). Then a new worktree for code if needed. |

Do **not** use Cursor “memory” for this — it belongs in git ([[ops/workflow/SKILLS]]).

## Roles (separate sessions)

| Role | May | Must not |
|---|---|---|
| **Planner** | Write plans, set ticket toward `implement`, land docs on `main` | App code; wait on a human unless `gate: human` |
| **Implementer** | Worktree after `implement` on `main`, code, meet [[ops/workflow/DOD]], `gh pr create`, `status: review` | Merge from chat; review own PR as required review; feature-commit in the primary clone |
| **Reviewer** | Comment on PR | `gh pr merge` from chat; push |

Same person may wear all three hats. **Same agent session must not.**

## Ticket states

`inbox` → `ready` → `plan` → `implement` → `review` → `done`

Statuses stay. `plan` may be brief (same docs PR can move to `implement`). Use `blocked` / `gate: human` when a person must act.

[[ops/BOARD]] columns map to those keys. `type: epic` is not picked by `next_ticket.py`.

## Commands

```bash
python3 ops/scripts/next_ticket.py
python3 ops/scripts/board_sync.py
python3 ops/scripts/new_ticket.py --prefix PRD --type story --title "…"
./scripts/app start|stop|test
./scripts/dev test
# Fast OS tests: python3 -m pytest ops/tests -q -m "not stack"
```

## Git convention

1. **Primary clone stays on `main`.** Company-state docs still land via short docs PR + delete branch ([[WORKTREES]]).
2. **Implement in a sibling worktree** (`wf/<id>-slug` or `prd/<id>-slug`). One session, one tree, one branch. Commands: [[ops/runbooks/WORKTREE]].
3. PR title `<id>: <title>`; body links ticket + plan.
4. Never `--no-verify`. Never force-push `main`. Never deploy a feature branch to the VPS.
5. After merge: delete local and remote feature branches, **remove the worktree**, `git pull --ff-only` on the primary; confirm Actions on `main` are green — if not, fix on a new worktree.
6. One laptop Compose (`name: my-island`). Do not start the stack from two worktrees at once.
