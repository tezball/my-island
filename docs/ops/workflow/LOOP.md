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
  → checkout latest main; land via short-lived docs PR (CI auto-merges)
  → delete the branch after merge
  → confirm main CI green; if red, fix on a new PR
code / mixed implement
  → ticket+plan already on main at implement
  → branch wf/<id>-… from main; PR includes any docs that belong to that ticket
  → same close-out: delete branch → confirm main CI green, else fix
```

Happy path: pick → plan/docs on `main` → implement + PR → review comment → CI → squash-merge → delete branch → **confirm `main` CI green, else fix**.

## Docs on `main` (house rule)

| Situation | Do this |
|---|---|
| Session is docs-only (ticket status, plans, run notes, workflow notes, skills/rules under `.cursor/`, vault tests for those) | **Start from `main`.** Do not keep a long-lived docs feature branch. Open a tiny docs PR if branch protection requires it; squash-merge via CI; **delete the branch**. |
| Already on `wf/…` or `prd/…` implementing code | Fold related docs into **that** PR. Do not switch to a second docs branch mid-flight. |
| Intake / plan / status flip with no app code | Land on `main` first (docs PR). Then branch for code if needed. |

Do **not** use Cursor “memory” for this — it belongs in git ([[ops/workflow/SKILLS]]).

## Roles (separate sessions)

| Role | May | Must not |
|---|---|---|
| **Planner** | Write plans, set ticket toward `implement`, land docs on `main` | App code; wait on a human unless `gate: human` |
| **Implementer** | Branch after `implement` on `main`, code, meet [[ops/workflow/DOD]], `gh pr create`, `status: review` | Merge from chat; review own PR as required review |
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

1. Company-state docs → `main` (short docs PR + delete branch).
2. Feature branch only for code (or docs already in-flight on that branch).
3. PR title `<id>: <title>`; body links ticket + plan.
4. Never `--no-verify`. Never force-push `main`.
5. After merge: delete local and remote feature branches; confirm Actions on `main` are green — if not, fix and open another PR.
