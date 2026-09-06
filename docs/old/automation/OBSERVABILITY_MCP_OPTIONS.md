# Logs, Metrics, Alerts — Stack Options (Free / Near-Free + MCP)

Per-section stack choices for co-hosting beside My Island or using a free SaaS tier. **Recommended** rows are the default for this project.

You already run (local only): Grafana + Prometheus + Loki. Missing: Alertmanager, MCP wiring, prod compose, Actuator scrape auth fix.

---

## Metrics

| | Stack | MCP access | Cost | Co-host? | Notes |
|---|-------|------------|------|----------|-------|
| **Recommended** | **Prometheus** (already in compose) + Grafana datasource | **`mcp-grafana`** PromQL tools (or optional `pab1it0/prometheus-mcp-server`) | $0 + VPS | Yes | Already scraping Actuator; fix scrape auth; short retention on small VPS |
| | VictoriaMetrics (single-node) + Grafana | `mcp-grafana` via Prometheus-compatible DS | $0 | Yes | Only if Prometheus disk/series grow; PromQL-compatible |
| | Grafana Cloud Free (Managed Prometheus / Mimir) | `mcp-grafana` → Cloud URL | Free ~**10k** active series, **14d** retention | No | Use when VPS RAM/disk is tight |
| | InfluxDB OSS | Weak / custom MCP | $0 | Yes | Skip — worse PromQL/MCP fit than Prometheus |
| | Datadog / New Relic metrics | Vendor MCP (paid) | Paid | No | Out of scope for free/near-free |

**Why recommended:** Prometheus is already in `docker-compose.yml` and Micrometer exports `/api/actuator/prometheus`. One Grafana MCP covers metrics without a second product.

---

## Logs

| | Stack | MCP access | Cost | Co-host? | Notes |
|---|-------|------------|------|----------|-------|
| **Recommended** | **Loki** (already in compose) + Grafana datasource | **`mcp-grafana`** LogQL tools (or `grafana/loki-mcp` / `incu6us/loki-mcp-server`) | $0 + VPS | Yes | API already pushes via Loki4j; add Promtail/Alloy later for nginx/postgres/moderator |
| | Grafana Cloud Free (Managed Loki) | `mcp-grafana` → Cloud URL | Free ~**50 GB**/mo ingest, **14d** retention | No | Offload retention when disk is scarce |
| | ELK / OpenSearch self-host | Sparse MCP vs Grafana | $0 but heavy RAM | Painful on 2 GB VPS | Skip for MVP ops |
| | Graylog / VictoriaLogs | Limited MCP ecosystem | $0 | Maybe | Weaker agent tooling than Loki + Grafana |
| | “Just `docker compose logs` / files” + filesystem MCP | Filesystem / Docker MCP | $0 | Yes | Fine for laptop; not a durable prod log store |

**Why recommended:** Loki is already running and the API is instrumented (`logback` → Loki). Grafana MCP queries it through the existing datasource; no new log backend.

---

## Alerts

| | Stack | MCP access | Cost | Co-host? | Notes |
|---|-------|------------|------|----------|-------|
| **Recommended** | **Grafana Alerting** + **Alertmanager** container (add to compose) | **`mcp-grafana`** alert rules / routing / silences (`--disable-write` for agents) | $0 + VPS | Yes | Rules in Grafana UI/provisioning; AM for notification routing (email/webhook) |
| | Classic Prometheus rules → Alertmanager only | `ntk148v/alertmanager-mcp-server` or talkops Alertmanager MCP | $0 | Yes | Good if you prefer YAML-in-Prometheus; needs separate MCP |
| | Grafana Cloud Alerting / OnCall (Free limits) | `mcp-grafana` or Cloud MCP | Free tier limits | No | Less local ops; OnCall features may be capped |
| | Healthchecks.io / UptimeRobot free + webhook | No rich MCP (webhook → agent only) | Free | External | Cheap uptime ping; not app metrics/log correlation |
| | PagerDuty / Opsgenie | Vendor APIs | Paid | No | Skip until you need paid on-call |

**Why recommended:** You already use Grafana. Grafana Alerting + one Alertmanager service unlocks agent-visible firing rules via the **same** `mcp-grafana` used for logs/metrics. No third MCP required for v1.

---

## MCP layer (how the agent talks to the stacks)

| | Option | Covers | Cost | Notes |
|---|--------|--------|------|-------|
| **Recommended** | **[mcp-grafana](https://github.com/grafana/mcp-grafana)** (OSS, `uvx` or Docker) | Metrics + logs + alerts (+ dashboards) | $0 | Point at local Grafana or Cloud; use Viewer token + `--disable-write` |
| | Split: Prometheus MCP + Loki MCP + Alertmanager MCP | One signal each | $0 | More config; use if Grafana is down or you want direct APIs |
| | Grafana Cloud hosted MCP | Same as Grafana Cloud datasources | Free tier; counts as Assistant “active AI user” | Prefer OSS `mcp-grafana` if you want to avoid Cloud Assistant metering |
| | Unified gateways (`observability-mcp`, `otel-mcp-server`) | Many backends | $0 OSS | Defer until single Grafana MCP is proven |

**Why recommended:** One MCP, three signals, official Grafana project, works with the stack you already partially run.

---

## Combined default for this repo

| Section | Pick | Status |
|---------|------|--------|
| Metrics | Prometheus (existing) | Wired in compose; `/actuator/prometheus` public for scrape |
| Logs | Loki (existing) | API `LOGGING_LOKI_URL` for Docker; Loki4j |
| Alerts | Grafana Alerting + Alertmanager | **Added** (rules + contact point) |
| Agent access | `mcp-grafana` read-only | **Added** in `.mcp.json` |
| Escape hatch if VPS is full | Grafana Cloud Free for storage; same MCP pointed at Cloud | Documented option |

See [OBSERVABILITY_SETUP.md](OBSERVABILITY_SETUP.md) for URLs and prod `--profile observability`.

Before Cloud Agents can use this: expose MCP via HTTP/SSE (or tunnel), not only laptop `.mcp.json` stdio.
