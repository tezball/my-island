---
title: my-island Documentation
type: MOC
status: active
updated: 2026-01-04
---

# my-island Documentation

> Camping/glamping booking platform for Ireland

---

## Quick Navigation

| Section | Description |
|---------|-------------|
| [[01-Project-Management/README\|Project Management]] | Task tracking and snag list |
| [[02-Architecture/README\|Architecture]] | Technical design and domain models |
| [[03-Business/README\|Business]] | Revenue projections and cost estimates |
| [[04-User-Flows/README\|User Flows]] | User journeys and screen flows |
| [[05-Design-Specs/README\|Design Specs]] | UI/UX specifications |
| [[06-Feedback/README\|Feedback]] | Testing status and issue tracking |
| [[07-Testing/TESTING_APPROACH\|Testing]] | Backend API testing strategy |

---

## Project Status

```
MVP Progress: ~75% Complete
├── Frontend: 83 page components
├── Backend: 12 controllers, 55+ endpoints
├── Database: PostgreSQL with Flyway migrations
└── Infrastructure: Docker, LocalStack (S3/SES), Kafka
```

### Current Focus
- [[01-Project-Management/SNAG_LIST|Snag List]] - Active bugs from E2E testing
- [[01-Project-Management/OUTSTANDING_WORK|Outstanding Work]] - Remaining MVP tasks

---

## User Types

| User Type | Primary Flow | Admin Panel |
|-----------|--------------|-------------|
| Guest | [[04-User-Flows/discovery/README\|Discovery]] → [[04-User-Flows/booking/README\|Booking]] | - |
| Registered | All flows + [[04-User-Flows/favorites/README\|Favorites]] | - |
| Owner | [[04-User-Flows/owner-admin/README\|Owner Admin]] | 15+ pages |
| Supplier | [[04-User-Flows/offers/README\|Offers]] management | 3 pages |

---

## Key Flows

### Guest Journey
```
Discovery (Map/Search) → Campsite Detail → Booking → Confirmation
```

### Owner Journey
```
Dashboard → Manage Lots → View Bookings → Revenue → Settings
```

---

## Core Documentation

| Document | Purpose |
|----------|---------|
| [[02-Architecture/DOMAIN_MODEL\|Domain Model]] | Entities, enums, business rules |
| [[04-User-Flows/user-flows\|User Flows]] | Visual flow diagrams |
| [[02-Architecture/tech-stack\|Tech Stack]] | Technology overview |

---

## Getting Started

### For Developers
1. Read [[02-Architecture/README|Architecture Overview]]
2. Review [[02-Architecture/DOMAIN_MODEL|Domain Model]]
3. Check [[01-Project-Management/SNAG_LIST|Current Issues]]

### For PMs/Stakeholders
1. Start with [[01-Project-Management/README|Project Status]]
2. Review [[04-User-Flows/README|User Flows]]
3. Check [[06-Feedback/README|Testing Status]]
