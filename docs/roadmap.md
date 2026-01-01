# my-island Product Roadmap

**Created:** January 1, 2026
**Review Perspective:** PM, UX, Engineering
**Current Status:** ~75% MVP Complete

---

## Executive Summary

The my-island camping/glamping booking platform has a solid foundation with 83 page components, 120 mock campsites, and well-structured dual user flows (guests and owners). The frontend is built with React 19 + TypeScript 5.9 + Vite 7, while the backend (Spring Boot 4.0.1) is in early stages and not yet connected.

### Key Findings

**Strengths:**
- Comprehensive UI with polished design system
- Well-organized component library (19 reusable components)
- Complete routing structure (~70 routes)
- Thorough TypeScript types for all entities
- Mobile-first responsive design
- Good separation between guest and owner flows

**Critical Gaps:**
- No AuthContext - authentication state not managed
- No backend API integration (all mock data)
- Protected routes accessible without login
- Booking flow state not persisted
- No real-time data updates

---

## MVP Tasks

### 1. Authentication & SSO

**Priority: P0 - Critical**

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Implement AuthContext | Create React context for auth state management | `src/context/AuthContext.tsx` (new) | Not Started |
| Connect login to backend API | Replace mock setTimeout with real API call | `src/pages/LoginPage.tsx:52-64` | Not Started |
| Connect signup to backend API | Replace mock registration flow | `src/pages/SignUpPage.tsx:101-107` | Not Started |
| Implement route guards | Protect authenticated routes, redirect to login | `src/App.tsx`, new `ProtectedRoute.tsx` | Not Started |
| Complete Google OAuth flow | Replace simulated SSO with real OAuth | `src/pages/SSOAuthPage.tsx` | Not Started |
| Complete Apple OAuth flow | Replace simulated SSO with real OAuth | `src/pages/SSOAuthPage.tsx` | Not Started |
| Session persistence | Store auth token securely, auto-login on return | AuthContext | Not Started |
| Logout functionality | Clear session, redirect to login | `src/pages/ProfilePage.tsx` or Settings | Not Started |
| Remove Face ID option on web | Conditionally render based on platform | `src/pages/LoginPage.tsx:184-199` | Not Started |
| Email verification flow | Connect verify-email page to backend | `src/pages/EmailVerificationPage.tsx` | Not Started |
| Password reset flow | Connect forgot/reset password to backend | `src/pages/ForgotPasswordPage.tsx`, `src/pages/SetNewPasswordPage.tsx` | Not Started |

---

### 2. Booking Flow

**Priority: P0 - Critical**

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Create BookingContext | Manage booking state across flow | `src/context/BookingContext.tsx` (new) | Not Started |
| Persist booking state | Store in sessionStorage/URL params for refresh resilience | BookingContext | Not Started |
| Handle missing booking state | Show error state with "Start Booking" CTA instead of blank page | All booking pages | Not Started |
| Connect date selection to API | Validate availability against backend | `src/pages/SelectDatesPage.tsx` | Not Started |
| Connect guest/extras to API | Validate capacity, calculate pricing server-side | `src/pages/GuestExtrasPage.tsx` | Not Started |
| Implement payment processing | Integrate Stripe or payment provider | `src/pages/BookingPaymentPage.tsx`, `src/pages/PaymentProcessingPage.tsx` | Not Started |
| Handle payment failures | Show proper error states with retry options | `src/pages/PaymentFailedPage.tsx` | Not Started |
| Generate booking confirmation | Create booking record in backend, send confirmation email | `src/pages/BookingConfirmationPage.tsx` | Not Started |
| Add payment method form | Card entry form with validation | `src/pages/AddPaymentMethodPage.tsx` | Partial |
| Implement promo codes | Validate and apply discount codes | Booking flow | Not Started |

---

### 3. Booking Management (My Bookings)

