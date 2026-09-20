---
title: CEO decisions
type: company
status: active
owner: orchestrator
created: 2026-09-05
cssclasses:
  - moc
---

# CEO decisions

Signed calls. Product freeze: [`product/SIGNED.md`](../../product/SIGNED.md). Canon for product house is [`product/STACK.md`](../../product/STACK.md). Do not re-litigate in a ticket.

## 2026-09-05 — Directory MVP, cleanup, house stack

**Terry.** Directory MVP is **signed** (CEO 2026-09-05 — [`product/SIGNED.md`](../../product/SIGNED.md)). Working tree is not a running consumer app.

| # | Decision | Where it lives |
|---|---|---|
| 1 | **Directory MVP** — phone-first curated Ireland directory (POI / experience / campsite / B&B), list + map, one-tap check-off (pre-signup), My Places, curator seed; discovery near-me / not-been-yet / nearby. **Out:** booking, payments, partner portals, reviews, messaging, native apps. **Success:** return tick rate. **Kill** if near-zero after a fair launch. | [`product/SIGNED.md`](../../product/SIGNED.md), [`product/MVP.md`](../../product/MVP.md), [`product/VISION.md`](../../product/VISION.md), [[ops/tickets/PRD-000]] |
| 2 | **Cleanup.** `docs/` is past-company history only. Do not implement from it. Tag `legacy-platform` is archaeology only. Canon = `product/` + `ops/`. Draft PRs #2 / #4 / #5 / #7 **closed** by Orchestrator (2026-09-05). | [`docs/README.md`](../../README.md), [[ops/tickets/WF-008]] (done) |
| 3 | **Backend always Java / Spring Boot.** House rule. Permanent. Do not recommend TypeScript or FastAPI APIs as the default. | [`product/STACK.md`](../../product/STACK.md) |
| 4 | **UI light, easy, fast.** Thin Vite + React PWA (or equivalent). **Not** Next.js-heavy unless later evidence. | [`product/STACK.md`](../../product/STACK.md) |
| 5 | **Ruthless agent loop.** Solid tools + MCP servers + clear idea→prod workflows with logs, metrics, alerts. | [`product/STACK.md`](../../product/STACK.md) gaps |
| 6 | **Leads-only scrape.** Aggressive multi-source collection is approved for Research **leads** with provenance. Leads are not published places. Counsel before publish. No auth/CAPTCHA bypass. | [`data/leads/`](../../data/leads/README.md), [[ops/tickets/PRD-006]], [[ops/tickets/PRD-007]], [[ops/tickets/PRD-009]] |

## Signed house (`product/STACK.md`)

Architecture’s draft is canon. Do not invent a competing stack.

| Layer | Lock | Ticket |
|---|---|---|
| Backend | Java / Spring Boot (permanent) | [[ops/tickets/PRD-001]] (plan [[ops/plans/PRD-001]] approved; `implement`) |
| Client | Vite + React light PWA, **not** Next | [[ops/tickets/PRD-003]] (gated on `implement`) |
| Data | PostgreSQL 17 + PostGIS, Flyway | [[ops/tickets/PRD-001]] |
| Observe | Grafana OSS MCP (`mcp-grafana`) | [[ops/tickets/WF-004]] |
| CI | **Jenkins** local compose + JCasC; GHA dual-run for remote PRs/automerge. No legacy Jenkins restore. | [[ops/tickets/WF-031]] |
| CD | `main` is git; **no production Environment** (CEO 2026-09-12). Ready PRs auto-merge when CI is green. Mock-prod deploy: [[ops/tickets/WF-032]] unattended from green `main`: [[ops/tickets/WF-040]]. | [[ops/tickets/WF-025]] |

### MCP gaps (must close for idea→prod)

| Gap | Ticket | Status |
|---|---|---|
| Remote / staging MCP (HTTP/SSE, not laptop stdio) | [[ops/tickets/WF-004]] | blocked on [[ops/tickets/WF-010]] |
| Mock-prod house Prom/Loki + Grafana MCP HTTP/SSE | [[ops/tickets/WF-041]] | implement |
| Agent MCP pack (Jenkins, Gatling, Playwright, Postgres RO) | [[ops/tickets/WF-042]] | implement |
| Gatling fail → Jenkins red + Grafana/AM (agents **read** via MCP) | [[ops/tickets/WF-045]] | implement |
| Close public Place writes (seed/import only) | [[ops/tickets/WF-046]] | implement |
| Alert → agent (Alertmanager webhook → Cloud Agent spawn) | [[ops/tickets/WF-009]] | inbox |

Host, OIDC provider, and curator-admin depth remain open in STACK.

