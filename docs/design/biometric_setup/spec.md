# Biometric Setup

**Priority:** MEDIUM
**Status:** To Design
**Flow:** Settings > Security OR Post-Login Prompt

## Purpose
Allows users to enable Face ID or Touch ID for faster, secure login. Can be shown after first login or accessed from security settings.

## Screen Elements

### Header
- Close/Skip button (X) in top right
- **Title:** "Quick Login"

### Main Content
- **Illustration:** Face ID icon or Touch ID fingerprint
  - Large, centered
  - Animated pulse effect
  - Platform-specific (detect iOS vs Android)

- **Heading:** "Enable Face ID" (or "Enable Touch ID" / "Enable Fingerprint")
- **Subtext:** "Sign in quickly and securely using your face (or fingerprint). Your biometric data never leaves your device."

### Privacy Assurance
- Shield icon
- Text: "Your biometric data is stored securely on your device and is never shared with my-island."

### Actions
- **Primary CTA:** "Enable Face ID" (green button)
- **Secondary:** "Skip for now" (text link)
- **Tertiary:** "Learn more about security" (text link)

## Design Notes
- Detect device capability and show appropriate biometric type
- Use native system prompt for actual enrollment
- Should feel trustworthy - emphasize privacy
- Can be dismissable but should encourage setup

## Events

### Kafka Events
- `onEnabled` → `user.biometric_enabled`
  - Tracks: Device type, Biometric method

### UI Events
- `onEnable`: Trigger native biometric enrollment
- `onSkip`: Dismiss and continue
- `onLearnMore`: Show security info modal

## Related Screens
- `login_page_1` - Shows Face ID option once enabled
- `biometric_auth_failed` - Error state
