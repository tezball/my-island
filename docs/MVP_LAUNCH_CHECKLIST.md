# MVP Launch Checklist - My Island

> **Generated**: 2026-02-01
> **Status**: ✅ Approved - Ready for Implementation

## Executive Summary

The app has extensive frontend UI with **all data currently mocked in TypeScript/JSON files**. For MVP launch, the following must be DB-backed with realistic seeded data.

### Legend
- 🔴 **CRITICAL** - Must have for launch
- 🟡 **IMPORTANT** - Should have for launch
- 🟢 **NICE TO HAVE** - Post-MVP
- ✅ **DECIDED** - Product owner decision made

---

## Key Decisions

| Area | Decision |
|------|----------|
| Image Storage | S3 (LocalStack for local dev) |
| Booking Flow | Owner toggle - they choose instant or approval |
| Voucher Expiry | Supplier sets expiry date when creating offer |
| Guest Checkout | Must register (no guest checkout) |
| Notifications | In-app for MVP, email later |
| Payment Provider | Stripe (Stripe Connect for payouts) |
| Subscription Pricing | Owner: €20/month, Supplier: €1/month |
| Guest Payments | Handle in-app (platform collects, pays out to Owner) |
| Multi-Property | One Owner = One Property for MVP |
| Geographic Scope | Broader Ireland (not just Kilkenny) |
| Supplier Categories | Food, Activities, Services, Experiences |

---

## 🔴 CRITICAL PATH - Must Have for Launch

### 1. Authentication & Users
- [ ] Real JWT authentication via backend API
- [ ] User registration with email verification
- [ ] Password reset flow
- [ ] Role-based access (Owner, Supplier, Guest flags)
- [ ] **Seed**: 3+ test users per role with realistic Irish names

### 2. Owner - Core Booking System

#### Lots Management
- [ ] **Lots CRUD** - Create, Read, Update lots from DB
  - Types: tent, touring, glamping, cabin, mobile-home
  - Pricing per night
  - Amenities (lot-level and campsite-level)
  - Availability status
  - ✅ Images uploaded to S3 (LocalStack for local dev)

#### Bookings
- [ ] **Bookings** - Real booking flow
  - Guest creates booking → Owner sees it
  - Status workflow: pending → confirmed → completed / cancelled
  - Date validation (no double-booking)
  - Price calculation
  - ✅ Owner toggle for booking mode (instant vs approval required)

#### Dashboard Metrics
- [ ] **Dashboard Metrics** from real data:
  - Total Lots (count from DB)
  - Upcoming Bookings (count from DB)
  - Revenue This Month (sum from DB)
  - Occupancy % (calculated)

#### Seed Data
- [ ] **Seed**: 35+ lots, 75+ bookings across past/current/future dates

### 3. Supplier - Marketplace Core

#### Supplier Profile
- [ ] **Supplier Profile** - CRUD from DB
  - Business name, description, category, location, contact
  - Logo upload (S3)
  - ✅ Categories: Food, Activities, Services, Experiences

#### Offers
- [ ] **Offers CRUD** - Create, Read, Update, Delete
  - Title, description, discount %, validity dates
  - Max claims limit
  - Active/inactive status
  - Image upload (S3)
  - ✅ Supplier sets expiry date - vouchers expire with the offer

#### Claims & Redemption
- [ ] **Claims Tracking**
  - Guest claims offer → creates claim record
  - Claim statuses: claimed → redeemed / expired
  - Claim count updates on offer
- [ ] **Voucher Redemption**
  - Look up by claim ID
  - Mark as redeemed
  - QR code generation (client-side)

#### Dashboard Metrics
- [ ] **Dashboard Metrics** from real data:
  - Active Offers count
  - Total Claims count
  - This Month claims

#### Seed Data
- [ ] **Seed**: 3+ suppliers, 4+ offers each, 50+ claims

### 4. Guest - Browse & Book
- [ ] **Search Campsites** - Filter by type, dates, price
- [ ] **Lot Details Page** - Real lot data
- [ ] **Booking Flow** - Create booking in DB
  - ✅ Registration required (no guest checkout)
- [ ] **Browse Offers** - From marketplace DB
- [ ] **Claim Offer** - Create claim in DB
- [ ] **My Vouchers** - List guest's claimed vouchers
- [ ] **My Trips** - List guest's bookings

---

## 🟡 IMPORTANT - Should Have for Launch

