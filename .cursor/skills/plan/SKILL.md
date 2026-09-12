---
name: plan
description: >-
  Wear the planner hat: write the plan, land docs on main, stop. Slash-only
  (/plan).
disable-model-invocation: true
---

# /plan

Planner only. Read `.cursor/skills/ops-loop/SKILL.md` (Planner section) and `docs/ops/workflow/LOOP.md`.

1. Ticket on `main` (or land intake first).
2. Write `docs/ops/plans/<id>.md` (`status: approved` unless `gate: human`).
3. Set ticket `plan:` and usually `status: implement`.
4. `python3 ops/scripts/board_sync.py`. Short docs PR. Run note.
5. **Stop.** Do not implement in this session.