**Priority: P1 - High**

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Connect to backend API | Fetch real user bookings | `src/pages/MyBookingsPage.tsx:33-38` | Not Started |
| Fix stale mock dates | Use relative dates or update to future dates | `src/data/mockData.ts` | Not Started |
| Implement booking modification | Connect modify dates/guests to backend | `src/pages/ModifyDatesPage.tsx`, `src/pages/ModifyGuestsPage.tsx` | Not Started |
| Implement booking cancellation | Connect to backend with refund logic | `src/pages/CancelConfirmPage.tsx`, `src/pages/CancellationSuccessPage.tsx` | Not Started |
| Connect contact host form | Send messages to backend | `src/pages/ContactHostPage.tsx` | Not Started |
| Generate booking receipt | Create downloadable PDF receipt | `src/pages/BookingReceiptPage.tsx` | Not Started |
| Check-in instructions from backend | Fetch access codes and instructions | `src/pages/CheckInInstructionsPage.tsx` | Not Started |
| Require authentication | Add route guard, redirect unauthenticated users | `src/pages/MyBookingsPage.tsx` | Not Started |

---

### 4. Discovery & Search

**Priority: P1 - High**

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Connect search to backend | Replace mock data with API calls | `src/pages/SearchPage.tsx` | Not Started |
| Implement search input | Connect search box to filter results with debounce | `src/pages/SearchPage.tsx` | Not Started |
| Implement filter modal | Make filter selections persist and apply | `FilterModal.tsx` (if exists) | Not Started |
| Add loading states | Show skeleton loaders while fetching | `src/pages/SearchPage.tsx`, `src/pages/DiscoverPage.tsx` | Partial |
| Empty search state | Design and implement "no results" UI | `src/pages/SearchPage.tsx` | Not Started |
| Connect map markers to API | Fetch campsites by location/bounds | `src/pages/DiscoverPage.tsx` | Not Started |
| Implement list/grid toggle | Add alternative view for map page | `src/pages/DiscoverPage.tsx` | Not Started |
| Add map cluster drill-down | Expand clustered pins on click | MapView component | Not Started |

---

### 5. Campsite Details

**Priority: P1 - High**

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Connect to backend API | Fetch campsite details from API | `src/pages/CampsiteDetailPage.tsx` | Not Started |
| Photo gallery carousel | Implement swipeable image gallery | `src/pages/PhotoGalleryPage.tsx` | Implemented |
| Reviews list page | Connect to backend, show all reviews | `src/pages/ReviewsPage.tsx` | Partial |
| Submit review to backend | Connect review form to API | `src/pages/WriteReviewPage.tsx` | Not Started |
| Supplier detail navigation | Make supplier cards clickable | `src/pages/CampsiteDetailPage.tsx`, `src/pages/SupplierDetailPage.tsx` | Partial |
| Lot visual selection | Add interactive lot map or visual selector | `src/pages/CampsiteDetailPage.tsx` | Not Started |

---

### 6. User Profile & Settings

**Priority: P2 - Medium**

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Connect profile to backend | Fetch user data from API | `src/pages/ProfilePage.tsx` | Not Started |
| Require authentication | Redirect unauthenticated users to login | `src/pages/ProfilePage.tsx`, `src/pages/SettingsPage.tsx` | Not Started |
| Edit profile form | Connect to backend update API | `src/pages/ProfileEditPage.tsx` | Partial |
| Profile avatar upload | Implement image upload functionality | `src/pages/ProfileEditPage.tsx` | Not Started |
| Default avatar fallback | Show initials or placeholder when no avatar | Profile components | Not Started |
| Personal info update | Connect form to backend | `src/pages/PersonalInfoPage.tsx` | Partial |
| Linked accounts management | Connect/disconnect social accounts | `src/pages/LinkedAccountsPage.tsx` | Partial |
| Notification preferences | Connect to backend settings | `src/pages/NotificationSettingsPage.tsx` | Partial |
| Payment methods list | Fetch saved cards from backend | `src/pages/PaymentMethodsPage.tsx` | Partial |

