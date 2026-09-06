---
title: Application code is disposable scaffolding
type: company
---

# Application code is disposable scaffolding

**Terry (2026-09-05):** this company OS exists so **agents can run the company**. It does not exist to polish, preserve, or incrementally refactor whatever application currently sits in the tree (or at tag `legacy-platform`).

## What that means

| Invest here | Do not invest here |
|---|---|
| `docs/ops/` vault, tickets, runbooks | Protecting old booking-platform code |
| Agent roster, skills, hooks | “Cleaning up” `docs/Designs` or domain READMEs for their own sake |
| CI that any agent can run | Compatibility shims for a soon-to-be-replaced app |
| Cursor Automations + Grok routines | Rebuilding the marketplace in this PR |

`docs/leads/` and `docs/automation/` are **history**. `legacy-platform` is **history**. Living vault is `docs/` (`ops/` notes + `product/` canon). Future `src/` / client trees, when they appear, are **scaffolding** until a `PRD-*` ticket in `implement` says otherwise — and even then, replace rather than museum-preserve.

## Rules for agents

1. Do not open drive-by refactors of application code on `WF-*` tickets.
2. Do not spend a session “saving” legacy modules. Link the git tag if someone needs to read it.
3. Keep app stubs **minimal** or absent. Empty folders and TODOs are better than a fake marketplace. The first real skeleton is **Spring Boot + Vite/React PWA** on [[ops/tickets/PRD-001]] / [[ops/tickets/PRD-003]] only when those tickets are `implement` — see [`product/STACK.md`](../../product/STACK.md).
4. If a workflow needs a stub (health endpoint, fixture), make it throwaway and say so in the ticket. Still Spring + light PWA, not Next/FastAPI/Neon.
5. Product *canon* (`docs/product/`) is not app code. You may **read** it. You do not rewrite it to match old `docs/leads/` or `docs/automation/`.

## What we automate instead

[[ops/workflow/LOOP]] · [[ops/workflow/CI]] · [[ops/workflow/SKILLS]] · [[ops/workflow/AUTOMATIONS]] · [[ops/agents/roles/automation-expert]]
