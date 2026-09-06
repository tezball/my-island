# Supplier Portal — MVP Review Issues

Analysis from browser testing both subscribed (`farmshop@greenacres.ie`) and non-subscribed (`hello@dinglekayak.ie`) supplier accounts.

## Critical

### 1. No supplier subscription paywall
- **Status**: Fixed
- **Location**: `SupplierDashboardPage.tsx`, `SupplierLayout.tsx`
- **Problem**: Owner portal had subscription banner but supplier portal gave full access without subscription.
- **Fix**: Added subscription awareness to dashboard (locks "Create Offer" quick action for non-subscribers, shows "Subscribe" CTA instead). `SubscriptionBanner` was already in layout. Also fixed broken `/offers` link → `/marketplace` in dashboard and sidebar.

### 2. Non-sub account shows "Active" subscription
- **Status**: Not a code bug (stale DB data)
- **Location**: Seed data in `V1008`
- **Problem**: Dingle Kayak showed "Active" subscription during browser testing.
- **Root cause**: Stale database — seed data correctly does NOT give Dingle Kayak a subscription. Entity defaults to `NONE`. Fresh DB will show correctly.

### 3. Category mapping broken (7+ missing values)
- **Status**: Fixed
- **Location**: `supplierService.ts` CATEGORY_MAP
- **Problem**: Frontend only mapped 4 of 11 backend `SupplierCategory` values. Unmapped categories defaulted to FOOD.
- **Fix**: Mapped all 11 backend categories: FARM_SHOP/RESTAURANT/CAFE/PUB/GROCERY→FOOD, ACTIVITY_PROVIDER/TOUR_OPERATOR→ACTIVITIES, EQUIPMENT_RENTAL/ARTISAN→GEAR, SPA→ATTRACTIONS, OTHER→FOOD.

## High

### 4. Offer claim count mismatch on Offer Detail
- **Status**: Fixed
- **Location**: `SupplierOfferDetailPage.tsx` line 199
- **Problem**: Stats used `offer.claimCount` from one API, while claims list came from a different endpoint, causing mismatches.
- **Fix**: Changed to `claims.length` so stats and list always agree.

### 5. Dashboard stat badges mismatch
- **Status**: Fixed
- **Location**: `supplierService.ts` getDashboardStats
- **Problem**: `thisMonthClaims` was incorrectly mapped to `api.pendingClaims`.
- **Fix**: Now computed client-side by filtering `recentClaims` for current month/year.

### 6. Non-sub supplier offers invisible on marketplace
- **Status**: Fixed
- **Location**: New migration `V1024__refresh_offer_dates.sql`, `SupplierOfferDetailPage.tsx`
- **Problem**: Seed offers with `CURRENT_DATE + 6 months` expired if migration ran >6 months ago. No indicator when offers aren't visible.
- **Fix**: Added migration to refresh expired offer dates. Added "Not visible on marketplace" banner on offer detail for expired/inactive offers.

## Medium

### 7. Contact email always empty
- **Status**: Fixed
- **Location**: Backend `SupplierDto.java`, `supplierService.ts`
- **Problem**: Backend DTO had no email field.
- **Fix**: Added `contactEmail` field to `SupplierDto` (from `supplier.getUser().getEmail()`), added to `SupplierApiResponse`, mapped in `transformSupplier()`.

### 8. Payout Settings copy wrong
- **Status**: Fixed
- **Location**: `ConnectOnboarding.tsx`
- **Problem**: Said "receive payments from bookings" for suppliers.
- **Fix**: Now shows "receive payments from offer redemptions" for suppliers, "from bookings" for owners.

### 9. Create Offer category defaults to wrong value
- **Status**: Fixed
- **Location**: `OfferFormModal.tsx`, `SupplierOffersPage.tsx`
- **Problem**: Category always defaulted to "Food & Drink" regardless of supplier's business category.
- **Fix**: Added `defaultCategory` prop to `OfferFormModal`. `SupplierOffersPage` now loads supplier profile and passes `supplier.category` as default.

### 10. Date display missing year
- **Status**: Fixed
- **Location**: `SupplierOfferDetailPage.tsx`, `SupplierDashboardPage.tsx`, `SupplierOffersPage.tsx`
- **Problem**: `formatDateShort` used `{ day, month }` without year. Dates showed "9 Feb - 8 Feb".
- **Fix**: Added `year: 'numeric'` to all `formatDateShort` calls across supplier pages.

### 11. Marketplace hardcodes all suppliers as "Food" category
- **Status**: Fixed
- **Location**: Backend `OfferDto.java`, `supplierService.ts`
- **Problem**: `getAllActiveOffers()` hardcoded `category: 'FOOD'` for every supplier. Backend didn't return supplier category.
- **Fix**: Added `supplierCategory` field to `OfferDto` (from `offer.getSupplier().getCategory().name()`). Frontend now uses `CATEGORY_MAP[o.supplierCategory]` instead of hardcoded value.

## Low

### 12. Header shows static title + broken nav link
- **Status**: Fixed
- **Location**: `SupplierLayout.tsx`
- **Problem**: Header showed "Supplier Portal" on every page. Sidebar "View All Offers" linked to `/offers` (404).
- **Fix**: Added dynamic page titles based on route (Dashboard, My Offers, etc.). Fixed link to `/marketplace`.

## Files Changed

### Frontend
- `my-island-web/src/services/supplierService.ts` — CATEGORY_MAP (all 11 values), SupplierApiResponse (contactEmail), OfferApiResponse (supplierCategory), getDashboardStats (thisMonthClaims), getAllActiveOffers (supplier category)
- `my-island-web/src/pages/supplier/SupplierOfferDetailPage.tsx` — claim count fix, date year, marketplace visibility banner
- `my-island-web/src/pages/supplier/SupplierDashboardPage.tsx` — subscription gating, date year, /marketplace link
- `my-island-web/src/pages/supplier/SupplierOffersPage.tsx` — supplier profile load, defaultCategory prop, date year
- `my-island-web/src/components/supplier/SupplierLayout.tsx` — dynamic page titles, /marketplace link
- `my-island-web/src/components/supplier/offers/OfferFormModal.tsx` — defaultCategory prop
- `my-island-web/src/components/owner/ConnectOnboarding.tsx` — supplier-specific payout copy

### Backend
- `my-island-api/.../marketplace/dto/OfferDto.java` — added supplierCategory field
- `my-island-api/.../marketplace/dto/SupplierDto.java` — added contactEmail field
- `my-island-api/.../db/migration/V1024__refresh_offer_dates.sql` — refresh expired seed dates
