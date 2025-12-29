# Booking Flow

The booking flow guides users through selecting dates, choosing a lot, adding extras, reviewing their booking, and completing payment.

## Screens

| # | Screen | File | Description |
|---|--------|------|-------------|
| 1 | Select Dates | `01-select-dates.png` | Date range picker |
| 2 | Lot Calendar | `02-lot-calendar.png` | Lot availability calendar |
| 3 | Guest & Extras | `03-guest-extras.png` | Guest count and add-ons |
| 4 | Summary & Payment | `04-summary-payment.png` | Booking review and payment |
| 5 | Payment Processing | `05-payment-processing.png` | Processing animation |
| 6 | Confirmation | `06-confirmation.png` | Booking success screen |

## User Stories

### US-BOOK-001: Select Booking Dates
**As a** user
**I want to** select check-in and check-out dates
**So that** I can book a campsite for my trip

**Acceptance Criteria:**
- Calendar view displays available dates
- Tap to select check-in date, tap again for check-out
- Selected range is visually highlighted
- Past dates are disabled
- Unavailable dates are marked/disabled
- Minimum stay requirements enforced (if any)
- Number of nights calculated and displayed
- Continue button enabled when valid range selected

---

### US-BOOK-002: View Lot Availability
**As a** user
**I want to** see which lots are available for my selected dates
**So that** I can choose the best option

**Acceptance Criteria:**
- Calendar shows availability per lot
- Color coding: available (green), booked (red), selected (primary)
- Lot details shown (type, capacity, price)
- If selected dates unavailable, suggest alternatives
- Multiple lots can be compared

---

### US-BOOK-003: Select a Lot
**As a** user
**I want to** choose a specific lot for my stay
**So that** I know exactly where I'll be staying

**Acceptance Criteria:**
- Available lots listed with details
- Each lot shows: name, type icon, max guests, size, price/night
- Tapping selects the lot
- Selected lot visually highlighted
- Only one lot can be selected
- Continue button enabled when lot selected

---

### US-BOOK-004: Specify Guest Count
**As a** user
**I want to** enter the number of guests
**So that** the campsite can accommodate my group

**Acceptance Criteria:**
- Separate counters for adults and children
- +/- buttons to adjust counts
- Minimum 1 adult required
- Maximum guests enforced based on lot capacity
- Warning if approaching/exceeding capacity
- Guest count affects pricing (if applicable)

---

### US-BOOK-005: Add Booking Extras
**As a** user
**I want to** add optional extras to my booking
**So that** I can enhance my camping experience

**Acceptance Criteria:**
- List of available extras displayed
- Each extra shows: name, description, price, icon
- Checkbox or toggle to add/remove
- Multiple extras can be selected
- Extras are optional (can proceed without)
- Running total updates as extras added
- Common extras: firewood, equipment rental, breakfast, late checkout

---

### US-BOOK-006: Review Booking Summary
**As a** user
**I want to** review all booking details before paying
**So that** I can confirm everything is correct

**Acceptance Criteria:**
- Campsite name and image displayed
- Selected lot details shown
- Check-in and check-out dates
- Number of nights
- Guest count breakdown
- Selected extras listed
- Price breakdown:
  - Nightly rate × nights
  - Each extra with price
  - Subtotal
  - Service fee (if any)
  - Total amount
- Edit options to go back and modify

---

### US-BOOK-007: Enter Payment Information
**As a** user
**I want to** enter my payment details
**So that** I can complete my booking

**Acceptance Criteria:**
- Saved payment methods shown (if any)
- Option to add new card
- Card number, expiry, CVV fields
- Card type auto-detected (Visa, Mastercard, etc.)
- Billing address fields
- Form validation with clear error messages
- Secure input indicators (lock icon, https)
- "Pay Now" button with total amount

---

### US-BOOK-008: Process Payment
**As a** user
**I want to** see payment processing status
**So that** I know my booking is being confirmed

**Acceptance Criteria:**
- Loading/processing animation displayed
- "Processing payment..." message
- Screen prevents back navigation during processing
- Timeout handling (show retry option)
- Error handling with clear message if payment fails

---

### US-BOOK-009: Receive Booking Confirmation
**As a** user
**I want to** see confirmation that my booking is complete
**So that** I have peace of mind

**Acceptance Criteria:**
- Success animation/icon
- "Booking Confirmed!" message
- Booking reference number displayed prominently
- Summary of booking details
- "View Booking" button to see full details
- "Back to Home" option
- Confirmation email sent automatically

---

### US-BOOK-010: Handle Payment Failure
**As a** user
**I want to** understand why my payment failed
**So that** I can fix the issue and try again

**Acceptance Criteria:**
- Clear error message explaining failure
- Common reasons: insufficient funds, card declined, expired card
- Option to try again with same card
- Option to use different payment method
- Booking not created until payment succeeds
- No duplicate charges on retry

---

### US-BOOK-011: Apply Promo Code
**As a** user
**I want to** apply a promotional code
**So that** I can get a discount on my booking

**Acceptance Criteria:**
- Promo code input field on summary screen
- "Apply" button validates code
- Success message shows discount amount
- Invalid code shows error message
- Discount reflected in price breakdown
- Only one code per booking

---

## Flow Diagram

```
┌─────────────┐
│  Campsite   │
│   Detail    │
└──────┬──────┘
       │
       ▼ "Book Now"
┌─────────────┐
│   Select    │
│   Dates     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Lot      │
│ Selection   │◄──── (Optional if single lot)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Guest &   │
│   Extras    │
└──────┬──────┘
       │
       ▼
┌─────────────┐         ┌─────────────┐
│  Booking    │────────▶│   Payment   │
│  Summary    │         │   Method    │
└──────┬──────┘         └──────┬──────┘
       │                       │
       │◄──────────────────────┘
       │
       ▼
┌─────────────┐
│   Payment   │
│ Processing  │
└──────┬──────┘
       │
       ├────────────────┐
       ▼                ▼
┌─────────────┐  ┌─────────────┐
│Confirmation │  │  Payment    │
│  Success    │  │  Failed     │
└──────┬──────┘  └──────┬──────┘
       │                │
       ▼                └──────▶ (Retry)
┌─────────────┐
│    Home     │
│ or Bookings │
└─────────────┘
```

## Related Pages

- `src/pages/SelectDatesPage.tsx`
- `src/pages/LotSelectionPage.tsx`
- `src/pages/LotCalendarPage.tsx`
- `src/pages/GuestExtrasPage.tsx`
- `src/pages/BookingSummaryPage.tsx`
- `src/pages/PaymentProcessingPage.tsx`
- `src/pages/BookingConfirmationPage.tsx`
- `src/pages/PaymentFailedPage.tsx`
- `src/pages/BookingFailedPage.tsx`
- `src/context/BookingContext.tsx`
- `src/components/booking/DateRangePicker.tsx`
- `src/components/booking/GuestCounter.tsx`
- `src/components/booking/PriceBreakdown.tsx`

## State Management

Booking flow state is managed via `BookingContext`:
- Selected campsite and lot
- Date range
- Guest counts
- Selected extras
- Calculated pricing

## Notes

- State should persist if user navigates away and returns
- Consider saving draft bookings for logged-in users
- Price calculations should be validated server-side
- PCI compliance required for payment handling
