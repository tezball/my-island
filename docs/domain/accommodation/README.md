# Accommodation

## Status
Implemented

## Overview
Manages campsite profiles, bookable lots (pitches/units), amenities, seasonal pricing, and availability. Each campsite is owned by an Owner and contains one or more Lots that guests can book.

## Key Entities

- **Owner** — Campsite owner profile linked to a User. Holds campsite name, description, location, contact info, subscription status, and Stripe Connect details.
- **Lot** — A bookable accommodation unit (tent pitch, touring pitch, glamping pod, cabin, or mobile home). Has capacity, price per night, minimum stay, amenities, and images.
- **Amenity** — Facility/amenity definitions (WiFi, electric, shower, etc.) linked to lots via many-to-many.
- **LotBlockedPeriod** — Date ranges manually blocked by the owner for unavailability.
- **SeasonalPricingRule** — Override pricing for specific date ranges (e.g., peak summer rates). Can optionally override the lot's minimum stay for the season.
- **SavedLot** — A guest's saved/favorite lot. Persisted to the database for authenticated users; falls back to localStorage for anonymous users. On login, localStorage favorites are merged into the backend via bulk save, then localStorage is cleared.

## Enums

### LotType
`TENT` | `TOURING` | `GLAMPING` | `CABIN` | `MOBILE_HOME`

Note: Backend uses uppercase, frontend uses lowercase with dashes (e.g., `mobile-home`).

### Facility
`WIFI` | `ELECTRIC` | `WATER` | `TOILET` | `SHOWER` | `LAUNDRY` | `SHOP` | `RESTAURANT` | `PLAYGROUND` | `BEACH` | `FISHING` | `HIKING` | `CYCLING` | `PETS`

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/campsites` | Browse/search campsites (public) |
| GET | `/api/campsites/{id}` | Get campsite details (public) |
| GET | `/api/owner/profile` | Get owner profile |
| PUT | `/api/owner/profile` | Update owner profile |
| GET | `/api/owner/lots` | List owner's lots |
| POST | `/api/owner/lots` | Create lot |
| PUT | `/api/owner/lots/{id}` | Update lot |
| DELETE | `/api/owner/lots/{id}` | Delete lot |
| GET | `/api/owner/lots/{id}/blocked-periods` | Get blocked date ranges |
| POST | `/api/owner/lots/{id}/blocked-periods` | Block dates |
| DELETE | `/api/owner/blocked-periods/{id}` | Unblock dates |
| GET | `/api/owner/pricing-rules` | Get seasonal pricing rules |
| POST | `/api/owner/pricing-rules` | Create pricing rule (supports optional minStay override) |
| DELETE | `/api/owner/pricing-rules/{id}` | Delete pricing rule |
| GET | `/api/owner/analytics` | Dashboard analytics |
| GET | `/api/saved` | Get saved lot IDs for current user |
| POST | `/api/saved/{lotId}` | Save a lot as favorite |
| DELETE | `/api/saved/{lotId}` | Unsave a lot |
| GET | `/api/saved/check/{lotId}` | Check if a lot is saved |
| POST | `/api/saved/bulk` | Bulk save lot IDs (merge localStorage on login) |

## Frontend Pages

- **ExplorePage** — Map-based campsite browser with filters
- **SearchResultsPage** — Search results listing
- **CampsiteDetailsPage** — Single campsite with gallery, lots, reviews, booking
- **OwnerDashboardPage** — Owner analytics dashboard
- **OwnerPropertyPage** — Edit campsite profile
- **OwnerLotsPage** — Manage lots (CRUD, images, amenities)
- **OwnerPricingPage** — Seasonal pricing rules
- **OwnerCalendarPage** — Availability calendar with blocked dates

## Implementation Notes
- Images are stored via `ImageUploadController` at `/api/images/LOT/{lotId}` — multi-image support with primary image selection.
- Campsite search uses the `CampsiteService` with location and filter parameters.
- Owner analytics include occupancy rates, revenue, and booking counts.
- Featured listings are time-limited promotions purchased via Stripe (`FeaturedPromotionService`).
- Lots have a `minStay` field (default 1) set via the lot create/update endpoints. SeasonalPricingRules can optionally override the minimum stay for their date range. The effective minimum stay is resolved by `PricingService` at booking time.
- Saved/favorites use dual-mode persistence: authenticated users save to the `saved_lots` table via the API; anonymous users save to localStorage. On login, `SavedContext` merges any localStorage favorites into the backend via the bulk endpoint, then clears localStorage. Toggle operations use optimistic UI updates with rollback on failure.
