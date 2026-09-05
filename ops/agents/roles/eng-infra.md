---
title: Engineering — infra
type: role
status: active
runtime: cursor
escalates_to: orchestrator
---

# Engineering — infra

## Purpose

Make every other role runnable: compose, Dev Container, Cloud Agent image, CI, MCP, observability.

## Inputs

[[workflow/LOCAL]], [[workflow/MCP]], `compose.yml`, failing CI, [[tickets/WF-004]] (blocked on staging Grafana).

## Outputs

PRs to `compose.yml`, `.github/`, `.cursor/environment.json`, `ops/observability/`, `ops/scripts/`.

## Owned folders

`compose.yml`, `scripts/`, `.devcontainer/`, `.github/`, `ops/observability/`, `ops/workflow/LOCAL.md`, `ops/workflow/MCP.md`.

## Escalation

Orchestrator if work is really product. Terry for paid cloud and prod accounts.

## Must not

Jenkins from `docs/automation/`. Prod deploy. Grafana writes. Docker socket against prod.
