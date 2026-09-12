---
title: Skills and routines
type: workflow
---

# Skills and routines

How agents learn the loop without a wiki outside git. Owner: [[ops/agents/roles/automation-expert]]. Add or change with [[ops/runbooks/ADD_SKILL]]. Engineer map + examples: [[AGENT_DX]].

**Skill** = Cursor `SKILL.md` the agent is told to read (or `/name` in chat). **Routine** = a runbook or cloud job that runs without a human in the IDE. **Hook** = fires on session start (laptop; Cloud Agents skip `sessionStart`).

## Catalog

| Kind | Name | Path | When |
|---|---|---|---|
| Skill | Ops loop | `.cursor/skills/ops-loop/SKILL.md` | Any ticket / plan / PR / review |
| Skill | Automation | `.cursor/skills/automation/SKILL.md` | CI, skills, hooks, Automations, DX |
| Skill | Place-stub STACK-E2E | `.cursor/skills/stack-e2e-place-stub/SKILL.md` | E2E-001 / STACK-E2E / chaos overlay |
| Skill | Clone and run | `.cursor/skills/clone-run/SKILL.md` | `./scripts/app`, compose down |
| Skill | Reviewer | `.cursor/skills/reviewer/SKILL.md` | PR review hat |
| Skill | MCP observe | `.cursor/skills/mcp-observe/SKILL.md` | grafana/postgres; HTTP PromQL fallback |
| Skill | IntelliJ IDEA | `.cursor/skills/intellij-ide/SKILL.md` | IDEA MCP vs files/Maven |
| Skill | Spring catalog | `.cursor/skills/spring-catalog/SKILL.md` | `services/catalog` PRD work (thin) |
| Slash | `/next-ticket` | `.cursor/skills/next-ticket/SKILL.md` | Pick ticket + one hat |
| Slash | `/plan` | `.cursor/skills/plan/SKILL.md` | Planner; stop after docs PR |
| Slash | `/implement` | `.cursor/skills/implement/SKILL.md` | Implementer; DoD; open PR |
| Slash | `/review` | `.cursor/skills/review/SKILL.md` | Reviewer; comment; never merge |
| Slash | `/app-start` | `.cursor/skills/app-start/SKILL.md` | `./scripts/app start` |
| Slash | `/app-test` | `.cursor/skills/app-test/SKILL.md` | `./scripts/app test` |
| Slash | `/board-sync` | `.cursor/skills/board-sync/SKILL.md` | After ticket YAML |
| Slash | `/mcp-health` | `.cursor/skills/mcp-health/SKILL.md` | curl Grafana/Prom/catalog |
| Slash | `/new-ticket` | `.cursor/skills/new-ticket/SKILL.md` | `new_ticket.py` |
| Slash | `/stack-e2e` | `.cursor/skills/stack-e2e/SKILL.md` | Alias to STACK-E2E skill |
| Slash | `/dod` | `.cursor/skills/dod/SKILL.md` | Implement DoD checklist |
| Routine | Place-stub STACK-E2E drill | [[ops/runbooks/STACK_E2E_PLACE_STUB]] | HTTP + observe + opt-in overlay |
| Rule | Ops loop (always) | `.cursor/rules/ops-loop.mdc` | Every session |
| Rule | House stack | `.cursor/rules/house-stack.mdc` | Every session |
| Rule | No prod | `.cursor/rules/no-prod.mdc` | Every session |
| Rule | Vault notes | `.cursor/rules/obsidian-ops.mdc` | `ops/**/*.md` |
| Hook | Session start | `.cursor/hooks/session-ops.py` | Laptop new session → HOME/BOARD |
| Routine | Ticket loop | [[ops/runbooks/TICKET_LOOP]] | Default work |
| Routine | Weekly digest | [[ops/runbooks/WEEKLY_DIGEST]] | Monday / first session |
| Routine | Guest support | [[ops/runbooks/GUEST_SUPPORT]] | Inbound message |
| Routine | Listing rollout | [[ops/runbooks/LISTING_ROLLOUT]] | New type/region |
| Routine | Cursor Automations | [[AUTOMATIONS]] | PR opened, weekday board runner |
| Script | Next ticket | `ops/scripts/next_ticket.py` | Start of session |
| Script | Board sync | `ops/scripts/board_sync.py` | After ticket frontmatter changes |
| Script | New ticket | `ops/scripts/new_ticket.py` | Intake |
| Script | IntelliJ MCP | `scripts/mcp-intellij` | Laptop stdio → IDEA |
| CI | Unit + stack | [[CI]] | Every PR and `main` |

Slash skills use `disable-model-invocation: true` so they do not auto-fire. Do **not** add `.cursor/commands/`.

## Design rules

1. **One skill, one job.** Do not dump the handbook into `ops-loop`. Link vault notes.
2. **Routines live in `ops/runbooks/`**, not in Slack. If Grok cannot open a PR, it files a ticket.
3. **Hooks stay tiny.** Point at `ops/HOME.md`. Do not encode product behaviour.
4. **Thin Spring only.** `spring-catalog` is a pointer at STACK + `services/catalog`. Do not write a framework encyclopedia. No Vite/PWA skill until Explore UI exists.
5. **Enterprise DX** = clone, `./scripts/app start`, `./scripts/app test`, open **`docs/`** in Obsidian, `next_ticket.py`. If that path breaks, it is an automation-expert ticket, not a frontend ticket.
6. **Docs on `main`.** Company-state vault updates land on `main` (short PR + delete branch). Do not encode house process in Cursor memory — use skills/rules/LOOP in git. Exception: already on a code feature branch → fold docs into that PR.

## Grok vs Cursor

Grok follows **routines** (digest, support, intake). Cursor follows **skills + hooks + CI**. Same markdown. [[ops/agents/GROK_VS_CURSOR]]
