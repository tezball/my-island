# My Bookings Flow

The My Bookings flow allows users to view, manage, modify, and cancel their reservations.

## Screens

| # | Screen | File | Description |
|---|--------|------|-------------|
| 1 | Bookings List | `01-bookings-list.png` | Upcoming bookings tab |
| 2 | Past Bookings | `02-bookings-past.png` | Completed/past bookings |
| 3 | Modify Dates | `03-modify-dates.png` | Change booking dates |
| 4 | Modify Guests | `04-modify-guests.png` | Change guests/extras |
| 5 | Modify Summary | `05-modify-summary.png` | Review modifications |
| 6 | Cancel Confirm | `06-cancel-confirm.png` | Cancellation confirmation modal |
| 7 | Cancellation Success | `07-cancellation-success.png` | Cancellation complete |

## User Stories

### US-MYBK-001: View Upcoming Bookings
**As a** user
**I want to** see my upcoming bookings
**So that** I can keep track of my planned trips

**Acceptance Criteria:**
- "Upcoming" tab selected by default
- Bookings sorted by check-in date (soonest first)
- Each booking card shows:
  - Campsite image and name
  - Lot name
  - Check-in and check-out dates
  - Guest count
  - Status badge (Confirmed)
- Empty state if no upcoming bookings
- Tapping card navigates to booking detail

---

### US-MYBK-002: View Past Bookings
**As a** user
**I want to** see my past bookings
**So that** I can reference previous stays or rebook

**Acceptance Criteria:**
- "Past" tab shows completed and cancelled bookings
- Sorted by date (most recent first)
- Status badges: "Completed" or "Cancelled"
- Option to leave review (if not already reviewed)
- Option to "Book Again" for quick rebooking
- Historical bookings preserved indefinitely

---

### US-MYBK-003: View Booking Details
**As a** user
**I want to** see full details of a booking
**So that** I have all information for my trip

**Acceptance Criteria:**
- Full campsite details with image
- Booking reference number
- Check-in/check-out dates and times
- Lot information
- Guest breakdown
- Extras included
- Total price paid
- Check-in instructions (for upcoming)
- Host contact option
- Map/directions link
- Modify and Cancel buttons (for upcoming only)

---

### US-MYBK-004: Modify Booking Dates
**As a** user
**I want to** change my booking dates
**So that** I can adjust my travel plans

**Acceptance Criteria:**
- "Modify" button on booking detail
- Calendar shows current selection
- Can select new date range
- Availability checked for new dates
- Price difference calculated and shown
- If price increases, additional payment required
- If price decreases, refund/credit issued
- Confirmation required before applying changes

---

### US-MYBK-005: Modify Guest Count & Extras
**As a** user
**I want to** change guests or extras
**So that** I can update my booking as plans change

**Acceptance Criteria:**
- Modify flow shows current guest count
- Can adjust adult/children counts
- Lot capacity limits enforced
- Can add or remove extras
- Price difference calculated
- Summary shows what changed
- Confirmation required

---

### US-MYBK-006: Review Booking Modifications
**As a** user
**I want to** review changes before confirming
**So that** I don't make mistakes

**Acceptance Criteria:**
- Summary shows original vs. new values
- Price difference clearly displayed
- "Confirm Changes" button applies updates
- "Cancel" returns without changes
- Loading state during processing
- Success confirmation shown

---

### US-MYBK-007: Cancel Booking
**As a** user
**I want to** cancel my booking
**So that** I'm not charged for a trip I can't take

**Acceptance Criteria:**
- "Cancel Booking" option on detail screen
- Confirmation modal appears with warning
- Cancellation policy displayed
- Refund amount shown (based on policy)
- Must confirm to proceed
- Cannot undo after confirmation

---

### US-MYBK-008: Receive Cancellation Confirmation
**As a** user
**I want to** see confirmation that my booking is cancelled
**So that** I know the cancellation was processed

**Acceptance Criteria:**
- Success screen after cancellation
- Confirmation message displayed
- Refund information shown (amount, timeline)
- Booking moved to "Past" with "Cancelled" status
- Cancellation email sent
- Option to return to bookings or home

