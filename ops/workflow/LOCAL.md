---
title: Local setup
type: workflow
---

# Local setup

Environment zero plus the **PRD-001 catalog stub**. **One Compose file** (`compose.yml` at the repo root) is used by git-clone, Dev Containers, Cloud Agents, and CI.

**One command** (Terry / laptop): [[tickets/WF-021]]

```bash
./scripts/app start   # stack up, open local URLs if a display exists, print ready summary
./scripts/app stop    # stack down
./scripts/app test    # start if needed; pytest + catalog mvn + HTTP smoke; PASS/FAIL
./scripts/app help
```

`./scripts/app` wraps `./scripts/dev`. CI, Cloud Agent `start.sh`, and `./ops/scripts/start-local.sh` still call `./scripts/dev up` / `test` / `down`. Chaos stays **off** on start.

Postgres is **PostGIS** (`postgis/postgis:17-3.5-alpine`). If this machine already had a `postgres:17-alpine` volume, recreate it:

```bash
docker compose down -v
./scripts/app start
```

## Git clone, run

Docker required (Docker Desktop, or Engine + Compose v2).

```bash
git clone https://github.com/tezball/my-island.git
cd my-island
./scripts/app start
./scripts/app test
```

`./ops/scripts/start-local.sh` is the same as `./scripts/dev up`. Stop: `./scripts/app stop` (or `./scripts/dev down`).

| Thing | URL |
|---|---|
| Grafana | http://localhost:3030 (`admin` / `admin`) |
| Prometheus | http://localhost:9091 |
| Loki | http://localhost:3101 |
| Alertmanager | http://localhost:9094 |
| Postgres | `localhost:5433` · `ops_reader` / `ops_reader` · db `ops` (MCP). Catalog Flyway owns db `catalog` (user `ops` / `ops`). Catalog `place` SELECT for `ops_reader` is Engineering (TODO on [[tickets/WF-016]]) |
| Catalog API | http://localhost:8081 (create / list / get places) |

Cursor project MCP (`.cursor/mcp.json`) points at Grafana and Postgres db `ops`. After compose is up, reload MCP. Cloud Agents: see [[MCP]] — laptop mcp.json does not follow; use dashboard **stdio** or HTTP PromQL.

### Catalog stub (create → list → get)

Repeatable sim (happy path, no chaos): [[runbooks/PLACE_LISTING_SIM]]

```bash
./scripts/sim-place-listing.sh
./scripts/sim-place-listing.sh --iterations 10
```

Manual curl:

```bash
curl -s http://127.0.0.1:8081/actuator/health
curl -s http://127.0.0.1:8081/api/v1/categories
curl -s -X POST http://127.0.0.1:8081/api/v1/places \
  -H 'content-type: application/json' \
  -d '{"name":"Skellig Michael","slug":"skellig-michael","categoryId":"poi","countyId":"kerry","town":"Portmagee","latitude":51.7708,"longitude":-10.5406,"published":true}'
curl -s http://127.0.0.1:8081/api/v1/places
curl -s http://127.0.0.1:8081/api/v1/places/skellig-michael
```

Package / repo remain `island.catalog` / my-island. Brand is open — no public product name on the API. No consumer UI here ([[tickets/PRD-003]]).

### Chaos Monkey (workshop only)

Default `./scripts/dev up` does **not** enable assaults. Overlay + compose profile:

```bash
docker compose -f compose.yml -f compose.chaos.yml --profile chaos up -d catalog --wait
```

That sets Spring profile `chaos` (and library profile `chaos-monkey`; latency + exceptions; kill stays off). Health + prometheus stay on the default path.

Full drill (HTTP + MCP-or-HTTP observe + overlay down): [[runbooks/STACK_E2E_PLACE_STUB]]. Required CI must not enable chaos.

## Dev Container

Open the repo in Cursor or VS Code and **Reopen in Container**. `.devcontainer/devcontainer.json` starts `compose.yml` and attaches to the `workspace` service (Java 21, Python 3, Node, Docker CLI). A post-start script maps Grafana/Postgres onto `127.0.0.1:3030` / `5433` so `.cursor/mcp.json` still works.

## Cloud Agents

`.cursor/environment.json` + `.cursor/Dockerfile` install Docker-in-Docker. The `start` command runs `sudo service docker start` then `./scripts/dev up` for the same stack (including catalog). See `AGENTS.md` (Cursor Cloud specific instructions).

HTTP to Grafana `:3030`, Prometheus `:9091`, Postgres `:5433`, and catalog `:8081` works from the VM. **MCP toolbox** (`grafana`, `postgres`) does **not** load from `.cursor/mcp.json`. A human adds matching **stdio** servers on cursor.com (MCP dropdown / team Integrations) so they run in the VM against loopback. HTTP MCP must not target `127.0.0.1` (proxied off-VM). Until attach exists, use the PromQL HTTP fallback on [[runbooks/STACK_E2E_PLACE_STUB]]. Full policy: [[MCP]].

## Once (laptop MCP extras)

1. Docker running (compose **and**, for the Docker MCP Toolkit, the gateway).
2. Open `ops/` as an Obsidian vault (not `docs/`). Plugins: [[PLUGINS]].
3. Gitignored `.env.ops` in the repo root with `GITHUB_PERSONAL_ACCESS_TOKEN=` (fine-grained: contents, pull requests, Actions read). Never commit it, never paste it in chat. See [[MCP]].
4. `uvx` on PATH (Grafana MCP) if you are **not** in the Dev Container — the workspace image already has `uv`. `npx` for Postgres + Playwright. `python3` 3.11+.

## Check

```bash
curl -sf http://localhost:3030/api/health
docker compose ps
./scripts/app test
```

If Grafana MCP cannot connect, compose is down or Cursor has not reloaded MCP. Fix that before product code.

## CI

`.github/workflows/ci.yml` has a `catalog` Maven job (Testcontainers PostGIS) plus a `stack` job that validates compose, starts the stack (including catalog), and runs pytest (`REQUIRE_STACK=1`).
