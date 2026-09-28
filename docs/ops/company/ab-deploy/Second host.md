---
title: Second host
tags:
  - research
  - deploy
status: research
audience: cto
date: 2026-09-28
---

# Second host

A second VPS, or a load balancer that is not Caddy on this box. Included so the cost of leaving the single-server lock is visible. Index: [[ops/company/ab-deploy/AB deploy]].

> [!warning] Fights the current lock
> Decision 39 ([[ops/company/DECISIONS]]): this product's host is https://fishing-journals.com, still **one machine**, until a later split. Deploy stays Jenkins `deploy-mock-prod` from `main` (decision 37, Mac mini). Agents never SSH. No GitHub Environment named `production`, no `compose.prod`, no prod SSH path. A second server is that later split. It is not a configuration tweak on the current job.

## How it would have to work

Two shapes get talked about. Both are outside the files this packet read.

**Second VPS, one database left on the current machine.** Catalog B runs elsewhere. It needs a network path to `postgres:5432`, which today is not published (`ports: !override []` in `compose.mock-prod.yml`) and lives on the Compose network. Opening Postgres off the box is a new attack surface and a new secret. Flyway still runs on one `catalog` database ([[ops/company/ab-deploy/Expand contract]]). Sessions in `spring_session` stay shared, which is the part that works. The Jenkins job gains a second SSH target. Decision 37 put the only key in Jenkins on the Mac mini and told Cloud Agents not to SSH. A second key is a new decision, and it is still not a GitHub `production` Environment.

**Second VPS with its own Postgres.** Places, guest accounts, VisitIntent, and sessions split or have to replicate. Flyway on two writers is how `flyway_schema_history` forks. The public gate reads one URL, `https://fishing-journals.com/actuator/info`. Two writers means two SHAs unless something in front hides one of them. There is no replica, no publication, and no second datasource URL in `application.yml` (the overlay sets one `SPRING_DATASOURCE_URL` via the base compose file: `jdbc:postgresql://postgres:5432/catalog`).

**External load balancer** (another VPS, or a hosted LB) in front of one or two apps. Caddy on this host already is the HTTP router, including CSP and the GIS paths. An external LB either terminates TLS again or forwards TCP to Caddy. Forwarding TCP to one Caddy does not create an A/B slot. Forwarding to two Caddies is two edge configs to keep in sync with `caddy_apex.py`. The balancer is a product we do not run, with a console the timer cannot click. Decision 20 is no human approve on the ship path.

Observe lock (decision 18) reads Prometheus and Loki from this test server through Grafana, and forbids publishing Prometheus on the internet. A second host means a second scrape target and a second place logs go, still without a public Prometheus. That is [[ops/tickets/WF-041]] scope, not a sideline of A/B.

## Pulse and drain

[[ops/company/ab-deploy/Startup pulse]] would be the same HTTP, fired across the network at B, with a firewall hole for Jenkins or for the VPS. [[ops/company/ab-deploy/Drain]] would lose `docker exec` into `my-island-postgres-1` unless the database stays on a host the job can already exec. An external balancer might show connection counts. It still cannot see SQL or the absence of `@Scheduled` jobs.

The Mac mini job's 90 minute timeout would then include cross-host SSH, image pull or a second build, and a health wait that today is a loopback curl.

## Pros

- The customer VPS would stop building the Maven image and running two JREs in the same memory as Postgres. That CPU contention is real on the current script (`docker compose build` on the VPS, then a second JVM if we overlap).
- A later split matches the sentence already in decision 39 ("until a later split") when someone actually wants a second failure domain.
- Rollback can be a balancer weight, once that balancer exists.

## Cons

- It contradicts the lock this packet was told to respect. Recommending it as the next change invents the fleet the CEO dated exception still refuses.
- Every secret, the Google client, `CATALOG_IMPORT_KEY`, and the SSH story, is built for one remote dir `/opt/my-island` and one `MOCK_PROD_HOST`.
- The gate, the smoke, and the info stamp assume one origin. Two origins need a written rule for which SHA is "live".
- A second database breaks the session table and the directory unless replication is designed. Replication is not in the compose files.
- Jenkins `disableConcurrentBuilds` is one queue. Two hosts do not fix a bad migration; they give it a longer network.
- WF-010 (always-on staging as a second box) is a different ticket and is not this product's second production.

## What still breaks

If the database stays singular, [[ops/company/ab-deploy/Expand contract]] is still the whole schema story. The extra host does not give Flyway a safe contract migration.

If the database is copied, the thing that breaks is the product: two directories, two session stores, and a gate that can see only one `gitCommit`.

This note is the option that should lose until decision 39 is revised on purpose.
