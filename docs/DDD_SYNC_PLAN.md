# DDD Synchronization Plan

## 1. Executive Summary

The current codebase follows a **Layered/Service-Based Architecture** with flat data structures, whereas the documentation prescribes a **Domain-Driven Design (DDD)** approach with distinct Bounded Contexts and rich domain models. This document outlines the strategy to align the code with the extensive domain documentation found in `docs/00-Domain`.

## 2. Gap Analysis

| Feature | Documentation (DDD) | Current Codebase | Gap Severity |
| :--- | :--- | :--- | :--- |
| **Architecture** | Modular Bounded Contexts (Accommodation, Booking, Identity, etc.) | Flat Service Layer (`src/services/`) | High |
| **Data Model** | Rich Aggregates with invariants (e.g., `Campsite` root with `Lot` entities) | Anemic Interfaces (`Lot`, `Booking`) and centralized `MOCK_DB` | High |
| **Identity** | Explicit Identity Context; `User` separate from `Owner` or `Guest` roles | Mixed `User` types; polymorphic `CampsiteProfile` extends `User` | Medium |
| **Domain Events** | 9 defined events for cross-context communication | No event infrastructure | High |
| **Marketplace** | Supplier aggregate with Offers in dedicated context | `supplierService.ts` feature-complete (claim/redeem flow done), needs DDD structure | Medium |
| **Language** | Ubiquitous Language (e.g., `Lot`, `Extra`, `Facility`) | Mostly aligned, but some terms mixed (e.g., `CampsiteProfile` vs `Campsite`) | Low |

### Key Discrepancies

1. **No Bounded Contexts**: All services are in a single bucket. Separation of concerns (e.g., Booking vs Support) is weak.
2. **Centralized State**: `MOCK_DB` couples all contexts together. In a real system, these would be separate database schemas or microservices.
3. **Anemic Domain**: Logic resides in services (`campsiteService.ts`), not in domain entities.
4. **No Domain Events**: Cross-context communication has no defined pattern.
5. **Active Development Drift**: Supplier features are being built outside the DDD structure.
6. **Owner/Admin Services Overlap**: `ownerService.ts` and `adminService.ts` mix concerns that should be in Accommodation and a separate Admin/Operations context.

## 3. Architecture Strategy: Modular Monolith

To align with the docs without over-engineering a distributed system too early, we will adopt a **Modular Monolith** structure.

### Proposed Directory Structure

```
src/
├── core/                   # Shared Kernel (Base Classes, Common Types)
│   ├── domain/             # Entity, ValueObject, DomainEvent
│   ├── events/             # Event dispatcher, event contracts
│   └── infrastructure/     # HttpClient, Logger
├── modules/                # Bounded Contexts
│   ├── accommodation/      # Context: Accommodation
│   │   ├── domain/         # Aggregates (Campsite, Lot), Value Objects (Location)
│   │   ├── repos/          # Repository interfaces + Mock implementations
│   │   ├── useCases/       # Application Services (GetCampsite, UpdateInventory)
│   │   └── ui/             # Components specific to this context
│   ├── booking/            # Context: Booking
│   ├── identity/           # Context: Identity
│   ├── review/             # Context: Review
│   ├── communication/      # Context: Communication
│   ├── support/            # Context: Support
│   └── marketplace/        # Context: Marketplace (Supplier, Offer)
└── ui/                     # Shared UI Components (Design System)
```

### Context Dependency Map

```
                    ┌─────────────────┐
                    │    Identity     │
                    │   (User Auth)   │
                    └────────┬────────┘
                             │ userId
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ Accommodation │    │   Booking     │    │  Marketplace  │
│  (Campsite)   │◄───│  (Reserves)   │    │  (Supplier)   │
└───────┬───────┘    └───────┬───────┘    └───────────────┘
        │                    │
        │ campsiteId         │ bookingId
        │                    │
        ▼                    ▼
┌───────────────┐    ┌───────────────┐
│    Review     │    │Communication  │
│  (Feedback)   │    │  (Messages)   │
└───────────────┘    └───────────────┘
                             │
                             ▼
                    ┌───────────────┐
                    │    Support    │
                    │   (Tickets)   │
                    └───────────────┘
```

### Cross-Context Communication

Contexts communicate through:
- **ID References**: Contexts reference other aggregates by ID only (e.g., `Booking.lotId`)
- **Domain Events**: Asynchronous notifications for side effects (e.g., `BookingCompleted` triggers review eligibility)
- **Application Services**: Orchestrate queries across contexts when needed

