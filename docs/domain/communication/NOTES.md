# Communication Context Notes

## Purpose
In-app messaging between guests and property owners/staff, scoped to individual bookings.

## Aggregates

- **Message** — A single message in a per-booking conversation thread. References Booking (FK) and User as sender (FK). Tracks read/unread status.

## Business Rules

1. **Booking-scoped**: Messages belong to a booking. Both the guest who made the booking and the owner of the lot can participate.
2. **Read tracking**: When a user fetches a conversation, all messages sent by the other party are marked as read.
3. **Access control**: Only the booking guest and the lot owner can view or send messages for a given booking.
4. **No editing/deleting**: Messages are immutable once sent.

## Domain Events
- `MessageSent`: New message -> Recipient notification (planned, not yet wired to notification system)

## Implementation Details

### Backend
- Module: `modules/communication/` with `MessageController`, `MessageService`, `MessageRepository`
- DTOs: `MessageDto`, `SendMessageRequest`, `ConversationSummaryDto`
- Entity: `Message` extends `BaseEntity` (inherits `id`, `createdAt`, `updatedAt`)
- Migration: `V1058__create_messages.sql`

### Frontend
- Service: `messageService.ts` (uses shared `apiRequest` helper)
- Types: `Message`, `ConversationSummary` in `types/message.ts`
- Components: `BookingConversation.tsx` (reusable chat UI with 15s polling)
- Pages: `BookingMessagesPage.tsx` (guest), `OwnerMessagesPage.tsx` (owner)
- Routes: `/trips/{bookingId}/messages` (guest), `/owner/messages` (owner)

## Enums

### NotificationType (notification module, not communication)
- `BOOKING`: Confirmation, updates
- `REVIEW`: New review, owner response
- `OFFER`: Promotional deals
- `SYSTEM`: Platform announcements
- `REMINDER`: Check-in/check-out reminders
