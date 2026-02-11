# Identity

## Status
Implemented

## Overview
Handles user authentication, registration, email verification, password management, multi-role support, and staff member management. Users can hold multiple roles simultaneously (Guest, Owner, Supplier) and staff members can be invited to access owner/supplier portals with granular permissions.

## Key Entities

- **User** — Core identity with email/password auth. Flags: `isOwner`, `isSupplier`, `isStaff`, `isAdmin`, `isActive`. Tracks email verification status, password reset tokens, and profile info.
- **StaffMember** — Links a staff user to an owner or supplier. Contains the staff role assignment and invitation status.
- **StaffRole** — Defines a named role with granular permissions (e.g., "Manager" with full access, "Receptionist" with booking-only access).

## User Roles

| Flag | Default | Description |
|------|---------|-------------|
| `isOwner` | `false` | Can manage campsites and lots |
| `isSupplier` | `false` | Can manage supplier offers |
| `isStaff` | `false` | Can access portals of the owner/supplier who invited them |
| `isAdmin` | `false` | Platform superuser with access to the admin portal |
| `isActive` | `true` | Account active status. Disabled users cannot log in. Toggled by platform admins via `/admin/users/{id}/toggle-active`. |

Users start as Guest (all flags false). Roles are additive — a user can be both Owner AND Supplier. Admin is a platform-level role set directly in the database.

## Staff Permission System

Staff members are assigned roles with permission groups and access levels:

- **PermissionGroups**: BOOKINGS, LOTS, PRICING, ANALYTICS, STAFF, OFFERS, CLAIMS, PROFILE
- **AccessLevels**: VIEW_ONLY, FULL

Example: A "Receptionist" role might have BOOKINGS(FULL) + ANALYTICS(VIEW_ONLY).

### Staff Flow
1. Owner/Supplier invites staff by email → `StaffMember` created with `INVITED` status
2. Invitee signs up → `AuthService.signup()` calls `staffService.activateStaffOnSignup()` → user gets `isStaff=true`
3. Staff user logs in → route guards allow access to the inviting owner's/supplier's portal

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Login (returns JWT) |
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/verify-email` | Verify email with token |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |
| GET | `/api/owner/staff` | List owner's staff members |
| POST | `/api/owner/staff` | Invite staff member |
| PUT | `/api/owner/staff/{id}` | Update staff role |
| DELETE | `/api/owner/staff/{id}` | Remove staff member |
| GET | `/api/supplier/staff` | List supplier's staff members |
| POST | `/api/supplier/staff` | Invite staff member |
| PUT | `/api/supplier/staff/{id}` | Update staff role |
| DELETE | `/api/supplier/staff/{id}` | Remove staff member |

## Frontend Pages

- **SignInPage** / **SignUpPage** — Authentication
- **VerifyEmailPage** — Email verification step
- **ForgotPasswordPage** / **ResetPasswordPage** — Password recovery
- **ProfilePage** — User profile management
- **OwnerStaffPage** — Manage owner staff members
- **SupplierStaffPage** — Manage supplier staff members

## Admin User Management

Platform admins can manage users through the admin portal. See [Admin module](../admin/README.md) for full details.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/users` | List users with search/filter |
| GET | `/api/admin/users/{id}` | User detail |
| PUT | `/api/admin/users/{id}` | Update user |
| PUT | `/api/admin/users/{id}/toggle-active` | Enable/disable user account |

## Not Yet Implemented
- Social login (OAuth — Google, Apple, Facebook)
- Account deletion
- Two-factor authentication
