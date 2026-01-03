# Complete Apple Sign Up

**Priority:** HIGH
**Status:** To Design
**Flow:** Authentication > Social Sign Up

## Purpose
Profile completion screen for users who sign up via Apple. Collects additional information needed for the camping experience. Mirror of `complete_google_sign_up`.

## Screen Elements

### Header
- Back button
- **Title:** "Finish Setup"

### Avatar Section
- Forest-themed avatar frame
- Apple logo badge overlay
- **Heading:** "Welcome, [Name]!" (or "Welcome!" if name hidden)
- **Subtext:** "Ready to explore the wild?"

### Form Fields

1. **Full Name** (may be pre-filled or empty if hidden by Apple)
   - Lock icon if provided by Apple
   - Editable if user chose to hide name

2. **Email Address** (read-only)
   - Shows Apple relay email if user chose to hide
   - Lock icon
   - Privacy note: "We never post without your permission."

3. **Mobile Number** (optional)
   - Format: +1 (555) 000-0000
   - Label: "OPTIONAL"

4. **Camper Style** (dropdown)
   - Options: Select your style, Tent Camper, RV/Camper, Glamper, Backpacker, etc.

### Terms
- Checkbox: "I agree to the [Terms of Service] and [Privacy Policy]."

### Actions
- **Primary CTA:** "Complete Registration" (green button with arrow)

## Design Notes
- Match `complete_google_sign_up` layout exactly
- Swap Google logo for Apple logo on avatar
- Handle Apple's "Hide My Email" relay addresses gracefully
- Handle hidden name scenario (may need to make Full Name editable)

## Events

### Kafka Events
- `onSuccess` → `user.registered`
  - Triggers: Welcome emails, CRM sync, Analytics

### UI Events
- `onSubmit`: Validate and complete profile
- `onValidation`: Real-time field validation
- `onBack`: Return to previous screen

## Related Screens
- `complete_google_sign_up` - Mirror design
- `sign_up:_account_details` - Alternative flow
