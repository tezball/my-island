---
title: Agent DX pack workshop
type: workshop
cssclasses:
  - workshop
---

# Agent DX pack workshop

**Automation / DX.** Collection of skills, slash commands, plugins, and MCP servers so a new engineer can clone this repo and work like the house — Cursor agents + **IntelliJ IDEA** (everyone uses it).

**Value of this request: 8.5 / 10.** High leverage (the factory is the loop). Risk is toolbox sprawl. Goal 1 = this list. Goal 2 = land the selected rows. IntelliJ MCP is already **MUST** (CEO/eng preference this session).

## Goal

One in-repo pack. Clone, open Cursor, open IntelliJ, `./scripts/app start`, reload MCP. No marketplace scavenger hunt.

## Success bar

- A new engineer (or Cloud Agent) gets **loop + stack + observe** from git
- IntelliJ is a first-class MCP on the laptop path
- Cloud / CI still work if IntelliJ is not running
- Selected items in Goal 2 are configs in this repo (`.cursor/`, `docs/.obsidian/`, `ops/jenkins/` as today)

## Roles (workshop hats)

AI-agent engineers, mapped to the roster. One hat per later implement session.

| Hat | Roster | Does |
|---|---|---|
| **Pack lead** | [[ops/agents/roles/automation-expert]] | Skills, commands, hooks, SKILLS catalog, clone DX |
| **MCP / runtime** | [[ops/agents/roles/eng-infra]] | Compose, grafana/postgres/docker MCP, IntelliJ attach docs |
| **Spring / IDEA** | [[ops/agents/roles/eng-backend]] | IntelliJ MCP usage (inspections, Maven, Flyway); thin Spring skill |
| **PWA** | [[ops/agents/roles/eng-frontend]] | Vite+React skill **only** when [[ops/tickets/PRD-003]] is in flight |
| **Observe** | eng-infra | mcp-grafana vs HTTP PromQL fallback |
| **Verify** | [[ops/agents/roles/eng-qa]] | `/app-test`, DoD, Playwright MCP when UI exists |
| **Safety** | [[ops/agents/roles/eng-security]] | RO data planes, no secrets, no brave-mode default |
| **Architecture** | [[ops/agents/roles/architecture]] | STACK lock; reject Next/FastAPI/Datadog plugins |
| **Loop** | [[ops/agents/roles/orchestrator]] | Ticket/plan/review commands stay one-ticket |
| **human (Terry)** | — | Review this list; then Goal 2. Enable IDEA MCP Server once on the laptop |

## Clone path (the customer)

```bash
git clone https://github.com/tezball/my-island.git
cd my-island
./scripts/app start
./scripts/app test
```

Then:

1. Open **`docs/`** in Obsidian ([[ops/PLUGINS]]).
2. Open the **repo root** in Cursor (skills, rules, `mcp.json`).
3. Open the **same repo** in IntelliJ IDEA 2025.2+ → Settings → Tools → **MCP Server** → Enable. Cursor uses the committed `intellij` MCP (Goal 2).
4. `python3 ops/scripts/next_ticket.py --role auto`

If Grafana MCP is red, compose is down or MCP not reloaded — not a frontend ticket.

## How we ship configs (house)

| Mechanism | Clone applies? | Use |
|---|---|---|
| `.cursor/skills`, `rules`, `hooks`, `mcp.json` | **Yes** | **Default pack.** Cloud Agents load **repo** skills; `~/.cursor/skills` only if Sync Skills is on. |
| `.cursor/commands/` | Yes if committed | **Do not add.** Cursor is folding commands into skills (`/migrate-to-skills`). |
| `docs/.obsidian/` + [[ops/PLUGINS]] | Core yes; community plugins install once | Humans, not agents |
| `ops/jenkins/plugins.txt` | Via compose | House CI, not Cursor |
| Cursor Marketplace / team marketplace plugin | **No** on clone | Install is Customize or admin **Required**. LATER only if Required is wanted. |
| Cloud Agent MCP dropdown | **No** (dashboard human) | grafana/postgres stdio; **not** IntelliJ. Repo `mcp.json` does not attach to Cloud Agents. |

Do not replace `.cursor/` with a plugin people must install.

## List — skills

Existing keep. Add only one-job skills ([[ops/workflow/SKILLS]]).

