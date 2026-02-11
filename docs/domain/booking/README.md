# Booking

## Status
Implemented

## Overview
Handles the full reservation lifecycle from creation through payment, confirmation, check-in/out, and completion. Integrates with Stripe for payment authorization and capture using manual capture mode.

## Key Entities

- **Booking** — A reservation linking a guest (User) to a Lot for specific dates. Tracks booking status, payment status, Stripe payment intent ID, guest count, pricing breakdown, and special requests.
- **BookingModificationLog** — Audit trail for in-place booking modifications. Records who modified, what changed (dates/lot), previous and new values, price adjustment, and optional reason.

## Booking Status Lifecycle

```
PENDING_PAYMENT → PENDING → CONFIRMED → CHECKED_IN → COMPLETED
                     ↓           ↓
                 CANCELLED    CANCELLED
      ↓
 PAYMENT_FAILED
```

| Status | Description |
|--------|-------------|
| `PENDING_PAYMENT` | Booking created, awaiting guest payment |
| `PENDING` | Payment authorized, awaiting owner confirmation |
| `CONFIRMED` | Owner confirmed (or auto-confirmed), payment captured |
| `CHECKED_IN` | Guest has checked in |
| `COMPLETED` | Stay completed, guest checked out |
| `CANCELLED` | Booking cancelled (authorization released if applicable) |
| `PAYMENT_FAILED` | Payment authorization failed |

See [PAYMENT_FLOW.md](./PAYMENT_FLOW.md) for full payment integration details.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/bookings` | Create booking (guest) |
| GET | `/api/bookings/my` | Get guest's bookings |
| GET | `/api/bookings/{id}` | Get booking details |
| POST | `/api/bookings/{id}/cancel` | Cancel booking |
| GET | `/api/owner/bookings` | Get owner's bookings |
| POST | `/api/owner/bookings` | Create manual booking (owner) |
| POST | `/api/owner/bookings/{id}/confirm` | Confirm booking (captures payment) |
| POST | `/api/owner/bookings/{id}/reject` | Reject booking (releases auth) |
| POST | `/api/owner/bookings/{id}/check-in` | Record guest check-in |
| PUT | `/api/owner/bookings/{id}/modify` | Modify booking dates or lot (CONFIRMED/CHECKED_IN only) |
| POST | `/api/owner/bookings/{id}/check-out` | Record guest check-out |
| POST | `/api/payments/{bookingId}/create-intent` | Create Stripe payment intent |
| POST | `/api/payments/{bookingId}/confirm-authorization` | Confirm card authorization |

## Frontend Pages

- **BookingModal** — Date selection, guest count, pricing preview, payment form
- **TripsPage** — Guest's booking history and upcoming trips
- **OwnerBookingsPage** — Manage incoming bookings (confirm/reject, check-in/out)
- **OwnerTodayPage** — Today's arrivals and departures

## Schedulers

- **BookingAutoCompleteScheduler** — Auto-completes bookings after checkout date passes
- **BookingCleanupScheduler** — Cleans up stale `PENDING_PAYMENT` bookings
- **PreArrivalEmailScheduler** — Sends pre-arrival email to guests 2 days before check-in (daily at 9 AM, ShedLock protected)

## Booking Modifications

Owners can modify CONFIRMED or CHECKED_IN bookings in-place (dates and/or lot assignment) without cancelling and rebooking. This preserves the booking record and audit trail.

**Modifiable fields:** check-in date, check-out date, lot assignment (same owner only)

**Blocked scenarios:**
- Bookings with `paymentStatus=AUTHORIZED` — owner must confirm or cancel first
- Statuses other than CONFIRMED or CHECKED_IN
- CHECKED_IN bookings cannot have check-in moved to a future date

**Pricing:** Total price is recalculated using seasonal pricing rules. For `paymentStatus=NONE` (manual bookings), service fee and charge total are also recalculated. For `paymentStatus=CAPTURED`, only totalPrice is updated; the price difference is logged for offline settlement.

**Audit:** Every modification creates a `BookingModificationLog` entry recording previous/new values, price adjustment, modifier, and optional reason.

## Implementation Notes
- All payments use Stripe manual capture: authorize first, capture on confirmation.
- Instant booking campsites auto-confirm and auto-capture immediately after authorization.
- Manual approval campsites hold the authorization until the owner confirms or rejects.
- Frontend uses a dual-update mechanism: REST call + webhook fallback for payment confirmation.
