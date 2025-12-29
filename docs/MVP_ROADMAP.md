# my-island MVP Roadmap & Snag List

**Review Date:** December 29, 2025
**Reviewed By:** Product Manager (Strict Review)
**App Version:** 1.0.2 Build 2045

---

## Executive Summary

The my-island camping/glamping booking platform has strong foundations with 68 pages implemented, comprehensive mock data (120 campsites), and polished UI design. However, several critical issues must be resolved before MVP launch.

**Overall Completeness:** ~75% MVP-ready
**Critical Blockers:** 3
**High Priority Issues:** 6
**Medium Priority Issues:** 8
**Low Priority/Polish:** 10+

---

## Critical Blockers (P0) - Must Fix Before Launch

### 1. Booking Summary Page Renders Blank
**Location:** `src/pages/BookingSummaryPage.tsx:27-29`
**Issue:** Page returns `null` when `booking.campsite` or `booking.lot` is not in context
**Impact:** Users who refresh page or navigate directly see blank screen
**Fix:** Add redirect to campsite detail page or show error state with "Start Booking" CTA

```typescript
// Current (broken)
if (!booking.campsite || !booking.lot) {
  return null
}

// Should be
if (!booking.campsite || !booking.lot) {
  return <BookingExpiredState onRestart={() => navigate(`/campsite/${id}`)} />
}
```

### 2. Currency Inconsistency (€ vs $)
**Locations:**
- Visitor pages: Uses € (Euro) - correct for Ireland market
- Owner pages: Uses $ (USD) - `src/pages/OwnerBookingsPage.tsx`, `src/pages/ManageLotsPage.tsx`

**Impact:** Confusing UX, unprofessional appearance
**Fix:** Standardize all currency to € across the entire app. Create a `formatCurrency()` utility.

### 3. Authentication Not Enforced on Protected Routes
**Locations:**
- `/bookings` - Shows mock bookings without login
- `/settings` - Shows hardcoded user "Alex Walker" without login
- `/favorites` - Shows favorites without login
- `/notifications` - Shows notifications without login

**Impact:** Privacy violation, confusing state management
**Fix:** Implement route guards using `AuthContext`. Redirect unauthenticated users to login.

---

## High Priority (P1) - Required for MVP

### 4. Mock Data Dates Are Stale
**Location:** `src/mocks/data/bookings.ts`
**Issue:** Booking dates are Jan-Apr 2025, shown as "Upcoming" when they're now in the past
**Impact:** Demo looks broken, undermines credibility
**Fix:** Use relative dates (e.g., `today + 7 days`) or update mock data to future dates

### 5. Bottom Navigation Inconsistency
**Issue:** Bottom nav appears on some pages but not others:
- Present: Search, Map, Favorites, Notifications
- Missing: My Bookings, Settings, Owner pages

**Impact:** Inconsistent navigation, users get stuck
**Fix:** Implement consistent navigation rules:
- Visitor flow: Always show bottom nav
- Owner flow: Show owner-specific bottom nav
- Booking flow: Hide during multi-step process

### 6. Booking Flow State Not Persisted
**Issue:** Booking context resets on page refresh
**Impact:** Users lose booking progress if they refresh
**Fix:** Persist booking state to `sessionStorage` or URL params

### 7. No Loading States on Data Fetches
**Issue:** Many pages show blank content while loading
**Impact:** Users think app is broken
**Fix:** Add skeleton loaders (component exists: `src/components/ui/Skeleton.tsx`)

### 8. Filter Modal Not Functional
**Location:** `src/components/ui/FilterModal.tsx`
**Issue:** Filter selections don't persist or apply to search results
**Fix:** Connect filter state to search query params and API calls

### 9. Search Input Not Connected
**Location:** Search page header
**Issue:** Typing in search box doesn't filter results
**Fix:** Debounce input and filter campsites by name/location

---

## Medium Priority (P2) - Should Fix for MVP

### 10. Profile Avatar Placeholder Missing
**Location:** Settings page user card
**Issue:** Empty circle where avatar should be
**Fix:** Add default avatar image or initials fallback

### 11. Face ID Option on Web
**Location:** `src/pages/LoginPage.tsx`
**Issue:** Shows Face ID option which isn't available on web
**Fix:** Conditionally render based on platform detection

### 12. No Form Validation Feedback
**Locations:** Login, Signup, Add Payment forms
**Issue:** Invalid inputs don't show error messages
**Fix:** Add inline validation with error states

