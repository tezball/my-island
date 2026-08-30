# Automation Vision

Target state: a Java engineer using AI daily can **fully automate** running My Island — observe (logs, metrics, alerts, SQL), act (create change, test, merge), and deploy — primarily through MCP tools and agent workflows.

This folder documents **how things work today** and the **gaps that block that vision**. It is intentionally honest: local observability pieces exist; production deploy and closed-loop agent ops do not.

## Documents

| Doc | Purpose |
|-----|---------|
| [CURRENT_FLOW.md](CURRENT_FLOW.md) | Commit → test → “safe” → deploy as it works **today** |
| [AUTOMATION_GAPS.md](AUTOMATION_GAPS.md) | Gap inventory vs the full MCP automation vision |
| [TARGET_LOOP.md](TARGET_LOOP.md) | Desired closed loop (observe → decide → change → verify → deploy) |
| [OBSERVABILITY_MCP_OPTIONS.md](OBSERVABILITY_MCP_OPTIONS.md) | Free/near-free logs·metrics·alerts stacks with MCP (self-host or Cloud) |
| [OBSERVABILITY_SETUP.md](OBSERVABILITY_SETUP.md) | Implemented stack: compose, Alertmanager, mcp-grafana wiring |
| [JENKINS.md](JENKINS.md) | Co-hosted Jenkins: build → test → deploy → confirm prod |

## Related existing docs

- [Deployment Options](../DEPLOYMENT_OPTIONS.md) — hosting stack choices (aspirational; checklist mostly unchecked)
- [Infrastructure](../architecture/INFRASTRUCTURE.md) — local Docker services
- [E2E Coverage Audit](../audits/2026-02-14-e2e-coverage-report.md) — Playwright coverage snapshot
- [Load Testing](../../gatling/README.md) — Gatling profiles
- [Roadmap](../ROADMAP.md) — lists “Production environment deployment” as a pre-launch item

## Quick verdict

| Capability | Local today | Agent/MCP today | Production today |
|------------|-------------|-----------------|------------------|
| App run | `./start.sh` or `docker compose` | Manual / shell in cloud VM | Manual `docker-compose.prod.yml` (no live host wired in-repo) |
| Logs | Files under `logs/` + Loki push from API | No Loki/Grafana MCP in cloud agent | Prod compose has **no** Loki/Grafana |
| Metrics | Prometheus scrapes Actuator | No Prometheus MCP | Not in prod compose |
| Alerts | None (no Alertmanager) | No alert MCP | None |
| SQL reads | Postgres MCP in `.mcp.json` (local) | Not available on cloud agent by default | No read-only prod DB MCP |
| Create change | Human / Cursor agent | Cloud agent: branch, commit, push, PR | N/A |
| Deploy change | Rebuild local containers / restart JAR | No deploy MCP; `gh` is read-only for agents | No CI/CD pipeline in repo |
| E2E / safe gate | Playwright + Maven + Gatling (manual) | No required CI on PR | No automated prod smoke |
