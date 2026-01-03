---
title: Design Specs
type: MOC
status: active
created: 2026-01-03
tags:
  - moc
  - design
  - ui
  - ux
---

# Design Specs

> UI/UX specifications, screen designs, and component library for my-island

---

## Quick Access

| Category | Screens | Description |
|----------|---------|-------------|
| [[#Authentication]] | 15 | Login, signup, password flows |
| [[#Booking]] | 12 | Date selection to confirmation |
| [[#Discovery]] | 8 | Map, search, campsite details |
| [[#My Bookings]] | 10 | View and manage reservations |
| [[#Profile]] | 12 | User settings and preferences |
| [[#Owner Portal]] | 25 | Property management |
| [[#Notifications]] | 4 | Alerts and preferences |
| [[#Offers]] | 4 | Supplier deals |
| [[#UI Components]] | 5 | Shared components |
| [[#Errors]] | 6 | Error and empty states |

---

## Style Guide

[[ui-style-guide]] - Complete design system reference

---

## Screen Gallery

![[screen-gallery.canvas]]

---

## Authentication

### Login
| Screen | File |
|--------|------|
| Login Page 1 | `login_page_1/` |
| Login Page 2 | `login_page_2/` |
| Account Locked | `login:_account_locked/` |
| Account Suspended | `login:_account_suspended/` |
| Invalid Credentials | `login:_invalid_credentials/` |
| Network Error | `login:_network_error/` |
| Unverified Email | `login:_unverified_email/` |

### Sign Up
| Screen | File |
|--------|------|
| Account Details | `sign_up:_account_details/` |
| Personal Details | `sign_up:_personal_details/` |
| Email Exists | `sign_up:_email_exists/` |
| Validation Errors | `sign_up:_validation_errors/` |
| Complete Google | `complete_google_sign_up/` |
| Complete Apple | `complete_apple_sign_up/` |

### Password Reset
| Screen | File |
|--------|------|
| Forgot Password | `forgot_password/` |
| Reset Sent | `password_reset_sent/` |
| Set New Password | `set_new_password/` |
| Reset Successful | `password_reset_successful/` |
| Token Expired | `reset_password:_token_expired/` |
| Email Not Found | `reset_email_not_found/` |

### Email Verification
| Screen | File |
|--------|------|
| Verify Email | `verify_your_email/` |
| Link Expired | `verify_email:_link_expired/` |
| Email Verified | `email_verified_success/` |

### 2FA & Biometrics
| Screen | File |
|--------|------|
| 2FA Setup | `2fa_setup/` |
| 2FA Code Entry | `2fa_code_entry/` |
| 2FA Invalid | `2fa_code_invalid/` |
| Biometric Setup | `biometric_setup/` |
| Biometric Failed | `biometric_auth_failed/` |

---

## Booking

| Screen | File |
|--------|------|
| Select Dates | `select_booking_dates/` |
| Lot Calendar | `lot_availability_calendar/` |
| Lot Selection | `lot_selection_page/` |
| Guest & Extras | `guest_&_extras_details/` |
| Summary & Payment | `booking_summary_&_payment/` |
| Payment Methods | `payment_methods_page/` |
| Add Payment | `add_payment_page/` |
| Processing | `payment_processing/` |
| Confirmation | `booking_confirmation/` |
| Receipt | `booking_receipt_page/` |
| Payment Failed | `payment_failed_page/` |
| Booking Failed | `booking_failed_page/` |

---

## Discovery

| Screen | File |
|--------|------|
| Home Map View | `home_/_map_view/` |
| Get Started | `get_started_/_explore/` |
| Search | `search_page/` |
| Campsite Detail 1 | `campsite_detail_screen_1/` |
| Campsite Detail 2 | `campsite_detail_screen_2/` |
| Photo Gallery | `sunny_valley_photo_gallery/` |
| Favorites | `favorites_screen/` |

---

## My Bookings

| Screen | File |
|--------|------|
| Bookings List 1 | `my_bookings_screen_1/` |
| Bookings List 2 | `my_bookings_screen_2/` |
| Booking Detail | `booking_detail_page/` |
| Booking Details View | `booking_details_view/` |
| Modify Dates | `modify_booking_dates/` |
| Modify Guests | `modify_guest_&_extras/` |
| Modify Summary | `modify_booking_summary/` |
| Cancel Confirmation | `cancel_booking_confirmation_pop-up/` |
| Cancellation Success | `cancellation_successful_notification/` |
| Check-in Instructions | `check-in_instructions/` |
| Contact Host | `contact_campsite_host/` |

---

## Profile

| Screen | File |
|--------|------|
| User Profile | `user_profile_screen/` |
| Edit Profile 1 | `edit_profile_form_1/` |
| Edit Profile 2 | `edit_profile_form_2/` |
| Edit Profile 3 | `edit_profile_form_3/` |
| Personal Info | `personal_info_page/` |
| Settings | `settings_&_preferences/` |
| Linked Accounts | `linked_accounts_page/` |
| Language Selection | `language_selection_page/` |
| Logout Confirmation | `logout_confirmation/` |
| Change Email | `change_email/` |
| Change Email Verify | `change_email:_verify/` |
| Change Password | `change_password/` |
| Delete Account | `delete_account/` |
| Delete Confirm | `delete_account:_confirm/` |
| Account Unlocked | `account_unlocked_success/` |

---

## Owner Portal

### Dashboard
| Screen | File |
|--------|------|
| Admin Dashboard | `owner_admin_dashboard/` |
| Statistics | `campsite_statistics/` |
| Property Overview 1-5 | `property_overview_dashboard_1-5/` |

### Lot Management
| Screen | File |
|--------|------|
| Manage Lots | `manage_campsite_lots/` |
| Add Lot | `add_campsite_lot/` |
| Edit Lot 1 | `edit_lot_details_form_1/` |
| Edit Lot 2 | `edit_lot_details_form_2/` |
| Edit Individual Lot | `edit_individual_lot_details/` |

### Campsite Editing
| Screen | File |
|--------|------|
| Edit Form 1 | `campsite_listing/edit_form_1/` |
| Edit Form 2 | `campsite_listing/edit_form_2/` |

### Offers
| Screen | File |
|--------|------|
| Offer Management 1 | `supplier_offer_management_1/` |
| Offer Management 2 | `supplier_offer_management_2/` |
| Edit Offer | `edit_offer_form/` |
| Offers Feed | `supplier_offers_feed/` |
| Business Profile | `supplier_business_profile/` |

### Bookings & Revenue
| Screen | File |
|--------|------|
| Owner Bookings | `owner_bookings_page/` |
| Booking Detail | `owner_booking_detail_page/` |
| Revenue Dashboard | `revenue_dashboard_page/` |
| Add Payout | `add_payout_method/` |
| Settings | `owner_settings_page/` |

### Support
| Screen | File |
|--------|------|
| Support Tickets | `owner_support_tickets/` |
| Create Ticket | `create_owner_ticket/` |

---

## Notifications

| Screen | File |
|--------|------|
| Notification Center | `notification_center/` |
| Notifications List | `notifications_list/` |
| Notification Detail | `notification_detail_view/` |
| Preferences | `notification_preferences/` |

---

## Offers

| Screen | File |
|--------|------|
| Offers Feed | `supplier_offers_feed/` |
| Supplier Detail | `supplier_business_profile/` |

---

## UI Components

| Component | File |
|-----------|------|
| Button Loading States | `button_loading_states/` |
| Inline Validation | `inline_validation_states/` |
| Full Page Loader | `full-page_loader/` |

---

## Errors & Empty States

| Screen | File |
|--------|------|
| 404 Not Found | `not_found_(404)/` |
| Network Error | `network_error/` |
| Server Error | `server_error/` |
| Session Expired | `session_expired/` |
| Maintenance | `maintenance_mode/` |

---

## Help & Support

| Screen | File |
|--------|------|
| Support Page | `support_page/` |
| Help Menu | `help_&_support_menu/` |
| FAQ Detail | `faq_detail_view/` |
| Contact Us | `contact_us_form/` |
| Support Ticket | `support_ticket_conversation/` |

---

## Onboarding

| Screen | File |
|--------|------|
| Welcome 1 | `welcome_to_my-island/` |
| Welcome 2 | `welcome_to_my-island!/` |
| Benefits 1 | `app_benefits_showcase_1/` |
| Benefits 2 | `app_benefits_showcase_2/` |
| Benefits 3 | `app_benefits_showcase_3/` |
| Benefits 4 | `app_benefits_showcase_4/` |
| Benefits Heatmap | `heatmap_of_app_benefits_showcase/` |
| Get Started | `get_started_/_explore/` |

---

## Reviews

| Screen | File |
|--------|------|
| Submit Review | `review_&_rating_submission/` |

---

## Related Links

- [[../README|Docs Home]]
- [[../04-User-Flows/README|User Flows]]
- [[ui-style-guide|UI Style Guide]]
