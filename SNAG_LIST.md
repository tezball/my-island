# UI Snag List - my-island

**Review Date:** 2025-12-31
**Reviewed By:** PM & Engineering Team
**App Version:** 1.0.0

---

## Summary

| Priority | Count |
|----------|-------|
| Critical (P0) | 2 |
| High (P1) | 9 |
| Medium (P2) | 8 |
| Low (P3) | 6 |
| **Total** | **25** |

---

## Critical Issues (P0)

### 1. Missing Profile Pages - Broken Navigation
**Location:** `/profile` page
**Issue:** Multiple menu items link to non-existent pages, resulting in 404 errors.

| Menu Item | Broken Link | Expected Route |
|-----------|-------------|----------------|
| Personal Info | `/profile/personal` | `/profile/personal-info` |
| Login & Security | `/profile/security` | Not implemented |
| Payment Methods | `/profile/payments` | Not implemented |
| Linked Accounts | `/profile/linked` | `/profile/linked-accounts` |
| Language | `/profile/language` | Not implemented |
| Appearance | `/profile/appearance` | Not implemented |
| Help Center | `/profile/help` | Not implemented |
| Contact Us | `/profile/contact` | Not implemented |
| Terms & Policies | `/profile/terms` | Not implemented |

**Impact:** Users cannot access critical account settings
**Fix:** Either update links in `ProfilePage.tsx` to match existing routes OR create the missing pages

---

### 2. HTML Nesting Errors - Offers Page
**Location:** `/offers`
**Issue:** Console errors indicate `<button>` elements are nested inside other `<button>` elements.

```
Error: In HTML, <button> cannot be a descendant of <button>
```

**Impact:** Accessibility issues, potential hydration errors, unpredictable click behavior
**Fix:** Refactor `OffersPage.tsx` to use proper element nesting (e.g., use `<div>` with onClick instead of nested buttons)

---

## High Priority Issues (P1)

### 3. Chart Dimension Warnings
**Location:** `/owner/stats`
**Issue:** Recharts console warnings about negative width/height values.

```
Warning: The width(-1) and height(-1) of chart should be greater than 0
```

**Impact:** Charts may not render correctly on initial load
**Fix:** Ensure chart containers have explicit dimensions or use ResponsiveContainer properly

---

### 4. Missing Route: Login & Security Page
**Location:** Profile section
**Issue:** No page exists for `/profile/security` - users cannot manage password, 2FA, or security settings
**Impact:** Security-critical functionality missing
**Fix:** Create `SecuritySettingsPage.tsx` with password change, 2FA setup, active sessions

---

### 5. Missing Route: Payment Methods (Profile)
**Location:** Profile section
**Issue:** `/profile/payments` returns 404; route exists at `/payment-methods` but profile links to wrong path
**Impact:** Users cannot manage saved payment methods from profile
**Fix:** Update ProfilePage link to `/payment-methods` OR create redirect

---

### 6. Missing Route: Language Settings
**Location:** Profile preferences
**Issue:** No language selection page exists
**Impact:** i18n functionality not accessible
**Fix:** Create `LanguageSettingsPage.tsx` or integrate into Settings page

---

### 7. Missing Route: Appearance Settings
**Location:** Profile preferences
**Issue:** `/profile/appearance` returns 404; Settings page has appearance toggle but no dedicated page
**Impact:** Inconsistent navigation - settings exist in `/settings` but linked from `/profile/appearance`
**Fix:** Redirect `/profile/appearance` to `/settings` OR create dedicated page

---

### 8. Missing Route: Help Center
**Location:** Profile support section
**Issue:** `/profile/help` returns 404; Help exists at `/support` but profile links to wrong path
**Impact:** Users cannot access help from profile
**Fix:** Update link to `/support` OR create redirect

---

### 9. Missing Route: Contact Us (Profile)
**Location:** Profile support section
**Issue:** `/profile/contact` returns 404; Contact exists at `/support/contact`
**Impact:** Broken navigation to support
**Fix:** Update link to `/support/contact`

---

### 10. Missing Route: Terms & Policies
**Location:** Profile support section
**Issue:** No terms/privacy policy page exists
**Impact:** Legal compliance issue - users cannot view terms
**Fix:** Create `TermsPage.tsx` with Terms of Service and Privacy Policy content

---

### 11. Inconsistent Linked Accounts Path
**Location:** Profile section
**Issue:** Profile links to `/profile/linked` but route is `/profile/linked-accounts`
**Impact:** 404 error when accessing linked accounts
**Fix:** Update `ProfilePage.tsx` line 20: change `/profile/linked` to `/profile/linked-accounts`

---

## Medium Priority Issues (P2)

