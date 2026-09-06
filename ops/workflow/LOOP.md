---
title: Agent loop
type: workflow
---

# Agent loop

Fully automated path, local-first. Cloud automations are the same loop with a git trigger.

```
ticket ready
  → PLANNER writes plans/<id>.md, status = plan
  → human (or later: label approved) sets status = implement
  → IMPLEMENTER branches, codes, opens PR, status = review
  → REVIEWER comments on the PR (never merge, never push the branch)
  → human merges
  → IMPLEMENTER or hook sets status = done, writes runs/<id>-<n>.md
```

## Roles (separate sessions)

| Role | May | Must not |
|---|---|---|
| **Planner** | Create/update `plans/`, set ticket `status: plan` | Touch application code, open a feature PR |
| **Implementer** | Code, tests, `gh pr create`, set `status: review`, `pr:` URL | Merge, review its own PR as the required review, prod credentials |
| **Reviewer** | Read diff, `gh pr comment`, request changes | `gh pr merge`, push commits, change ticket to `done` |

The same human may wear all three hats. **The same agent session must not.** If you planned it, stop. A new chat (or the PR-opened automation) reviews it.

## Ticket states

`inbox` → `ready` → `plan` → `implement` → `review` → `done`

`blocked` from any state. Reason in the ticket body.

`type: epic` appears on the board but is not picked by `next_ticket.py`. Implement children.

## Commands

```bash
python3 ops/scripts/next_ticket.py          # next ready or implement (skips epics)
python3 ops/scripts/board_sync.py           # regenerate BOARD.md from tickets
python3 ops/scripts/new_ticket.py --prefix PRD --type story --title "…"
./ops/scripts/start-local.sh                # Grafana / Loki / Prometheus / Postgres (same as ./scripts/dev up)
./scripts/dev test                           # pytest (CI uses this too)
# Fast OS tests (no Docker): python3 -m pytest ops/tests -q -m "not stack"
```

## PR convention

- Branch: `wf/<id>-short-slug` (workflow) or `prd/<id>-short-slug` (later)
- Title: `<id>: <ticket title>`
- Body: link `ops/tickets/<id>.md` and `ops/plans/<id>.md`
- Never `--no-verify`. Never force-push `main`.