---

### 7. Favorites

**Priority: P2 - Medium**

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Require authentication | Redirect unauthenticated users | `src/pages/FavoritesPage.tsx` | Not Started |
| Connect to backend API | Fetch user's favorited campsites | `src/pages/FavoritesPage.tsx` | Not Started |
| Add/remove favorites | Toggle favorite status with API call | CampsiteCard, CampsiteDetailPage | Not Started |
| Sync favorites state | Update UI optimistically with error handling | Favorites context | Not Started |

---

### 8. Notifications

**Priority: P2 - Medium**

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Require authentication | Redirect unauthenticated users | `src/pages/NotificationsPage.tsx` | Not Started |
| Connect to backend API | Fetch user notifications | `src/pages/NotificationsPage.tsx` | Not Started |
| Mark as read | Connect to backend | `src/pages/NotificationDetailPage.tsx` | Not Started |
| Notification center | Show categorized notifications | `src/pages/NotificationCenterPage.tsx` | Partial |
| Real-time notifications | Implement WebSocket or polling | Notifications system | Not Started |

---

### 9. Owner/Admin Dashboard

**Priority: P1 - High**

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Owner role authentication | Verify owner role before accessing /owner routes | All owner pages | Not Started |
| Currency consistency | Standardize all currency to € (currently shows $) | `src/pages/owner/*.tsx` | Not Started |
| Connect dashboard to backend | Fetch real stats and bookings | `src/pages/owner/OwnerDashboardPage.tsx` | Not Started |
| Connect bookings list | Fetch owner's campsite bookings | `src/pages/owner/OwnerBookingsPage.tsx` | Not Started |
| Manage lots functionality | CRUD operations for lots | `src/pages/owner/ManageLotsPage.tsx`, `src/pages/owner/LotFormPage.tsx` | Partial |
| Lot calendar - block dates | Allow owners to block/unblock dates | `src/pages/LotCalendarPage.tsx` | Not Started |
| Edit campsite form | Connect to backend | `src/pages/owner/CampsiteFormPage.tsx` | Partial |
| Statistics charts | Add real chart visualizations | `src/pages/owner/OwnerStatsPage.tsx` | Partial |
| Revenue dashboard | Connect to backend financial data | `src/pages/owner/RevenueDashboardPage.tsx` | Partial |
| Offer management | CRUD for supplier offers | `src/pages/owner/OfferManagementPage.tsx`, `src/pages/owner/OfferFormPage.tsx` | Partial |
| Broadcast alerts | Send to backend and push to guests | `src/pages/owner/OwnerDashboardPage.tsx:18-24` | Partial |
| Owner settings suite | Connect all settings pages to backend | `src/pages/owner/Owner*SettingsPage.tsx` | Partial |

---

### 10. Support

**Priority: P3 - Low**

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Connect FAQ to backend | Fetch FAQ content from CMS/API | `src/pages/FAQPage.tsx` | Not Started |
| Contact support form | Submit to backend | `src/pages/ContactSupportPage.tsx` | Partial |
| Support tickets list | Fetch user's tickets | `src/pages/SupportTicketsPage.tsx` | Partial |
| Ticket detail/messaging | Real-time ticket updates | `src/pages/SupportTicketDetailPage.tsx` | Partial |

---

### 11. Core Infrastructure (MVP)

**Priority: P0 - Critical**

| Task | Description | Status |
|------|-------------|--------|
| API service layer | Create axios/fetch wrapper with auth headers | Not Started |
| Error handling utilities | Global error boundary, toast notifications | Not Started |
| Loading state utilities | Skeleton components, loading indicators | Partial |
| Form validation library | Consistent validation across forms (zod/yup) | Not Started |
| Currency formatting utility | `formatCurrency()` for consistent € display | Not Started |
| Date formatting utility | Consistent date display across app | Partial |
| Environment configuration | Dev/staging/prod environment variables | Not Started |

