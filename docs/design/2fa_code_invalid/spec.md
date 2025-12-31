# 2FA Code Invalid

**Priority:** LOW
**Status:** To Design
**Flow:** Authentication > 2FA Error

## Purpose
Error state shown when user enters an incorrect or expired 2FA code. Guides recovery options.

## Screen Elements

### Header
- Back button
- **Title:** "Verification"

### Error Display
- **Illustration:** Shield with warning icon

- **Heading:** "Invalid verification code"
- **Subtext:** "The code you entered is incorrect or has expired."

### Code Input (error state)
- 6 digit boxes with red border
- Shake animation on error
- Clear button to reset

### Attempt Counter
- "2 attempts remaining"
- Warning color when low

### Recovery Options (card)
- **Icon + Text:** "Code expired? Wait for a new code to generate"
- **Icon + Text:** "Lost access? Use a backup code"
- **Icon + Text:** "Need help? Contact support"

### Actions
- **Primary CTA:** "Try Again" (green button)
- **Link:** "Use Backup Code"
- **Link:** "Contact Support"

### Lockout Warning
- If 0 attempts remaining:
- "Too many failed attempts. Please try again in 15 minutes."

## Design Notes
- Clear indication of what went wrong
- Show remaining attempts prominently
- Backup code option should be visible
- Consider temporary lockout after max attempts

## Events

### Kafka Events
- `auth.2fa_failed`
  - Tracks: Attempt count, Eventually triggers lockout

### UI Events
- `onRetry`: Clear input and allow retry
- `onBackupCode`: Switch to backup code entry
- `onSupport`: Open support contact

## Related Screens
- `2fa_code_entry` - Normal state
- `login:_account_locked` - After too many failures
