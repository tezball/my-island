---
title: User Flows
type: MOC
status: active
created: 2026-01-03
tags:
  - moc
  - user-flows
  - user-stories
  - ux
---

# User Flows

> User journeys, stories, and screen flows for all my-island features

**See also:** [[user-flows|Master User Flows]] - Comprehensive visual guide with ASCII diagrams

---

## Flow Overview

| Flow | Description | User Stories | Screens |
|------|-------------|--------------|---------|
| [[onboarding/README\|Onboarding]] | First-time user introduction | 5 | 8 |
| [[auth/README\|Authentication]] | Login, signup, password reset | 8 | 8 |
| [[discovery/README\|Discovery]] | Map, search, campsite browsing | 10 | 5 |
| [[booking/README\|Booking]] | Date selection to payment | 11 | 11 |
| [[my-bookings/README\|My Bookings]] | View, modify, cancel reservations | 12 | 10 |
| [[profile/README\|Profile]] | User settings and preferences | 13 | 11 |
| [[notifications/README\|Notifications]] | Alerts and preferences | 8 | 4 |
| [[favorites/README\|Favorites]] | Save favorite campsites | 6 | 1 |
| [[reviews/README\|Reviews]] | Submit and browse reviews | 9 | 1 |
| [[offers/README\|Offers]] | Local supplier deals | 8 | 2 |
| [[owner-admin/README\|Owner/Admin]] | Campsite management | 15 | 23 |
| [[errors/README\|Errors]] | Error and empty states | 8 | 0* |

*Error screens need design

---

## User Journey Map

```
                                    ┌─────────────┐
                                    │  App Open   │
                                    └──────┬──────┘
                                           │
                              ┌────────────┴────────────┐
                              ▼                         ▼
                       ┌─────────────┐          ┌─────────────┐
                       │ First Time  │          │  Returning  │
                       │    User     │          │    User     │
                       └──────┬──────┘          └──────┬──────┘
                              │                        │
                              ▼                        │
                       ┌─────────────┐                 │
                       │ Onboarding  │                 │
                       └──────┬──────┘                 │
                              │                        │
                              └────────────┬───────────┘
                                           │
                                           ▼
                                    ┌─────────────┐
                                    │    Home     │
                                    │  (Map View) │
                                    └──────┬──────┘
                                           │
              ┌────────────┬───────────────┼───────────────┬────────────┐
              ▼            ▼               ▼               ▼            ▼
       ┌─────────────┐ ┌─────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐
       │  Discovery  │ │Favorites│ │  Bookings   │ │   Offers    │ │ Profile │
       └──────┬──────┘ └─────────┘ └──────┬──────┘ └─────────────┘ └─────────┘
              │                           │
              ▼                           ▼
       ┌─────────────┐             ┌─────────────┐
       │  Campsite   │             │ My Bookings │
       │   Detail    │             │             │
       └──────┬──────┘             └──────┬──────┘
              │                           │
              ▼                           ▼
       ┌─────────────┐             ┌─────────────┐
       │   Booking   │             │   Reviews   │
       └─────────────┘             └─────────────┘
```

---

## Primary User Types

| User Type | Description | Primary Flows |
|-----------|-------------|---------------|
| Guest | Browsing without account | Discovery, Booking |
| Registered | Logged-in users | All flows + Favorites |
| Campsite Owner | Property managers | Owner/Admin (15+ pages) |
| Supplier | Local businesses | Offers management |

---

## User Story Format

All user stories follow this format:

```
### US-[FLOW]-[NUMBER]: [Title]
**As a** [user type]
**I want to** [action]
**So that** [benefit]

**Acceptance Criteria:**
- Criterion 1
- Criterion 2
```

### Story ID Prefixes

| Prefix | Flow |
|--------|------|
| US-ONB | Onboarding |
| US-AUTH | Authentication |
| US-DISC | Discovery |
| US-BOOK | Booking |
| US-MYBK | My Bookings |
| US-PROF | Profile |
| US-FAV | Favorites |
| US-REV | Reviews |
| US-OFF | Offers |
| US-OWN | Owner/Admin |
| US-ERR | Error States |

---

## Key Metrics by Flow

| Flow | Success Metrics |
|------|-----------------|
| Onboarding | Completion rate, Skip rate |
| Auth | Registration conversion, Login success |
| Discovery | Search-to-detail rate, Time to find |
| Booking | Booking conversion, Cart abandonment |
| My Bookings | Modification rate, Cancellation rate |
| Reviews | Review submission rate, Average rating |
| Offers | Redemption rate, Click-through rate |

---

## Directory Structure

```
04-User-Flows/
├── README.md              # This file (MOC)
├── user-flows.md          # Master visual guide
├── missing-screens.md     # Gap analysis
├── onboarding/            # Onboarding flow
├── auth/                  # Authentication flow
├── discovery/             # Discovery flow
├── booking/               # Booking flow
├── my-bookings/           # My Bookings flow
├── profile/               # Profile flow
├── notifications/         # Notifications flow
├── favorites/             # Favorites flow
├── reviews/               # Reviews flow
├── offers/                # Offers flow
├── owner-admin/           # Owner/Admin flow
└── errors/                # Error states
```

Each flow folder contains:
- `README.md` - User stories and flow diagram
- `*.png` - Screen screenshots
- `*-flow.canvas` - Obsidian canvas diagram

---

## Related Links

- [[../README|Docs Home]]
- [[../05-Design-Specs/README|Design Specs]]
- [[../05-Design-Specs/ui-style-guide|UI Style Guide]]
- [[missing-screens|Missing Screens]]
