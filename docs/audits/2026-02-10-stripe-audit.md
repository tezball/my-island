# Stripe Payment Integration — Audit Report

**Date:** 2026-02-10
**Status:** Dev mode (`stripe.dev-mode: true`) — no live Stripe calls

---

## Payment Flows Overview

### 1. Owner Subscription (Monthly)
- **Backend:** `OwnerSubscriptionService.java` → SetupIntent + confirm flow
- **Frontend:** `SubscriptionForm.tsx` → DevModeForm (dev) or Stripe Elements (prod)
- **Endpoints:** `POST /owner/subscription/setup-intent`, `POST /owner/subscription/confirm`
- **Dev mode:** Mock customer `cus_dev_{ownerId}`, auto-activates 30-day subscription

### 2. Supplier Subscription (Monthly)
- **Backend:** `SubscriptionService.java` → identical pattern to owner
- **Frontend:** Same `SubscriptionForm.tsx` component
- **Endpoints:** `POST /supplier/subscription/setup-intent`, `POST /supplier/subscription/confirm`
- **Dev mode:** Mock customer `cus_dev_supplier_{supplierId}`, auto-activates

### 3. Booking Payment (Authorization + Manual Capture)
- **Backend:** `BookingPaymentService.java` → PaymentIntent with manual capture
- **Frontend:** `PaymentForm.tsx` → CardElement or dev mode simulation
- **Endpoints:** `POST /bookings/{id}/payment/intent`, `POST /bookings/{id}/payment/simulate-success`
- **Flow:** Guest pays → funds authorized → owner confirms → capture → transfer to owner Connect account
- **Dev mode:** Mock `pi_dev_booking_{bookingId}`, simulated capture/release/refund

### 4. Featured Listing (One-Time Payment)
- **Backend:** `FeaturedPromotionService.java` (owner), `SupplierFeaturedPromotionService.java` (supplier)
- **Frontend:** Redirect to Stripe Checkout (no embedded form)
- **Pricing:** 7 days = €9.99, 30 days = €29.99
- **Dev mode:** Mock `cs_dev_featured_{owner|supplier}_{id}`, auto-activates and redirects to success URL

### 5. Stripe Connect (Payouts to Owners/Suppliers)
- **Backend:** `StripeConnectService.java` → Express account onboarding
- **Frontend:** `ConnectOnboarding.tsx` → status display + onboarding CTA
- **Endpoints:** `GET /owner/connect/status`, `POST /owner/connect/onboard`
- **Dev mode:** Mock `acct_dev_owner_{id}`, immediate onboarding completion

### 6. Webhooks
- **Controller:** `StripeWebhookController.java` at `POST /webhooks/stripe`
- **Events handled:** `customer.subscription.*`, `checkout.session.completed`, `account.updated`, `payment_intent.*`, `charge.*`, `transfer.created`

---

## Dev Mode Architecture

Toggled via `stripe.dev-mode: true` in `application.yml` (line 80). Default is `true`.

| Feature | Dev Mode | Production |
|---------|----------|------------|
| Subscriptions | Mock customer/subscription, auto-activate | Real Stripe SetupIntent + confirm |
| Booking Payment | Mock PaymentIntent, simulated capture | Real PaymentIntent + manual capture |
| Featured Listings | Mock `cs_dev_featured_{id}`, auto-activate | Real Checkout |
| Connect Onboarding | Mock account, immediate completion | Real Express onboarding |
| Payouts/Transfers | Simulated with `tr_dev_{id}` | Real transfer to Connect account |

Frontend detects dev mode via `devMode: boolean` field in API responses (`PaymentIntentResponse`, `SetupIntentResponse`, `OnboardingLinkResponse`).

---

## Verified Bugs (Fixed)

### BUG-1: ConnectOnboarding dynamic Tailwind classes (CRITICAL)

**File:** `my-island-web/src/components/owner/ConnectOnboarding.tsx`

The "Continue Setup" button used dynamic Tailwind class interpolation (`bg-${primaryColor}`) which doesn't work with Tailwind's JIT compiler. The classes are never generated because Tailwind can't detect them at build time.

**Impact:** Button renders with no background color for the incomplete-onboarding state.

**Fix:** Replaced with static conditional classes matching the pattern already used by the "Set Up Payouts" button. Removed unused `primaryColor`/`hoverColor` variables.

### BUG-2: SubscriptionForm DevModeForm swallows errors (MEDIUM)

**File:** `my-island-web/src/components/subscription/SubscriptionForm.tsx`

The `DevModeForm` component's `handleSubmit` catch block logged errors but never displayed them to the user. If `onConfirm()` threw (e.g., network error during `confirmSubscription`), the form silently failed.

**Impact:** Users in dev mode see no feedback on subscription confirmation failure.

**Fix:** Added `error` state and error display banner below the dev mode indicator.

### BUG-3: PaymentDetailsPage is entirely mock (MEDIUM)

**File:** `my-island-web/src/pages/profile/PaymentDetailsPage.tsx`

Hardcoded payment method data with no API calls. The "Add Card" form had no submit handler. This was dead code — guest payment cards are collected per-booking via Stripe Elements, not stored in our system.

**Impact:** Confusing UX — page suggests card management that doesn't exist.

**Fix:** Removed the page, its route from `App.tsx`, and the link from `ProfilePage.tsx`.

### BUG-4: Test card info shown in production mode (LOW)

**File:** `my-island-web/src/components/booking/PaymentForm.tsx`

The test card info block (`4242 4242 4242 4242`) was gated by `!paymentIntent?.devMode` — showing it when dev mode is OFF (i.e., production). In dev mode the card element is hidden so this was invisible, but in production with a live Stripe key, users would see test card numbers.

**Impact:** Cosmetic issue in production that would confuse real users.

**Fix:** Removed the test card info block entirely.

---

## Additional Observations (Not Fixed)

These are lower-priority items found during the audit that don't need immediate fixes:

1. **Webhook dual-routing for subscriptions:** Both supplier and owner subscription handlers are called for every `customer.subscription.*` event. Each handler queries by `stripeCustomerId` and returns early if not found. This works but could be cleaner with metadata-based routing.

2. **BookingPaymentService creates new Stripe customer per booking:** `getOrCreateCustomer()` doesn't persist the customer ID on the User entity, so repeat guests get multiple Stripe customers.

3. **Featured URL configuration:** `featured-success-url` and `featured-cancel-url` aren't in the main YAML config. The services use fallback logic that rewrites the owner/supplier success URLs, which is fragile.
