---
title: Local setup
type: workflow
---

# Local setup

This is environment zero. No product API. Observability + Postgres exist so MCP and agents have something to talk to.

## Once

1. Docker Desktop running (compose **and** the MCP Toolkit gateway).
2. Open `ops/` as an Obsidian vault. Install community plugin **Kanban** when prompted.
3. Gitignored `.env.ops` in the repo root with `GITHUB_PERSONAL_ACCESS_TOKEN=` (fine-grained: contents, pull requests, Actions read). Never commit it, never paste it in chat. See [[MCP]].
4. `uvx` on PATH (Grafana MCP). `npx` for Postgres + Playwright. `python3` 3.11+.

## Every session

```bash
./ops/scripts/start-local.sh
```

| Thing | URL |
|---|---|
| Grafana | http://localhost:3030 (`admin` / `admin`) |
| Prometheus | http://localhost:9091 |
| Loki | http://localhost:3101 |
| Alertmanager | http://localhost:9094 |
| Postgres | `localhost:5433` · `ops_reader` / `ops_reader` · db `ops` (offset ports so a laptop Postgres/Grafana can keep 5432/3000) |

Stop: `./ops/scripts/stop-local.sh`

Cursor project MCP (`.cursor/mcp.json`) points at these URLs. After compose is up, reload MCP.

## Check

```bash
curl -sf http://localhost:3030/api/health
docker compose -f ops/compose.yml ps
```

If Grafana MCP cannot connect, compose is down or Cursor has not reloaded MCP. Fix that before product code.
