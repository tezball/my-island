# E2E Testing Snag List

**Date:** 2026-01-05
**Tested By:** Claude Code (Browser Automation)
**Feature Tested:** Extras Management for Owners + Booking Flow Integration

---

## Critical Issues

### 1. One-Time Extras Charged Per Night Instead of Once
- **Severity:** Critical
- **Location:** Booking flow payment calculation
- **Steps to Reproduce:**
  1. Create an extra with "Charge per night" toggle OFF (one-time charge)
  2. Set price to €15
  3. Start booking flow for that campsite
  4. Select the extra and proceed to payment
- **Expected:** Extra should add €15 one-time regardless of nights
- **Actual:** Extra adds €15 × number of nights (e.g., €30 for 2 nights)
- **Files Affected:** `src/components/booking/steps/BookingStepExtras.tsx`, `src/context/BookingWizardContext.tsx`, or backend payment calculation

---

## High Priority Issues

### 2. Campsite Images Not Loading
- **Severity:** High
- **Location:** Multiple pages
- **Description:** Campsite images show broken image placeholder or alt text instead of actual images
- **Affected Pages:**
  - Home page campsite cards
  - Campsite detail page hero image
  - Booking summary on payment page
- **Notes:** Alt text "Test Campsite for Extras" displays instead of image

### 3. Empty Campsite Description & Facilities
- **Severity:** High
- **Location:** Campsite detail page (`/campsite/:id`)
- **Description:** "About this campsite" and "Facilities & Amenities" sections appear empty even when campsite has data
- **Steps to Reproduce:**
  1. Navigate to any campsite detail page
  2. Scroll to About and Facilities sections
- **Expected:** Should show campsite description and facilities
- **Actual:** Sections are empty/collapsed

---

## Medium Priority Issues

### 4. Pricing Display Inconsistency in Extras Step
- **Severity:** Medium
- **Location:** Booking wizard extras step
- **Description:** Total price before selecting extras showed €105.00 (not €100.00 base), unclear where extra €5 comes from
- **Notes:** After selecting €15 extra, total became €136.50 which includes 5% service fee, but initial €105 is unexplained

### 5. "View Breakdown" Link Non-Functional in Extras Step
- **Severity:** Medium
- **Location:** Booking wizard footer in extras step
- **Description:** Clicking "View breakdown" doesn't expand or show breakdown details
- **Expected:** Should show price breakdown like on payment page
- **Actual:** Nothing happens when clicked

---

## Low Priority Issues

### 6. Home Page Campsite Count Inconsistency
- **Severity:** Low
- **Location:** Home page (`/`)
- **Description:** Initially showed "0 campsites" even with seed data present. After creating test campsite, showed "1 campsites" (grammar should be "1 campsite")
- **Suggested Fix:** Use proper pluralization: `${count} campsite${count !== 1 ? 's' : ''}`

---

## Verified Working Features

- Owner can create new extras with name, price, description, per-night toggle, and availability
- Owner can edit existing extras (name, price, description, per-night setting, availability)
- Owner can soft-delete extras (marks as unavailable, shows "Hidden" badge)
- Owner can re-enable hidden extras
- Extras filter tabs (All, Available, Unavailable) work correctly
- Search functionality for extras works
- Extras appear in booking flow for guests (fetched from API)
- Extra selection/deselection toggles work in booking wizard
- Selected extras summary shows correctly (+€15 badge)
- Payment page shows booking summary with extras line item

---

## Test Environment

- **URL:** http://localhost:8080
- **User Role Tested:** Campsite Owner (owner@my-island.com via Demo Mode)
- **Test Campsite:** "Test Campsite for Extras"
- **Test Extra:** "Firewood Bundle" - €15 one-time charge

---

## Recommendations

1. **Priority Fix:** Correct the extras pricing calculation to respect the `perNight` flag
2. **Image Loading:** Investigate why campsite images fail to load - may be S3/LocalStack configuration or URL generation issue
3. **Campsite Content:** Ensure description and facilities are properly fetched and displayed on detail page
4. **UX Improvement:** Make the price breakdown expandable in booking wizard or always show it