### 13. Promo Code Modal Not Implemented
**Location:** `src/components/booking/PromoCodeModal.tsx`
**Issue:** Modal exists but promo code application logic missing
**Fix:** Add promo code validation and discount calculation

### 14. Contact Host Form Doesn't Submit
**Location:** `src/pages/ContactHostPage.tsx`
**Issue:** Form UI exists but no submission handler
**Fix:** Add MSW handler and success/error states

### 15. Review Submission Not Connected
**Location:** `src/pages/ReviewSubmissionPage.tsx`
**Issue:** Can write review but submission doesn't work
**Fix:** Add MSW handler and confirmation flow

### 16. Lot Calendar Not Interactive
**Location:** `src/pages/LotCalendarPage.tsx`
**Issue:** Shows calendar but can't block/unblock dates
**Fix:** Add date selection and availability toggle

### 17. Owner Statistics Charts Placeholder
**Location:** `src/pages/CampsiteStatisticsPage.tsx`
**Issue:** Stats displayed but no actual charts/graphs
**Fix:** Add chart library (recharts) and visualizations

---

## Low Priority (P3) - Polish for Post-MVP

### 18. Accessibility Issues
- Missing ARIA labels on interactive elements
- Focus management in modals incomplete
- Color contrast issues in some badges

### 19. Dark Mode Inconsistencies
- Some components don't fully support dark mode
- Toggle state doesn't persist across sessions

### 20. Image Loading Optimization
- No lazy loading on campsite images
- No placeholder/blur-up effect
- Large images not optimized

### 21. Error Boundaries Missing
- No graceful error handling for component crashes
- No error reporting/logging

### 22. SEO & Meta Tags
- Missing meta descriptions
- No Open Graph tags for social sharing
- Missing favicon variations

### 23. PWA Support
- Service worker registered but offline mode incomplete
- No install prompt handling

### 24. Internationalization Prep
- Hardcoded strings throughout
- No i18n framework setup
- Date/currency formatting inconsistent

### 25. Performance Optimizations
- No code splitting beyond routes
- No memoization on expensive components
- Bundle size could be reduced

---

## Positive Observations

- **UI/UX Quality:** Design system is polished and consistent
- **Component Library:** Well-structured reusable components
- **Mock Data:** Comprehensive and realistic (120 campsites)
- **Multi-Role Support:** Visitor/Owner flows properly separated
- **Mobile-First:** Responsive design works well
- **Code Quality:** Clean TypeScript, good patterns
- **Map Integration:** Leaflet implementation works smoothly

---

## MVP Launch Checklist

### Phase 1: Critical Fixes (Week 1)
- [ ] Fix booking summary blank page
- [ ] Standardize currency to €
- [ ] Add authentication route guards
- [ ] Update mock booking dates

### Phase 2: Core Functionality (Week 2)
- [ ] Fix bottom navigation consistency
- [ ] Persist booking flow state
- [ ] Add loading skeletons
- [ ] Connect search/filter functionality

### Phase 3: Forms & Validation (Week 3)
- [ ] Form validation on all inputs
- [ ] Contact host submission
- [ ] Review submission
- [ ] Promo code functionality

### Phase 4: Polish & QA (Week 4)
- [ ] Profile avatar fallbacks
- [ ] Platform-specific features
- [ ] Owner dashboard charts
- [ ] End-to-end testing

---

## Technical Debt Notes

1. **API Integration Points:** All MSW handlers need real API replacement
2. **State Management:** Consider upgrading to Zustand if complexity grows
3. **Testing:** No unit/integration tests currently
4. **CI/CD:** No automated build/deploy pipeline
5. **Monitoring:** No error tracking (add Sentry)
6. **Analytics:** No usage tracking (add Mixpanel/Amplitude)

---

## Files Requiring Immediate Attention

| File | Issue | Priority |
|------|-------|----------|
| `src/pages/BookingSummaryPage.tsx` | Blank page bug | P0 |
| `src/pages/OwnerBookingsPage.tsx` | Wrong currency | P0 |
| `src/pages/ManageLotsPage.tsx` | Wrong currency | P0 |
| `src/mocks/data/bookings.ts` | Stale dates | P1 |
| `src/pages/SettingsPage.tsx` | Hardcoded user | P1 |
| `src/pages/MyBookingsPage.tsx` | No auth guard | P1 |
| `src/context/BookingContext.tsx` | No persistence | P1 |
| `src/components/ui/FilterModal.tsx` | Not functional | P1 |

---

*Document generated: December 29, 2025*
