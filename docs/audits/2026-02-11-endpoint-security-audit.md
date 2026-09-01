# Endpoint Security Audit — 2026-02-11

**Scope**: All 13 API controllers, security infrastructure, service layer, DTOs, and frontend token handling
**Method**: Static code review (no dynamic/penetration testing)
**Auditor**: Claude (AI-assisted review)

---

## Executive Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 2     |
| HIGH     | 7     |
| MEDIUM   | 10    |
| LOW      | 12    |
| INFO     | 5     |

The application has a solid foundation — server-side price calculation, ownership checks via `StaffPermissionChecker`, BCrypt password hashing, and well-structured exception handling. However, several critical gaps exist around rate limiting, image endpoint authorization, race conditions, and the email verification bypass that should be addressed before any production deployment.

---

## CRITICAL

### C-1: No Rate Limiting on Auth Endpoints

**Affected**: `AuthController` — `/auth/login`, `/auth/signup`, `/auth/forgot-password`
**File**: `SecurityConfig.java:51` — `requestMatchers("/auth/**").permitAll()`

No rate limiting exists anywhere in the codebase. Attackers can:
- Brute-force login credentials at unlimited speed
- Perform credential stuffing attacks
- Flood forgot-password to spam a user's inbox
- Mass-create accounts via signup

**Recommendation**: Add rate limiting via Spring Boot Bucket4j or a servlet filter. Suggested: 5 login/min/IP, 3 forgot-password/hr/email, 10 signups/hr/IP.

---

### C-2: No Account Lockout Mechanism

**Affected**: `AuthService.java:83-96`, `User.java`

There is no `failedLoginAttempts` counter, no `lockedUntil` timestamp, and no lockout logic. The `User` entity has no fields to track failed attempts. Combined with C-1, this enables unlimited brute-force.

**Recommendation**: Add `failedLoginAttempts` (int) and `lockedUntil` (LocalDateTime) to `User`. Lock after 5 consecutive failures with progressive backoff.

---

## HIGH

### H-1: Image Endpoints — No Ownership Verification (IDOR)

**Affected**: `ImageUploadController` — ALL mutation endpoints (POST upload, PATCH primary/order/alt, DELETE)
**File**: `ImageUploadController.java:29-109`

None of the image mutation endpoints use `@AuthenticationPrincipal`. The `EntityImageService` blindly trusts the `entityType` and `entityId` from the URL. Any authenticated user can:
- Upload images to any owner's lots, any supplier's offers, or any user's profile
- Delete any image by ID
- Set any image as primary for any entity
- Change display order or alt text of any image

**Impact**: Defacement of competitor listings, deletion of other users' images.

**Recommendation**: Add `@AuthenticationPrincipal` to all mutation endpoints. Before any write operation, verify the authenticated user owns the target entity.

---

### H-2: Email Verification Bypass — Unverified Users Get Full Access

**Affected**: `AuthService.java:56-81`, `SecurityConfig.java:49-83`

