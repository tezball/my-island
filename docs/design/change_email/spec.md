# Change Email

**Priority:** MEDIUM
**Status:** To Design
**Flow:** Settings > Account

## Purpose
Allows users to update their email address. Requires password confirmation and sends verification to the new email before the change takes effect.

## Screen Elements

### Header
- Back button
- **Title:** "Change Email"

### Current Email Section
- Label: "Current Email"
- Display: user@example.com (read-only, grayed out)
- Lock icon indicating it's protected

### Form Fields

1. **New Email Address** (required)
   - Email field with validation
   - Placeholder: "Enter new email address"
   - Real-time format validation

2. **Confirm Password** (required)
   - Password field with show/hide toggle
   - Placeholder: "Enter your password"
   - Helper: "Required to confirm this change"

### Warning Notice
- Icon: Info circle
- Text: "You'll need to verify your new email address before the change takes effect. You'll be logged out of all devices."

### Actions
- **Primary CTA:** "Send Verification" (green button)
- **Secondary:** "Cancel" (back to settings)

## Design Notes
- Clear warning about verification requirement
- Mention impact on other logged-in sessions
- Validate email format in real-time
- Show error if email already in use

## Events

### Kafka Events
- `onSuccess` → `user.email_change_requested`
  - Triggers: Verification email to new address, Security notification to old address

### UI Events
- `onSubmit`: Request email change
- `onValidation`: Check email format, verify password

## Related Screens
- `change_email:_verify` - Next screen after request
- `personal_info_page` - Parent settings section
