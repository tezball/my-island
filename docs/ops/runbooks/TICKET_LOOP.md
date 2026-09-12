---
title: Ticket loop
type: runbook
---

# Ticket intake → implement → PR → verify → close

Full policy: [[ops/workflow/LOOP]]. This is the checklist.

## 0. Who is running

```bash
python3 ops/scripts/next_ticket.py --role auto
```

One role per session. If you planned it, stop. Do not review your own implement PR as the required review.

Skip `type: epic`. Work a child.

## Docs vs code

- **Docs-only:** checkout `main`, change vault/skill/rule files, short docs PR, CI merges, **delete branch**.
- **Already on a feature branch for code:** put related docs in that PR.
- Do not park company-state tickets only on a private branch.

## 1. Intake (Grok or orchestrator)

1. Search `docs/ops/tickets/` before creating.
2. `python3 ops/scripts/new_ticket.py --prefix WF|PRD|INC --type … --title "…" --owner <role>`.
3. `status: inbox` → `ready` when outcome + verify exist.
4. `board_sync.py`.
5. **Land on `main` now** (docs PR).

Product → `PRD-*`. Loop glue → `WF-*`. Live breakage → `INC-*`.

## 2. Plan (planner)

1. Ticket on `main` at `ready`.
2. Plan file `status: approved` unless `gate: human`.
3. Ticket → `implement` in the same docs land when possible.
4. Docs PR to `main`; run note; stop.

## 3. Implement (Cursor)

1. Plan + `implement` on `main`.
2. Branch from `main`. Boot `./scripts/app start` if verify needs it.
3. One ticket. Verify. PR. `status: review`. Do not merge from chat.

## 4. Verify

Ticket checkboxes. Default: `pytest -m "not stack"`; `./scripts/dev test` if compose/CI changed; no secrets; no product scope on pure `WF-*` unless intended.

## 5. Review

Comment only. Never `gh pr merge` from chat.

## 6. Close

After CI squash-merge: `status: done` on `main`, board_sync, run note, **delete feature branch**.
