# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

My Island is a camping/glamping booking platform for Ireland with a marketplace for local suppliers. Full stack application with React frontend and Spring Boot backend.

## Cross-Layer Change Requirements

**IMPORTANT**: When making changes to domain concepts (user types, roles, entities, features), you MUST update ALL affected layers:

### Checklist for Domain Changes
- [ ] **Frontend**: Types, services, components, pages
- [ ] **Backend**: Entities, repositories, services, controllers, DTOs
- [ ] **Database**: Flyway migrations if schema changes
- [ ] **Documentation**:
  - `docs/00-Domain/DOMAIN_MODEL.md`
  - `docs/00-Domain/*/USER_STORIES.md` (affected modules)
  - This file (`CLAUDE.md`) - test accounts, architecture diagrams
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
    └── marketplace/       # Supplier, Offer, Claim
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
│   └── supplier/         # Supplier dashboard pages
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

All passwords are `password`.

| Email | Role |
|-------|------|
| norevalley@myisland.com | Owner |
| farmshop@greenacres.ie | Supplier |
| family@example.com | Guest |

**Note**: Users can hold multiple roles (e.g., be both Owner AND Supplier) via `isOwner` and `isSupplier` flags. Staff users (`isStaff=true`) gain access to the portals of the Owner/Supplier who invited them.

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
- `GET /api/marketplace/offers` - Browse offers
- `POST /api/supplier/redeem/{code}` - Redeem voucher
- `GET/POST/DELETE /api/owner/staff` - Manage owner staff members
- `GET/POST/DELETE /api/supplier/staff` - Manage supplier staff members
