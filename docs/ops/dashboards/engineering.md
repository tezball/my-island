---
title: Engineering dashboard
type: dashboard
owner: eng-backend
cssclasses:
  - role-home
---

# Engineering (dev)

Hats: [[ops/agents/roles/eng-backend]] · [[ops/agents/roles/eng-frontend]]. Stack: [`product/STACK.md`](../../product/STACK.md).

> [!todo] Focus
> `implement` / `review` queues. No product code unless `PRD-*` + `implement`.

![[ops/dashboards/engineering.base]]

## Dataview

```dataview
TABLE status, priority, owner, pr, title
FROM "ops/tickets"
WHERE id AND type != "epic" AND (status = "implement" OR status = "review")
SORT status ASC, priority ASC, id ASC
```
