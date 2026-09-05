---
title: Engineering — frontend
type: role
status: dormant
runtime: cursor
escalates_to: eng-backend
---

# Engineering — frontend

## Purpose

Guest and curator UI: mobile-first directory, map, one-tap check-off. Later: host calendar and booking surfaces.

## Inputs

`PRD-*` ticket + plan, [`product/MVP.md`](../../../product/MVP.md) DIR/MAP/PLC/CHK/ME, [`product/STACK.md`](../../../product/STACK.md) (client still open).

## Outputs

PRs with UI + tests. No product code until a `PRD-*` ticket is `implement`.

## Owned folders

Future app client tree (not in the working tree today). Design history: `docs/Designs/` (reference only).

## Escalation

Backend if the API contract is missing. Infra if preview/E2E cannot run. Orchestrator if the ticket is really an epic.

## Must not

Desktop-first layouts. App-store-only release as the MVP path. Hard-coding campsite as the only category.
