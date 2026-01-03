# Onboarding Flow

The onboarding flow introduces new users to the my-island app, showcasing key features and benefits before they begin exploring campsites.

## Screens

| # | Screen | File | Description |
|---|--------|------|-------------|
| 1 | Welcome | `01-welcome.png` | Initial welcome screen with app branding |
| 2 | Benefits 1 | `02-benefits-1.png` | First benefit showcase slide |
| 3 | Benefits 2 | `03-benefits-2.png` | Second benefit showcase slide |
| 4 | Benefits 3 | `04-benefits-3.png` | Third benefit showcase slide |
| 5 | Benefits 4 | `05-benefits-4.png` | Fourth benefit showcase slide |
| 6 | Get Started | `07-get-started.png` | Final CTA to begin exploring |

## User Stories

### US-ONB-001: View Welcome Screen
**As a** new user
**I want to** see a welcome screen when I first open the app
**So that** I understand what the app is about and feel welcomed

**Acceptance Criteria:**
- App logo and branding are prominently displayed
- App name "my-island" is visible
- Primary CTA button to continue is available
- Option to skip onboarding exists

---

### US-ONB-002: Browse App Benefits
**As a** new user
**I want to** swipe through benefit slides
**So that** I understand the key features before using the app

**Acceptance Criteria:**
- User can swipe left/right to navigate between slides
- Progress indicator shows current position (dots or similar)
- Each slide highlights a unique app benefit
- Skip option available on all slides
- Next/Continue button advances to next slide

---

### US-ONB-003: Skip Onboarding
**As a** returning user or impatient new user
**I want to** skip the onboarding flow
**So that** I can immediately start browsing campsites

**Acceptance Criteria:**
- Skip button is visible on all onboarding screens
- Tapping skip navigates directly to home/explore screen
- Skipping is remembered (onboarding doesn't show again)

---

### US-ONB-004: Complete Onboarding
**As a** new user
**I want to** tap "Get Started" after viewing benefits
**So that** I can begin exploring campsites

**Acceptance Criteria:**
- Final slide has a prominent "Get Started" or "Explore" CTA
- Tapping CTA navigates to home/explore screen
- Completion is remembered (onboarding doesn't show again)
- User can optionally create account or continue as guest

---

### US-ONB-005: First-Time User Detection
**As a** returning user
**I want to** skip onboarding automatically on subsequent app opens
**So that** I go directly to the main content

**Acceptance Criteria:**
- App detects if user has completed onboarding before
- Returning users bypass onboarding and go to home screen
- Onboarding state persists across app restarts

---

## Flow Diagram

```
┌─────────────┐
│   Welcome   │
│   Screen    │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Benefits   │────▶│  Benefits   │────▶│  Benefits   │────▶│  Benefits   │
│     1       │     │     2       │     │     3       │     │     4       │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
       │                   │                   │                   │
       │                   │                   │                   │
       └───────────────────┴───────────────────┴───────────────────┤
                                   SKIP                            │
                                    │                              ▼
                                    │                       ┌─────────────┐
                                    └──────────────────────▶│ Get Started │
                                                            │   / Home    │
                                                            └─────────────┘
```

## Related Pages

- `src/pages/WelcomePage.tsx`
- `src/pages/OnboardingPage.tsx`

## Notes

- Onboarding should only display once per device/user
- Consider adding animation between slides for polish
- Benefits content should be easily updatable (CMS or config)
