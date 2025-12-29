---
tags:
  - design
  - review
  - snag-list
  - ux
  - product
created: 2024-12-29
status: in-progress
priority: high
---

# Design Snag List

> [!info] Overview
> Comprehensive review of the my-island design screens identifying missing screens, flow gaps, UX questions, and technical considerations.

**Review Date:** 2024-12-29
**Screens Reviewed:** 39
**Status:** #in-progress

---

## Quick Stats

| Category | Count |
|:---------|------:|
| Missing Screens | 44 |
| Flow Gaps | 8 |
| UX Questions | 18 |
| Accessibility Issues | 6 |
| Consistency Issues | 6 |

---

## Priority Legend

- ⏫ **P0** — Blocks core user journey (Critical)
- 🔺 **P1** — Required for MVP (High)
- 🔼 **P2** — Important, can follow (Medium)
- 🔽 **P3** — Nice to have (Low)

---

## 1. Missing Screens

### 🔐 Authentication & Onboarding

> [!danger] Critical Gap
> No sign-up flow exists - cannot acquire new users

- [ ] ⏫ M01 **Sign Up / Registration** — Login has "Sign Up" link but no flow #design/auth
- [x] 🔺 M02 Forgot Password — Link exists, no reset screens #design/auth
- [ ] 🔺 M03 Email Verification — No OTP/confirmation screen #design/auth
- [ ] 🔺 M04 Password Reset Confirmation — Success state after reset #design/auth
- [ ] 🔼 M05 Onboarding Permissions — Location/notification requests #design/onboarding

### 🔍 Discovery & Search

- [ ] 🔺 M06 **List View** — Toggle exists but no design #design/discovery
- [ ] 🔺 M07 Search Results — No results state shown #design/search
- [ ] 🔼 M08 Empty Search State — No results handling #design/search
- [ ] 🔺 M09 **Filter Modal/Sheet** — Buttons shown, no expanded UI #design/search
- [ ] 🔼 M10 Map Cluster Drill-down — Cluster pins need expansion #design/map

### 🏕️ Campsite Details

> [!warning] Booking Flow Blocked
> Users cannot select specific lots (tent/RV/cabin) - core booking incomplete

- [ ] 🔺 M11 **Reviews List** — "See all reviews" link exists #design/campsite
- [ ] 🔺 M12 Photo Gallery — No full gallery view #design/campsite
- [ ] 🔼 M13 All Suppliers View — "View All" link exists #design/suppliers
- [ ] 🔼 M14 Supplier Detail — Cards shown, no detail #design/suppliers
- [ ] ⏫ M15 **Lot Selection** — How do users pick lots? #design/booking
- [ ] 🔺 M16 Availability Calendar — No calendar UI designed #design/booking

### 💳 Booking & Payment

- [ ] 🔺 M17 Payment Method Selection — "Change" link exists #design/payment
- [ ] 🔺 M18 Add Payment Method — How to add new cards? #design/payment
- [ ] ⏫ M19 **Payment Failed** — No error state #design/payment
- [ ] 🔺 M20 Booking Failed — Completion failure state #design/booking
- [ ] 🔼 M21 Promo Code Entry — No discount functionality #design/booking

### 📋 Booking Management

- [ ] 🔺 M22 Booking Detail View — No expanded booking detail #design/bookings
- [ ] 🔺 M23 Modification Success — No final success state #design/bookings
- [ ] 🔺 M24 Check-in Instructions — Arrival details missing #design/bookings
- [ ] 🔺 M25 Contact Host — No messaging feature #design/bookings
- [ ] 🔼 M26 Booking Receipt — No downloadable invoice #design/bookings

### 👤 User Profile

- [ ] 🔺 M27 Edit Profile Form — Button exists, no form #design/profile
- [ ] 🔺 M28 Personal Info — Listed but no screen #design/profile
- [ ] 🔺 M29 Payment Methods List — Listed but no screen #design/profile
- [ ] 🔼 M30 Linked Accounts — Listed but no screen #design/profile
- [ ] 🔼 M31 Support & Help — Listed but no screen #design/profile
- [ ] 🔽 M32 Language Selection — Listed but no screen #design/profile

