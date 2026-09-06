---
id: WF-020
ticket: "[[tickets/WF-020]]"
role: implementer
started: 2026-09-06
finished:
pr:
---

# Run WF-020

## What happened

Implementer hat (automation-expert). P0 hotfix: `main` CI red after `be8562e` moved live `ops/`, `data/leads/`, and `product/` under `docs/`.

- Branched `cursor/restore-live-ops-38a6` from `origin/main`.
- `git mv` restored the three live trees. Archaeology under `docs/` left in place.
- Filed [[tickets/WF-020]] (skipped WF-019; claimed by PR #31).
- Did not re-home CI paths to `docs/ops`.

## Result

in progress

## Follow-up

Human merges when CI is green. Do not merge from this session.
