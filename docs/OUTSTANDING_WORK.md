# my-island Outstanding Work

**Consolidated:** January 1, 2026
**Current Status:** ~75% MVP Complete
**Source Documents:** MVP_ROADMAP.md, roadmap.md

---

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0 - Critical | 15 | Must fix before launch |
| P1 - High | 28 | Required for MVP |
| P2 - Medium | 18 | Should fix for MVP |
| P3 - Low | 25+ | Post-MVP polish |

---

## P0 - Critical Blockers

### Authentication & Authorization

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Create AuthContext | React context for auth state management | `src/context/AuthContext.tsx` (new) | Not Started |
| Implement route guards | Protect authenticated routes, redirect to login | `src/App.tsx`, new `ProtectedRoute.tsx` | Not Started |
| Connect login to backend | Replace mock setTimeout with real API call | `src/pages/LoginPage.tsx:52-64` | Not Started |
| Connect signup to backend | Replace mock registration flow | `src/pages/SignUpPage.tsx:101-107` | Not Started |
| Session persistence | Store auth token securely, auto-login on return | AuthContext | Not Started |

**Impact:** Protected routes (`/bookings`, `/settings`, `/favorites`, `/notifications`) currently accessible without login. Shows hardcoded user "Alex Walker" on settings page.

### Booking Flow

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Create BookingContext | Manage booking state across flow | `src/context/BookingContext.tsx` (new) | Not Started |
| Fix blank BookingSummaryPage | Show error state instead of null when context missing | `src/pages/BookingSummaryPage.tsx:27-29` | Not Started |
| Persist booking state | Store in sessionStorage/URL params for refresh resilience | BookingContext | Not Started |

**Current broken code:**
```typescript
// src/pages/BookingSummaryPage.tsx:27-29
if (!booking.campsite || !booking.lot) {
  return null  // Returns blank page
}

// Should be:
if (!booking.campsite || !booking.lot) {
  return <BookingExpiredState onRestart={() => navigate(`/campsite/${id}`)} />
}
```

### Currency Consistency

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Standardize currency to € | Create formatCurrency() utility, replace all $ with € | Multiple | Not Started |
| Fix owner pages currency | Currently showing $ instead of € | `src/pages/owner/OwnerBookingsPage.tsx`, `src/pages/owner/ManageLotsPage.tsx` | Not Started |

### Core Infrastructure

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| API service layer | Create axios/fetch wrapper with auth headers | New file | Not Started |
| Error handling utilities | Global error boundary, toast notifications | New files | Not Started |
| Environment configuration | Dev/staging/prod environment variables | `.env` files | Not Started |

---

## P1 - High Priority (Required for MVP)

### Data & Mock Fixes

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Fix stale mock dates | Booking dates Jan-Apr 2025 shown as "Upcoming" | `src/mocks/data/bookings.ts`, `src/data/mockData.ts` | Not Started |

### Navigation & UX

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Bottom navigation consistency | Show nav consistently across visitor flow | `src/components/layout/BottomNav.tsx`, `AppShell.tsx` | Not Started |
| Add loading skeletons | Show skeletons on all data-fetching pages | Multiple pages | Partial |
| Toast notification system | Global feedback for actions | New component | Not Started |

### Search & Discovery

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Connect search input | Typing doesn't filter results, add debounce | `src/pages/SearchPage.tsx` | Not Started |
| Connect filter modal | Filter selections don't persist or apply | `src/components/ui/FilterModal.tsx` | Not Started |
| Empty search state | Design and implement "no results" UI | `src/pages/SearchPage.tsx` | Not Started |
| Connect search to backend | Replace mock data with API calls | `src/pages/SearchPage.tsx` | Not Started |
| Connect map markers to API | Fetch campsites by location/bounds | `src/pages/DiscoverPage.tsx` | Not Started |

### Booking Management

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Connect My Bookings to API | Fetch real user bookings | `src/pages/MyBookingsPage.tsx:33-38` | Not Started |
| Implement booking modification | Connect modify dates/guests to backend | `src/pages/ModifyDatesPage.tsx`, `src/pages/ModifyGuestsPage.tsx` | Not Started |
| Implement booking cancellation | Connect to backend with refund logic | `src/pages/CancelConfirmPage.tsx`, `src/pages/CancellationSuccessPage.tsx` | Not Started |
| Check-in instructions from backend | Fetch access codes and instructions | `src/pages/CheckInInstructionsPage.tsx` | Not Started |

