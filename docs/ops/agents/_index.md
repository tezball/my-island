---
title: Agent roster
type: moc
cssclasses:
  - moc
---

# Agent roster

Concrete org for this company. Each role is a **session hat**, not a login. One ticket per session. Skip epics.

Role homes (Obsidian): [[ops/dashboards/_index]]. Grok vs Cursor: [[GROK_VS_CURSOR]]. MVP dispatch callsigns: [[mvp-team]].

| Role | Runtime | Status | Owns |
|---|---|---|---|
| [[ops/agents/roles/orchestrator]] | grok + cursor | active | `ops/` loop, board, runbooks |
| [[ops/agents/roles/architecture]] | cursor | active | vault IA, STACK/decisions consistency, dashboards contract |
| [[ops/agents/roles/business]] | grok | active | milestones, open commercial questions (notes; Terry = CEO) |
| [[ops/agents/roles/automation-expert]] | cursor | active | CI/CD, agent skills/hooks, Automations, enterprise DX |
| [[ops/agents/roles/product]] | grok | active | `product/` (notes only), `PRD-*` intake |
| [[ops/agents/roles/eng-frontend]] | cursor | dormant until `PRD-*` implement | client app (future, scaffolding) |
| [[ops/agents/roles/eng-backend]] | cursor | dormant until `PRD-*` implement | Java / Spring (future, scaffolding) |
| [[ops/agents/roles/eng-qa]] | cursor | active | verify steps, E2E/sim acceptance |
| [[ops/agents/roles/eng-infra]] | cursor | active | compose, MCP, observability runtime |
| [[ops/agents/roles/eng-security]] | cursor | active | SAFETY, secrets hygiene, trust-gate adjacency |
| [[ops/agents/roles/guest-support]] | grok | dormant until guests exist | support runbook, `INC-*` |
| [[ops/agents/roles/host-onboarding]] | grok | dormant until Chunk 1 | host claims, listing quality |
| [[ops/agents/roles/content-seo]] | grok | active (content path) | directory copy, seed pipeline tickets |
| [[ops/agents/roles/trust-safety]] | grok | active (policy) | GDPR, abuse, reviews later |
| [[ops/agents/roles/ops-incidents]] | grok + cursor | active | incidents, weekly digest |

**Dormant** means: do not invent work. If a ticket is filed, follow the runbook and escalate. Do not build product surfaces to give the role something to do.

## Escalation spine

```
guest-support / host-onboarding / content-seo / business
  → orchestrator (process) or trust-safety / eng-security (people/data/secrets)
      → ops-incidents (if runtime is hurting)
          → Terry (merge policy, legal, money, name lock)

clone/test/CI/skills broken → automation-expert
compose/Grafana/Postgres MCP down → eng-infra
verify/E2E/sim thin → eng-qa
STACK or vault IA drift → architecture
```

Engineering (frontend / backend / infra / qa / security) escalates broken plans to orchestrator. Automation Expert owns the factory (CI, skills, DX), not the product UI. Architecture owns dashboard contract, not product features.
