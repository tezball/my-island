---
title: Company charter
type: moc
owner: orchestrator
---

# Company charter

**Company:** Terry’s Ireland stays company (working product name TBD — see `product/NAMING.md`; repo `my-island`).
**Owner:** Terry (GitHub: [tezball](https://github.com/tezball)).
**How we run:** Grok Bot teammates + Cursor agents operate from this git repo. Markdown in `ops/` is Jira + Confluence + the handbook.

## Purpose

Build the place people in Ireland use to find, remember, and later book **campsites, B&Bs, and experiences**.

Long-term shape: a two-sided marketplace — guest search / book / message; host listing / calendar / pricing; trust, reviews, cancellations, GDPR. Near-term test: a **checkable directory** that answers whether people come back between trips. Canon: [`product/VISION.md`](../product/VISION.md), [`product/MVP.md`](../product/MVP.md), [`product/EXPANSION.md`](../product/EXPANSION.md). Pointer: [[company/PRODUCT]].

## What this repository is

Everything the company needs to function:

| Path | Role |
|---|---|
| [[HOME]] (`ops/`) | Operating system — tickets, agents, runbooks, daily notes |
| `product/` | Living product canon (not the vault; read-only until a `PRD-*` ticket is `implement`) |
| `docs/` | Historical booking platform. Not requirements. Code: git tag `legacy-platform` |
| `scripts/`, `compose.yml` | Local ops runtime (Postgres + Grafana stack) |

There is no second tracker. If it is not in git, the company does not know it.

## Operating principles

1. **One ticket per agent session.** [[workflow/LOOP]]
2. **Humans merge. Agents do not.** [[workflow/SAFETY]]
3. **Directory before marketplace.** Do not rebuild booking until expansion gates pass.
4. **Preserve what exists.** Evolve `ops/`, `product/`, and `docs/` in place. Do not wipe history to look clean.
5. **Secrets never live in notes.** Env and Cursor MCP settings only.
6. **Ireland first.** Density in 32 counties beats thin coverage everywhere.
7. **GDPR from day one.** Export and erasure are product requirements, not a later project.

## Brand and naming

Public name is unset. Shortlist and landmines: `product/NAMING.md`. Vault and ticket naming: [[NAMING]].

## Who does the work

Roster: [[agents/_index]]. Grok vs Cursor: [[agents/GROK_VS_CURSOR]].
