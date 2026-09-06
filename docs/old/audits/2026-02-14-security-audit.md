# Security Audit Report — 2026-02-14

## Scope

Full security audit of the My Island API backend: **197 endpoints** across **25 controllers**.

**Areas covered**: Authentication, authorization, input validation, CORS, rate limiting, file uploads, data access controls (IDOR), claim code generation, admin privilege escalation, SQL injection, XSS, error handling.

## Executive Summary

The application has a solid security foundation: parameterized queries (Spring Data JPA), BCrypt password hashing, stateless JWT sessions, no stack traces in errors, and granular RBAC via `StaffPermissionChecker`. Six vulnerabilities were identified — four were fixed in this audit, one was confirmed already adequate, and one was deferred as low-priority.

| Severity | Found | Fixed | Deferred |
|----------|-------|-------|----------|
| Critical | 1 | 1 | 0 |
| High | 2 | 2 | 0 |
| Medium | 2 | 1 | 0 |
| Low | 1 | 0 | 1 |

## Findings & Remediations

### 1. CORS Hardcoded to localhost (Critical) — FIXED

**File**: `SecurityConfig.java`
**Issue**: CORS allowed origins were hardcoded to `http://localhost:5173` and `http://localhost:3000`. In production, the API would reject legitimate frontend requests or require a code change to update origins.
**Fix**: Made origins configurable via `myisland.cors.allowed-origins` property in `application.yml`, defaulting to localhost for development. Production deployment sets `CORS_ALLOWED_ORIGINS` environment variable.

### 2. File Upload MIME Header-Only Validation (High) — FIXED

**File**: `ImageUploadService.java`
**Issue**: File upload validation checked only the `Content-Type` header from the HTTP request, which is client-controlled and trivially spoofable. An attacker could upload a malicious file (e.g., HTML with XSS, executable) with a forged `image/jpeg` content type.
**Fix**: Added magic byte (file signature) validation that reads the first 12 bytes of the uploaded file and verifies they match the expected signatures for JPEG (`FF D8 FF`), PNG (`89 50 4E 47`), GIF (`GIF87a`/`GIF89a`), and WebP (`RIFF...WEBP`). Files whose content doesn't match the declared MIME type are rejected with a 400 error.

### 3. Predictable Sequential Claim Codes (High) — FIXED

**File**: `MarketplaceService.java`
**Issue**: Claim codes used the format `XX-YYYY-NNN-RANDOM` where `NNN` was the sequential claim count (`offer.getCurrentClaims() + 1`). This leaked business intelligence (claim volume) and made codes partially predictable — an attacker knowing the pattern could brute-force the 6-char random suffix.
**Fix**: Replaced the sequential counter with an 8-character cryptographically random code using `SecureRandom` and an unambiguous alphabet (excludes I/O/0/1). New format: `XX-YYYY-XXXXXXXX` where the 8-char segment provides ~40 bits of entropy, making brute-force infeasible.

### 4. Missing Rate Limiting on Booking/Image Endpoints (Medium) — FIXED

**File**: `RateLimitFilter.java`
**Issue**: Rate limiting only covered auth endpoints (`/auth/login`, `/auth/signup`, `/auth/forgot-password`, `/auth/resend-verification`). Booking creation and image upload had no rate limits, enabling abuse (resource exhaustion, S3 cost amplification).
**Fix**: Added rate limits:
- `POST /bookings`: 20 per hour per IP
- `POST /images/*`: 30 per hour per IP (prefix-matching for all image upload paths)
- `POST /reviews`: 10 per hour per IP

### 5. Admin Audit Coverage for Role Grants (Medium) — VERIFIED ADEQUATE

**Files**: `AdminOwnerService.java`, `AdminSupplierService.java`
**Issue**: Concern that admin-initiated role grants (creating owners/suppliers) might not be audit-logged, allowing silent privilege escalation.
**Finding**: All admin role-granting operations are already logged via `AdminAuditService`:
- `CREATE_OWNER` — logs admin user ID, new owner ID, property name, and user email
- `CREATE_SUPPLIER` — logs admin user ID, new supplier ID, business name, and user email
- `UPDATE_OWNER` / `UPDATE_SUPPLIER` — logs all updates
- `TOGGLE_OWNER_DEACTIVATED` / `TOGGLE_SUPPLIER_DEACTIVATED` — logs activation changes
- `TOGGLE_SUPPLIER_VERIFIED` — logs verification changes

