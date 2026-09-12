---
title: CTO test-stack brief — today vs want
type: workshop
owner: cto
created: 2026-09-12
cssclasses:
  - workshop
---

# CTO test-stack brief — today vs want

**Meeting goal:** leave knowing the mix (unit → chaos → perf), what is a **merge gate** vs an **agent tool**, and what we add next. Shift left. Wide mix. Same artifacts for humans and agents.

Open first: [[ops/workflow/cto-test-stack]] (canvas) · tables: [[ops/workflow/TEST_STACK]]. Slice bar: [[ops/workflow/DOD]].

## 5-minute walkthrough

1. **Legend** — green = required CI today · yellow = tool we already have · cyan = want (tool or later gate) · red = never a merge gate.
2. **Left row (today)** — vault pytest · thin JUnit · **Testcontainers PostGIS** (the real API contract) · compose `stack` job.
3. **Yellow tools (today)** — `./scripts/dev sim` seeds create/list/get; `/stack-e2e` chaos overlay is **workshop only**.
4. **Cyan want** — API **BDD** (Gherkin vs Testcontainers, not a second UI) · **Gatling** as local **traffic pump** (agent leaves it running; Grafana has signal) · Vitest + **Playwright** when Explore exists ([[ops/tickets/WF-011]]).
5. **Red** — chaos in automerge · dual Playwright+Cucumber UI · Gatling soak on every PR · red jobs “for later”.

## Verdict for the room

| Have (gate) | Have (tool) | Want next | Never |
|---|---|---|---|
| `unit` vault pytest | HTTP sim (`./scripts/dev sim`) | Gatling `./scripts/dev traffic` | Chaos in required CI |
| `catalog` Testcontainers | Chaos Monkey overlay | API Cucumber vs Testcontainers | Two browser E2E frameworks |
| `stack` compose pytest | Playwright **MCP** (drive UI) | Vitest + Playwright **job** | k6/JMeter second house |

**Tests are tools.** An agent that needs a dirty catalog + live metrics should start **Gatling traffic** (want) or **sim `--iterations`** (today), then query Prometheus — not invent curl in chat.

## Talking points (eng-qa)

- Shift-left: new API behaviour is a Testcontainers HTTP test, not “I curled it once” ([[ops/workflow/DOD]]).
- [`product/ENGINEERING.md`](../../product/ENGINEERING.md) still holds: **Playwright is the only browser E2E**. BDD here is **API living spec**.
- Gatling is house-native (Java). First job is **steady local flow** for agents; soak assertions are optional and not automerge.
- NFR-10 (unit + integration + E2E on PRs) is the **product** bar once a UI exists — not a reason to put chaos on `main`.

## Do not digress into

- Consumer UI polish or adding a red Playwright job before [[ops/tickets/PRD-003]]
- Restoring legacy Jenkins test farms from `docs/automation/`
- Mutation testing as a merge gate

## Roles

| Hat | Does |
|---|---|
| **CTO** | Reads the map; picks the next slice (Gatling vs BDD vs Playwright) |
| **eng-qa** | Owns TEST_STACK; verify lists stay honest |
| **automation-expert** | Wires new runners into `./scripts/dev` + Jenkins/GHA only when they are gates |
| **eng-backend** | Testcontainers + future Cucumber/Gatling in `services/catalog` |

## Links

- Canvas: [[ops/workflow/cto-test-stack]]
- Tables: [[ops/workflow/TEST_STACK]]
- Ticket: [[ops/tickets/WF-035]]
- DoD: [[ops/workflow/DOD]] · CI: [[ops/workflow/CI]]
- Sim: [[ops/runbooks/PLACE_LISTING_SIM]] · Chaos: [[ops/runbooks/STACK_E2E_PLACE_STUB]]
