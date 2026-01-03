# MVP Critical Tasks - Prioritized by Impact

**Generated:** 2026-01-03
**Updated:** 2026-01-03 (P0 items fixed)
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

### 5. API Error Handling - 403 Errors Everywhere
**Impact:** HIGH - Poor UX when not authenticated
**Files:** All pages making API calls
**Issue:** Every page that calls the backend gets 403 Forbidden. Console flooded with errors. No graceful handling or user feedback.
**Fix:**
- Add proper auth token handling
- Implement API interceptor for 401/403 responses
- Redirect to login or show appropriate error states

### 6. Search Page - Featured Campsites Not Rendering
**Impact:** MEDIUM - Discovery flow incomplete
**File:** `src/pages/SearchPage.tsx`
**Issue:** "Featured Campsites" heading exists but no campsites are displayed below it.
**Fix:** Implement campsite grid under the heading.

### 7. Login Page URL Mismatch
**Impact:** LOW - Confusing URL
**File:** `src/pages/LoginPage.tsx`
**Issue:** Navigating to `/login` redirects to `/` but shows login content. URL doesn't match displayed page.
**Fix:** Keep URL as `/login` when showing login page.

### 8. Currency Consistency
**Impact:** MEDIUM - Professional appearance
**Files:** Owner pages use mixed currency symbols
**Issue:** Some pages show € (correct for Ireland), some show $
**Fix:** Standardize all currency display to € with proper locale formatting.

---

## P2 - Medium Priority (Should Complete)

### 9. Owner Dashboard Metrics - This Month Revenue Always Zero
**Impact:** MEDIUM - Metrics accuracy
**File:** `my-island-api/.../OwnerService.java:88`
**Issue:** `thisMonthRevenue` calculation was implemented in recent fix but needs testing.
**Fix:** Verify calculation with real booking data.

### 10. Revenue Breakdown - Hardcoded Percentages
**Impact:** LOW - Data accuracy
**File:** `src/pages/owner/OwnerStatsPage.tsx:70-77`
**Issue:** Revenue breakdown shows 100% Stays, 0% Services/Goods - hardcoded, not calculated.
**Fix:** Either remove feature or implement backend support for revenue categorization.

### 11. Map View Not Showing Campsites
**Impact:** MEDIUM - Discovery feature
**File:** `src/pages/DiscoverPage.tsx`
**Issue:** Map toggle button exists but map view may not render campsites properly.
**Fix:** Verify Leaflet integration and campsite markers.

### 12. Lot Type Enum Mismatch
**Impact:** MEDIUM - Data display issues
**File:** `src/pages/BookingPage.tsx:35`
**Issue:** LotType enum comes from API as uppercase (e.g., "SAFARI_TENT") but frontend converts to lowercase which may not match display expectations.
**Fix:** Standardize type display with proper formatting.

---

## P3 - Lower Priority (Nice to Have)

### 13. Demo Mode Login
**Impact:** LOW - Testing convenience
**File:** `src/pages/LoginPage.tsx`
**Issue:** Demo mode dropdown exists but may not properly authenticate with backend.
**Fix:** Implement demo credentials that work with backend.

### 14. Favorites API Integration
**Impact:** LOW - Feature completeness
**File:** `src/pages/FavoritesPage.tsx`
**Issue:** Uses mock data, needs real API integration.
**Fix:** Connect to backend favorites endpoint.

### 15. Popular Dates - Hardcoded
**Impact:** LOW - Data accuracy
**File:** `src/pages/owner/OwnerStatsPage.tsx:245-269`
**Issue:** "Popular Dates" section shows hardcoded mock data.
**Fix:** Implement backend endpoint or remove section.

### 16. Active Guests Count - Hardcoded
**Impact:** LOW - Data accuracy
**File:** `src/pages/owner/OwnerDashboardPage.tsx:60`
**Issue:** `activeGuests = 45` is hardcoded for broadcast feature.
**Fix:** Calculate from actual check-ins or remove feature.

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
| `/search` | Partial | Missing featured campsites |
| `/campsite/:id` | Works | Full detail page |
| `/book/:id/calendar` | Works | Date selection works |
| `/book/:id` | Broken | Ignores URL date params |
| `/favorites` | Works | Mock data fallback |
| `/offers` | Works | Filters + offers display |
| `/bookings` | Error | 403 error state shown |
| `/profile` | Works | Mock user data |
| `/owner` | Works | Zeros with fallback |
| `/owner/stats` | Broken | Empty main content |
| `/notifications` | Broken | Empty main content |
| `/support` | Works | Full support page |
| `/login` | Partial | URL redirect issue |

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