### 🔔 Notifications

- [ ] 🔺 M33 **Notifications List** — Bell icon but no screen #design/notifications
- [ ] 🔼 M34 Notification Detail — Tap action undefined #design/notifications
- [ ] 🔼 M35 Supplier Alert Detail — Alert content undefined #design/notifications

### 🏠 Owner/Admin

- [ ] 🔺 M36 Owner Bookings List — Nav shows but no screen #design/owner
- [ ] 🔺 M37 Owner Booking Detail — How owner manages booking #design/owner
- [ ] 🔼 M38 Broadcast Confirmation — Post-send state #design/owner
- [ ] 🔼 M39 Owner Settings — Button exists, no screen #design/owner
- [ ] 🔼 M40 Revenue Dashboard — No detailed financials #design/owner

### ⚠️ Error & Edge States

- [ ] 🔺 M41 Network Error — No offline state #design/errors
- [ ] 🔺 M42 Generic Error (500) — Server error handling #design/errors
- [ ] 🔼 M43 Session Expired — Token expiry handling #design/errors
- [ ] 🔽 M44 Maintenance Mode — Scheduled downtime #design/errors

---

## 2. Flow Gaps

> [!question] Critical Flows Missing
> Several major user journeys have no design coverage

- [ ] ⏫ G01 **Guest → Owner transition** — No campsite listing onboarding #design/flows
- [ ] ⏫ G02 **Supplier onboarding** — Suppliers shown, can't register #design/flows
- [ ] 🔺 G03 First-time empty states — No favorites/bookings empty UI #design/flows
- [ ] 🔺 G04 Deep linking — Shared links behavior undefined #design/flows
- [ ] 🔺 G05 Push → Screen mapping — Notification destinations #design/flows
- [ ] 🔺 G06 Modification rules — What can/can't be modified? #design/flows
- [ ] 🔽 G07 Multi-lot booking — Single transaction for multiple #design/flows
- [ ] 🔽 G08 Group booking — Large reservation support #design/flows

---

## 3. UX Questions

### For Product/Design Team

> [!tip] Needs Clarification
> These questions should be answered before development begins

| ID | Question | Context |
|:---|:---------|:--------|
| Q01 | What if campsite becomes unavailable after date selection? | Race condition |
| Q02 | Is there a waitlist for full campsites? | Demand management |
| Q03 | Can users save incomplete booking drafts? | Conversion |
| Q04 | How are dynamic/seasonal prices shown? | Transparency |
| Q05 | What are the cancellation policy tiers? | Policy UI |
| Q06 | How do weather warnings integrate? | Safety feature |
| Q07 | Is guest ID verification required? | Trust & safety |
| Q08 | Can owners block specific dates? | Availability mgmt |
| Q09 | How are reviews moderated? | Content moderation |
| Q10 | What's the dispute resolution flow? | Support |

### For Technical Team

| ID | Question | Context |
|:---|:---------|:--------|
| Q11 | Map provider? (Mapbox/Google/Leaflet) | Integration |
| Q12 | Real-time availability sync mechanism? | Architecture |
| Q13 | Payment providers beyond Apple Pay? | Payments |
| Q14 | Offline mode for booked trips? | PWA |
| Q15 | Supplier alert preference storage? | Notifications |
| Q16 | Image upload flow for owners? | Media |
| Q17 | Broadcast message delivery method? | Push infra |
| Q18 | Analytics events per screen? | Instrumentation |

---

## 4. Accessibility Concerns

> [!warning] WCAG Compliance
> These issues may affect accessibility compliance

- [ ] ⏫ A01 Map keyboard navigation — Home Map #design/a11y
- [ ] 🔺 A02 Green badge color contrast — Multiple screens #design/a11y
- [ ] 🔺 A03 Toggle focus states — Profile, Detail #design/a11y
- [ ] 🔺 A04 Filter chip touch targets — Home Map (min 44px) #design/a11y
- [ ] 🔼 A05 Image alt text strategy — All screens #design/a11y
- [ ] 🔽 A06 Skip navigation links — All screens #design/a11y

