# Observability stack (local + optional prod)

## Stack (agreed)

| Signal | Backend | Agent MCP |
|--------|---------|-----------|
| Metrics | Prometheus | `mcp-grafana` (`.mcp.json` → `grafana`) |
| Logs | Loki (API Loki4j) | same |
| Alerts | Grafana Alerting + Alertmanager | same (read-only) |

## Local URLs

| Service | URL |
|---------|-----|
| Grafana | http://localhost:3000 (`admin` / `admin`) |
| Prometheus | http://localhost:9090 |
| Alertmanager | http://localhost:9093 |
| Loki | http://localhost:3100 |

Started by `docker compose up -d` or `./start.sh` (infra includes grafana, prometheus, loki, alertmanager).

## MCP

`.mcp.json` runs official Grafana MCP read-only:

```json
"grafana": {
  "command": "uvx",
  "args": ["mcp-grafana", "--disable-write"],
  "env": {
    "GRAFANA_URL": "http://localhost:3000",
    "GRAFANA_USERNAME": "admin",
    "GRAFANA_PASSWORD": "admin"
  }
}
```

Requires [uv](https://docs.astral.sh/uv/) on the machine running Cursor. Prefer a Grafana service-account token (`GRAFANA_SERVICE_ACCOUNT_TOKEN`) instead of admin password when you harden the stack.

## Prod (opt-in)

```bash
docker compose -f docker-compose.prod.yml --profile observability --env-file .env.prod up -d
```

Set `GF_SECURITY_ADMIN_PASSWORD` in `.env.prod`. Do not expose Grafana/Prometheus/Alertmanager publicly without auth/VPN.

## Alert rules

- **Prometheus** (`prometheus/alerts.yml`): `ApiDown`, `ApiHighHttpServerErrors` → Alertmanager
- **Grafana-provisioned** (`grafana/provisioning/alerting/`): contact point → Alertmanager; Grafana-managed `API down` rule

Default Alertmanager receiver keeps alerts in the AM UI/API (no Slack/email yet).

## Related docs

- [OBSERVABILITY_MCP_OPTIONS.md](OBSERVABILITY_MCP_OPTIONS.md) — why this stack
- [AUTOMATION_GAPS.md](AUTOMATION_GAPS.md) — remaining gaps (Cloud Agent MCP reachability, etc.)
