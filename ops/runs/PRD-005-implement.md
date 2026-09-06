---
id: PRD-005
ticket: "[[tickets/PRD-005]]"
role: implementer
started: 2026-09-06
finished: 2026-09-06
pr: https://github.com/tezball/my-island/pull/27
---

# Run PRD-005

## What happened

Retargeted this ticket from banners-only to **split + fence**. Implemented on `cursor/docs-old-new-split-1f2d` / PR #27: `docs/` → `docs/old/` (keep tree); `docs/new/README.md` indexes `product/` + `ops/`; root `docs/README.md` is the split index; history pointers retargeted; **do not implement from `docs/old/`**. Deleted committed `.idea/` IDE noise.

Did not wipe `docs/`. Did not touch `services/`, E2E-001, e2e canvas, workshops, or brand PRs.

## Result

success

## Follow-up

Human merge. Do not merge from this session.
