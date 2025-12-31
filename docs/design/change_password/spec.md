# Change Password (Settings)

**Priority:** MEDIUM
**Status:** To Design
**Flow:** Settings > Security

## Purpose
Allows authenticated users to change their password from within the app. Different from password reset - requires current password verification.

## Screen Elements

### Header
- Back button
- **Title:** "Change Password"

### Form Fields

1. **Current Password** (required)
   - Password field with show/hide toggle
   - Placeholder: "Enter current password"

2. **New Password** (required)
   - Password field with show/hide toggle
   - Placeholder: "Enter new password"
   - Password strength meter below

3. **Confirm New Password** (required)
   - Password field with show/hide toggle
   - Placeholder: "Re-enter new password"

### Password Requirements Checklist
- [ ] At least 8 characters
- [ ] Contains a number
- [ ] Contains a special character
- [ ] Passwords match

### Strength Meter
- Visual bar showing: Weak / Medium / Strong
- Color: Red → Yellow → Green

### Actions
- **Primary CTA:** "Update Password" (green button)
- **Link:** "Forgot your current password?" → Navigate to reset flow

## Design Notes
- Match `set_new_password` form styling
- Show checkmarks as requirements are met
- Disable submit until all requirements pass
- Show success toast/modal on completion

## Events

### Kafka Events
- `onSuccess` → `user.password_changed`
  - Triggers: Security notification email, Audit log

### UI Events
- `onSubmit`: Validate and update password
- `onValidation`: Real-time strength check
- `onForgotPassword`: Navigate to reset flow

## Related Screens
- `set_new_password` - Similar form design
- `personal_info_page` - Parent settings section
