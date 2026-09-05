---
title: Agent roster
type: moc
---

# Agent roster

Concrete org for this company. Each role is a **session hat**, not a login. One ticket per session. Skip epics.

Grok vs Cursor: [[GROK_VS_CURSOR]].

| Role | Runtime | Status | Owns |
|---|---|---|---|
| [[roles/orchestrator]] | grok + cursor | active | `ops/` loop, board, runbooks |
| [[roles/product]] | grok | active | `product/` (notes only), `PRD-*` intake |
| [[roles/eng-frontend]] | cursor | dormant until `PRD-*` implement | client app (future) |
| [[roles/eng-backend]] | cursor | dormant until `PRD-*` implement | Java / Spring services (future) |
| [[roles/eng-infra]] | cursor | active | compose, CI, MCP, observability |
| [[roles/guest-support]] | grok | dormant until guests exist | support runbook, `INC-*` |
| [[roles/host-onboarding]] | grok | dormant until Chunk 1 | host claims, listing quality |
| [[roles/content-seo]] | grok | active (content path) | directory copy, seed pipeline tickets |
| [[roles/trust-safety]] | grok | active (policy) | GDPR, abuse, reviews later |
| [[roles/ops-incidents]] | grok + cursor | active | incidents, weekly digest |

**Dormant** means: do not invent work. If a ticket is filed, follow the runbook and escalate. Do not build product surfaces to give the role something to do.

## Escalation spine

```
guest-support / host-onboarding / content-seo
  → orchestrator (process) or trust-safety (people/data)
      → ops-incidents (if production is hurting)
          → Terry (merge, legal, prod, money)
```

Engineering (frontend / backend / infra) escalates broken plans and blocked PRs to orchestrator, not to Terry first.
