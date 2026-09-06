---
title: Engineering — CTO review
type: product
status: active
owner: Engineering
created: 2026-09-01
updated: 2026-09-05
---

# Engineering — CTO review

Review of everything to date, written as incoming CTO. Product direction
stands. This document is the engineering counterpart: how we run a **Java /
Spring house** so that **AI agents have the same end-to-end loop as a human
engineer**, through MCP, from the first service skeleton.

House constraints already signed: [`STACK.md`](STACK.md) (CEO lock 2026-09-05). Product: [`VISION.md`](VISION.md),
[`MVP.md`](MVP.md). Legacy automation research (do not treat as current system):
[`docs/automation/`](../docs/automation/).

**Status:** House, client, database, migrations, observability, and CI/CD policy
are **signed** in [`STACK.md`](STACK.md). This document is the AI-engineer loop,
safety contract, and remaining **non-house** questions (exact host, OIDC
provider, curator-admin depth). Do **not** treat §3 as a competing unsigned
stack. Policy asks (auto-merge, prod deploy, Cursor budget) still sit with CEO.

---

## 1. Verdict on what exists

The reboot is the correct company move. A checkable directory is a testable
assumption; the previous “MVP” was a year of marketplace work. Java / Spring
as the house, and logs / metrics / alerts through MCP with OSS first, are the
right constraints.

Three problems with the state of play:

1. **The agent loop is specified for observability only.** `STACK.md` covers
   logs, metrics and alerts. A modern AI engineer also needs SQL, CI, git,
   preview, E2E, deploy, secrets and a browser — all MCP-reachable, all
   scoped. Without that, we have a dashboard an agent can read, not a system
   an agent can run.
2. **The working tree has no runtime.** There is nothing to observe. The
   first Spring skeleton must ship the loop, not retrofit it.
3. **Do not port the previous ops shape.** The legacy repo had Jenkins on the
   host Docker socket, Ollama auto-review, autofix, squash-merge to `main`,
   and auto-deploy of compose-prod. That is a blast-radius machine. It also
   has **no MCP**. Cloud agents could not drive it. Rebuilding it would lock
   us into a human-only CD path on day one of a greenfield.

`docs/automation/` is useful research (Grafana OSS + `mcp-grafana` is still
the observability pick). It is not a system we are running.

---

## 2. What “fully MCP-accessible E2E” means

An AI engineer (local Cursor agent or Cloud Agent) can complete this loop
without a human opening Grafana, SSH, or a laptop-only `.mcp.json`:

```
observe (logs, metrics, alerts, traces, SQL)
  → change (branch, code, PR)
  → verify (unit, integration, Playwright against a real stack)
  → preview (browser MCP on the running UI)
  → ship (CI visible over MCP; merge is policy, not a bot)
  → deploy staging (agent-reachable)
  → confirm (smoke + MCP observe)
  → prod (human or policy gate)
  → alert → new agent turn with context
```

**Rule.** If a signal or action is required in that loop and an agent cannot
reach it through MCP (or a first-class Cursor integration that is equivalent),
it is not done. A human UI is not the interface.

**Rule.** Agents get **read** on prod observability. They get **write** on
code and on staging. They do not get prod deploy, prod SQL writes, or secret
values.

---

## 3. Recommended choices

Legend: **Signed** = [`STACK.md`](STACK.md) (CEO 2026-09-05). **Call** = still a
CTO default that does not fight the house. **Open** = non-house fork.

### 3.1 Runtime and data

