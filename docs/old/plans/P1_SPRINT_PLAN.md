# P1 Sprint Plan — Post-Launch Sprint 1

> Created: 2026-02-12
> Status: Draft — awaiting review

## Overview

Five features prioritised as P1 in the [Roadmap](../ROADMAP.md). These are the highest-value items to ship immediately after launch.

| # | Feature | Effort | Dependencies |
|---|---------|--------|-------------|
| 1 | Email delivery | M | None — unblocks #2 |
| 2 | Post-stay review request emails | S | #1 |
| 3 | Minimum stay rules | M | None |
| 4 | Persisted saved/favorites | M | None |
| 5 | In-app messaging | L | None (but benefits from #1 for email notifications) |

**Effort key**: S = 1-2 days, M = 3-5 days, L = 1-2 weeks

Recommended order: **1 → 2 → 3 → 4 → 5** (email delivery unblocks review emails and messaging notifications).

---

## Feature 1: Email Delivery

### Problem

The backend has a full `EmailService` with 12 Thymeleaf templates and async sending. In dev, emails go to MailHog (localhost:1025). But there is **no production email provider configured**. The SMTP settings default to `localhost:1025` with no auth. In production, emails will silently fail.

### Current State

- `EmailService.java` — async methods for all email types (welcome, booking confirmations, pre-arrival, vouchers, password reset, etc.)
- `JavaMailEmailSender.java` — wraps Spring `JavaMailSender`
- `ThymeleafEmailTemplateRenderer.java` — renders HTML templates
- 12 templates in `src/main/resources/templates/*.html`
- `application.yml` SMTP config:
  ```yaml
  spring.mail.host: ${MAIL_HOST:localhost}
  spring.mail.port: ${MAIL_PORT:1025}
  spring.mail.username: ${MAIL_USERNAME:}
  spring.mail.password: ${MAIL_PASSWORD:}
  ```
- From address: `${EMAIL_FROM:noreply@myisland.ie}`

### Implementation Plan

**No code changes needed.** This is a configuration and infrastructure task.

#### Step 1: Choose email provider

| Provider | Pricing | Notes |
|----------|---------|-------|
| **Amazon SES** | $0.10/1000 emails | Best value at scale, requires domain verification, good deliverability |
| **Resend** | Free up to 3000/month, then $20/month | Modern API, good DX, built by Vercel team |
| **Postmark** | $15/month for 10,000 | Best deliverability, transactional focus |

**Recommendation**: Amazon SES for cost efficiency. The app already uses AWS-compatible infra (S3/LocalStack for images). If DX and speed-to-production matter more, Resend is simpler to set up.

All three work with standard SMTP, so zero code changes — just set environment variables.

#### Step 2: Domain setup

1. Verify `myisland.ie` domain with the chosen provider
2. Add DNS records: SPF, DKIM, DMARC
3. Set bounce/complaint handling (SES requires this)

#### Step 3: Production environment variables

```bash
MAIL_HOST=email-smtp.eu-west-1.amazonaws.com   # or smtp.resend.com
MAIL_PORT=587
MAIL_USERNAME=<smtp-username>
MAIL_PASSWORD=<smtp-password>
MAIL_SMTP_AUTH=true
MAIL_STARTTLS_ENABLE=true
EMAIL_FROM=noreply@myisland.ie
```

#### Step 4: Test

- Send a test booking confirmation to a real inbox
- Verify pre-arrival scheduler sends correctly
- Check spam score (mail-tester.com)

### Files Changed

None — environment configuration only.

### Acceptance Criteria

- [ ] Transactional emails arrive in real inboxes (not spam)
- [ ] SPF/DKIM/DMARC records pass authentication checks
- [ ] Dev environment still uses MailHog (no regression)
- [ ] Bounce handling configured (prevent provider suspension)

---

## Feature 2: Post-Stay Review Request Emails

### Problem

After a guest checks out, there's no prompt to leave a review. Reviews drive trust and bookings. Currently guests only discover review functionality if they navigate to the campsite page and find the review form.

### Current State

- `BookingAutoCompleteScheduler` runs daily at 2 AM, marking `CHECKED_IN` bookings past their checkout date as `COMPLETED`
- `CHECKED_OUT` event creates an in-app notification: "Thanks for staying at {lotName}!" linking to `/trips`
- `ReviewService.checkEligibility()` returns eligible bookings (status `COMPLETED` or `CHECKED_IN`, no existing review)
- 12 email templates exist, but no post-stay review template
- `EmailService` has async methods for all current email types

### Implementation Plan

#### Backend

**New file**: `PostStayReviewEmailScheduler.java` in `modules/booking/service/`

```
@Scheduled(cron = "0 0 10 * * *")  // Daily at 10 AM (after auto-complete at 2 AM)
@SchedulerLock(name = "postStayReviewEmail", lockAtLeastFor = "PT5M", lockAtMostFor = "PT30M")
```

Logic:
1. Find all bookings where:
   - `status = COMPLETED`
   - `checkOutDate` was exactly 1 day ago (give guest time to settle)
   - No review exists for this booking (join check against `reviews` table)
   - No review email already sent (new field: `reviewEmailSentAt IS NULL`)
2. For each eligible booking:
   - Call `emailService.sendPostStayReviewRequest(booking)`
   - Set `booking.reviewEmailSentAt = Instant.now()`

**New field on Booking entity**: `reviewEmailSentAt` (Instant, nullable) — prevents duplicate emails.

**New migration**: `V1055__add_review_email_sent_at.sql`
```sql
ALTER TABLE bookings ADD COLUMN review_email_sent_at TIMESTAMP;
```

**New method**: `EmailService.sendPostStayReviewRequest(Booking booking)`
- Template data: guest name, property name, lot name, check-in/check-out dates, review link
- Review link: `${frontendUrl}/campsite/${ownerId}#reviews` (scrolls to reviews section where the "Write a Review" button already exists)

**New template**: `templates/post-stay-review.html`
- Thank guest for their stay
- Show booking summary (property, dates, lot)
- CTA button: "Share Your Experience"
- Keep it short — one clear call-to-action

#### Frontend

No frontend changes needed. The existing review flow (campsite page → reviews section → write review) works. The email just links there.

### Files to Create

| File | Description |
|------|-------------|
| `modules/booking/service/PostStayReviewEmailScheduler.java` | Daily scheduler |
| `src/main/resources/templates/post-stay-review.html` | Email template |
| `src/main/resources/db/migration/V1055__add_review_email_sent_at.sql` | Migration |

### Files to Modify

| File | Change |
|------|--------|
| `modules/booking/entity/Booking.java` | Add `reviewEmailSentAt` field |
| `modules/booking/repository/BookingRepository.java` | Add query for eligible bookings |
| `shared/email/EmailService.java` | Add `sendPostStayReviewRequest()` method |

### Acceptance Criteria

- [ ] Guests receive a review request email 1 day after checkout
- [ ] Email is only sent once per booking (tracked by `reviewEmailSentAt`)
- [ ] Bookings that already have a review are excluded
- [ ] Email links to campsite page reviews section
- [ ] Email renders correctly on mobile (inline CSS, standard template)
- [ ] ShedLock prevents duplicate execution in multi-instance deployment
- [ ] Dev: email visible in MailHog at localhost:8025

---

## Feature 3: Minimum Stay Rules

### Problem

Owners can't enforce minimum stay durations. A glamping pod costing €150/night is unprofitable for a 1-night booking due to cleaning/setup overhead. Owners need to set minimum nights per lot type, optionally varying by season.

### Current State

- `Lot` entity has no `minStay` field
- `SeasonalPricingRule` entity exists with `lotType`, `startDate`, `endDate`, `pricePerNight` — but no min stay
- `BookingService` validates only that check-out > check-in
- `AvailabilityCalendar` has no min stay hints
- `BookingModal` has no min stay validation
- `PricingService.calculateTotalPrice()` iterates per-night with seasonal rule lookup

### Design Decision: Where to store min stay?

**Option A**: Field on `Lot` entity (`minStay` integer, default 1)
- Simple, per-lot control
- Doesn't vary by season

**Option B**: Field on `SeasonalPricingRule` (add `minStay` to existing rule)
- Varies by season (2-night min in summer, 1-night in winter)
- Reuses existing rule infrastructure
- More complex for owners to configure

**Option C**: Separate `MinimumStayRule` entity
- Maximum flexibility but probably over-engineered for now

**Recommendation**: **Option A + B combined**. Add a `minStay` default on the `Lot` entity (simple case), and add an optional `minStay` override on `SeasonalPricingRule` (seasonal case). The seasonal rule takes precedence when it applies.

### Implementation Plan

#### Backend

**Migration**: `V1056__add_minimum_stay.sql`
```sql
ALTER TABLE lots ADD COLUMN min_stay INTEGER NOT NULL DEFAULT 1;
ALTER TABLE seasonal_pricing_rules ADD COLUMN min_stay INTEGER;
```

**Lot.java**: Add `minStay` field (int, default 1, min 1).

**SeasonalPricingRule.java**: Add `minStay` field (Integer, nullable — null means "use lot default").

**PricingService.java**: New method `getMinimumStay(Lot lot, LocalDate checkIn)`:
1. Find seasonal rules applicable to `checkIn` date
2. If rule has `minStay` set → return rule's `minStay`
3. Otherwise → return `lot.getMinStay()`

**BookingService.java**: Add validation in `createBooking()`:
```java
int minStay = pricingService.getMinimumStay(lot, request.checkInDate());
long nights = ChronoUnit.DAYS.between(request.checkInDate(), request.checkOutDate());
if (nights < minStay) {
    throw new IllegalArgumentException("Minimum stay is " + minStay + " nights");
}
```

Also add same check in `modifyBooking()` (owner) and guest modification flow.

**CampsiteController.java**: Return `minStay` in lot response so frontend can display it.

**OwnerController.java**: Accept `minStay` in lot create/update DTOs.

#### Frontend

**BookingModal.tsx**:
- After lot type selection, fetch min stay for the selected type
- Display hint: "Minimum stay: X nights"
- Disable "Continue to Payment" if selected nights < min stay
- Show validation message: "This accommodation requires a minimum X-night stay"

**AvailabilityCalendar.tsx**:
- Accept new prop: `minStay?: number`
- After check-in is selected, visually indicate the minimum range
- When user clicks a check-out date that's too early, show tooltip or shake animation
- Highlight minimum stay range in a lighter shade

**LotFormModal.tsx** (owner):
- Add "Minimum Stay (nights)" number input field
- Default: 1, min: 1, max: 30

**PricingRuleModal.tsx** (owner):
- Add optional "Minimum Stay Override" number input
- Label: "Override minimum stay during this period (leave blank to use lot default)"

**Campsite detail page**: Show "Min X nights" badge on lot type cards when > 1.

### Files to Create

| File | Description |
|------|-------------|
| `db/migration/V1056__add_minimum_stay.sql` | Add min_stay columns |

### Files to Modify

| File | Change |
|------|--------|
| `Lot.java` | Add `minStay` field |
| `SeasonalPricingRule.java` | Add `minStay` field |
| `PricingService.java` | Add `getMinimumStay()` method |
| `BookingService.java` | Validate min stay on create + modify |
| `CampsiteController.java` | Return `minStay` in lot responses |
| `OwnerController.java` | Accept `minStay` in lot DTOs |
| `LotFormModal.tsx` | Add min stay input |
| `PricingRuleModal.tsx` | Add min stay override input |
| `BookingModal.tsx` | Display min stay hint, validate selection |
| `AvailabilityCalendar.tsx` | Accept `minStay` prop, visual hints |
| `CampsiteDetailsPage.tsx` | Show min stay badge on lot cards |
| `booking.ts` (types) | Add `minStay` to Lot and SeasonalPricingRule types |

### Acceptance Criteria

- [ ] Owner can set minimum stay per lot (default 1)
- [ ] Owner can override minimum stay per seasonal pricing rule
- [ ] Guest sees "Minimum X nights" on the campsite detail page when > 1
- [ ] Guest sees minimum stay hint in booking modal calendar
- [ ] Booking creation fails with clear error if nights < min stay
- [ ] Booking modification (owner + guest) respects min stay
- [ ] Existing bookings with 1-night stays are unaffected (no retroactive enforcement)
- [ ] TypeScript build passes with no unused vars

---

## Feature 4: Persisted Saved/Favorites

### Problem

Saved lots are stored in `localStorage` via `SavedContext`. This means:
- Favorites are lost when switching devices or clearing browser data
- Favorites are not linked to a user account
- Anonymous users can save, but data is orphaned on sign-up

### Current State

- `SavedContext.tsx` — React Context storing lot IDs in `localStorage` under key `myisland_saved_lots`
- `SavedPage.tsx` — renders saved lots in a grid with heart toggle
- `campsiteService.getLotById(id)` — fetches full lot data per saved ID
- Heart icon toggle used on campsite detail pages and saved page
- No backend entity, endpoint, or persistence

### Implementation Plan

#### Backend

**New entity**: `SavedLot.java` in `modules/accommodation/entity/`

```java
@Entity
@Table(name = "saved_lots",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "lot_id"}))
public class SavedLot extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    private Lot lot;
}
```

**New repository**: `SavedLotRepository.java`
- `findByUserIdOrderByCreatedAtDesc(Long userId)` → List<SavedLot>
- `findByUserIdAndLotId(Long userId, Long lotId)` → Optional<SavedLot>
- `existsByUserIdAndLotId(Long userId, Long lotId)` → boolean
- `deleteByUserIdAndLotId(Long userId, Long lotId)`
- `countByUserId(Long userId)` → long

**New controller**: `SavedLotController.java` at `/api/saved`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/saved` | Get all saved lot IDs for current user |
| POST | `/api/saved/{lotId}` | Save a lot |
| DELETE | `/api/saved/{lotId}` | Unsave a lot |
| GET | `/api/saved/check/{lotId}` | Check if a lot is saved (returns boolean) |

**New migration**: `V1057__create_saved_lots.sql`
```sql
CREATE TABLE saved_lots (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    lot_id BIGINT NOT NULL REFERENCES lots(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, lot_id)
);
CREATE INDEX idx_saved_lots_user ON saved_lots(user_id);
```

#### Frontend

**New service**: `savedService.ts`
- `getSavedLotIds(): Promise<string[]>`
- `saveLot(lotId: string): Promise<void>`
- `unsaveLot(lotId: string): Promise<void>`
- `isLotSaved(lotId: string): Promise<boolean>`

**Refactor `SavedContext.tsx`**:
- If user is authenticated → use API (savedService)
- If user is anonymous → fall back to localStorage (current behavior)
- On login: merge localStorage favorites into backend, then clear localStorage
- On logout: clear in-memory state (don't touch localStorage for anonymous browsing)

Migration logic on login:
```typescript
const migrateLocalFavorites = async () => {
    const localIds = JSON.parse(localStorage.getItem('myisland_saved_lots') || '[]');
    if (localIds.length > 0) {
        await Promise.all(localIds.map(id => savedService.saveLot(id)));
        localStorage.removeItem('myisland_saved_lots');
    }
};
```

**SavedPage.tsx**: No visual changes needed — it already renders from `SavedContext`.

**Other components**: Heart toggle components already call `toggleSaved(lotId)` from context — no changes needed.

### Files to Create

| File | Description |
|------|-------------|
| `modules/accommodation/entity/SavedLot.java` | Entity |
| `modules/accommodation/repository/SavedLotRepository.java` | Repository |
| `modules/accommodation/controller/SavedLotController.java` | REST controller |
| `db/migration/V1057__create_saved_lots.sql` | Migration |
| `src/services/savedService.ts` | Frontend API service |

### Files to Modify

| File | Change |
|------|--------|
| `SavedContext.tsx` | Dual-mode: API for auth users, localStorage for anonymous |
| `SecurityConfig.java` | Allow authenticated access to `/api/saved/**` |

### Acceptance Criteria

- [ ] Authenticated users' favorites are persisted in the database
- [ ] Favorites sync across devices when logged in
- [ ] Anonymous users can still save via localStorage (no regression)
- [ ] On login, localStorage favorites merge into the user's backend favorites
- [ ] Duplicate saves are idempotent (saving twice doesn't error)
- [ ] Deleting a lot cascades to remove saved_lot records
- [ ] SavedPage works identically for both modes
- [ ] No visual changes to existing UI

---

## Feature 5: In-App Messaging

### Problem

Owners and guests have no way to communicate within the platform. Guests use "special requests" at booking time, but after that there's no channel. Owners resort to personal email or phone, which is fragmented and not tracked.

### Current State

- No messaging entities, controllers, or UI exist
- `Communication` module is documented as "Planned" with no code
- Notification system exists (11 event types, polling-based at 30s intervals)
- Kafka event bus operational
- `Booking.specialRequests` field exists as a one-time text note
- No WebSocket/SSE/real-time infrastructure

### Design Decisions

**Architecture: Polling-based (not WebSocket)**

Rationale:
- Consistent with existing notification infrastructure (30s polling)
- No new dependencies or infrastructure
- Camping messages are not time-critical like chat apps — minutes of delay is acceptable
- WebSocket adds connection management complexity, reconnection logic, load balancer config
- Can upgrade to WebSocket later if usage patterns demand it

**Conversation model: Per-booking threads**

Each booking has one conversation thread. Messages are flat (no nested replies). This keeps the model simple and maps naturally to the guest-owner relationship.

**Participants**: Guest + Owner (and owner's staff). Not multi-party. If an owner has staff, all staff with access to the booking can read and send messages.

### Implementation Plan

#### Backend

**New module**: `modules/communication/`

**Entity**: `Message.java`

| Field | Type | Description |
|-------|------|-------------|
| id | Long | Primary key |
| booking | ManyToOne → Booking | Conversation anchor |
| sender | ManyToOne → User | Who sent it |
| content | String (TEXT) | Message body |
| isRead | boolean | Read by recipient (default false) |
| createdAt | Timestamp | Sent time |

**Repository**: `MessageRepository.java`
- `findByBookingIdOrderByCreatedAtAsc(Long bookingId)` — conversation history
- `countByBookingIdAndSenderIdNotAndIsReadFalse(Long bookingId, Long userId)` — unread count for a user in a conversation
- `findByBookingIdAndSenderIdNotAndIsReadFalse(Long bookingId, Long userId)` — unread messages to mark as read

**Service**: `MessageService.java`

Key methods:
- `sendMessage(Long bookingId, Long senderUserId, String content)` → Message
  - Validate sender is guest or owner/staff for this booking
  - Create message
  - Publish `MessageEvent` (for notifications + Kafka)
- `getConversation(Long bookingId, Long userId)` → List<Message>
  - Validate user is participant
  - Return messages ordered by createdAt
  - Mark received messages as read
- `getUnreadCounts(Long userId)` → Map<Long, Integer> (bookingId → unread count)
  - For notification badges

**Controller**: `MessageController.java` at `/api/messages`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/booking/{bookingId}` | Get conversation (marks received as read) |
| POST | `/api/messages/booking/{bookingId}` | Send message |
| GET | `/api/messages/unread` | Get unread counts per booking |

**Event**: `MessageEvent.java`
- Triggers in-app notification to recipient: "New message from {senderName} about your booking at {propertyName}"
- Triggers email notification (if Feature #1 is done): brief message preview + link to conversation
- Publishes to Kafka topic `message.sent`

**New email template**: `templates/new-message.html`
- "You have a new message about your booking at {propertyName}"
- Shows first 200 chars of message content
- CTA: "View Conversation" → links to conversation page
- Only send if recipient hasn't read the message within 5 minutes (optional, could be a separate scheduled job to avoid spamming)

**Migration**: `V1058__create_messages.sql`
```sql
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL REFERENCES bookings(id),
    sender_id BIGINT NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_messages_booking ON messages(booking_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_unread ON messages(booking_id, is_read) WHERE is_read = FALSE;
```

#### Frontend

**New service**: `messageService.ts`
- `getConversation(bookingId: string): Promise<Message[]>`
- `sendMessage(bookingId: string, content: string): Promise<Message>`
- `getUnreadCounts(): Promise<Record<string, number>>`

**New type**: Add to `types/booking.ts` or new `types/message.ts`
```typescript
export interface Message {
    id: string;
    bookingId: string;
    senderId: string;
    senderName: string;
    content: string;
    isRead: boolean;
    createdAt: string;
}
```

**New component**: `BookingConversation.tsx`
- Chat-style UI (messages list + input box at bottom)
- Guest messages right-aligned (blue), owner messages left-aligned (gray)
- Auto-scroll to latest message
- Send on Enter (Shift+Enter for newline)
- Timestamp grouping (Today, Yesterday, dates)
- Empty state: "Start a conversation about your booking"

**Integration into TripsPage.tsx** (guest side):
- Add "Message Owner" button on booking detail modal
- Shows unread badge count per booking
- Opens `BookingConversation` component (either inline in modal or as a new page)

**New page**: `BookingMessagesPage.tsx` at route `/trips/{bookingId}/messages`
- Full-page conversation view
- Header: property name, booking dates
- Back button → `/trips`

**Integration into Owner Portal** (owner side):
- Add "Messages" item to owner sidebar nav
- New page: `OwnerMessagesPage.tsx` at `/owner/messages`
  - List of active conversations with unread badges
  - Click → opens conversation inline or at `/owner/messages/{bookingId}`
- Add unread message badge to booking rows in `OwnerBookingsPage`

**Header notification**: Existing notification bell already handles new notification types — `MessageEvent` creates a notification that appears there automatically.

**Polling**: Reuse existing 30-second notification polling cycle. Add unread message counts to the header badge or as a separate indicator.

### Files to Create

| File | Description |
|------|-------------|
| `modules/communication/entity/Message.java` | Entity |
| `modules/communication/repository/MessageRepository.java` | Repository |
| `modules/communication/service/MessageService.java` | Service |
| `modules/communication/controller/MessageController.java` | Controller |
| `shared/events/MessageEvent.java` | Event |
| `templates/new-message.html` | Email template |
| `db/migration/V1058__create_messages.sql` | Migration |
| `src/services/messageService.ts` | Frontend service |
| `src/types/message.ts` | Types |
| `src/components/booking/BookingConversation.tsx` | Chat UI component |
| `src/pages/BookingMessagesPage.tsx` | Guest messages page |
| `src/pages/owner/OwnerMessagesPage.tsx` | Owner messages page |

### Files to Modify

| File | Change |
|------|--------|
| `SecurityConfig.java` | Allow `/api/messages/**` for authenticated users |
| `NotificationEventListener.java` | Handle `MessageEvent` → create notification |
| `EventPublisher.java` | Publish `MessageEvent` to Kafka |
| `App.tsx` | Add routes for message pages |
| `TripsPage.tsx` | Add "Message Owner" button, unread badge |
| `OwnerLayout.tsx` | Add "Messages" to sidebar nav |
| `OwnerBookingsPage.tsx` | Add unread badge to booking rows |
| `Header.tsx` | Optional: separate message count indicator |
| `ownerService.ts` or `notificationService.ts` | Unread message count polling |

### Acceptance Criteria

- [ ] Guest can send a message to the property owner from the Trips page
- [ ] Owner can view and reply to messages from the owner portal
- [ ] Owner staff with booking access can read and send messages
- [ ] Messages are persisted and visible across sessions/devices
- [ ] Unread message count appears on booking cards (both guest and owner side)
- [ ] In-app notification is created when a new message is received
- [ ] Email notification is sent for new messages (if email delivery is configured)
- [ ] Conversation is anchored to a specific booking
- [ ] Messages are ordered chronologically
- [ ] Opening a conversation marks received messages as read
- [ ] Guest cannot message on cancelled/completed bookings older than 30 days (optional scope limit)
- [ ] TypeScript build passes
- [ ] E2E test covers sending and receiving a message

---

## Migration Summary

| Migration | Feature | Description |
|-----------|---------|-------------|
| V1055 | Review emails | Add `review_email_sent_at` to bookings |
| V1056 | Minimum stay | Add `min_stay` to lots and seasonal_pricing_rules |
| V1057 | Favorites | Create `saved_lots` table |
| V1058 | Messaging | Create `messages` table |

---

## E2E Test Coverage

Each feature should add at least one Playwright test:

| Feature | Test |
|---------|------|
| Review emails | Verify scheduler doesn't crash (unit test more appropriate) |
| Minimum stay | Owner sets min stay → guest sees hint → booking blocked if < min |
| Favorites | Guest saves a lot → logs out → logs in → lot still saved |
| Messaging | Guest sends message → owner sees it → owner replies → guest sees reply |

---

## Documentation Updates

After implementation, update:
- `docs/domain/booking/README.md` — review emails, min stay rules
- `docs/domain/accommodation/README.md` — min stay on lots, saved lots
- `docs/domain/communication/README.md` — change status from "Planned" to "Implemented"
- `docs/domain/DOMAIN_MODEL.md` — add Message entity, SavedLot entity, min stay fields
- `docs/ROADMAP.md` — move features from P1 to "What's Built"
- `CLAUDE.md` — add new endpoints, update patterns
