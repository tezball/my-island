# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**my-island** is a camping/glamping booking platform for Ireland with a React frontend and Spring Boot backend. The app supports three user roles: guests (browse/book), registered users (booking history, favorites), and campsite owners (property management).

## Development Commands

### Starting the Application

**IMPORTANT: ALWAYS use `./start.sh` to start the application. No exceptions.**

```bash
./start.sh           # Start everything (Docker, DB reset, build, tests, backend)
```

This script handles: Docker services, database reset, frontend build, backend tests, and Spring Boot startup. Never use `mvn spring-boot:run`, `docker compose up`, or other individual commands to start the app.

### Frontend (after backend is running)
```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # TypeScript check + production build
```

### Running Tests Only
```bash
cd my-island-api
mvn test                               # Run all tests
mvn test -Dtest=ClassName              # Run specific test class
mvn test -Dtest=ClassName#methodName   # Run specific test method
```

**Ports**: The UI is always served on port 8080 (Spring Boot serves the built frontend). Use `http://localhost:8080` for all browser testing. The Vite dev server on 5173 is only for frontend-only development with hot reload.

## Tech Stack

- **Frontend**: React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS 4 + React Router 7 + Leaflet (maps) + Recharts
- **Backend**: Spring Boot 4.0.1 + Java 25 + PostgreSQL 17 + Spring Security (JWT) + Flyway + MapStruct
- **Infrastructure**: LocalStack (S3/SES), Kafka (events), Testcontainers (testing)

## Architecture

### Frontend Structure
```
src/
├── App.tsx              # All routes (~70 routes with React Router)
├── components/
│   ├── auth/            # ProtectedRoute wrapper
│   ├── charts/          # Recharts wrappers (BarChart, LineChart)
│   ├── layout/          # AppShell, Header, BottomNav
│   ├── ui/              # Shared components (Button, Input, Calendar, MapView)
│   └── wizard/          # Multi-step campsite creation wizard
├── context/             # React contexts (Auth, Booking, Favorites, CampsiteWizard, Toast)
├── data/types.ts        # Core TypeScript interfaces
├── lib/
│   ├── api.ts           # Centralized HTTP client with JWT handling
│   └── api/             # Domain-specific API services (campsites, bookings, etc.)
└── pages/               # Page components organized by feature
    └── owner/           # Owner admin panel (15+ pages)
```

### Backend Structure
```
my-island-api/src/main/java/com/example/myislandapi/
├── config/           # SecurityConfig (JWT + CORS), JpaConfig, AwsConfig
├── controller/       # REST controllers
├── dto/
│   ├── request/      # Input DTOs (LoginRequest, CreateBookingRequest, etc.)
│   └── response/     # Output DTOs (AuthResponse, CampsiteResponse, etc.)
├── entity/           # JPA entities (User, Campsite, Lot, Booking, Review, etc.)
├── enums/            # BookingStatus, Facility, LotType, OfferCategory, etc.
├── event/            # Kafka event types (BookingEvent, NotificationEvent)
├── exception/        # Custom exceptions + GlobalExceptionHandler
├── listener/         # Kafka listeners (EmailListener, NotificationListener)
├── repository/       # Spring Data JPA repositories
├── security/         # JwtTokenProvider, JwtAuthenticationFilter, UserDetailsServiceImpl
└── service/          # Business logic layer
```

### Database Schema & Seeding
- **Schema + Data**: Both handled by Flyway (`V1__init.sql`)
- **Hibernate**: `ddl-auto: none` - Flyway is the source of truth
- **FlywayConfig.java**: Custom bean that runs Flyway on startup (excluded from test profile)
- **Important**: To add/modify schema or seed data, add new Flyway migrations (V2+) in `db/migration/`
- **start.sh**: Always resets DB and runs `mvn clean` to ensure fresh migrations

### API Authentication
- JWT-based stateless auth
- Public endpoints: `/api/auth/**`, `/api/campsites/**` (GET), `/api/offers/**` (GET), `/api/local-businesses/**` (GET)
- Role-based access: `/api/owner/**` requires OWNER role, `/api/supplier/**` requires SUPPLIER role
- Frontend stores tokens in localStorage (`access_token`, `refresh_token`)

### Key Patterns
- **Path alias**: Use `@/*` for imports from src directory
- **API services**: Each domain has a dedicated service in `src/lib/api/` (campsites.ts, bookings.ts, etc.)
- **Protected routes**: Wrap with `<ProtectedRoute>`, optionally with `requireOwner` or `requireSupplier` props
- **Paginated responses**: Backend returns `PagedResponse<T>` with `content`, `totalElements`, `totalPages`

## TypeScript Configuration
Strict mode with `noUnusedLocals: true` and `noUnusedParameters: true`.

## Test Data

Data is seeded via Flyway migration `V1__init.sql` which includes both schema and seed data.

### Demo Accounts (password: `demo1234`)
| Email | Name | Role | Properties |
|-------|------|------|------------|
| `visitor@my-island.com` | Emma Murphy | Guest | - |
| `supplier@my-island.com` | Michael Kelly | Supplier | - |
| `owner@my-island.com` | Sarah O'Brien | Owner | 1 (Wicklow) |
| `sean@wildatlantic-glamping.ie` | Sean O'Donnell | Owner | 3 (Donegal, Sligo) |
| `mary@galwaybay-guesthouse.ie` | Mary Gallagher | Owner | 2 (Galway) |
| `aoife@cork-eco-retreat.ie` | Aoife Brennan | Owner | 1 (Cork) |
| `siobhan@clifdeneco.ie` | Siobhan O'Malley | Owner | 2 (Connemara) |
| `patrick@ringofkerry.ie` | Patrick Kerry | Owner | 1 (Kerry) |
| `liam@burrencamping.ie` | Liam Brennan | Owner | 1 (Clare) |
| `niamh@dinglebandb.ie` | Niamh Walsh | Owner | 1 (Kerry) |
| `declan@giantscauseway.ie` | Declan Murphy | Owner | 1 (Antrim) |

### Seed Data Summary
- **Users**: 11 accounts (1 guest, 1 supplier, 9 owners)
- **Campsites**: 13 properties across Ireland
- **Lots**: 50 units (tents, glamping, cabins, B&B rooms, etc.)
