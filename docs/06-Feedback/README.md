---
title: Feedback
type: MOC
status: active
---

# Feedback & Issues

> Bug tracking and quality assurance for my-island

---

## Active Issues

**[[../01-Project-Management/SNAG_LIST|Snag List]]** - Current bugs from E2E testing (2026-01-04)

---

## Test Accounts

| User | Email | Password | Role |
|------|-------|----------|------|
| Visitor | visitor@my-island.com | demo1234 | Guest |
| Owner | owner@my-island.com | demo1234 | Campsite management |
| Supplier | supplier@my-island.com | demo1234 | Offers management |

---

## Testing Checklist

### Guest Flows
- [x] Browse campsites
- [x] Search with filters
- [x] View campsite details
- [ ] Complete booking (buttons broken)
- [ ] Modify booking
- [ ] Cancel booking
- [ ] Submit review

### Auth Flows
- [ ] Login (API failing)
- [ ] Signup
- [ ] Demo mode

### Owner Flows
- [ ] Dashboard - blocked by login
- [ ] Manage lots - blocked by login
- [ ] View bookings - blocked by login

### Supplier Flows
- [ ] Dashboard - blocked by login
- [ ] Manage offers - blocked by login

---

## Reporting Issues

When reporting issues, include:
1. Page/route where issue occurs
2. Steps to reproduce
3. Expected vs actual behavior
4. Browser console errors (if any)

---

## Related Links

- [[../README|Docs Home]]
- [[../01-Project-Management/README|Project Management]]
- [[../04-User-Flows/README|User Flows]]