### Campsite Details

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Connect to backend API | Fetch campsite details from API | `src/pages/CampsiteDetailPage.tsx` | Not Started |
| Connect reviews to backend | Show all reviews from API | `src/pages/ReviewsPage.tsx` | Partial |
| Submit review to backend | Connect review form to API | `src/pages/WriteReviewPage.tsx` | Not Started |

### Owner Dashboard

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Owner role authentication | Verify owner role before accessing /owner routes | All owner pages | Not Started |
| Connect dashboard to backend | Fetch real stats and bookings | `src/pages/owner/OwnerDashboardPage.tsx` | Not Started |
| Connect owner bookings list | Fetch owner's campsite bookings | `src/pages/owner/OwnerBookingsPage.tsx` | Not Started |
| Lot calendar - block dates | Allow owners to block/unblock dates | `src/pages/LotCalendarPage.tsx` | Not Started |
| Statistics charts | Add real chart visualizations (recharts) | `src/pages/owner/OwnerStatsPage.tsx` | Partial |

### Forms & Validation

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Form validation library | Consistent validation across forms (zod/yup) | New setup | Not Started |
| Form validation feedback | Inline error messages on all forms | All form pages | Partial |

---

## P2 - Medium Priority (Should Fix for MVP)

### Authentication Enhancements

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Complete Google OAuth flow | Replace simulated SSO with real OAuth | `src/pages/SSOAuthPage.tsx` | Not Started |
| Complete Apple OAuth flow | Replace simulated SSO with real OAuth | `src/pages/SSOAuthPage.tsx` | Not Started |
| Remove Face ID option on web | Conditionally render based on platform | `src/pages/LoginPage.tsx:184-199` | Not Started |
| Email verification flow | Connect verify-email page to backend | `src/pages/EmailVerificationPage.tsx` | Not Started |
| Password reset flow | Connect forgot/reset password to backend | `src/pages/ForgotPasswordPage.tsx`, `src/pages/SetNewPasswordPage.tsx` | Not Started |
| Logout functionality | Clear session, redirect to login | `src/pages/ProfilePage.tsx` or Settings | Not Started |

### Payment & Booking

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Connect date selection to API | Validate availability against backend | `src/pages/SelectDatesPage.tsx` | Not Started |
| Connect guest/extras to API | Validate capacity, calculate pricing server-side | `src/pages/GuestExtrasPage.tsx` | Not Started |
| Implement payment processing | Integrate Stripe or payment provider | `src/pages/BookingPaymentPage.tsx`, `src/pages/PaymentProcessingPage.tsx` | Not Started |
| Handle payment failures | Show proper error states with retry options | `src/pages/PaymentFailedPage.tsx` | Not Started |
| Implement promo codes | Validate and apply discount codes | `src/components/booking/PromoCodeModal.tsx` | Not Started |
| Add payment method form | Card entry form with validation | `src/pages/AddPaymentMethodPage.tsx` | Partial |

### User Profile

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Connect profile to backend | Fetch user data from API | `src/pages/ProfilePage.tsx` | Not Started |
| Profile avatar upload | Implement image upload functionality | `src/pages/ProfileEditPage.tsx` | Not Started |
| Default avatar fallback | Show initials or placeholder when no avatar | Profile components | Not Started |

### Contact & Reviews

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Contact host form submission | Form exists but no submission handler | `src/pages/ContactHostPage.tsx` | Not Started |
| Review submission | Can write review but submission doesn't work | `src/pages/ReviewSubmissionPage.tsx` | Not Started |
| Generate booking receipt | Create downloadable PDF receipt | `src/pages/BookingReceiptPage.tsx` | Not Started |

---

## P3 - Low Priority (Post-MVP Polish)

### Accessibility

| Task | Description |
|------|-------------|
| ARIA labels | Add to all interactive elements |
| Keyboard navigation | Full keyboard support |
| Focus management | Proper focus in modals and flows |
| Color contrast fixes | WCAG 2.1 AA compliance |
| Screen reader testing | Test with VoiceOver/NVDA |

### Performance

| Task | Description |
|------|-------------|
| Image lazy loading | Defer off-screen images |
| Image optimization | Compress and resize images |
| Code splitting | Dynamic imports for routes |
| Component memoization | React.memo for expensive components |
| Bundle size reduction | Tree shaking, dependency audit |

### Dark Mode

| Task | Description |
|------|-------------|
| Component support | Some components don't fully support dark mode |
| Toggle persistence | State doesn't persist across sessions |

### PWA Support

| Task | Description |
|------|-------------|
| Offline mode | Service worker for offline access |
| Install prompt | Add to home screen prompt |

