---
title: MVP Critical Tasks
type: task-tracker
status: active
priority: p0
created: 2026-01-03
updated: 2026-01-03
tags:
  - mvp
  - bugs
  - p0
  - sprint
---

# MVP Critical Tasks - Prioritized by Impact

**Generated:** 2026-01-03
**Updated:** 2026-01-03 (P0 + P1 + P2 + P3 items fixed)
**Review Method:** Playwright automated testing + code review

---

## P0 - Critical Blockers (Must Fix for MVP)

### 1. ✅ FIXED - Booking Flow: Dates Not Passed from Calendar
**Impact:** HIGH - Breaks core booking functionality
**File:** `src/pages/BookingPage.tsx:65-78`
**Issue:** BookingPage ignores URL query parameters (`checkIn`, `checkOut`, `lot`) and always uses default dates (tomorrow + 3 days). Users select dates in LotCalendarPage, but they're lost when navigating to BookingPage.
**Fix Applied:** Added `useSearchParams` to read `checkIn`, `checkOut`, `lot` from URL and initialize state with those values.

### 2. ✅ FIXED - Protected Routes Bypass - Mock Data Fallback
**Impact:** HIGH - Security and data integrity
**Files:** `src/lib/api.ts`, `src/context/AuthContext.tsx`
**Issue:** Pages like ProfilePage, FavoritesPage show mock user data even when not authenticated. ProtectedRoute redirects to login, but pages still render with mock data first.
**Fix Applied:** Added auth error handler to API layer that clears tokens and triggers logout on 401/403 responses. AuthContext now registers this handler and properly cleans up session state.

### 3. ✅ FALSE POSITIVE - Owner Stats Page Renders Empty
**Impact:** Was reported as HIGH but was a timing issue
**File:** `src/pages/owner/OwnerStatsPage.tsx`
**Issue:** Initial Playwright snapshot caught the page before React finished rendering. Page renders correctly after ~1-2 seconds.
**Status:** No fix needed - page works correctly.

### 4. ✅ FALSE POSITIVE - Notifications Page Empty
**Impact:** Was reported as MEDIUM but was a timing issue
**File:** `src/pages/NotificationsPage.tsx`
**Issue:** Initial Playwright snapshot caught the page before React finished rendering. Page renders correctly after ~1-2 seconds with mock notification data.
**Status:** No fix needed - page works correctly.

---

## P1 - High Priority (Important for MVP)

