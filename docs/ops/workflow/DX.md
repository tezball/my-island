---
title: Run, observe, test
type: workflow
owner: automation-expert
audience: human-and-agent
cssclasses:
  - moc
---

# Run, observe, test

**Audience:** human engineer **and** AI agent. Imperative. Paths are real.

Read skills first (do not invent another): `.cursor/skills/ops-loop/SKILL.md`, `.cursor/skills/clone-run/SKILL.md`, `.cursor/skills/automation/SKILL.md`, `.cursor/skills/mcp-observe/SKILL.md`. Slash: `/app-start`, `/app-test`, `/mcp-health`, `/next-ticket`. Toolbox map: [[AGENT_DX]]. Add skills only via [[ops/runbooks/ADD_SKILL]].

Confirm a deploy: [[ops/runbooks/CONFIRM_DEPLOY]]. Policy: [[LOOP]] · [[PIPELINE]] · [[MCP]] · [[LOCAL]] · [[CI]] · [[TEST_STACK]] · [[SAFETY]].

## Clone / run

One Compose file: repo-root `compose.yml`. One stack on the laptop (ports are shared). Chaos **off**.

| Who | Command | What |
|---|---|---|
| **Human / agent (default)** | `./scripts/app start` · `stop` · `test` · `help` | Wrapper. Start opens local URLs if a display exists. `test` starts if needed, then pytest + catalog `mvnw test` + HTTP smoke. |
| **CI, Cloud `start.sh`, `ops/scripts/start-local.sh`** | `./scripts/dev up` · `test` · `down` | Same stack. `./scripts/dev test` is the CI contract. Fast vault: `python3 -m pytest ops/tests -q -m "not stack"`. |

```bash
git clone https://github.com/tezball/my-island.git
cd my-island
./scripts/app start
./scripts/app test
```

| Thing | URL |
|---|---|
| Explore PWA | http://127.0.0.1:5173 |
| Catalog | http://127.0.0.1:8081 |
| Grafana | http://127.0.0.1:3030 (`admin` / `admin`) |
| Prometheus | http://127.0.0.1:9091 |
| Jenkins | http://127.0.0.1:8085 (`admin` / `admin`) |
| Postgres | `127.0.0.1:5433` · `ops_reader` / `ops_reader` · db `ops` |

Do not start Compose from a second worktree while this stack is up. Do not require IntelliJ. Detail: [[LOCAL]].

## Ticket loop (no agent SSH)

```
implement ticket → ready PR → GHA CI → automerge → Jenkins mock-prod → HTTP smoke
```

1. Ticket `status: implement` on `main` (`PRD-*` product, `WF-*` workflow). Skip `type: epic`. `python3 ops/scripts/next_ticket.py --role auto`. One hat.
2. Sibling worktree from `origin/main` ([[ops/runbooks/WORKTREE]]). Cloud Agents: branch in the VM; they do not use laptop worktrees.
3. Meet [[DOD]]. Open a **ready** (non-draft, same-repo) PR. Title `<id>: <title>`. Chat does **not** `gh pr merge`.
4. **GHA** jobs on the PR: `unit tests` (vault pytest) + `catalog tests` (Testcontainers BFF) + `web tests` (Vitest) + `compose stack` (`./scripts/dev test`, `SKIP_JENKINS=1`). Green is not enough. A **different** actor (not the implementer, not `github-actions[bot]`) must submit GitHub review state `APPROVED` on the head SHA; then Actions **squash-merges** ([[ops/tickets/WF-050]]). Drafts and forks skip. If CI is green with no valid Approve, the merge job waits (succeeds, PR stays open).
5. Reviewer **may** Approve or Request changes. Implementer must not Approve their own PR. Chat never `gh pr merge`.
6. After `main` is green, Jenkins job `deploy-mock-prod` (cron `H/5` + GHA check gate) deploys **`origin/main` only** to https://fishing-journals.com/. SSH key stays in Jenkins. **Agents never SSH.** They do not run `./scripts/deploy-mock-prod.sh`. **Lock C:** a session on the **Mac mini self-hosted worker** may trigger that job on loopback Jenkins ([[ops/tickets/WF-049]]). Cloud VMs do not reach Jenkins over HTTPS (not B). Not GHA SSH (not D).
7. Job smoke: `ops/scripts/smoke_mock_prod.py` — health UP, `/actuator/info` SHA matches `origin/main`, `GET /api/v1/places?published=true`. Not Playwright.

