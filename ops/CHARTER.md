---
title: Company charter
type: moc
owner: orchestrator
---

# Company charter

**Company:** Terry’s Ireland stays company (working product name TBD — see `product/NAMING.md`; repo `my-island`).
**Owner:** Terry (GitHub: [tezball](https://github.com/tezball)).
**How we run:** Grok Bot teammates + Cursor agents operate from this git repo. Markdown in `ops/` is Jira + Confluence + the handbook. **The asset is the automated agent loop**, not a consumer app in this tree.

## Purpose

Build the place people in Ireland use to find, remember, and later book **campsites, B&Bs, and experiences**.

Long-term shape: a two-sided marketplace — guest search / book / message; host listing / calendar / pricing; trust, reviews, cancellations, GDPR. Near-term *product* test (when a `PRD-*` ticket is `implement`): a checkable directory. Canon: [`product/VISION.md`](../product/VISION.md). Pointer: [[company/PRODUCT]].

**Near-term company work:** fully automated agent workflows — vault, tickets, CI, skills, routines. Application code is [[company/SCAFFOLDING|disposable scaffolding]].

## What this repository is

Everything the **company OS** needs to function. Not a museum of the last app.

| Path | Role |
|---|---|
| [[HOME]] (`ops/`) | Operating system — tickets, agents, runbooks, skills catalog |
| `product/` | Product canon (read; do not implement until `PRD-*` + `implement`) |
| `docs/` | Historical booking platform. Ignore for workflow work |
| `scripts/`, `compose.yml` | Local ops runtime (Postgres + Grafana) for agents |
| git tag `legacy-platform` | Old app. Do not port or protect it |

There is no second tracker. If it is not in git, the company does not know it.

## Operating principles

1. **One ticket per agent session.** [[workflow/LOOP]]
2. **Humans merge. Agents do not.** [[workflow/SAFETY]]
3. **Workflows before app.** Do not polish or refactor application code for its own sake.
4. **App code is disposable scaffolding.** Replace it when workflows need a new shape. [[company/SCAFFOLDING]]
5. **Secrets never live in notes.** Env and Cursor MCP settings only.
6. **CI any agent can run.** [[workflow/CI]]
7. **Directory before marketplace** *when* product work starts. Do not sneak booking into `WF-*`.

## Brand and naming

Public name is unset. Shortlist: `product/NAMING.md`. Vault naming: [[NAMING]].

## Who does the work

Roster: [[agents/_index]]. Automation: [[agents/roles/automation-expert]]. Grok vs Cursor: [[agents/GROK_VS_CURSOR]].
