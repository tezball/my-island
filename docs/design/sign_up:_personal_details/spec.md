# Sign Up: Personal Details

**Priority:** HIGH
**Status:** To Design
**Flow:** Authentication > Email Sign Up (Step 2)

## Purpose
Second step of email registration flow. Collects profile information after account credentials are set. Ensures parity with social sign-up flows.

## Screen Elements

### Header
- Back button
- **Title:** "Almost there!"
- Progress indicator: Step 2 of 2 (dots or bar)

### Form Fields

1. **Full Name** (required)
   - Placeholder: "Your full name"
   - Validation: Min 2 characters

2. **Mobile Number** (optional)
   - Label: "OPTIONAL"
   - Format: +1 (555) 000-0000
   - Helper: "For booking confirmations"

3. **Camper Style** (dropdown)
   - Label: "What's your camping style?"
   - Options: Tent Camper, RV/Camper, Glamper, Backpacker, Day Tripper

### Terms Section
- Checkbox: "I agree to the [Terms of Service] and [Privacy Policy]."
- Must be checked to proceed

### Actions
- **Primary CTA:** "Complete Sign Up" (green button)
- **Secondary:** Back button in header

## Design Notes
- Progress indicator should show step 2 of 2
- Match form styling from `sign_up:_account_details`
- Camper Style helps personalize recommendations
- Keep form minimal - don't overwhelm new users

## Events

### Kafka Events
- `onSuccess` → `user.profile_completed`
  - Triggers: Personalization, Recommendations

### UI Events
- `onSubmit`: Complete registration, navigate to email verification
- `onValidation`: Real-time field validation
- `onBack`: Return to account details (preserve data)

## Related Screens
- `sign_up:_account_details` - Previous step
- `verify_your_email` - Next screen
- `complete_google_sign_up` - Similar fields
