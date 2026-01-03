# Delete Account

**Priority:** MEDIUM
**Status:** To Design
**Flow:** Settings > Account

## Purpose
Allows users to permanently delete their account and all associated data. Required for GDPR/privacy compliance.

## Screen Elements

### Header
- Back button
- **Title:** "Delete Account"

### Warning Section
- **Icon:** Large warning triangle (red/orange)
- **Heading:** "Delete your account?"
- **Subtext:** "This action is permanent and cannot be undone."

### What Will Be Deleted (card/list)
- Icon + Text for each:
  - Your profile and personal information
  - All your bookings (past and upcoming)
  - Your saved favorites
  - Your reviews and ratings
  - Payment methods on file

### What Won't Be Deleted
- Anonymized data for analytics
- Records required for legal/tax purposes

### Password Confirmation
- **Label:** "Enter your password to confirm"
- Password field with show/hide toggle
- Helper: "This verifies it's really you"

### Actions
- **Primary CTA:** "Delete My Account" (RED destructive button)
- **Secondary:** "Cancel" (text link)

### Footer Warning
- "Upcoming bookings will be cancelled and refunded according to cancellation policy."

## Design Notes
- Use destructive red color for delete button
- Make consequences extremely clear
- Require password to prevent accidental deletion
- Consider adding "reason for leaving" survey (optional)

## Events

### Kafka Events
- `onDelete` → `user.account_deletion_requested`
  - Triggers: Confirmation email, Data export (optional), Scheduled deletion

### UI Events
- `onSubmit`: Proceed to final confirmation
- `onCancel`: Return to settings

## Related Screens
- `delete_account:_confirm` - Final confirmation step
- `settings_&_preferences` - Parent screen
