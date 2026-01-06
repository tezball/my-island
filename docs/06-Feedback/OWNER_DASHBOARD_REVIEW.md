# Owner Dashboard Review - Multi-Property Owner Perspective

**Date:** 2026-01-06
**Reviewer:** Product Management
**Test Account:** Sean O'Donnell (sean@wildatlantic-glamping.ie)
**Properties Owned:** 2 (Wild Atlantic Glamping, Donegal Mountain Retreat)
**Total Lots:** 4 lots across both properties
**Total Bookings:** 7 bookings

---

## Executive Summary

This review evaluates the Owner Dashboard experience from the perspective of an owner managing multiple properties. The current implementation has significant gaps in multi-property management functionality, with inconsistent property selection capabilities across different sections of the dashboard.

### Overall Score: 5/10

**Key Issues:**
- No unified property management hub
- Inconsistent property selector availability
- Critical data display bugs
- Navigation confusion for multi-property owners

---

## Page-by-Page Analysis

### 1. Main Dashboard (`/owner`)

**Status:** Needs Improvement

**What Works:**
- Clean overview with key metrics (Total Bookings, Revenue, Occupancy, Rating)
- Quick action buttons for common tasks
- Recent activity feed
- Responsive layout

**Issues Found:**

| Issue | Severity | Description |
|-------|----------|-------------|
| Single Property Toggle | High | Only shows one "Campsite Status" toggle, but owner has 2 properties |
| No Property Selector | High | Cannot switch between properties or view individual property stats |
| Aggregated Stats Only | Medium | Shows combined metrics without property breakdown |
| Unclear Property Context | Medium | Not immediately obvious which property data is being displayed |

**Recommendations:**
1. Add property selector dropdown at dashboard header level
2. Show aggregated stats with option to drill down per property
3. Display multiple campsite status toggles or a property switcher
4. Add "All Properties" vs individual property view toggle

---

### 2. Bookings Page (`/owner/bookings`)

**Status:** Critical Bug

**What Works:**
- Clean table layout with search and filters
- Status filter tabs (All, Confirmed, Cancelled)
- Date range selector

**Issues Found:**

| Issue | Severity | Description |
|-------|----------|-------------|
| **Data Display Bug** | **Critical** | Shows 0 bookings and €0 revenue when dashboard shows 7 bookings/€2,524.5 |
| No Property Filter | High | Cannot filter bookings by specific property |
| Missing Property Column | Medium | When showing bookings, no indication of which property they belong to |

**Recommendations:**
1. **Fix data loading bug immediately** - bookings not appearing
2. Add property filter dropdown
3. Add property name column to bookings table
4. Consider color-coding or grouping by property

---

### 3. Calendar View (`/owner/calendar`)

**Status:** Partially Working

**What Works:**
- Calendar displays correctly with date navigation
- Shows upcoming bookings with guest names
- Color-coded status dots (Booked, Pending, Active, Blocked)
- Month/Week view toggle

**Issues Found:**

| Issue | Severity | Description |
|-------|----------|-------------|
| No Property Filter | High | Cannot filter to see bookings for one property at a time |
| No Property Indicator | Medium | Booking entries don't show which property they belong to |
| Overlapping Entries | Low | If both properties have bookings on same day, unclear which is which |

**Recommendations:**
1. Add property filter dropdown at top of calendar
2. Show property name in booking hover/popup
3. Consider color-coding bookings by property
4. Add "All Properties" combined view option

---

### 4. Lots Management (`/owner/lots`)

**Status:** Needs Improvement

**What Works:**
- Shows lot cards with images and details
- Edit and manage actions available
- "Active Sites" count displayed

**Issues Found:**

| Issue | Severity | Description |
|-------|----------|-------------|
| Only Shows One Property | High | Displays "2 Active Sites" but only shows Donegal Mountain Retreat lots |
| Missing Wild Atlantic Glamping | High | Cannot see or manage lots from the other property |
| No Property Selector | High | No dropdown or tabs to switch between properties |
| Misleading Count | Medium | "2 Active Sites" refers to properties but shows lots from only one |

