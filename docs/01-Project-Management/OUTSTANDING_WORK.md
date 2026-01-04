# MVP Outstanding Work

**Status:** ~75% Complete
**Last Updated:** 2026-01-04

---

## Current Issues

See **[[SNAG_LIST]]** for the active bug/issue tracker from E2E testing.

---

## Remaining MVP Work

### Authentication
- [ ] Fix login API (currently failing)
- [ ] Verify demo mode works with backend
- [ ] Test protected route redirects

### Booking Flow
- [ ] Fix "Book Now" / "Check Dates" button handlers
- [ ] Test complete booking flow end-to-end
- [ ] Verify payment integration (Stripe)

### Images
- [ ] Fix broken offer images
- [ ] Fix broken lot images (Atlantic Yurt, Sky Treehouse)
- [ ] Verify S3/LocalStack image serving

### Map Feature
- [ ] Fix map marker popup interaction
- [ ] Test map-to-campsite-detail navigation

### Owner Portal
- [ ] Re-test after login is fixed
- [ ] Verify stats API integration
- [ ] Test campsite/lot management CRUD

### Supplier Portal
- [ ] Re-test after login is fixed
- [ ] Test offer management

---

## Backend API Status

**12 Controllers Implemented** - All core endpoints exist:
- Auth, Users, Campsites, Lots, Bookings, Reviews
- Favorites, Notifications, Owner, Offers, Support, Images

**Missing Endpoints:**
- `PATCH /api/bookings/{id}` - Modify booking
- `POST /api/auth/forgot-password` - Password reset
- `POST /api/auth/verify-email` - Email verification

---

## Feature Flags

```env
VITE_API_URL=http://localhost:8080/api
VITE_USE_REAL_API=true
```

---

## Quick Reference

| Resource | Location |
|----------|----------|
| Domain Model | [[02-Architecture/DOMAIN_MODEL]] |
| User Flows | [[04-User-Flows/user-flows]] |
| Tech Stack | [[02-Architecture/tech-stack]] |
| Test Accounts | V22__add_demo_accounts.sql |
