# Logs, Metrics, Alerts — MCP Options (Free / Near-Free)

Options for giving agents MCP access to observability, biased toward **self-host next to My Island** (compose on the same VPS) or **Grafana Cloud Free**. Prices and free-tier limits change; verify before committing.

**Your stack already has (local only):** Grafana + Prometheus + Loki in `docker-compose.yml`, API → Loki via Loki4j, Actuator Prometheus scrape. **Missing:** Alertmanager, MCP servers, prod compose inclusion, scrape auth fix.

---

## Recommendation (for co-hosting)

| Priority | Choice | Why |
|----------|--------|-----|
| **Best fit** | Keep **Grafana OSS + Prometheus + Loki + Alertmanager** beside the app; add **official `mcp-grafana`** (read-only flags) | One MCP covers metrics + logs + alert rules; you already run 3/4 of the stack |
| **Add** | Prometheus Alertmanager container + Grafana-managed or Prometheus rule files | Unlocks alert MCP path (via Grafana or dedicated Alertmanager MCP) |
| **Optional split** | Also run `pab1it0/prometheus-mcp-server` + Loki MCP if you want direct PromQL/LogQL without Grafana in the middle | Useful when Grafana is down or for lighter agents |
| **SaaS alternative** | Grafana Cloud Free + OSS `mcp-grafana` (or Cloud MCP) | Zero local disk for retention; free tier caps apply |

Do **not** start with Datadog/New Relic/Elastic Cloud for this goal — paid, and MCP is secondary to cost.

---

## Backend stacks (what you host or subscribe to)

| Stack | Cost model | Logs | Metrics | Alerts | Fits “host beside app”? |
|-------|------------|------|---------|--------|-------------------------|
| **LGTM OSS** (Loki + Grafana + Tempo optional + Prometheus/Mimir) | $0 software; VPS RAM/disk | Loki | Prometheus | Grafana Alerting and/or Alertmanager | **Yes — already partial** |
| **Prometheus + Alertmanager + Grafana** (no Loki) | $0 | Weak (need something else) | Prometheus | Alertmanager | Yes, but you already have Loki |
| **VictoriaMetrics + vmalert + Grafana** | $0 OSS | Needs Loki/other | VictoriaMetrics (PromQL-ish) | vmalert | Yes; replace Prometheus if you outgrow single-node |
| **Grafana Cloud Free** | Free tier (e.g. ~10k metrics series, ~50 GB logs/mo, ~14d retention — confirm current pricing page) | Managed Loki | Managed Prometheus/Mimir | Grafana Alerting / OnCall (limits) | No local store; agent talks to cloud URL |
| **SigNoz / Jaeger+** | OSS self-host | Possible | Possible | Built-in | Heavier; weaker MCP ecosystem than Grafana |

For My Island on a small Hetzner-class box: **extend current compose** rather than introducing a second product family.

---

## MCP servers (agent access layer)

### A. One-stop: Grafana MCP (recommended)