Close-out: delete branch, remove worktree, `git pull --ff-only` on the primary, confirm Actions on **`main`** are green (else fix PR).

## Test box (not production)

https://fishing-journals.com is **mock-prod**. It is **not** a GitHub Environment named `production`. This company has no prod ([[ops/company/DECISIONS]]). Do not invent `compose.prod` or a prod SSH gate.

| | |
|---|---|
| Explore | https://fishing-journals.com/ |
| Health | https://fishing-journals.com/actuator/health |
| Info (deploy SHA) | https://fishing-journals.com/actuator/info |
| Places | https://fishing-journals.com/api/v1/places?published=true |

Leftover `grafana.fishing-journals.com` is **not** house Grafana. Do not publish Prometheus on the public internet. Deploy runbook: [[ops/runbooks/MOCK_PROD_DEPLOY]].

## MCP pack

Laptop / Dev Container: `.cursor/mcp.json` after compose is up; reload MCP.

| Name | Backend | Write? | Cloud Agents |
|---|---|---|---|
| `grafana` | `uvx mcp-grafana --disable-write` → http://127.0.0.1:3030 | No | Not from repo. Human attaches **stdio** on cursor.com (same command, loopback). |
| `postgres` | DSN db `ops`, role `ops_reader` | **SELECT only** | Same: dashboard stdio, or skip. |
| `postgres-catalog` | DSN db `catalog`, `ops_reader` | **SELECT only** | Grants: [[ops/tickets/WF-016]]. Do not assume `place` SELECT until grants exist. |
| `playwright` | `npx -y @playwright/mcp@latest` | Local URLs | Not in repo attach. Cron + MCP on demand ([[ops/tickets/WF-011]]). |
| `github` | official image; token in gitignored `.env.ops` | PRs/comments. Merge is CI. | Dashboard GitHub MCP if present. |
| `docker` | Docker MCP Toolkit, local compose | Local only | No. |
| `intellij` | `./scripts/mcp-intellij` | IDE | **Never.** No IDEA in the VM. |

`.cursor/mcp.json` does **not** follow Cloud Agents. `.cursor/environment.json` cannot register MCP. Do **not** add HTTP/SSE MCP pointed at `127.0.0.1` (proxied off-VM).

**What Cloud Agents actually get today:** public HTTPS + loopback HTTP to compose (`:8081`, `:3030`, `:9091`). Grafana/Postgres tools exist only after a human attaches stdio. Until then use the PromQL fallback on [[ops/runbooks/CONFIRM_DEPLOY]]. Mock-prod Grafana HTTP/SSE is [[ops/tickets/WF-041]] (house Prom/Loki from the test server — not compose-only SoR after that lands). Jenkins / Gatling / Playwright / deploy-status MCP is [[ops/tickets/WF-042]] — secrets in Jenkins / Cursor MCP settings, **never** in `docs/`.

If Grafana MCP is red: compose down or MCP not reloaded — not a frontend ticket.

## Auth and writes

