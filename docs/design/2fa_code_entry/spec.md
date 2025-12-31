# 2FA Code Entry

**Priority:** MEDIUM
**Status:** To Design
**Flow:** Authentication > Login (with 2FA)

## Purpose
Appears during login when user has 2FA enabled. Prompts for the 6-digit code from their authenticator app.

## Screen Elements

### Header
- Back button (return to login)
- **Title:** "Verification"

### Main Content
- **Illustration:** Shield with lock icon

- **Heading:** "Enter verification code"
- **Subtext:** "Open your authenticator app and enter the 6-digit code."

### Code Input
- 6 individual digit input boxes
- Auto-advance on entry
- Auto-submit when 6 digits entered
- Large, touch-friendly boxes

### Timer (if TOTP)
- Circular countdown showing code validity
- Refreshes every 30 seconds
- Visual indicator when code is about to expire

### Actions
- **Primary CTA:** "Verify" (green button)
- **Link:** "Use a backup code instead"
- **Link:** "Having trouble? Contact support"

### Error State
- Red border on input boxes
- Error message: "Invalid code. Please try again."
- Remaining attempts: "2 attempts remaining"

## Design Notes
- Code input should auto-focus on first box
- Support paste from clipboard
- Show loading state during verification
- Consider haptic feedback on mobile

## Events

### Kafka Events
- `onSuccess` → `user.authenticated`
- `onError` → `auth.2fa_failed`

### UI Events
- `onSubmit`: Verify entered code
- `onBackupCode`: Switch to backup code entry
- `onBack`: Return to login (cancels 2FA step)

## Related Screens
- `login_page_2` - Previous screen (credentials entered)
- `2fa_code_invalid` - Error state after max attempts
- `2fa_setup` - Where user configured 2FA
