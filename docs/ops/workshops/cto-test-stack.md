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

1. **What vs how** — Gherkin = the promise. Testcontainers = how we execute it. `CatalogTest` today *is* that lane with a JUnit skin; we want the Gherkin skin, not a second suite.
2. **Five lanes** — how (unit) · what (contract) · wiring (compose) · browser (Playwright only) · operate (sim / Gatling / chaos).
3. **Operate is not proof** — `./scripts/dev sim` seeds; Gatling is the same idea at steady load; chaos is a workshop. None of them replace a `.feature`.
4. **Red** — two what-suites · Cucumber clicking the PWA · chaos or Gatling soak on automerge.

## Verdict

| Lane | Have | Want |
|---|---|---|
| How | vault pytest + thin JUnit **gate** | Vitest when `web/` exists |
| What | `catalog` Testcontainers **gate** | Gherkin in **that same job** (authz, mail, OpenAPI examples inside scenarios) |
| Wiring | compose `stack` **gate** | stay thin |
| Browser | Playwright MCP **tool** | Playwright **gate** ([[ops/tickets/WF-011]]) |
| Operate | sim + chaos workshop | Gatling `./scripts/dev traffic` (not a PR soak) |

## Talking points (eng-qa)

- New API behaviour → one contract scenario, not curl and not Playwright ([[ops/workflow/DOD]]).
- Dual Playwright+Cucumber **UI** stays a tax. Gherkin is API **what** only.
- NFR-10 = how + contract + browser. Chaos/Gatling never buy that bar.

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
