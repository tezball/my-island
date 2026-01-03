---
title: Architecture
type: MOC
status: active
created: 2026-01-03
tags:
  - moc
  - architecture
  - technical
---

# Architecture

> Technical design, domain models, and system architecture for my-island

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│   React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS 4           │
│   └── React Router 7 (~70 routes)                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API (JWT Auth)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND                                   │
│   Spring Boot 4.0.1 + Java 25 + Spring Security                 │
│   └── Port 8080 (/api/*)                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │PostgreSQL│   │    S3    │   │   SES    │
        │   17     │   │ (images) │   │ (email)  │
        └──────────┘   └──────────┘   └──────────┘
```

---

## Key Documents

### Domain
- [[DOMAIN_MODEL]] - Entity relationships and data model

### Technical
- [[tech-stack]] - Full technology stack details

---

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript 5.9, Vite 7, Tailwind 4 |
| Routing | React Router 7 |
| Maps | Leaflet 1.9.4 + react-leaflet |
| Charts | Recharts 3.6.0 |
| Backend | Spring Boot 4.0.1, Java 25 |
| Database | PostgreSQL 17 |
| Auth | JWT (Spring Security) |
| Cloud | AWS (S3, SES, LocalStack for dev) |
| Events | Kafka |
| Monitoring | Grafana |

---

## Backend Structure

```
my-island-api/src/main/java/com/example/myislandapi/
├── config/           # SecurityConfig, JpaConfig
├── controller/       # REST controllers
├── dto/              # Request/Response DTOs
│   ├── request/
│   └── response/
├── entity/           # JPA entities
├── enums/            # Facility, LotType, BookingStatus
├── exception/        # Custom exceptions + GlobalExceptionHandler
├── repository/       # Spring Data JPA repositories
├── security/         # JWT provider, filter, UserDetailsService
└── service/          # Business logic
```

---

## API Endpoints

### Implemented
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login (returns JWT) |
| POST | `/api/auth/refresh` | Refresh token |
| GET | `/api/users/me` | Get current user |
| PUT | `/api/users/me` | Update profile |
| DELETE | `/api/users/me` | Delete account |

### Planned
- Campsites CRUD
- Bookings CRUD
- Reviews CRUD
- Favorites sync
- Payments (Stripe)

---

## Frontend Structure

```
src/
├── App.tsx              # Main router (~70 routes)
├── components/
│   ├── charts/          # BarChart, LineChart
│   ├── layout/          # AppShell, Header, BottomNav
│   └── ui/              # Reusable components
├── pages/               # 83 page components
│   ├── Auth/
│   ├── Booking/
│   ├── Discovery/
│   ├── MyBookings/
│   └── owner/
├── context/             # React contexts
├── lib/                 # API client, utilities
└── data/
    ├── mockData.ts      # 120 mock campsites
    └── types.ts         # TypeScript interfaces
```

---

## Key Patterns

| Pattern | Implementation |
|---------|----------------|
| Page-based routing | Components in `/pages` by feature |
| URL params | React Router params (`/book/:id`) |
| Path alias | `@/*` → `./src/*` |
| Protected routes | `ProtectedRoute` with role checking |
| Mock data | Centralized in `mockData.ts` |

---

## Related Links

- [[../README|Docs Home]]
- [[../01-Project-Management/README|Project Management]]
- [[../04-User-Flows/README|User Flows]]
