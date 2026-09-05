---
title: Local setup
type: workflow
---

# Local setup

Environment zero. No product API. Observability + Postgres exist so MCP and agents have something to talk to. **One Compose file** (`compose.yml` at the repo root) is used by git-clone, Dev Containers, Cloud Agents, and CI.

## Git clone, run

Docker required (Docker Desktop, or Engine + Compose v2).

```bash
git clone https://github.com/tezball/my-island.git
cd my-island
./scripts/dev up
./scripts/dev test
```

`./ops/scripts/start-local.sh` is the same as `./scripts/dev up`. Stop: `./scripts/dev down`.

| Thing | URL |
|---|---|
| Grafana | http://localhost:3030 (`admin` / `admin`) |
| Prometheus | http://localhost:9091 |
| Loki | http://localhost:3101 |
| Alertmanager | http://localhost:9094 |
| Postgres | `localhost:5433` · `ops_reader` / `ops_reader` · db `ops` (offset ports so a laptop Postgres/Grafana can keep 5432/3000) |

Cursor project MCP (`.cursor/mcp.json`) points at these URLs. After compose is up, reload MCP.

## Dev Container

Open the repo in Cursor or VS Code and **Reopen in Container**. `.devcontainer/devcontainer.json` starts `compose.yml` and attaches to the `workspace` service (Java 21, Python 3, Node, Docker CLI). A post-start script maps Grafana/Postgres onto `127.0.0.1:3030` / `5433` so `.cursor/mcp.json` still works.

## Cloud Agents

`.cursor/environment.json` + `.cursor/Dockerfile` install Docker-in-Docker. The `start` command runs `sudo service docker start` then `docker compose up` for the same stack. See `AGENTS.md` (Cursor Cloud specific instructions).

## Once (laptop MCP extras)

1. Docker running (compose **and**, for the Docker MCP Toolkit, the gateway).
2. Open `ops/` as an Obsidian vault. Install community plugin **Kanban** when prompted.
3. Gitignored `.env.ops` in the repo root with `GITHUB_PERSONAL_ACCESS_TOKEN=` (fine-grained: contents, pull requests, Actions read). Never commit it, never paste it in chat. See [[MCP]].
4. `uvx` on PATH (Grafana MCP) if you are **not** in the Dev Container — the workspace image already has `uv`. `npx` for Postgres + Playwright. `python3` 3.11+.

## Check

```bash
curl -sf http://localhost:3030/api/health
docker compose ps
./scripts/dev test
```

If Grafana MCP cannot connect, compose is down or Cursor has not reloaded MCP. Fix that before product code.

## CI

`.github/workflows/ci.yml` validates `compose.yml`, builds the workspace image, starts the stack, and runs the same pytest suite (`REQUIRE_STACK=1`).