### 5. Owner - Management Features
- [ ] **Check-in/Check-out lists** - Today's arrivals/departures
- [ ] **Booking approval** - Confirm pending bookings
- [ ] **Property Details** - Editable campsite info

### 6. Supplier - Business Features
- [ ] **Offer analytics** - Claims by offer, redemption rate
- [ ] **Claim history** - Full list with filters

### 7. Notifications (In-App)
- [ ] New booking notification for Owner
- [ ] New claim notification for Supplier
- [ ] Booking confirmation for Guest
- ✅ In-app only for MVP (email notifications post-MVP)

---

## 🟢 NICE TO HAVE - Post-MVP

### 8. Calendar View
- [ ] Interactive calendar for Owner
- [ ] Availability calendar for Guests

### 9. Subscriptions & Payments
- [ ] ✅ Stripe + Stripe Connect
- [ ] Owner subscription: €20/month
- [ ] Supplier subscription: €1/month
- [ ] ✅ Guest payments handled in-app (platform collects, pays out to Owner)

### 10. Settings
- [ ] Notification preferences (email toggles)
- [ ] Booking preferences (instant booking, same-day, verification)
- [ ] Payment/payout configuration

### 11. Advanced Features
- [ ] Email notifications (AWS SES or similar)
- [ ] Reviews and ratings
- [ ] ✅ Multi-property support (post-MVP, one owner = one property for now)
- [ ] Analytics dashboards with charts

---

## 📊 Seed Data Requirements

| Entity | Count | Notes |
|--------|-------|-------|
| Users | 10+ | Mix of Owners, Suppliers, Guests |
| Campsites/Properties | 2-3 | ✅ Broader Ireland |
| Lots | 35+ per property | Mix of all 5 types |
| Bookings | 75+ | Past, current, future dates |
| Suppliers | 3+ | ✅ Food, Activities, Services, Experiences |
| Offers | 4+ per supplier | Active, inactive, expiring |
| Claims | 50+ | Mix of claimed, redeemed, expired |

---

## 🏗️ Backend API Endpoints Needed

```
# Auth
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password

# Owner - Property & Lots
GET    /api/owner/property
PUT    /api/owner/property
GET    /api/owner/lots
POST   /api/owner/lots
GET    /api/owner/lots/{id}
PUT    /api/owner/lots/{id}
DELETE /api/owner/lots/{id}

# Owner - Bookings
GET    /api/owner/bookings
GET    /api/owner/bookings/{id}
PUT    /api/owner/bookings/{id}/status
GET    /api/owner/dashboard/metrics

# Supplier - Profile
GET    /api/supplier/profile
PUT    /api/supplier/profile

# Supplier - Offers
GET    /api/supplier/offers
POST   /api/supplier/offers
GET    /api/supplier/offers/{id}
PUT    /api/supplier/offers/{id}
DELETE /api/supplier/offers/{id}

# Supplier - Claims & Redemption
GET    /api/supplier/claims
GET    /api/supplier/claims/{id}
POST   /api/supplier/redeem/{claimId}
GET    /api/supplier/dashboard/metrics

# Guest/Public - Campsites
GET    /api/campsites
GET    /api/campsites/{id}
GET    /api/campsites/{id}/lots
GET    /api/campsites/{id}/lots/{lotId}

# Guest - Bookings
POST   /api/bookings
GET    /api/user/bookings
GET    /api/user/bookings/{id}

# Guest - Marketplace
GET    /api/marketplace/offers
GET    /api/marketplace/offers/{id}
POST   /api/marketplace/offers/{id}/claim
GET    /api/user/vouchers
GET    /api/user/vouchers/{id}

# File Upload
POST   /api/upload/image
```

---

## 🛠️ Infrastructure Requirements

### Local Development
- PostgreSQL 17 (via Docker)
- LocalStack for S3 emulation
- Kafka (existing)

### Production (Future)
- AWS S3 for image storage
- Stripe + Stripe Connect for payments
- Email service (AWS SES or similar)

---

## Next Steps

1. ~~Review and answer the NEEDS INPUT items~~ ✅ Complete
2. Create Flyway migrations for any missing tables
3. Add S3/LocalStack configuration to docker-compose
4. Implement API endpoints (start with Auth → Owner → Supplier → Guest)
5. Connect frontend services to real API
6. Generate realistic seed data for broader Ireland
