# Delete Account: Final Confirmation

**Priority:** MEDIUM
**Status:** To Design
**Flow:** Settings > Account > Delete Account

## Purpose
Final confirmation step before permanently deleting user account. Adds friction to prevent accidental deletion.

## Screen Elements

### Header
- Back button
- **Title:** "Final Step"

### Warning Section
- **Icon:** Large red warning icon
- **Heading:** "Are you absolutely sure?"
- **Subtext:** "This will permanently delete your my-island account and all your data."

### Confirmation Input
- **Label:** Type "DELETE" to confirm
- Text input field
- Placeholder: "Type DELETE here"
- Case-sensitive validation

### Countdown Timer (optional)
- "You can delete your account in: 10 seconds"
- Button disabled until timer completes
- Gives user time to reconsider

### Email Confirmation
- Checkbox: "I understand I will receive a confirmation email"
- Note about 30-day grace period (if applicable)

### Actions
- **Primary CTA:** "Permanently Delete Account" (RED button, disabled until "DELETE" typed)
- **Secondary:** "Go Back" (text link)

## Design Notes
- Maximum friction - this should feel serious
- RED destructive button styling
- Disabled state until all conditions met
- Consider 30-day soft-delete grace period

## Events

### Kafka Events
- `onConfirm` → `user.account_deleted`
  - Triggers: Logout all sessions, Send confirmation, Schedule data purge

### UI Events
- `onConfirm`: Execute account deletion
- `onBack`: Return to previous screen
- `onTyping`: Validate "DELETE" input

## Related Screens
- `delete_account` - Previous screen
- `welcome_to_my-island!` - Redirect after deletion