**Do not build** the consumer app until a `PRD-*` ticket is `implement`.

## 2026-09-12 — No production; ready PRs merge themselves

**Terry.** This project **has no production environment and probably never will.** Relax the old “humans merge / no prod deploy” posture that assumed a fleet.

| # | Decision | Where it lives |
|---|---|---|
| 7 | **No prod.** No GitHub Environment prod gate, no `compose.prod`, no prod SSH. Local compose is the runtime. Do not block agent work on a hypothetical prod. | this note, [[ops/workflow/SAFETY]], `.cursor/rules/no-prod.mdc` |
| 8 | **Ready PRs auto-review, approve, and squash-merge** when CI `unit` + `catalog` + `web` + `stack` are green. Drafts and forks never auto-merge. Chat reviewer hat still does not merge. | [[ops/tickets/WF-025]], [[ops/workflow/CI]] |

CD line in [`product/STACK.md`](../../product/STACK.md): `main` is git; there is no prod Environment. Staging tickets ([[ops/tickets/WF-010]]) are separate and not a prod stand-in.

## 2026-09-12 — POI directory slice (CEO workshop)

**Terry.** POC at fishing-journals.com/explore/ is done. Next public surface is a **finished-looking directory of Irish POIs** — not campsites, not check-off, not My Places. Local compose is the demo.

| # | Decision | Where it lives |
|---|---|---|
| 10 | **POI-only published catalog** for this slice. Wave 1 campsites stay Research (`status=lead`). | [[ops/workshops/poi-directory-mvp]], [[ops/tickets/PRD-002]] |
| 11 | **Reuse** [[ops/tickets/PRD-002]] + [[ops/tickets/PRD-003]] + [[ops/tickets/PRD-011]]. Do not file a new PRD for the directory demo. | this note |
| 12 | **Photos** from Wikimedia Commons (attribution on Place). Do not scrape aggregator or operator galleries. Local `published=true` ≠ [[ops/tickets/PRD-009]] counsel. | [[ops/workshops/poi-directory-content]], [`data/leads/`](../../data/leads/) |
| 13 | **Map** is Leaflet + OpenStreetMap raster (no Mapbox token; no WebGL). Carto public tiles watermark. fishing-journals.com CSP is a **host** change ([[ops/runbooks/MOCK_HOST_CSP]]); Leaflet `<img>` tiles already match `img-src https:`. | [[ops/workshops/poi-directory-qa]] |

CHK / ME / ACC stay off this public slice until a later ticket. 500-place launch DoD is not this slice (~100 POIs).

## 2026-09-12 — Jenkins local house CI (CTO)

**CTO + Terry unlock.** Greenfield Jenkins-as-code in compose is allowed for clone→up engineer CI. Still **no** wholesale restore from `docs/automation/` / `legacy-platform`. Still **no** GitHub Environment `production`. Deploy target = mock-prod VPS when it exists ([[ops/tickets/WF-032]]).

| # | Decision | Where it lives |
|---|---|---|
| 9 | **Jenkins local house CI** via JCasC + `ops_jenkins` volume. GHA remains dual-run for remote PR automerge until a shared runner exists. | [[ops/tickets/WF-031]], [[ops/runbooks/JENKINS_LOCAL]], [`product/STACK.md`](../../product/STACK.md) |

## 2026-09-13 — Mock-prod is fishing-journals.com apex

**Terry.** Remove the fishing-journals test app from the VPS. my-island owns `https://fishing-journals.com/`. Reuse the existing Google OAuth Web client (GIS ID token, `POST /api/auth/google`). This is mock-prod, not a GitHub `production` Environment.

| # | Decision | Where it lives |
|---|---|---|
| 14 | **Mock-prod host** is fishing-journals.com (apex). Fishing-journals app stack is retired. | [[ops/tickets/WF-032]], [[ops/runbooks/MOCK_PROD_DEPLOY]] |
| 15 | **Google Sign-In** on that host reuses the fishing-journals GIS client and path `/api/auth/google`. | [[ops/tickets/WF-014]] |

## 2026-09-19 — VisitIntent slice; unattended mock-prod; agent MCP

**Terry.** Next public slice is **VisitIntent** (`been` / `want` / `never`) on the existing Ireland POI directory. This is **not** a live consumer app. Merging to `main` is enough for the test server. Agents never SSH. Reviewer agents comment only. Ready PRs auto-merge when CI is green. This company **has no production environment and probably never will.** Q&A is **closed** (Terry chose **A** on public counts: anonymous been only).

