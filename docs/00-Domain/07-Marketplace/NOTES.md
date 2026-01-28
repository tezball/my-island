# Marketplace Context Notes

## Purpose
Partner offers and local experiences for guests.

## Aggregates

### Supplier Aggregate (Root)
```
Supplier (Root)
└── Offer[] (Entity)
```

**Supplier** (owned by Marketplace, linked to User in Identity)

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| userId | UUID | Reference to User in Identity Context |
| businessName | String | Display name for the business |
| description | String | About the business |
| logo | String | Business logo URL |
| category | OfferCategory | Primary category |
| location | String | Business location |
| contactEmail | String | Business contact email |
| active | Boolean | Currently accepting claims |
| createdAt | Timestamp | Profile creation time |

**Offer**

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique identifier |
| supplierId | UUID | Parent supplier |
| title | String | Offer headline |
| description | String | Offer details |
| category | OfferCategory | Offer type |
| discountPercent | Integer | Discount amount (e.g., 10 = 10% off) |
| validFrom | Date | Start date |
| validUntil | Date | Expiry date |
| maxClaims | Integer | Total available claims (null = unlimited) |
| claimCount | Integer | Current claims |
| terms | String | Terms and conditions |
| active | Boolean | Currently visible |

---

## Supplier vs User Account

The `Supplier` entity is **separate from the `User` entity** but linked via `userId`:

- **User** (Identity Context): Authentication, profile, `isSupplier` flag
- **Supplier** (Marketplace Context): Business details, offers

A user with `isSupplier=true` can create a `Supplier` profile here. See [Identity Context Notes](../03-Identity/NOTES.md) for full details on this boundary.

---

## Commands & Queries

### Commands (Write Operations)
| Command | Actor | Description |
|---------|-------|-------------|
| `CreateSupplierProfile` | User (isSupplier=true) | Create business profile |
| `UpdateSupplierProfile` | Supplier | Update business details |
| `PublishOffer` | Supplier | Create and publish a new offer |
| `UpdateOffer` | Supplier | Modify offer details |
| `DeactivateOffer` | Supplier | Hide offer from marketplace |
| `ClaimOffer` | Guest | Claim an offer for redemption |
| `RedeemOffer` | Supplier | Mark offer as used |

### Queries (Read Operations)
| Query | Actor | Description |
|-------|-------|-------------|
| `BrowseMarketplace` | Guest/Anonymous | List available offers with filters |
| `ViewOfferDetails` | Guest/Anonymous | Get full offer information |
| `GetMyOffers` | Supplier | List supplier's own offers |
| `GetClaimedOffers` | Guest | List guest's claimed offers |
| `GetOfferClaims` | Supplier | List claims for an offer |

---

## Enums

### OfferCategory
- `FOOD` - Restaurants, cafes, food vendors
- `ACTIVITIES` - Tours, experiences, sports
- `GEAR` - Equipment rental
- `ATTRACTIONS` - Local attractions, museums
- `TRANSPORT` - Car rental, bikes, shuttles

### ClaimStatus
- `CLAIMED` - Offer claimed, not yet used
- `REDEEMED` - Offer used
- `EXPIRED` - Claim expired (past validUntil)

---

## Domain Events

| Event | Trigger | Consumers |
|-------|---------|-----------|
| `SupplierProfileCreated` | New supplier registers | Admin notification |
| `OfferPublished` | New offer goes live | Guest notifications (if subscribed) |
| `OfferClaimed` | Guest claims offer | Supplier notification |
| `OfferRedeemed` | Supplier marks used | Analytics |
| `OfferExpired` | Past validUntil date | Cleanup, Guest notification |

---

## Business Rules

1. **Supplier Prerequisite**: Only users with `isSupplier=true` can create a Supplier profile
2. **One Profile Per User**: A user can have at most one Supplier profile
3. **Claim Limits**: If `maxClaims` is set, `claimCount` cannot exceed it
4. **Date Validation**: `validUntil` must be after `validFrom`
5. **Active Offers Only**: Guests can only claim offers where `active=true` and within date range
