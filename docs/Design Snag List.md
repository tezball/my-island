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

| Priority | Meaning | Count |
|:--------:|:--------|------:|
| 🔴 P0 | Blocks core user journey | 3 |
| 🟠 P1 | Required for MVP | 24 |
| 🟡 P2 | Important, can follow | 14 |
| 🟢 P3 | Nice to have | 3 |

---

## 1. Missing Screens

### 🔐 Authentication & Onboarding

> [!danger] Critical Gap
> No sign-up flow exists - cannot acquire new users

| Status | ID | Screen | Priority | Notes |
|:------:|:---|:-------|:--------:|:------|
| ⬜ | M01 | **Sign Up / Registration** | 🔴 P0 | Login has "Sign Up" link but no flow |
| ⬜ | M02 | Forgot Password | 🟠 P1 | Link exists, no reset screens |
| ⬜ | M03 | Email Verification | 🟠 P1 | No OTP/confirmation screen |
| ⬜ | M04 | Password Reset Confirmation | 🟠 P1 | Success state after reset |
| ⬜ | M05 | Onboarding Permissions | 🟡 P2 | Location/notification requests |

### 🔍 Discovery & Search

| Status | ID | Screen | Priority | Notes |
|:------:|:---|:-------|:--------:|:------|
| ⬜ | M06 | **List View** | 🟠 P1 | Toggle exists but no design |
| ⬜ | M07 | Search Results | 🟠 P1 | No results state shown |
| ⬜ | M08 | Empty Search State | 🟡 P2 | No results handling |
| ⬜ | M09 | **Filter Modal/Sheet** | 🟠 P1 | Buttons shown, no expanded UI |
| ⬜ | M10 | Map Cluster Drill-down | 🟡 P2 | Cluster pins need expansion |

### 🏕️ Campsite Details

> [!warning] Booking Flow Blocked
> Users cannot select specific lots (tent/RV/cabin) - core booking incomplete

| Status | ID | Screen | Priority | Notes |
|:------:|:---|:-------|:--------:|:------|
| ⬜ | M11 | **Reviews List** | 🟠 P1 | "See all reviews" link exists |
| ⬜ | M12 | Photo Gallery | 🟠 P1 | No full gallery view |
| ⬜ | M13 | All Suppliers View | 🟡 P2 | "View All" link exists |
| ⬜ | M14 | Supplier Detail | 🟡 P2 | Cards shown, no detail |
| ⬜ | M15 | **Lot Selection** | 🔴 P0 | How do users pick lots? |
| ⬜ | M16 | Availability Calendar | 🟠 P1 | No calendar UI designed |

### 💳 Booking & Payment

| Status | ID | Screen | Priority | Notes |
|:------:|:---|:-------|:--------:|:------|
| ⬜ | M17 | Payment Method Selection | 🟠 P1 | "Change" link exists |
| ⬜ | M18 | Add Payment Method | 🟠 P1 | How to add new cards? |
| ⬜ | M19 | **Payment Failed** | 🔴 P0 | No error state |
| ⬜ | M20 | Booking Failed | 🟠 P1 | Completion failure state |
| ⬜ | M21 | Promo Code Entry | 🟡 P2 | No discount functionality |

### 📋 Booking Management

| Status | ID | Screen | Priority | Notes |
|:------:|:---|:-------|:--------:|:------|
| ⬜ | M22 | Booking Detail View | 🟠 P1 | No expanded booking detail |
| ⬜ | M23 | Modification Success | 🟠 P1 | No final success state |
| ⬜ | M24 | Check-in Instructions | 🟠 P1 | Arrival details missing |
| ⬜ | M25 | Contact Host | 🟠 P1 | No messaging feature |
| ⬜ | M26 | Booking Receipt | 🟡 P2 | No downloadable invoice |

### 👤 User Profile

| Status | ID | Screen | Priority | Notes |
|:------:|:---|:-------|:--------:|:------|
| ⬜ | M27 | Edit Profile Form | 🟠 P1 | Button exists, no form |
| ⬜ | M28 | Personal Info | 🟠 P1 | Listed but no screen |
| ⬜ | M29 | Payment Methods List | 🟠 P1 | Listed but no screen |
| ⬜ | M30 | Linked Accounts | 🟡 P2 | Listed but no screen |
| ⬜ | M31 | Support & Help | 🟡 P2 | Listed but no screen |
| ⬜ | M32 | Language Selection | 🟢 P3 | Listed but no screen |

### 🔔 Notifications

| Status | ID | Screen | Priority | Notes |
|:------:|:---|:-------|:--------:|:------|
| ⬜ | M33 | **Notifications List** | 🟠 P1 | Bell icon but no screen |
| ⬜ | M34 | Notification Detail | 🟡 P2 | Tap action undefined |
| ⬜ | M35 | Supplier Alert Detail | 🟡 P2 | Alert content undefined |

### 🏠 Owner/Admin

