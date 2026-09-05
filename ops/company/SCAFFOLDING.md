---
title: Application code is disposable scaffolding
type: company
---

# Application code is disposable scaffolding

**Terry (2026-09-05):** this company OS exists so **agents can run the company**. It does not exist to polish, preserve, or incrementally refactor whatever application currently sits in the tree (or at tag `legacy-platform`).

## What that means

| Invest here | Do not invest here |
|---|---|
| `ops/` vault, tickets, runbooks | Protecting old booking-platform code |
| Agent roster, skills, hooks | “Cleaning up” `docs/Designs` or domain READMEs for their own sake |
| CI that any agent can run | Compatibility shims for a soon-to-be-replaced app |
| Cursor Automations + Grok routines | Rebuilding the marketplace in this PR |

`docs/` is **history**. `legacy-platform` is **history**. Future `src/` / client trees, when they appear, are **scaffolding** until a `PRD-*` ticket in `implement` says otherwise — and even then, replace rather than museum-preserve.

## Rules for agents

1. Do not open drive-by refactors of application code on `WF-*` tickets.
2. Do not spend a session “saving” legacy modules. Link the git tag if someone needs to read it.
3. Keep app stubs **minimal** or absent. Empty folders and TODOs are better than a fake Spring app.
4. If a workflow needs a stub (health endpoint, fixture), make it throwaway and say so in the ticket.
5. Product *canon* (`product/`) is not app code. You may **read** it. You do not rewrite it to match old `docs/`.

## What we automate instead

[[workflow/LOOP]] · [[workflow/CI]] · [[workflow/SKILLS]] · [[workflow/AUTOMATIONS]] · [[agents/roles/automation-expert]]
