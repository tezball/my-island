# Communication

## Status
Implemented — In-app messaging between guests and owners/staff is live with booking status validation, staff name resolution, and polling-based real-time updates. Email delivery and system announcements are not yet built.

## Overview
Provides per-booking message threads between guests and property owners/staff. Messages are tied to a booking and accessible from both the guest Trips view and the owner Messages dashboard. Messaging is restricted to bookings with CONFIRMED, CHECKED_IN, or COMPLETED status.

## Key Entities

- **Message** (extends BaseEntity) — A single message in a booking conversation. Links to a Booking and a sender (User). Supports read/unread tracking.

### Message

| Field | Type | Description |
|-------|------|-------------|
| id | Long | Unique identifier |
| booking | Booking (FK) | The booking this conversation belongs to |
| sender | User (FK) | User who sent the message |
| content | String (max 5000) | Message body |
| isRead | Boolean | Whether the recipient has read the message (default false) |
| createdAt | Timestamp | When the message was sent |
| updatedAt | Timestamp | Last update |

**Database indexes**: `booking_id`, `sender_id`, partial index on `(booking_id, is_read) WHERE is_read = FALSE`.

Migration: `V1058__create_messages.sql`

## Business Rules

- **Messageable statuses**: Only bookings with status CONFIRMED, CHECKED_IN, or COMPLETED allow messaging. Sending a message on PENDING, CANCELLED, or NO_SHOW bookings returns 400.
- **Staff sender name**: When an owner staff member sends a message, the `senderName` is resolved to the property name (e.g. "Nore Valley Park") instead of the staff member's personal name. Owner and guest names display normally.
- **Content validation**: Messages must be 1-5000 characters. Empty/whitespace-only messages are rejected.
- **Access control**: Only the guest who made the booking, the property owner, or the owner's staff members can access a booking's conversation.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/messages/booking/{bookingId}` | Get conversation messages for a booking (marks received messages as read) |
| POST | `/api/messages/booking/{bookingId}` | Send a message in a booking conversation (validates booking status) |
| GET | `/api/messages/unread` | Get unread message counts per booking for the current user |
| GET | `/api/messages/owner/conversations` | Get all conversations for the owner/staff with latest message summary |

### Response DTOs

**MessageDto**: id, bookingId, senderId, senderName, content, isRead, createdAt

**ConversationSummaryDto**: bookingId, lotName, guestName, checkInDate, checkOutDate, lastMessageContent, lastMessageSenderName, lastMessageAt, unreadCount

## Frontend Pages

- **BookingMessagesPage** (`/trips/{bookingId}/messages`) — Guest-side full-page chat view for a booking conversation. Uses `100dvh` for proper mobile viewport.
- **OwnerMessagesPage** (`/owner/messages`) — Owner/staff conversation list with inline chat panel. Polls every 15s for new conversations (pauses when tab is hidden). Refreshes on back navigation.
- **BookingConversation** — Reusable chat UI component with:
  - 15-second polling (pauses when tab is hidden via `document.visibilityState`)
  - Auto-scroll to newest message
  - Enter-to-send, Shift+Enter for new line
  - 5000 character limit with counter shown at 90%+ usage
  - Disabled input during send
  - Accessible: `aria-label` on textarea and send button

### Guest Access
- "Message Owner" link appears on the Trips page for bookings with CONFIRMED or CHECKED_IN status
- Navigates to `/trips/{bookingId}/messages`

### Owner/Staff Access
- "Messages" link in the owner sidebar navigation
- `/owner/messages` shows all booking conversations with unread counts and latest message preview
- Selecting a conversation opens the inline chat panel
- Staff members see all conversations for the properties they belong to

## Frontend Services

- **messageService.ts** — API client with `getConversation`, `sendMessage`, `getUnreadCounts`, `getOwnerConversations`

## Frontend Types

- **Message** — `{ id, bookingId, senderId, senderName, content, isRead, createdAt }`
- **ConversationSummary** — `{ bookingId, lotName, guestName, checkInDate, checkOutDate, lastMessageContent, lastMessageSenderName, lastMessageAt, unreadCount }`

## E2E Tests

`e2e/messaging.spec.ts` covers:
- US-COMM-1: Guest sends messages about a booking (4 tests)
- US-COMM-2: Owner views and replies to guest messages (3 tests)
- US-COMM-3: Messages persist cross-user and are tied to a booking (1 test)
- US-COMM-4: Booking status restrictions enforced via API (1 consolidated test)
- US-COMM-5: Staff login, messages page access, sender name = property name, conversations endpoint (2 tests)

## Not Yet Built
- Email delivery for new message notifications
- Push notifications for new messages
- System announcements and platform notifications
- Check-in/check-out reminder messages
- File/image attachments in messages

## Existing Infrastructure
- Spring ApplicationEvents with @Async publish domain events (BookingCreated, OfferClaimed, etc.)
- `NotificationEventListener` consumes events and stores notifications (see [notification module](../notification/README.md))
- SES integration planned for email delivery

See [NOTES.md](./NOTES.md) for domain model details.
