---
title: Templates
type: moc
cssclasses:
  - moc
---

# Templates

Copy these. Prefer `python3 ops/scripts/new_ticket.py` for tickets so ids do not collide.

| Template | Use |
|---|---|
| [[ticket]] | Generic (same as story) |
| [[epic]] | Parent outcome, no implementation in the same session |
| [[story]] | Product or workflow slice |
| [[bug]] | Defect |
| [[incident]] | Live breakage (`INC-`) |
| [[plan]] | Planner output |
| [[run]] | Session log |
| [[daily]] | Daily note |
| [[dashboard]] | Company or role dashboard |
| [[workshop]] | Multi-role workshop brief |
| [[role]] | Agent role note under `ops/agents/roles/` |

Optional frontmatter: `cssclasses` (`ticket`, `plan`, `run`, `dashboard`, `role-home`, `workshop`, `moc`). Design: [[ops/company/VAULT_DESIGN]].
