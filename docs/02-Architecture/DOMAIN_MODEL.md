---
title: Domain Model
type: architecture
status: active
created: 2026-01-03
tags:
  - architecture
  - ddd
  - domain
  - entities
---

# Domain-Driven Design Model

This document defines the domain objects, states, bounded contexts, and ubiquitous language for the my-island camping/glamping booking platform.

---

## Ubiquitous Language

### Core Terms

| Term | Definition |
|------|------------|
| **Campsite** | A property offering outdoor accommodation (camping, glamping, cabins). Owned by exactly one Owner. |
| **Lot** | A bookable unit within a Campsite (e.g., tent pitch, cabin, glamping pod). Has a type and capacity. |
| **Guest** | A user who browses and books accommodations. |
| **Owner** | A user who owns and manages one or more Campsites. |
| **Supplier** | A business partner offering local deals and experiences to Guests. |
| **Booking** | A reservation for a specific Lot over a date range. |
| **Extra** | An add-on service or product available with a Booking (e.g., firewood, bike rental). |
| **Facility** | An amenity available at a Campsite (e.g., WiFi, showers, playground). |
| **Check-In Instructions** | Arrival information provided to Guests before their stay. |
| **Offer** | A promotional deal from a Supplier for Guests. |
| **Review** | Guest feedback submitted after completing a Booking. |

### User Roles

| Role | Description |
|------|-------------|
| **Anonymous User** | Can browse campsites and search. Cannot book or save favorites. |
| **Guest** | Registered user. Can book, save favorites, receive notifications, and write reviews. |
| **Owner** | Registered user with `isOwner=true`. Manages campsites, lots, bookings, and responds to reviews. |
| **Supplier** | Registered user with `isSupplier=true`. Creates and manages promotional offers. |

---

## Bounded Contexts

### 1. Accommodation Context
**Purpose**: Manage campsite inventory, lots, and availability.

**Aggregates**: Campsite, Lot, Extra, LotAvailability, CheckInInstructions

**Key Operations**:
- Create/update campsite details
- Manage lot inventory and pricing
- Set availability calendar
- Configure check-in instructions

### 2. Booking Context
**Purpose**: Handle the reservation lifecycle from search to completion.

**Aggregates**: Booking, BookingExtra

**Key Operations**:
- Create booking
- Add extras to booking
- Process payment
- Check-in guest
- Cancel booking
- Complete stay

### 3. Identity Context
**Purpose**: User authentication, profiles, and preferences.

**Aggregates**: User, LinkedAccount, NotificationPreferences

**Key Operations**:
- Register/login
- Link social accounts
- Update profile
- Manage notification settings
- Delete account

### 4. Review Context
**Purpose**: Guest feedback and ratings system.

**Aggregates**: Review

**Key Operations**:
- Submit review (post-checkout only)
- Rate by category
- Owner response
- Mark as helpful

### 5. Communication Context
**Purpose**: Messaging between guests and hosts.

**Aggregates**: Message, Notification

**Key Operations**:
- Send/receive messages
- System notifications
- Booking reminders

### 6. Support Context
**Purpose**: Customer service and issue resolution.

**Aggregates**: SupportTicket, TicketMessage

**Key Operations**:
- Create ticket
- Staff response
- Resolve/close ticket

### 7. Marketplace Context
**Purpose**: Partner offers and local experiences.

**Aggregates**: Supplier, Offer

**Key Operations**:
- Create supplier profile
- Publish offers
- Claim/redeem offers

---

## Aggregates & Entities

### Campsite Aggregate

```
Campsite (Root)
├── Location (Value Object)
├── Lot[] (Entity)
│   └── LotType (Enum)
├── Extra[] (Entity)
├── Facility[] (Enum)
├── CheckInInstructions (Entity)
└── Review[] (Entity, weak reference)
```

