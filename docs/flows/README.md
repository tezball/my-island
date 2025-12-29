# my-island User Flows

This directory contains documentation for all major user flows in the my-island camping/glamping booking application. Each flow includes screens, user stories, and flow diagrams.

## Flow Overview

| Flow | Description | User Stories |
|------|-------------|--------------|
| [Onboarding](./onboarding/) | First-time user introduction and app benefits | 5 stories |
| [Auth](./auth/) | Login, signup, password reset, email verification | 8 stories |
| [Discovery](./discovery/) | Map, search, filters, campsite browsing | 10 stories |
| [Booking](./booking/) | Date selection, lot choice, extras, payment | 11 stories |
| [My Bookings](./my-bookings/) | View, modify, and cancel reservations | 12 stories |
| [Profile](./profile/) | User profile, settings, preferences | 13 stories |
| [Favorites](./favorites/) | Save and manage favorite campsites | 6 stories |
| [Reviews](./reviews/) | Submit and browse campsite reviews | 9 stories |
| [Offers](./offers/) | Local supplier deals and promotions | 8 stories |
| [Owner/Admin](./owner-admin/) | Campsite management for owners | 15 stories |
| [Errors](./errors/) | Error handling and empty states | 8 stories |

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
                       │    Flow     │                 │
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
       │    Flow     │ │  Flow   │ │    Flow     │ │    Flow     │ │  Flow   │
       └──────┬──────┘ └─────────┘ └──────┬──────┘ └─────────────┘ └─────────┘
              │                           │
              ▼                           ▼
       ┌─────────────┐             ┌─────────────┐
       │  Campsite   │             │ My Bookings │
       │   Detail    │             │    Flow     │
       └──────┬──────┘             └──────┬──────┘
              │                           │
              ▼                           ▼
       ┌─────────────┐             ┌─────────────┐
       │   Booking   │             │   Reviews   │
       │    Flow     │             │    Flow     │
       └─────────────┘             └─────────────┘
```

## Directory Structure

```
docs/flows/
├── README.md              # This file
├── onboarding/
│   ├── README.md          # User stories & flow diagram
│   ├── 01-welcome.png
│   ├── 02-benefits-1.png
│   └── ...
├── auth/
│   ├── README.md
│   ├── 01-login.png
│   └── ...
├── discovery/
│   ├── README.md
│   └── ...
├── booking/
│   ├── README.md
│   └── ...
├── my-bookings/
│   ├── README.md
│   └── ...
├── profile/
│   ├── README.md
│   └── ...
├── favorites/
│   ├── README.md
│   └── ...
├── reviews/
│   ├── README.md
│   └── ...
├── offers/
│   ├── README.md
│   └── ...
├── owner-admin/
│   ├── README.md
│   └── ...
└── errors/
    ├── README.md
    └── ...
```

## User Story Format

All user stories follow the standard format:

```
### US-[FLOW]-[NUMBER]: [Title]
**As a** [user type]
**I want to** [action]
**So that** [benefit]

**Acceptance Criteria:**
- Criterion 1
- Criterion 2
- ...
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

## Primary User Types

1. **Guest** - Users browsing and booking campsites
2. **Registered User** - Logged-in guests with saved data
3. **Campsite Owner** - Users managing campsite listings
4. **Supplier** - Local businesses offering deals

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

## Related Documentation

- [UI Style Guide](../ui-style-guide.html) - Visual design system
- [Design Snag List](../Design%20Snag%20List.md) - Known issues
- [Missing Features Analysis](../Missing%20Features%20Analysis.md) - Gap analysis

## Contributing

When adding new flows or updating existing ones:

1. Create/update the flow folder with screenshots
2. Update the README.md with user stories
3. Include flow diagrams using ASCII art
4. Link to relevant source code files
5. Update this index if adding new flows
