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

## Roles

| Hat | Does |
|---|---|
| **product** | ACs on [[tickets/E2E-001]], this brief, canvas |
| **Architecture** | STACK constraints (read-only; no STACK rewrite). Draft: [[workflow/STACK-E2E-place-stub]] |
| **eng-backend** | Implement create / list / get when the ticket is `implement` |
| **human** | Merge PRs |

## Links

- Ticket: [[tickets/E2E-001]] (parent [[tickets/PRD-001]])
- Architecture: [[workflow/STACK-E2E-place-stub]]
- Canvas: [[workflow/e2e-place-stub]] — path `ops/workflow/e2e-place-stub.canvas`
- Stack: [`product/STACK.md`](../../product/STACK.md)
- MCP/chaos run: [[runs/e2e-place-stub-mcp-chaos-2026-09-06]] — E2E-001 stays `ready`. Gaps: [[tickets/WF-016]] · [[tickets/WF-017]] · [[tickets/WF-018]]