| | |
|--|--|
| **Project** | [grafana/mcp-grafana](https://github.com/grafana/mcp-grafana) (`uvx mcp-grafana` or Docker) |
| **Cost** | Free / Apache-2.0; self-host the MCP process |
| **Talks to** | Your Grafana OSS **or** Grafana Cloud |
| **Gives agents** | PromQL via Prometheus datasources, LogQL via Loki, dashboards, **alert rules / routing / silences**, incidents/OnCall if enabled |
| **Safety** | Prefer `--disable-write` + Viewer service account token for agents |
| **Auth** | `GRAFANA_URL` + `GRAFANA_SERVICE_ACCOUNT_TOKEN` |

**Also:** Grafana Cloud hosts an MCP endpoint (OAuth). Querying data through it does not burn Grafana Assistant tokens; connecting still counts as an “active AI user” on Cloud’s Assistant metering — fine for a solo Free stack if you stay within Free AI caps, or use the **self-hosted OSS MCP** pointed at Cloud/OSS Grafana to keep Assistant out of the path.

### B. Metrics-only: Prometheus MCP

| | |
|--|--|
| **Project** | [pab1it0/prometheus-mcp-server](https://github.com/pab1it0/prometheus-mcp-server) (Docker Hub / GHCR) |
| **Cost** | Free / MIT |
| **Tools** | Instant/range PromQL, list metrics, metadata, scrape targets |
| **Host** | Point `PROMETHEUS_URL` at `http://prometheus:9090` on the Docker network (or host port) |

### C. Logs-only: Loki MCP

| | |
|--|--|
| **Projects** | [grafana/loki-mcp](https://github.com/grafana/loki-mcp); [incu6us/loki-mcp-server](https://github.com/incu6us/loki-mcp-server) (discovery-first: labels → values → query) |
| **Cost** | Free / OSS |
| **Tools** | LogQL query / range; discovery variants list labels/series |
| **Host** | `LOKI_URL=http://loki:3100` |

### D. Alerts-only: Alertmanager MCP

| | |
|--|--|
| **Projects** | [ntk148v/alertmanager-mcp-server](https://github.com/ntk148v/alertmanager-mcp-server); [talkops-alertmanager-mcp-server](https://pypi.org/project/talkops-alertmanager-mcp-server/) |
| **Cost** | Free / Apache-2.0 |
| **Requires** | Running Alertmanager (not in repo today) |
| **Tools** | List alerts/groups, silences CRUD, receivers/status (write tools — lock down for agents) |

Grafana MCP can cover **Grafana-managed** alert rules without a separate Alertmanager MCP; use Alertmanager MCP if you run classic Prometheus → Alertmanager and want agents on that API directly.

### E. Unified / kitchen-sink (optional)

| Project | Notes |
|---------|--------|
| [ThoTischner/observability-mcp](https://github.com/ThoTischner/observability-mcp) | Gateway over Prometheus/Loki (+ more); anomaly helpers; more moving parts |
| [MoebiusX/otel-mcp-server](https://github.com/MoebiusX/otel-mcp-server) | Many backends (Prom, Loki, Alertmanager, Grafana, …); heavier ops surface |
| [opendatahub-io/rhoai-observability-mcp](https://github.com/opendatahub-io/rhoai-observability-mcp) | Strong Prom/Loki/Alertmanager/Grafana set; oriented to OpenShift/vLLM — reuse ideas, not a first pick for this VPS |

---

## Capability matrix (MCP → signal)

| Option | Metrics | Logs | Alerts | Host beside app | Rough cost |
|--------|---------|------|--------|-----------------|------------|
| Grafana OSS + **mcp-grafana** | Yes (via DS) | Yes (via DS) | Yes (Grafana Alerting) | Yes | $0 + VPS |
| Prometheus + **prometheus-mcp** | Yes | No | No | Yes | $0 |
| Loki + **loki-mcp** | No* | Yes | No | Yes | $0 |
| Alertmanager + **alertmanager-mcp** | No | No | Yes | Yes | $0 |
| Grafana Cloud Free + mcp-grafana | Yes | Yes | Yes | No (SaaS) | $0 within free caps |
| Grafana Cloud MCP (hosted) | Yes | Yes | Yes | No | Free tier; Assistant “active user” metering |
| Split trio (Prom + Loki + AM MCPs) | Yes | Yes | Yes | Yes | $0; more MCP entries to maintain |

\*Loki can do metric queries from logs (LogQL); not a replacement for Actuator/Prometheus app metrics.

---

## Co-host layout (compose sketch)

```text
[web] [api] [postgres] [moderator?]
        │         │
        │         └── Actuator /prometheus ──► Prometheus
        └── Loki4j ──────────────────────────► Loki
                                               │
                         Alertmanager ◄── rules (Grafana or Prometheus)
                                               │
                                         Grafana ◄── datasources
                                               │
                                    mcp-grafana (stdio on laptop / SSE on VPS)
                                               │
                                         Cursor / Cloud Agent
```

**RAM note (single small VPS):** Grafana + Prometheus + Loki + Alertmanager often want ~1–2 GB combined at light load. On a 2 GB box shared with Spring Boot + Postgres, prefer **short retention** (e.g. 3–7d), disable unused Grafana plugins, or put observability on a second cheap micro-VPS / use Grafana Cloud Free for storage.

---

## What to fix in-app before MCP is useful

1. **Permit Prometheus scrape securely** (network-local scrape token or `permitAll` only on private Docker network) — today only `/actuator/health` is public.
2. **Add Alertmanager** (and a few rules: API down, high 5xx, disk, scrape fail).
3. **Ship prod compose observability** (or remote-write/push to Grafana Cloud Free).
4. **Run MCP read-only** (`--disable-write`, Viewer token); never give agents Admin Grafana or Alertmanager silence-delete without a human gate.
5. **Cloud Agents** need the MCP reachable from *their* environment (SSE/HTTP MCP on a private URL, or Cursor desktop against your VPS) — laptop `.mcp.json` alone does not wire cloud agents.

---

## Suggested path for this project

1. **Short term:** Extend compose with Alertmanager + provisioned alert rules; add `mcp-grafana` to local `.mcp.json` with `--disable-write`.
2. **Same host prod:** Mirror Grafana/Prometheus/Loki/Alertmanager into `docker-compose.prod.yml` with disk retention limits; bind Grafana/MCP to VPN or SSH tunnel only.
3. **If the VPS is too tight:** Keep Prometheus+Loki local for short retention **or** remote-write metrics/logs to **Grafana Cloud Free** and point `mcp-grafana` at the Cloud URL.
4. **Defer** multi-MCP kitchen-sink servers until the Grafana single-MCP path is proven with a real incident triage session.
