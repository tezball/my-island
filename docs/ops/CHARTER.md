---
title: Company charter
type: moc
owner: orchestrator
cssclasses:
  - moc
---

# Company charter

**Company:** Terry’s Ireland stays company (working product name TBD — see `product/NAMING.md`; repo `my-island`).
**Owner:** Terry (GitHub: [tezball](https://github.com/tezball)).
**How we run:** Grok Bot teammates + Cursor agents operate from this git repo. Markdown in `docs/ops/` is Jira + Confluence + the handbook. **The asset is the automated agent loop**, not a consumer app in this tree.

## Purpose

Build the place people in Ireland use to find, remember, and later book **campsites, B&Bs, and experiences**.

Long-term shape: a two-sided marketplace — guest search / book / message; host listing / calendar / pricing; trust, reviews, cancellations, GDPR. Near-term *product* test (when a `PRD-*` ticket is `implement`): a checkable directory. Canon: [`product/VISION.md`](../product/VISION.md). Pointer: [[ops/company/PRODUCT]].

**Near-term company work:** fully automated agent workflows — vault, tickets, CI, skills, routines. Application code is [[ops/company/SCAFFOLDING|disposable scaffolding]].

## What this repository is

Everything the **company OS** needs to function. Not a museum of the last app.

| Path | Role |
|---|---|
| [`docs/`](../README.md) | **Obsidian vault** — open this folder only |
| [[ops/HOME]] (`docs/ops/`) | Company OS — tickets, agents, runbooks, skills catalog |
| `docs/product/` | Product canon (read; do not implement until `PRD-*` + `implement`). House: [`product/STACK.md`](../product/STACK.md) |
| `docs/leads/`, `docs/automation/` | Historical booking platform. Do not implement from it |
| `ops/scripts`, `ops/tests`, `ops/observability` | CI/runtime (not the vault) |
| `scripts/`, `compose.yml` | Local ops runtime (Postgres + Grafana) for agents |
| git tag `legacy-platform` | Old app. Do not port or protect it |

There is no second tracker. If it is not in git, the company does not know it.

## Operating principles

1. **One ticket per agent session.** [[ops/workflow/LOOP]]
2. **Ready PRs merge themselves when CI is green.** Chat agents do not merge. There is no prod. [[ops/workflow/SAFETY]]
3. **Workflows before app.** Do not polish or refactor application code for its own sake.
4. **App code is disposable scaffolding.** Replace it when workflows need a new shape. [[ops/company/SCAFFOLDING]]
5. **Secrets never live in notes.** Env and Cursor MCP settings only.
6. **CI any agent can run.** [[ops/workflow/CI]]
7. **Directory before marketplace** *when* product work starts. Do not sneak booking into `WF-*`.
8. **House stack.** Java / Spring Boot, light Vite+React PWA (not Next), Postgres+PostGIS, Grafana MCP. [[ops/company/DECISIONS]]

## Brand and naming

Public name is unset. Shortlist: `product/NAMING.md`. Vault naming: [[ops/NAMING]].

## Who does the work

Roster: [[ops/agents/_index]]. Automation: [[ops/agents/roles/automation-expert]]. Grok vs Cursor: [[ops/agents/GROK_VS_CURSOR]].
