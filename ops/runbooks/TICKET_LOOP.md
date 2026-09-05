---
title: Ticket loop
type: runbook
---

# Ticket intake → implement → PR → verify → close

Full policy: [[workflow/LOOP]]. This is the checklist.

## 0. Who is running

```bash
python3 ops/scripts/next_ticket.py --role auto
```

One role per session. If you planned it, stop. Do not review your own implement PR as the required review.

Skip `type: epic`. Work a child.

## 1. Intake (Grok or orchestrator)

1. Is this already a ticket? Search `ops/tickets/` by title before creating.
2. Create with `python3 ops/scripts/new_ticket.py --prefix WF|PRD|INC --type story|bug|incident --title "…" --owner <role>`.
3. `status: inbox`. Promote to `ready` only when outcome and verify steps are written.
4. `python3 ops/scripts/board_sync.py`.

Product ideas → `PRD-*`. Agent-loop glue → `WF-*`. Live breakage → `INC-*` first, then a bug if needed.

## 2. Plan (planner)

1. Ticket must be `ready`.
2. Copy [[templates/plan]] to `ops/plans/<id>.md`.
3. Set ticket `plan: "[[plans/<id>]]"` and `status: plan`.
4. Sync the board. Commit on the implement branch unless the plan is huge (then a plan-only PR).
5. Write `ops/runs/<id>-plan.md`. Stop. Human (or later: approved label) sets `status: implement`.

## 3. Implement (Cursor)

1. Require plan + `status: implement`.
2. Branch from latest `main` (`wf/<id>-slug` or Cloud Agent `cursor/…`).
3. House stack is [`product/STACK.md`](../../product/STACK.md): Spring Boot, Vite+React PWA (**not** Next), Postgres+PostGIS. Do not implement from `docs/`.
4. Do only that ticket. Run its verify steps.
5. Open a PR. Body links ticket + plan.
6. Set `pr: <url>`, `status: review`. Sync board. Run note. **Do not merge.**

## 4. Verify

Ticket-specific checkboxes. Default bar:

- `python3 -m pytest ops/tests -q -m "not stack"` for vault/script changes
- `./scripts/dev test` if compose/CI changed
- No secrets in the diff
- No product scope on `WF-*`

## 5. Review (separate session)

Comment on the PR. Request changes or “looks good, human may merge”. Never `gh pr merge`. Never push.

## 6. Close (after human merge)

Set `status: done`. Sync board. Run note. If follow-up work appeared, **new ticket**, do not reopen scope.
