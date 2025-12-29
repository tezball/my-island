# Profile Flow

The profile flow allows users to view and edit their profile, manage account settings, preferences, and app configuration.

## Screens

| # | Screen | File | Description |
|---|--------|------|-------------|
| 1 | User Profile | `01-profile.png` | Main profile screen |
| 2 | Edit Profile 1 | `02-edit-profile-1.png` | Edit form (top section) |
| 3 | Edit Profile 2 | `03-edit-profile-2.png` | Edit form (more fields) |
| 4 | Settings | `04-settings.png` | Settings & preferences |

## User Stories

### US-PROF-001: View Profile
**As a** logged-in user
**I want to** view my profile information
**So that** I can see what information the app has about me

**Acceptance Criteria:**
- Profile picture displayed (or placeholder)
- Full name displayed
- Email address displayed
- Member since date
- Quick stats (bookings count, reviews, etc.)
- Edit profile button
- Settings button
- Logout option

---

### US-PROF-002: Edit Profile Information
**As a** user
**I want to** update my profile details
**So that** my information stays current

**Acceptance Criteria:**
- Edit mode for profile fields
- Can update: name, phone, profile photo
- Photo upload from camera or gallery
- Field validation (phone format, etc.)
- Save button applies changes
- Cancel discards changes
- Success confirmation shown

---

### US-PROF-003: Change Profile Photo
**As a** user
**I want to** upload a profile picture
**So that** hosts and others can identify me

**Acceptance Criteria:**
- Tap profile image to change
- Options: take photo, choose from library, remove
- Image cropping/resizing
- Preview before saving
- Supported formats: JPG, PNG
- Max file size enforced

---

### US-PROF-004: View Settings
**As a** user
**I want to** access app settings
**So that** I can customize my experience

**Acceptance Criteria:**
- Settings accessible from profile
- Grouped into logical sections
- Clear labels for each setting
- Current values displayed

---

### US-PROF-005: Manage Notification Preferences
**As a** user
**I want to** control which notifications I receive
**So that** I'm not overwhelmed with alerts

**Acceptance Criteria:**
- Toggle for push notifications (on/off)
- Toggles for notification types:
  - Booking confirmations
  - Booking reminders
  - Price alerts
  - Promotional offers
  - New reviews
- Email notification preferences
- Changes saved automatically

---

### US-PROF-006: Change App Theme
**As a** user
**I want to** switch between light and dark mode
**So that** I can use the app comfortably in any lighting

**Acceptance Criteria:**
- Theme options: Light, Dark, System default
- Preview of selected theme
- Change applies immediately
- Preference persisted across sessions

---

### US-PROF-007: Change Language
**As a** user
**I want to** change the app language
**So that** I can use it in my preferred language

**Acceptance Criteria:**
- List of supported languages
- Current language indicated
- Tapping language selects it
- App UI updates to selected language
- Confirmation may be required

---

### US-PROF-008: Manage Payment Methods
**As a** user
**I want to** manage my saved payment methods
**So that** checkout is faster and I can update cards

**Acceptance Criteria:**
- List of saved cards (masked numbers)
- Default payment method indicated
- Add new payment method option
- Remove existing payment method
- Set default payment method
- Card type icons (Visa, Mastercard, etc.)

---

### US-PROF-009: View Personal Information
**As a** user
**I want to** see and update my personal details
**So that** my account information is accurate

**Acceptance Criteria:**
- View: name, email, phone, address
- Edit option for each field
- Email change requires verification
- Changes saved with confirmation

---

### US-PROF-010: Manage Linked Accounts
**As a** user
**I want to** link or unlink social accounts
**So that** I can control my login options

**Acceptance Criteria:**
- Show linked accounts (Google, Apple)
- Option to link additional accounts
- Option to unlink (if password login exists)
- Cannot unlink all login methods

---

### US-PROF-011: Access Support/Help
**As a** user
**I want to** get help or contact support
**So that** I can resolve issues

**Acceptance Criteria:**
- FAQ section with common questions
- Contact support option
- In-app chat or email
- Report a problem form
- App version displayed

---

### US-PROF-012: Logout
**As a** user
**I want to** log out of my account
**So that** I can secure my account

**Acceptance Criteria:**
- Logout option in settings or profile
- Confirmation prompt
- Session ended on confirmation
- Redirect to login/welcome screen
- Local data cleared appropriately

---

### US-PROF-013: Delete Account
**As a** user
**I want to** delete my account
**So that** my data is removed from the platform

**Acceptance Criteria:**
- Delete account option in settings
- Warning about data loss
- Requires password confirmation
- Optional: reason for leaving
- Account scheduled for deletion
- Grace period before permanent deletion
- Confirmation email sent

---

## Flow Diagram

```
┌─────────────┐
│ Bottom Nav: │
│   Profile   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│         User Profile            │
│  ┌─────────┐                    │
│  │ Avatar  │  Name              │
│  │         │  Email             │
│  └─────────┘  Member since      │
│                                 │
│  [Edit Profile]  [Settings]     │
│                                 │
│  Stats: Bookings | Reviews      │
│                                 │
│  [Logout]                       │
└──────────────┬──────────────────┘
               │
       ┌───────┴───────┐
       ▼               ▼
┌─────────────┐ ┌─────────────┐
│    Edit     │ │  Settings   │
│   Profile   │ │             │
└──────┬──────┘ └──────┬──────┘
       │               │
       ▼               ├──────────┬──────────┬──────────┐
┌─────────────┐        ▼          ▼          ▼          ▼
│   Saved     │ ┌──────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│   Changes   │ │Notifica- │ │ Theme  │ │Language│ │Payment │
└─────────────┘ │  tions   │ │        │ │        │ │Methods │
                └──────────┘ └────────┘ └────────┘ └───┬────┘
                                                       │
                                                       ▼
                                                ┌──────────┐
                                                │   Add    │
                                                │ Payment  │
                                                └──────────┘
```

## Related Pages

- `src/pages/ProfilePage.tsx`
- `src/pages/EditProfilePage.tsx`
- `src/pages/SettingsPage.tsx`
- `src/pages/PersonalInfoPage.tsx`
- `src/pages/PaymentMethodsPage.tsx`
- `src/pages/AddPaymentPage.tsx`
- `src/pages/LinkedAccountsPage.tsx`
- `src/pages/LanguageSelectionPage.tsx`
- `src/pages/NotificationSettingsPage.tsx`
- `src/pages/SupportPage.tsx`
- `src/context/ThemeContext.tsx`
- `src/context/AuthContext.tsx`

## Notes

- Profile photo should be optimized/compressed on upload
- Consider GDPR compliance for data export
- Password change should require current password
- Sensitive changes should require re-authentication
