# Booking

## Status
Implemented

## Overview
Handles the full reservation lifecycle from creation through payment, confirmation, check-in/out, and completion. Integrates with Stripe for payment authorization and capture using manual capture mode.

## Key Entities

- **Booking** — A reservation linking a guest (User) to a Lot for specific dates. Tracks booking status, payment status, Stripe payment intent ID, guest count, pricing breakdown, and special requests.
- **BookingModificationLog** — Audit trail for in-place booking modifications. Records who modified, what changed (dates/lot), previous and new values, price adjustment, reason, and initiator (OWNER or GUEST).
- **BookingModificationRequest** — Guest-initiated modification request requiring owner approval. Status: PENDING → APPROVED/DECLINED/CANCELLED. Stores proposed changes (lot, dates, power), price preview, and resolution metadata.

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
| GET | `/api/bookings/{id}/modification-policy` | Get guest modification policy for booking |
| PUT | `/api/bookings/{id}/modify` | Guest submits modification (auto-approve or request) |
| GET | `/api/bookings/{id}/modification-requests` | Get modification requests for booking |
| POST | `/api/bookings/{id}/modification-requests/{reqId}/cancel` | Guest cancels pending request |
| GET | `/api/owner/bookings` | Get owner's bookings |
| POST | `/api/owner/bookings` | Create manual booking (owner) |
| POST | `/api/owner/bookings/{id}/confirm` | Confirm booking (captures payment) |
| POST | `/api/owner/bookings/{id}/reject` | Reject booking (releases auth) |
| POST | `/api/owner/bookings/{id}/check-in` | Record guest check-in |
| PUT | `/api/owner/bookings/{id}/modify` | Modify booking dates or lot (CONFIRMED/CHECKED_IN only) |
| POST | `/api/owner/bookings/{id}/check-out` | Record guest check-out |
| GET | `/api/owner/modification-requests` | List pending modification requests for owner |
| POST | `/api/owner/modification-requests/{reqId}/resolve` | Approve or decline modification request |
| POST | `/api/payments/{bookingId}/create-intent` | Create Stripe payment intent |
| POST | `/api/payments/{bookingId}/confirm-authorization` | Confirm card authorization |

## Frontend Pages

- **BookingModal** — Date selection, guest count, pricing preview, payment form
- **TripsPage** — Guest's booking history and upcoming trips
- **OwnerBookingsPage** — Manage incoming bookings (confirm/reject, check-in/out)
- **OwnerTodayPage** — Today's arrivals and departures
- **OwnerModificationRequestsPage** — Review and approve/decline guest modification requests
- **GuestModifyBookingModal** — Guest-facing modal for modifying booking dates, lot, and power hookup
- **OwnerTimelinePage** — Gantt-style horizontal timeline: lots as rows grouped by type, bookings as color-coded bars, blocked periods as striped bars. 1w/2w/1m range toggle, prev/next/today navigation, booking popover on click.
- **BookingMessagesPage** (`/trips/{bookingId}/messages`) — Guest-side chat for a booking (see [communication module](../communication/README.md))

## Schedulers

- **BookingAutoCompleteScheduler** — Auto-completes bookings after checkout date passes
- **BookingCleanupScheduler** — Cleans up stale `PENDING_PAYMENT` bookings
- **PreArrivalEmailScheduler** — Sends pre-arrival email to guests 2 days before check-in (daily at 9 AM, ShedLock protected)
- **PostStayReviewEmailScheduler** — Sends review request email to guests 1 day after checkout (daily at 10 AM, ShedLock protected). Skips bookings that already have a review or where email was already sent (`reviewEmailSentAt` tracking field on Booking entity).

## Booking Modifications

Owners can modify CONFIRMED or CHECKED_IN bookings in-place (dates and/or lot assignment) without cancelling and rebooking. This preserves the booking record and audit trail.

**Modifiable fields:** check-in date, check-out date, lot assignment (same owner only)