**Rules**:
- Never pass aggregate instances across context boundaries
- Use Anti-Corruption Layers (ACLs) when integrating with legacy services during migration

### Service-to-Context Mapping

| Current Service | Target Context | Notes |
|-----------------|----------------|-------|
| `campsiteService.ts` | Accommodation | Guest-facing queries |
| `ownerService.ts` | Accommodation | Owner-facing management (same context, different use cases) |
| `authService.ts` | Identity | Auth + profile |
| `supplierService.ts` | Marketplace | Supplier + offers |

### Repository Pattern

Each context defines repository interfaces in `repos/`:

```typescript
// src/modules/accommodation/repos/ICampsiteRepository.ts
export interface ICampsiteRepository {
  findById(id: string): Promise<Campsite | null>;
  findByOwnerId(ownerId: string): Promise<Campsite[]>;
  save(campsite: Campsite): Promise<void>;
  delete(id: string): Promise<void>;
}
```

Implementations (mock or real) are injected, enabling easy testing and future persistence swaps.

### Value Objects

Implement these immutable value objects from `DOMAIN_MODEL.md`:

| Value Object | Context | Fields |
|--------------|---------|--------|
| `Location` | Accommodation | address, county, lat, lng |
| `NotificationPreferences` | Identity | email, push, sms, marketing |
| `ReviewCategories` | Review | cleanliness, location, value, facilities |

### Aggregate Invariants

Enforce these rules within aggregate constructors/methods:

| Aggregate | Invariant | Enforcement |
|-----------|-----------|-------------|
| `Booking` | `checkOut > checkIn` | Constructor validation |
| `Booking` | `guests <= lot.capacity` | `addGuests()` method |
| `Booking` | `totalPrice = lotPrice + extrasPrice + serviceFee` | Computed property |
| `Campsite` | At least one active lot to be bookable | `activate()` method |
| `Review` | Rating must be 1-5 | Constructor validation |
| `Offer` | `validUntil > validFrom` | Constructor validation |

## 4. Migration Phases

We will tackle the migration one Bounded Context at a time, "strangling" the existing services.

### Phase Priority Rationale

| Phase | Context | Rationale |
|-------|---------|-----------|
| 0 | Core Infrastructure | Foundation for all contexts |
| 1 | Accommodation | Core product data, fewest dependencies |
| 2 | Marketplace | **Active development** - align immediately |
| 3 | Identity | Decouples auth from domain profiles |
| 4 | Booking | Depends on Accommodation (Lot) and Identity (User) |
| 5 | Review | Depends on Booking (COMPLETED status) |
| 6 | Communication | Guest-host messaging |
| 7 | Support | Ticket system, lowest priority |

---

### Phase 0: Core Infrastructure

*Goal: Establish shared foundation for all contexts.*

1. Create `src/core/domain/Entity.ts` - base class with ID and equality.
2. Create `src/core/domain/ValueObject.ts` - immutable base class.
3. Create `src/core/domain/AggregateRoot.ts` - extends Entity, manages domain events.
4. Create `src/core/events/DomainEvent.ts` - event base class with timestamp.
5. Create `src/core/events/EventDispatcher.ts` - simple in-memory pub/sub.

---

### Phase 1: Accommodation Context

*Goal: Establish the pattern with the core product data.*

**Aggregates**: `Campsite` (root), `Lot`, `Extra`, `CheckInInstructions`, `LotAvailability`
**Value Objects**: `Location`
**Events**: None (read-heavy context)

1. Create `src/modules/accommodation`.
2. Implement `Location` value object.
3. Implement `Campsite` aggregate root with `Lot[]`, `Extra[]`, and `CheckInInstructions`.
4. Implement `LotAvailability` for calendar management.
5. Define `ICampsiteRepository` and `ILotAvailabilityRepository` interfaces.
6. Create mock repository implementations.
7. Migrate data from `MOCK_DB.lots` to new repository.
8. Create ACL adapter wrapping `campsiteService.ts` AND `ownerService.ts`.
9. Create use cases for both Guest (browse) and Owner (manage) flows.
10. Refactor UI to use new module via ACL.
11. Deprecate direct service calls.

---

### Phase 2: Marketplace Context (PRIORITY)

*Goal: Align active Supplier development with DDD structure.*

> **Note**: `supplierService.ts` and supplier pages are actively being developed. This phase should start immediately to prevent further drift.

