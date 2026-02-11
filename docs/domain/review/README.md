# Review

## Status
Implemented

## Overview
Guest feedback system for campsites and suppliers. Guests can submit reviews after completing a booking or redeeming an offer. Owners and suppliers can respond to reviews.

## Key Entities

- **Review** — Guest review of a campsite/owner. Linked to a completed booking. Includes overall rating (1-5), category ratings (cleanliness, location, value, facilities), text comment, and optional owner response.
- **SupplierReview** — Guest review of a supplier/offer. Similar structure to campsite reviews.

## Business Rules

1. Reviews can only be submitted for bookings with `status = COMPLETED`
2. One review per booking (unique constraint)
3. Rating range: 1-5 for overall and each category
4. Reviews cannot be edited after an owner/supplier responds

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/reviews` | Submit a campsite review |
| GET | `/api/reviews/campsite/{campsiteId}` | Get reviews for a campsite |
| GET | `/api/reviews/eligibility/{bookingId}` | Check review eligibility |
| POST | `/api/reviews/{id}/respond` | Owner response to review |
| POST | `/api/reviews/supplier` | Submit a supplier review |
| GET | `/api/reviews/supplier/{supplierId}` | Get reviews for a supplier |

## Frontend Pages

- **ReviewsSection** — Displays reviews on campsite detail page
- **SupplierReviewsSection** — Displays reviews on supplier detail page
- **OwnerReviewsPage** — Owner views and responds to reviews
- **SupplierReviewsPage** — Supplier views and responds to reviews