**Blocked scenarios:**
- Bookings with `paymentStatus=AUTHORIZED` — owner must confirm or cancel first
- Statuses other than CONFIRMED or CHECKED_IN
- CHECKED_IN bookings cannot have check-in moved to a future date
- New dates must satisfy the lot's minimum stay requirement

**Pricing:** Total price is recalculated using seasonal pricing rules. For `paymentStatus=NONE` (manual bookings), service fee and charge total are also recalculated. For `paymentStatus=CAPTURED`, only totalPrice is updated; the price difference is logged for offline settlement.

**Audit:** Every modification creates a `BookingModificationLog` entry recording previous/new values, price adjustment, modifier, reason, and `initiatedBy` (OWNER or GUEST).

## Guest Booking Modifications

Guests can modify their own CONFIRMED bookings (dates, lot, power hookup) subject to owner-configurable policies. Uses a separate `booking_modification_requests` table so the booking stays CONFIRMED while a request is pending.

### Owner Policy Settings (on Owner entity)

| Field | Default | Description |
|-------|---------|-------------|
| `allowGuestModifications` | true | Master toggle for guest modifications |
| `modificationDeadlineDays` | 3 | Minimum days before check-in that modifications are allowed |
| `requireModificationApproval` | false | If true, modifications create a pending request; if false, auto-applied |

### Modification Request Status

```
PENDING → APPROVED (owner approves, modification applied)
        → DECLINED (owner declines with optional reason)
        → CANCELLED (guest cancels their own request)
```

### Guest Flow
1. Guest clicks "Modify" on a confirmed booking → frontend fetches modification policy
2. If `canModify=true`, modal opens showing current booking + change form (dates, lot, power)
3. Guest submits changes with optional reason
4. **Auto-approve path** (`requireModificationApproval=false`): modification applied immediately, owner notified
5. **Approval-required path** (`requireModificationApproval=true`): `BookingModificationRequest` created with PENDING status, owner notified, guest sees "Modification Pending" badge

### Owner Flow
1. Owner sees pending requests on `/owner/modification-requests` page
2. Each request shows current vs requested values and price impact
3. Owner can approve (re-validates availability, applies modification) or decline (with optional reason)
4. Guest is notified of the outcome

### Blocked Scenarios (canModify=false)
- Owner has disabled guest modifications
- Booking is not CONFIRMED status
- Within the modification deadline (too close to check-in)
- A PENDING modification request already exists for this booking

## Feature Toggle: BOOKING_ENABLED

The entire booking system can be disabled via the `BOOKING_ENABLED` feature toggle (default: `false`). When disabled, the platform operates as a listing-only directory.

### What changes when disabled
- **Backend**: `createBooking()` and `createManualBooking()` reject with 400 "Bookings are not currently available."
- **Guest UI**: "Book Now" buttons become "Booking Coming Soon" placeholders; "Trips" tab hidden from BottomNav; `/trips` shows a coming-soon message
- **Owner UI**: 8 booking-related sidebar items hidden (Dashboard, Today, Bookings, Calendar, Timeline, Pricing, Modifications, Messages); `/owner` redirects to `/owner/lots`
- **What stays visible**: Browse campsites, reviews, photos, marketplace, saved/favorites, owner lot management, property details, staff, settings

### Design decisions
- Toggle starts `false` — listing-only until admin enables it
- Backend guards only on create — other booking endpoints are harmless with zero bookings
- Frontend hides UI + backend rejects — defense in depth
- Reviews stay visible — they're about the campsite, not tied to active bookings
- Existing bookings remain viewable/manageable if they were created before the toggle was disabled

## Implementation Notes
- Booking creation validates the lot's minimum stay requirement (accounting for seasonal pricing rule overrides). Guest and owner modifications also enforce minimum stay.
- All payments use Stripe manual capture: authorize first, capture on confirmation.
- Instant booking campsites auto-confirm and auto-capture immediately after authorization.
- Manual approval campsites hold the authorization until the owner confirms or rejects.
- Frontend uses a dual-update mechanism: REST call + webhook fallback for payment confirmation.
