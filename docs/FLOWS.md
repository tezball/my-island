# Visual Flows

Cross-cutting platform flows rendered as Mermaid diagrams. For module-specific state machines and sequences, see the individual module docs under `domain/`.

## User Journey Overview

```mermaid
flowchart LR
    Browse["Browse Campsites"] --> Search["Search & Filter"]
    Search --> View["View Campsite"]
    View --> Save["Save to Wishlist"]
    View --> Book["Book a Lot"]
    Book --> Pay["Pay with Stripe"]
    Pay --> Confirm["Booking Confirmed"]
    Confirm --> CheckIn["Check In"]
    CheckIn --> Complete["Stay Complete"]
    Complete --> Review["Leave Review"]

    View --> Offers["Browse Marketplace"]
    Offers --> Claim["Claim Offer"]
    Claim --> Redeem["Redeem at Supplier"]
```

See also:
- [Booking lifecycle](domain/booking/README.md#booking-status-lifecycle)
- [Payment flow](domain/booking/PAYMENT_FLOW.md)
- [Offer claim flow](domain/marketplace/README.md#offer-claim--redeem-flow)

## Image Upload Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant API
    participant S3

    User->>Frontend: Select files (drag & drop or picker)
    Frontend->>Frontend: Validate file type & size
    Frontend->>API: POST /images/{entityType}/{entityId} (FormData)
    API->>API: Validate magic bytes & content type
    API->>S3: Upload image
    S3-->>API: Image URL
    API->>API: Create EntityImage record
    API-->>Frontend: EntityImage (id, url, isPrimary)
    Frontend->>Frontend: Update image grid
```

See also:
- [Image system notes](domain/accommodation/README.md)

## Owner Onboarding Flow

```mermaid
flowchart TD
    Signup["Guest signs up"] --> Personalize["Personalize: become Owner"]
    Personalize --> Profile["Fill property details"]
    Profile --> Trial["14-day subscription trial starts"]
    Trial --> Lots["Add lots & pricing"]
    Lots --> Live["Campsite visible in search"]
    Live --> Sub{"Trial expires"}
    Sub -->|Subscribe| Active["Active: receive bookings"]
    Sub -->|No action| Expired["Expired: visible but no bookings"]
```

## Supplier Onboarding Flow

```mermaid
flowchart TD
    Signup["Guest signs up"] --> Personalize["Personalize: become Supplier"]
    Personalize --> Profile["Fill business details"]
    Profile --> Trial["14-day subscription trial starts"]
    Trial --> Offers["Create offers"]
    Offers --> Live["Offers visible in marketplace"]
    Live --> Sub{"Trial expires"}
    Sub -->|Subscribe| Active["Active: publish offers"]
    Sub -->|No action| Expired["Expired: offers hidden"]
```
