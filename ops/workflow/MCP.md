---
title: MCP pack
type: workflow
---

# MCP pack

Same server names locally and (later) against prod. **Read-only on data planes.** GitHub may open PRs and comment; it may not merge.

## Local (committed)

`.cursor/mcp.json` — started by Cursor in this repo.

| Name | Backend | Write? |
|---|---|---|
| `grafana` | `mcp-grafana --disable-write` → http://localhost:3030 | No |
| `postgres` | Postgres MCP → local `ops` database | **No** — role is `ops_reader` (SELECT only) |
| `github` | Official image `ghcr.io/github/github-mcp-server` · token from gitignored `.env.ops` | PRs and comments only. No merge, no admin. Toolsets: context, repos, pull_requests, actions, users |
| `docker` | Docker MCP Toolkit gateway, `--servers docker` (local CLI) | Local compose only. Not prod, not a remote docker.sock |
| `playwright` | `npx -y @playwright/mcp@latest` | Local and staging URLs. Not prod |

Do not put a PAT in this file or in chat. Put `GITHUB_PERSONAL_ACCESS_TOKEN=` in gitignored `.env.ops`. The github server is stdio so Cursor can load that file (`envFile` does not apply to remote HTTP). Same official GitHub MCP; Cloud Agents still need the remote URL on cursor.com later. Reload MCP after `.env.ops` exists and Docker Desktop is up.

## Prod / staging (not in this file)

When Grafana exists remotely:

1. Duplicate the `grafana` server in **Cursor dashboard MCP** (Cloud Agents cannot see laptop stdio).
2. `GRAFANA_URL` = staging or prod. Service-account **Viewer** token. `--disable-write`.
3. **No** prod Postgres MCP until a replica + PII policy exists ([[../ENGINEERING|CTO review]]).
4. Agents get **observe** on prod, **write** on git and on staging only.

## Safety

- If a tool can `INSERT`/`UPDATE`/`DELETE`, it is misconfigured. Stop.
- Do not put PATs or Grafana passwords in tickets, plans, or PR bodies.
- Cloud Automations: only dashboard-catalog MCP servers work. Laptop `.cursor/mcp.json` does not follow Cloud Agents. That is why prod Grafana must be added on cursor.com, not only here.
