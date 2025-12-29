# Offers Flow

The offers flow displays local supplier deals and promotions that enhance the camping experience.

## Screens

| # | Screen | File | Description |
|---|--------|------|-------------|
| 1 | Offers Feed | `01-offers-feed.png` | List of supplier offers |

## User Stories

### US-OFF-001: Browse Supplier Offers
**As a** user
**I want to** browse local supplier offers
**So that** I can find deals to enhance my trip

**Acceptance Criteria:**
- Feed of offer cards displayed
- Each offer shows: supplier name, title, discount, image
- Category icons (food, activity, gear, etc.)
- Distance from campsite (if location-based)
- Offers sorted by relevance or proximity

---

### US-OFF-002: Filter Offers by Category
**As a** user
**I want to** filter offers by type
**So that** I can find specific kinds of deals

**Acceptance Criteria:**
- Filter chips: All, Food, Activities, Gear, Wellness, etc.
- Tapping chip filters the feed
- Active filter visually indicated
- Can combine with location filter

---

### US-OFF-003: View Offer Details
**As a** user
**I want to** see full details of an offer
**So that** I can decide if it's worth redeeming

**Acceptance Criteria:**
- Tap offer card to view details
- Full description displayed
- Discount amount/percentage clear
- Valid dates shown
- Terms and conditions
- Supplier information
- Location and directions
- "Redeem" or "Get Offer" CTA

---

### US-OFF-004: View Supplier Details
**As a** user
**I want to** learn more about a supplier
**So that** I can trust their offer

**Acceptance Criteria:**
- Supplier profile accessible from offer
- Business name and logo
- Description/about
- Location on map
- Contact information
- Other offers from same supplier
- Rating/reviews (if available)

---

### US-OFF-005: Redeem Offer
**As a** user
**I want to** redeem an offer
**So that** I can get the discount

**Acceptance Criteria:**
- "Redeem" button on offer detail
- Shows redemption code or QR code
- Instructions on how to use
- May require showing to supplier
- Tracks redemption (one-time use offers)
- Expiry date enforced

---

### US-OFF-006: Save Offer for Later
**As a** user
**I want to** save offers I'm interested in
**So that** I can find them during my trip

**Acceptance Criteria:**
- Save/bookmark icon on offer cards
- Saved offers accessible in profile or separate section
- Remove from saved easily
- Notification before expiry (optional)

---

### US-OFF-007: View Offers Near Campsite
**As a** user with a booking
**I want to** see offers near my booked campsite
**So that** I can plan activities for my stay

**Acceptance Criteria:**
- Offers personalized based on booking location
- Distance from booked campsite shown
- Relevant offers highlighted
- May be shown on booking detail page

---

### US-OFF-008: Share Offer
**As a** user
**I want to** share an offer with friends
**So that** they can benefit too

**Acceptance Criteria:**
- Share button on offer detail
- Opens native share sheet
- Shareable link to offer
- Preview includes offer title and discount

---

## Flow Diagram

```
┌─────────────┐
│ Bottom Nav: │
│   Offers    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│         Offers Feed             │
│                                 │
│  [All] [Food] [Activity] [Gear] │
│                                 │
│  ┌─────────────────────────┐   │
│  │ [Image]                  │   │
│  │ Supplier Name            │   │
│  │ Offer Title              │   │
│  │ 20% OFF | 2km away       │   │
│  │ [Save]                   │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Another Offer Card       │   │
│  └─────────────────────────┘   │
└──────────────┬──────────────────┘
               │ Tap Offer
               ▼
┌─────────────────────────────────┐
│        Offer Detail             │
│                                 │
│  [Hero Image]                   │
│                                 │
│  Supplier: Local Bakery         │
│  "20% off Fresh Pastries"       │
│                                 │
│  Valid: Dec 1 - Dec 31          │
│                                 │
│  Description...                 │
│                                 │
│  [View Supplier] [Share]        │
│                                 │
│  [Redeem Offer]                 │
└──────────────┬──────────────────┘
               │
       ┌───────┴───────┐
       ▼               ▼
┌─────────────┐ ┌─────────────┐
│  Supplier   │ │  Redeem     │
│   Detail    │ │  Screen     │
└─────────────┘ │  (QR/Code)  │
                └─────────────┘
```

## Related Pages

- `src/pages/OffersPage.tsx`
- `src/pages/SupplierDetailPage.tsx`
- `src/types/index.ts` (SupplierOffer type)
- `src/mocks/handlers/offerHandlers.ts`
- `src/mocks/data/offers.ts`
- `src/components/campsite/SupplierCard.tsx`

## Data Model

```typescript
interface SupplierOffer {
  id: string
  supplierId: string
  supplierName: string
  supplierLogo: string
  category: 'food' | 'activity' | 'gear' | 'water' | 'wellness' | 'experience' | 'other'
  title: string
  description: string
  imageUrl: string
  discount: string
  tags: string[]
  location: string
  distance: string
}
```

## Notes

- Offers tied to campsite partnerships
- Location-based offers when user has booking
- Push notifications for new relevant offers
- Analytics on offer views and redemptions
- Supplier self-service management (owner flow)
