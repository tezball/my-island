---
title: Jenkins local CI workshop
type: workshop
owner: cto
created: 2026-09-12
cssclasses:
  - workshop
---

# Jenkins local CI workshop

**CTO.** Clone → `./scripts/dev up` → Jenkins at http://127.0.0.1:8085 with jobs from git (JCasC).

## Goal

Local house CI: PR builds (poll + token), same `unit`/`catalog`/`stack` contract, durable volume, deploy stub for mock-prod VPS.

## Success bar

- Casc + Jenkinsfile in git; `ops_jenkins` volume survives restart
- `local-ci` job runs without GitHub token
- Multibranch `my-island` polls when `JENKINS_GITHUB_TOKEN` is set
- GHA remains remote required checks during dual-run (`SKIP_JENKINS=1` in Actions)
- `deploy-mock-prod` fails closed until [[ops/tickets/WF-010]]

## Roles

| Hat | Does |
|---|---|
| **CTO** | Factory outcome; VPS budget later |
| **automation-expert** | Pipelines, token wiring, dual-run cutover |
| **eng-infra** | Compose, volume, docker.sock local-only |
| **eng-security** | Secrets in `.env` only; no legacy sock-on-shared-host |
| **Terry** | Paste GitHub PAT into `.env` when ready |

## Links

- Ticket: [[ops/tickets/WF-031]]
- Deploy stub: [[ops/tickets/WF-032]]
- Plan: [[ops/plans/WF-031]]
- Runbook: [[ops/runbooks/JENKINS_LOCAL]]
- Canvas: [[ops/workflow/jenkins-local-ci]]
