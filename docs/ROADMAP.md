# My Island — Product Roadmap

> Last updated: 2026-02-12

## Platform Summary

My Island is a camping/glamping booking platform for Ireland with an integrated local supplier marketplace. The platform serves four user types: **Guests** (browse & book), **Owners** (manage properties & bookings), **Suppliers** (promote local offers), and **Platform Admins** (oversee the entire system).

---

## What's Built (Shipped)

### Core Booking Experience

| Feature | Details |
|---------|---------|
| Campsite browsing & search | County filter, property type filter, date/guest search, featured listings |
| Campsite detail pages | Accommodation types, pricing, amenity lists, photo gallery, reviews, map |
| Booking flow | Select dates via availability calendar, authorize payment, receive confirmation |
| Booking lifecycle | PENDING_PAYMENT → PENDING → CONFIRMED → CHECKED_IN → COMPLETED (+ CANCELLED, PAYMENT_FAILED) |
| Auto-assign lot | System picks an available lot of the requested type on booking |
| Type-level availability | Calendar shows unavailable only when ALL lots of a type are booked |
| Trips page | Guest views upcoming, past, and cancelled bookings with status badges and detail modals |
| Booking cancellation | Guest can cancel from Trips page |

### Payments & Subscriptions

| Feature | Details |
|---------|---------|
| Stripe payment integration | Authorize → confirm → capture flow with payment intents |
| Stripe Connect | Express onboarding for Owners and Suppliers to receive payouts |
| Owner subscriptions | 14-day free trial, Stripe billing portal, subscription gating |
| Supplier subscriptions | Same trial + billing model as owners |
| Featured promotions | 7-day (€9.99) or 30-day (€29.99) homepage/marketplace placement with auto-expiry |
| Payment retry | Guest can retry failed payment authorization |
| Webhook handling | Subscription lifecycle, Connect account updates, payment events |

### Owner Portal (13 pages)

| Feature | Details |
|---------|---------|
| Dashboard | KPI cards, booking/revenue/occupancy analytics charts |
| Lot management | CRUD lots with images, amenities, capacity, pricing |
| Booking management | View all bookings, confirm (capture payment), cancel/reject |
| Check-in / check-out | Record guest arrivals and departures |
| Today view | Today's arrivals, departures, and in-house guests |
| Calendar | Month view with color-coded booking status |
| Property settings | Edit campsite name, description, location, contact, amenities |
| Pricing rules | Seasonal pricing (date range + price override per lot type) |
| Minimum stay rules | Per-lot minimum night requirement (default 1). Seasonal pricing rules can override the minimum stay for their date range. Enforced at booking creation and modification. |
| Date blocking | Block individual lots for maintenance or personal use |
| Manual booking | Create bookings for walk-ins, phone enquiries |
| Booking modifications (owner) | Change dates or reassign lot, with modification audit log |
| Guest modification requests | View, approve, or decline guest-initiated change requests |
| Owner preferences | Notification settings, instant booking toggle, guest verification, modification policy (allow/deadline/approval) |
| Reviews | View guest reviews with aggregate ratings, post owner responses |
| Messages | Conversation list with unread counts, latest message preview, and inline chat panel |
| Staff management | Invite staff by email, assign roles (Manager, Receptionist, Groundskeeper, Viewer), inline role editing |
| Subscription & billing | Subscription status, Stripe Connect onboarding, billing portal access |

### Guest Booking Modifications

| Feature | Details |
|---------|---------|
| Modification policy | Owner-configurable: allow/disallow, deadline (days before check-in), require approval |
| Guest modify flow | Modal to request date/lot changes with price impact preview |
| Auto-approve | Changes within policy are applied immediately without owner involvement |
| Approval flow | Changes requiring approval create a pending request for the owner to resolve |
| Modification tracking | Full audit log of all booking changes (who, what, when, price impact) |

### Supplier Portal (7 pages)

