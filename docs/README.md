# My Island Documentation

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

### Audits
Point-in-time reports (historical, not living docs):
- [2026-02-10 Stripe Audit](audits/2026-02-10-stripe-audit.md)
- [2026-02-08 Supplier Portal](audits/2026-02-08-supplier-portal.md)

### Other
- [Roadmap](ROADMAP.md) — Feature priorities and status
- [MVP Launch Checklist](MVP_LAUNCH_CHECKLIST.md) — Launch readiness tracker
- [Campsite Leads](leads/CAMPSITE_LEADS.md) — Partnership outreach tracking

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
