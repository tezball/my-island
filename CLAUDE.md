# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**my-island** is a camping/glamping booking platform with a React frontend and Spring Boot backend. MVP is ~75% complete with 83 page components, 120 mock campsites, and dual user flows (guests and campsite owners).

## Development Commands

### Frontend
```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # TypeScript check + production build
npm run preview      # Preview production build
```

### Backend (my-island-api/)
```bash
docker compose up -d              # Start PostgreSQL, LocalStack, Kafka, Grafana
mvn spring-boot:run               # Run Spring Boot application
mvn test                          # Run tests (requires Docker for Testcontainers)
mvn test -Dtest=ClassName         # Run specific test class
```

## Tech Stack

- **Frontend**: React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS 4 + React Router 7
- **Backend**: Spring Boot 4.0.1 + Java 25 + PostgreSQL 17 + Spring Security (JWT)
- **AWS (LocalStack)**: S3 (images), SES (email), Kafka (events)
- **Testing**: JUnit 5 + Testcontainers + MockMvc
- **Mapping**: Leaflet 1.9.4 + react-leaflet
- **Charts**: Recharts 3.6.0

## Backend Architecture

```
my-island-api/src/main/java/com/example/myislandapi/
├── config/           # SecurityConfig, JpaConfig
├── controller/       # REST controllers (AuthController, UserController)
├── dto/              # Request/Response DTOs
│   ├── request/      # LoginRequest, SignupRequest, etc.
│   └── response/     # AuthResponse, UserResponse, etc.
├── entity/           # JPA entities (User, Campsite, Booking)
├── enums/            # Facility, LotType, BookingStatus, etc.
├── exception/        # Custom exceptions + GlobalExceptionHandler
├── repository/       # Spring Data JPA repositories
├── security/         # JWT provider, filter, UserDetailsService
└── service/          # Business logic (AuthService, UserService)
```

### API Endpoints (Implemented)
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login (returns JWT)
- `POST /api/auth/refresh` - Refresh token
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile
- `DELETE /api/users/me` - Delete account

### Database Migrations
Located in `my-island-api/src/main/resources/db/migration/`
- V1: Init schema (UUID extension)
- V2: Users and linked_accounts tables

## Architecture

### Directory Structure
```
src/
├── App.tsx              # Main router (~70 routes)
├── components/
│   ├── charts/          # BarChart, LineChart (Recharts wrappers)
│   ├── layout/          # AppShell, Header, BottomNav
│   └── ui/              # Button, Input, Calendar, MapView, etc.
├── pages/               # 83 page components by feature
│   ├── Auth/            # Login, signup, password reset
│   ├── Booking/         # Booking flow
│   ├── Discovery/       # Map, search, browse
│   ├── MyBookings/      # View reservations
│   ├── owner/           # Owner admin panel (15 pages)
│   └── [other flows]
└── data/
    ├── mockData.ts      # 120 mock campsites
    └── types.ts         # TypeScript interfaces
```

### Key Patterns
- **Page-based organization**: Components in `/pages` organized by feature flow
- **URL params**: Extensive use of React Router params (`/book/:id`, `/bookings/:bookingId`)
- **Path alias**: Use `@/*` for imports from src directory
- **Mock data**: All data mocked in `src/data/mockData.ts` pending API integration

## Critical Issues (P0)

1. **BookingSummaryPage blank** - Returns null when booking context missing (`src/pages/BookingSummaryPage.tsx`)
2. **Currency inconsistency** - Visitor pages use €, owner pages use $ (standardize to €)
3. **Auth not enforced** - Protected routes accessible without login

## Documentation

- `docs/flows/` - User flow diagrams and user stories for all features
- `docs/MVP_ROADMAP.md` - Prioritized issue list with file locations
- `docs/Missing Features Analysis.md` - Gap analysis vs design specs

## Important Files

- `src/App.tsx` - Master routing configuration
- `src/data/types.ts` - Core TypeScript interfaces (User, Campsite, Booking, etc.)
- `src/data/mockData.ts` - Mock data affecting many pages
- `docs/MVP_ROADMAP.md` - Current priorities and known issues

## TypeScript Configuration

Strict mode enabled with:
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- Path alias: `@/*` → `./src/*`

## User Flows

1. **Guests** - Browse and book campsites
2. **Registered Users** - Saved data and booking history
3. **Campsite Owners** - Admin panel with 15+ management pages

## Before Implementing Features

1. Check `docs/flows/` for existing user stories and acceptance criteria
2. Review `docs/MVP_ROADMAP.md` for priority context
3. Reuse existing components from `src/components/ui/`