#### Current Implementation Status (Service Layer)

The following features are implemented in `supplierService.ts`:

- [x] `Supplier` interface with full schema
- [x] `Offer` interface with full schema
- [x] `OfferClaim` interface with full schema
- [x] `getSupplierProfile` / `updateSupplierProfile`
- [x] `getOffers` / `getOfferById` / `addOffer` / `updateOffer` / `deleteOffer`
- [x] `getOfferClaims` - List claims for an offer
- [x] `claimOffer` - Guest claims an offer (creates OfferClaim with status: claimed)
- [x] `redeemClaim` - Supplier marks claim as redeemed (sets status: redeemed, redeemedAt)
- [x] `getUserVouchers` - Guest views their claimed vouchers
- [x] `getAllActiveOffers` - Browse marketplace

#### UI Implementation Status

- [x] `VouchersPage.tsx` - Guest voucher list with QR code modal
- [x] `VoucherQRModal.tsx` - QR code display for redemption
- [x] `SupplierOfferDetailPage.tsx` - Supplier can redeem claims

#### Remaining Migration Tasks

1. Create `src/modules/marketplace`.
2. Implement `Supplier` aggregate root with `Offer[]` entities.
3. Implement `OfferClaim` entity with state transitions.
4. Define `ISupplierRepository` and `IOfferRepository` interfaces.
5. Create mock repository implementations.
6. Migrate `supplierService.ts` to use cases:
   - `CreateSupplierProfile`
   - `PublishOffer`
   - `ClaimOffer`
   - `RedeemClaim`
   - `BrowseMarketplace`
7. Update supplier pages to use new module.
8. Publish `OfferClaimed` and `OfferRedeemed` domain events.

---

### Phase 3: Identity Context

*Goal: Decouple Authentication from Domain Profiles.*

**Aggregates**: `User` (root), `LinkedAccount`, `Favorite`
**Value Objects**: `NotificationPreferences`
**Events**: None

1. Create `src/modules/identity`.
2. Implement `User` aggregate with `LinkedAccount[]`, `Favorite[]`, and `NotificationPreferences`.
3. Separate auth concerns from profile data.
4. Define `IUserRepository` interface.
5. Create mock repository implementation.
6. Update `authService.ts` to use the new module.
7. Ensure `isOwner` and `isSupplier` flags route to respective contexts.

---

### Phase 4: Booking Context

*Goal: Implement the rich Booking State Machine.*

**Aggregates**: `Booking` (root), `BookingExtra`
**Value Objects**: None
**Events**: `BookingCreated`, `BookingConfirmed`, `BookingCancelled`, `GuestCheckedIn`, `BookingCompleted`

1. Create `src/modules/booking`.
2. Implement `Booking` aggregate with state machine:
   - `PENDING` → `CONFIRMED` → `CHECKED_IN` → `COMPLETED`
   - Any state → `CANCELLED`
3. Implement `BookingExtra` entity with price locking.
4. Enforce all booking invariants (dates, capacity, pricing).
5. Define `IBookingRepository` interface.
6. Create mock repository implementation.
7. Implement use cases: `CreateBooking`, `ConfirmBooking`, `CheckInGuest`, `CancelBooking`.
8. Publish domain events on state transitions.
9. Subscribe to availability updates from Accommodation context.

---

### Phase 5: Review Context

*Goal: Enable post-stay feedback.*

**Depends on**: Booking (requires `COMPLETED` status)
**Aggregates**: `Review` (root)
**Value Objects**: `ReviewCategories`
**Events**: `ReviewSubmitted`

1. Create `src/modules/review`.
2. Implement `Review` aggregate with `ReviewCategories` value object.
3. Enforce one review per booking constraint.
4. Define `IReviewRepository` interface.
5. Subscribe to `BookingCompleted` event to enable review eligibility.
6. Publish `ReviewSubmitted` event (triggers rating recalculation in Accommodation).

---

### Phase 6: Communication Context

*Goal: Guest-host messaging system.*

**Aggregates**: `Message`, `Notification`
**Events**: `MessageSent`

1. Create `src/modules/communication`.
2. Implement `Message` and `Notification` aggregates.
3. Define repository interfaces.
4. Subscribe to booking events for automated notifications.
5. Implement `SendMessage` and `GetConversation` use cases.

---

### Phase 7: Support Context

*Goal: Customer service ticket system.*

**Aggregates**: `SupportTicket` (root), `TicketMessage`
**Events**: `TicketCreated`, `TicketResolved`

