---
title: Architecture dashboard
type: dashboard
owner: architecture
cssclasses:
  - role-home
---

# Architecture

Role: [[ops/agents/roles/architecture]]. Canon: [`product/STACK.md`](../../product/STACK.md) · [[ops/company/DECISIONS]] · [[ops/company/VAULT_DESIGN]].

> [!info] Focus
> STACK consistency, blocked infra, open plans. Do not rewrite STACK without a CEO lock.

![[ops/dashboards/architecture.base]]

## Links

- [[ops/workflow/LOCAL]] · [[ops/workflow/MCP]] · [[ops/dashboards/_index]]

## Dataview (GitHub / no Bases UI)

```dataview
TABLE status, priority, owner, blocked_reason
FROM "ops/tickets"
WHERE id AND (status = "blocked" OR (area = "ops" AND status != "done"))
SORT priority ASC, id ASC
```