| # | Decision | Where it lives |
|---|---|---|
| 16 | **Unattended loop.** Git commit / green `main` → Jenkins `deploy-mock-prod` → post-deploy **HTTP/API smoke** confirm (health + info SHA). Not a full UI suite. Playwright is cron + MCP ([[ops/tickets/WF-011]]). Catalog API, Chaos Monkey, and ZAP are **merge CI**. Gatling is a **light trickle** on fishing-journals.com (ongoing smoke) plus **weekly** full perf — not a merge load test ([[ops/tickets/WF-042]]). SSH key stays in Jenkins. Never in git, never in Cloud Agent chat. Agents never SSH. | [[ops/tickets/WF-040]], [[ops/tickets/WF-042]], [[ops/tickets/WF-043]], [[ops/tickets/WF-044]], [[ops/tickets/WF-045]], [[ops/workflow/PIPELINE]] |
| 17 | **VisitIntent** is the Guest’s mark on a Place: `been`, `want`, or `never`. One per Guest+Place; change replaces. **Never** is explicit. Browse is public; ticks require a **signed-in Guest**. Keep live Explore. Ireland seed only. **Do not** implement [[ops/tickets/PRD-012]] / [[ops/tickets/PRD-013]] as one-tap / My Places. | [`product/POI-VISITINTENT.md`](../../product/POI-VISITINTENT.md), [[ops/tickets/PRD-015]] |
| 18 | **Observe lock C.** House Prometheus/Loki data comes from the **test server** (fishing-journals.com). Agents read/act via Grafana MCP **HTTP/SSE**. Laptop Grafana uses the **same** datasources (script/tunnel). Do **not** leave agents on local-compose-only metrics. Do **not** publish Prometheus on the public internet. Leftover `grafana.fishing-journals.com` is not house Grafana. | [[ops/tickets/WF-041]] |
| 19 | **Agent MCP pack** (plus public HTTPS): catalog API, Jenkins job status + deploy-on-main, Gatling, Playwright, Postgres RO, deploy/status. Credentials in Jenkins / agent env, never in `docs/`. If a tool needs a shell on the box, it is a Jenkins job or MCP wrapper. | [[ops/tickets/WF-042]], [[ops/workflow/MCP]] |
| 20 | **No human approve gate** on this path after this lock. Planner → implementer → reviewer comment → CI automerge → Jenkins follows `main` → post-deploy tests. Chat agents still do not `gh pr merge`. | [[ops/workflow/LOOP]], [[ops/workflow/SAFETY]] |
| 21 | **Build order C.** Two streams in **parallel**, both `status: implement`: (1) unattended mock-prod + house observe + agent MCP + chaos-in-CI + ZAP-in-CI + Gatling fail path + close public Place writes ([[ops/tickets/WF-040]] · [[ops/tickets/WF-041]] · [[ops/tickets/WF-042]] · [[ops/tickets/WF-043]] · [[ops/tickets/WF-044]] · [[ops/tickets/WF-045]] · [[ops/tickets/WF-046]]); (2) auth + VisitIntent ([[ops/tickets/PRD-010]] · [[ops/tickets/PRD-015]]). Do **not** wait for deploy before starting ticks. | [[ops/workshops/poi-visitintent]] |
| 22 | **Guest auth: username/password AND Google SSO.** GIS can stay. Seed **password** Guests for Gatling/agents (env, not docs). Do not make GIS a blocker. No OIDC stub. Spring redirect OIDC remains [[ops/tickets/WF-014]] (later). | [[ops/tickets/PRD-010]] |
| 23 | **Chaos lock C.** Chaos Monkey in **merge CI** (Jenkins + GHA), house overlay / Testcontainers, to prove **retries and default fallbacks**. Chaos **off** UI-less `unit`/`catalog`. Do **not** run Chaos Monkey against public fishing-journals.com on every deploy. Do **not** move Chaos to cron. MCP may trigger a drill later. | [[ops/tickets/WF-043]] |
| 24 | **Security lock B.** ZAP-style scanner **in merge CI** against **local compose/Testcontainers**, **every merge**. Not the primary scan against public fishing-journals.com. Do **not** move ZAP to cron. Keep it off `unit`/`catalog`. | [[ops/tickets/WF-044]] |
| 25 | **Test lanes.** **Only UI/Playwright is outside merge CI** as a browser suite (cron + MCP, [[ops/tickets/WF-011]]). Merge CI: catalog/BFF API, Chaos Monkey, ZAP. Fast merge: keep Playwright off required UI-less jobs (`unit`/`catalog`). Gatling is **not** a merge load test — see #26. | [[ops/tickets/WF-011]], [[ops/workflow/TEST_STACK]] |
| 26 | **Gatling lock.** **Light trickle** on fishing-journals.com as ongoing smoke through all features (not a merge-CI load test). **Full Gatling performance** = weekly Jenkins cron and/or MCP/manual. Do **not** put full perf on every merge. Seeded password Guest. | [[ops/tickets/WF-042]] |
| 27 | **Alerts lock C.** Trickle smoke and weekly Gatling failures mark **Jenkins red** and fire **Grafana/Alertmanager**. Agents read both via MCP. Mute leftover fishing-journals email (do not restore). | [[ops/tickets/WF-045]], [[ops/tickets/INC-001]] |
| 28 | **Catalog writes lock C.** No public POST/PUT/PATCH/DELETE of Places. Place rows change only via **seed/import in CI/deploy**. Guests authenticate to write **VisitIntent only**. Close the open `POST /api/v1/places`. Directory GETs stay public. | [[ops/tickets/WF-046]], [[ops/tickets/PRD-015]] |
| 29 | **VisitIntent privacy.** Guest lists are **private**. Place pages may show **anonymous counts only** (no PII). | [[ops/tickets/PRD-015]], [`product/POI-VISITINTENT.md`](../../product/POI-VISITINTENT.md) |
| 30 | **Public counts lock A.** Place API/UI expose anonymous **been count** only. **Want** and **never** are private to the Guest. No PII. | [[ops/tickets/PRD-015]], [`product/POI-VISITINTENT.md`](../../product/POI-VISITINTENT.md) |

