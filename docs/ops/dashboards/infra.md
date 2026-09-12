---
title: Infra dashboard
type: dashboard
owner: eng-infra
cssclasses:
  - role-home
---

# Infra

Role: [[ops/agents/roles/eng-infra]]. Local: [[ops/workflow/LOCAL]] · MCP: [[ops/workflow/MCP]].

> [!warning] Focus
> Compose, MCP, observe. No production Environment.

![[ops/dashboards/infra.base]]

## Dataview

```dataview
TABLE status, priority, blocked_reason, title
FROM "ops/tickets"
WHERE id AND (owner = "eng-infra" OR status = "blocked") AND status != "done"
SORT priority ASC, id ASC
```