After signup, a JWT is issued immediately (line 78) regardless of `emailVerified` status. No filter or authorization check restricts unverified users. An attacker can sign up with any email (even one they don't own) and immediately access all authenticated endpoints, including upgrading to Owner/Supplier.

**Recommendation**: Either block JWT issuance until email is verified, or add a filter that restricts unverified users to: view profile, resend verification, logout.

---

### H-3: Email Enumeration on Signup

**Affected**: `AuthService.java:57-58`

```java
if (userRepository.existsByEmail(request.email())) {
    throw new ConflictException("Email already registered");
}
```

Returns HTTP 409 with a clear message, allowing attackers to enumerate registered emails. Combined with C-1, this enables bulk email harvesting.

**Recommendation**: Return a generic success for both new and existing emails. Send an "account already exists" notification to the existing user instead.

---

### H-4: JWT Has No Revocation Mechanism

**Affected**: `JwtProvider.java`, `AuthController.java:43-48`

JWTs have a 24-hour expiration with no server-side revocation. Logout is a no-op (client discards token). If a token is stolen, it remains valid for up to 24 hours. Critical consequence: password reset (`AuthService.java:183-197`) does NOT invalidate existing tokens — an attacker with a stolen token retains access even after the victim resets their password.

**Recommendation**: Implement a token blacklist (Redis-backed) or switch to short-lived access tokens (15 min) + refresh tokens. Add a `tokenVersion` field to `User` and check it during JWT validation.

---

### H-5: Race Condition — Double Booking (TOCTOU)

**Affected**: `BookingService.java:126-148`, `BookingRepository.java:35-42`

The overlap check is a simple SELECT without `FOR UPDATE`. At the default `READ_COMMITTED` isolation, two concurrent requests for the same lot/dates can both pass the overlap check and both create bookings. Same issue in `createManualBooking` (lines 415-419).

**Recommendation**: Add `SELECT ... FOR UPDATE` (pessimistic lock) to the overlap query, or use a database unique constraint, or `@Transactional(isolation = Isolation.SERIALIZABLE)`.

---

### H-6: Race Condition — Offer Claim Count Bypass (TOCTOU)

**Affected**: `MarketplaceService.java:97-98, 136-138`

`claimOffer` checks `offer.isAvailable()` (reads `currentClaims < maxClaims`) then increments `currentClaims`. Two concurrent requests can both pass the availability check before either writes, allowing claims beyond `maxClaims`. Same pattern for duplicate claim check (lines 101-103).

**Recommendation**: Use pessimistic locking or an atomic `UPDATE ... SET current_claims = current_claims + 1 WHERE current_claims < max_claims` and check affected row count. Add a unique constraint on `(offer_id, user_id)` where `is_test = false`.

---

### H-7: simulate-payment-success Endpoint Active by Default

**Affected**: `BookingService.java:301-333`, `BookingController.java:110-116`

`POST /{id}/payment/simulate-success` checks `stripeProperties.isDevMode()`, which defaults to `true` via `${STRIPE_DEV_MODE:true}` in `application.yml:80`. No `@Profile("dev")` restriction. If the env var is not explicitly set to `false` in production, any authenticated user can skip payment entirely.

**Recommendation**: Add `@Profile("dev")` annotation or change the default to `false`. Ideally move to a separate dev-only controller.

---

## MEDIUM

### M-1: Weak Password Policy

**Affected**: `SignupRequest.java:12-13`, `ResetPasswordRequest.java:8`

Only `@Size(min = 8)` — no uppercase, lowercase, digit, or special character requirements. No maximum length (bcrypt DoS with very long inputs). No common password checks.

**Recommendation**: Add `@Pattern` requiring mixed character types. Add `@Size(max = 128)`. Consider Passay library.

---

### M-2: Hardcoded JWT Secret Default

**Affected**: `application.yml:64`

```yaml
jwt:
  secret: ${JWT_SECRET:myisland-dev-jwt-secret-key-that-is-at-least-256-bits-long}
```

If `JWT_SECRET` is not set in production, this readable default is used. Anyone who reads the source can forge JWTs.

**Recommendation**: Remove the default value. Fail fast on startup if not configured.

---

### M-3: Open Redirect via Stripe Connect Onboarding

**Affected**: `OwnerController.java:361-365`, `SupplierController.java:246-250`, `StripeConnectService.java:42,82`

The `returnUrl` and `refreshUrl` parameters are passed directly from the client request to `AccountLinkCreateParams` without validation. An attacker could supply a malicious URL, and after Stripe onboarding completion, the user would be redirected to the attacker's site via Stripe.

**Recommendation**: Validate `returnUrl` and `refreshUrl` against an allowlist of your frontend domains.

---

### M-4: Image Content-Type Validation Relies on Client Header Only

**Affected**: `ImageUploadService.java:109-120`

`file.getContentType()` is client-controlled. An attacker could upload a malicious HTML/SVG file with Content-Type set to `image/jpeg`. If S3 serves the file with the spoofed content type, this enables stored XSS.

**Recommendation**: Add magic-byte validation (Apache Tika or manual signature check) to verify actual file content matches claimed type.

---

### M-5: Claim Code Predictability

**Affected**: `MarketplaceService.java:256-263`

Format: `{2-char-prefix}-{year}-{sequence}-{6-char-UUID-fragment}`. Prefix is from the business name (known), year is known, sequence is predictable. Only 6 hex random characters (~16.7M combinations).

**Recommendation**: Increase random portion to 8-10 characters or use `SecureRandom` for a fully random code.

---

### M-6: Offer Redemption Race Condition

**Affected**: `MarketplaceService.java:200-232`

`redeemClaim` reads claim status, checks `CLAIMED`, then updates to `REDEEMED`. Without a pessimistic lock, two concurrent redemptions could both succeed.

**Recommendation**: Use `SELECT FOR UPDATE` on the claim query or add `@Version` for optimistic locking.

---

### M-7: Swagger/OpenAPI Exposed Without Authentication

**Affected**: `SecurityConfig.java:53`

Swagger UI and API docs are publicly accessible, revealing the entire API surface to potential attackers.

**Recommendation**: Restrict to dev/staging via profile-based conditional, or protect behind authentication in production.

---

### M-8: Actuator Prometheus Endpoint Exposed

**Affected**: `SecurityConfig.java:52`, `application.yml:95-102`

`/actuator/prometheus` is publicly accessible and leaks internal metrics (memory, threads, HTTP counts, DB pool stats).

**Recommendation**: Protect `/actuator/prometheus` behind authentication or restrict to internal networks.

---

### M-9: Webhook Blanket Path

**Affected**: `SecurityConfig.java:54`

`requestMatchers("/webhooks/**").permitAll()` — any future webhook endpoint under this path will be unauthenticated by default. Currently only Stripe is implemented (with signature verification), but this is a foot-gun.

**Recommendation**: Narrow to `/webhooks/stripe/**` or verify all handlers under this path validate signatures.

---

### M-10: Missing `@Size` Constraints on DTO String Fields

**Affected**: Multiple DTOs

- `CreateBookingRequest.specialRequests` — no length limit
- `CreateManualBookingRequest.guestName` — `@NotBlank` but no max
- `CreateManualBookingRequest.guestEmail` — no `@Email` or length validation
- `CreateManualBookingRequest.guestPhone` — no format/length
- `CreateManualBookingRequest.bookingSource` — no length limit
- `SignupRequest.name` — no max length
- `UpdateOwnerRequest` / `UpdateSupplierRequest` — no max on description, website, etc.

Attackers can submit multi-MB strings causing memory/DB issues.

**Recommendation**: Add `@Size(max = ...)` to all string fields. Add `@Email` to email fields.

---

## LOW

### L-1: CORS Hardcoded to localhost

**Affected**: `SecurityConfig.java:92-93`

Only allows `localhost:5173` and `localhost:3000`. Will break in production unless overridden, potentially leading to an emergency `*` wildcard.

**Recommendation**: Make configurable via `${CORS_ALLOWED_ORIGINS}`.

---

### L-2: Sequential IDs Expose User Counts

**Affected**: `AuthResponse.java:19`

Sequential `Long id` in the auth response allows enumeration and user count estimation.

**Recommendation**: Consider UUIDs as public-facing identifiers.

---

### L-3: PII (Emails) Logged in Plaintext

**Affected**: `AuthController.java:39`, `AuthService.java:69,92,129,166,179,196`

User emails logged at INFO level in multiple places.

**Recommendation**: Mask emails in production logs (e.g., `f***@example.com`).

---

### L-4: Forgot-Password Timing Oracle

**Affected**: `AuthService.java:172-181`

When email exists: generates token + DB write + sends email (slow). When not: returns immediately (fast). Timing difference reveals email registration status.

**Recommendation**: Add constant-time delay or dummy operation for non-existent emails.

---

### L-5: Password Reset Token Uses UUID

**Affected**: `AuthService.java:174`

`UUID.randomUUID()` provides 122 bits of entropy — adequate but not ideal. A 256-bit `SecureRandom` token would be more robust.

**Recommendation**: Use `SecureRandom` with 32 bytes encoded as Base64url.

---

### L-6: Error Messages Reveal Object Existence

**Affected**: `OwnerService.java:166,169`, `SupplierService.java:163-164,216-217`

Messages like "Lot does not belong to this owner" confirm the lot ID is valid. Enables ID enumeration.

**Recommendation**: Use generic `ResourceNotFoundException` regardless of ownership mismatch.

---

### L-7: Stripe Exception Details Leaked to Client

**Affected**: `BookingService.java:206-207, 264-265`

Stripe exception messages passed directly to client via `BadRequestException`. May leak internal Stripe account details.

**Recommendation**: Return a generic payment error message. Log the Stripe details server-side only.

---

### L-8: S3 Key Exposed in Image DTO

**Affected**: `ImageUploadController.java:126`

`EntityImageDto` includes `s3Key`, leaking internal S3 bucket structure.

**Recommendation**: Remove `s3Key` from the public DTO.

---

### L-9: JWT in localStorage (XSS-Vulnerable)

**Affected**: `AuthContext.tsx:44,56`, `apiClient.ts:39`, `authService.ts:137`

JWT stored in `localStorage` is accessible to any JavaScript on the page. An XSS vulnerability anywhere would enable token theft. No `dangerouslySetInnerHTML` was found (good), but third-party scripts or future code could introduce XSS.

**Recommendation**: Consider httpOnly cookies for token storage, or accept this trade-off with vigilant XSS prevention.

---

### L-10: No Staff Member Limit

**Affected**: `StaffService.java:44-71, 75-103`

No limit on how many staff an owner/supplier can invite. Could be abused for DoS or email enumeration.

**Recommendation**: Add a reasonable limit (e.g., 20 staff per entity).

---

### L-11: Review Response Bypasses Staff Permission System

**Affected**: `ReviewService.java:86-91`

Uses `ownerRepository.findByUserId()` directly instead of `permissionChecker.resolveOwnerAndCheck()`. Staff with `REVIEWS: FULL` permission cannot respond to reviews, inconsistent with the permission model.

**Recommendation**: Use the `StaffPermissionChecker` for consistency.

---

### L-12: Stripe Customer Created on Every Payment — No Deduplication

**Affected**: `BookingPaymentService.java:497-508`

Every booking creates a new Stripe Customer (comment: "In a real app, you'd store customer ID on the User entity"). Creates Stripe data pollution and could exhaust API rate limits.

**Recommendation**: Store Stripe customer ID on the `User` entity and reuse it.

---

## INFORMATIONAL (Positive Findings)

### I-1: Server-Side Price Calculation ✅

Prices computed via `pricingService.calculateTotalPrice()` server-side. Service fees calculated server-side. Client cannot manipulate amounts.

### I-2: Ownership Checks on Key Operations ✅

`BookingService.getBookingById`, `cancelBooking`, `confirmBooking`, `checkInBooking` all verify user ownership via `userId` from JWT. `OwnerService` and `SupplierService` use `StaffPermissionChecker` throughout.

### I-3: Exception Handler Does Not Leak Stack Traces ✅

`GlobalExceptionHandler` returns generic messages. Stack traces logged server-side only. `BadCredentialsException` returns "Invalid email or password" without revealing which field is wrong.

### I-4: BCrypt Password Hashing ✅

Default BCrypt with work factor 10 — appropriate for current hardware.

### I-5: CSRF Disabled Appropriately ✅

CSRF disabled because auth uses JWT Bearer tokens (not cookies), which are not auto-attached by browsers.

---

## Remediation Priority

### Immediate (Pre-Production Blockers)

| # | Finding | Effort |
|---|---------|--------|
| 1 | C-1: Add rate limiting to auth endpoints | Medium |
| 2 | H-1: Add ownership verification to image endpoints | Medium |
| 3 | H-7: Restrict simulate-payment-success to dev profile | Low |
| 4 | M-2: Remove hardcoded JWT secret default | Low |
| 5 | H-2: Enforce email verification | Medium |

### Short-Term (Before Public Launch)

| # | Finding | Effort |
|---|---------|--------|
| 6 | C-2: Add account lockout | Medium |
| 7 | H-5: Fix booking double-booking race condition | Medium |
| 8 | H-6: Fix offer claim count race condition | Medium |
| 9 | H-3: Fix email enumeration on signup | Low |
| 10 | M-1: Strengthen password policy | Low |
| 11 | M-3: Validate Stripe Connect redirect URLs | Low |
| 12 | M-7: Restrict Swagger to dev/staging | Low |
| 13 | M-10: Add @Size constraints to all DTOs | Low |

### Medium-Term (Post-Launch Hardening)

| # | Finding | Effort |
|---|---------|--------|
| 14 | H-4: Implement JWT revocation or refresh tokens | High |
| 15 | M-4: Add magic-byte image validation | Medium |
| 16 | M-5: Increase claim code entropy | Low |
| 17 | M-6: Fix redemption race condition | Medium |
| 18 | M-8: Protect actuator endpoints | Low |
| 19 | M-9: Narrow webhook path pattern | Low |
| 20 | L-1 through L-12: Address low-severity items | Various |
