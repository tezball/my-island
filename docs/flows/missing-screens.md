# Missing Design Screens

This document lists pages that have been implemented in code but do not have corresponding design screenshots.

**Last Updated:** After new screen additions

## Summary

- **Total pages implemented:** 66
- **Pages with designs:** ~59
- **Pages missing designs:** ~7

---

## Screens Still Missing

### Discovery Flow
- [ ] `ListViewPage` - List/grid view of campsites (alternative to map view)

### Reviews Flow
- [ ] `ReviewsListPage` - All reviews for a campsite
- [ ] `ReviewDetailPage` - Single review expanded view

### Error States
- [ ] `NetworkErrorPage` - No internet connection screen
- [ ] `ServerErrorPage` - 500 server error screen
- [ ] `SessionExpiredPage` - Login session expired screen
- [ ] `MaintenancePage` - Scheduled maintenance screen
- [ ] `NotFoundPage` - 404 page not found screen

---

## Recently Added Screens (Now Have Designs)

### Auth Flow
- [x] `PasswordResetSuccessPage` - ✓ password_reset_successful

### Discovery Flow
- [x] `PhotoGalleryPage` - ✓ sunny_valley_photo_gallery

### Booking Flow
- [x] `LotSelectionPage` - ✓ lot_selection_page
- [x] `PaymentMethodsPage` - ✓ payment_methods_page
- [x] `AddPaymentPage` - ✓ add_payment_page
- [x] `PaymentFailedPage` - ✓ payment_failed_page
- [x] `BookingFailedPage` - ✓ booking_failed_page

### My Bookings Flow
- [x] `BookingDetailPage` - ✓ booking_detail_page, booking_details_view
- [x] `CheckInInstructionsPage` - ✓ check-in_instructions
- [x] `ContactHostPage` - ✓ contact_campsite_host
- [x] `BookingReceiptPage` - ✓ booking_receipt_page

### Profile Flow
- [x] `PersonalInfoPage` - ✓ personal_info_page
- [x] `LinkedAccountsPage` - ✓ linked_accounts_page
- [x] `LanguageSelectionPage` - ✓ language_selection_page
- [x] `SupportPage` - ✓ support_page, help_&_support_menu
- [x] FAQ Detail - ✓ faq_detail_view
- [x] Contact Us Form - ✓ contact_us_form
- [x] Support Ticket - ✓ support_ticket_conversation

### Notifications Flow
- [x] `NotificationsListPage` - ✓ notification_center, notifications_list
- [x] `NotificationDetailPage` - ✓ notification_detail_view
- [x] `NotificationSettingsPage` - ✓ notification_preferences

### Offers Flow
- [x] `SupplierDetailPage` - ✓ supplier_business_profile

### Owner/Admin Flow
- [x] `OwnerBookingsPage` - ✓ owner_bookings_page
- [x] `OwnerBookingDetailPage` - ✓ owner_booking_detail_page
- [x] `OwnerSettingsPage` - ✓ owner_settings_page
- [x] `RevenueDashboardPage` - ✓ revenue_dashboard_page
- [x] Add Payout Method - ✓ add_payout_method
- [x] Owner Support - ✓ owner_support_tickets, create_owner_ticket
- [x] Property Overview - ✓ property_overview_dashboard_1-5

---

## Priority for Remaining Screens

### High Priority
1. **Error screens** - Essential for graceful failure handling
   - Create consistent error page template
   - All 5 error screens can share similar layout

### Medium Priority
2. `ListViewPage` - Alternative discovery method for users who prefer lists over maps

### Lower Priority
3. `ReviewsListPage` / `ReviewDetailPage` - Can use existing review component patterns

---

## Design Recommendations

### Error Screens
All error screens should follow a consistent pattern:
- Centered icon representing the error type
- Clear, friendly headline
- Brief explanation
- Primary action button (Retry/Go Home/Login)
- Secondary action if applicable

### List View
- Should mirror the campsite card design from favorites
- Include sort and filter options
- Consider infinite scroll vs pagination

### Reviews
- Can extend the review submission design patterns
- Include helpful vote interaction
- Show response from host if available