---

## 5. Consistency Issues

> [!note] Design System Gaps
> Inconsistencies that should be standardized

- [ ] 🔺 C01 Bottom nav differs guest vs owner — Home vs Dashboard #design/consistency
- [ ] 🔺 C02 "Alerts" vs "Notifications" — Terminology #design/consistency
- [ ] 🔺 C03 Rating format varies — `4.8` vs `4.8★` #design/consistency
- [ ] 🔺 C04 Date format inconsistent — `Oct 12` vs `Oct 12, 2023` #design/consistency
- [ ] 🔺 C05 Currency format varies — `€25` vs `$45.00` #design/consistency
- [ ] 🔼 C06 Back button style — Arrow vs X #design/consistency

---

## 6. Technical Debt

> [!abstract] Missing States
> These patterns should be designed before development

- [ ] 🔺 T01 Loading/skeleton states — Poor perceived performance #design/states
- [ ] 🔺 T02 Pull-to-refresh indicator — Mobile UX expectation #design/states
- [ ] 🔺 T03 Pagination/infinite scroll — Large list handling #design/states
- [ ] 🔺 T04 Image placeholder/broken — Error resilience #design/states
- [ ] 🔺 T05 Form validation errors — Input handling #design/states
- [ ] 🔺 T06 Toast/snackbar notifications — Feedback system #design/states

---

## 7. Task Queries

### All Critical Tasks (P0)

```tasks
not done
description includes ⏫
path includes Design Snag List
```

### All High Priority (P1)

```tasks
not done
description includes 🔺
path includes Design Snag List
limit 10
```

### Completed Tasks

```tasks
done
path includes Design Snag List
```

---

## 8. Recommended Actions

> [!success] Immediate Priorities
> Address these before development sprint begins

### Week 1 - Critical Path

- [ ] 📅 2025-01-05 Design **Sign Up flow** (M01) — Cannot acquire users #sprint/week1
- [ ] 📅 2025-01-05 Design **Lot Selection** (M15) — Booking flow blocked #sprint/week1
- [ ] 📅 2025-01-05 Design **Payment Failed** (M19) — Error handling required #sprint/week1
- [ ] 📅 2025-01-05 Design **List View** (M06) — Accessibility alternative #sprint/week1

### Week 2 - Core Experience

- [ ] 📅 2025-01-12 Design **Filter Modal** (M09) — Search unusable #sprint/week2
- [ ] 📅 2025-01-12 Design **Reviews Screen** (M11) — Social proof needed #sprint/week2
- [ ] 📅 2025-01-12 Design **Notifications List** (M33) — Bell icon non-functional #sprint/week2
- [ ] 📅 2025-01-12 Design **Forgot Password** (M02) — Auth flow complete #sprint/week2

### Week 3 - Polish

- [ ] 📅 2025-01-19 Design **Empty States** (G03) — First-time user experience #sprint/week3
- [ ] 📅 2025-01-19 Design **Loading States** (T01) — Performance perception #sprint/week3
- [ ] 📅 2025-01-19 Resolve **Consistency Issues** (C01-C06) — Design system #sprint/week3
- [ ] 📅 2025-01-19 Complete **Owner Flow** (M36-M40) — B2B experience #sprint/week3

---

## 9. Sign-off Checklist

### MVP Launch Requirements

- [ ] All ⏫ P0 items addressed
- [ ] All 🔺 P1 items addressed
- [ ] Accessibility audit passed
- [ ] Consistency issues resolved
- [ ] Empty states designed
- [ ] Error states designed
- [ ] Loading states designed
- [ ] Developer handoff docs ready

---

## Related Documents

- [[user-flows.canvas|User Flows Canvas]]
- [[Design System]] *(to be created)*
- [[Component Library]] *(to be created)*

---

*Last Updated: 2024-12-29*
