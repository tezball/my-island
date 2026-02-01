# My Island - API Reference

This document outlines all APIs needed for the Spring Boot backend, derived from the frontend mock services.

---

## Data Models

### User (authService)
```typescript
interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
    role: 'guest' | 'owner' | 'supplier';
    isOwner?: boolean;
    isSupplier?: boolean;
}
```

### Booking (adminService)
```typescript
interface Booking {
    id: string;
    userId: string;
    userName: string;
    lotId: string;
    lotName: string;
    startDate: string;      // DD/MM/YYYY format
    endDate: string;        // DD/MM/YYYY format
    status: 'confirmed' | 'pending' | 'cancelled' | 'checked_in' | 'completed';
    totalPrice: number;
    details?: string;
}
```

### Lot (adminService)
```typescript
interface Lot {
    id: string;
    ownerId?: string;
    name: string;
    type: 'tent' | 'rv' | 'cabin' | 'lodge' | 'mobile-home';
    pricePerNight: number;
    description: string;
    lotAmenities: string[];       // Pitch-specific (Electric Hookup, Fire Pit)
    campsiteAmenities: string[];  // Shared facilities (Showers, WiFi)
    isAvailable: boolean;
    imageUrl?: string;
}
```

### Owner (ownerService)
```typescript
interface Owner {
    id: string;
    userId: string;
    propertyName: string;
    county: string;
    town: string;
    description: string;
    coverImageUrl: string;
    propertyType: string;
    selectedAccommodationTypes: string[];
    contactEmail: string;
    contactPhone: string;
    active: boolean;
    verified: boolean;
    createdAt: string;
    stats: OwnerStats;
}

interface OwnerStats {
    totalLots: number;
    activeLots: number;
    totalBookings: number;
    upcomingBookings: number;
    totalRevenue: number;
    monthlyRevenue: number;
    occupancyRate: number;
}
```

### Supplier (supplierService)
```typescript
type OfferCategory = 'FOOD' | 'ACTIVITIES' | 'GEAR' | 'ATTRACTIONS' | 'TRANSPORT';

interface Supplier {
    id: string;
    userId: string;
    businessName: string;
    description: string;
    logo: string;
    category: OfferCategory;
    location: string;
    contactEmail: string;
    contactPhone: string;
    active: boolean;
    createdAt: string;
}
```

### Offer (supplierService)
```typescript
interface Offer {
    id: string;
    supplierId: string;
    title: string;
    description: string;
    category: OfferCategory;
    discountPercent: number;
    validFrom: string;          // ISO date
    validUntil: string;         // ISO date
    maxClaims: number | null;   // null = unlimited
    claimCount: number;
    terms: string;
    active: boolean;
    imageUrl?: string;
    createdAt: string;
}
```

### OfferClaim (supplierService)
```typescript
interface OfferClaim {
    id: string;
    offerId: string;
    userId: string;
    userName: string;
    claimedAt: string;
    redeemedAt: string | null;
    status: 'claimed' | 'redeemed' | 'expired';
    isTest?: boolean;   // True for supplier test claims
}
```

---

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/auth/login` | User login | `{ email, password }` | `{ user: User, token: string }` |
| POST | `/api/auth/signup` | User registration | `{ name, email, password }` | `{ user: User, token: string }` |
| POST | `/api/auth/logout` | User logout | - | `void` |
| PUT | `/api/auth/upgrade/owner/{userId}` | Upgrade user to owner | - | `User` |
| PUT | `/api/auth/upgrade/supplier/{userId}` | Upgrade user to supplier | - | `User` |

---

### Owner (`/api/owner`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/owner/profile/{userId}` | Get owner profile | - | `Owner \| null` |
| POST | `/api/owner/profile` | Create owner profile | `CreateOwnerParams` | `Owner` |
| PUT | `/api/owner/profile/{ownerId}` | Update owner profile | `Partial<Owner>` | `void` |
| GET | `/api/owner/dashboard/{userId}` | Get dashboard data | - | `OwnerDashboardData` |
| GET | `/api/owner/lots/{userId}` | Get owner's lots | - | `Lot[]` |
| GET | `/api/owner/bookings/{userId}` | Get owner's bookings | - | `Booking[]` |

