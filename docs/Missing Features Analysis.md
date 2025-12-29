---
tags:
  - development
  - implementation
  - gap-analysis
created: 2024-12-29
status: in-progress
---

# Missing Features Analysis

> [!info] Overview
> Comparison of implemented React UI against design specifications to identify missing features, stubbed functionality, and implementation gaps.

**Analysis Date:** 2024-12-29
**Implemented Routes:** 13
**Missing Screens:** 44
**Stubbed Features:** 18

---

## Quick Summary

| Category | Implemented | Missing | Stubbed |
|:---------|:-----------:|:-------:|:-------:|
| Authentication | 1 | 5 | 4 |
| Discovery & Search | 3 | 5 | 2 |
| Campsite Details | 1 | 6 | 3 |
| Booking Flow | 5 | 5 | 1 |
| Booking Management | 1 | 5 | 1 |
| User Profile | 1 | 6 | 5 |
| Notifications | 0 | 3 | 1 |
| Owner/Admin | 0 | 5 | 0 |
| Error Handling | 0 | 4 | 1 |
| **TOTAL** | **13** | **44** | **18** |

---

## 1. Authentication & Onboarding

### Implemented
- [x] Login Page (`/login`) - Email/password form with validation

### Missing Screens
- [ ] ⏫ **Sign Up / Registration** — "Sign Up" link exists at line 169 of LoginPage.tsx but links to `#`
- [ ] ⏫ **Forgot Password Flow** — "Forgot Password?" link exists at line 84 but links to `#`
- [ ] 🔺 **Email Verification** — No OTP/confirmation screen
- [ ] 🔺 **Password Reset Confirmation** — No success state after reset
- [ ] 🔼 **Onboarding Permissions** — No location/notification permission requests

### Stubbed Features (Non-functional)
| Feature | Location | Current State |
|:--------|:---------|:--------------|
| Sign Up link | `LoginPage.tsx:169` | `href="#"` - goes nowhere |
| Forgot Password link | `LoginPage.tsx:84` | `href="#"` - goes nowhere |
| Face ID button | `LoginPage.tsx:112-124` | Button exists, no handler |
| Social login (Google/Apple) | `LoginPage.tsx:140-156` | Buttons exist, no OAuth flow |

---

## 2. Discovery & Search

### Implemented
- [x] Home Page (`/`) - Interactive Leaflet map with campsite markers
- [x] Search Page (`/search`) - List view with filter chips
- [x] Campsite Detail (`/campsite/:id`) - Full detail view

### Missing Screens
- [ ] 🔺 **List View Toggle** — Map has toggle button, but no list/grid view alternative
- [ ] 🔺 **Filter Modal/Sheet** — Filter chips exist but no expanded filter UI
- [ ] 🔼 **Empty Search State** — No "no results found" design
- [ ] 🔼 **Search Suggestions** — No autocomplete or recent searches
- [ ] 🔼 **Map Cluster Drill-down** — Clustered pins need expansion UI

### Stubbed Features
| Feature | Location | Current State |
|:--------|:---------|:--------------|
| List/Grid toggle | HomePage map | Toggle button exists, single view only |
| Advanced filters | Search chips | Basic chips only, no modal |

---

## 3. Campsite Details

### Implemented
- [x] Campsite Detail Page with:
  - Hero image with back/favorite buttons
  - Rating display
  - Description
  - Facilities grid
  - Available lots list
  - Local suppliers cards
  - Sticky footer with "Book Now"

### Missing Screens
- [ ] 🔺 **Reviews List** — Rating shown but no "See all reviews" screen
- [ ] 🔺 **Photo Gallery** — Single hero image, no gallery/carousel
- [ ] 🔼 **Availability Calendar** — No visual calendar in detail page
- [ ] 🔼 **All Suppliers View** — "View All" for more suppliers
- [ ] 🔼 **Supplier Detail** — Supplier cards shown but not clickable to detail
- [ ] ⏫ **Lot Selection UI** — Lots listed but no visual map/selection

### Stubbed Features
| Feature | Location | Current State |
|:--------|:---------|:--------------|
| Image gallery | `CampsiteDetailPage.tsx:62-103` | Single image only |
| Review details | `CampsiteDetailPage.tsx:109` | Rating component, not clickable |
| Supplier links | `CampsiteDetailPage.tsx:163` | Cards render, no navigation |

---

## 4. Booking Flow

### Implemented
- [x] Select Dates (`/book/:id/dates`) - DateRangePicker with calendar
- [x] Guest & Extras (`/book/:id/guests`) - GuestCounter + ExtrasToggle
- [x] Booking Summary (`/book/:id/summary`) - PriceBreakdown + payment selection
- [x] Payment Processing (`/book/:id/payment`) - Loading animation
- [x] Confirmation (`/booking/:id/confirmed`) - Success screen with reference

