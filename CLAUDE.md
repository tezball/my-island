# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

My Island is a camping/glamping booking platform for Ireland. The frontend is in this repository; the backend (Spring Boot) runs separately on port 8080.

## Commands

All commands run from the `my-island-web/` directory:

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # TypeScript check + Vite build
npm run lint     # ESLint
npm run preview  # Preview production build
```

No test suite is currently configured.

## Architecture

```
my-island/
├── my-island-web/     # React frontend
└── docs/              # Obsidian documentation vault
```

### Frontend Structure

```
my-island-web/src/
├── App.tsx            # Router with Layout wrapper
├── components/
│   ├── admin/         # AdminLayout
│   ├── auth/          # AdminGuard (route protection)
│   ├── booking/       # BookingModal
│   ├── layout/        # Header, BottomNav
│   └── ui/            # Reusable components (DateInput)
├── pages/             # Page components
│   └── admin/         # Admin dashboard pages
├── context/           # AuthContext for auth state
└── services/          # API services + mockData.ts
```

### Key Patterns

- **Routing**: React Router with nested routes. Admin routes protected by `AdminGuard`
- **Auth State**: React Context (`AuthContext`)
- **Mock Data**: `services/mockData.ts` contains 120+ mock campsites for development
- **Path Alias**: `@/*` maps to `./src/*`
- **Layout**: Header and BottomNav hidden on `/signin`, `/signup`, `/personalize`

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4 |
| Routing | React Router 7 |
| Backend | Spring Boot 4.0.1, Java 25 (separate repo) |
| Database | PostgreSQL 17 |
| Auth | JWT |

## TypeScript Configuration

Strict mode is enabled with these additional rules:
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`

## Tailwind Theme

Custom colors defined in `tailwind.config.js`:
- `primary: #059669` (green)
- `background-light: #f6f7f8`
- `background-dark: #101922`
- Font: Plus Jakarta Sans

## Documentation

Architecture docs in `docs/02-Architecture/`:
- `README.md` - System overview with diagrams
- `tech-stack.md` - Full technology details
- `DOMAIN_MODEL.md` - Domain-driven design model
