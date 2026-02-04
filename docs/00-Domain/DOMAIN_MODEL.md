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

| Term                      | Definition                                                                                                      |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Campsite**              | A site type. A property offering outdoor accommodation (camping, glamping, cabins). Owned by exactly one Owner. |
| **Lot**                   | A bookable unit within a Campsite (e.g., tent pitch, cabin, glamping pod). Has a type and capacity.             |
| **Guest**                 | A user who browses and books accommodations.                                                                    |
| **Owner**                 | A user who owns and manages one or more Campsites.                                                              |
| **Supplier**              | A business partner offering local deals and experiences to Guests.                                              |
| **Booking**               | A reservation for a specific Lot over a date range.                                                             |
| **Extra**                 | An add-on service or product available with a Booking (e.g., firewood, bike rental).                            |
| **Facility**              | An amenity available at a Campsite (e.g., WiFi, showers, playground).                                           |
| **Check-In Instructions** | Arrival information provided to Guests before their stay.                                                       |
| **Offer**                 | A promotional deal from a Supplier for Guests.                                                                  |
| **Review**                | Guest feedback submitted after completing a Booking.                                                            |

### Subscription Terms

| Term | Definition |
|------|-------------|
| **Subscription** | Monthly recurring payment required for Owners and Suppliers to access premium features. |
| **Featured Promotion** | One-time payment (7 days €9.99 or 30 days €29.99) to promote a property or business on the homepage/marketplace. |
| **Connect Account** | Stripe Connect Express account that enables Owners/Suppliers to receive payouts from bookings and offer redemptions. |
| **Payouts Enabled** | Status indicating a Connect account has completed onboarding and can receive payments. |

### User Roles

| Role | Description |
|------|-------------|
| **Anonymous User** | Can browse campsites and search. Cannot book or save favorites. |
| **Guest** | Registered user. Can book, save favorites, receive notifications, and write reviews. |
| **Owner** | Registered user with `isOwner=true`. Manages campsites, lots, bookings, and responds to reviews. Requires subscription to receive bookings and access analytics. Can set up Stripe Connect to receive booking payments. |
| **Supplier** | Registered user with `isSupplier=true`. Creates and manages promotional offers. Requires subscription to create offers. Can set up Stripe Connect to receive offer redemption payments. |

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

**Aggregates**: Supplier, Offer, OfferClaim

**Key Operations**:
- Create supplier profile
- Publish offers (requires active subscription)
- Browse marketplace (query available offers)
- View offer details
- Claim offers (Guest claims offer, receives voucher)
- Redeem claims (Supplier marks voucher as used)
- Purchase featured promotion

### 8. Subscription Context
**Purpose**: Manage recurring subscriptions, one-time promotions, and payment collection.

**Aggregates**: Subscription, SetupIntent, ConnectAccount

**Key Operations**:
- Create setup intent for card collection
- Confirm subscription with payment method
- Create checkout session (legacy redirect flow)
- Handle webhook events (subscription created, updated, deleted, account.updated)
- Check subscription status
- Purchase featured promotion
- Expire featured listings (scheduled job)

### 9. Payout Context
**Purpose**: Enable Owners and Suppliers to receive payments via Stripe Connect.

**Key Operations**:
- Create Connect Express account
- Generate onboarding link
- Check onboarding status
- Verify payouts enabled
- Handle account.updated webhooks

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
└── Favorite[] (Entity)
```

> **Note**: The `Supplier` entity is owned by the **Marketplace Context**, not Identity.
> Users with `isSupplier=true` can create a Supplier profile there. See [Identity Notes](00-Domain/03-Identity/NOTES.md) for boundary details.

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

### Owner Aggregate

```
Owner (Root)
├── Campsite[] (Entity, cross-aggregate reference)
├── Subscription (Value Object)
└── ConnectAccount (Value Object)
```

**Owner**

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| userId | UUID | Reference to User |
| propertyName | String | Business/property display name |
| propertyType | PropertyType | Type of accommodation business |
| subscriptionStatus | SubscriptionStatus | Current subscription state |
| stripeCustomerId | String | Stripe customer ID for billing |
| stripeSubscriptionId | String | Active subscription ID |
| currentPeriodEnd | Timestamp | Subscription renewal date |
| cancelAtPeriodEnd | Boolean | Will cancel at period end |
| featured | Boolean | Promoted on homepage |
| featuredUntil | Timestamp | When featured expires |
| stripeConnectAccountId | String | Stripe Connect account for payouts |
| connectOnboardingComplete | Boolean | Has completed onboarding |
| payoutsEnabled | Boolean | Can receive payments |

---

### Supplier Aggregate

```
Supplier (Root)
├── Offer[] (Entity)
├── Subscription (Value Object)
└── ConnectAccount (Value Object)
```

**Supplier**

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| userId | UUID | Reference to User |
| businessName | String | Business display name |
| description | String | Business description |
| category | SupplierCategory | Type of business |
| location | String | Business location |
| phone | String | Contact phone |
| website | String | Business website URL |
| subscriptionStatus | SubscriptionStatus | Current subscription state |
| stripeCustomerId | String | Stripe customer ID for billing |
| stripeSubscriptionId | String | Active subscription ID |
| currentPeriodEnd | Timestamp | Subscription renewal date |
| cancelAtPeriodEnd | Boolean | Will cancel at period end |
| featured | Boolean | Promoted in marketplace |
| featuredUntil | Timestamp | When featured expires |
| stripeConnectAccountId | String | Stripe Connect account for payouts |
| connectOnboardingComplete | Boolean | Has completed onboarding |
| payoutsEnabled | Boolean | Can receive payments |

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

Simplified to 5 types that reflect the Irish camping/glamping market:

| Type | Label | Description | Examples |
|------|-------|-------------|----------|
| TENT | Tent Pitches | Designated spots where guests pitch their own tent. Access to shared facilities (toilets, showers). | Grass pitch, hardstanding pitch |
| TOURING | Touring Pitches | Pitches for caravans, campervans, and motorhomes. Typically include electric hookup, may have water/waste connections. | Caravan pitch, campervan spot, motorhome bay |
| GLAMPING | Glamping | Pre-pitched luxury camping accommodation. Guests arrive to a ready setup with beds, furniture, and amenities. | Bell tent, yurt, safari tent, camping pod, geodesic dome |
| CABIN | Cabins & Lodges | Wooden or permanent structures with beds and basic amenities. May include private bathroom, kitchenette, or heating. | Wooden cabin, lodge, treehouse, shepherd's hut |
| MOBILE_HOME | Mobile Homes | Static caravans or mobile homes with full amenities. Self-contained units with kitchen, bathroom, and living areas. | Static caravan, holiday home, park home |

> **Design Decision**: These 5 types cover 95%+ of Irish camping accommodations while remaining simple for both owners (when listing) and guests (when searching). Previous 12-type model was overly granular for the Irish market.

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

### ClaimStatus (State Machine)

```
┌─────────┐    redeem    ┌──────────┐
│ CLAIMED │─────────────►│ REDEEMED │
└─────────┘              └──────────┘
     │
     │ expires (validUntil passed)
     ▼
