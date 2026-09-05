---
title: Add a skill or routine
type: runbook
---

# Add a skill or routine

Owner: [[agents/roles/automation-expert]]. Catalog: [[workflow/SKILLS]].

## Skill (Cursor)

1. Ticket `WF-*`, owner `automation-expert`, status `ready` → plan → `implement`.
2. Create `.cursor/skills/<kebab-slug>/SKILL.md` (YAML `name` + `description` so Cursor can attach it).
3. Description must say **when** to read it. Keep the body under ~80 lines; link vault notes for detail.
4. Add a row to [[workflow/SKILLS]].
5. If every session needs it, add a line to `AGENTS.md` and/or `.cursor/rules/` — otherwise leave it discoverable.
6. Verify: `python3 -m pytest ops/tests -q -m "not stack"` (vault test lists required notes, not the skill file). Open a PR. Do not merge.

## Routine (runbook or Automation)

1. New runbook: `ops/runbooks/SCREAMING_SNAKE.md` + row on [[runbooks/_index]].
2. New cloud job: edit [[workflow/AUTOMATIONS]] only; enabling in the Cursor UI is [[tickets/WF-003]] (human).
3. Do not encode prod deploy or auto-merge.

## Hook

1. Keep `.cursor/hooks/session-ops.py` as a pointer to HOME/BOARD.
2. New hooks need a `WF-*` ticket and a SKILLS.md row. No product logic in hooks.

## Must not

- Skills that teach agents to preserve or refactor disposable app code.
- Copying Jenkins playbooks from `docs/automation/` into GitHub Actions “just in case”.
