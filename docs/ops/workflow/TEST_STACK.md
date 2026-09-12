---
title: Test stack — today vs want
type: workflow
owner: eng-qa
audience: cto
cssclasses:
  - moc
---

# Test stack — today vs want

Owner: [[ops/agents/roles/eng-qa]]. Slice bar: [[DOD]]. Merge jobs: [[CI]]. Workshop: [[ops/workshops/cto-test-stack]]. Canvas: [[cto-test-stack]].

**Question this note answers:** what test styles we have, what we want, and how the same artifacts serve **humans and agents** (gates, tools, entrypoints). Think **shift left**.

NFR-10 wants unit + integration + E2E on every product PR ([`product/MVP.md`](../../product/MVP.md)). DoD still picks the **smallest set** that proves the slice — this is the menu, not a tax.

## Shift-left (house)

Prove as far **left** as it is still real. Right-side runners stay **tools** until they earn a gate.

```
LEFT (fast, required)                          RIGHT (opt-in / tool / later gate)
vault pytest · JUnit unit · Testcontainers · Vitest
    API BDD (Gherkin vs Testcontainers) · compose stack · HTTP sim
        Playwright (only browser E2E)
            Gatling traffic / soak · chaos drill
                NFR perf + axe
```

| Rule | Meaning |
|---|---|
| **Left first** | Domain and HTTP contract live in JUnit + Testcontainers, not in Playwright. |
| **One UI runner** | Playwright is the only browser E2E ([`product/ENGINEERING.md`](../../product/ENGINEERING.md) §3.4). API BDD is **not** a second UI suite. |
| **Tools ≠ gates** | Sim, Gatling traffic, chaos, and MCP browser are how agents **work**. Required CI stays the left three jobs until a UI exists. |
| **No chaos in merge** | [[CI]] rule 8. Overlay is a workshop. |
| **Same command** | Humans, Jenkins, GHA, Cloud Agents: `./scripts/app test` / `./scripts/dev test`. |

## Today vs want

Legend: **gate** = required CI · **tool** = human/agent entrypoint, not a merge blocker · **workshop** = opt-in drill · **want** = not in tree yet

| Style | Today | Want | Human | Agent |
|---|---|---|---|---|
| **Vault / OS unit** | **gate** — `pytest ops/tests -m "not stack"` (vault freezes, scripts, leads schema) | Keep. Freeze every loop contract. | Fast PR proof | Same; docs drift is a failed unit job |
| **Service unit** | **gate** (thin) — `PlaceServiceTest` slugify only | More pure JUnit as catalog grows. ArchUnit house rules (no booking packages, stereotype layers). | `mvnw test` in IDEA | `/app-test` or IntelliJ MCP `build_project` |
| **Integration / Testcontainers** | **gate** — `CatalogTest` `@SpringBootTest` + PostGIS 17 (`ghcr.io/baosystems/postgis:17-3.5`), Flyway, HTTP create/list/get, actuators | Keep as the **API contract home**. Add negative auth (NFR-13) with [[ops/tickets/PRD-010]]. Mailpit asserts when mail exists. | Same Maven suite | Same; no compose required |
| **Compose stack** | **gate** — pytest `@pytest.mark.stack` via `./scripts/dev test` | Keep thin. Do not duplicate Testcontainers HTTP here. | `./scripts/app test` | Cloud Agent `start` then test |
| **HTTP sim** | **tool** — `./scripts/dev sim` / `./scripts/sim-place-listing.sh` ([[ops/runbooks/PLACE_LISTING_SIM]], [[ops/tickets/WF-019]]) | Keep. `--iterations N` is the baby load pump. | Smoke after boot | Seed unique places; assert stub JSON |
| **Chaos** | **workshop** — `compose.chaos.yml` + Chaos Monkey (latency + exceptions; kill off). Skill `/stack-e2e`. **Not** in GHA/Jenkins required jobs. | Keep opt-in. Write gaps. Still never a merge gate. | Drill | `/stack-e2e`; restore default catalog |
| **BDD / Gherkin** | **none** (legacy dual Playwright+Cucumber UI was a tax) | **want — API only.** Cucumber-JVM (or Karate) features against **Testcontainers**. Living spec: `Given a published campsite in Kerry`. `./scripts/dev bdd` or `mvn -P cucumber`. Not a second browser runner. | Readable scenarios | Run **one** feature as an entrypoint |
| **UI unit (Vitest)** | **none** (`web/` not shipped) | **want** with [[ops/tickets/PRD-003]] — haversine, filters, bbox. Optional green `web` job. No red job “for later”. | `npm test` | Same on PWA PRs |
| **UI E2E (Playwright)** | **MCP only** (drive URLs). **No** tests. Job **blocked** [[ops/tickets/WF-011]]. | **want — gate** when Explore exists. Job starts **the same compose**. Not screenshot-only. axe on three core screens (NFR-04). | Trace / headed locally | Playwright MCP **explore**; CI Playwright **gate** |
| **Perf / Gatling** | **none** as a product runner. Sim `--iterations` is the stub. NFR-01 is product text only. | **want — tool first.** Gatling (Java, house-native) simulations: gentle **local traffic** so agents have a steady catalog + Prometheus signal while coding; optional soak (p95 / error rate) **not** on every PR. `./scripts/dev traffic`. Watch via `mcp-grafana` / PromQL. | Grafana while it runs | Leave traffic up; query `up{job="catalog"}` and HTTP rates |
| **Contract / OpenAPI** | Implicit in `CatalogTest` HTTP | **want** springdoc OpenAPI generated from the API; Testcontainers already asserts behaviour. No Pact unless a second consumer appears. | Schema in PR | Don’t invent field names (WF-018 lesson) |
| **Mail** | STACK calls Mailpit; not wired in tests | **want** with auth mail (PRD-010): capture verify/reset. Agent HTTP to Mailpit, not SMTP hope. | Mailpit UI | HTTP assert |
| **Security / negative** | Chaos off-by-default asserted. No authz tests yet. | **want** NFR-12/13: rate limit + server-side authz **negative** tests in Testcontainers. | Fail closed in IDEA | Must exist before public write APIs |
| **A11y / NFR UI** | None | **want** axe in Playwright (NFR-04). Explore <2.5s (NFR-01) measured later — not a Gatling substitute. | axe report | CI fail on serious axe |
| **Mutation (PITest)** | None | **later** on hot domain only. Never a required PR gate. | Occasional | Don’t block merge |