┌─────────┐
│ EXPIRED │
└─────────┘
```

| Status | Description |
|--------|-------------|
| CLAIMED | Offer claimed by guest, voucher ready to use |
| REDEEMED | Supplier has marked the voucher as used |
| EXPIRED | Claim expired (past offer's validUntil date) |

### PaymentType

| Type | Description |
|------|-------------|
| CARD | Credit/debit card |
| APPLE_PAY | Apple Pay |
| GOOGLE_PAY | Google Pay |

### SubscriptionStatus

| Status | Description |
|--------|-------------|
| NONE | Never subscribed |
| ACTIVE | Subscription is active and current |
| PAST_DUE | Payment failed, in grace period |
| CANCELED | Subscription was canceled |
| UNPAID | Payment failed, subscription suspended |

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

### Subscription & Featured Rules

1. **Owner Subscription Required for Bookings**: Owners must have an active subscription to receive new bookings
2. **Owner Subscription Required for Analytics**: Owners must have an active subscription to access analytics (lots, bookings, revenue, occupancy)
3. **Owner Subscription Required for Lot Creation**: Owners must have an active subscription to create new lots
4. **Owner Property Visibility**: Owner properties remain visible in search even without subscription (but cannot receive bookings)
5. **Supplier Subscription Required for Offers**: Suppliers must have an active subscription to create new offers
6. **Featured Duration Options**: Featured promotions available for 7 days (€9.99) or 30 days (€29.99)
7. **Featured Extension**: If already featured, new purchases extend from current expiry date
8. **Featured Expiry**: Featured listings automatically expire via hourly scheduled job

### Payout Rules

1. **Connect Account Creation**: A Connect Express account is created when Owner/Supplier initiates payout setup
2. **Onboarding Required**: Connect accounts must complete Stripe-hosted onboarding to verify identity and bank details
3. **Payouts Enabled**: Payouts are only enabled after Stripe verifies the account (via webhook)
4. **One Connect Account**: Each Owner/Supplier can have at most one Connect account
5. **Booking Payouts**: (Future) Owners receive payouts for confirmed bookings minus platform fee
6. **Offer Redemption Payouts**: (Future) Suppliers receive payouts for redeemed offers minus platform fee

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
| `OfferRedeemed` | Supplier marks claim as used | Analytics, Guest notification |
| `SubscriptionCreated` | New subscription started | Notification, Feature unlock |
| `SubscriptionUpdated` | Subscription status changed | Notification |
| `SubscriptionDeleted` | Subscription canceled | Feature lock, Notification |
| `FeaturedPurchased` | Featured promotion purchased | Homepage/Marketplace listing |
| `FeaturedExpired` | Featured promotion expired | Remove from featured list |
| `ConnectAccountCreated` | Connect account created | Begin onboarding flow |
| `ConnectOnboardingComplete` | Connect onboarding finished | Enable payouts |
| `PayoutsEnabled` | Stripe confirms payouts ready | Notification |

---

## Entity Relationships

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ IDENTITY CONTEXT                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ User (1) ──────────────────── (0..*) LinkedAccount                          │
│   │                                                                         │
│   ├──── (0..*) Favorite                                                     │
│   │                                                                         │
│   └──── (0..*) Notification                                                 │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      │ userId references
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ ACCOMMODATION CONTEXT                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ User (isOwner=true) ─────── (0..*) Campsite                                 │
│                                      │                                      │
│                                      ├── (1..*) Lot ─── (0..*) Availability │
│                                      ├── (0..*) Extra                       │
│                                      └── (0..1) CheckInInstructions         │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      │ lotId, extraId references
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ BOOKING CONTEXT                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ User ─────── (0..*) Booking ─────────────────────────────────── (1) Lot     │
│                      │                                                      │
│                      ├── (0..*) BookingExtra ── (1) Extra                   │
│                      ├── (0..*) Message                                     │
│                      └── (0..1) Review                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ SUPPORT CONTEXT                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ User ─────── (0..*) SupportTicket ── (0..*) TicketMessage                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ MARKETPLACE CONTEXT                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ User (isSupplier=true) ───── (0..1) Supplier ── (0..*) Offer                │
│                                                      │                      │
│ User (Guest) ─────────────────────── (0..*) OfferClaim                      │
└─────────────────────────────────────────────────────────────────────────────┘
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