| Item | Call | Why |
|---|---|---|
| Backend | Java + Spring Boot **(signed)** | House. Not TypeScript/FastAPI. Micrometer, Actuator, Flyway, Security from commit one. |
| Database | PostgreSQL 17 + PostGIS **(signed)** | Map/geo is a first-class MVP surface. One engine for relational and distance queries. |
| Migrations | Flyway in the API **(signed)** | Agents never “fix prod” with ad-hoc SQL DDL. Expand/contract only. |
| Object storage | **MinIO locally; S3-compatible in staging/prod** (Cloudflare R2 free tier is enough at first) | Uploads on a local disk will not survive a second instance or a Cloud Agent. |
| Mail | **Mailpit** local; transactional provider later (Resend free tier is enough until volume) | Agents inspect captured mail via Mailpit HTTP, not by hoping SMTP worked. |
| Client | Light TypeScript PWA — Vite + React **(signed)** | Meets `MVP.md` §3. **Not** Next.js App Router / Next BFF. Spring owns the API. Same SPA for Explore and thin curator/admin via role routes. |

### 3.2 Observability (already signed, made concrete)

| Signal | Backend | MCP |
|---|---|---|
| Metrics | Prometheus ← Micrometer | `mcp-grafana` |
| Logs | Loki ← JSON logs with `service`, `env`, `version`, `traceId` | `mcp-grafana` |
| Alerts | Grafana Alerting + Alertmanager | `mcp-grafana` (agents `--disable-write`) |
| Traces | **OpenTelemetry in Spring from commit one**; Grafana Tempo when volume justifies a fourth container | Same Grafana MCP once Tempo is a datasource. Do not wait for a second APM product. |

Errors: NFR-09 is met by structured logs + alerts + traces, not Sentry, unless
that proves insufficient. GlitchTip/Sentry is a paid-or-extra sink and a
second MCP. Defer.

### 3.3 Environments

| Env | Purpose | Agent |
|---|---|---|
| **Local** | Devcontainer + compose (API, web, Postgres, Grafana stack, Mailpit, MinIO) | Full MCP pack on localhost |
| **Staging** | Always-on, anonymised seed, Stripe test, fake SMTP | Same MCP pack over HTTP/SSE. This is the agent’s shared world. |
| **Prod** | Real users | Observe only (Grafana MCP). No SQL MCP until a dedicated read replica + policy exists. No deploy MCP. |

Three names from week one, even if staging is a small EU VPS. One laptop is
not an environment.

### 3.4 CI, git, deploy

| Item | Call | Why |
|---|---|---|
| Git host | GitHub | Cloud Agents, `gh`, official GitHub MCP, Environments. |
| CI | **GitHub Actions** | First-class `subscribe_github_ci` / GitHub MCP. No Docker-socket controller. Ephemeral Playwright runner with compose. |
| E2E | **Playwright only**, required on PR, against compose the job starts | Dual Playwright + Cucumber was a tax. Playwright is also what browser-based agents already speak. |
| CD | Staging auto on `main`. Prod = GitHub Environment with required reviewer. | Agents open PRs. They do not squash-merge and they do not push prod. |
| Legacy Jenkins | **Do not rebuild** | No MCP, host docker.sock, auto-merge + auto-prod. Keep the *ideas* (required checks, post-deploy smoke). Drop the machine. |
| Images | Build once in CI, tag by git SHA, deploy that digest | Compose-build-on-the-VPS made rollback “hope this commit still builds”. |
| Smoke | `confirm` script + MCP observe after every staging deploy | Health + Explore load + signup/check-off when those exist. |

### 3.5 MCP pack (the actual agent toolbox)

Checked into the repo as a **single pack**, same servers locally and in cloud.
No machine-specific filesystem paths. Secrets from the environment, never
committed.

| Server | Use | Scope |
|---|---|---|
| **mcp-grafana** | Logs, metrics, alerts, later traces | Read-only token. Local + staging + prod (prod datasource isolated). |
| **GitHub MCP** | PRs, checks, Actions, issues | Fine-grained PAT or GitHub App. No admin, no secret-scanning bypass. |
| **Postgres MCP** | Read-only SQL | Staging first. Role: `SELECT` only, statement timeout, row limit. No prod until replica + policy. |
| **Docker MCP** | Compose status, logs of sidecar containers not in Loki yet | Local + staging. Not prod. |
| **cursor-ide-browser** (or Playwright MCP) | Drive the running UI like a user | Local and staging URLs only. |
| **Mailpit** (HTTP or thin MCP) | Assert emails in local/staging | No prod mail read. |

