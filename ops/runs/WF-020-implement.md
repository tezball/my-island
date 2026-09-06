---
id: WF-020
ticket: "[[tickets/WF-020]]"
role: implementer
started: 2026-09-06
finished: 2026-09-06
pr: https://github.com/tezball/my-island/pull/33
---

# Run WF-020

## What happened

Implementer hat (automation-expert). P0 hotfix: `main` CI red after `be8562e` moved live `ops/`, `data/leads/`, and `product/` under `docs/`.

- Branched `cursor/restore-live-ops-38a6` from `origin/main`.
- `git mv` restored the three live trees. Archaeology under `docs/` left in place.
- Filed [[tickets/WF-020]] (skipped WF-019; claimed by PR #31).
- Did not re-home CI paths to `docs/ops`.

## Result

success — PR #33 open. Local unit (42), stack pytest (45), catalog (12), and workspace image build green. Do not merge.

## Follow-up

Human merges when CI is green. Do not merge from this session.
