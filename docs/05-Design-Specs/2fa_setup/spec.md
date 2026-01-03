# Two-Factor Authentication Setup

**Priority:** MEDIUM
**Status:** To Design
**Flow:** Settings > Security

## Purpose
Enables users to add an extra layer of security to their account using an authenticator app (Google Authenticator, Authy, etc.).

## Screen Elements

### Header
- Back button
- **Title:** "Two-Factor Authentication"

### Introduction
- Shield icon with "2FA" badge
- **Heading:** "Add extra security"
- **Subtext:** "Use an authenticator app to generate codes for signing in."

### Step 1: Scan QR Code
- Large QR code (centered)
- Instruction: "Scan this code with your authenticator app"

### Manual Entry Option
- Expandable section: "Can't scan? Enter code manually"
- Secret key displayed: `XXXX XXXX XXXX XXXX`
- Copy button

### Step 2: Verify Setup
- **Label:** "Enter the 6-digit code from your app"
- 6 individual digit input boxes
- Real-time validation

### Backup Codes Section (shown after verification)
- Warning icon
- **Heading:** "Save your backup codes"
- List of 10 one-time use codes
- **Actions:**
  - "Download Codes" button
  - "Copy All" button
- Warning: "Store these in a safe place. Each code can only be used once."

### Actions
- **Primary CTA:** "Enable 2FA" (green button, after code verified)
- **Secondary:** "Cancel" (back to settings)

## Design Notes
- QR code should be large enough to scan easily
- Backup codes are critical - emphasize saving them
- Consider step-by-step wizard approach
- Show success confirmation after enabling

## Events

### Kafka Events
- `onEnabled` → `user.2fa_enabled`
  - Triggers: Security notification, Audit log

### UI Events
- `onScanComplete`: User indicates QR scanned
- `onVerifyCode`: Validate entered code
- `onDownloadCodes`: Download backup codes file
- `onCopyCodes`: Copy codes to clipboard

## Related Screens
- `2fa_code_entry` - Used during login
- `2fa_code_invalid` - Error state