**OwnerDashboardData Response:**
```typescript
{
    owner: Owner | null;
    recentBookings: Booking[];
    lots: Lot[];
    upcomingCheckIns: Booking[];
    upcomingCheckOuts: Booking[];
}
```

---

### Campsite/Guest (`/api/campsites`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/campsites/{id}` | Get campsite profile | - | `User` |
| GET | `/api/campsites/{ownerId}/lots` | Get campsite lots | - | `Lot[]` |
| POST | `/api/bookings` | Create booking | `Booking` (without id, status) | `Booking` |
| GET | `/api/users/{userId}/bookings` | Get user's bookings | - | `Booking[]` |

---

### Supplier - Profile (`/api/supplier`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/supplier/profile/{userId}` | Get supplier profile | - | `Supplier \| null` |
| PUT | `/api/supplier/profile/{id}` | Update supplier profile | `Partial<Supplier>` | `void` |
| POST | `/api/supplier/business` | Create supplier business | `CreateSupplierBusinessParams` | `Supplier` |

**CreateSupplierBusinessParams:**
```typescript
{
    userId: string;
    businessName: string;
    businessType: string;
    description: string;
    contactEmail: string;
    contactPhone: string;
    website: string;
    logoUrl: string;
    county: string;
    town: string;
    servicesOffered: string[];
}
```

---

### Supplier - Offers (`/api/supplier/offers`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/supplier/{supplierId}/offers` | Get supplier's offers | - | `Offer[]` |
| GET | `/api/supplier/offers/{offerId}` | Get single offer | - | `Offer \| null` |
| POST | `/api/supplier/offers` | Create offer | `Offer` (without id, claimCount, createdAt) | `Offer` |
| PUT | `/api/supplier/offers/{id}` | Update offer | `Partial<Offer>` | `void` |
| DELETE | `/api/supplier/offers/{id}` | Delete offer | - | `void` |

---

### Supplier - Dashboard (`/api/supplier/dashboard`)

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/api/supplier/{supplierId}/dashboard/stats` | Get dashboard stats | `SupplierDashboardStats` |
| GET | `/api/supplier/{supplierId}/offers/detail` | Get active offers detail | `ActiveOffersDetailResponse` |
| GET | `/api/supplier/{supplierId}/claims/detail` | Get claims detail | Query: `?period=all\|month` | `ClaimsDetailResponse` |

**SupplierDashboardStats Response:**
```typescript
{
    activeOffers: number;
    totalClaims: number;
    thisMonthClaims: number;
    recentClaims: OfferClaim[];
}
```

---

### Supplier - Claims (`/api/supplier/claims`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/supplier/offers/{offerId}/claims` | Get offer claims | - | `OfferClaim[]` |
| GET | `/api/supplier/claims/{claimId}` | Get claim by ID | - | `{ claim, offer, supplier }` |
| PUT | `/api/supplier/claims/{claimId}/redeem` | Redeem claim | - | `OfferClaim` |
| POST | `/api/supplier/offers/{offerId}/test-claim` | Create test claim | - | `OfferClaim` |
| DELETE | `/api/supplier/claims/{claimId}/test` | Reset test claim | - | `void` |

---

### Guest - Vouchers (`/api/vouchers`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/users/{userId}/vouchers` | Get user's vouchers | - | `(OfferClaim & { offer, supplier })[]` |
| POST | `/api/offers/{offerId}/claim` | Claim an offer | `{ userId, userName }` | `OfferClaim` |

---

