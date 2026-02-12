# Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│   React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS 4           │
│   └── React Router 7                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API (JWT Auth)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND                                   │
│   Spring Boot 3.4 + Java 25 + Spring Security                   │
│   └── Port 8080 (/api/*)                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │PostgreSQL│   │  Mailpit │   │  Stripe  │
        │   17     │   │ (email)  │   │(payments)│
        └──────────┘   └──────────┘   └──────────┘
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4 |
| Routing | React Router 7 |
| Maps | Leaflet + react-leaflet |
| Charts | Recharts |
| Backend | Spring Boot 3.4, Java 25, Spring Security |
| Database | PostgreSQL 17 |
| Migrations | Flyway |
| Events | Spring ApplicationEvents (@Async) |
| Scheduling | Spring @Scheduled + ShedLock |
| Payments | Stripe (Payment Intents, Subscriptions, Connect Express) |
| Auth | JWT (Spring Security, localStorage) |

## Backend Module Structure

```
my-island-api/src/main/java/com/myisland/api/
├── config/                 # Security, Async configs
├── security/               # JWT provider, filter, user details
├── shared/
│   ├── domain/            # Base entity
│   ├── events/            # Application events, async event publisher
│   └── exceptions/        # Global exception handler
└── modules/
    ├── identity/          # User, Auth, Staff, JWT endpoints
    ├── accommodation/     # Owner, Lot, Amenity, Pricing, Featured
    ├── booking/           # Booking, Payment (Stripe intents)
    ├── marketplace/       # Supplier, Offer, Claim, Stripe Connect/Webhooks
    ├── review/            # Campsite reviews, Supplier reviews
    ├── notification/      # Event-driven notifications
    └── discovery/         # Points of Interest, user visits
```

## Frontend Structure

```
my-island-web/src/
├── App.tsx                 # Router with Layout wrapper
├── components/
│   ├── booking/           # BookingModal, PaymentForm
│   ├── explore/           # Map, filters, popups
│   ├── layout/            # Header, BottomNav
│   ├── owner/             # Owner portal components
│   ├── supplier/          # Supplier portal components
│   ├── review/            # Review display, star rating
│   ├── staff/             # StaffManagement
│   └── ui/                # Reusable (ImageUpload, Calendar, etc.)
├── pages/
│   ├── owner/             # Owner dashboard pages
│   └── supplier/          # Supplier dashboard pages
├── context/               # AuthContext
├── services/              # API service modules
└── types/                 # TypeScript type definitions
```

## Key Patterns

| Pattern | Implementation |
|---------|----------------|
| Auth | JWT in localStorage, AuthContext provides user state |
| API calls | `fetch()` with auth headers, no axios |
| Routing | React Router 7, nested routes, role-based guards |
| Path alias | `@/*` → `./src/*` |
| Events | Spring ApplicationEvents → @Async @TransactionalEventListener → email service |
| Payments | Stripe manual capture (authorize → capture) |
| Images | `/api/images/{entityType}/{entityId}` multi-image upload |
| Scheduling | ShedLock for distributed lock, @Scheduled for cron jobs |
| Subscriptions | Stripe-managed with webhook event handling |

## API Documentation
Live Swagger UI available at `/api/swagger-ui.html` when running.
