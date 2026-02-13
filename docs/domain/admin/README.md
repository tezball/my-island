# Admin

## Status
Implemented

## Overview
Platform administration portal for managing users, bookings, owners, suppliers, reviews, subscriptions, and financial reporting. Includes a lead CRM for tracking potential campsite partnerships, comprehensive audit logging for all admin actions, and CSV export capabilities for financial data.

## Key Entities

- **AdminAuditLog** -- Records every admin action with before/after snapshots. Tracks the admin user, action type, affected entity, summary, and JSONB detail fields for previous/new values.
- **Lead** -- A prospective campsite owner or supplier tracked through the sales pipeline. Has a computed score (0-100), status lifecycle, business type, tags, and optional assignment to an admin user.
- **LeadInteraction** -- A timestamped log entry on a Lead (call, email, meeting, or note). Tracks who created it and the interaction content.

## Lead Status Lifecycle

```
NEW --> CONTACTED --> QUALIFIED --> CONVERTED
                        |
                       LOST
```

| Status | Description |
|--------|-------------|
| `NEW` | Lead just created, no outreach yet |
| `CONTACTED` | Initial outreach made |
| `QUALIFIED` | Lead has shown genuine interest |
| `CONVERTED` | Lead signed up as an Owner or Supplier |
| `LOST` | Lead is no longer a prospect |

## Lead Scoring Algorithm

Score 0-100 based on weighted factors:

| Factor | Points |
|--------|--------|
| Has email | +15 |
| Has phone | +10 |
| Per interaction (max 5) | +5 each (max 25) |
| Has scheduled follow-up | +10 |
| Has tags | +5 |
| Status: CONTACTED | +5 |
| Status: QUALIFIED | +10 |
| Status: CONVERTED | +20 |

## Enumerations

### BusinessType
`OWNER` | `SUPPLIER`

### LeadStatus
`NEW` | `CONTACTED` | `QUALIFIED` | `CONVERTED` | `LOST`

### InteractionType
`CALL` | `EMAIL` | `MEETING` | `NOTE`

## API Endpoints

All endpoints require `ROLE_ADMIN` and are prefixed with `/api/admin`.

### Dashboard
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/dashboard` | KPI summary (users, bookings, revenue, owners, suppliers) |
| GET | `/admin/revenue-chart` | Revenue data for charts |
| GET | `/admin/booking-breakdown` | Booking status breakdown |
| GET | `/admin/activity` | Recent platform activity feed |

### Users
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/users` | List users with search/filter |
| GET | `/admin/users/{id}` | User detail |
| PUT | `/admin/users/{id}` | Update user |
| PUT | `/admin/users/{id}/toggle-active` | Enable/disable user account |
| GET | `/admin/users/eligible-owners` | Users eligible to become owners (not already an owner) |
| GET | `/admin/users/eligible-suppliers` | Users eligible to become suppliers (not already a supplier) |

### Bookings
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/bookings` | List bookings with filters |
| GET | `/admin/bookings/{id}` | Booking detail |
| PUT | `/admin/bookings/{id}` | Update booking |
| POST | `/admin/bookings/{id}/cancel` | Cancel booking |

### Owners
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/owners` | List owners with subscription filter |
| GET | `/admin/owners/{id}` | Owner detail |
| POST | `/admin/owners` | Create owner (link existing user) |
| PUT | `/admin/owners/{id}` | Update owner (all editable fields) |
| PUT | `/admin/owners/{id}/deactivate` | Toggle owner deactivation |

### Suppliers
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/suppliers` | List suppliers with category filter |
| GET | `/admin/suppliers/{id}` | Supplier detail |
| POST | `/admin/suppliers` | Create supplier (link existing user) |
| PUT | `/admin/suppliers/{id}` | Update supplier (all editable fields) |
| PUT | `/admin/suppliers/{id}/verify` | Toggle supplier verification |
| PUT | `/admin/suppliers/{id}/deactivate` | Toggle supplier deactivation |

### Reviews
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/reviews` | Unified review list (campsite + supplier) |
| PUT | `/admin/reviews/{type}/{id}/flag` | Flag/unflag a review |
| DELETE | `/admin/reviews/{type}/{id}` | Delete a review |

### Subscriptions
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/subscriptions/overview` | Subscription KPIs and stats |
| GET | `/admin/subscriptions` | List all subscriptions |

### Financial
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/financial/revenue` | Revenue summary over time |
| GET | `/admin/financial/service-fees` | Platform service fee totals |
| GET | `/admin/financial/per-owner` | Revenue breakdown per owner |
| GET | `/admin/financial/booking-volume` | Booking volume over time |
| GET | `/admin/financial/export` | CSV export of financial data |

### Lead CRM
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/leads` | List leads with filters |
| POST | `/admin/leads` | Create new lead |
| GET | `/admin/leads/{id}` | Lead detail |
| PUT | `/admin/leads/{id}` | Update lead |
| DELETE | `/admin/leads/{id}` | Delete lead |
| POST | `/admin/leads/{id}/interactions` | Add interaction to lead |
| GET | `/admin/leads/overdue` | Leads with overdue follow-ups |
| GET | `/admin/leads/export` | CSV export of leads |

### Audit Log
| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/audit` | List audit log entries with filters |
| GET | `/admin/audit/{id}` | Audit log entry detail |
| GET | `/admin/audit/entity/{entityType}/{entityId}` | Audit trail for a specific entity |

## Frontend Pages

| Route | Page | Description |
|-------|------|-------------|
| `/admin` | AdminDashboard | KPI cards, revenue chart, booking breakdown, activity feed |
| `/admin/users` | AdminUsers | User list with search, role filter, active filter |
| `/admin/users/:id` | AdminUserDetail | User detail with edit form, toggle active |
| `/admin/bookings` | AdminBookings | Booking list with status and date filters |
| `/admin/bookings/:id` | AdminBookingDetail | Booking detail with cancel action |
| `/admin/owners` | AdminOwners | Owner list with subscription filter, create modal |
| `/admin/owners/:id` | AdminOwnerDetail | Owner detail with full edit, deactivate toggle |
| `/admin/suppliers` | AdminSuppliers | Supplier list with category filter, create modal |
| `/admin/suppliers/:id` | AdminSupplierDetail | Supplier detail with full edit, verify/deactivate toggles |
| `/admin/reviews` | AdminReviews | Unified review list with flag/delete actions |
| `/admin/subscriptions` | AdminSubscriptions | Subscription overview with KPI cards |
| `/admin/financial` | AdminFinancial | Financial charts with CSV export |
| `/admin/leads` | AdminLeads | Lead CRM list with create, filters, CSV export |
| `/admin/leads/:id` | AdminLeadDetail | Lead detail with interaction timeline |
| `/admin/audit` | AdminAuditLog | Audit log with entity type and date filters |

## Migrations

| Version | Description |
|---------|-------------|
| V1049 | Schema changes (adds `is_active` to users) |
| V1050 | Admin audit log table |
| V1051 | Leads CRM tables (leads + lead_interactions) |
| V1059 | Add `is_deactivated` column to owners table |

## Implementation Notes
- All admin actions are automatically logged to `AdminAuditLog` with before/after value snapshots.
- The admin portal is protected by `isAdmin=true` on the User entity. Admin status is set directly in the database.
- Lead scores are computed dynamically based on lead data and interaction count.
- Financial CSV export generates a downloadable report of revenue, service fees, and booking volume.
- The admin portal is accessible at `/admin` and uses a dedicated layout with sidebar navigation.
