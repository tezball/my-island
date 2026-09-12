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

**What vs how.** Gherkin is the **what** (the contract). Testcontainers is how that contract **runs** — not a second suite. Unit tests are the **how** (algorithms, vault freezes). Do not prove the same promise twice. **Shift-left:** new API behaviour is a contract scenario, not Playwright and not chat curl.

NFR-10 (unit + integration + E2E) maps to **how + contract + browser**. DoD still picks the smallest set that proves the slice.

## Five lanes (no overlapping value)

| Lane | Value | Today | Want | Human / agent |
|---|---|---|---|---|
| **1. How (unit)** | Implementation is correct. Not the product promise. | **Gate:** vault pytest `not stack`; thin JUnit (`PlaceServiceTest`). | Vitest with [[ops/tickets/PRD-003]] (haversine, filters). ArchUnit on hot packages. | `./scripts/app test` · `/app-test` · IDEA `mvnw test` |
| **2. What (contract)** | API behaviour. **BDD = integration.** Gherkin scenarios against Testcontainers PostGIS (Flyway, HTTP, authz, mail). | **Gate:** `features/place_catalog.feature` (create/list/get + 404/400) on Testcontainers. `CatalogTest` keeps schema/seed/how. | More scenarios in **that same job**. Negative auth, Mailpit live here when those APIs exist. Duplicate JUnit HTTP tests go away. | Read/run one feature; `mvnw test` (no compose) |
| **3. Wiring (stack)** | Boxes talk. Do **not** re-assert create/list/get. | **Gate:** pytest `@pytest.mark.stack` | Keep thin. | `./scripts/app test` after compose up |
| **4. Browser** | The user’s what. Playwright is the **only browser E2E** ([`product/ENGINEERING.md`](../../product/ENGINEERING.md) §3.4). | **Tool:** Playwright MCP. No tests. [[ops/tickets/WF-011]] blocked. | **Gate** when Explore exists: Playwright vs job-started compose. axe (NFR-04) here. | MCP explore; CI is the gate |
| **5. Operate** | Seed, load, break, observe — **not** a second contract. | **Tool:** `./scripts/dev sim` (seed). **Workshop:** chaos overlay (`/stack-e2e`). Grafana / PromQL. | Sim + **Gatling** `./scripts/dev traffic` = one traffic idea (gentle local flow + optional soak). Chaos stays workshop. | Leave traffic up; query `up{job="catalog"}` |

Legend: **gate** = required CI · **tool** = entrypoint, not automerge · **workshop** = opt-in.

```
HOW (unit) → WHAT (Gherkin / Testcontainers) → WIRING (compose)
                                              → BROWSER (Playwright, when UI)
OPERATE (sim / Gatling / chaos / Grafana) sits beside, does not replace WHAT
```

| Rule | Meaning |
|---|---|
| **One contract** | BDD and integration are the same lane. Testcontainers is the engine; Gherkin is the language. |
| **Left first** | New API behaviour is a contract scenario, not Playwright and not chat curl. |
| **One UI runner** | Playwright clicks the PWA. Gherkin does **not** drive the browser. |
| **Tools ≠ gates** | Sim, Gatling, chaos, MCP browser are how agents **work**. |
| **No chaos in merge** | [[CI]] rule 8. |
| **Same command** | `./scripts/app test` / `./scripts/dev test` locally, Jenkins, GHA. |

## Tests as tools

Same files, two jobs: **prove** (lanes 1–4) and **operate** (lane 5).

| Command | Lane | Agent use |
|---|---|---|
| `/app-test` · `./scripts/app test` | 1–3 | Clone→prove |
| `mvnw test` | 1–2 | Contract without compose; run `features/*.feature` |
| `./scripts/dev sim` | 5 | Seed unique places (today’s traffic) |
| `./scripts/dev traffic` (**want**) | 5 | Steady Gatling flow + metrics |
| `/stack-e2e` | 5 | Chaos drill; restore happy path |
| Playwright MCP | 4 | Tap the running PWA |

Do not add a second CLI family. Extend `./scripts/dev`.

## Required CI

**Now:** `unit` (how / vault) · `catalog` (what / Testcontainers; Gherkin joins this job) · `stack` (wiring).

**When Explore ships:** Vitest on `web/` PRs (how) · Playwright job (browser). Still **out:** chaos, Gatling soak, kill-application.

## Out

- A second **what** suite (JUnit HTTP **and** Gherkin for the same scenario; or Cucumber clicking the PWA).
- k6 / JMeter; Toxiproxy / Gremlin; mutation as automerge; red jobs “for later”.

## Next slices

1. More Gherkin on the existing `catalog` job (authz when PRD-010 lands).
2. Gatling traffic — same operate lane as sim.
3. Vitest with [[ops/tickets/PRD-003]]; Playwright [[ops/tickets/WF-011]] — **no browser** until `web/` exists.

## Related

[[DOD]] · [[CI]] · [[PIPELINE]] · [[LOCAL]] · [[ops/runbooks/PLACE_LISTING_SIM]] · [[ops/runbooks/STACK_E2E_PLACE_STUB]] · [[AGENT_DX]]
