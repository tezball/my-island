# Authentication Flow

The authentication flow handles user registration, login, password recovery, and email verification.

## Screens

| # | Screen | File | Description |
|---|--------|------|-------------|
| 1 | Login | `01-login.png` | Email/password login form |
| 2 | Login (Filled) | `02-login-filled.png` | Login form with entered credentials |
| 3 | Sign Up | `03-signup.png` | New account registration form |
| 4 | Verify Email | `04-verify-email.png` | Email verification pending screen |
| 5 | Forgot Password | `05-forgot-password.png` | Password reset request form |
| 6 | Reset Sent | `06-reset-sent.png` | Confirmation that reset email was sent |
| 7 | Set New Password | `07-set-new-password.png` | New password entry form |

## User Stories

### US-AUTH-001: Login with Email/Password
**As a** registered user
**I want to** log in with my email and password
**So that** I can access my bookings and saved preferences

**Acceptance Criteria:**
- Email input field with validation
- Password input field with show/hide toggle
- "Remember me" checkbox option
- Login button is disabled until both fields are filled
- Error message displays for invalid credentials
- Successful login redirects to home screen
- Loading state shown during authentication

---

### US-AUTH-002: Login with Social Provider
**As a** user
**I want to** log in using Google or Apple
**So that** I can access the app without creating a new password

**Acceptance Criteria:**
- Google sign-in button is visible
- Apple sign-in button is visible (iOS)
- Tapping initiates OAuth flow
- New users are automatically registered
- Existing users are logged in

---

### US-AUTH-003: Create New Account
**As a** new user
**I want to** create an account with my email
**So that** I can book campsites and save favorites

**Acceptance Criteria:**
- Full name input field
- Email input field with format validation
- Password input with strength indicator
- Confirm password field with match validation
- Terms & conditions checkbox (required)
- Marketing opt-in checkbox (optional)
- Submit button creates account
- Email verification is triggered

---

### US-AUTH-004: Verify Email Address
**As a** newly registered user
**I want to** verify my email address
**So that** my account is fully activated

**Acceptance Criteria:**
- Verification email sent automatically after registration
- Screen displays email address verification was sent to
- "Resend email" option available
- "Check your email" instruction is clear
- Deep link in email opens app and verifies
- Success confirmation shown after verification

---

### US-AUTH-005: Request Password Reset
**As a** user who forgot my password
**I want to** request a password reset
**So that** I can regain access to my account

**Acceptance Criteria:**
- Email input field on forgot password screen
- Submit button sends reset email
- Confirmation screen shows email was sent
- Rate limiting prevents spam (max 3 requests/hour)
- Works for existing accounts only (no account enumeration)

---

### US-AUTH-006: Set New Password
**As a** user with a password reset link
**I want to** set a new password
**So that** I can log in again

**Acceptance Criteria:**
- Link from email opens set password screen
- New password field with strength requirements
- Confirm password field with match validation
- Submit updates password in system
- Success message and redirect to login
- Old password no longer works
- Reset link expires after 24 hours

---

### US-AUTH-007: Logout
**As a** logged-in user
**I want to** log out of my account
**So that** I can secure my account on shared devices

**Acceptance Criteria:**
- Logout option in profile/settings menu
- Confirmation prompt before logout
- Session is invalidated
- User redirected to login screen
- Cached sensitive data is cleared

---

### US-AUTH-008: Stay Logged In
**As a** user
**I want to** stay logged in between app sessions
**So that** I don't have to enter credentials every time

**Acceptance Criteria:**
- Auth token persisted securely
- Auto-login on app launch if token valid
- Token refresh happens transparently
- Session expires after 30 days of inactivity

---

## Flow Diagram

```
                           ┌─────────────┐
                           │   Welcome   │
                           │   Screen    │
                           └──────┬──────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
             ┌─────────────┐             ┌─────────────┐
             │    Login    │             │   Sign Up   │
             └──────┬──────┘             └──────┬──────┘
                    │                           │
        ┌───────────┼───────────┐               ▼
        ▼           ▼           ▼        ┌─────────────┐
   [Success]   [Forgot]    [Social]      │   Verify    │
        │      Password        │         │   Email     │
        │           │          │         └──────┬──────┘
        │           ▼          │                │
        │    ┌─────────────┐   │                ▼
        │    │   Forgot    │   │         ┌─────────────┐
        │    │  Password   │   │         │  Verified   │
        │    └──────┬──────┘   │         │  Success    │
        │           │          │         └──────┬──────┘
        │           ▼          │                │
        │    ┌─────────────┐   │                │
        │    │ Reset Sent  │   │                │
        │    └──────┬──────┘   │                │
        │           │          │                │
        │           ▼          │                │
        │    ┌─────────────┐   │                │
        │    │ Set New     │   │                │
        │    │ Password    │   │                │
        │    └──────┬──────┘   │                │
        │           │          │                │
        └───────────┴──────────┴────────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    Home     │
                    │   Screen    │
                    └─────────────┘
```

## Related Pages

- `src/pages/LoginPage.tsx`
- `src/pages/SignUpPage.tsx`
- `src/pages/ForgotPasswordPage.tsx`
- `src/pages/PasswordResetSentPage.tsx`
- `src/pages/SetNewPasswordPage.tsx`
- `src/pages/VerifyEmailPage.tsx`
- `src/pages/PasswordResetSuccessPage.tsx`
- `src/context/AuthContext.tsx`

## Security Considerations

- Passwords must be hashed (bcrypt) before storage
- Use HTTPS for all auth endpoints
- Implement rate limiting on login attempts
- JWT tokens should have short expiry with refresh tokens
- Avoid account enumeration in error messages
