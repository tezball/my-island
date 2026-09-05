---
name: ops-loop
description: >-
  Plan, implement, or review work from the ops/ Obsidian vault. Use when the
  user mentions tickets, the board, WF- ids, writing a plan, opening a PR, or
  reviewing a PR for this repo. Also use at the start of any implementation
  session in my-island.
---

# Ops loop

Read `ops/HOME.md`, `ops/CHARTER.md`, `ops/workflow/LOOP.md`, `ops/workflow/SAFETY.md`. Then:

```bash
python3 ops/scripts/next_ticket.py --role auto
```

Pick **one** role. Skip `type: epic` (work a child). Do not plan and implement and review in the same session.

Roster: `ops/agents/_index.md`. Runbook: `ops/runbooks/TICKET_LOOP.md`. New tickets: `python3 ops/scripts/new_ticket.py`. App code is disposable (`ops/company/SCAFFOLDING.md`). House stack: `product/STACK.md` (Spring, Vite+React PWA not Next, PostGIS, Grafana MCP).

## Planner (`--role planner`)

1. Open the ticket path printed by `next_ticket.py`.
2. Write `ops/plans/<id>.md` from `ops/templates/plan.md`.
3. Set ticket `status: plan` and `plan: "[[plans/<id>]]"`.
4. `python3 ops/scripts/board_sync.py`.
5. Commit on `wf/<id>-plan` and open a PR **only if** the plan is large. Small plans may live on the ticket’s implement PR. Default: commit plan with the implementation unless the user asked for a plan-only PR.
6. Write `ops/runs/<id>-plan.md`. Stop. Ask a human to set `status: implement` on the ticket (or `status: approved` on the plan).

## Implementer (`--role implementer`)

1. Require a plan (`ops/plans/<id>.md`) and ticket `status: implement`.
2. Branch `wf/<id>-short-slug` from latest `main`.
3. Implement only that ticket. Run the ticket’s verify steps.
4. Open a PR with `gh pr create`. Body links ticket + plan.
5. Set ticket `pr: <url>` and `status: review`. Sync the board.
6. Write a run note. Stop. Do not merge.

## Reviewer (`--role reviewer`)

1. `gh pr view` / `gh pr diff` for the ticket’s `pr`.
2. Check SAFETY (no merge in the diff’s CI tricks, no secrets, no prod deploy, no MVP product scope on `WF-` tickets).
3. `gh pr comment` with findings. Request changes or “looks good, human may merge”.
4. Do not `gh pr merge`. Do not push.

## Board hygiene

If you change any ticket frontmatter, run `board_sync.py`. If local MCP is needed, `./ops/scripts/start-local.sh`.
