# My Island Documentation

> **History only (CEO 2026-09-05).** This folder describes the previous camping
> booking platform. It is superseded by [`../product/`](../product/) — **do not
> implement from here.** It is **not** the company OS, **not** the work tracker,
> and **not** the rebuild spec. Tag `legacy-platform` is archaeology. Product
> canon: [`../product/SIGNED.md`](../product/SIGNED.md). House stack:
> [`../product/STACK.md`](../product/STACK.md) (Java / Spring, Vite+React PWA —
> not Next, Postgres+PostGIS, Grafana MCP). Draft PRs that treat this folder as
> requirements (#2, #4, #5) are closed or ignored.
>
> Company OS (Obsidian): [`../ops/`](../ops/HOME.md). Do not open this folder as
> the vault.

Camping/glamping booking platform for Ireland with a local supplier marketplace.

## Navigation

### Domain
Core business logic and entity documentation. Each module has a `README.md` with status, entities, API endpoints, and frontend pages.

| Module | Status | Description |
|--------|--------|-------------|
| [Accommodation](domain/accommodation/) | Implemented | Campsites, lots, pricing, availability |
| [Admin](domain/admin/) | Implemented | Platform admin portal, audit log, lead CRM, financial reporting |
| [Booking](domain/booking/) | Implemented | Reservations, payments, check-in/out |
| [Identity](domain/identity/) | Implemented | Auth, users, roles, staff management |
| [Marketplace](domain/marketplace/) | Implemented | Suppliers, offers, voucher redemption |
| [Review](domain/review/) | Implemented | Guest reviews for campsites and suppliers |
| [Notification](domain/notification/) | Partial | Event-driven notifications (no email/push yet) |
| [Discovery](domain/discovery/) | Implemented | Points of interest, travel journal |
| [Communication](domain/communication/) | Planned | Messaging, email delivery |
| [Support](domain/support/) | Planned | Support tickets |

Cross-cutting references:
- [Domain Model](domain/DOMAIN_MODEL.md) — Entity relationships, state machines, bounded contexts
- [Visual Flows](FLOWS.md) — Mermaid diagrams for platform flows and user journeys
- [FAQ](domain/FAQ.md) — Accommodation types and domain concepts

### Architecture
- [Overview](architecture/OVERVIEW.md) — System diagram, tech stack, project structure
- [Infrastructure](architecture/INFRASTRUCTURE.md) — Docker, Kafka, PostgreSQL, local dev setup

### Operations
- [Mobile Testing](operations/MOBILE_TESTING.md) — LAN access, tunneling, device testing
- [Seed Data](operations/SEED_DATA.md) — Test accounts, data inventory
- [Load Testing](../gatling/README.md) — Gatling E2E load tests, smoke/load/stress profiles

### Automation (MCP / agent ops)
Vision: observe (logs, metrics, alerts, SQL) → change → verify → deploy via MCP and Cloud Agents.
- [Overview](automation/README.md) — Quick verdict matrix
- [Current Flow](automation/CURRENT_FLOW.md) — Commit → test → safe → how deploy works today
- [Automation Gaps](automation/AUTOMATION_GAPS.md) — What blocks full automation
- [Target Loop](automation/TARGET_LOOP.md) — Desired closed loop and safety contract
- [Observability MCP options](automation/OBSERVABILITY_MCP_OPTIONS.md) — Stack choices
- [Observability setup](automation/OBSERVABILITY_SETUP.md) — Implemented Prometheus/Loki/Alertmanager + mcp-grafana
- [Jenkins CI/CD](automation/JENKINS.md) — PR AI review, autofix, auto-merge, deploy, confirm prod

### Audits
Point-in-time reports (historical, not living docs):
- [2026-02-10 Stripe Audit](audits/2026-02-10-stripe-audit.md)
- [2026-02-08 Supplier Portal](audits/2026-02-08-supplier-portal.md)

### Other
- [Roadmap](ROADMAP.md) — Feature priorities and status
- [MVP Launch Checklist](MVP_LAUNCH_CHECKLIST.md) — Launch readiness tracker
- [Campsite Leads](leads/CAMPSITE_LEADS.md) — Archaeology. Living store: [`../data/leads/`](../data/leads/README.md)

### Assets
- `Designs/` — UI design mockups and visual diagrams (Event Storm, page flow)
- `screenshots/` — App screenshots
- `test-images/` — Test image assets

## For AI (Claude Code)
When updating docs after code changes:
1. Find the module README: `docs/domain/{module}/README.md`
2. Update status, entities, endpoints, or lifecycle diagrams as needed
3. If the change affects cross-cutting concerns, also update `domain/DOMAIN_MODEL.md`
4. See CLAUDE.md "Documentation Sync" section for the full checklist