| Feature | Details |
|---------|---------|
| Dashboard | Offer performance metrics, claim stats |
| Offer management | CRUD offers with images, categories, validity dates, claim limits |
| Claim tracking | View all claims per offer, claim status (CLAIMED → REDEEMED → EXPIRED) |
| Voucher redemption | QR scanner page for in-person redemption, manual code entry |
| Test claims | Create/reset test claims for verifying redemption flow |
| Supplier profile | Edit business details, location, contact info |
| Supplier reviews | View customer reviews, post responses |
| Supplier preferences | Email notification settings, weekly reports, marketing opt-in, account deactivation |
| Staff management | Invite staff (Manager, Redeemer, Associate roles) |
| Subscription & billing | Same model as owners |

### Platform Admin Portal (15 pages)

| Feature | Details |
|---------|---------|
| Dashboard | KPIs (users, bookings, revenue, MRR), activity feed, booking breakdown chart, revenue trend |
| User management | Search, filter, view details, activate/deactivate accounts |
| Booking management | Search, filter, view booking details and status analytics |
| Owner management | Search, verify owners, subscription overview, owner details |
| Supplier management | Search, verify suppliers, subscription overview, supplier details |
| Review moderation | Flag/unflag inappropriate reviews, search, filter |
| Subscription overview | Active/trial/cancelled counts, revenue breakdown |
| Financial reporting | Revenue reports, MRR, ARR, payout reports, CSV export |
| Lead CRM | Track prospective owners/suppliers, log interactions (call/email/meeting/note), scoring, follow-up scheduling |
| Audit log | Complete trail of all admin actions with entity snapshots (before/after) |

### Reviews & Ratings

| Feature | Details |
|---------|---------|
| Campsite reviews | Star rating + text review after completed stay |
| Supplier reviews | Star rating + text review after redeemed offer |
| Review eligibility | Enforced — must have completed booking or redeemed offer |
| Owner/supplier response | Single response per review |
| Aggregate ratings | Calculated and displayed on campsite/supplier cards |
| Admin moderation | Flag/unflag reviews from the admin portal |

### Discovery & Marketplace

| Feature | Details |
|---------|---------|
| Explore map | Leaflet map with campsite, supplier, and POI markers |
| Points of interest | Browse by category (castles, beaches, hiking, waterfalls, etc.) |
| Travel journal | Track visited/wishlist/favourite POIs with personal notes |
| Marketplace | Browse supplier offers by category, claim offers, receive voucher codes |
| Voucher wallet | View claimed vouchers with QR codes for redemption |
| Saved/favorites | Save lots to favorites with dual-mode persistence (API for authenticated users, localStorage for anonymous). On login, localStorage favorites are merged to backend via bulk endpoint. |

### Identity & Auth

| Feature | Details |
|---------|---------|
| Email/password auth | Sign up, sign in, JWT-based session |
| Email verification | Token-based email confirmation flow |
| Password reset | Forgot password → email link → set new password |
| Profile management | Edit name, personal details, security settings |
| Profile photo | Upload during sign-up |
| Role upgrades | Guest can become Owner or Supplier via onboarding wizards |
| Staff access | Invite-before-signup flow — invited emails auto-activate on sign-up |
| Test account dropdown | Dev convenience — auto-fill credentials on sign-in page |

### In-App Messaging

| Feature | Details |
|---------|---------|
| Per-booking message threads | Guest and owner/staff exchange messages tied to a booking |
| Guest messages page | Full-page chat view at `/trips/{bookingId}/messages`, linked from Trips page for confirmed/checked-in bookings |
| Owner messages dashboard | Conversation list at `/owner/messages` with unread counts, latest message preview, and inline chat panel |
| Real-time polling | Chat UI polls every 15 seconds for new messages, auto-scrolls to newest |
| Read tracking | Messages auto-marked as read when the recipient opens the conversation |

### Notifications