**Campsite**
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| name | String | Display name |
| description | String | Long description |
| location | Location | Address and coordinates |
| images | String[] | Photo URLs |
| rating | Decimal | Average review score (1.00-5.00) |
| reviewCount | Integer | Total number of reviews |
| pricePerNight | Decimal | Starting price (for display) |
| facilities | Facility[] | Available amenities |
| ownerId | UUID | Reference to User |
| featured | Boolean | Promoted on homepage |
| active | Boolean | Published/visible |

**Lot**
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| campsiteId | UUID | Parent campsite |
| name | String | Lot name (e.g., "Pitch A1") |
| type | LotType | Accommodation type |
| capacity | Integer | Maximum guests |
| pricePerNight | Decimal | Base price |
| images | String[] | Photo URLs |
| amenities | String[] | Lot-specific amenities |
| available | Boolean | Currently bookable |

**Extra**
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| campsiteId | UUID | Parent campsite (optional for global extras) |
| name | String | Extra name |
| description | String | Details |
| price | Decimal | Cost |
| perNight | Boolean | Charged per night vs. per stay |
| available | Boolean | Currently offered |

---

### Booking Aggregate

```
Booking (Root)
├── BookingExtra[] (Entity)
├── Message[] (Entity, cross-aggregate reference)
└── Payment (Value Object, implicit)
```

**Booking**
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| userId | UUID | Guest who booked |
| lotId | UUID | Reserved lot |
| checkIn | Date | Arrival date |
| checkOut | Date | Departure date |
| guests | Integer | Number of guests |
| status | BookingStatus | Current state |
| lotPrice | Decimal | Accommodation cost |
| extrasPrice | Decimal | Sum of extras |
| serviceFee | Decimal | Platform fee |
| totalPrice | Decimal | Final amount |
| specialRequests | String | Guest notes |
| cancellationReason | String | If cancelled |
| createdAt | Timestamp | Booking creation time |

**BookingExtra**
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| bookingId | UUID | Parent booking |
| extraId | UUID | Reference to Extra |
| quantity | Integer | Amount ordered |
| unitPrice | Decimal | Price at time of booking |
| totalPrice | Decimal | quantity × unitPrice |

---

### User Aggregate

```
User (Root)
├── NotificationPreferences (Value Object)
├── LinkedAccount[] (Entity)
├── Supplier (Entity, optional)
└── Favorite[] (Entity)
```

**User**
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| email | String | Login email (unique) |
| passwordHash | String | Encrypted password |
| name | String | Display name |
| avatar | String | Profile image URL |
| phone | String | Contact number |
| bio | String | About me |
| isOwner | Boolean | Has campsite management access |
| isSupplier | Boolean | Has supplier dashboard access |
| notificationPreferences | NotificationPreferences | Embedded settings |
| createdAt | Timestamp | Account creation |

**LinkedAccount**
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| userId | UUID | Parent user |
| provider | SocialProvider | OAuth provider |
| email | String | External account email |
| connected | Boolean | Currently linked |

---

### Review Aggregate

```
Review (Root)
└── ReviewCategories (Value Object)
```

**Review**
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| userId | UUID | Author |
| campsiteId | UUID | Reviewed campsite |
| bookingId | UUID | Associated booking (one review per booking) |
| rating | Integer | Overall score (1-5) |
| comment | String | Review text |
| categories | ReviewCategories | Category scores |
| helpfulCount | Integer | Upvotes |
| ownerResponse | String | Host reply |
| createdAt | Timestamp | Submission time |

---

### Support Aggregate

```
SupportTicket (Root)
└── TicketMessage[] (Entity)
```

**SupportTicket**
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| userId | UUID | Ticket creator |
| subject | String | Issue title |
| description | String | Issue details |
| category | String | Issue type |
| status | TicketStatus | Current state |
| relatedBookingId | UUID | Optional booking reference |
| createdAt | Timestamp | Creation time |

---

## Value Objects

### Location
| Field | Type |
|-------|------|
| address | String |
| county | String |
| lat | Double |
| lng | Double |

