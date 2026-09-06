---
title: MCP pack
type: workflow
---

# MCP pack

Same server names locally and (later) against prod. **Read-only on data planes.** GitHub may open PRs and comment; it may not merge.

## Local (committed)

`.cursor/mcp.json` — started by **laptop Cursor / Dev Container** in this repo. Reload MCP after compose is up.

| Name | Backend | Write? |
|---|---|---|
| `grafana` | `uvx mcp-grafana --disable-write` → http://127.0.0.1:3030 | No |
| `postgres` | Postgres MCP → db `ops` (`mcp_ping`) | **No** — role is `ops_reader` (SELECT only) |
| `github` | Official image `ghcr.io/github/github-mcp-server` · token from gitignored `.env.ops` | PRs and comments only. No merge, no admin. Toolsets: context, repos, pull_requests, actions, users |
| `docker` | Docker MCP Toolkit gateway, `--servers docker` (local CLI) | Local compose only. Not prod, not a remote docker.sock |
| `playwright` | `npx -y @playwright/mcp@latest` | Local and staging URLs. Not prod |

Do not put a PAT in this file or in chat. Put `GITHUB_PERSONAL_ACCESS_TOKEN=` in gitignored `.env.ops`. The github server is stdio so Cursor can load that file (`envFile` does not apply to remote HTTP). Reload MCP after `.env.ops` exists and Docker Desktop is up.

**TODO (Engineering, not this PR):** `ops_reader` `SELECT` on db `catalog` (`place`) — Flyway/SQL grants + optional second MCP DSN `postgres-catalog`. No Engineering PR yet. Do not duplicate grants SQL here. Ticket: [[tickets/WF-016]].

## Cloud Agents (local compose)

`.cursor/mcp.json` does **not** follow Cloud Agents or Automations. `.cursor/environment.json` has **no** MCP-attach field; it only boots DinD + `./scripts/dev up` so HTTP to `127.0.0.1:3030` / `5433` / `8081` works. `uvx` / `npx` are on the Cloud VM PATH (image installs `uv` + Node).

**Attach grafana + postgres for a Cloud Agent** (human, one-time on cursor.com — agents cannot register MCP from the repo):

1. Open [cursor.com/agents](https://cursor.com/agents) → MCP dropdown (personal) or **Dashboard → Integrations & MCP** (team).
2. Add **stdio** (not HTTP) servers that match `.cursor/mcp.json`: `grafana` (`uvx mcp-grafana --disable-write`, `GRAFANA_URL=http://127.0.0.1:3030`, local admin/admin) and `postgres` (DSN db `ops`). Stdio runs **inside the agent VM**, so loopback is the compose stack.
3. Do **not** add these as HTTP/SSE MCP. Cursor proxies HTTP MCP through its backend; `127.0.0.1` would be that host, not the VM. SSE and `mcp-remote` are not supported on Cloud Agent VMs.
4. Enable the servers for Cloud Agents. Next run should list `grafana` / `postgres` tools.

Until a human does that, Cloud Agents use **HTTP equivalents** (same signals, no MCP toolbox):

```bash
curl -sS -G 'http://127.0.0.1:9091/api/v1/query' --data-urlencode 'query=up{job="catalog"}'
curl -sS -u admin:admin -H 'content-type: application/json' \
  -d '{"queries":[{"refId":"A","datasource":{"type":"prometheus","uid":"prometheus"},"expr":"up{job=\"catalog\"}","instant":true}],"from":"now-5m","to":"now"}' \
  http://127.0.0.1:3030/api/ds/query
```

Copy-paste also lives on [[runbooks/STACK_E2E_PLACE_STUB]]. Local Grafana basic auth is already in [[LOCAL]] (not a secret). This is the WF-016 platform gap: repo config cannot attach the toolbox; dashboard stdio can.

Catalog `place` `SELECT` as `ops_reader` waits on Engineering grants (TODO above). `mcp_ping` on db `ops` already works.

Staging/prod Grafana remains [[tickets/WF-004]] (blocked on [[tickets/WF-010]]). Do not treat this local-compose path as remote observe.

## Prod / staging (not in this file)

When Grafana exists remotely:

1. Duplicate the `grafana` server in **Cursor dashboard MCP** (Cloud Agents cannot see laptop stdio).
2. `GRAFANA_URL` = staging or prod. Service-account **Viewer** token. `--disable-write`.
3. **No** prod Postgres MCP until a replica + PII policy exists ([[../ENGINEERING|CTO review]]).
4. Agents get **observe** on prod, **write** on git and on staging only.

## Safety

- If a tool can `INSERT`/`UPDATE`/`DELETE`, it is misconfigured. Stop.
- Do not put PATs or Grafana passwords in tickets, plans, or PR bodies.
- Cloud Automations: only dashboard-catalog MCP servers work. Laptop `.cursor/mcp.json` does not follow Cloud Agents.