| Feature | Details |
|---------|---------|
| In-app notifications | Real-time event-driven (booking created/confirmed/cancelled, check-in/out, modifications, reviews, claims, redemptions) |
| Notification centre | View all, unread count badge, mark as read |
| Pre-arrival email | Automated 2 days before check-in with booking details, directions, marketplace CTA |

### Post-Stay Engagement

| Feature | Details |
|---------|---------|
| Post-stay review request email | Automated email 1 day after checkout prompting guest to leave a review. Daily scheduler at 10 AM (ShedLock protected). Skips bookings with existing review or already-sent email (`reviewEmailSentAt` tracking). Uses `post-stay-review.html` template. |

### Onboarding Wizards

| Feature | Details |
|---------|---------|
| Become a Host | 6-step wizard: property type → details → lot configuration → amenities & pricing → review → payment |
| Become a Supplier | 4-step wizard: business type → details → review → payment |

### Media & Images

| Feature | Details |
|---------|---------|
| Image upload system | Drag-and-drop upload for lots, offers, suppliers, owners, users |
| Multi-image support | Multiple images per entity with primary image selection and reordering |
| Gallery viewer | Campsite image gallery on detail pages |

### Infrastructure & Quality

| Feature | Details |
|---------|---------|
| Kafka event system | Spring ApplicationEvents → Kafka topics (booking-events, offer-events, user-events) |
| Distributed scheduling | ShedLock for job deduplication (pre-arrival emails, post-stay review emails, featured expiry) |
| E2E test suite | Playwright with 129 tests across 21 spec files (auth, browsing, navigation, booking flow, trips, owner portal, supplier portal, admin portal, review flow, minimum stay, saved favorites, messaging, booking cancel, owner check-in, booking modifications, date blocking, review submit, notifications, marketplace claims, owner settings) |
| Video recording | Every E2E test run produces video recordings for visual review |

---

## What's Next (Prioritised Backlog)

### P0 — Launch Blockers

Nothing. All MVP-blocking features are shipped. The platform is **launch-ready** from a feature perspective.

Pre-launch checklist items (not features):
- Production environment deployment
- Real Stripe keys (switch from test mode)
- Domain + SSL setup
- Seed data cleanup (remove test accounts)
- Privacy policy & terms of service pages
- GDPR cookie consent

### P1 — High Value (Post-Launch Sprint 1)

| # | Feature | Category | Notes |
|---|---------|----------|-------|
| 1 | ~~**Post-stay review emails**~~ | Engagement | **Done.** Automated email 1 day after checkout prompting guest to leave a review. Daily scheduler with ShedLock. |
| 2 | ~~**Minimum stay rules**~~ | Pricing | **Done.** Per-lot minimum night requirement with seasonal pricing override. Enforced at booking creation and modification. |
| 3 | ~~**Persisted saved/favorites**~~ | Discovery | **Done.** Dual-mode persistence (API for authenticated, localStorage for anonymous). Merge on login via bulk endpoint. |
| 4 | ~~**In-app messaging**~~ | Communication | **Done.** Per-booking message threads between guests and owners. Guest messages page, owner conversation dashboard with inline chat. |
| 5 | **Email delivery** | Notifications | Connect transactional email provider (e.g., Resend, SES) for booking confirmations, cancellations, and owner alerts. Currently notifications are in-app only. |

### P2 — High Value (Post-Launch Sprint 2)

| # | Feature | Category | Notes |
|---|---------|----------|-------|
| 1 | **Multi-lot timeline view** | Owner UX | Gantt-style horizontal timeline — lots as rows, bookings as bars. Critical for larger parks with 20+ lots. |
| 2 | **Group bookings** | Booking | Book multiple lots under one reservation (families, events). |
| 3 | **Bulk date blocking** | Owner UX | Select multiple lots at once and block a date range. Currently one lot at a time. |
| 4 | **Weekend/bank holiday surcharge** | Pricing | Automatic price uplift for Fri/Sat or specified dates. Common revenue pattern for Irish parks. |
| 5 | **Long-stay discounts** | Pricing | Percentage off for 7/14/28+ night bookings. Encourages longer stays in shoulder season. |