Not in the pack: filesystem MCP (the workspace is the files), memory MCP,
Context7 as a product dependency, Stripe MCP (no payments in MVP), Jenkins.

**Cloud vs laptop is the real gap.** Local stdio `.mcp.json` does not follow a
Cloud Agent. Staging Grafana, Postgres-RO and GitHub must be **remote MCP
(HTTP/SSE or the Cursor cloud MCP catalog)** with tokens issued per
environment. Until that is true, “MCP accessible” is a developer-machine
story only.

### 3.6 Engineer experience (human and agent)

| Item | Call |
|---|---|
| Runtime | **Dev Container**: Java, Node, Docker, Playwright browsers, `uv` for `mcp-grafana`. Cloud Agents and humans run the same file. |
| Repo contract | `AGENTS.md` + `.cursor/rules` generated from product docs: stack, NFR, “do not import legacy domain”, MCP safety. |
| Preview | PR → staging-like URL or ephemeral compose; agent verifies in the browser MCP. |
| Feature flags | DB-backed flags in Spring from the start (the previous build had this). Agents may toggle **staging** via API; prod flags are human. |
| Identity for agents | Bot GitHub user for agent commits. Never a founder’s PAT in a Cloud Agent. |

---

## 4. Safety contract

An agent change is shippable to **staging** when all of these are true:

1. PR opened by the bot user, not direct push to `main`.
2. Required checks green: unit, API integration, frontend build, Playwright
   against the job-started stack.
3. No new Sev-1 alerts on staging after deploy soak (short window is fine).
4. Migrations are expand-only; SQL MCP was not used to mutate.

An agent change is shippable to **prod** when staging is true **and** a human
(or a later written policy) approves the GitHub Environment. Default policy:
payments, auth, GDPR erasure, and feature flags that change public behaviour
always need a human. For MVP, **everything to prod needs a human**.

Alerts may **spawn** an agent with the firing payload and Grafana/SQL MCP.
They may not auto-merge or auto-deploy prod.

---

## 5. Gaps (design, not a running system)

The previous gap list assumed a live Jenkins/compose world. Translated to a
greenfield:

| Gap | Why it matters | Unblock |
|---|---|---|
| No remote MCP | Cloud Agents cannot see Grafana/SQL | HTTP/SSE (or catalog) Grafana + Postgres-RO on staging |
| No staging | Nowhere for an agent to be wrong safely | Always-on EU staging from first deployable API |
| No required E2E in CI | Agents will ship UI that “looks right” in a screenshot | Playwright required on PR, job starts compose |
| Observability laptop-only | Violates `STACK.md` the moment we have a second machine | Grafana stack in the same compose as the API in every env |
| Secrets in files / chat | Agents leak; laptops diverge | GitHub Environments + OIDC to the VPS or PaaS. Staging secrets readable by a tightly scoped App. |
| No image registry | Cannot roll back an agent’s bad deploy | GHCR (free for public; cheap for private) |
| Alert → agent unwired | On-call is still a human staring at Grafana | Alertmanager webhook → Cursor automation / Cloud Agent |
| Browser loop informal | Agents cannot complete “tap ✓ on a phone viewport” | Browser MCP + Playwright as the two layers (explore vs gate) |
| Docs/automation describe dead machinery | Incoming engineers will rebuild Jenkins | This document supersedes it for the rebuild; leave `docs/` labelled history |

---

## 6. Questions to ask

Budget, policy and product. Engineering cannot close these alone.

### Company / budget

1. **Is Cursor the mandated agent runtime** (local + Cloud Agents), or must
   the loop also work for a Claude Code / Copilot-only hire? This decides
   whether we invest in Cursor-hosted MCP catalog vs a portable HTTP MCP
   gateway.
2. **Cloud Agent budget.** Staging MCP + Playwright in CI + Cloud Agents is
   the actual engineer cost, not the VPS. What is the monthly cap?
