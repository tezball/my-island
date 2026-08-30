# Support Module

**Status**: Implemented

## Overview

Ticket-based support system that allows owners and suppliers to contact platform administrators. Features threaded conversations, status tracking, priority levels, and a full admin management interface.

## Entities

### SupportTicket
| Field | Type | Notes |
|-------|------|-------|
| id | Long | PK, auto-generated |
| user | User (FK) | Ticket creator |
| subject | String(255) | Required |
| description | Text | Required |
| category | TicketCategory enum | GENERAL, BILLING, TECHNICAL, ACCOUNT, BOOKING, OTHER |
| status | TicketStatus enum | OPEN, IN_PROGRESS, RESOLVED, CLOSED |
| priority | TicketPriority enum | LOW, NORMAL, HIGH, URGENT |
| relatedBooking | Booking (FK) | Optional, links to a booking |
| assignedAdmin | User (FK) | Optional, admin assigned to ticket |
| closedAt | LocalDateTime | Set when RESOLVED or CLOSED |
| createdAt | LocalDateTime | Auto-set |
| updatedAt | LocalDateTime | Auto-updated |

### SupportTicketMessage
| Field | Type | Notes |
|-------|------|-------|
| id | Long | PK, auto-generated |
| ticket | SupportTicket (FK) | CASCADE delete |
| sender | User (FK) | Message author |
| content | Text | Required |
| createdAt | LocalDateTime | Auto-set |
| updatedAt | LocalDateTime | Auto-updated (BaseEntity) |

## Endpoints

### User Endpoints (`/api/support/**`)
Accessible to any authenticated user.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/support/tickets` | Create a new ticket |
| GET | `/support/tickets` | List user's own tickets (paginated) |
| GET | `/support/tickets/{id}` | Get ticket details (owner only) |
| GET | `/support/tickets/{id}/messages` | Get ticket messages |
| POST | `/support/tickets/{id}/messages` | Send a message |

### Admin Endpoints (`/api/admin/support/**`)
Requires ADMIN role.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/support/tickets` | List all tickets (filtered, paginated) |
| GET | `/admin/support/tickets/{id}` | Get any ticket |
| GET | `/admin/support/tickets/{id}/messages` | Get any ticket's messages |
| POST | `/admin/support/tickets/{id}/messages` | Reply to any ticket |
| PUT | `/admin/support/tickets/{id}/status` | Update status/priority/assignment |
| GET | `/admin/support/stats` | Ticket counts by status |

## Frontend Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/owner/support` | OwnerSupportPage | Ticket list + create modal + conversation |
| `/supplier/support` | SupplierSupportPage | Same as owner, supplier-themed |
| `/admin/support` | AdminSupportPage | Filterable ticket list with stats |
| `/admin/support/:id` | AdminSupportDetailPage | Ticket detail + conversation + controls |

## Business Rules

1. Any authenticated user can create tickets
2. Users can only view/message their own tickets
3. Admin can view/message any ticket
4. When a user replies to a RESOLVED ticket, it reopens to OPEN
5. Status changes are logged to the admin audit log
6. Closing a ticket sets `closedAt` timestamp
7. Initial ticket description is also stored as the first message
8. Conversations poll for new messages every 15 seconds

## Migration

- `V1065__create_support_tickets.sql` — Creates `support_tickets` and `support_ticket_messages` tables with indexes
- `V1102__add_updated_at_to_support_ticket_messages.sql` — Adds `updated_at` so messages match `BaseEntity`

See [NOTES.md](./NOTES.md) for aggregate and domain model details.