### Guest - Marketplace (`/api/marketplace`)

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/api/marketplace/offers` | Get all active offers | `(Offer & { supplier })[]` |

**Filters active offers by:**
- `active === true`
- `validFrom <= now`
- `validUntil >= now`
- `maxClaims === null || claimCount < maxClaims`

---

### Property Onboarding (`/api/onboarding`)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/onboarding/property` | Create property | `CreatePropertyParams` | `Property` |
| POST | `/api/onboarding/lots/bulk` | Create lots in bulk | `CreateBulkLotsParams` | `Lot[]` |

**CreatePropertyParams:**
```typescript
{
    userId: string;
    propertyName: string;
    county: string;
    town: string;
    description: string;
    coverImageUrl: string;
    propertyType: 'campsite' | 'glamping' | 'caravan-park' | 'mixed';
}
```

**CreateBulkLotsParams:**
```typescript
{
    userId: string;
    lotCounts: { tent: number, glamping: number, rv: number, cabin: number };
    campsiteAmenities: string[];
    lotAmenities: string[];
    basePricePerNight: number;
    typePricing?: Record<string, number>;
}
```

---

## Database Schema (Suggested)

### Tables

1. **users**
   - id (PK)
   - email (unique)
   - password_hash
   - name
   - avatar_url
   - role (enum: guest, owner, supplier)
   - is_owner (boolean)
   - is_supplier (boolean)
   - created_at

2. **owners**
   - id (PK)
   - user_id (FK → users)
   - property_name
   - county
   - town
   - description
   - cover_image_url
   - property_type (enum)
   - contact_email
   - contact_phone
   - active (boolean)
   - verified (boolean)
   - created_at

3. **lots**
   - id (PK)
   - owner_id (FK → owners)
   - name
   - type (enum: tent, rv, cabin, lodge, mobile-home)
   - price_per_night
   - description
   - is_available (boolean)
   - image_url
   - created_at

4. **lot_amenities** (many-to-many)
   - lot_id (FK)
   - amenity_name

5. **campsite_amenities** (many-to-many)
   - lot_id (FK)
   - amenity_name

6. **bookings**
   - id (PK)
   - user_id (FK → users)
   - lot_id (FK → lots)
   - start_date
   - end_date
   - status (enum)
   - total_price
   - details
   - created_at

7. **suppliers**
   - id (PK)
   - user_id (FK → users)
   - business_name
   - description
   - logo_url
   - category (enum)
   - location
   - contact_email
   - contact_phone
   - active (boolean)
   - created_at

8. **offers**
   - id (PK)
   - supplier_id (FK → suppliers)
   - title
   - description
   - category (enum)
   - discount_percent
   - valid_from
   - valid_until
   - max_claims (nullable)
   - claim_count
   - terms
   - active (boolean)
   - image_url
   - created_at

9. **offer_claims**
   - id (PK)
   - offer_id (FK → offers)
   - user_id (FK → users)
   - claimed_at
   - redeemed_at (nullable)
   - status (enum: claimed, redeemed, expired)
   - is_test (boolean, default false)

---

## API Summary by Count

| Service | Endpoints | Description |
|---------|-----------|-------------|
| authService | 5 | Authentication & user role upgrades |
| ownerService | 6 | Owner profile & dashboard |
| campsiteService | 4 | Guest-facing campsite & booking |
| supplierService | 18 | Supplier profile, offers, claims, redemption |

**Total: 33 API endpoints**

---

## Implementation Notes

1. **Date Formats**: Frontend uses DD/MM/YYYY for display, consider ISO 8601 for API
2. **Claim Expiration**: Implement a scheduled job to expire claims past `validUntil`
3. **Test Claims**: `isTest=true` claims don't count toward `maxClaims` limit
4. **QR Redemption**: Claim ID encoded in URL for scanner: `/supplier/redeem?id={claimId}`
5. **Image Storage**: Currently using Unsplash URLs; plan for S3/cloud storage
6. **Authentication**: JWT tokens with role-based access control
