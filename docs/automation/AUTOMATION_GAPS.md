# Automation Gaps

Gaps that block the vision: **MCP-driven logs, metrics, alerts, SQL reads, plus create → act → deploy** with automated E2E and a safety gate.

Organized by capability. Severity: **Blocker** (vision impossible), **Major** (unsafe/incomplete), **Minor** (polish).

---

## Vision vs today (summary)

```text
Desired:  Alert/anomaly → agent reads logs/metrics/SQL → opens PR → CI green →
          auto or one-click deploy → post-deploy smoke → observe again

Today:    Human notices issue → local start.sh/compose → optional MCP on laptop →
          agent can code+PR → NO CI → human merges → manual compose on VPS →
          browser smoke → local Grafana only (if running)
```

---

## 1. Deploy & release automation

| Gap | Severity | Detail |
|-----|----------|--------|
| No CI/CD workflows | **Mitigated** | Co-hosted **Jenkins** (`docker-compose.jenkins.yml`, job `my-island`) builds, tests, deploys, confirms. Not GitHub Actions; not auto on every PR yet. |
| No production target in-repo | **Blocker** | Hosting is a doc checklist (`DEPLOYMENT_OPTIONS.md`); no Terraform/Ansible/Fly/Railway config, no deploy environments. |
| No deploy MCP / credentials for agents | **Major** | Jenkins can deploy with host docker.sock + `jenkins/secrets/env.prod`. Agents still lack a deploy MCP; trigger Jenkins UI/CLI manually. |
| No artifact registry / image tagging | **Major** | Prod compose builds from source on the host; no immutable image tags, SBOM, or provenance. |
| No blue/green or rollback automation | **Major** | Rollback = manual rebuild of an older commit. |
| Prod compose lacks observability stack | **Major → mitigated** | Opt-in `--profile observability` on `docker-compose.prod.yml` (Grafana/Prometheus/Loki/Alertmanager). Still not default. |
| Secrets management | **Major** | `.env.prod.example` only; no Vault/Doppler/GitHub Environments wiring for agents. |
| Domain/SSL/CDN not automated | **Minor** | Checklist items; outside compose. |

**Implication:** An agent can **create and push a change**, but cannot **deploy** or verify production without a human on a server.

---

## 2. Logs (MCP)

| Gap | Severity | Detail |
|-----|----------|--------|
| No Loki/Grafana MCP on cloud agent | **Blocker** | Local `.mcp.json` now includes **mcp-grafana** (read-only). Cloud Agents still need HTTP/SSE MCP reachability. |
| Local `.mcp.json` not = cloud MCP | **Blocker** | Laptop MCP (docker, postgres, filesystem, **grafana**) does not automatically apply to Cloud Agents. |
| Filesystem MCP path is machine-specific | **Major** | Hardcoded `/home/tezball/projects/my-island` — breaks other machines/agents. |
| Prod has no log pipeline | **Major → mitigated** | Loki available via observability profile; API `LOGGING_LOKI_URL` defaults to in-compose Loki. |
| Incomplete log coverage | **Major** | API pushes to Loki via Loki4j; nginx/web, postgres, moderator, ollama are not first-class in the same pipeline. |
| Local file logs only on hybrid start | **Minor** | `logs/*.log` from `start.sh`; Docker-only mode needs `docker compose logs`. |

**Needed for vision:** Read-only Loki (or cloud log) MCP with scoped access; prod log shipping; stable labels (`service`, `env`, `version`).

---

## 3. Metrics (MCP)

| Gap | Severity | Detail |
|-----|----------|--------|
| No Prometheus MCP | **Major → mitigated** | `mcp-grafana` queries Prometheus datasource locally; dedicated Prom MCP optional. Cloud Agent still needs reachable MCP. |
| Prometheus scrape may be auth-blocked | **Mitigated** | `/actuator/prometheus` is `permitAll` (same as health) for scrape targets. |
| No provisioned dashboards/recording rules | **Major** | Grafana has datasources + alerting; still no SLO dashboards. |
| Metrics only on local compose | **Mitigated** | Prod `--profile observability` includes Prometheus. |
| Limited custom business metrics | **Minor** | Actuator/Micrometer defaults; few domain-level meters (bookings/payments) for alert quality. |

**Needed for vision:** Public or network-local scrape endpoint for Prometheus; Prometheus MCP (or Grafana MCP); baseline RED/USE + booking/payment metrics; same stack in staging/prod.

---

## 4. Alerts (MCP)

| Gap | Severity | Detail |
|-----|----------|--------|
| No Alertmanager / alert rules | **Mitigated (local)** | Alertmanager + Prometheus/Grafana rules provisioned; default receiver is silent (AM UI only). |
| No alert → agent webhook | **Blocker** | Still no path from “alert fired” to “spawn Cloud Agent with context”. |
| No on-call / notification channel | **Major** | No Slack/PagerDuty/email alert routing yet (AM receiver is empty). |
| Cursor subscriptions ≠ app alerts | **Minor** | `subscribe_github_ci` / `subscribe_timer` help **agent workflow**, not **app** uptime. |

