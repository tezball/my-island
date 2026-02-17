# Support Context Notes

## Purpose
Customer service and issue resolution for owners and suppliers.

## Aggregates

### SupportTicket Aggregate (Root)
```
SupportTicket (Root)
└── SupportTicketMessage[] (Entity)
```

#### Entities

**SupportTicket**
- `id`: Long (PK)
- `user`: User (FK) — ticket creator
- `subject`: String(255)
- `description`: Text
- `category`: TicketCategory
- `status`: TicketStatus
- `priority`: TicketPriority
- `relatedBooking`: Booking (FK, optional)
- `assignedAdmin`: User (FK, optional)
- `closedAt`: LocalDateTime

**SupportTicketMessage**
- `id`: Long (PK)
- `ticket`: SupportTicket (FK, CASCADE)
- `sender`: User (FK)
- `content`: Text
- `createdAt`: LocalDateTime

## Enums

### TicketCategory
- `GENERAL`, `BILLING`, `TECHNICAL`, `ACCOUNT`, `BOOKING`, `OTHER`

### TicketStatus
- `OPEN` → `IN_PROGRESS` → `RESOLVED` → `CLOSED`
- User reply to RESOLVED ticket reopens to OPEN

### TicketPriority
- `LOW`, `NORMAL`, `HIGH`, `URGENT`

## Business Rules / Invariants
- Users can only access their own tickets
- Admin can access all tickets
- Creating a ticket creates an initial message from the description
- Status transitions are logged to admin audit log
- RESOLVED/CLOSED sets closedAt; reopening clears it
- Messages have a 5000 character limit

## Domain Events
- `TicketCreated`: Support ticket opened (not yet wired to notifications)
