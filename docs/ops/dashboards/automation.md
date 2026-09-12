---
title: Automation / DX dashboard
type: dashboard
owner: automation-expert
cssclasses:
  - role-home
---

# Automation / DX

Role: [[ops/agents/roles/automation-expert]]. CI: [[ops/workflow/CI]] · Skills: [[ops/workflow/SKILLS]].

> [!info] Focus
> CI/CD, skills, hooks, Automations, clone/test DX.

![[ops/dashboards/automation.base]]

## Dataview

```dataview
TABLE status, priority, owner, title
FROM "ops/tickets"
WHERE id AND startswith(file.name, "WF-") AND status != "done" AND type != "epic"
SORT priority ASC, status ASC, id ASC
```