### NotificationPreferences
| Field | Type | Default |
|-------|------|---------|
| email | Boolean | true |
| push | Boolean | true |
| sms | Boolean | false |
| marketing | Boolean | false |

### ReviewCategories
| Field | Type | Range |
|-------|------|-------|
| cleanliness | Integer | 1-5 |
| location | Integer | 1-5 |
| value | Integer | 1-5 |
| facilities | Integer | 1-5 |

---

## Enumerations

### BookingStatus (State Machine)

```
┌─────────┐    confirm    ┌───────────┐   check-in   ┌────────────┐  check-out  ┌───────────┐
│ PENDING │──────────────►│ CONFIRMED │─────────────►│ CHECKED_IN │────────────►│ COMPLETED │
└─────────┘               └───────────┘              └────────────┘             └───────────┘
     │                          │                          │
     │        cancel            │       cancel             │
     └──────────────────────────┴──────────────────────────┘
                                │
                                ▼
                          ┌───────────┐
                          │ CANCELLED │
                          └───────────┘
```

| Status | Description |
|--------|-------------|
| PENDING | Booking created, awaiting payment confirmation |
| CONFIRMED | Payment received, reservation secured |
| CHECKED_IN | Guest has arrived |
| COMPLETED | Stay finished, eligible for review |
| CANCELLED | Booking cancelled by guest or owner |

### TicketStatus

```
┌──────┐   assign   ┌─────────────┐   resolve   ┌──────────┐   close   ┌────────┐
│ OPEN │───────────►│ IN_PROGRESS │────────────►│ RESOLVED │─────────►│ CLOSED │
└──────┘            └─────────────┘             └──────────┘          └────────┘
```

| Status | Description |
|--------|-------------|
| OPEN | New ticket, awaiting staff attention |
| IN_PROGRESS | Staff investigating |
| RESOLVED | Issue addressed, awaiting confirmation |
| CLOSED | Ticket finalized |

### AvailabilityStatus

| Status | Description |
|--------|-------------|
| AVAILABLE | Lot can be booked for this date |
| BOOKED | Reserved by a confirmed booking |
| BLOCKED | Owner has blocked this date |
| MAINTENANCE | Unavailable for maintenance |

### LotType

| Type | Description |
|------|-------------|
| TENT | Tent pitch |
| CARAVAN | Caravan/trailer pitch |
| CAMPERVAN | Campervan/motorhome pitch |
| RV | Large RV pitch |
| GLAMPING | Premium tent (bell tent, safari tent) |
| CABIN | Wooden cabin |
| TREEHOUSE | Elevated accommodation |
| YURT | Traditional circular tent |
| POD | Camping pod |
| APARTMENT | Indoor unit |
| COTTAGE | Self-contained house |
| SAFARI_TENT | Luxury safari-style tent |

### Facility

| Facility | Description |
|----------|-------------|
| WIFI | Wireless internet |
| ELECTRIC | Electrical hookup |
| WATER | Water hookup |
| TOILET | Toilet facilities |
| SHOWER | Shower facilities |
| LAUNDRY | Washing machines/dryers |
| SHOP | On-site store |
| RESTAURANT | Dining facilities |
| PLAYGROUND | Children's play area |
| BEACH | Beach access |
| FISHING | Fishing access |
| HIKING | Hiking trails |
| CYCLING | Cycling paths |
| PETS | Pet-friendly |

### NotificationType

| Type | Description |
|------|-------------|
| BOOKING | Booking confirmations, updates, reminders |
| REVIEW | Review notifications, owner responses |
| OFFER | Promotional deals from suppliers |
| SYSTEM | Platform announcements |
| REMINDER | Check-in/check-out reminders |

### OfferCategory

| Category | Description |
|----------|-------------|
| FOOD | Restaurants, cafes, food vendors |
| ACTIVITIES | Tours, experiences, sports |
| GEAR | Equipment rental |
| ATTRACTIONS | Local attractions, museums |
| TRANSPORT | Car rental, bikes, shuttles |

### PaymentType

