---
id: WF-038
ticket: "[[ops/tickets/WF-038]]"
role: implementer
started: 2026-09-13
finished: 2026-09-13
pr:
cssclasses:
  - run
---

# Run WF-038

## What happened

Handbook for multi-session Cursor: sibling git worktrees, primary on `main`, mock-prod VPS tracks `main` only, one Compose on the laptop. Loop + ops-loop skill updated. No app code.

## Result

success — handbook + skill/rule on `wf/WF-038-worktrees`.

## Follow-up

After merge: remove leftover `my-island-WF-037-worktrees`; `git pull --ff-only` on the primary.