## Tests as tools (entrypoints)

The mix is wide **because** agents need more than a green tick. Same files, two jobs: **prove** and **operate**.

| Entrypoint | Proves | Operates (agent) |
|---|---|---|
| `./scripts/app test` · `/app-test` | CI contract | Clone→prove without a tour |
| `python3 -m pytest ops/tests -q -m "not stack"` | Vault/OS | Fast docs PR |
| `services/catalog/mvnw test` | API + Flyway + PostGIS | IntelliJ or Cloud Agent without compose |
| `./scripts/dev sim` · `/stack-e2e` HTTP | Create→list→get | **Seed** unique slugs; smoke actuators |
| `./scripts/dev traffic` (**want**) | Optional soak | **Steady data + metrics** while implementing |
| `./scripts/dev bdd` (**want**) | Gherkin vs Testcontainers | Run one scenario instead of inventing curl |
| Chaos overlay | Resilience gaps | Write `WF-*` / run notes; restore happy path |
| Playwright MCP | — (not a gate) | Tap the running PWA like a user |
| Playwright CI (**want**) | NFR-10 E2E | Merge blocked if the job-started stack fails |
| `mcp-grafana` / PromQL HTTP | Observe during the above | `up{job="catalog"}` while sim/Gatling runs |

Do **not** add a second CLI family. Extend `./scripts/dev` / `./scripts/app` (sim already). Slash skills stay thin ([[AGENT_DX]]).

## Required CI (now vs when UI exists)

**Now** (Jenkins `local-ci` + GHA):

| Job | In |
|---|---|
| `unit` | Vault pytest `not stack` |
| `catalog` | Maven Testcontainers |
| `stack` | Compose + pytest including `stack` |

**When Explore ships** (still shift-left):

| Add | Still out of required CI |
|---|---|
| Vitest / `npm test` + `npm run build` on `web/` PRs | Chaos overlay |
| Playwright vs job-started compose ([[ops/tickets/WF-011]]) | Gatling soak / traffic |
| Cucumber API **inside** `catalog` (Testcontainers, fast) if features exist | Kill-application assault |

NFR-10 is met by unit + Testcontainers + Playwright, not by moving chaos or Gatling into automerge.

## What we will not do

- Dual **UI** BDD (Playwright + Cucumber both clicking the PWA).
- k6 / JMeter as a second load house (Gatling matches Java/Spring).
- Toxiproxy / Gremlin / Chaos Mesh (Chaos Monkey + compose overlay is enough).
- Red CI jobs “for later”.
- Requiring every layer on a one-line vault fix.

## Follow-up slices (after this map)

File separately; do not grow this ticket:

1. **Gatling traffic pump** — `./scripts/dev traffic`, gentle catalog write/read, Grafana-visible. Owner: eng-qa + automation-expert.
2. **API BDD** — Cucumber-JVM features vs Testcontainers. Owner: eng-qa.
3. **Vitest** — with [[ops/tickets/PRD-003]] implement. Owner: eng-frontend.
4. **Playwright gate** — [[ops/tickets/WF-011]] when PWA exists.
5. **Negative authz** — with [[ops/tickets/PRD-010]]. Owner: eng-backend.

## Related

- DoD: [[DOD]] · CI: [[CI]] · Pipeline: [[PIPELINE]] · Local: [[LOCAL]]
- Sim: [[ops/runbooks/PLACE_LISTING_SIM]] · Chaos drill: [[ops/runbooks/STACK_E2E_PLACE_STUB]]
- QA role: [[ops/agents/roles/eng-qa]] · DX toolbox: [[AGENT_DX]]