| Path | Who | Notes |
|---|---|---|
| `POST /api/auth/login` | Seeded **password Guest** | JSON `{"username","password"}`. Automation / Gatling / Playwright. |
| `POST /api/auth/google` | Human Google GIS | JSON `{"idToken"}`. Keep GIS. Not an OIDC stub. |
| `GET /api/v1/me` | Session cookie | 401 if logged out. |
| `POST /api/auth/logout` | Session | |
| `GET /api/v1/places` · `GET /api/v1/places/{id}` | Anyone | Public directory. JSON includes anonymous **`beenCount` only**. |
| `POST /api/v1/places` | **Import key**, not a Guest | Header `X-Catalog-Import-Key`. Env `CATALOG_IMPORT_KEY`. Anonymous → 401. Guests cannot create Places. |
| `PUT`/`PATCH`/`DELETE /api/v1/places/**` | Denied | Seed/import only ([[ops/tickets/WF-046]]). |
| `GET /api/v1/me/visit-intents` | Signed-in Guest | Lists are **private**. Filter `?mark=been\|want\|never`. |
| `PUT`/`DELETE /api/v1/me/places/{id}/visit-intent` | Signed-in Guest | `{"mark":"been\|want\|never"}`. Want/never stay off public Place JSON. |

Local compose defaults (already in `compose.yml`, same class as Grafana `admin`/`admin`): seed Guest `guest` / `guest`; import key `local-import`. **Do not** copy mock-prod values into notes. Override via env / Jenkins. GIS Console origins: [[ops/runbooks/GOOGLE_GIS]].

Workshop sims (`./scripts/dev sim`, STACK-E2E) must send the import header. Public fishing-journals.com must not accept anonymous Place POST.

## Tests

| Lane | When | Command / home |
|---|---|---|
| **Merge CI = BFF** | Every PR + `main` | GHA `unit` + `catalog` (Testcontainers / Gherkin) + `web` + `stack` + `chaos` + `zap`. Automerge waits on these. Same as `./scripts/dev test` / `services/catalog/mvnw test`. |
| **Chaos Monkey** | Merge CI (not cron, not public host) | [[ops/tickets/WF-043]]. Job `chaos` in `.github/workflows/ci.yml`. Off `unit`/`catalog`. Overlay workshop: `/stack-e2e`. |
| **ZAP-style DAST** | Merge CI vs local compose/Testcontainers | [[ops/tickets/WF-044]]. Job `zap` in `ci.yml` scans `http://127.0.0.1:8081`. Not the primary scan of fishing-journals.com. |
| **Playwright** | Cron (~6h) + MCP on demand | [[ops/tickets/WF-011]]. **Not a merge gate.** Keep off `unit`/`catalog`. |
| **Gatling trickle** | Ongoing on fishing-journals.com | Feature smoke, not merge load ([[ops/tickets/WF-042]]). Fail → Jenkins red + Grafana/AM ([[ops/tickets/WF-045]]). |
| **Gatling full perf** | Weekly Jenkins cron or MCP/manual | Not every merge. Same fail path. Seeded password Guest, not Google. |

Vitest is a merge gate. Do not assault public fishing-journals.com with Chaos Monkey on every deploy. Map: [[TEST_STACK]].

## Confirm deploy

Copy-paste: [[ops/runbooks/CONFIRM_DEPLOY]]. Short version:

1. `curl -sS https://fishing-journals.com/actuator/health` → JSON `status=UP` (not HTML).
2. `curl -sS https://fishing-journals.com/actuator/info` → `gitCommit` equals `origin/main` (not `unknown`).
3. `curl -sS 'https://fishing-journals.com/api/v1/places?published=true'` → JSON array.
4. Watch GHA on `main` and Jenkins `deploy-mock-prod` if you have UI/MCP. Do not SSH.

## Debug

1. Prefer `grafana` MCP PromQL `up{job="catalog"}` (`--disable-write`).
2. If tools are missing (typical Cloud Agent): HTTP PromQL on [[ops/runbooks/CONFIRM_DEPLOY]].
3. After [[ops/tickets/WF-041]], house Grafana datasources are the **test server**. Loopback PromQL is a compose fallback, not SoR.
4. Postgres MCP: SELECT only. Stop if a tool can INSERT/UPDATE/DELETE.
5. Red Jenkins + Grafana/AM on trickle/weekly Gatling fail. Leftover fishing-journals email stays muted ([[ops/tickets/INC-001]]).
