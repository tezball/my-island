# PM Snag List - my-island

**Review Date:** January 2026
**Reviewer:** PM Review
**Status:** MVP ~75% Complete
**Last Updated:** January 2026 - Fixed P0, P1, and P3 issues

---

## P0 - Critical (Blocking)

### 1. ~~Missing Route: Create Campsite Wizard~~ ✅ FIXED
- **Location:** `src/pages/BecomeOwnerPage.tsx:70`
- **Issue:** Navigates to `/owner/campsites/new` but this route doesn't exist in `App.tsx`
- **Resolution:** Added route and imported `CampsiteCreateWizardPage` in `App.tsx`

### 2. ~~Route Parameter Mismatch: Owner Offers Edit~~ ✅ FIXED
- **Location:** `src/App.tsx:232`
- **Issue:** Route used `:offerId` but `OfferFormPage` expects `:id` parameter
- **Resolution:** Changed route to `/owner/offers/:id/edit`

---

## P1 - High Priority (Degraded Experience)

### 3. ~~Offers Page: No Link to Offers in Main Navigation~~ ✅ FIXED
- **Issue:** Bottom nav had Discover, Search, Saved, Bookings, Profile - no Offers tab
- **Resolution:** Replaced "Saved" with "Offers" in `BottomNav.tsx` (Saved accessible via Profile)

### 4. ~~Console.log in Production Code~~ ✅ FIXED
- **Location:** `src/pages/SearchPage.tsx:139`
- **Issue:** `console.log('User location:', location)` leaked data to console
- **Resolution:** Removed console.log, added explanatory comment

### 5. Hardcoded Mock Data Throughout
- **Locations:** Multiple pages use mock data directly instead of API calls
- **Examples:**
  - `OwnerDashboardPage.tsx` - hardcoded stats
  - `SupplierDashboardPage.tsx` - mock offer stats
  - `MyBookingsPage.tsx` - mock bookings
- **Impact:** Not production-ready
- **Note:** Expected for MVP, but needs API integration

---

## P2 - Medium Priority (Polish)

### 6. Incomplete Feature: Biometric Login
- **Location:** `src/pages/LoginPage.tsx:227`
- **Issue:** Comment says "TODO: Implement with WebAuthn or native biometrics"
- **Impact:** Biometric login button visible but non-functional

### 7. Incomplete Feature: OAuth Flows
- **Location:** `src/context/AuthContext.tsx:169`
- **Issue:** Comment says "TODO: Replace with actual OAuth flow"
- **Impact:** Google/Apple SSO uses mock implementation

### 8. Incomplete Feature: Business Profile Save
- **Location:** `src/pages/supplier/BusinessProfilePage.tsx:56`
- **Issue:** Comment says "TODO: Call API to save profile"
- **Impact:** Supplier profile changes not persisted

### 9. Error Tracking Not Implemented
- **Location:** `src/components/ErrorBoundary.tsx:41`
- **Issue:** Comment says "TODO: Send to error tracking service"
- **Impact:** Errors not reported to monitoring

---

## P3 - Low Priority (Minor Issues)

### 10. Booking Context API Call Placeholder
- **Location:** `src/context/BookingContext.tsx:227`
- **Issue:** Comment says "TODO: Replace with actual API call"

### 11. ~~Native Alert Usage~~ ✅ FIXED
- **Location:** `src/pages/owner/OwnerDashboardPage.tsx:31`
- **Issue:** Used `alert()` for broadcast confirmation
- **Resolution:** Replaced with `toast.success()` from ToastContext

### 12. ~~Favorites Persistence Error Handling~~ ✅ FIXED
- **Location:** `src/context/FavoritesContext.tsx`
- **Issue:** Errors only logged to console
- **Resolution:** Added `error` state to context and error banner in `FavoritesPage.tsx`

---

## UI/UX Observations

### 13. Loading States
- **Observation:** Many pages show skeleton loaders with 500ms artificial delay
- **Status:** Good pattern, but delays feel arbitrary
- **Recommendation:** Remove artificial delays once real APIs connected

### 14. Empty States
- **Observation:** Good empty state handling on most pages
- **Status:** Well implemented

### 15. Dark Mode
- **Observation:** Fully implemented throughout
- **Status:** Complete

### 16. Responsive Design
- **Observation:** Mobile-first design, works well on small screens
- **Status:** Good

---

## Missing Features (Per Documentation)

### From `docs/flows/offers/README.md`:
| Feature | Status |
|---------|--------|
| Browse Supplier Offers | ✅ Complete |
| Filter by Category | ✅ Complete |
| View Offer Details | ✅ Complete |
| View Supplier Details | ✅ Complete |
| Redeem Offer | ⚠️ UI only (no backend) |
| Save Offer for Later | ❌ Not implemented |
| Offers Near Campsite | ❌ Not implemented |
| Share Offer | ⚠️ Button exists, native share not wired |

### Supplier Flow:
| Feature | Status |
|---------|--------|
| Supplier Dashboard | ✅ Complete |
| Business Profile | ✅ Complete (no API save) |
| Manage Offers | ✅ Complete |
| Create/Edit Offers | ✅ Complete |

### Owner Flow:
| Feature | Status |
|---------|--------|
| Owner Dashboard | ✅ Complete |
| Manage Lots | ✅ Complete |
| View Bookings | ✅ Complete |
| Revenue Dashboard | ✅ Complete |
| Settings Pages | ✅ Complete |
| Create New Campsite | ❌ Route missing |

---

## Security Observations

### 1. Protected Routes
- **Status:** Implemented with `ProtectedRoute` component
- **Observation:** Owner/Supplier role checks working

### 2. Form Validation
- **Status:** Basic client-side validation present
- **Missing:** Server-side validation (pending API)

### 3. No Visible Security Issues
- **Status:** No obvious XSS, injection vulnerabilities in frontend code

---

## Recommended Priority Order

1. **Fix P0 issues** - Missing route and param mismatch (30 min)
2. **Remove console.log** - Quick fix (5 min)
3. **Add Offers to navigation** - UX improvement (1 hr)
4. **API Integration** - Major effort (ongoing)

---

## Summary

| Severity | Total | Fixed | Remaining |
|----------|-------|-------|-----------|
| P0 Critical | 2 | 2 | 0 |
| P1 High | 3 | 2 | 1 |
| P2 Medium | 4 | 0 | 4 |
| P3 Low | 3 | 2 | 1 |
| **Total** | **12** | **6** | **6** |

### Fixed Issues (6)
1. ✅ Missing `/owner/campsites/new` route
2. ✅ Owner offers route param mismatch
3. ✅ Added Offers to bottom navigation
4. ✅ Removed console.log from SearchPage
5. ✅ Replaced alert() with toast in OwnerDashboard
6. ✅ Added error feedback for favorites

### Remaining Issues (6)
- P1: Mock data throughout (expected for MVP)
- P2: Biometric login TODO
- P2: OAuth flows mock implementation
- P2: Business profile API save
- P2: Error tracking not implemented
- P3: Booking context API placeholder

The application is well-structured with good component organization. All critical (P0) issues are resolved.