No fix needed.

### 6. JWT Uses Email as Subject (Low) — DEFERRED

**File**: `JwtTokenProvider.java`
**Issue**: JWT tokens use the user's email address as the `sub` claim rather than a stable user ID. If a user changes their email, existing tokens would reference a stale identifier. Additionally, email addresses in JWT payloads (base64-encoded, not encrypted) are a minor PII exposure.
**Rationale for deferral**: The application does not currently support email changes. The risk is theoretical and the fix would require coordinated changes across JWT generation, validation, and all token-consuming code. Should be addressed when email change functionality is added.

## Strengths Confirmed

| Area | Assessment |
|------|------------|
| SQL Injection | No risk — all queries via Spring Data JPA parameterized queries |
| Password Storage | BCrypt with default strength (10 rounds) |
| Error Handling | `GlobalExceptionHandler` returns structured JSON, no stack traces |
| CSRF | Disabled (appropriate for stateless JWT API) |
| Session Management | Stateless (`SessionCreationPolicy.STATELESS`) |
| IDOR Protection | Ownership checks on Booking, Message, Staff, Images, Offers, Claims |
| Staff RBAC | `StaffPermissionChecker` enforces granular permission groups and access levels |
| Auth Flow | Login blocks unverified email accounts; email verification required before access |
| Admin Isolation | All `/admin/**` endpoints require `ROLE_ADMIN` |
| Role Separation | Owner endpoints require `ROLE_OWNER` or `ROLE_STAFF`; Supplier endpoints require `ROLE_SUPPLIER` or `ROLE_STAFF` |

## Authorization Matrix

| Endpoint Group | No Token | Guest | Owner | Supplier | Staff | Admin |
|---------------|----------|-------|-------|----------|-------|-------|
| `GET /campsites/**` | 200 | 200 | 200 | 200 | 200 | 200 |
| `GET /marketplace/**` | 200 | 200 | 200 | 200 | 200 | 200 |
| `POST /bookings` | 401 | 200 | 200 | 200 | 200 | 200 |
| `GET /bookings/{id}` | 401 | 200* | 200* | 200* | 200* | 200 |
| `/owner/**` | 401 | 403 | 200 | 403 | 200** | 200*** |
| `/supplier/**` | 401 | 403 | 403 | 200 | 200** | 200*** |
| `/admin/**` | 401 | 403 | 403 | 403 | 403 | 200 |

\* IDOR check — only the booking owner can access their own booking
\** Staff access scoped to their assigned Owner/Supplier via `StaffPermissionChecker`
\*** Admin bypasses ownership checks

## Rate Limiting Summary

| Endpoint | Limit | Window |
|----------|-------|--------|
| `POST /auth/login` | 100 | 15 min |
| `POST /auth/signup` | 10 | 1 hour |
| `POST /auth/forgot-password` | 3 | 1 hour |
| `POST /auth/resend-verification` | 3 | 1 hour |
| `POST /bookings` | 20 | 1 hour |
| `POST /images/*` | 30 | 1 hour |
| `POST /reviews` | 10 | 1 hour |

## Files Modified

| File | Change |
|------|--------|
| `config/SecurityConfig.java` | CORS origins from `@Value` property instead of hardcoded |
| `shared/storage/ImageUploadService.java` | Added magic byte validation for JPEG, PNG, GIF, WebP |
| `modules/marketplace/service/MarketplaceService.java` | Claim codes use `SecureRandom` instead of sequential counter |
| `config/RateLimitFilter.java` | Added rate limits for bookings, images, reviews; prefix matching |
| `application.yml` | Added `myisland.cors.allowed-origins` property |

## Recommendations for Future Work

1. **JWT subject migration** — When email change feature is added, switch JWT `sub` to user ID
2. **Content Security Policy** — Add CSP headers for production deployment
3. **Dependency audit** — Run `mvn dependency:tree` + OWASP Dependency-Check for known CVEs
4. **Penetration testing** — Engage external security firm for production pre-launch audit
5. **Security headers** — Add `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, `X-Frame-Options` for production