| Status | ID | Screen | Priority | Notes |
|:------:|:---|:-------|:--------:|:------|
| ⬜ | M36 | Owner Bookings List | 🟠 P1 | Nav shows but no screen |
| ⬜ | M37 | Owner Booking Detail | 🟠 P1 | How owner manages booking |
| ⬜ | M38 | Broadcast Confirmation | 🟡 P2 | Post-send state |
| ⬜ | M39 | Owner Settings | 🟡 P2 | Button exists, no screen |
| ⬜ | M40 | Revenue Dashboard | 🟡 P2 | No detailed financials |

### ⚠️ Error & Edge States

| Status | ID | Screen | Priority | Notes |
|:------:|:---|:-------|:--------:|:------|
| ⬜ | M41 | Network Error | 🟠 P1 | No offline state |
| ⬜ | M42 | Generic Error (500) | 🟠 P1 | Server error handling |
| ⬜ | M43 | Session Expired | 🟡 P2 | Token expiry handling |
| ⬜ | M44 | Maintenance Mode | 🟢 P3 | Scheduled downtime |

---

## 2. Flow Gaps

> [!question] Critical Flows Missing
> Several major user journeys have no design coverage

| Status | ID | Gap | Impact | Recommendation |
|:------:|:---|:----|:------:|:---------------|
| ⬜ | G01 | **Guest → Owner transition** | 🔴 High | No campsite listing onboarding |
| ⬜ | G02 | **Supplier onboarding** | 🔴 High | Suppliers shown, can't register |
| ⬜ | G03 | First-time empty states | 🟠 Medium | No favorites/bookings empty UI |
| ⬜ | G04 | Deep linking | 🟠 Medium | Shared links behavior undefined |
| ⬜ | G05 | Push → Screen mapping | 🟠 Medium | Notification destinations |
| ⬜ | G06 | Modification rules | 🟠 Medium | What can/can't be modified? |
| ⬜ | G07 | Multi-lot booking | 🟢 Low | Single transaction for multiple |
| ⬜ | G08 | Group booking | 🟢 Low | Large reservation support |

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

| Status | ID | Issue | Screen(s) | Severity |
|:------:|:---|:------|:----------|:--------:|
| ⬜ | A01 | Green badge color contrast | Multiple | 🟠 Medium |
| ⬜ | A02 | Map keyboard navigation | Home Map | 🔴 High |
| ⬜ | A03 | Toggle focus states | Profile, Detail | 🟠 Medium |
| ⬜ | A04 | Filter chip touch targets | Home Map | 🟠 Medium |
| ⬜ | A05 | Skip navigation links | All | 🟢 Low |
| ⬜ | A06 | Image alt text strategy | All | 🟠 Medium |

---

## 5. Consistency Issues

> [!note] Design System Gaps
> Inconsistencies that should be standardized

| Status | ID | Issue | Examples |
|:------:|:---|:------|:---------|
| ⬜ | C01 | Bottom nav differs guest vs owner | Home vs Dashboard |
| ⬜ | C02 | "Alerts" vs "Notifications" | Terminology |
| ⬜ | C03 | Rating format varies | `4.8` vs `4.8★` |
| ⬜ | C04 | Date format inconsistent | `Oct 12` vs `Oct 12, 2023` |
| ⬜ | C05 | Currency format varies | `€25` vs `$45.00` |
| ⬜ | C06 | Back button style | Arrow vs X |

---

## 6. Technical Debt

> [!abstract] Missing States
> These patterns should be designed before development

| Status | ID | Missing Pattern | Impact |
|:------:|:---|:----------------|:-------|
| ⬜ | T01 | Loading/skeleton states | Poor perceived performance |
| ⬜ | T02 | Pull-to-refresh indicator | Mobile UX expectation |
| ⬜ | T03 | Pagination/infinite scroll | Large list handling |
| ⬜ | T04 | Image placeholder/broken | Error resilience |
| ⬜ | T05 | Form validation errors | Input handling |
| ⬜ | T06 | Toast/snackbar notifications | Feedback system |

---

## 7. Recommended Actions

> [!success] Immediate Priorities
> Address these before development sprint begins

### Week 1 - Critical Path
- [ ] Design **Sign Up flow** (M01) — Cannot acquire users
- [ ] Design **Lot Selection** (M15) — Booking flow blocked
- [ ] Design **Payment Failed** (M19) — Error handling required
- [ ] Design **List View** (M06) — Accessibility alternative

### Week 2 - Core Experience
- [ ] Design **Filter Modal** (M09) — Search unusable
- [ ] Design **Reviews Screen** (M11) — Social proof needed
- [ ] Design **Notifications List** (M33) — Bell icon non-functional
- [ ] Design **Forgot Password** (M02) — Auth flow complete

### Week 3 - Polish
- [ ] Design **Empty States** (G03) — First-time user experience
- [ ] Design **Loading States** (T01) — Performance perception
- [ ] Resolve **Consistency Issues** (C01-C06) — Design system
- [ ] Complete **Owner Flow** (M36-M40) — B2B experience

---

## 8. Sign-off Checklist

### MVP Launch Requirements

- [ ] All 🔴 P0 items addressed
- [ ] All 🟠 P1 items addressed
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