| Item | Path / name | Verdict | When |
|---|---|---|---|
| Ops loop | `.cursor/skills/ops-loop` | **KEEP** | Tickets, plan, PR, review |
| Automation | `.cursor/skills/automation` | **KEEP** | CI, skills, hooks, DX |
| Place-stub STACK-E2E | `.cursor/skills/stack-e2e-place-stub` | **KEEP** | E2E-001 / chaos |
| Clone and run | `clone-run` | **MUST** Goal 2 | `./scripts/app`, ports, compose down |
| Reviewer | `reviewer` | **MUST** Goal 2 | SAFETY + DoD; comment only; no merge |
| MCP observe | `mcp-observe` | **MUST** Goal 2 | grafana/postgres; HTTP PromQL if MCP missing |
| IntelliJ IDEA | `intellij-ide` | **MUST** Goal 2 | When to call `intellij` MCP vs files; IDE must be open |
| Spring catalog | `spring-catalog` | **SHOULD** | Thin: Boot 3, Flyway, Testcontainers; link STACK. PRDs are `implement` |
| Vite PWA | `vite-pwa` | **LATER** | After Explore UI exists ([[ops/tickets/PRD-003]]) |
| Next.js / FastAPI / Nest | — | **NO** | STACK lock |
| “Preserve the app” | — | **NO** | Scaffolding |

Always-on **rules** (already): `ops-loop`, `house-stack`, `no-prod`, `obsidian-ops`. Do not add more always-on rules in Goal 2 unless a session actually misses them. Skill `name` in YAML **must match** the folder.

## List — slash-invocable skills (not `.cursor/commands/`)

Cursor invokes skills with `/skill-name`. Official path: commands are markdown `/` prompts being **migrated into skills** (`disable-model-invocation: true` = slash-only, like old commands). Goal 2 does **not** add a parallel `.cursor/commands/` tree.

`ops-loop` already covers plan/implement/review. New skills below are for explicit `/` (set `disable-model-invocation: true` so they do not auto-fire every session).

| Skill / `/name` | Verdict | Does |
|---|---|---|
| `/next-ticket` | **MUST** | `next_ticket.py --role auto`; one hat |
| `/plan` | **MUST** | Planner loop; docs PR; stop |
| `/implement` | **MUST** | Implementer; DoD; open PR; `status: review` |
| `/review` | **MUST** | Reviewer; comment; never merge |
| `/app-start` | **MUST** | `./scripts/app start` + MCP reload reminder |
| `/app-test` | **MUST** | `./scripts/app test` |
| `/board-sync` | **MUST** | `board_sync.py` after ticket frontmatter |
| `/mcp-health` | **MUST** | curl Grafana/Prometheus/catalog; IntelliJ optional |
| `/new-ticket` | **SHOULD** | wrap `new_ticket.py` |
| `/stack-e2e` | **SHOULD** | already covered by KEEP skill; slash alias optional |
| `/dod` | **SHOULD** | [[ops/workflow/DOD]] checklist |
| Parallel `.cursor/commands/*.md` | **NO** | Duplicate of skills; migration target is skills |
| Generic `/commit` / `/explain` packs | **NO** | Fight the loop; noise |

## List — plugins

Three plugin planes. Only git-tracked ones are clone DX.

### Cursor (agent)

| Plugin | Verdict | Why |
|---|---|---|
| In-repo `.cursor/` pack | **MUST** | Skills + MCP without Customize |
| Wrap as Cursor Plugin (`.cursor-plugin/` or Agent Plugin) | **LATER** | Clone does not auto-install plugins. Only if team marketplace **Required**. |
| Grafana Cloud (Cursor Marketplace) | **NO** | Hosted Grafana Cloud product, not our OSS `mcp-grafana` |
| Cursor Team Kit / CI-review marketplace | **NO** (now) | Duplicates `/review` + GHA automerge |
| Stripe, Linear, Notion, Atlassian, Figma, Datadog | **NO** | No payments; vault is Jira; OSS Grafana |
| Cursor plugin **inside** IntelliJ (ACP) | **SHOULD** (laptop) | Humans stay in IDEA; not a git MCP; optional |

### IntelliJ

