# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**my-island** is a React 18 + TypeScript + Vite camping/glamping accommodation booking platform. It's a single-page application with mobile-first design, using MSW (Mock Service Worker) for API mocking during development.

## Development Commands

```bash
npm run dev        # Start dev server (Vite + MSW mocking)
npm run build      # TypeScript check + Vite production build
npm run lint       # ESLint check
npm run preview    # Preview production build locally
```

## Architecture

### Tech Stack
- **React 18** with React Router v6
- **TypeScript** (strict mode)
- **Vite** for bundling
- **Tailwind CSS** with custom green-themed design system
- **TanStack React Query** for data fetching
- **MSW** for API mocking in development

### Code Organization

```
src/
├── components/
│   ├── ui/           # Reusable UI primitives (Button, Card, Input, Modal, Badge)
│   ├── layout/       # Shell components (TopAppBar, BottomNav, AppShell, StickyFooter)
│   ├── booking/      # Booking flow components (DateRangePicker, GuestCounter, PriceBreakdown)
│   └── campsite/     # Campsite display (CampsiteCard, FacilitiesGrid, SupplierCard)
├── context/          # React Context providers (AuthContext, ThemeContext, BookingContext)
├── pages/            # Route-based page components
├── types/            # TypeScript type definitions
├── utils/            # Utility functions (cn for className merging)
└── mocks/            # MSW handlers and mock data
    ├── handlers/     # API endpoint mocks (auth, campsites, bookings, offers)
    └── data/         # Mock data fixtures
```

### Key Patterns

- **State Management**: React Context for auth, theme, and booking flow state
- **Path Aliases**: `@/` maps to `src/` for imports
- **Styling**: Tailwind utility classes with `dark:` prefix for dark mode
- **Icons**: Google Material Symbols with custom variation settings
- **Mock API**: MSW intercepts fetch calls in development; handlers in `src/mocks/handlers/`

### Core Data Models

Located in `src/types/index.ts`:
- `User`: Authentication and profile
- `Campsite`: Location, facilities, accommodation lots
- `CampsiteLot`: Individual units (tent, RV, cabin, glamping) with pricing
- `Booking`: Reservations with dates, guests, extras, pricing
- `SupplierOffer`: Local business offers (food, activities, gear)

### Booking Flow

Multi-step flow through routes: dates → guests/extras → summary → payment → confirmation. State managed via `BookingContext`.

## Design Reference

Design screens are in `/design/` directory (PNG + HTML) covering all major features including home, listings, booking flow, offers, and profile screens.
