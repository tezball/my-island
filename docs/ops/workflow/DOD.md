---
title: Definition of Done — implement (draft)
type: workflow
status: draft
owner: eng-qa
audience: company
---

# Definition of Done — implement (draft)

**Status:** draft. Working bar for the **implement** step of [[ops/workflow/LOOP]]. Ticket/plan verify lists still win when they are stricter. Product launch DoD stays in [`product/MVP.md`](../../product/MVP.md) — different document.

**Owner (draft):** [[ops/agents/roles/eng-qa]]. Evolution: company review → lock in [[ops/company/DECISIONS]] when ready.

This is what a **slice** must have before the implementer opens a PR and sets `status: review`. It is not a style guide and not a license to polish scaffolding ([[ops/company/SCAFFOLDING]]).

## One-liner

Ticket outcome met · plan verify checkable · automated tests for the risk of the change · house CI can run them · PR is reviewable without nits · no SAFETY violations.

## Must have (every implement PR)

| # | Bar | Notes |
|---|---|---|
| 1 | **Ticket outcome** | The PR delivers the ticket’s Outcome (and plan Outcome). One ticket. No drive-by scope. |
| 2 | **Plan verify** | Every checkbox in the plan / ticket Verify section is checkable from this PR (or explicitly deferred to a child ticket linked in the PR). |
| 3 | **Automated proof** | At least one automated test path covers the new behavior or the regression risk (see types below). Pure docs / vault notes may use vault pytest freezes instead of app tests. |
| 4 | **CI-runnable** | Same commands as [[ops/workflow/CI]]: agents and GHA/Jenkins can run the proof without a human ritual. Never `--no-verify`. |
| 5 | **House stack** | Java/Spring, Vite+React PWA, Postgres+PostGIS, Flyway, Grafana — no Next/FastAPI/second API language ([`product/STACK.md`](../../product/STACK.md)). |
| 6 | **SAFETY** | No secrets in notes/logs; no prod; no chat merge; no legacy Jenkins restore ([[ops/workflow/SAFETY]]). |
| 7 | **PR shape** | Title `<id>: …`; body links ticket + plan; `status: review`; implementer does not merge. |
| 8 | **Close-out ready** | After merge: delete branch; confirm `main` CI green else fix ([[ops/workflow/PIPELINE]]). |

## Automated tests — what “enough” means

Pick the **smallest set** that proves the slice. Prefer fast tests. Do not invent Playwright for a WF ticket with no UI. Full menu (today vs want, tests-as-tools): [[TEST_STACK]].

| Type | When required | House command / home |
|---|---|---|
| **How (unit)** | Vault/OS, Spring/UI pure functions | `pytest ops/tests -q -m "not stack"`; `mvnw test`; later `npm test` |
| **What (contract)** | API behaviour. **BDD = integration:** Gherkin vs Testcontainers (today: `CatalogTest` JUnit skin) | Same Maven suite — PostGIS + Flyway + HTTP |
| **Wiring (stack)** | Compose/scripts/MCP glue. Do not re-assert the HTTP contract. | `./scripts/dev test` (marker `stack`) |
| **Browser (Playwright)** | Only when a `PRD-*` UI exists and CI says so | Blocked until [[ops/tickets/WF-011]] / Explore ships |

**Rules of thumb**

- New API behavior → one **contract** scenario (Gherkin / Testcontainers), not “I curled it once.”
- New Flyway migration → contract path that applies migrations and asserts behaviour.
- Docs-only / skill / rule → vault pytest if the loop depends on the file; otherwise verify is the checklist + CI `unit`.
- Sim / Gatling / chaos **operate** the stack; they do not replace the contract.
- Do **not** require all lanes for a one-line fix. Match risk.

## Clean code (when possible)

Aim for **readable, replaceable scaffolding** — not museum quality.

**Do**

- Name things so the next agent finds the seam in one search.
- Keep the diff local to the ticket; delete dead code you introduced.
- Match existing patterns in the same package / folder.
- Prefer small pure functions over clever frameworks.
- Leave the tree *easier* to delete or replace later.

**Do not** (not DoD, not review blockers)

- Drive-by renames, reformats, or “while I’m here” refactors.
- Abstractions for a second caller that does not exist.
- Perfecting disposable UI or copy beyond the ticket.
- Comment essays; prefer a clear test name.

## Explicitly out of DoD (no nitpicks)

Reviewers and implementers **must not** block on:

- Preferring a different but equivalent naming style
- Import order / whitespace / brace style (formatters own this)
- Missing comments on obvious code
- Optional refactors unrelated to the ticket
- Test count “should be higher” when risk is already covered
- Product polish, a11y sweeps, or Playwright when the ticket did not ask

Block **only** on: wrong outcome, broken/missing verify, SAFETY, house-stack violation, tests that do not prove the change, secrets, scope creep.

## Docs-only vs code slices

| Slice | DoD emphasis |
|---|---|
| **Docs / workflow** | Truthful vault; `board_sync` if tickets change; vault tests if freezes exist; short docs PR on `main` |
| **WF infra / CI** | Scripts + Jenkins/GHA stay in lockstep; stack tests when compose changes |
| **PRD app code** | Plan verify + service/UI tests per table; no OIDC stubs unless ticket says so |

## Relationship to other “done”s

| Document | Means |
|---|---|
| This note | Implement PR is fit to open / review |
| Ticket + plan Verify | Slice-specific acceptance |
| [[ops/workflow/PIPELINE]] | Path through CI → merge → `main` green |
| [`product/MVP.md`](../../product/MVP.md) | Release / launch DoD (places, metrics, legal…) |

## How we harden this draft

1. Use it on the next few implement PRs; note friction in run notes.
2. eng-qa + automation-expert trim the test table to what CI actually enforces.
3. CEO/CTO lock → move `status: draft` → `active` and cite in [[ops/company/DECISIONS]].

## Related

- Loop: [[ops/workflow/LOOP]] · Runbook: [[ops/runbooks/TICKET_LOOP]]
- CI: [[ops/workflow/CI]] · Safety: [[ops/workflow/SAFETY]] · Mix: [[ops/workflow/TEST_STACK]]
- Scaffolding: [[ops/company/SCAFFOLDING]] · QA role: [[ops/agents/roles/eng-qa]]