---

### 12. UX Fixes (MVP)

**Priority: P1 - High**

| Task | Description | Files | Status |
|------|-------------|-------|--------|
| Bottom navigation consistency | Show nav consistently across visitor flow | `src/components/layout/BottomNav.tsx`, `AppShell.tsx` | Not Started |
| Loading skeletons everywhere | Add skeletons to all data-fetching pages | Multiple pages | Partial |
| Form validation feedback | Inline error messages on all forms | All form pages | Partial |
| Toast notification system | Global feedback for actions | New component | Not Started |

---

## Post-MVP Tasks

### 1. Backend API Integration

| Task | Description | Priority |
|------|-------------|----------|
| Spring Boot API development | Complete REST endpoints for all features | High |
| PostgreSQL schema design | Design and implement database schema | High |
| Kafka event streaming | Implement async events for bookings, notifications | Medium |
| API documentation | OpenAPI/Swagger documentation | Medium |
| Rate limiting | Prevent API abuse | Medium |
| Caching layer | Redis caching for frequently accessed data | Low |

---

### 2. Advanced Authentication

| Task | Description | Priority |
|------|-------------|----------|
| Two-factor authentication | SMS/TOTP 2FA support | Medium |
| Biometric authentication (mobile) | Face ID/Touch ID for native apps | Low |
| Remember device | Trust device for 30 days | Low |
| Session management | View and revoke active sessions | Low |
| Account deletion | GDPR-compliant account removal | Medium |

---

### 3. Payment & Financial

| Task | Description | Priority |
|------|-------------|----------|
| Stripe integration | Full payment processing | High |
| Multiple payment methods | Save multiple cards per user | Medium |
| Apple Pay / Google Pay | Native payment methods | Medium |
| Refund processing | Automated and manual refunds | High |
| Owner payouts | Stripe Connect for owner payments | High |
| Invoice generation | PDF invoices for bookings | Medium |
| Tax calculation | VAT handling for Ireland/EU | Medium |

---

### 4. Real-time Features

| Task | Description | Priority |
|------|-------------|----------|
| WebSocket notifications | Real-time push updates | Medium |
| Host-guest messaging | In-app chat for bookings | Medium |
| Live availability updates | Real-time calendar sync | Medium |
| Booking status updates | Push notifications for status changes | Medium |

---

### 5. Performance & Optimization

| Task | Description | Priority |
|------|-------------|----------|
| Image lazy loading | Defer off-screen images | Medium |
| Image optimization | Compress and resize images | Medium |
| Code splitting | Dynamic imports for routes | Medium |
| Component memoization | React.memo for expensive components | Low |
| Bundle size reduction | Tree shaking, dependency audit | Low |
| Service worker caching | Cache static assets | Low |

---

### 6. Accessibility

| Task | Description | Priority |
|------|-------------|----------|
| ARIA labels | Add to all interactive elements | High |
| Keyboard navigation | Full keyboard support | High |
| Focus management | Proper focus in modals and flows | Medium |
| Color contrast fixes | WCAG 2.1 AA compliance | Medium |
| Screen reader testing | Test with VoiceOver/NVDA | Medium |
| Reduced motion support | Respect prefers-reduced-motion | Low |

---

### 7. Testing

| Task | Description | Priority |
|------|-------------|----------|
| Unit tests | Jest tests for utilities and hooks | High |
| Component tests | React Testing Library for components | High |
| Integration tests | API integration tests | Medium |
| E2E tests | Playwright/Cypress for critical flows | Medium |
| Visual regression tests | Screenshot comparison | Low |
| Performance tests | Lighthouse CI | Low |

---

### 8. PWA & Mobile

| Task | Description | Priority |
|------|-------------|----------|
| Offline mode | Service worker for offline access | Medium |
| Install prompt | Add to home screen prompt | Low |
| Push notifications | Web push for booking updates | Medium |
| Native app (React Native) | iOS/Android app consideration | Future |