3. **Always-on staging from month one — yes or no?** Without it the agent
   loop is local-only. A Hetzner CX22-class box plus the Grafana stack is the
   cheap version (~€5–15 plus domain).
4. **GitHub organisation and who owns billing / SSO?** Fine-grained GitHub
   Apps for agents need an org, not a personal repo, before the first hire.
5. **EU data residency required for logs and backups?** If yes, Grafana Cloud
   US is off the table; self-host Grafana in EU (Hetzner Falkenstein/Helsinki)
   is the default. Matches GDPR in `MVP.md` NFR-05.

### Safety / ops policy

6. **May an agent auto-merge to `main`?** Recommendation: **no**. Required
   checks plus a human or a later two-person rule.
7. **May an agent deploy production?** Recommendation: **no** for MVP.
   Staging yes.
8. **When an alert fires, do we spawn an agent automatically?** If yes: only
   with read MCP + a PR, never with prod credentials. Who is paged if the
   agent fails?
9. **Prod SQL MCP — ever?** Recommendation: not until a read replica, a
   legal view of what PII an agent may see, and a DPA-friendly log of queries.
10. **Secret inspection.** Are Cloud Agents allowed to *use* staging secrets
    without *printing* them? Need an org policy and a secret manager that
    injects env, not chat.

### Product / stack leftovers

11. **Client framework override?** **Signed:** Vite + React PWA, not Next-heavy
    (`STACK.md`). Overturn only with Architecture + Product note.
12. **Host: VPS (Hetzner, EU, compose) vs PaaS (Fly.io, more MCP-friendly
    deploys, less Grafana-beside-the-app)?** VPS fits the OSS Grafana pack
    and GDPR. PaaS fits “no ops hire”. We are a Spring house with a Grafana
    sidecar — VPS is the consistent pick unless you want to pay someone else
    to run containers.
13. **Grafana Cloud free tier as escape hatch** when the VPS cannot hold
    14-day logs — allowed or EU-only self-host even if disks grow?
14. **Transactional email provider** when we leave Mailpit (Resend vs SES vs
    EU-only). Needed before any real user email (verification, GDPR).
15. **Seed content legality** (VISION §10 Q1) — if scraping is in-bounds,
    agents will be asked to scrape. That is a legal call, not an MCP call.

---

## 7. Sequence if the calls are accepted

Aligns with `MVP.md` §8. Engineering loop is week 0–2, not a later platform
project.

| Week | Ship |
|---|---|
| 0 | This document signed or amended. GitHub org, Environments, GHCR. |
| 1 | Devcontainer + compose: Spring skeleton, Postgres+PostGIS, Grafana pack, Mailpit, MinIO. `mcp-grafana` + Postgres-RO + GitHub MCP in repo pack. `AGENTS.md`. |
| 1–2 | GitHub Actions: unit, build, Playwright against compose. No merge without it. |
| 2 | Staging VPS, remote MCP (Grafana + Postgres-RO), first smoke on deploy. OpenTelemetry traces in logs even if Tempo is later. |
| 2–4 | Curator tooling and content import *on this skeleton*. Do not start Explore on a laptop-only API. |
| Before any user | Alertmanager → human channel. Alert → agent spawn is nice-to-have, not a launch blocker. Prod observe MCP. Human prod deploy. |

Content remains the product critical path. The loop above is so that when
content exists, agents can change the product without inventing ops.

---

## Overturning

| Call | Cost to reverse |
|---|---|
| PostgreSQL + PostGIS | **Signed.** High after Place data exists |
| GitHub Actions instead of Jenkins | **Signed.** Low until we have tens of workflows |
| Playwright as the only E2E | Low in the first month; high after hundreds of tests |
| Vite + React client (not Next-heavy) | **Signed.** Medium after Explore exists |
| No prod write MCP | Reverse only with a written policy |
| Remote MCP for Cloud Agents | If skipped, the whole “AI engineer” claim is local-only |
