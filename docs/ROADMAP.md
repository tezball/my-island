# My Island — Roadmap

## MVP Feature List (Launch Readiness)

These are the remaining features needed before launch. Items are ordered by priority.

### Must Have (Launch Blockers)

| #   | Feature                         | Status | Notes                                                                                                                              |
| --- | ------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Stripe payment integration**  | DONE   | Manual capture flow (authorize → confirm → capture), Stripe Connect payouts, webhook handling, subscriptions                       |
| 2   | **Automated pre-arrival email** | TODO   | Confirmation + directions sent to guests before arrival (booking creation/confirmation emails exist, but no pre-arrival scheduler) |
| 3   | **Lot status lifecycle**        | DONE   | PENDING_PAYMENT → PENDING → CONFIRMED → CHECKED_IN → COMPLETED (+ CANCELLED, PAYMENT_FAILED)                                       |
| 4   | **Booking modifications**       | TODO   | Change dates or move guest to different lot without cancel/rebook                                                                  |
| 5   | **Staff accounts with roles**   | DONE   | Preset roles (Manager, Receptionist, Groundskeeper, Viewer, Associate, Redeemer) with per-section ACL                              |

### Should Have (Post-Launch Priority)

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 6 | **Minimum stay rules** | TODO | Per lot type or per season (e.g., glamping: 2-night min in summer) |
| 7 | **Multi-lot timeline view** | TODO | Gantt-style horizontal timeline — lots as rows, bookings as bars |
| 8 | **Cleaning task list** | TODO | Auto-generated list of lots needing turnover after checkout |
| 9 | **Group bookings** | TODO | Book multiple lots under one reservation |
| 10 | **Bulk date blocking** | TODO | Select multiple lots at once and block a date range |
| 11 | **Review moderation** | TODO | Flag/report inappropriate reviews |
| 12 | **In-app messaging** | TODO | Thread between owner/staff and guest, tied to a booking |

### Nice to Have (Future)

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 13 | **Weekend/bank holiday surcharge** | TODO | Automatic price uplift for Fri/Sat or specified dates |
| 14 | **Last-minute discounts** | TODO | Auto-discount lots not booked within X days |
| 15 | **Long-stay discounts** | TODO | Percentage off for 7/14/28+ night bookings |
| 16 | **Hold/reserve with auto-release** | TODO | Tentatively hold a lot for phone enquiry, auto-release after 24-48h |
| 17 | **Recurring blocks** | TODO | Annual recurring blocks (e.g., field closed every March) |
| 18 | **Post-stay review request** | TODO | Auto-email after checkout asking for review |
| 19 | **SMS notifications** | TODO | Optional SMS for booking confirmations and arrival reminders |
| 20 | **Activity log** | TODO | Track staff actions — "Sarah confirmed booking #234" |
| 21 | **Drag-to-block on timeline** | TODO | Click and drag on timeline to create block or booking |
| 22 | **Week/month toggle on calendar** | TODO | Switch between week (detailed) and month (overview) |
| 23 | **Guest notes** | TODO | Internal notes on bookings visible only to staff |
| 24 | **Waitlist** | TODO | Guests join waitlist when lot type is full, notified on cancellation |
| 25 | **Export/reports** | TODO | Download bookings as CSV, monthly revenue PDF |

---

## What's Already Done

For reference, these features are implemented and working:

| Feature | Category |
|---------|----------|
| Stripe payment (authorize/capture/refund/payout) | Payments |
| Booking status lifecycle (7 states with transitions) | Booking |
| Auto-assign available lot of same type on booking | Booking |
| Type-level availability calendar (red only when ALL lots booked) | Booking |
| Booking confirmation + confirmed emails to guest/owner | Notifications |
| Manual booking creation (owner-side) | Staff & Direct Bookings |
| Walk-in / phone booking flag | Staff & Direct Bookings |
| Check-in action | Check-in / Check-out |
| Check-out action | Check-in / Check-out |
| Today's arrivals/departures view | Check-in / Check-out |
| Block dates on a lot | Date Blocking |
| Seasonal pricing rules | Pricing |
| Guest reviews (star + text) | Reviews & Ratings |
| Owner response to reviews | Reviews & Ratings |
| Aggregate rating display | Reviews & Ratings |
| Calendar color coding by status | Calendar |
| 14-day free trial + subscription onboarding | Billing |
| Image upload system (lots, offers, suppliers) | Media |
| Supplier marketplace + offer management | Marketplace |
| Explore map | Discovery |
| Staff accounts with preset roles | Staff & Permissions |
| Role-based sidebar/page ACL (owner + supplier) | Staff & Permissions |
| Staff invite with role selector | Staff & Permissions |
| Inline role editing on staff management page | Staff & Permissions |