---

### US-MYBK-009: View Check-In Instructions
**As a** user with an upcoming booking
**I want to** see check-in instructions
**So that** I know what to do when I arrive

**Acceptance Criteria:**
- Instructions available on booking detail
- May include: arrival time, directions, key/code info
- Contact information for host
- Emergency contact info
- House rules/guidelines

---

### US-MYBK-010: Contact Host
**As a** user
**I want to** contact the campsite host
**So that** I can ask questions or communicate needs

**Acceptance Criteria:**
- "Contact Host" button on booking detail
- Opens messaging or email compose
- Pre-fills booking reference
- Host info displayed (name, response time)

---

### US-MYBK-011: View Booking Receipt
**As a** user
**I want to** view/download my booking receipt
**So that** I have proof of payment for expenses

**Acceptance Criteria:**
- Receipt option on booking detail
- Shows itemized breakdown
- Includes payment method used
- Date of transaction
- Option to download PDF or share

---

### US-MYBK-012: Leave Review After Stay
**As a** user who completed a stay
**I want to** leave a review
**So that** I can share my experience with others

**Acceptance Criteria:**
- "Leave Review" prompt on completed bookings
- Star rating (1-5) required
- Written review optional
- Can rate specific aspects (cleanliness, location, etc.)
- Submit publishes review
- Can only review once per booking

---

## Flow Diagram

```
┌─────────────┐
│ Bottom Nav: │
│  Bookings   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│          My Bookings            │
│  ┌──────────┐  ┌──────────┐    │
│  │ Upcoming │  │   Past   │    │
│  │ (active) │  │          │    │
│  └──────────┘  └──────────┘    │
│                                 │
│  ┌─────────────────────────┐   │
│  │    Booking Card         │   │
│  │    [Image] Name         │   │
│  │    Dates | Guests       │   │
│  │    Status: Confirmed    │   │
│  └─────────────────────────┘   │
└──────────────┬──────────────────┘
               │ Tap Card
               ▼
        ┌─────────────┐
        │   Booking   │
        │   Detail    │
        └──────┬──────┘
               │
    ┌──────────┼──────────┬─────────────┐
    ▼          ▼          ▼             ▼
┌────────┐ ┌────────┐ ┌────────┐  ┌──────────┐
│ Modify │ │ Cancel │ │Check-In│  │  Contact │
│ Dates  │ │        │ │ Info   │  │   Host   │
└───┬────┘ └───┬────┘ └────────┘  └──────────┘
    │          │
    ▼          ▼
┌────────┐ ┌────────────┐
│ Modify │ │  Cancel    │
│Guests/ │ │ Confirm    │
│ Extras │ │  Modal     │
└───┬────┘ └─────┬──────┘
    │            │
    ▼            ▼
┌────────┐ ┌────────────┐
│ Modify │ │Cancellation│
│Summary │ │  Success   │
└───┬────┘ └────────────┘
    │
    ▼
┌────────────┐
│ Changes    │
│ Confirmed  │
└────────────┘
```

## Related Pages

- `src/pages/MyBookingsPage.tsx`
- `src/pages/BookingDetailPage.tsx`
- `src/pages/ModifyBookingDatesPage.tsx`
- `src/pages/ModifyGuestExtrasPage.tsx`
- `src/pages/ModifyBookingSummaryPage.tsx`
- `src/pages/CancellationSuccessPage.tsx`
- `src/pages/CheckInInstructionsPage.tsx`
- `src/pages/ContactHostPage.tsx`
- `src/pages/BookingReceiptPage.tsx`
- `src/pages/ReviewSubmissionPage.tsx`
- `src/components/booking/BookingSummaryCard.tsx`
- `src/components/booking/BookingStatusBadge.tsx`

## Notes

- Modification deadlines may apply (e.g., no changes within 24 hours)
- Cancellation policy varies by campsite
- Consider offline access to booking details
- Push notifications for booking reminders
