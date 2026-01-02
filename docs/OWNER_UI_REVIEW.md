# Owner UI Review - Playwright Testing

**Date:** January 2, 2026
**Tested As:** Siobhan O'Malley (siobhan@clifdeneco.ie) - Owner Role
**Campsite:** Clifden Eco Beach Camping

---

## Summary

Reviewed all owner-facing pages after migration from mock data to backend API. Most pages load correctly with real data, but several issues were identified.

| Page | Status | Issues |
|------|--------|--------|
| Owner Dashboard | Partial | Hardcoded stats, €0 revenue |
| Owner Bookings | Working | No bookings in system |
| Owner Stats | Partial | Chart rendering warnings, no data |
| Manage Lots | Working | 4 lots load correctly |
| Edit Campsite | Working | Form loads with data |

---

## Detailed Findings

### 1. Owner Dashboard (`/owner`)

**What Works:**
- Page loads without errors
- Campsite status toggle functional
- Quick Actions links navigate correctly
- Broadcast alert textarea with character counter (0/140)

**Issues Found:**

| Issue | Severity | Description |
|-------|----------|-------------|
| Hardcoded Stats | Medium | "1,240 Views this week" and "8 Alerts sent" are hardcoded, not from API |
| Revenue Shows €0 | High | View Stats shows €0 - API returning no revenue data |
| 0 Upcoming Bookings | Medium | May be accurate or API issue - needs verification |

**Recommendation:**
- Create API endpoint for views/alerts statistics
- Verify bookings are being assigned to owner's campsite

---

### 2. Owner Bookings (`/owner/bookings`)

**What Works:**
- Page structure loads correctly
- Search bar for guest name/booking ID
- Filter tabs (All, Confirmed, Cancelled)
- Stats cards (Active, Revenue)

**Issues Found:**

| Issue | Severity | Description |
|-------|----------|-------------|
| No Bookings Found | Medium | Empty state shown - no bookings in database for owner |
| View Calendar Button | Low | Button exists but functionality not verified |

**Current State:**
- Active bookings: 0
- Revenue: €0
- "No bookings found" message displayed

**Recommendation:**
- Seed database with sample bookings for this owner
- Verify `bookingsApi.list()` filters by owner's campsites

---

### 3. Owner Stats (`/owner/stats`)

**What Works:**
- Campsite selector dropdown (Clifden Eco Beach Camping)
- Time range filters (Week, Month, Year)
- Revenue Over Time chart renders (Jan-Jun axis)
- Booking Trends chart renders
- Revenue Breakdown pie chart shows (70%/15%/15%)
- Popular Dates section displays

**Issues Found:**

| Issue | Severity | Description |
|-------|----------|-------------|
| Console Warnings | Medium | `The width(-1) and height(-1) of chart should be greater than 0` - Recharts rendering issue |
| No Chart Data | High | Charts show axes but no actual data bars/lines |
| €0 Revenue | High | Revenue card shows €0 with 0% trend |
| 0% Occupancy | High | Occupancy shows 0% (though +5% trend displayed) |
| Static Pie Chart | Medium | Revenue breakdown percentages appear hardcoded |
| Hardcoded Popular Dates | Medium | "Bank Holiday Weekend" and "Early Autumn Special" are static |

**Console Errors:**
```
The width(-1) and height(-1) of chart should be greater than 0
```
(Appeared 4 times)

**Recommendation:**
- Fix Recharts container sizing issue (ensure parent has explicit dimensions)
- Create API endpoint for revenue/occupancy data
- Make Popular Dates dynamic from bookings data

---

### 4. Manage Lots (`/owner/lots`)

**What Works:**
- All 4 lots load from API correctly
- Search bar functional
- Filter tabs (All, Available, Booked, Maintenance)
- Lot cards display: name, type, capacity, amenities, price, status badge
- Edit and Delete buttons present
- Add new lot FAB (floating action button)

**Lots Displayed:**

| Lot Name | Type | Price | Capacity | Status |
|----------|------|-------|----------|--------|
| Ocean View Pitch 1 | TENT | €28/night | 4 | Available |
| Beachside Campervan Spot | CAMPERVAN | €38/night | 4 | Booked |
| Luxury Safari Tent | GLAMPING | €125/night | 6 | Maintenance |
| The Nest Treehouse | CABIN | €175/night | 2 | Available |

**Issues Found:**

| Issue | Severity | Description |
|-------|----------|-------------|
| Delete Not Confirmed | Low | Delete button exists but no confirmation dialog tested |
| Type Icon Mismatch | Low | All lot types show "bed" icon instead of type-specific icons |

**Recommendation:**
- Verify delete confirmation dialog exists
- Fix `getLotTypeIcon()` function - currently shows 'bed' for unknown types

---

### 5. Edit Campsite (`/owner/campsites/{id}/edit`)

**What Works:**
- Form loads with existing campsite data
- Photos section with 3 images and add/remove functionality
- Basic Info fields populated (Name, Price, Description)
- Character counter on description (138/500)
- Location section with map preview
- Facilities toggles for 12 amenities
- Save button present

**Data Loaded:**
- **Name:** Clifden Eco Beach Camping
- **Price:** €28/night
- **Description:** "Stunning beachfront camping in the heart of Connemara..."
- **Location:** Clifden, Connemara

**Issues Found:**

| Issue | Severity | Description |
|-------|----------|-------------|
| No Facility Selection | Low | None of the facility buttons appear selected/active |
| Save Feedback | Low | Save action not tested - unclear if success toast appears |

**Recommendation:**
- Verify facilities are loaded from API and displayed as selected
- Test save functionality end-to-end

---

## Priority Actions

### High Priority
1. **Fix chart rendering** - Recharts width/height -1 errors need container fix
2. **Populate revenue data** - Owner stats showing €0 everywhere
3. **Verify booking ownership** - Ensure bookings link to owner's campsites

### Medium Priority
4. **Create views/alerts API** - Dashboard stats currently hardcoded
5. **Dynamic Popular Dates** - Currently static content
6. **Seed test bookings** - Owner needs sample booking data

### Low Priority
7. **Fix lot type icons** - Showing generic bed icon
8. **Facility selection state** - Verify toggle state loads correctly
9. **Delete confirmation** - Verify modal exists

---

## Browser Console Summary

| Type | Count | Message |
|------|-------|---------|
| Warning | 4 | Chart width/height -1 (Recharts) |
| Info | Multiple | React DevTools reminder |

---

## Test Environment

- **Browser:** Playwright (Chromium)
- **Frontend:** http://localhost:5173
- **Backend:** Spring Boot API (assumed running)
- **User:** Owner role with 1 campsite, 4 lots