### P3 — Nice to Have (Future Sprints)

| # | Feature | Category | Notes |
|---|---------|----------|-------|
| 1 | **Last-minute discounts** | Pricing | Auto-discount lots not booked within X days of date. Fills last-minute gaps. |
| 2 | **Hold/reserve with auto-release** | Booking | Tentatively hold a lot for phone enquiry, auto-release after 24-48h if not converted. |
| 3 | **Cleaning task list** | Operations | Auto-generated list of lots needing turnover after checkout. Assign to groundskeeping staff. |
| 4 | **Recurring blocks** | Owner UX | Annual recurring blocks (e.g., field closed every March for maintenance). |
| 5 | **SMS notifications** | Notifications | Optional SMS for booking confirmations and arrival reminders. |
| 6 | **Staff activity log** | Staff & Permissions | Track staff actions — "Sarah confirmed booking #234". Uses existing audit log infrastructure. |
| 7 | **Guest notes** | Booking | Internal notes on bookings visible only to owner/staff. Not shown to guest. |
| 8 | **Waitlist** | Booking | Guests join waitlist when a lot type is full, notified on cancellation. |
| 9 | **Booking extras** | Booking | Add-on services (electric hookup, firewood, bike rental) priced per night or per stay. Frontend has a hardcoded hookup option but no backend entity. |
| 10 | **Export / reports** | Owner UX | Download bookings as CSV, monthly revenue PDF. Admin portal already has CSV export. |
| 11 | **Drag-to-block on timeline** | Owner UX | Click and drag on timeline to create block or booking. Requires P2 #1 (timeline view) first. |
| 12 | **Week/month toggle on calendar** | Owner UX | Switch between week (detailed) and month (overview) calendar views. |
| 13 | **Social login** | Identity | Google, Apple, Facebook OAuth. LinkedAccount entity planned but not built. |
| 14 | **Account deletion** | Identity | GDPR right to be forgotten. Delete account and anonymize associated data. |
| 15 | **Support tickets** | Support | Guest/owner support ticket system with staff response thread. Entities designed but not built. |
| 16 | **Push notifications** | Notifications | Browser push and/or mobile push for booking alerts. |

---

## Architecture Debt & Tech Improvements

| Item | Priority | Notes |
|------|----------|-------|
| Transactional email provider | P1 | No email delivery beyond pre-arrival and post-stay review schedulers |
| Domain model doc accuracy | Done (this update) | Review and Notification modules were marked "Not Yet Built" — they are built |
| Staff role ACL enforcement | P2 | Roles exist but per-section access control is not enforced (all staff see everything) |
| Image storage | P3 | Currently S3-compatible (LocalStack dev). Need production S3 bucket + CDN |
| Search improvements | P3 | Full-text search, proximity search, availability-aware search |
| Mobile app | Future | React Native or PWA. Current frontend is mobile-responsive. |

---

## Completed Milestones

| Date | Milestone |
|------|-----------|
| 2026-01 | Core platform: booking flow, payments, owner/supplier portals |
| 2026-01 | Stripe Connect payouts, subscription billing, featured promotions |
| 2026-02 | Staff accounts with preset roles and invite flow |
| 2026-02 | Platform admin portal (15 pages, lead CRM, audit log, financial reports) |
| 2026-02 | Booking modifications (owner + guest with configurable approval policy) |
| 2026-02 | Supplier preferences and notification settings |
| 2026-02 | Post-stay review request emails (automated 1 day after checkout) |
| 2026-02 | Minimum stay rules (per-lot default + seasonal pricing override) |
| 2026-02 | E2E test suite (129 Playwright tests across 21 spec files with video recording) |
| 2026-02 | Persisted saved/favorites with dual-mode persistence (API + localStorage merge on login) |
| 2026-02 | In-app messaging: per-booking guest-owner threads with conversation dashboard |
