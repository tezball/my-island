# Owner/Admin Flow

The owner/admin flow provides campsite owners with tools to manage their properties, lots, bookings, statistics, and supplier offers.

## Screens

| # | Screen | File | Description |
|---|--------|------|-------------|
| 1 | Dashboard | `01-dashboard.png` | Owner overview dashboard |
| 2 | Statistics | `02-statistics.png` | Campsite performance stats |
| 3 | Manage Lots | `03-manage-lots.png` | Lot management list |
| 4 | Add Lot | `04-add-lot.png` | Add new lot form |
| 5 | Edit Lot 1 | `05-edit-lot-1.png` | Edit lot form (top) |
| 6 | Edit Lot 2 | `06-edit-lot-2.png` | Edit lot form (bottom) |
| 7 | Edit Campsite 1 | `07-edit-campsite-1.png` | Edit campsite (top) |
| 8 | Edit Campsite 2 | `08-edit-campsite-2.png` | Edit campsite (bottom) |
| 9 | Offer Mgmt 1 | `09-offer-mgmt-1.png` | Supplier offers list |
| 10 | Offer Mgmt 2 | `10-offer-mgmt-2.png` | Offer management detail |
| 11 | Edit Offer | `11-edit-offer.png` | Edit offer form |

## User Stories

### US-OWN-001: View Owner Dashboard
**As a** campsite owner
**I want to** see an overview of my campsite's performance
**So that** I can quickly assess business health

**Acceptance Criteria:**
- Summary stats: bookings, revenue, occupancy rate
- Recent bookings list
- Upcoming check-ins
- Quick actions: manage lots, view bookings, settings
- Notifications/alerts (new bookings, reviews, etc.)
- Time period selector (today, week, month)

---

### US-OWN-002: View Campsite Statistics
**As a** campsite owner
**I want to** see detailed performance metrics
**So that** I can make data-driven decisions

**Acceptance Criteria:**
- Revenue chart over time
- Occupancy rate trends
- Bookings by lot type
- Average booking value
- Popular booking periods
- Guest demographics (optional)
- Compare to previous periods

---

### US-OWN-003: Manage Campsite Listing
**As a** campsite owner
**I want to** edit my campsite information
**So that** guests see accurate details

**Acceptance Criteria:**
- Edit campsite name, description
- Update photos (add, remove, reorder)
- Edit location and address
- Update facilities checklist
- Set/update pricing defaults
- Manage availability settings
- Save and preview changes

---

### US-OWN-004: View All Lots
**As a** campsite owner
**I want to** see all my accommodation lots
**So that** I can manage them effectively

**Acceptance Criteria:**
- List of all lots with key info
- Each lot shows: name, type, capacity, price, status
- Visual status indicator (active, inactive)
- Quick actions: edit, toggle status
- Add new lot button
- Search/filter lots (if many)

---

### US-OWN-005: Add New Lot
**As a** campsite owner
**I want to** add a new accommodation lot
**So that** I can offer more booking options

**Acceptance Criteria:**
- Form fields: name, type, max guests, size
- Price per night setting
- Description and amenities
- Photos upload
- Availability settings
- Save creates new lot
- Validation before saving

---

### US-OWN-006: Edit Lot Details
**As a** campsite owner
**I want to** update lot information
**So that** details stay current

**Acceptance Criteria:**
- All lot fields editable
- Change type, capacity, pricing
- Update photos
- Modify description
- Save applies changes
- Changes reflected in guest-facing views

---

### US-OWN-007: Toggle Lot Availability
**As a** campsite owner
**I want to** enable/disable lots
**So that** I can control what's bookable

**Acceptance Criteria:**
- Toggle switch on lot list
- Disabled lots not shown to guests
- Warning if lot has future bookings
- Can re-enable at any time
- Status change takes effect immediately

---

### US-OWN-008: View Owner Bookings
**As a** campsite owner
**I want to** see all bookings for my campsite
**So that** I can manage reservations

**Acceptance Criteria:**
- List of all bookings (upcoming, past, cancelled)
- Filter by status, date range, lot
- Search by guest name or booking reference
- Each booking shows: guest, dates, lot, status, amount
- Tap to view full details
- Export option (CSV)

---

### US-OWN-009: View Booking Details (Owner)
**As a** campsite owner
**I want to** see full details of a booking
**So that** I can prepare for guest arrival

**Acceptance Criteria:**
- Guest information (name, contact)
- Booking dates and lot
- Guest count and extras
- Payment status and amount
- Special requests/notes
- Options: contact guest, modify, cancel

---

### US-OWN-010: Manage Supplier Offers
**As a** campsite owner/supplier
**I want to** create and manage offers
**So that** I can attract guests with deals

