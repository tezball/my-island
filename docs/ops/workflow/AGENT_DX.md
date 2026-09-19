---
title: Agent DX toolbox
type: workflow
owner: automation-expert
cssclasses:
  - moc
---

# Agent DX toolbox

High-level map of the **in-repo** tools this company gives engineers and agents after `git clone`. **Run / observe / test handbook:** [[DX]]. Confirm deploy: [[ops/runbooks/CONFIRM_DEPLOY]]. Workshop (what we selected): [[ops/workshops/agent-dx-pack]]. Catalog: [[SKILLS]] · [[MCP]] · [[LOCAL]].

Clone, then:

```bash
./scripts/app start
./scripts/app test
```

Open **`docs/`** in Obsidian, the **repo root** in Cursor, and the **same repo** in IntelliJ IDEA (2025.2+). Type `/` in Cursor Agent chat for slash skills.

## What you got

| Kind | What | How you use it |
|---|---|---|
| **CLI** | `./scripts/app` | start / stop / test the compose stack (one stack; [[WORKTREES]]) |
| **Tests** | gates + tools | [[TEST_STACK]] — how / what / wiring; `/app-test`, `./scripts/dev sim`, later Gatling traffic |
| **Always-on rules** | house-stack, no-prod, ops-loop, vault notes | Cursor applies them; you do not toggle them |
| **Skills (auto)** | ops-loop, automation, clone-run, reviewer, mcp-observe, intellij-ide, spring-catalog, STACK-E2E | Agent picks them from the prompt |
| **Slash skills** | `/next-ticket`, `/plan`, `/implement`, `/review`, `/app-start`, `/app-test`, `/board-sync`, `/mcp-health`, `/new-ticket`, `/stack-e2e`, `/dod` | Type `/name` in Agent chat |
| **MCP** | grafana, postgres, postgres-catalog, github, docker, playwright, **intellij** | Cursor tool list after reload MCP |
| **Obsidian** | Kanban, Dataview, Bases | Humans; agents edit markdown in git |
| **Jenkins** | http://127.0.0.1:8085 | Local house CI; not an MCP |

Not in the pack: Stripe, Linear, Notion, Datadog, Grafana Cloud marketplace, Next.js skills, `.cursor/commands/` (slash lives in skills).

## Examples

### Pick the next piece of work

In Cursor: **`/next-ticket`**. The agent runs `python3 ops/scripts/next_ticket.py --role auto`, wears **one** hat, skips epics. Then `/plan` or `/implement` — not both in the same session. Implement in a **new Cursor window** on a sibling worktree ([[WORKTREES]]); keep `~/Projects/my-island` on `main`.

### Bring the stack up and prove it

**`/app-start`** then **`/app-test`**. Same as:

```bash
./scripts/app start   # Grafana :3030, catalog :8081, Jenkins :8085
./scripts/app test    # pytest + catalog mvn + HTTP smoke
```

Reload MCP after start. If Grafana MCP is red, compose is down or Cursor has not reloaded — **`/mcp-health`**.

### Observe the catalog (MCP or curl)

With compose up, ask: “Is catalog up in Prometheus?” Agent should use `grafana` PromQL `up{job="catalog"}`, or:

```bash
curl -sS -G 'http://127.0.0.1:9091/api/v1/query' --data-urlencode 'query=up{job="catalog"}'
```

Cloud Agents often have **no** grafana MCP until a human attaches stdio on cursor.com. Curl is the fallback. Postgres MCP is **SELECT only** (`ops_reader`).

### Java / Spring in IntelliJ

Everyone uses IDEA. Once: Settings → Tools → **MCP Server** → Enable (bundled plugin). Open this repo. Cursor server `intellij` is `./scripts/mcp-intellij`.

Ask: “Run IDEA inspections on `PlaceService` and fix compile errors.” The agent should use IntelliJ tools (`build_project`, inspections, symbols), not only grep.

If IDEA is closed, the `intellij` row in Cursor is red. That is fine. Use `services/catalog/mvnw test`. **Do not** turn on brave mode. **Do not** commit SSE URLs with random ports.

Optional laptop: install the **Cursor plugin inside IntelliJ** (ACP) so you stay in IDEA while the agent runs. That plugin is not git.

### Review a PR without merging

**`/review`**. Agent comments against SAFETY + DoD. Ready PRs squash-merge via GitHub Actions when CI is green. Chat never `gh pr merge`.

### New workflow ticket

**`/new-ticket`**, then fill Outcome / Verify. Example:

```bash
python3 ops/scripts/new_ticket.py --prefix WF --type workflow --title "…" --owner automation-expert
python3 ops/scripts/board_sync.py
```

### Place-stub e2e drill

**`/stack-e2e`**. Happy-path compose, HTTP create/list/get, observe, optional chaos overlay. Chaos stays **off** default start and UI-less `unit`/`catalog`. Dedicated **merge** Chaos: [[ops/tickets/WF-043]]. ZAP every merge: [[ops/tickets/WF-044]]. Gatling trickle + weekly: [[ops/tickets/WF-042]]. Failures Jenkins red + Grafana: [[ops/tickets/WF-045]]. Playwright is cron + MCP only: [[ops/tickets/WF-011]]. Live catalog closes public Place writes: [[ops/tickets/WF-046]] (workshop POST is stub history).

## IntelliJ MCP (laptop)

| | |
|---|---|
| Server name | `intellij` |
| Script | `scripts/mcp-intellij` (`--help` for once-steps) |
| IDE | IntelliJ IDEA **2025.2+** built-in MCP Server |
| Cloud Agents | Skip. No IDEA in the VM. |

Clone and CI must work with IntelliJ **closed**.

## Where configs live

| Path | Role |
|---|---|
| `.cursor/skills/<name>/SKILL.md` | Skills + slash skills (`name` = folder) |
| `.cursor/mcp.json` | Laptop / Dev Container MCP |
| `.cursor/rules/*.mdc` | Always / glob rules |
| `.cursor/hooks/` | Laptop `sessionStart` only (not Cloud) |
| `docs/ops/` | Company OS (tickets, this note) |

Cloud Agents load **repo** skills. They do **not** load `.cursor/mcp.json`. Attach grafana/postgres as dashboard **stdio** if you want the toolbox in the VM. Handbook: [[DX]].

## Add or change a skill

[[ops/runbooks/ADD_SKILL]]. One skill, one job. Do not add `.cursor/commands/`.
