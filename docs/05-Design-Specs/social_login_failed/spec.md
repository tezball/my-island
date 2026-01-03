# Social Login Failed

**Priority:** LOW
**Status:** To Design
**Flow:** Authentication > Social Login Error

## Purpose
Error screen shown when OAuth/social login fails (Google or Apple). Provides recovery options.

## Screen Elements

### Header
- Back button
- **Title:** "Sign In"

### Error Section
- **Illustration:** Disconnected cloud or broken link icon
- **Heading:** "Something went wrong"
- **Subtext:** "We couldn't complete sign in with [Google/Apple]. This might be a temporary issue."

### Error Details (expandable, optional)
- Technical error code for support
- "Error: oauth_denied" or similar

### Possible Causes (card)
- You cancelled the sign in
- Network connection issue
- [Google/Apple] service is temporarily unavailable
- Pop-ups may be blocked

### Actions
- **Primary CTA:** "Try Again" (green button)
- **Secondary:** "Use Email Instead" (outlined button)
- **Link:** "Contact Support"

## Design Notes
- Don't blame the user
- Offer clear alternatives
- Match error screen patterns from network_error
- Consider specific messaging based on error type

## Events

### Kafka Events
- `auth.social_login_failed`
  - Tracks: Provider, Error type, User action

### UI Events
- `onRetry`: Retry OAuth flow
- `onUseEmail`: Navigate to email login
- `onSupport`: Open support contact

## Related Screens
- `login_page_1` - Return destination
- `network_error` - Similar pattern
