# Biometric Auth Failed

**Priority:** LOW
**Status:** To Design
**Flow:** Authentication > Biometric Login Error

## Purpose
Shown when Face ID or Touch ID authentication fails. Provides fallback to password login.

## Screen Elements

### Header
- Close button (X)
- **Title:** "Sign In"

### Error Section
- **Illustration:** Face ID icon with X or sad face
  - Or fingerprint with X for Touch ID

- **Heading:** "Couldn't recognize you"
- **Subtext:** "Face ID didn't match. Please try again or use your password."

### Attempt Counter
- "Attempt 2 of 3"
- Warning: "Too many failed attempts will require password"

### Actions
- **Primary CTA:** "Try Again" (green button)
- **Secondary:** "Use Password" (outlined button)

### Tips Section (collapsible)
- "Tips for Face ID:"
  - Make sure your face is clearly visible
  - Remove sunglasses or masks
  - Ensure good lighting
  - Hold device at arm's length

## Design Notes
- Non-alarming tone - this happens often
- Make password fallback prominent
- After 3 failures, auto-redirect to password
- Platform-specific messaging (Face ID vs Touch ID vs Fingerprint)

## Events

### UI Events
- `onRetry`: Retry biometric authentication
- `onUsePassword`: Navigate to password entry
- `onDismiss`: Close and return to login

## Related Screens
- `login_page_1` - Contains biometric option
- `biometric_setup` - Where biometric was configured
