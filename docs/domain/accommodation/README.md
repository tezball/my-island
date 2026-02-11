# Accommodation

## Status
Implemented

## Overview
Manages campsite profiles, bookable lots (pitches/units), amenities, seasonal pricing, and availability. Each campsite is owned by an Owner and contains one or more Lots that guests can book.

## Key Entities

- **Owner** — Campsite owner profile linked to a User. Holds campsite name, description, location, contact info, subscription status, and Stripe Connect details.
- **Lot** — A bookable accommodation unit (tent pitch, touring pitch, glamping pod, cabin, or mobile home). Has capacity, price per night, amenities, and images.
- **Amenity** — Facility/amenity definitions (WiFi, electric, shower, etc.) linked to lots via many-to-many.
- **LotBlockedPeriod** — Date ranges manually blocked by the owner for unavailability.
- **SeasonalPricingRule** — Override pricing for specific date ranges (e.g., peak summer rates).

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
| POST | `/api/owner/pricing-rules` | Create pricing rule |
| DELETE | `/api/owner/pricing-rules/{id}` | Delete pricing rule |
| GET | `/api/owner/analytics` | Dashboard analytics |

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