### Missing Screens
- [ ] 🔺 **Payment Method Selection** — "Change" option exists but no modal
- [ ] 🔺 **Add Payment Method** — No card entry form
- [ ] ⏫ **Payment Failed State** — No error handling UI
- [ ] 🔺 **Booking Failed State** — No failure screen
- [ ] 🔼 **Promo Code Entry** — No discount/coupon functionality

### Stubbed Features
| Feature | Location | Current State |
|:--------|:---------|:--------------|
| Change payment method | BookingSummaryPage | Text shown, no modal |

### API Gaps
```typescript
// bookingHandlers.ts - Missing endpoints:
// POST /api/payment/process - Real payment processing
// POST /api/promo/validate - Promo code validation
// GET /api/payment-methods - User's saved cards
// POST /api/payment-methods - Add new card
```

---

## 5. Booking Management

### Implemented
- [x] My Bookings (`/bookings`) - Tab view (upcoming/past) with BookingSummaryCard

### Missing Screens
- [ ] 🔺 **Booking Detail View** — No expanded view when tapping a booking
- [ ] 🔺 **Modification Screen** — No UI to change dates/guests
- [ ] 🔺 **Check-in Instructions** — No arrival details screen
- [ ] 🔺 **Contact Host** — No messaging feature
- [ ] 🔼 **Booking Receipt/Invoice** — No downloadable receipt

### Stubbed Features
| Feature | Location | Current State |
|:--------|:---------|:--------------|
| Booking card actions | MyBookingsPage | Cards render but not navigable to detail |

### API Gaps
```typescript
// bookingHandlers.ts - Implemented but no UI:
// PATCH /api/bookings/:id - Update booking (API exists)
// DELETE /api/bookings/:id - Cancel booking (API exists)
```

---

## 6. User Profile

### Implemented
- [x] Profile Page (`/profile`) - Header, stats widget, settings groups

### Missing Screens
- [ ] 🔺 **Edit Profile Form** — Button exists but no form page
- [ ] 🔺 **Personal Info Screen** — Listed in settings, no screen
- [ ] 🔺 **Payment Methods List** — Listed in settings, no screen
- [ ] 🔼 **Linked Accounts** — No social account management
- [ ] 🔼 **Support & Help** — Listed but no screen
- [ ] 🔽 **Language Selection** — No localization settings

### Stubbed Features
| Feature | Location | Current State |
|:--------|:---------|:--------------|
| Edit Profile button | `ProfilePage.tsx:117-119` | Button renders, onClick undefined |
| Edit Profile setting | `ProfilePage.tsx:161` | Chevron shown, no navigation |
| Notifications setting | `ProfilePage.tsx:162` | Chevron shown, no navigation |
| Privacy & Security | `ProfilePage.tsx:163` | Chevron shown, no navigation |
| Payment Methods | `ProfilePage.tsx:164` | Chevron shown, no navigation |
| Help Center | `ProfilePage.tsx:172` | Chevron shown, no navigation |

### API Gaps
```typescript
// authHandlers.ts - Missing:
// PATCH /api/users/me - Update profile
// GET /api/users/me/payment-methods - List saved cards
// POST /api/users/me/avatar - Upload profile photo
```

---

## 7. Notifications

### Implemented
- None

### Missing Screens
- [ ] 🔺 **Notifications List** — Bell icon in nav but no screen
- [ ] 🔼 **Notification Detail** — Individual notification view
- [ ] 🔼 **Supplier Alert Detail** — Alert subscription content

### Stubbed Features
| Feature | Location | Current State |
|:--------|:---------|:--------------|
| Notification menu item | `ProfilePage.tsx:162` | Listed but no route |

### API Gaps
```typescript
// Missing handlers entirely:
// GET /api/notifications - List user notifications
// PATCH /api/notifications/:id/read - Mark as read
// POST /api/notifications/preferences - Update settings
```

---

## 8. Owner/Admin Portal

### Implemented
- None (Guest-only application currently)

### Missing Screens
- [ ] 🔺 **Owner Bookings List** — See incoming reservations
- [ ] 🔺 **Owner Booking Detail** — Manage individual bookings
- [ ] 🔼 **Broadcast Message** — Send announcements to guests
- [ ] 🔼 **Owner Settings** — Campsite management
- [ ] 🔼 **Revenue Dashboard** — Earnings and analytics

### Notes
The design snag list mentions owner/admin screens but no routes or components exist. This would require:
- Role-based routing (`/owner/*`)
- New context for owner state
- Full owner mock API handlers

