# E2E Snag List

**Generated:** 2026-01-04
**Testing Method:** Browser automation on port 8080 (Spring Boot serving frontend)
**Scope:** Guest, Visitor, Owner, Supplier flows

---

## P0 - Critical Issues

### 1. Login API Failure
**Impact:** HIGH - Blocks all authenticated user flows
**Location:** `/login` page
**Issue:** Login form submits but fails with "Login failed - An error occurred. Please try again."
**Test Account:** owner@my-island.com / demo1234
**Expected:** Successful authentication and redirect to dashboard
**Console:** Check backend logs for authentication errors
**Action:** Debug Spring Security / JWT token generation

### 2. Protected Routes Showing Mock Data Without Auth
**Impact:** HIGH - Security concern
**Location:** `/profile`, `/bookings`, `/favorites`
**Issue:** Pages render with mock user data (Emma Murphy) instead of redirecting to login
**Expected:** Immediate redirect to `/login` when not authenticated
**Action:** Review ProtectedRoute component and AuthContext authentication check

### 3. Campsite Detail Buttons Not Responding
**Impact:** HIGH - Breaks booking flow
**Location:** `/campsite/:id` page
**Issue:** "Book Now" and "Check Dates" buttons do not respond to clicks
**Expected:** Navigate to booking/calendar page when clicked
**Action:** Debug click handlers on BookingCTA component

---

## P1 - High Priority Issues

### 4. All Offer Images Broken
**Impact:** HIGH - Poor user experience on offers page
**Location:** `/offers`
**Issue:** Every offer shows broken image placeholder instead of business images
**Expected:** Supplier/business images should load correctly
**Action:** Check image URLs in database and S3/LocalStack configuration

### 5. Map Markers Missing Popup Interaction
**Impact:** MEDIUM - Key discovery feature broken
**Location:** `/` (Discover page with map view)
**Issue:** Clicking on price markers on the map does not show any popup or campsite preview
**Expected:** Popup with campsite name, image, and "View" button
**Action:** Debug Leaflet marker popup binding in MapView component

### 6. Lot Images Broken on Booking Page
**Impact:** MEDIUM - Poor visual experience
**Location:** `/book/:id`
**Affected Lots:**
  - Atlantic Yurt (shows alt text instead of image)
  - Sky Treehouse (shows alt text instead of image)
**Expected:** Lot images should display correctly
**Action:** Check image URLs for these specific lots in database

---

## P2 - Medium Priority Issues

### 7. Owner/Supplier Testing Blocked
**Impact:** MEDIUM - Cannot verify admin functionality
**Location:** `/owner/*`, `/supplier/*` routes
**Issue:** Cannot test owner or supplier flows due to login failure (P0 #1)
**Dependency:** Resolve login issue first
**Action:** Re-test after login is fixed

### 8. Demo Mode Behavior Inconsistent
**Impact:** MEDIUM - Testing inconvenience
**Location:** Login page demo dropdown
**Issue:** Demo mode selector may not properly authenticate with backend
**Expected:** Quick login with predefined test accounts
**Action:** Verify demo mode sends correct credentials to `/api/auth/login`

### 9. Favorites Persistence Without Auth
**Impact:** LOW - Feature leaks without proper auth
**Location:** `/favorites`
**Issue:** Shows empty favorites page for unauthenticated users instead of login prompt
**Expected:** Redirect to login or show "Sign in to save favorites" message
**Action:** Add authentication check or empty state with CTA

---

## P3 - Low Priority / Polish

### 10. Console Warnings - Recharts
**Impact:** LOW - Development noise
**Location:** Owner Stats page
**Issue:** `The width(-1) and height(-1) of chart should be greater than 0`
**Action:** Ensure chart containers have explicit dimensions

### 11. Form Autocomplete Attributes
**Impact:** LOW - Accessibility warning
**Location:** Login and Signup pages
**Issue:** Missing autocomplete attributes on email/password fields
**Action:** Add `autocomplete="email"`, `autocomplete="current-password"`, etc.

---

## Testing Status

| User Type | Status | Notes |
|-----------|--------|-------|
| Guest (unauthenticated) | Tested | Multiple issues found |
| Visitor (registered) | Blocked | Login failure |
| Owner | Blocked | Login failure |
| Supplier | Blocked | Login failure |

---

## Pages Verified Working

- `/` - Discover page loads with 17 campsites
- `/map` - Map view shows 37 location markers
- `/search` - Search page functional with filters
- `/campsite/:id` - Detail page renders (buttons broken)
- `/book/:id` - Booking page renders with mock data
- `/offers` - Page structure works (images broken)
- `/support` - Support pages load correctly
- `/about`, `/privacy`, `/terms` - Static pages work

---

## Recommended Fix Order

1. **Fix Login API** (P0 #1) - Unblocks all authenticated flows
2. **Fix Protected Routes** (P0 #2) - Security fix
3. **Fix CTA Buttons** (P0 #3) - Core booking flow
4. **Fix Offer Images** (P1 #4) - High visibility
5. **Fix Map Popups** (P1 #5) - Discovery feature
6. **Re-test Owner/Supplier flows** after login is fixed

---

## Environment Details

- **Frontend:** React + Vite (built and served by Spring Boot)
- **Backend:** Spring Boot on port 8080
- **Database:** PostgreSQL via Docker Compose
- **Test Accounts:**
  - visitor@my-island.com / demo1234
  - owner@my-island.com / demo1234
  - supplier@my-island.com / demo1234