---

### 9. Internationalization

| Task | Description | Priority |
|------|-------------|----------|
| i18n framework setup | react-i18next or similar | Low |
| Extract hardcoded strings | Replace all text with translation keys | Low |
| Irish language support | Gaeilge translations | Low |
| Multi-currency support | EUR, GBP, USD display options | Low |
| Date/time localization | Respect user locale preferences | Low |

---

### 10. Analytics & Monitoring

| Task | Description | Priority |
|------|-------------|----------|
| Error tracking | Sentry integration | High |
| Analytics | Mixpanel/Amplitude for user events | Medium |
| Performance monitoring | Core Web Vitals tracking | Medium |
| A/B testing | Feature flag infrastructure | Low |
| User session recording | Hotjar/FullStory for UX insights | Low |

---

### 11. SEO & Marketing

| Task | Description | Priority |
|------|-------------|----------|
| Meta tags | Title, description for all pages | Medium |
| Open Graph tags | Social sharing previews | Medium |
| Structured data | JSON-LD for campsites | Low |
| Sitemap generation | Dynamic sitemap.xml | Low |
| Favicon variations | All device favicon sizes | Low |

---

### 12. Admin & Operations

| Task | Description | Priority |
|------|-------------|----------|
| Admin dashboard | Internal admin panel | Future |
| Content management | CMS for static content | Future |
| Reporting & exports | Business reports, CSV exports | Future |
| Bulk operations | Mass email, bulk updates | Future |

---

### 13. Advanced Features (Future)

| Task | Description | Priority |
|------|-------------|----------|
| Campsite comparison | Compare multiple campsites | Future |
| Price alerts | Notify when price drops | Future |
| Calendar sync (iCal) | Export to Google/Apple Calendar | Future |
| Group bookings | Book multiple lots together | Future |
| Gift cards | Purchase and redeem gift cards | Future |
| Loyalty program | Rewards for repeat bookings | Future |
| Referral program | Refer friends for discounts | Future |
| Trip planning | Multi-campsite itineraries | Future |

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

---

## File Reference

### Critical Files Requiring Immediate Work

| File | Issue | Priority |
|------|-------|----------|
| `src/context/AuthContext.tsx` | Does not exist - needs creation | P0 |
| `src/context/BookingContext.tsx` | Does not exist - needs creation | P0 |
| `src/pages/owner/OwnerBookingsPage.tsx` | Currency shows $ instead of € | P0 |
| `src/pages/owner/ManageLotsPage.tsx` | Currency shows $ instead of € | P0 |
| `src/pages/MyBookingsPage.tsx` | Accessible without auth | P1 |
| `src/pages/FavoritesPage.tsx` | Accessible without auth | P1 |
| `src/pages/SettingsPage.tsx` | Hardcoded user data | P1 |
| `src/pages/ProfilePage.tsx` | Accessible without auth | P1 |
| `src/data/mockData.ts` | Booking dates are stale | P1 |

---

## Milestones

### Milestone 1: Authentication Complete
- AuthContext implemented
- Login/signup connected to backend
- SSO working (Google + Apple)
- Protected routes enforced
- Session persistence working

### Milestone 2: Core Booking Flow
- BookingContext implemented
- Full booking flow connected to backend
- Payment processing working
- Confirmation emails sent

### Milestone 3: User Features Complete
- My Bookings connected
- Profile management working
- Favorites synced
- Notifications working

### Milestone 4: Owner Portal Complete
- All owner pages connected
- Revenue dashboard functional
- Lot/campsite management working
- Broadcast alerts functional

### Milestone 5: MVP Launch Ready
- All P0 and P1 tasks complete
- Basic error handling in place
- Currency consistency fixed
- Loading states everywhere
- Testing coverage >60%

---

*Document generated: January 1, 2026*