---

## 9. Error Handling & Edge States

### Implemented
- [x] Basic loading spinners
- [x] Login error message

### Missing Screens
- [ ] 🔺 **Network Error (Offline)** — No offline detection/UI
- [ ] 🔺 **Generic Error (500)** — No server error page
- [ ] 🔼 **Session Expired** — No token expiry handling
- [ ] 🔽 **Maintenance Mode** — No scheduled downtime UI

### Stubbed Features
| Feature | Location | Current State |
|:--------|:---------|:--------------|
| Error boundary | App.tsx | No error boundary wrapping |

### Technical Debt
```typescript
// Missing patterns:
// - React Error Boundary component
// - Offline detection (navigator.onLine)
// - Global error toast/snackbar
// - Retry mechanisms for failed requests
```

---

## 10. Technical Implementation Gaps

### Missing UI Patterns
- [ ] 🔺 **Loading Skeletons** — Only in SearchPage, missing elsewhere
- [ ] 🔺 **Pull-to-Refresh** — No mobile refresh gesture
- [ ] 🔺 **Infinite Scroll/Pagination** — Lists load all data at once
- [ ] 🔺 **Form Validation** — Basic validation, no inline errors
- [ ] 🔺 **Toast Notifications** — No feedback system

### Missing Infrastructure
- [ ] **Real Geolocation** — Falls back to mock Ireland coordinates
- [ ] **Image Upload** — No file upload for profile photos
- [ ] **Push Notifications** — No service worker or push setup
- [ ] **Analytics Events** — No tracking implementation

---

## 11. Routes to Add

### Priority 1 (MVP Blockers)
```typescript
// Auth
<Route path="/signup" element={<SignUpPage />} />
<Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/reset-password" element={<ResetPasswordPage />} />

// Booking
<Route path="/booking/:id" element={<BookingDetailPage />} />
<Route path="/booking/:id/modify" element={<ModifyBookingPage />} />
```

### Priority 2 (Core Experience)
```typescript
// Discovery
<Route path="/campsite/:id/reviews" element={<ReviewsPage />} />
<Route path="/campsite/:id/gallery" element={<GalleryPage />} />

// Profile
<Route path="/profile/edit" element={<EditProfilePage />} />
<Route path="/profile/payment-methods" element={<PaymentMethodsPage />} />

// Notifications
<Route path="/notifications" element={<NotificationsPage />} />
```

### Priority 3 (Owner Portal)
```typescript
<Route path="/owner" element={<OwnerDashboard />} />
<Route path="/owner/bookings" element={<OwnerBookingsPage />} />
<Route path="/owner/bookings/:id" element={<OwnerBookingDetailPage />} />
<Route path="/owner/settings" element={<OwnerSettingsPage />} />
```

---

## 12. Mock API Handlers to Add

### Authentication
```typescript
POST /api/auth/register     // Sign up
POST /api/auth/forgot       // Request password reset
POST /api/auth/reset        // Submit new password
POST /api/auth/verify-email // Email verification
```

### User Profile
```typescript
PATCH /api/users/me         // Update profile
POST /api/users/me/avatar   // Upload avatar
GET /api/payment-methods    // List saved cards
POST /api/payment-methods   // Add new card
DELETE /api/payment-methods/:id
```

### Reviews
```typescript
GET /api/campsites/:id/reviews  // List reviews
POST /api/campsites/:id/reviews // Submit review
```

### Notifications
```typescript
GET /api/notifications          // List notifications
PATCH /api/notifications/:id    // Mark read
DELETE /api/notifications/:id   // Delete
```

---

## Implementation Checklist

### Week 1 - Auth & Critical Paths
- [ ] Create SignUpPage with registration form
- [ ] Create ForgotPasswordPage with email input
- [ ] Create ResetPasswordPage with new password form
- [ ] Add corresponding mock API handlers
- [ ] Wire up existing stub links

### Week 2 - Booking & Profile
- [ ] Create BookingDetailPage (expanded view)
- [ ] Create ModifyBookingPage
- [ ] Create EditProfilePage with form
- [ ] Add error boundary and error pages
- [ ] Add toast notification system

### Week 3 - Discovery & Polish
- [ ] Create ReviewsPage with list view
- [ ] Create PhotoGalleryPage/Modal
- [ ] Create FilterModal component
- [ ] Add NotificationsPage
- [ ] Add PaymentMethodsPage

### Week 4 - Owner Portal (if in scope)
- [ ] Create owner role routing
- [ ] Create OwnerDashboard
- [ ] Create OwnerBookingsPage
- [ ] Add owner mock API handlers

---

*Last Updated: 2024-12-29*