**Needed for vision:** Alert rules (API down, 5xx, Flyway fail, disk, payment webhook errors) → notification + optional automation that starts an agent with runbook + MCP access.

---

## 5. SQL reads (MCP)

| Gap | Severity | Detail |
|-----|----------|--------|
| Postgres MCP is local-dev only | **Blocker** | `.mcp.json` points at `localhost` with **dev password** in cleartext. |
| No prod/staging read-only role | **Blocker** | No documented `READONLY` DB user, network allowlist, or MCP for non-local envs. |
| Write risk if MCP is full DSN | **Major** | Stock postgres MCP can run writes unless constrained (read-only user + statement timeout). |
| Seed vs prod data confusion | **Minor** | Agents debugging with seed accounts may not match prod (seed only on `dev` profile). |

**Needed for vision:** Read-only Postgres MCP (staging first) with secrets from the environment, never committed passwords; query allowlists for agents.

---

## 6. Create / act / change

| Gap | Severity | Detail |
|-----|----------|--------|
| Partially available | — | Cloud agents **can** branch, edit, commit, push, open PRs — this part of the vision is closest to done. |
| Doc sync is policy, not enforced | **Minor** | CLAUDE.md requires docs updates; CI does not check. |
| No staging environment for agent act | **Major** | Agent cannot exercise a change against a shared staging URL with real-ish data. |
| Stripe/email side effects | **Major** | Prod Stripe/SMTP misconfig risk; no agent-safe “sandbox env” contract beyond local `STRIPE_DEV_MODE`. |
| Feature toggles help, but admin-gated | **Minor** | Toggles exist (`BOOKING_ENABLED`, etc.) but flipping them safely in prod still needs human/admin API access. |

---

## 7. Test E2E & confirm safe

| Gap | Severity | Detail |
|-----|----------|--------|
| E2E not in CI | **Mitigated (optional)** | Jenkins `RUN_E2E` stage runs Playwright; off by default (slow). |
| E2E assumes pre-started stack | **Major** | No compose-up-in-CI job; flaky if ports/seed differ. |
| `start.sh` skips tests | **Major** | `-DskipTests` on every fresh start. |
| Dual E2E stacks (Playwright + Cucumber) | **Major** | Overlap/cost; neither is the merge gate. |
| No post-deploy smoke suite | **Mitigated** | `scripts/confirm-prod.sh` in Jenkins Confirm Prod stage. |
| Coverage gaps | **Major** | Discovery 0% in audit; other modules incomplete — “green E2E” ≠ product-safe. |
| Load tests not gated | **Minor** | Gatling exists but is optional. |
| Security findings not re-validated | **Major** | Audits under `docs/audits/` are point-in-time; no continuous scanning in pipeline. |

**Needed for vision:** CI job matrix (unit → build → Playwright against ephemeral compose) as required checks; staging deploy + smoke; optional Gatling smoke on main; agent can subscribe to CI via `subscribe_github_ci` **once workflows exist**.

---

## 8. Cross-cutting / platform

| Gap | Severity | Detail |
|-----|----------|--------|
| Environment parity | **Major** | Dev has Mailpit, seed, Grafana; prod compose is leaner — agent runbooks diverge. |
| Image storage | **Major** | Local filesystem uploads in API; production S3/CDN still a roadmap item — deploy automation must include object storage. |
| Transactional email in prod | **Major** | SMTP placeholders; failures can be silent without log/alert MCP. |
| Moderator/Ollama ops | **Minor** | AI profile optional; no health/alerts for moderation backlog. |
| Native image path unused in prod compose | **Minor** | `Dockerfile.native` / profile exists; prod uses JRE Dockerfile. |

---

## Priority order to unblock the vision

Recommended build order (technical dependency, not calendar estimate):

1. **CI required checks** — Maven test, frontend build/lint, Playwright against compose in GitHub Actions.
2. **Staging environment** — always-on compose or PaaS; health URL; read-only DB; same observability as local.
3. **Fix metrics scrape + ship prod/staging observability** — permit Prometheus scrape securely; Alertmanager; basic dashboards.
4. **MCP pack for agents** — Loki query, Prometheus query, read-only SQL, docker/logs for staging; remove laptop-hardcoded paths.
5. **Deploy pipeline** — build/push images on merge; deploy staging automatically; prod with approval; expose deploy status to agents (or a thin deploy MCP).
6. **Alert → agent loop** — webhook/automation that opens a Cloud Agent with alert payload + MCP access.
7. **Post-deploy smoke + rollback** — automated confirm-safe; one-command rollback.

Until steps 1–5 exist, “fully automate running this app” with MCP remains a **local-dev assistant** story, not a **production autopilot**.

---

## What already helps (do not rebuild)

- Actuator health + Micrometer Prometheus registry
- Loki4j appender on the API
- Local Grafana + Prometheus + Loki in `docker-compose.yml`
- `.mcp.json` sketch (postgres, docker) as a starting point for a **staging** MCP profile
- Playwright suite + Gatling smoke profile
- Feature toggles for killing booking/subscription/moderation behavior without redeploy
- Cloud Agent ability to create PRs + `subscribe_github_ci` once CI exists
- `docker-compose.prod.yml` + `.env.prod.example` as the first deploy primitive to automate