### 12. No Access to Offers from Main Navigation
**Location:** Bottom navigation
**Issue:** Offers page exists but has no entry point in main navigation
**Impact:** Feature discoverability - users may not find local offers
**Fix:** Add Offers to bottom nav OR add prominent link on Discover page

---

### 13. Settings Page Not Linked from Profile
**Location:** Profile page
**Issue:** `/settings` page exists but no direct link from Profile page
**Impact:** Users may not discover settings functionality
**Fix:** Add Settings link to Profile page menu

---

### 14. Duplicate Notification Icons on Owner Lots Page
**Location:** `/owner/lots`
**Issue:** Header shows two notification icons (one button, one link)
**Impact:** Visual clutter, confusing UX
**Fix:** Remove duplicate notification button from header

---

### 15. Missing Review Creation from Notification Link
**Location:** Notifications page
**Issue:** "Share Your Experience" notification links to `/reviews/new?campsite=camp-4` which doesn't exist
**Impact:** Users cannot write reviews from notification prompt
**Fix:** Update link to `/campsite/camp-4/review` (correct route)

---

### 16. Calendar Shows Wrong Month on Modify Dates
**Location:** `/bookings/:id/modify-dates`
**Issue:** Calendar defaults to December 2025 instead of current/booking month
**Impact:** Users must navigate multiple months to find relevant dates
**Fix:** Initialize calendar to booking's current check-in month

---

### 17. No Empty State for Past Bookings
**Location:** `/bookings` - Past tab
**Issue:** If user has no past bookings, no empty state message shown
**Impact:** Unclear whether data is loading or genuinely empty
**Fix:** Add EmptyState component for past bookings tab

---

### 18. Owner Dashboard Settings Button Non-functional
**Location:** `/owner`
**Issue:** Settings gear icon in header has no navigation action
**Impact:** Users cannot access owner settings from dashboard
**Fix:** Link to `/owner/settings`

---

### 19. No Loading States on Data Fetch
**Location:** Multiple pages
**Issue:** Pages render immediately with mock data - no loading skeletons
**Impact:** When connected to real API, users will see jarring content shifts
**Fix:** Add loading skeleton states for main content areas

---

## Low Priority Issues (P3)

### 20. Inconsistent Header Styles
**Location:** Various pages
**Issue:** Some pages show logo header, others show back button with title
**Impact:** Minor inconsistency in navigation patterns
**Recommendation:** Document header usage guidelines; ensure consistency

---

### 21. Map Placeholder Instead of Real Map
**Location:** `/campsite/:id` - Location tab
**Issue:** Shows static placeholder text "Interactive map" instead of actual Leaflet map
**Impact:** Users cannot see campsite location visually
**Fix:** Integrate MapView component into campsite detail location section

---

### 22. Missing Campsite Type Icons
**Location:** Various campsite cards
**Issue:** Type badges show text like "tent", "campervan" without visual icons
**Impact:** Minor visual polish issue
**Fix:** Add icons alongside type text

---

### 23. Phone Number Formatting
**Location:** `/support`
**Issue:** Phone link href uses `+353123456789` but displays as `+353 1 234 5678`
**Impact:** Minor - may cause confusion if copied
**Fix:** Ensure href matches displayed format

---

### 24. Version Number Hardcoded
**Location:** Profile page, Settings page
**Issue:** Version "1.0.0" is hardcoded in multiple places
**Impact:** Maintenance burden when updating version
**Fix:** Create shared constant or read from package.json

---

### 25. No Favicon
**Location:** Browser tab
**Issue:** Default Vite favicon shown instead of app branding
**Impact:** Minor branding issue
**Fix:** Add custom favicon.ico and update index.html

---

## Pages Missing Entirely (Not Implemented)

These pages are referenced in the design but have no corresponding routes:

| Page | Purpose | Priority |
|------|---------|----------|
| Security Settings | Password, 2FA, sessions | P1 |
| Language Settings | App language selection | P2 |
| Terms & Policies | Legal documents | P1 |
| Owner Booking Detail | View single booking (owner) | P2 |
| Write Review (from notification) | Review submission | P2 |

---

## Recommendations

### Immediate Actions (This Sprint)
1. Fix ProfilePage broken links (Update paths to match existing routes)
2. Fix HTML nesting on Offers page
3. Fix chart dimension warnings

### Next Sprint
1. Create missing security/terms pages
2. Add Offers to navigation
3. Implement loading states

### Backlog
1. Real map integration on campsite detail
2. Favicon and branding assets
3. Version number automation

---

## Testing Notes

- All testing performed on `localhost:5174`
- Browser: Chromium (via Playwright)
- Screen size: Default desktop viewport
- Dark mode: Not tested in this review
- Mobile responsiveness: Not tested in this review

---

*Generated from Playwright UI review session*
