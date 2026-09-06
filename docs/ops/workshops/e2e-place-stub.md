---
title: Place listing stub — e2e workshop
type: workshop
---

# Place listing stub — e2e workshop

Terry / CEO P0. Product owns slice ACs + this brief + the living canvas. Engineering implements the stub on a later `implement` session.

## Goal

Thin HTTP stub on Spring catalog: **create → list → get**. Agents can demo the loop with automated tests.

## Success bar

Plumbing + demo-able tests. CI green. Not polish. Not a consumer UI.

Repeatable compose sim (Engineering): [[ops/runbooks/PLACE_LISTING_SIM]] — `./scripts/sim-place-listing.sh` after `./scripts/dev up`.

## Roles

| Hat | Does |
|---|---|
| **product** | ACs on [[ops/tickets/E2E-001]], this brief, canvas |
| **Architecture** | STACK constraints (read-only; no STACK rewrite). Draft: [[ops/workflow/STACK-E2E-place-stub]] |
| **eng-backend** | Implement create / list / get when the ticket is `implement` |
| **human** | Merge PRs |

## Links

- Ticket: [[ops/tickets/E2E-001]] (parent [[ops/tickets/PRD-001]])
- Architecture: [[ops/workflow/STACK-E2E-place-stub]]
- Canvas: [[ops/workflow/e2e-place-stub]] — path `ops/workflow/e2e-place-stub.canvas`
- Stack: [`product/STACK.md`](../../product/STACK.md)
- Drill: [[ops/runbooks/STACK_E2E_PLACE_STUB]] (skill `stack-e2e-place-stub`)
- MCP/chaos run: [[ops/runs/e2e-place-stub-mcp-chaos-2026-09-06]] — E2E-001 stays `ready`. Gaps: [[ops/tickets/WF-016]] · [[ops/tickets/WF-017]] · [[ops/tickets/WF-018]]
- Sim: [[ops/runbooks/PLACE_LISTING_SIM]] · [[ops/tickets/WF-019]] — `./scripts/sim-place-listing.sh`

## Path map

Obsidian vault = repo `docs/`. Wikilinks above are vault-relative. Repo paths: this brief `docs/ops/workshops/e2e-place-stub.md`; canvas `docs/ops/workflow/e2e-place-stub.canvas`; STACK-E2E `docs/ops/workflow/STACK-E2E-place-stub.md`. Runtime stays at repo root (`services/catalog`, compose, `scripts/`).