| Plugin | Verdict | Why |
|---|---|---|
| **MCP Server** (bundled 2025.2+) | **MUST** | Enable Settings → Tools → MCP Server. Official: [MCP Server](https://www.jetbrains.com/help/idea/mcp-server.html). Replaces deprecated `@jetbrains/mcp-proxy`. |
| Cursor for IntelliJ (ACP) | **SHOULD** | Same as above; laptop preference |
| Extra Spring Assistant marketplace pile | **NO** | IDEA Ultimate Spring support is enough; do not petrify |

### Obsidian (humans)

Already [[ops/PLUGINS]]. **KEEP** Kanban, Dataview, Tasks, Calendar. Agents edit markdown in git.

### Jenkins

Already `ops/jenkins/plugins.txt`. **KEEP**. Not a Cursor MCP.

## List — MCP servers

Committed today in `.cursor/mcp.json`: `grafana`, `postgres`, `postgres-catalog`, `github`, `docker`, `playwright`.

| Server | Verdict | Write? | Where it runs |
|---|---|---|---|
| `grafana` | **KEEP** | No (`--disable-write`) | Laptop + Cloud stdio (human attach) |
| `postgres` / `postgres-catalog` | **KEEP** | No (`ops_reader`) | Local compose |
| `github` | **KEEP** | PRs/comments; merge = CI | Token in gitignored `.env.ops` |
| `docker` | **KEEP** | Local compose only | Docker Desktop gateway |
| `playwright` | **KEEP** | Local URLs | UI later; harmless if unused |
| **`intellij`** | **MUST** Goal 2 | IDE tools (build, inspect, run) | **Laptop.** IDEA 2025.2+ built-in server. Stdio (not SSE with ephemeral ports). Wrapper `scripts/mcp-intellij` if the copied config is machine-pathed. |
| Mailpit | **LATER** | Local | When outbound mail exists |
| Jenkins MCP | **NO** | — | House CI is compose UI + GHA |
| Filesystem / memory / Slack / Stripe / Jira | **NO** | — | Workspace is files; vault is tracker |
| Remote Grafana HTTP/SSE | **blocked** | — | [[ops/tickets/WF-004]] / [[ops/tickets/WF-010]] |

### IntelliJ MCP (selected)

- **Name:** `intellij`
- **Product:** IntelliJ IDEA 2025.2+ integrated MCP Server ([docs](https://www.jetbrains.com/help/idea/mcp-server.html))
- **Do:** inspections, `build_project`, Maven/Gradle via IDE, run configurations, symbol/call hierarchy — better than grep for Java
- **Must not:** require IDEA for `./scripts/app start` / CI; enable “brave mode” in repo docs; put SSE `127.0.0.1:<random>` in git
- **Cloud Agents:** skip. No IntelliJ in the VM. Use `mvnw test` + HTTP observe.
- **Deprecated fallback:** `@jetbrains/mcp-proxy` only if someone is stuck on IDEA &lt; 2025.2 — do not make it the house default

Goal 2 `mcp.json` sketch (stdio; command may become the wrapper):

```json
"intellij": {
  "command": "./scripts/mcp-intellij"
}
```

## Existing keep (do not redo)

| Kind | What |
|---|---|
| Hook | `.cursor/hooks/session-ops.py` — keep tiny. Cloud Agents do **not** run `sessionStart` (laptop only). |
| Rules | house-stack, no-prod, ops-loop, obsidian-ops |
| Automations | Specified; not MVP to re-enable UI ([[ops/tickets/WF-003]]) |
| Cloud image | `.cursor/environment.json` + Dockerfile |

## Review checklist (Terry)

Mark keep/drop on Goal 2. Already locked: **`intellij` MCP**.

- [ ] MUST skills (clone-run, reviewer, mcp-observe, intellij-ide)
- [ ] MUST slash skills (`/next-ticket` … `/mcp-health`) as skills, not `.cursor/commands/`
- [ ] SHOULD spring-catalog now vs later
- [ ] SHOULD Cursor-in-IntelliJ ACP (not git)
- [ ] LATER vite-pwa, mailpit, plugin wrapper
- [ ] NO column stands

After review: set [[ops/tickets/WF-034]] `status: implement`, clear `gate` (or leave gate if only laptop IDEA enable remains). Implementer lands files; does not merge.

## Links

- Ticket: [[ops/tickets/WF-034]]
- Plan: [[ops/plans/WF-034]]
- Canvas: [[ops/workflow/agent-dx-pack]] — path `ops/workflow/agent-dx-pack.canvas`
- Local: [[ops/workflow/LOCAL]] · MCP: [[ops/workflow/MCP]] · Skills: [[ops/workflow/SKILLS]]
- Stack: [`product/STACK.md`](../../product/STACK.md)
- Add-skill: [[ops/runbooks/ADD_SKILL]]

## Path map

Vault = `docs/`. This brief: `docs/ops/workshops/agent-dx-pack.md`. Canvas: `docs/ops/workflow/agent-dx-pack.canvas`. Runtime configs stay at repo `.cursor/` and `scripts/` (Goal 2).
