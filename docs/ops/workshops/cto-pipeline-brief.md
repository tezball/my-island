---
title: CTO pipeline brief — automated vs not
type: workshop
owner: cto
created: 2026-09-12
cssclasses:
  - workshop
---

# CTO pipeline brief — automated vs not

**Meeting goal:** leave knowing what is automated, what still needs an agent session, and what still needs a human.

Open first: [[ops/workflow/agent-pipeline]] (canvas) · tables: [[ops/workflow/PIPELINE]].

## 5-minute walkthrough

1. **Legend (top of canvas)** — green = machine does it; yellow = someone must start a Cursor/Cloud Agent; red = human click/secret or policy “never”.
2. **Happy path row** — ticket → plan/docs on `main` → implement PR → review comment → **CI auto** → **automerge auto** → delete branch → **confirm `main` CI green, else fix**.
3. **Orange callout** — Cursor Automations (board runner / PR review) are written down but **not enabled** for MVP ([[ops/tickets/WF-003]]). Sessions are started by hand; merge is still CI.
4. **Red row** — Automations UI, IdP secrets, counsel-before-customer-prod, staging/mock-prod host, Playwright backlog, and the three **never**s (prod deploy, chat merge, secrets in vault).

## Verdict for the room

| Already auto | Needs agent kick | Needs human / deferred |
|---|---|---|
| CI `unit` + `catalog` + `stack` | Pick / plan / implement / review | Automations Save+Activate (not MVP) |
| Ready-PR approve + squash-merge | Delete branch + confirm `main` CI green (fix if red) | Google/Apple credentials (post-MVP) |
| Local Jenkins `local-ci` on laptop | Board sync; MVP product tickets ([[ops/agents/mvp-team]]) | Staging host / mock-prod; counsel revisit |

**There is no production environment** — by design ([[ops/company/DECISIONS]]).

## Talking points (automation-expert)

- Merge is GitHub Actions, not chat and not Cursor Automations ([[ops/tickets/WF-025]]).
- House CI: GHA dual-run + local Jenkins ([[ops/workflow/CI]], [[ops/runbooks/JENKINS_LOCAL]]).
- Docs-only work lands on `main` via short PRs; code uses feature branches ([[ops/workflow/LOOP]]).
- Enabling cloud Automations later is a human UI click list in [[ops/plans/WF-003]] — plan kept, ticket closed for MVP.

## Do not digress into

- Consumer UI polish or Playwright until [[ops/tickets/WF-011]] (test mix: [[ops/workshops/cto-test-stack]])
- Restoring legacy Jenkins from `docs/automation/`
- Inventing a prod Environment

## Roles

| Hat | Does |
|---|---|
| **CTO** | Reads the map; decides what to automate next |
| **automation-expert** | Owns PIPELINE + canvas; keeps CI/automerge true |
| **Terry** | IdP secrets / Automations UI when worth it |

## Links

- Canvas: [[ops/workflow/agent-pipeline]]
- Tables: [[ops/workflow/PIPELINE]]
- Loop: [[ops/workflow/LOOP]] · Safety: [[ops/workflow/SAFETY]]
- Jenkins-only visual: [[ops/workflow/jenkins-local-ci]]