1. Create `src/modules/support`.
2. Implement `SupportTicket` aggregate with `TicketMessage[]`.
3. Implement ticket state machine: `OPEN` → `IN_PROGRESS` → `RESOLVED` → `CLOSED`.
4. Define `ISupportTicketRepository` interface.
5. Publish `TicketCreated` event for staff queue.

---

## 5. Anti-Corruption Layer Strategy

During migration, legacy services coexist with new modules. Use ACLs to:

```typescript
// src/modules/accommodation/acl/LegacyCampsiteAdapter.ts
export class LegacyCampsiteAdapter implements ICampsiteRepository {
  constructor(private legacyService: typeof campsiteService) {}

  async findById(id: string): Promise<Campsite | null> {
    const data = await this.legacyService.getCampsite(id);
    return data ? this.toDomain(data) : null;
  }

  private toDomain(legacy: LegacyCampsite): Campsite {
    // Transform flat structure to rich aggregate
  }
}
```

**Strangler Pattern**:
1. Wrap legacy service with ACL
2. UI calls new module (via ACL)
3. Gradually replace ACL internals with real implementation
4. Remove ACL when migration complete

## 6. Testing Strategy

### Unit Tests (per context)

- **Aggregates**: Test invariant enforcement, state transitions
- **Value Objects**: Test immutability, equality, validation
- **Use Cases**: Test business logic with mocked repositories

### Integration Tests

- **Repository**: Test data persistence and retrieval
- **Event Handling**: Test cross-context event propagation

### Test Fixtures

Create factories for each aggregate:

```typescript
// src/modules/booking/test/BookingFactory.ts
export const BookingFactory = {
  create(overrides?: Partial<BookingProps>): Booking {
    return new Booking({
      id: 'booking-1',
      lotId: 'lot-1',
      userId: 'user-1',
      checkIn: new Date('2026-06-01'),
      checkOut: new Date('2026-06-03'),
      guests: 2,
      status: BookingStatus.PENDING,
      ...overrides,
    });
  },
};
```

## 7. Context Migration Checklist

Use this checklist for each bounded context:

- [ ] Create module directory structure
- [ ] Define aggregate root and child entities
- [ ] Implement value objects with validation
- [ ] Create repository interface
- [ ] Implement mock repository
- [ ] Write aggregate invariant unit tests
- [ ] Create use cases (application services)
- [ ] Define domain events (if applicable)
- [ ] Create ACL adapter for legacy service
- [ ] Update UI to use new module
- [ ] Write integration tests
- [ ] Deprecate legacy service calls
- [ ] Remove ACL (when fully migrated)

## 8. Immediate Next Steps / Action Items

The following tasks should be executed:

### High Priority (Start Immediately)

- [ ] **Task 0: Setup Core Infrastructure**
  - Define `Entity`, `ValueObject`, `AggregateRoot` base types
  - Create simple event dispatcher

- [ ] **Task 1: Setup Marketplace Module** (URGENT)
  - Create `src/modules/marketplace` structure
  - Implement `Supplier` and `Offer` aggregates
  - Migrate `supplierService.ts` before further drift

### Standard Priority

- [ ] **Task 2: Setup Accommodation Module**
  - Implement `Campsite` aggregate with `Location` value object
  - Create repository interface and mock implementation

- [ ] **Task 3: Refactor Mock Data**
  - Split `MOCK_DB` into context-specific repositories
  - Create ACL adapters for legacy services

- [ ] **Task 4: Update UI Integration**
  - Update pages to use new modules via ACL
  - Gradually remove direct service calls

## 9. Open Questions

- [ ] Should we implement a formal event bus or keep simple in-memory dispatcher?
- [ ] How do we handle transactions across contexts (saga pattern vs eventual consistency)?
- [ ] What's the strategy for migrating the Spring Boot backend to match this structure?
- [ ] Should `adminService.ts` become a CQRS read model or a separate Admin context?
- [ ] How do we handle the `MOCK_DB` → real database transition timeline?
- [ ] Should we introduce dependency injection (e.g., InversifyJS) for repository management?

## 10. References

- Domain Model: `docs/00-Domain/DOMAIN_MODEL.md`
- Context Notes: `docs/00-Domain/[01-07]-*/NOTES.md`
- User Stories: `docs/00-Domain/[01-07]-*/USER_STORIES.md`
- Architecture Overview: `docs/02-Architecture/README.md`