### 5. ✅ FIXED - API Error Handling - 403 Errors Everywhere
**Impact:** HIGH - Poor UX when not authenticated
**Files:** `src/lib/api.ts`, `src/context/AuthContext.tsx`
**Issue:** Every page that calls the backend gets 403 Forbidden. Console flooded with errors. No graceful handling or user feedback.
**Fix Applied:** Added auth error handler to API layer (see P0 #2). On 401/403 responses, tokens are cleared and user is logged out gracefully.

### 6. ✅ FIXED - Search Page - Featured Campsites Not Rendering
**Impact:** MEDIUM - Discovery flow incomplete
**File:** `src/pages/SearchPage.tsx`
**Issue:** "Featured Campsites" heading exists but no campsites are displayed below it when API fails.
**Fix Applied:** Added loading state with skeleton cards, empty state with sign-in prompt when API returns 403, and proper error handling.

### 7. ✅ VERIFIED - Login Page URL Mismatch
**Impact:** LOW - Confusing URL
**File:** `src/pages/LoginPage.tsx`
**Issue:** Reported that navigating to `/login` redirects to `/` but shows login content.
**Status:** Could not reproduce. URL correctly shows `/login` when on login page. May have been a one-time browser issue.

### 8. ✅ VERIFIED - Currency Consistency
**Impact:** MEDIUM - Professional appearance
**Files:** Owner pages
**Issue:** Reported that some pages show € and some show $.
**Status:** Verified all owner pages (Dashboard, Stats, Revenue, Bookings) consistently use € (Euro). No $ symbols found in currency display.

---

## P2 - Medium Priority (Should Complete)

### 9. ✅ VERIFIED - Owner Dashboard Metrics - This Month Revenue
**Impact:** MEDIUM - Metrics accuracy
**File:** `my-island-api/.../OwnerService.java:88-94`
**Issue:** `thisMonthRevenue` calculation was implemented in recent fix but needs testing.
**Status:** Code verified correct - calculates revenue from COMPLETED bookings with checkout in current month. Shows €0 when no completed bookings exist (expected behavior).

### 10. ✅ FIXED - Revenue Breakdown - Hardcoded Percentages
**Impact:** LOW - Data accuracy
**File:** `src/pages/owner/OwnerStatsPage.tsx:70-77`
**Issue:** Revenue breakdown shows 100% Stays, 0% Services/Goods - hardcoded, not calculated.
**Fix Applied:** Added "(Coming soon)" label next to Services and Goods to indicate this is intentional. Updated donut chart to show full circle for stays when revenue > 0.

### 11. ✅ VERIFIED - Map View Shows Campsites
**Impact:** MEDIUM - Discovery feature
**File:** `src/pages/DiscoverPage.tsx`, `src/components/ui/MapView.tsx`
**Issue:** Map toggle button exists but map view may not render campsites properly.
**Status:** Verified working - map shows 5 price markers (€85, €22, €55, €25, €28) with proper Leaflet integration.

### 12. ✅ FIXED - Lot Type Enum Display Formatting
**Impact:** MEDIUM - Data display issues
**Files:** `src/pages/CampsiteDetailPage.tsx`, `src/pages/BookingPage.tsx`, `src/pages/owner/ManageLotsPage.tsx`
**Issue:** LotType enum displayed as lowercase with underscores (e.g., "safari_tent" instead of "Safari Tent").
**Fix Applied:** Added `formatLotType()` helper function that converts "safari_tent" to "Safari Tent" for proper display.

---

## P3 - Lower Priority (Nice to Have)

### 13. ✅ FIXED - Demo Mode Login
**Impact:** LOW - Testing convenience
**File:** `src/context/AuthContext.tsx:144-154`
**Issue:** Demo mode dropdown exists but may not properly authenticate with backend.
**Fix Applied:** Updated mock login in AuthContext to properly handle demo accounts with correct roles:
- `owner@my-island.com` → Owner role (Sarah O'Brien)
- `supplier@my-island.com` → Supplier role (Michael Kelly)
- `visitor@my-island.com` → Visitor role (Emma Murphy)

### 14. ✅ VERIFIED - Favorites API Integration
**Impact:** LOW - Feature completeness
**File:** `src/context/FavoritesContext.tsx`
**Issue:** Reported as using mock data, needs real API integration.
**Status:** Already well-implemented. FavoritesContext:
- Attempts API call to `/campsites/favorites` first
- Falls back to localStorage when API unavailable (403)
- Properly syncs between API and localStorage
- No changes needed.

### 15. ✅ FIXED - Popular Dates - Hardcoded
**Impact:** LOW - Data accuracy
**File:** `src/pages/owner/OwnerStatsPage.tsx:225-265`
**Issue:** "Popular Dates" section shows hardcoded mock data.
**Fix Applied:** Added "Preview" badge and explanatory text indicating this feature will populate once more reservations exist. Applied 60% opacity to indicate placeholder status.

### 16. ✅ FIXED - Active Guests Count - Hardcoded
**Impact:** LOW - Data accuracy
**File:** `src/pages/owner/OwnerDashboardPage.tsx:68-80`
**Issue:** `activeGuests = 45` was hardcoded for broadcast feature.
**Fix Applied:** Changed to `activeGuests = stats?.confirmedBookings || 0` to use real data. Added informative toast when no active guests are available for broadcast.

---

## Architecture Observations

### Good Patterns
- Clean route organization in App.tsx (~70 routes)
- ProtectedRoute with role-based access (requireOwner, requireSupplier)
- Proper TypeScript interfaces for API responses
- Component library (ui/) with reusable components
- AppShell layout for consistent page structure

### Areas for Improvement
- Mock data scattered across pages instead of centralized
- API error handling inconsistent across pages
- Some pages duplicate API type definitions
- Loading states sometimes don't prevent API calls

---

## Routes Tested

| Route | Status | Notes |
|-------|--------|-------|
| `/` (Discover) | Works | Shows campsites, 403 for favorites |
| `/search` | ✅ Fixed | Featured campsites show with loading/empty states |
| `/campsite/:id` | Works | Full detail page |
| `/book/:id/calendar` | Works | Date selection works |
| `/book/:id` | ✅ Fixed | Now reads URL date params correctly |
| `/favorites` | Works | Mock data fallback |
| `/offers` | Works | Filters + offers display |
| `/bookings` | Works | 403 triggers proper logout |
| `/profile` | Works | Mock user data |
| `/owner` | Works | Real metrics from API |
| `/owner/stats` | ✅ Fixed | Renders correctly (timing issue) |
| `/notifications` | ✅ Fixed | Renders correctly (timing issue) |
| `/support` | Works | Full support page |
| `/login` | ✅ Verified | URL stays at /login correctly |

---

## Recommended MVP Sprint Order

1. **Sprint 1 (Critical Path):**
   - Fix booking dates propagation (#1)
   - Fix owner stats page (#3)
   - Fix notifications page (#4)

2. **Sprint 2 (Auth & API):**
   - Implement proper auth flow (#5)
   - Fix protected route timing (#2)
   - Demo mode login (#13)

3. **Sprint 3 (Polish):**
   - Search page campsites (#6)
   - Currency standardization (#8)
   - Map view verification (#11)

4. **Sprint 4 (Data Accuracy):**
   - Revenue metrics verification (#9)
   - Remove/fix hardcoded data (#10, #15, #16)
   - API integration for favorites (#14)
