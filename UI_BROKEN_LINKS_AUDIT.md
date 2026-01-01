# UI Broken Links & Missing Pages Audit

## Summary

This audit identified **12 broken links** pointing to non-existent routes and **1 orphaned page** that exists but has no route defined.

> **STATUS: RESOLVED** - All issues have been fixed. See [Resolution Summary](#resolution-summary) below.

---

## Broken Links (Pointing to Non-Existent Routes)

### Owner Settings Subpages

The Owner Settings page (`/owner/settings`) contains links to settings subpages that have no corresponding routes defined in `App.tsx`.

| Link Target | File Location | Line | Description |
|-------------|---------------|------|-------------|
| `/owner/settings/calendar` | `src/pages/owner/OwnerSettingsPage.tsx` | 38 | Calendar Sync settings |
| `/owner/settings/pricing` | `src/pages/owner/OwnerSettingsPage.tsx` | 51 | Pricing Rules settings |
| `/owner/settings/bank` | `src/pages/owner/OwnerSettingsPage.tsx` | 101 | Bank Account settings |
| `/owner/settings/payout-schedule` | `src/pages/owner/OwnerSettingsPage.tsx` | 117 | Payout Schedule settings |
| `/owner/settings/tax` | `src/pages/owner/OwnerSettingsPage.tsx` | 133 | Tax Information settings |
| `/owner/settings/team` | `src/pages/owner/OwnerSettingsPage.tsx` | 153 | Team Members settings |

**Status:** All links result in 404 page.

---

### Owner Offers - New Offer Page

| Link Target | File Location | Line | Description |
|-------------|---------------|------|-------------|
| `/owner/offers/new` | `src/pages/owner/OfferManagementPage.tsx` | 60, 176 | Create new offer button |

**Status:** Results in 404 page. No route or page component exists for creating new offers.

---

### Support Ticket Details

| Link Target | File Location | Line | Description |
|-------------|---------------|------|-------------|
| `/support/tickets/:ticketId` | `src/pages/SupportTicketsPage.tsx` | 65 | View ticket details |

**Status:** Results in 404 page. The route `/support/tickets/:id` is not defined, only `/support/tickets` exists.

---

### Payment Flow Issues

The payment methods pages have **route/parameter mismatches** causing broken navigation:

| Issue | File Location | Line | Description |
|-------|---------------|------|-------------|
| `/book/${id}/add-payment` | `src/pages/PaymentMethodsPage.tsx` | 122 | Route doesn't exist |
| `/book/${id}/payment-methods` | `src/pages/AddPaymentMethodPage.tsx` | 38 | Route doesn't exist (should be `/payment-methods`) |

**Additional Problem:** Both `PaymentMethodsPage` and `AddPaymentMethodPage` use `useParams<{ id: string }>()` to get a booking ID, but their routes are defined as:
- `/payment-methods` (no `:id` param)
- `/payment-methods/add` (no `:id` param)

This means the `id` will always be `undefined`, breaking navigation to `/book/${id}/processing`.

---

## Orphaned Pages (Exist but Not Routed)

| Page File | Description |
|-----------|-------------|
| `src/pages/HomePage.tsx` | Home page component exists but is not imported or routed in `App.tsx` |

---

## Recommendations

### High Priority

1. **Create missing owner settings subpages** or remove the links:
   - `OwnerCalendarSettingsPage`
   - `OwnerPricingSettingsPage`
   - `OwnerBankSettingsPage`
   - `OwnerPayoutSchedulePage`
   - `OwnerTaxSettingsPage`
   - `OwnerTeamSettingsPage`

2. **Create missing offer management page**:
   - `OfferFormPage` for route `/owner/offers/new`

3. **Create support ticket detail page**:
   - `SupportTicketDetailPage` for route `/support/tickets/:ticketId`

4. **Fix payment methods routing**:
   - Change routes to include booking ID: `/book/:id/payment-methods` and `/book/:id/add-payment`
   - OR update the pages to not depend on a booking ID parameter

### Low Priority

5. **Remove or route `HomePage.tsx`**:
   - Either delete the orphaned file or add a route for it

---

## Routes Reference

### Currently Defined Routes (from App.tsx)

```
/                                    -> DiscoverPage
/login                               -> LoginPage
/signup                              -> SignUpPage
/forgot-password                     -> ForgotPasswordPage
/password-reset-sent                 -> PasswordResetSentPage
/verify-email                        -> EmailVerificationPage
/account-locked                      -> AccountLockedPage
/account-suspended                   -> AccountSuspendedPage
/unverified-email                    -> UnverifiedEmailPage
/email-verified                      -> EmailVerifiedPage
/email-exists                        -> EmailExistsPage
/reset-password                      -> SetNewPasswordPage
/password-reset-success              -> PasswordResetSuccessPage
/token-expired                       -> TokenExpiredPage
/reset-email-not-found               -> ResetEmailNotFoundPage
/session-expired                     -> SessionExpiredPage
/verification-expired                -> VerificationExpiredPage
/auth/:provider                      -> SSOAuthPage
/welcome                             -> WelcomePage
/onboarding                          -> OnboardingPage
/network-error                       -> NetworkErrorPage
/server-error                        -> ServerErrorPage
/maintenance                         -> MaintenancePage
/search                              -> SearchPage
/campsite/:id                        -> CampsiteDetailPage
/campsite/:id/photos                 -> PhotoGalleryPage
/campsite/:id/reviews                -> ReviewsPage
/campsite/:id/review                 -> WriteReviewPage
/book/:id                            -> BookingPage
/book/:id/dates                      -> SelectDatesPage
/book/:id/calendar                   -> LotCalendarPage
/book/:id/guests                     -> GuestExtrasPage
/book/:id/payment                    -> BookingPaymentPage
/book/:id/processing                 -> PaymentProcessingPage
/book/:id/confirmation               -> BookingConfirmationPage
/book/:id/payment-failed             -> PaymentFailedPage
/book/:id/booking-failed             -> BookingFailedPage
/payment-methods                     -> PaymentMethodsPage
/payment-methods/add                 -> AddPaymentMethodPage
/bookings                            -> MyBookingsPage
/bookings/:bookingId                 -> BookingDetailPage
/bookings/:bookingId/modify-dates    -> ModifyDatesPage
/bookings/:bookingId/modify-guests   -> ModifyGuestsPage
/bookings/:bookingId/modify-summary  -> ModifySummaryPage
/bookings/:bookingId/cancel          -> CancelConfirmPage
/bookings/:bookingId/cancelled       -> CancellationSuccessPage
/bookings/:bookingId/receipt         -> BookingReceiptPage
/bookings/:bookingId/check-in        -> CheckInInstructionsPage
/bookings/:bookingId/contact-host    -> ContactHostPage
/favorites                           -> FavoritesPage
/offers                              -> OffersPage
/offers/:id                          -> SupplierDetailPage
/profile                             -> ProfilePage
/profile/edit                        -> ProfileEditPage
/profile/personal-info               -> PersonalInfoPage
/profile/linked-accounts             -> LinkedAccountsPage
/profile/notifications               -> NotificationSettingsPage
/settings                            -> SettingsPage
/support                             -> SupportPage
/support/faq                         -> FAQPage
/support/contact                     -> ContactSupportPage
/support/tickets                     -> SupportTicketsPage
/notifications                       -> NotificationsPage
/notifications/center                -> NotificationCenterPage
/notifications/:id                   -> NotificationDetailPage
/owner                               -> OwnerDashboardPage
/owner/stats                         -> OwnerStatsPage
/owner/lots                          -> ManageLotsPage
/owner/lots/new                      -> LotFormPage
/owner/lots/:lotId/edit              -> LotFormPage
/owner/campsites/:id/edit            -> CampsiteFormPage
/owner/bookings                      -> OwnerBookingsPage
/owner/offers                        -> OfferManagementPage
/owner/revenue                       -> RevenueDashboardPage
/owner/settings                      -> OwnerSettingsPage
*                                    -> NotFoundPage (404 catch-all)
```

### Missing Routes (Need to be added)

```
/owner/settings/calendar             -> (needs page)
/owner/settings/pricing              -> (needs page)
/owner/settings/bank                 -> (needs page)
/owner/settings/payout-schedule      -> (needs page)
/owner/settings/tax                  -> (needs page)
/owner/settings/team                 -> (needs page)
/owner/offers/new                    -> (needs page)
/support/tickets/:ticketId           -> (needs page)
/book/:id/add-payment                -> (needs page or route fix)
/book/:id/payment-methods            -> (needs route fix)
```

---

## Resolution Summary

All identified issues have been resolved:

### New Pages Created

| Page | Route | Description |
|------|-------|-------------|
| `OwnerCalendarSettingsPage.tsx` | `/owner/settings/calendar` | Calendar sync settings with provider connections |
| `OwnerPricingSettingsPage.tsx` | `/owner/settings/pricing` | Pricing rules for weekends, seasons, discounts |
| `OwnerBankSettingsPage.tsx` | `/owner/settings/bank` | Bank account management for payouts |
| `OwnerPayoutSchedulePage.tsx` | `/owner/settings/payout-schedule` | Payout frequency settings |
| `OwnerTaxSettingsPage.tsx` | `/owner/settings/tax` | Tax information and document downloads |
| `OwnerTeamSettingsPage.tsx` | `/owner/settings/team` | Team member management and invitations |
| `OfferFormPage.tsx` | `/owner/offers/new`, `/owner/offers/:offerId/edit` | Create/edit promotional offers |
| `SupportTicketDetailPage.tsx` | `/support/tickets/:ticketId` | View ticket details and conversation |

### Routes Fixed

| Original Route | New Route | Reason |
|----------------|-----------|--------|
| `/payment-methods` | `/book/:id/payment-methods` | Now includes booking ID for proper context |
| `/payment-methods/add` | `/book/:id/add-payment` | Now includes booking ID for proper context |

### Files Removed

| File | Reason |
|------|--------|
| `HomePage.tsx` | Orphaned placeholder page replaced by `DiscoverPage` |

### App.tsx Updates

All new routes have been added to `src/App.tsx` with proper imports.

---

*Audit completed: January 2026*
*Resolution completed: January 2026*