**Recommendations:**
1. Add property selector dropdown
2. Show lots grouped by property with headers
3. Allow switching between properties or "All Properties" view
4. Fix the "Active Sites" label to be clearer (properties vs lots)

---

### 5. Statistics/Performance (`/owner/stats`)

**Status:** Good

**What Works:**
- **HAS property dropdown** ("Donegal Mountain Retreat" visible)
- Revenue charts and performance metrics
- Time period selectors
- Occupancy rate visualization

**Issues Found:**

| Issue | Severity | Description |
|-------|----------|-------------|
| No "All Properties" Option | Medium | Cannot see combined stats across all properties at once |
| Default Selection Unclear | Low | Not clear why one property is selected by default |

**Recommendations:**
1. Add "All Properties" option in dropdown
2. Show comparison view between properties
3. Consider showing mini-summary cards for each property

---

### 6. Extras Management (`/owner/extras`)

**Status:** Good

**What Works:**
- **HAS "SELECT CAMPSITE" dropdown**
- Clean empty state with helpful CTA
- Good onboarding message

**Issues Found:**

| Issue | Severity | Description |
|-------|----------|-------------|
| Shows 0 Extras | Info | Expected - no extras have been created yet |
| No "All Properties" View | Low | Cannot see all extras across properties at once |

**Recommendations:**
1. Add "All Properties" option to see extras from all campsites
2. Consider bulk extras management for multi-property owners

---

### 7. Properties/Campsites Page (`/owner/campsites`)

**Status:** Does Not Exist

**Issues Found:**

| Issue | Severity | Description |
|-------|----------|-------------|
| **Page Returns 404** | **Critical** | No dedicated page for managing campsite properties |
| Missing Core Functionality | Critical | Multi-property owner has no central place to manage their properties |

**Recommendations:**
1. **Create owner campsites management page** (`/owner/campsites`)
2. List all properties with status, key metrics
3. Quick actions: Edit, View, Enable/Disable
4. Link to individual property settings

---

## Priority Issue Summary

### Critical (Fix Immediately)
1. **Bookings Page Bug** - Shows 0 bookings when owner has 7
2. **Missing Campsites Page** - 404 error, no property management hub

### High Priority
3. **Lots Page Only Shows One Property** - Missing data from second property
4. **Dashboard No Property Context** - Single toggle for multi-property owner
5. **Inconsistent Property Selectors** - Some pages have it, others don't

### Medium Priority
6. **No "All Properties" Aggregate View** - Across stats, calendar, extras
7. **Missing Property Column in Bookings Table**
8. **Calendar Doesn't Show Which Property**

---

## UX Recommendations for Multi-Property Owners

### Global Navigation Changes
1. Add global property context selector in header/nav
2. Persist property selection across page navigation
3. Offer "All Properties" option where appropriate

### Dashboard Redesign
1. Show summary cards for each property
2. Expandable details per property
3. Combined metrics with property breakdown

### Consistency
1. All data pages should have property filter
2. All tables should show property name column
3. Use consistent property selector component

---

## Test Session Notes

**Browser:** Chrome (via Claude in Chrome automation)
**Test Duration:** ~30 minutes
**Login Method:** Demo account selector

### Technical Issues Encountered
- Browser autofill repeatedly overrode login form values
- Some dropdowns difficult to interact with programmatically
- Form selections sometimes not registering

---

## Next Steps

1. [x] File bug ticket for Bookings page data loading issue - **FIXED** (2026-01-06)
   - Added `GuestSummary` to `BookingResponse.java`
   - Updated `OwnerService.toBookingResponse()` to include guest data
   - Updated `BookingService.toBookingResponse()` to include guest data
2. [x] Create design spec for owner campsites management page - **IMPLEMENTED** (2026-01-06)
   - Created `OwnerCampsitesPage.tsx` at `/owner/campsites`
   - Shows all owner properties with stats, actions (Edit, View Public)
3. [ ] Design global property selector component - Already exists (`PropertySelector.tsx`)
4. [ ] Fix Lots Page to show all properties with PropertySelector
5. [ ] Add property context to Dashboard for multi-property support
6. [ ] Add property indicator to Calendar bookings
7. [ ] Re-test after all fixes implemented

---

*Review conducted as part of MVP validation testing*
