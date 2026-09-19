---
title: CTO test-stack brief — today vs want
type: workshop
owner: cto
created: 2026-09-12
cssclasses:
  - workshop
---

# CTO test-stack brief — today vs want

**Meeting goal:** five lanes, no overlapping value. **Shift left.** **What** (contract) is Gherkin on Testcontainers — BDD and integration are the **same** thing. **How** is unit. Tools (sim / Gatling / chaos) do not re-prove the contract.

Open first: [[ops/workflow/cto-test-stack]] · tables: [[ops/workflow/TEST_STACK]]. Slice bar: [[ops/workflow/DOD]].

## 5-minute walkthrough

1. **What vs how** — Gherkin = the promise. Testcontainers = how we execute it. Plumbing is in: `features/place_catalog.feature` in the `catalog` job. `CatalogTest` keeps schema/seed. Not a second suite.
2. **Five lanes** — how (unit) · what (contract) · wiring (compose) · browser (Playwright only) · operate (sim / Gatling / chaos).
3. **Operate is not proof of the contract** — `./scripts/dev sim` seeds; Gatling is the same idea at steady load; workshop chaos remains `/stack-e2e`. None of them replace a `.feature`. **CI chaos** ([[ops/tickets/WF-043]]) proves retries/fallbacks. **CI ZAP** ([[ops/tickets/WF-044]]) is DAST every merge vs local compose.
4. **Red** — Cucumber clicking the PWA · chaos or ZAP **inside** `unit`/`catalog` · Gatling soak on the happy-path automerge job · Playwright CI before `web/` · Chaos Monkey or primary ZAP against public fishing-journals.com on every deploy.

## Verdict

| Lane | Have | Want |
|---|---|---|
| How | vault pytest + thin JUnit **gate** | Vitest when `web/` exists |
| What | Gherkin `place_catalog.feature` on Testcontainers **gate** | More scenarios (authz when it exists) |
| Wiring | compose `stack` **gate** | stay thin |
| Browser | Playwright MCP **tool** | Playwright **cron + MCP**, not merge ([[ops/tickets/WF-011]]) |
| Operate | sim + chaos workshop | Gatling light trickle + weekly full perf ([[ops/tickets/WF-042]]); fail → Jenkins red + Grafana/AM ([[ops/tickets/WF-045]]); Chaos Monkey CI [[ops/tickets/WF-043]]; ZAP-style CI [[ops/tickets/WF-044]] |

## Talking points (eng-qa)

- New API behaviour → one contract scenario, not curl and not Playwright ([[ops/workflow/DOD]]).
- Dual Playwright+Cucumber **UI** stays a tax. Gherkin is API **what** only.
- NFR-10 = how + contract + browser. Chaos/Gatling never buy that bar. Chaos CI buys retries/fallbacks ([[ops/tickets/WF-043]]). ZAP CI buys merge-gate DAST ([[ops/tickets/WF-044]]). Gatling trickle/weekly fail Jenkins + Grafana ([[ops/tickets/WF-045]]).

## Do not digress into

- A red Playwright job before [[ops/tickets/PRD-003]]
- Karate vs Cucumber as a second house (Cucumber-JVM on Testcontainers)
- Mutation as a merge gate

## Roles

| Hat | Does |
|---|---|
| **CTO** | Confirms five lanes; next slice is Gherkin-on-existing-catalog-job vs Gatling traffic |
| **eng-qa** | Owns TEST_STACK; no duplicate what-suites |
| **automation-expert** | New **gate** only if a lane earns it; tools stay on `./scripts/dev` |
| **eng-backend** | Contract scenarios in `services/catalog` |

## Links

- Canvas: [[ops/workflow/cto-test-stack]]
- Tables: [[ops/workflow/TEST_STACK]]
- Ticket: [[ops/tickets/WF-035]]
- DoD: [[ops/workflow/DOD]] · CI: [[ops/workflow/CI]]
