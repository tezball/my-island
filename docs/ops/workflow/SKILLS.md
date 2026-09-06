---
title: Skills and routines
type: workflow
---

# Skills and routines

How agents learn the loop without a wiki outside git. Owner: [[ops/agents/roles/automation-expert]]. Add or change with [[ops/runbooks/ADD_SKILL]].

**Skill** = Cursor `SKILL.md` the agent is told to read. **Routine** = a runbook or cloud job that runs without a human in the IDE. **Hook** = fires on session start.

## Catalog

| Kind | Name | Path | When |
|---|---|---|---|
| Skill | Ops loop | `.cursor/skills/ops-loop/SKILL.md` | Any ticket / plan / PR / review |
| Skill | Automation | `.cursor/skills/automation/SKILL.md` | CI, skills, hooks, Automations, DX |
| Skill | Place-stub STACK-E2E | `.cursor/skills/stack-e2e-place-stub/SKILL.md` | E2E-001 / STACK-E2E / chaos overlay / mcp-grafana catalog scrape |
| Routine | Place-stub STACK-E2E drill | [[ops/runbooks/STACK_E2E_PLACE_STUB]] | E2E workshop: HTTP + observe + opt-in overlay; chaos **out** of required CI |
| Rule | Ops loop (always) | `.cursor/rules/ops-loop.mdc` | Every session |
| Rule | Vault notes | `.cursor/rules/obsidian-ops.mdc` | `ops/**/*.md` |
| Hook | Session start | `.cursor/hooks/session-ops.py` | New agent session → read HOME/BOARD |
| Routine | Ticket loop | [[ops/runbooks/TICKET_LOOP]] | Default work |
| Routine | Weekly digest | [[ops/runbooks/WEEKLY_DIGEST]] | Monday / first session |
| Routine | Guest support | [[ops/runbooks/GUEST_SUPPORT]] | Inbound message |
| Routine | Listing rollout | [[ops/runbooks/LISTING_ROLLOUT]] | New type/region |
| Routine | Cursor Automations | [[AUTOMATIONS]] | PR opened, weekday board runner |
| Script | Next ticket | `ops/scripts/next_ticket.py` | Start of session |
| Script | Board sync | `ops/scripts/board_sync.py` | After ticket frontmatter changes |
| Script | New ticket | `ops/scripts/new_ticket.py` | Intake |
| CI | Unit + stack | [[CI]] | Every PR and `main` |

## Design rules

1. **One skill, one job.** Do not dump the handbook into `ops-loop`. Link vault notes.
2. **Routines live in `ops/runbooks/`**, not in Slack. If Grok cannot open a PR, it files a ticket.
3. **Hooks stay tiny.** Point at `ops/HOME.md`. Do not encode product behaviour.
4. **No app-framework skills** until a `PRD-*` ticket is `implement`. A Spring skill today would petrify scaffolding.
5. **Enterprise DX** = clone, `./scripts/dev up`, `./scripts/dev test`, open **`docs/`** in Obsidian, `next_ticket.py`. If that path breaks, it is an automation-expert ticket, not a frontend ticket.

## Grok vs Cursor

Grok follows **routines** (digest, support, intake). Cursor follows **skills + hooks + CI**. Same markdown. [[ops/agents/GROK_VS_CURSOR]]
