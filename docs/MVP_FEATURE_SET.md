# My Island — MVP Feature Set

> **Canonical definition** of the minimum viable product.
> Last updated: 2026-08-31
>
> Related: [Roadmap](ROADMAP.md) (status & backlog) · [MVP Launch Checklist](MVP_LAUNCH_CHECKLIST.md) (launch readiness)

## Scope & Constraints

- **Market**: Camping / glamping booking for Ireland, plus a local supplier marketplace
- **Users**: Guests, Owners (one property each), Suppliers, Owner/Supplier staff, Platform Admins
- **Payments**: Stripe (guest booking payments in-app; Stripe Connect payouts; subscription billing)
- **Auth**: Email/password with JWT; registration required to book (no guest checkout)
- **Notifications for MVP**: In-app; transactional email provider connection is post-MVP ops
- **Geography**: Broader Ireland (not limited to a single county)

---

## 1. Identity & Access

- Email/password sign-up and sign-in
- Email verification before login
- Password reset (forgot → email link → new password)
- JWT session with role flags (guest, owner, supplier, staff, admin)
- Profile management (name, personal details, security, photo)
- Role upgrade: guest → owner or supplier via onboarding wizards
- Staff invite-before-signup (invited email activates on registration)
- Multi-role users (e.g. owner and supplier on one account)

## 2. Guest Discovery & Booking

- Browse and search campsites (county, property type, dates, guests, featured)
- Campsite detail pages (types, pricing, amenities, gallery, reviews, map)
- Availability calendar at accommodation-type level
- Create booking with date selection and payment authorization
- Auto-assign an available lot of the requested type
- Booking lifecycle: pending payment → pending → confirmed → checked in → completed (plus cancelled / payment failed)
- Trips page: upcoming, past, and cancelled bookings
- Guest cancellation from Trips
- Payment retry after failed authorization
- Saved / favorites (API when signed in; localStorage when anonymous; merge on login)

## 3. Guest Booking Modifications

- Owner-configurable modification policy (allow/deny, deadline before check-in, require approval)
- Guest request to change dates or lot with price-impact preview
- Auto-approve when within policy; otherwise pending owner decision
- Modification audit trail (who, what, when, price impact)

## 4. Payments & Monetization

- Stripe authorize → confirm → capture for guest bookings
- Stripe Connect Express onboarding for owners and suppliers
- Owner subscription (trial + recurring billing + billing portal)
- Supplier subscription (same model)
- Subscription gating for bookings, offers, and analytics (feature-toggleable)
- Featured promotions (timed homepage / marketplace placement with auto-expiry)
- Stripe webhook handling for subscriptions, Connect, and payments

## 5. Owner Portal

- Dashboard KPIs and analytics (bookings, revenue, occupancy)
- Lot CRUD (types, capacity, pricing, amenities, images)
- Booking management (view, confirm/capture, cancel/reject)
- Check-in and check-out
- Today view (arrivals, departures, in-house)
- Month calendar with status colors
- Multi-lot timeline (Gantt-style; blocked periods; navigation ranges)
- Property settings (name, description, location, contact, amenities)
- Seasonal pricing rules and minimum-stay rules
- Date blocking per lot
- Manual booking (walk-ins / phone)
- Owner-initiated booking modifications (dates / lot reassignment)
- Resolve guest modification requests
- Owner preferences (notifications, instant booking, guest verification, modification policy)
- Reviews: view ratings, post a single response
- In-app messaging with guests (conversation list + chat)
- Staff management (invite, roles: Manager, Receptionist, Groundskeeper, Viewer)
- Subscription, Connect onboarding, and billing portal access
- Lot import / export (JSON)

## 6. Supplier Portal & Marketplace

- Supplier profile CRUD (business details, category, location, logo)
- Offer CRUD (discount, validity, claim limits, images, active state)
- Claim tracking (claimed → redeemed / expired)
- Voucher redemption (QR scan + manual code; test claims for dry runs)
- Supplier dashboard metrics (offers, claims, redemptions)
- Supplier reviews and responses
- Supplier preferences (email prefs, marketing opt-in, deactivation)
- Staff management (Manager, Redeemer, Associate)
- Guest marketplace browse by category, claim offer, voucher wallet with QR