Domain terms (do not invent synonyms in tickets): **Place**, **County**, **Guest**, **VisitIntent**. Host / Experience owner / Support: glossary only; no UI in this slice.

CHK / ME as signed in [`product/MVP.md`](../../product/MVP.md) remain the longer Release 1 backlog. This slice does not ship them.

## 2026-09-19 — Booking-site program (planner locks)

**Planner, CEO brief.** File a sequenced campsite/B&B booking backlog for **mock-prod** after POI + VisitIntent. Not a live consumer app. Expansion gates in [`product/EXPANSION.md`](../../product/EXPANSION.md) are waived **for planning** only. Children stay `inbox` so they do not starve in-flight P0 `WF-*` / [[ops/tickets/PRD-010]] / [[ops/tickets/PRD-015]]. Epic [[ops/tickets/PRD-004]] is never `implement`.

| # | Decision | Where it lives |
|---|---|---|
| 31 | **Booking-site program** after VisitIntent: Guest search/book/pay/trips/reviews/messages; Host onboard/calendar/reservations/payouts; Admin moderation/disputes; Help + support inbox; mock seed per Irish county. | [`product/BOOKING-SITE.md`](../../product/BOOKING-SITE.md), [[ops/tickets/PRD-016]]–[[ops/tickets/PRD-029]] |
| 32 | **Bookable kinds:** campsite + B&B only. POI/experience stay directory + VisitIntent. | [`product/BOOKING-SITE.md`](../../product/BOOKING-SITE.md) |
| 33 | **Mock PSP in catalog** (authorize/capture/refund). EUR. 10% platform fee. No live card keys on mock-prod. No second payments service. | [[ops/tickets/PRD-018]] |
| 34 | **Host writes** are authenticated drafts (`/api/v1/host/…`). Public Place POST stays closed ([[ops/tickets/WF-046]]). Admin publishes. Skip claim-existing-POI. | [[ops/tickets/PRD-020]], [[ops/tickets/PRD-026]] |
| 35 | **Seed:** ≥1 mock campsite + ≥1 mock B&B per 32 counties. Do not replace 101 POIs. | [[ops/tickets/PRD-016]] |
| 36 | **Do not promote** booking children to `ready`/`implement` while stream-1 `WF-040`–`WF-046` and PRD-010/015 are the P0 auto pick. First child to promote: [[ops/tickets/PRD-016]]. Leave [[ops/tickets/PRD-012]] / [[ops/tickets/PRD-013]] blocked. | [[ops/plans/PRD-004]] |

## 2026-09-20 — Cloud→Jenkins lock C

**Terry.** Cloud Agents asked how to use Jenkins to deploy. Pick **C**.

| # | Decision | Where it lives |
|---|---|---|
| 37 | **Cloud→Jenkins lock C.** Self-hosted Cursor worker on the Mac mini that already has Jenkins + `MOCK_PROD_*` + the SSH key. That worker triggers `deploy-mock-prod` on loopback Jenkins. Do **not** pick B (Cloud VMs reaching Jenkins over HTTPS). Do **not** pick D (GHA SSH; key in GitHub secrets). Key stays in Jenkins. Agents never SSH. Not a GitHub Environment `production`. | [[ops/tickets/WF-049]], [[ops/plans/WF-049]] |

