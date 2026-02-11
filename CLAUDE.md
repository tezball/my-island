# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

My Island is a camping/glamping booking platform for Ireland with a marketplace for local suppliers. Full stack application with React frontend and Spring Boot backend.

## Documentation Sync (Mandatory)

**CRITICAL**: Every code change MUST include corresponding documentation updates. This is not optional — treat docs as part of the deliverable, not an afterthought.

### For EVERY task, before considering it complete:
1. **Identify affected module** — Find the module README at `docs/domain/{module}/README.md`
2. **Update module README** — Update status, entities, endpoints, lifecycle diagrams, or frontend pages as needed
3. **Create missing docs** — If no documentation exists for the feature area, create it following the module README template
4. **Update DOMAIN_MODEL.md** — If entities, enums, relationships, or status flows changed, update `docs/domain/DOMAIN_MODEL.md`
5. **Update CLAUDE.md** — If test accounts, endpoints, architecture, or key patterns changed, update this file

### Documentation locations
- **Module overview (start here)**: `docs/domain/{module}/README.md` — status, entities, endpoints, pages
- **Domain model**: `docs/domain/DOMAIN_MODEL.md` — entity relationships, state machines, bounded contexts
- **Module details**: `docs/domain/{module}/NOTES.md` — aggregates, business rules, invariants
- **User stories**: `docs/domain/{module}/USER_STORIES.md`
- **Specific flows**: `docs/domain/{module}/*.md` (e.g., `booking/PAYMENT_FLOW.md`)
- **Architecture**: `docs/architecture/OVERVIEW.md`
- **Operations**: `docs/operations/` (testing guides, seed data)
- **Roadmap**: `docs/ROADMAP.md`
- **Full index**: `docs/README.md`

### What counts as a doc-worthy change
- New or modified API endpoints
- New or modified entity fields, enums, or status values
- Business logic changes (booking flows, payment states, etc.)
- New features or feature removals
- Configuration or architecture changes
- Bug fixes that reveal incorrect documentation

## Cross-Layer Change Requirements

**IMPORTANT**: When making changes to domain concepts (user types, roles, entities, features), you MUST update ALL affected layers:

### Checklist for Domain Changes
- [ ] **Frontend**: Types, services, components, pages
- [ ] **Backend**: Entities, repositories, services, controllers, DTOs
- [ ] **Database**: Flyway migrations if schema changes
- [ ] **Documentation**: See "Documentation Sync" section above
- [ ] **API Docs**: Update Swagger annotations if endpoints change

### Examples of Cross-Layer Changes
- Adding/removing a user role → Update enum in backend, types in frontend, test accounts, domain docs
- New entity → Migration, backend module, frontend service, domain model docs
- Removing a feature → Remove from all layers, update all related documentation

## Quick Start

```bash
# Full stack with Docker
docker compose up -d

# Access points
# - Frontend: http://localhost:5173
# - API: http://localhost:8080/api
# - Swagger: http://localhost:8080/api/swagger-ui.html
# - Kafka UI: http://localhost:8081
```

## Commands

### Frontend (`my-island-web/`)

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # TypeScript check + Vite build
npm run lint     # ESLint
npm run preview  # Preview production build
```

### Backend (`my-island-api/`)

```bash
./mvnw spring-boot:run    # Start Spring Boot (http://localhost:8080)
./mvnw test               # Run tests
./mvnw package            # Build JAR
```

### Docker

```bash
docker compose up -d              # Start all services
docker compose up -d postgres kafka  # Start dependencies only
docker compose logs -f api        # View API logs
docker compose down               # Stop all services
```

## Architecture

```
my-island/
├── my-island-web/          # React 19 frontend
├── my-island-api/          # Spring Boot 3.4 backend
├── docker-compose.yml      # Full stack orchestration
└── docs/                   # Documentation vault
```

### Backend Structure

```
my-island-api/src/main/java/com/myisland/api/
├── config/                 # Security, Kafka, Async configs
├── security/               # JWT provider, filter, user details
├── shared/
│   ├── domain/            # Base entity
│   ├── events/            # Application events, Kafka events
│   └── exceptions/        # Global exception handler
└── modules/
    ├── identity/          # User, Auth, Staff, JWT endpoints
    ├── accommodation/     # Owner, Lot, Amenity
    ├── booking/           # Booking entity and service
    ├── marketplace/       # Supplier, Offer, Claim
    └── admin/             # Platform admin: audit log, leads CRM, admin services
```

### Frontend Structure

```
my-island-web/src/
├── App.tsx                 # Router with Layout wrapper
├── components/
│   ├── booking/           # BookingModal
│   ├── layout/            # Header, BottomNav
│   └── ui/                # Reusable components
├── pages/                 # Page components
│   ├── owner/            # Owner dashboard pages
│   ├── supplier/         # Supplier dashboard pages
│   └── admin/            # Platform admin portal pages
├── context/              # AuthContext for auth state
└── services/             # API services
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4 |
| Routing | React Router 7 |
| Backend | Spring Boot 3.4, Java 25, Spring Security |
| Database | PostgreSQL 17 |
| Messaging | Apache Kafka |
| Auth | JWT |