## 7. Reviews & Ratings

- Campsite reviews after completed stay (stars + text)
- Supplier reviews after redeemed offer
- Eligibility enforcement (completed booking / redeemed claim)
- One owner or supplier response per review
- Aggregate ratings on listing cards
- Optional AI moderation (feature toggle): pending → approve/reject; admin manual moderate / requeue

## 8. In-App Messaging

- Per-booking threads between guest and owner/staff
- Guest full-page chat from Trips
- Owner conversation dashboard with unread counts
- Polling for new messages; mark-as-read on open
- Messaging only for confirmed / checked-in / completed bookings

## 9. Notifications & Automated Emails

- In-app notification centre (booking, claim, review, modification, check-in/out events)
- Unread badge and mark-as-read
- Pre-arrival email (~2 days before check-in)
- Post-stay review request email (~1 day after checkout)
- Production transactional email provider wiring treated as launch/ops (not a product feature gap)

## 10. Discovery Beyond Stays

- Explore map (campsites, suppliers, points of interest)
- Points of interest by category
- Travel journal (visited / wishlist / favourites + notes)

## 11. Onboarding

- Become a Host wizard (property → lots → amenities/pricing → review → payment)
- Become a Supplier wizard (business → review → payment)

## 12. Media

- Drag-and-drop image upload for lots, offers, suppliers, owners, users
- Multi-image galleries with primary selection and reorder
- Campsite gallery on detail pages

## 13. Platform Admin

- Admin dashboard (users, bookings, revenue/MRR, activity)
- User management (search, filter, activate/deactivate)
- Booking oversight
- Owner and supplier management (create, update, verify, deactivate)
- Review moderation (flag, approve/reject, AI requeue)
- Subscription overview
- Financial reporting (revenue, MRR/ARR, payouts, CSV export)
- Lead CRM (prospects, interactions, scoring, follow-ups)
- Audit log of admin actions
- Feature toggle management
- Support ticket management (status, priority, threaded replies, stats)

## 14. Support

- Authenticated users create support tickets (category, priority, optional booking link)
- Threaded messages between user and admin
- Ticket lifecycle: open → in progress → resolved / closed

## 15. Trust, Legal & Compliance (Launch Surface)

- Privacy policy and terms of service pages
- GDPR cookie consent banner (persisted choice)
- Environment-gated seed/test accounts (not present in production profile)

## 16. Platform Controls

- Public feature-toggle read API for client gating
- `BOOKING_ENABLED` — listing-only mode when off
- `SUBSCRIPTION_ENFORCEMENT` — bypass subscription gates when off
- `REVIEW_AI_MODERATION` — pending AI review vs immediate approve

---

## Explicitly Out of MVP

These are intentional non-goals for the MVP; tracked on the [Roadmap](ROADMAP.md).

### Booking & pricing
- Group / multi-lot reservations under one booking
- Booking extras / add-ons as first-class priced entities
- Hold/reserve with auto-release
- Waitlists
- Weekend / bank-holiday surcharges
- Long-stay and last-minute discount engines

### Owner operations
- Bulk date blocking across many lots
- Recurring annual blocks
- Cleaning / turnover task lists
- Guest-only internal notes on bookings
- Drag-to-create blocks/bookings on the timeline
- Owner CSV/PDF export reports (admin CSV already in MVP)

### Identity & channels
- Social login (Google / Apple / Facebook)
- Full GDPR account deletion / anonymization flow
- SMS notifications
- Browser or mobile push notifications

### Communications & support depth
- Production email provider configuration (ops checklist item)
- System-wide announcements
- Staff activity log as a dedicated product surface

### Platform & clients
- Multi-property owners (MVP: one owner = one property)
- Native mobile apps (responsive web only)
- Full-text / proximity / availability-aware search upgrades