| Type | Description |
|------|-------------|
| CARD | Credit/debit card |
| APPLE_PAY | Apple Pay |
| GOOGLE_PAY | Google Pay |

### SocialProvider

| Provider | Description |
|----------|-------------|
| GOOGLE | Google OAuth |
| APPLE | Apple Sign-In |
| FACEBOOK | Facebook Login |

---

## Business Rules

### Booking Rules

1. **Date Validation**: `checkOut` must be after `checkIn`
2. **Guest Capacity**: `guests` cannot exceed `lot.capacity`
3. **Availability Check**: All dates in range must have `AvailabilityStatus.AVAILABLE`
4. **One Review Per Booking**: A booking can have at most one associated review
5. **Review Eligibility**: Reviews can only be submitted when `status = COMPLETED`
6. **Cancellation Window**: Defined by campsite policy (not enforced in domain)
7. **Price Locking**: Extra prices are captured at booking time (`unitPrice`)

### Campsite Rules

1. **Owner Relationship**: Every campsite must have exactly one owner
2. **Active Lots Required**: A campsite needs at least one active lot to be bookable
3. **Rating Calculation**: `rating = average(reviews[].rating)`, updated on new review

### User Rules

1. **Unique Email**: No two users can share the same email
2. **Role Independence**: A user can be both Owner and Supplier simultaneously
3. **Linked Account Constraint**: One linked account per provider per user

### Review Rules

1. **Rating Range**: Overall rating must be 1-5
2. **Category Ratings**: Each category (cleanliness, location, value, facilities) must be 1-5
3. **Immutable After Owner Response**: Reviews cannot be edited after owner responds

---

## Domain Events

| Event | Trigger | Consumers |
|-------|---------|-----------|
| `BookingCreated` | New booking submitted | Payment, Notification, Availability |
| `BookingConfirmed` | Payment successful | Notification, Calendar |
| `BookingCancelled` | Guest/owner cancels | Notification, Availability, Refund |
| `GuestCheckedIn` | Check-in recorded | Notification |
| `BookingCompleted` | Check-out recorded | Review eligibility, Notification |
| `ReviewSubmitted` | New review posted | Rating recalc, Owner notification |
| `MessageSent` | New message | Recipient notification |
| `TicketCreated` | Support ticket opened | Staff queue |
| `OfferClaimed` | Guest claims offer | Supplier notification |

---

## Entity Relationships

```
User (1) ──────────────────── (0..*) LinkedAccount
  │
  ├──── isOwner=true ──────── (0..*) Campsite
  │                                    │
  │                                    ├── (1..*) Lot ─────── (0..*) LotAvailability
  │                                    │                            │
  │                                    ├── (0..*) Extra             │
  │                                    │                            │
  │                                    └── (0..1) CheckInInstructions
  │
  ├──── (0..*) Booking ─────────────────────────────────────── (1) Lot
  │       │
  │       ├── (0..*) BookingExtra ── (1) Extra
  │       │
  │       ├── (0..*) Message
  │       │
  │       └── (0..1) Review
  │
  ├──── (0..*) Favorite ────── (1) Campsite
  │
  ├──── (0..*) Notification
  │
  ├──── (0..*) SupportTicket ── (0..*) TicketMessage
  │
  └──── isSupplier=true ───── (0..1) Supplier ── (0..*) Offer
```

---

## Aggregate Invariants

### Campsite Aggregate
- `rating` must equal the average of all associated review ratings
- `reviewCount` must equal the count of associated reviews
- `lots` cannot be empty for an active campsite

### Booking Aggregate
- `totalPrice = lotPrice + extrasPrice + serviceFee`
- `extrasPrice = sum(bookingExtras[].totalPrice)`
- Status transitions must follow the state machine

### User Aggregate
- At most one `LinkedAccount` per `SocialProvider`
- `NotificationPreferences` must never be null

### Review Aggregate
- `bookingId` must reference a booking with `status = COMPLETED`
- One review per booking (unique constraint)
