---
name: mcp-observe
description: >-
  Query local Grafana/Prometheus/Postgres-RO, or HTTP PromQL when MCP is
  missing. Use when observing catalog health, MCP is red, or Cloud Agents
  have no grafana toolbox.
---

# MCP observe

Laptop Cursor: `.cursor/mcp.json` after `./scripts/app start` + reload MCP.

| Server | Rule |
|---|---|
| `grafana` | `--disable-write` → http://127.0.0.1:3030 |
| `postgres` / `postgres-catalog` | `ops_reader` SELECT only |
| `intellij` | Laptop; IDEA open. Not Cloud Agents |

Cloud Agents do **not** load repo `mcp.json`. If grafana tools are missing:

```bash
curl -sS -G 'http://127.0.0.1:9091/api/v1/query' --data-urlencode 'query=up{job="catalog"}'
```

Catalog HTTP: `http://127.0.0.1:8081/actuator/health`. Full pack: `docs/ops/workflow/MCP.md`.

## Must not

- INSERT/UPDATE/DELETE via Postgres MCP.
- Grafana writes (silences, datasource edits).
- Treat local compose as staging/prod observe.
