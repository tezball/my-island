# Change Email: Verify

**Priority:** MEDIUM
**Status:** To Design
**Flow:** Settings > Account > Email Change

## Purpose
Pending state screen while user verifies their new email address. Shows after requesting an email change.

## Screen Elements

### Header
- Back button
- **Title:** "Verify New Email"

### Main Content
- **Illustration:** Email envelope with clock/pending indicator

- **Heading:** "Check your new inbox"
- **Subtext:** "We've sent a verification link to:"
- **Email Display:** newuser@example.com (highlighted)

### Status Card
- Icon: Clock/hourglass
- Text: "Your email will be updated once you click the verification link."
- Note: "This link expires in 24 hours."

### Actions
- **Primary CTA:** "Open Mail App" (green button with email icon)
- **Secondary:** "Cancel Change" (text link, requires confirmation)
- **Tertiary:** "Didn't receive it? Resend" (text link)

### Footer Note
- "Check your spam folder if you don't see the email."

## Design Notes
- Similar layout to `verify_your_email` screen
- Show clear indication this is a pending state
- Emphasize the ability to cancel
- Consider showing old email still active until verified

## Events

### Kafka Events
- `onVerified` → `user.email_changed`
- `onCancel` → `user.email_change_cancelled`
- `onResend` → `email.verification_resent`

### UI Events
- `onOpenEmail`: Open email app
- `onCancel`: Cancel pending change (with confirmation)
- `onResend`: Resend verification email

## Related Screens
- `change_email` - Previous screen
- `verify_your_email` - Similar pattern
