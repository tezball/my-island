---
title: Port redirect
tags:
  - research
  - deploy
status: research
audience: cto
date: 2026-09-28
---

# Port redirect

Move packets with nftables (or iptables) on the VPS, without buying a load balancer. Index: [[ops/company/ab-deploy/AB deploy]].

## How it works on this host

Public HTTPS is terminated by `server-caddy-1`. The catalog container listens on container port 8080. The only host port the overlay publishes for it is `18081:8080` (`compose.mock-prod.yml`). `deploy-mock-prod.sh` uses `127.0.0.1:18081` for health and for `import_leads.py`. Browsers use port 443 on Caddy, which dials Docker DNS `island-catalog:8080` on network `server_default`.

An nftables redirect of host port 18081 from one container to another changes the deploy script's private curl. Caddy's upstream string does not look at 18081. Customers stay on whichever container owns the alias `island-catalog`.

A redirect that would move customers has to sit on a port Caddy is not already bound to, or it has to replace Caddy. Replacing Caddy drops the site blocks `caddy_apex.py` maintains: TLS, HSTS, the CSP that allows Leaflet and Google, the `/explore` 308, `admin.` / `venues.` redirects, and the split between API and nginx. That is the product edge. nftables does not speak HTTP, so it cannot split `/api/v1` from the PWA.

Docker publishes `18081` with its own nftables/iptables rules. A second set of rules in the deploy script races those rules on every `compose up`. The next container recreate rewrites Docker's chain and the hand-written redirect is gone or duplicated.

Redirecting inside the bridge, from the address Caddy has cached for `island-catalog` to container B, depends on conntrack and on Caddy's DNS cache. Caddy already re-resolves upstreams on reload. A packet rewrite is a second mechanism for the same hop, with worse logs.

## Pulse and drain

[[ops/company/ab-deploy/Startup pulse]] still has to pass on B before any rule points at B. The pulse is HTTP. nftables cannot see readiness or `PostGIS_Version()`.

[[ops/company/ab-deploy/Drain]] can use conntrack entries aimed at A's address, which is a count of TCP sessions, not of finished Spring requests and not of SQL. `pg_stat_activity` is still the SQL view. A redirect does not make actuator suddenly list in-flight work.

## Pros

- No new product and no second VPS. nftables is a normal Linux tool on the box.
- For a service that was published only as a host port, a redirect is a small move. Catalog is not published that way for customers.
- The Jenkins job could apply a ruleset over the same SSH session it already has.

## Cons

- The customer path is Caddy → Docker DNS → container port. The redirectable host port is the health port.
- HTTP routing (API versus static, actuator versus the PWA) lives in the Caddyfile. A port redirect is one TCP stream.
- Docker owns the filter rules for published ports. The unattended script would be repairing nftables on every deploy the signal starts, including deploys the gate `SKIP`s if someone put the rules in the wrong stage.
- Two containers and one `18081` still cannot both bind. The redirect does not remove that bind. One of them stays unpublished, which is the A/B-ports design, and Caddy remains the switch.
- Failure mode is a black hole: a rule that matches and a container that failed its pulse. Caddy reload at least keeps serving A until the file changes. A broad prerouting rule does not have A's process as a fallback unless the rule is written that carefully, every time, by the same job.
- `disableConcurrentBuilds` does not protect the kernel ruleset from a human or from Docker's own rewrite mid-job.

## What still breaks

[[ops/company/ab-deploy/Expand contract]] is unchanged. Packets landing on B still start a JVM that runs Flyway against the one `catalog` database.

Conntrack dies on a container address change. In-flight TCP to A resets when A stops, same as today's recreate, unless A stays up and Caddy (not nftables) is what stops sending new work.

This option is the one to show the CTO and leave on the shelf. The house already has a local reverse proxy that can reload.