**Acceptance Criteria:**
- List of existing offers
- Each offer shows: title, discount, status, dates
- Toggle offer active/inactive
- Edit and delete options
- Create new offer button

---

### US-OWN-011: Create New Offer
**As a** campsite owner/supplier
**I want to** create a promotional offer
**So that** guests see my deals

**Acceptance Criteria:**
- Form: title, description, discount amount/percentage
- Category selection
- Image upload
- Valid date range
- Terms and conditions
- Preview before publishing
- Save creates offer

---

### US-OWN-012: Edit Offer
**As a** campsite owner/supplier
**I want to** update an existing offer
**So that** information stays accurate

**Acceptance Criteria:**
- All offer fields editable
- Change discount, dates, description
- Update image
- Extend or shorten validity
- Save applies changes
- Can deactivate without deleting

---

### US-OWN-013: View Revenue Dashboard
**As a** campsite owner
**I want to** see my earnings breakdown
**So that** I can track income

**Acceptance Criteria:**
- Total revenue for period
- Revenue by lot
- Pending payouts
- Completed payouts
- Payout schedule/history
- Export financial reports

---

### US-OWN-014: Manage Owner Settings
**As a** campsite owner
**I want to** configure my owner account settings
**So that** I receive proper notifications and payouts

**Acceptance Criteria:**
- Notification preferences for bookings
- Payout method configuration
- Bank account details
- Tax information
- Business details
- Cancellation policy settings

---

### US-OWN-015: Respond to Reviews
**As a** campsite owner
**I want to** respond to guest reviews
**So that** I can address feedback publicly

**Acceptance Criteria:**
- See all reviews for campsite
- "Respond" option on each review
- Write and submit response
- Response appears below review
- Can edit response (limited time)
- One response per review

---

## Flow Diagram

```
┌─────────────┐
│  Owner Mode │
│   Toggle    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│        Owner Dashboard          │
│                                 │
│  Stats: Revenue | Bookings |    │
│         Occupancy               │
│                                 │
│  ┌────────────────────────┐    │
│  │ Quick Actions          │    │
│  │ [Bookings] [Lots]      │    │
│  │ [Stats] [Settings]     │    │
│  └────────────────────────┘    │
│                                 │
│  Recent Bookings:               │
│  ┌────────────────────────┐    │
│  │ Booking 1              │    │
│  │ Booking 2              │    │
│  └────────────────────────┘    │
└──────────────┬──────────────────┘
               │
    ┌──────────┼──────────┬──────────┬──────────┐
    ▼          ▼          ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│Bookings│ │ Manage │ │ Stats  │ │ Offers │ │Settings│
│  List  │ │  Lots  │ │        │ │ Mgmt   │ │        │
└───┬────┘ └───┬────┘ └────────┘ └───┬────┘ └────────┘
    │          │                     │
    ▼          ├──────────┐          ├──────────┐
┌────────┐     ▼          ▼          ▼          ▼
│Booking │ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ Detail │ │Add Lot │ │Edit Lot│ │Add     │ │Edit    │
└────────┘ └────────┘ └────────┘ │ Offer  │ │ Offer  │
                                 └────────┘ └────────┘

┌─────────────────────────────────┐
│      Edit Campsite              │
│                                 │
│  [Photos Gallery]               │
│                                 │
│  Name: _______________          │
│  Description: ________          │
│                                 │
│  Location: ___________          │
│                                 │
│  Facilities: [✓] WiFi           │
│              [✓] Showers        │
│              [ ] Pool           │
│                                 │
│  [Save Changes]                 │
└─────────────────────────────────┘
```

## Related Pages

- `src/pages/OwnerDashboardPage.tsx`
- `src/pages/OwnerBookingsPage.tsx`
- `src/pages/OwnerBookingDetailPage.tsx`
- `src/pages/ManageLotsPage.tsx`
- `src/pages/AddLotPage.tsx`
- `src/pages/EditLotPage.tsx`
- `src/pages/EditCampsitePage.tsx`
- `src/pages/CampsiteStatisticsPage.tsx`
- `src/pages/RevenueDashboardPage.tsx`
- `src/pages/SupplierOfferManagementPage.tsx`
- `src/pages/EditOfferPage.tsx`
- `src/pages/OwnerSettingsPage.tsx`

## Access Control

- Owner features require authenticated owner account
- Owners can only manage their own campsites
- Role-based permissions for multi-user accounts
- Separate from guest functionality (mode toggle)

## Notes

- Consider mobile-optimized owner experience
- Real-time updates for new bookings
- Offline support for viewing bookings
- Calendar view for availability management
- Integration with external calendar systems (iCal)
- Automated pricing suggestions based on demand