## Key Patterns

- **Routing**: React Router with nested routes. Owner/Supplier routes protected by role checks
- **Auth State**: React Context (`AuthContext`), JWT stored in localStorage
- **API**: RESTful with `/api` prefix, Swagger documentation
- **Events**: Spring ApplicationEvents published to Kafka topics
- **Path Alias**: `@/*` maps to `./src/*`
- **Layout**: Header and BottomNav hidden on `/signin`, `/signup`, `/personalize`

## Test Accounts

The login page has a dropdown that auto-fills credentials for these accounts.

### Subscribed Owners
| Email | Password | Description |
|-------|----------|-------------|
| norevalley@myisland.com | `NoreValley2025!Secured` | Nore Valley Park |
| hello@burrenglampingvillage.ie | `BurrenGlamp$99Safe` | Burren Glamping Village |

### Subscribed Suppliers
| Email | Password | Description |
|-------|----------|-------------|
| farmshop@greenacres.ie | `GreenAcres#Farm2025` | Green Acres Farm Shop |
| info@aillweefarmshop.ie | `AillweeCh33se!Secure` | Aillwee Farm Shop & Cheese |

### No Subscription (for testing subscription gates)
| Email | Password | Description |
|-------|----------|-------------|
| bookings@loughdergcamping.ie | `LoughDerg!Camp2025` | Lough Derg Lakeside (Owner) |
| hello@dinglekayak.ie | `W@v3R!d3r$K3rrry#2026` | Dingle Kayak Adventures (Supplier) |

### Owner Staff (all use password `OwnerStaff#2026!Secure`)
| Email | Role | Staff Of |
|-------|------|----------|
| staff@norevalley.com | Manager | Nore Valley |
| staff@burrenglamp.ie | Receptionist | Burren Glamping |
| grounds@norevalley.com | Groundskeeper | Nore Valley |
| viewer@norevalley.com | Viewer | Nore Valley |

### Supplier Staff (all use password `SupplierStaff#2026!Safe`)
| Email | Role | Staff Of |
|-------|------|----------|
| staff@greenacres.ie | Manager | Green Acres |
| staff@aillwee.ie | Redeemer | Aillwee |
| shop@greenacres.ie | Associate | Green Acres |

### Platform Admin
| Email | Password | Description |
|-------|----------|-------------|
| tezball86@gmail.com | `PlatformAdmin#2026!Secure` | Platform Admin (superuser) |

### Guests
| Email | Password | Description |
|-------|----------|-------------|
| family@example.com | `MurphyFamily!Trip2025` | Murphy Family (has bookings) |
| testguest@example.com | `TestGuest#2026!Safe` | Clean account, no bookings |

**Note**: Users can hold multiple roles (e.g., be both Owner AND Supplier) via `isOwner`, `isSupplier`, and `isAdmin` flags. Staff users (`isStaff=true`) gain access to the portals of the Owner/Supplier who invited them. Admin users (`isAdmin=true`) access the platform admin portal at `/admin`.

## Database

Flyway migrations in `my-island-api/src/main/resources/db/migration/`:
- V001-V007: Schema tables
- V999: Seed data

## TypeScript Configuration

Strict mode enabled with:
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`

## Tailwind Theme

Custom colors in `tailwind.config.js`:
- `primary: #059669` (green)
- `background-light: #f6f7f8`
- `background-dark: #101922`
- Font: Plus Jakarta Sans

## API Endpoints

Full API documentation at `/api/swagger-ui.html` when running.

Key endpoints:
- `POST /api/auth/login` - Login
- `GET /api/campsites` - List campsites
- `POST /api/bookings` - Create booking
- `PUT /api/owner/bookings/{id}/modify` - Modify booking dates or lot (owner)
- `GET /api/marketplace/offers` - Browse offers
- `POST /api/supplier/redeem/{code}` - Redeem voucher
- `GET/POST/DELETE /api/owner/staff` - Manage owner staff members
- `GET/POST/DELETE /api/supplier/staff` - Manage supplier staff members
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Admin user management
- `GET /api/admin/bookings` - Admin booking management
- `GET /api/admin/owners` - Admin owner management
- `GET /api/admin/suppliers` - Admin supplier management
- `GET /api/admin/reviews` - Admin review moderation
- `GET /api/admin/subscriptions` - Admin subscription overview
- `GET /api/admin/financial/revenue` - Admin financial reports
- `CRUD /api/admin/leads` - Admin leads CRM
- `GET /api/admin/audit` - Admin audit log
