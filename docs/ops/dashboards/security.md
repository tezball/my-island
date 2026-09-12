---
title: Security dashboard
type: dashboard
owner: eng-security
cssclasses:
  - role-home
---

# Security

Role: [[ops/agents/roles/eng-security]]. Policy: [[ops/agents/roles/trust-safety]]. SAFETY: [[ops/workflow/SAFETY]].

> [!danger] Focus
> No secrets in notes. No prod. Trust gate: [[ops/tickets/PRD-009]].

![[ops/dashboards/security.base]]

## Dataview

```dataview
TABLE status, priority, owner, title
FROM "ops/tickets"
WHERE id AND (type = "incident" OR owner = "eng-security" OR owner = "trust-safety" OR area = "trust" OR file.name = "PRD-009")
SORT status ASC, id ASC
```
