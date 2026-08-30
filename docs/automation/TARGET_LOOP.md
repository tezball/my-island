# Target Automation Loop

Desired closed loop for a Java engineer using AI + MCP to run My Island with minimal manual ops. This is the **north star**, not the current system. See [CURRENT_FLOW.md](CURRENT_FLOW.md) and [AUTOMATION_GAPS.md](AUTOMATION_GAPS.md).

---

## Loop

```mermaid
flowchart TB
  subgraph observe [Observe via MCP]
    L[Logs - Loki/LogQL]
    M[Metrics - PromQL]
    A[Alerts - Alertmanager]
    S[SQL - read-only Postgres]
  end

  subgraph decide [Decide]
    R[Runbook + blast radius]
    T{Safe to auto-fix?}
  end

  subgraph act [Act]
    C[Cloud Agent: branch + code]
    P[PR + required CI]
    V[E2E + unit + smoke]
  end

  subgraph release [Release]
    ST[Deploy staging]
    SM[Post-deploy smoke]
    PRD[Deploy prod - gated]
    RB[Rollback if smoke fails]
  end

  A --> R
  L --> R
  M --> R
  S --> R
  R --> T
  T -->|yes| C
  T -->|no / high risk| H[Human approval]
  H --> C
  C --> P --> V
  V -->|green| ST --> SM
  SM -->|green| PRD
  SM -->|red| RB
  PRD --> observe
  RB --> observe
```

---

## MCP capability map (target)

| Need | MCP / integration | Access |
|------|-------------------|--------|
| Logs | Loki or cloud logging MCP | Staging + prod read |
| Metrics | Prometheus or Grafana MCP | Staging + prod read |
| Alerts | Alertmanager webhook → Cursor automation / agent spawn | Write: create incident thread; Read: alert history |
| SQL | Postgres MCP | **Read-only** role, statement timeout, staging first |
| Containers | Docker or orchestrator MCP | Staging; prod tightly scoped |
| Change | Cursor Cloud Agent + git | Feature branches + PRs |
| CI status | `subscribe_github_ci` | After workflows exist |
| Deploy | Deploy MCP or GitHub Environment deploy | Staging auto; prod approval |

---

## Safety contract (target)

An automated change is “confirmed safe” only when **all** are true:

1. Required CI checks green on the PR head (unit, build, Playwright against ephemeral stack).
2. Staging deploy succeeded and post-deploy smoke passed (health + critical journeys: login, browse, booking path gated by feature toggle policy).
3. Metrics within burn-rate budgets for a soak window (error rate, latency, payment webhook failures).
4. No open Sev-1 alerts on the releasing service.
5. For prod: human or policy approval when the change touches payments, auth, migrations with backfill, or feature toggles that expose booking.

Migrations: expand/contract preferred; agent must not run irreversible data deletes via SQL MCP.

---

## Minimum viable automation (first slice)

Smallest slice that proves the loop without full prod autopilot:

1. GitHub Actions: test + Playwright on PR.
2. Staging compose host with Grafana/Prometheus/Loki + read-only DB MCP.
3. On merge to `main`: auto-deploy staging; smoke script; notify on failure.
4. Agent can: query staging logs/metrics/SQL, open fix PR, wait on CI subscription.

Prod deploy and alert-driven agent spawn can follow once staging loop is trustworthy.
