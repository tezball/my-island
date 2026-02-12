# Communication

## Status
Partially implemented — In-app messaging between guests and owners is live. Email delivery and system announcements are not yet built.

## Overview
Provides per-booking message threads between guests and property owners/staff. Messages are tied to a booking and accessible from both the guest Trips view and the owner Messages dashboard. The Kafka topic infrastructure for domain events is already in place.

## Key Entities

- **Message** (extends BaseEntity) — A single message in a booking conversation. Links to a Booking and a sender (User). Supports read/unread tracking.

### Message

| Field | Type | Description |
|-------|------|-------------|
| id | Long | Unique identifier |
| booking | Booking (FK) | The booking this conversation belongs to |
| sender | User (FK) | User who sent the message |
| content | String (TEXT) | Message body |
| isRead | Boolean | Whether the recipient has read the message (default false) |
| createdAt | Timestamp | When the message was sent |
| updatedAt | Timestamp | Last update |

**Database indexes**: `booking_id`, `sender_id`, partial index on `(booking_id, is_read) WHERE is_read = FALSE`.

Migration: `V1058__create_messages.sql`

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/messages/booking/{bookingId}` | Get conversation messages for a booking (marks received messages as read) |
| POST | `/api/messages/booking/{bookingId}` | Send a message in a booking conversation |
| GET | `/api/messages/unread` | Get unread message counts per booking for the current user |
| GET | `/api/messages/owner/conversations` | Get all conversations for the owner with latest message summary |

### Response DTOs

**MessageDto**: id, bookingId, senderId, senderName, content, isRead, createdAt

**ConversationSummaryDto**: bookingId, lotName, guestName, checkInDate, checkOutDate, lastMessageContent, lastMessageSenderName, lastMessageAt, unreadCount

## Frontend Pages

- **BookingMessagesPage** (`/trips/{bookingId}/messages`) — Guest-side full-page chat view for a booking conversation
- **OwnerMessagesPage** (`/owner/messages`) — Owner-side conversation list with inline chat panel
- **BookingConversation** — Reusable chat UI component with 15-second polling, auto-scroll to newest message, and Enter-to-send

### Guest Access
- "Message Owner" link appears on the Trips page for bookings with CONFIRMED or CHECKED_IN status
- Navigates to `/trips/{bookingId}/messages`

### Owner Access
- "Messages" link in the owner sidebar navigation
- `/owner/messages` shows all booking conversations with unread counts and latest message preview
- Selecting a conversation opens the inline chat panel

## Frontend Services

- **messageService.ts** — API client with `getConversation`, `sendMessage`, `getUnreadCounts`, `getOwnerConversations`

## Frontend Types

- **Message** — `{ id, bookingId, senderId, senderName, content, isRead, createdAt }`
- **ConversationSummary** — `{ bookingId, lotName, guestName, checkInDate, checkOutDate, lastMessageContent, lastMessageSenderName, lastMessageAt, unreadCount }`

## Not Yet Built
- Email delivery for new message notifications
- Push notifications for new messages
- System announcements and platform notifications
- Check-in/check-out reminder messages
- File/image attachments in messages

## Existing Infrastructure
- Kafka topics publish domain events (BookingCreated, OfferClaimed, etc.)
- `NotificationEventListener` consumes events and stores notifications (see [notification module](../notification/README.md))
- SES integration planned for email delivery

See [NOTES.md](./NOTES.md) for domain model details.
