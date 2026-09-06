---
title: Agent roster
type: moc
---

# Agent roster

Concrete org for this company. Each role is a **session hat**, not a login. One ticket per session. Skip epics.

Grok vs Cursor: [[GROK_VS_CURSOR]].

| Role | Runtime | Status | Owns |
|---|---|---|---|
| [[ops/agents/roles/orchestrator]] | grok + cursor | active | `ops/` loop, board, runbooks |
| [[ops/agents/roles/automation-expert]] | cursor | active | CI/CD, agent skills/hooks, Automations, enterprise DX |
| [[ops/agents/roles/product]] | grok | active | `product/` (notes only), `PRD-*` intake |
| [[ops/agents/roles/eng-frontend]] | cursor | active (MVP planning; no app code until `implement`) | PWA Explore [[ops/tickets/PRD-003]] · My Places [[ops/tickets/PRD-013]] |
| [[ops/agents/roles/eng-backend]] | cursor | active (MVP planning; no app code until `implement`) | catalog, auth, visits [[ops/tickets/PRD-010]]–[[ops/tickets/PRD-012]] · [[ops/tickets/PRD-014]] |
| [[ops/agents/roles/eng-infra]] | cursor | active | compose, MCP, observability runtime |
| [[ops/agents/roles/guest-support]] | grok | dormant until guests exist | support runbook, `INC-*` |
| [[ops/agents/roles/host-onboarding]] | grok | dormant until Chunk 1 | host claims, listing quality |
| [[ops/agents/roles/content-seo]] | grok | active (content path) | directory copy, seed pipeline tickets |
| [[ops/agents/roles/trust-safety]] | grok | active (policy) | GDPR, abuse, reviews later |
| [[ops/agents/roles/ops-incidents]] | grok + cursor | active | incidents, weekly digest |

**Dormant** means: do not invent work. If a ticket is filed, follow the runbook and escalate. Do not build product surfaces to give the role something to do.

**MVP dispatch:** [[ops/agents/mvp-team]] · program [[ops/plans/PRD-000]]. Frontend/backend may **plan** while tickets are `ready`; they still must not write application code until a `PRD-*` ticket is `implement`.

## Escalation spine

```
guest-support / host-onboarding / content-seo
  → orchestrator (process) or trust-safety (people/data)
      → ops-incidents (if production is hurting)
          → Terry (merge, legal, prod, money)

clone/test/CI/skills broken → automation-expert
compose/Grafana/Postgres MCP down → eng-infra
```

Engineering (frontend / backend / infra) escalates broken plans to orchestrator. Automation Expert owns the factory (CI, skills, DX), not the product UI.