### SEO & Marketing

| Task | Description |
|------|-------------|
| Meta tags | Title, description for all pages |
| Open Graph tags | Social sharing previews |
| Structured data | JSON-LD for campsites |
| Sitemap generation | Dynamic sitemap.xml |
| Favicon variations | All device favicon sizes |

### Internationalization

| Task | Description |
|------|-------------|
| i18n framework setup | react-i18next or similar |
| Extract hardcoded strings | Replace all text with translation keys |
| Multi-currency support | EUR, GBP, USD display options |
| Date/time localization | Respect user locale preferences |

### Testing

| Task | Description |
|------|-------------|
| Unit tests | Jest tests for utilities and hooks |
| Component tests | React Testing Library for components |
| Integration tests | API integration tests |
| E2E tests | Playwright/Cypress for critical flows |

### Analytics & Monitoring

| Task | Description |
|------|-------------|
| Error tracking | Sentry integration |
| Analytics | Mixpanel/Amplitude for user events |
| Performance monitoring | Core Web Vitals tracking |

---

## Technical Debt

| Item | Description | Impact |
|------|-------------|--------|
| No AuthContext | Auth state not centralized | High |
| All mock data | No backend integration | High |
| No error boundaries | Component crashes unhandled | Medium |
| Hardcoded user "Alex Walker" | Settings page shows mock user | Medium |
| No unit/integration tests | Zero test coverage | High |
| No CI/CD pipeline | Manual deployment | Medium |
| Face ID on web | Shows unsupported feature | Low |
| MSW handlers need replacement | All MSW handlers need real API | High |

---

## Files Requiring Immediate Attention

| File | Issue | Priority |
|------|-------|----------|
| `src/context/AuthContext.tsx` | Does not exist - needs creation | P0 |
| `src/context/BookingContext.tsx` | Does not exist - needs creation | P0 |
| `src/pages/BookingSummaryPage.tsx` | Blank page bug (lines 27-29) | P0 |
| `src/pages/owner/OwnerBookingsPage.tsx` | Currency shows $ instead of € | P0 |
| `src/pages/owner/ManageLotsPage.tsx` | Currency shows $ instead of € | P0 |
| `src/mocks/data/bookings.ts` | Stale dates (Jan-Apr 2025) | P1 |
| `src/data/mockData.ts` | Booking dates are stale | P1 |
| `src/pages/SettingsPage.tsx` | Hardcoded user data | P1 |
| `src/pages/MyBookingsPage.tsx` | No auth guard, accessible without login | P1 |
| `src/pages/FavoritesPage.tsx` | No auth guard, accessible without login | P1 |
| `src/pages/ProfilePage.tsx` | No auth guard, accessible without login | P1 |
| `src/components/ui/FilterModal.tsx` | Filter selections don't apply | P1 |
| `src/pages/LoginPage.tsx:184-199` | Shows Face ID on web | P2 |

---

## Milestones

### Milestone 1: Authentication Complete
- [ ] AuthContext implemented
- [ ] Login/signup connected to backend
- [ ] SSO working (Google + Apple)
- [ ] Protected routes enforced
- [ ] Session persistence working

### Milestone 2: Core Booking Flow
- [ ] BookingContext implemented
- [ ] Booking state persisted across refresh
- [ ] BookingSummaryPage handles missing context
- [ ] Full booking flow connected to backend
- [ ] Payment processing working

### Milestone 3: User Features Complete
- [ ] My Bookings connected to API
- [ ] Profile management working
- [ ] Favorites synced
- [ ] Notifications working
- [ ] Currency standardized to €

### Milestone 4: Owner Portal Complete
- [ ] All owner pages connected
- [ ] Revenue dashboard functional
- [ ] Lot/campsite management working
- [ ] Statistics charts implemented
- [ ] Currency fixed on owner pages

### Milestone 5: MVP Launch Ready
- [ ] All P0 and P1 tasks complete
- [ ] Basic error handling in place
- [ ] Loading states everywhere
- [ ] Search/filter functionality working
- [ ] Bottom navigation consistent

---

## Backend API Status

**Implemented Endpoints:**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login (returns JWT)
- `POST /api/auth/refresh` - Refresh token
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile
- `DELETE /api/users/me` - Delete account

**Needed Endpoints:**
- Campsite CRUD
- Booking CRUD
- Favorites management
- Notifications
- Reviews
- Payment processing
- Owner dashboard stats
- File uploads (S3)

---

*Document consolidated: January 1, 2026*