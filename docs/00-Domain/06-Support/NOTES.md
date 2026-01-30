# Support Context Notes

## Purpose
Customer service and issue resolution.

## Aggregates

### SupportTicket Aggregate (Root)
```
SupportTicket (Root)
└── TicketMessage[] (Entity)
```

#### Entities

**SupportTicket**
- `id`: UUID
- `userId`: UUID
- `subject`: String
- `description`: String
- `category`: String
- `status`: TicketStatus
- `relatedBookingId`: UUID (optional)

## Enums

### TicketStatus
- `OPEN`
- `IN_PROGRESS`
- `RESOLVED`
- `CLOSED`

## Domain Events
- `TicketCreated`: Support ticket opened
