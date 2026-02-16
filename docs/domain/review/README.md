# Review

## Status
Implemented (with AI moderation pipeline)

## Overview
Guest feedback system for campsites and suppliers. Guests can submit reviews after completing a booking or redeeming an offer. Owners and suppliers can respond to reviews.

When the `REVIEW_AI_MODERATION` feature toggle is enabled, new reviews enter a `PENDING` state and are processed by a scheduled AI moderation pipeline before becoming publicly visible. When the toggle is disabled, reviews are immediately `APPROVED` (current default behavior).

## Key Entities

- **Review** — Guest review of a campsite/owner. Linked to a completed booking. Includes rating (1-5), text comment, optional owner response, and moderation status.
- **SupplierReview** — Guest review of a supplier/offer. Similar structure to campsite reviews but linked to an offer claim.
- **Review.ModerationStatus** — Enum: `PENDING`, `APPROVED`, `REJECTED`. Shared by both Review and SupplierReview.

## Moderation Pipeline

### Architecture
- **ReviewModerationService** — Calls Ollama (llama3.2) via Spring AI ChatClient to classify reviews as APPROVED or REJECTED
- **ReviewModerationScheduler** — Runs every 5 minutes (ShedLock), processes all PENDING reviews through the AI service
- **OllamaConfig** — Conditional bean: only created when `spring.ai.ollama.enabled=true`. Connects to Ollama at `spring.ai.ollama.base-url` (default: `http://localhost:11434`)
- **Graceful degradation** — If Ollama is unavailable or ChatClient bean not created, reviews are auto-approved with a logged warning
- **Feature toggle** — `REVIEW_AI_MODERATION` (default: disabled in prod, enabled in dev seed data). When off, all new reviews skip moderation and go straight to APPROVED

### Infrastructure
- **Ollama** — Runs as a Docker service (`ollama/ollama`) on port 11434 with a persistent volume for model storage
- **Model pull** — A one-shot `ollama-pull` sidecar pulls `llama3.2` (~2GB) on first start; subsequent starts are instant
- **Docker env vars**: `OLLAMA_ENABLED=true`, `OLLAMA_BASE_URL=http://ollama:11434` (mapped in application.yml to Spring AI properties)

### Flow
1. Guest submits review
2. If `REVIEW_AI_MODERATION` enabled → status = `PENDING`, rating not yet counted
3. Scheduler picks up PENDING reviews every 5 minutes
4. AI checks for: spam, offensive language, irrelevant content, fake reviews
5. Review transitions to `APPROVED` or `REJECTED`
6. If APPROVED → owner/supplier rating recalculated
7. Admin can manually approve/reject any review at any time

### Rating Calculation
- Only `APPROVED` reviews are counted in average rating and review count
- Rating is recalculated when a review is approved (by AI or admin)

## Business Rules

1. Reviews can only be submitted for bookings with `status = COMPLETED` or `CHECKED_IN`
2. Supplier reviews require offer claim with `status = REDEEMED`
3. One review per booking/claim (unique constraint)
4. Rating range: 1-5
5. Reviews cannot be edited after an owner/supplier responds
6. Public-facing queries only return APPROVED reviews
7. Owner/supplier dashboards show all reviews (with moderation status badges)
8. Admin can manually approve, reject, flag, or delete any review

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/reviews` | Submit a campsite review |
| GET | `/api/reviews/campsite/{ownerId}` | Get approved reviews for a campsite |
| GET | `/api/reviews/eligibility/{ownerId}` | Check review eligibility |
| POST | `/api/reviews/{id}/respond` | Owner response to review |
| POST | `/api/reviews/supplier` | Submit a supplier review |
| GET | `/api/reviews/supplier/{supplierId}` | Get approved reviews for a supplier |
| GET | `/api/admin/reviews` | Admin: list all reviews (with moderation status) |
| PUT | `/api/admin/reviews/{type}/{id}/flag` | Admin: toggle flag on review |
| PUT | `/api/admin/reviews/{type}/{id}/moderate` | Admin: manually approve/reject review |
| POST | `/api/admin/reviews/{type}/{id}/ai-moderate` | Admin: rerun AI moderation on a review |
| DELETE | `/api/admin/reviews/{type}/{id}` | Admin: delete review |

## Frontend Pages

- **ReviewsSection** — Displays approved reviews on campsite detail page (no changes needed, API filters)
- **SupplierReviewsSection** — Displays approved reviews on supplier detail page
- **OwnerReviewsPage** — Owner views all reviews with moderation status badges (PENDING=yellow, REJECTED=red)
- **SupplierReviewsPage** — Supplier views all reviews with moderation status badges
- **AdminReviewsPage** — Admin view with moderation status column, approve/reject/flag/delete actions

## Database

- `V1063__add_review_moderation_status.sql` — Adds `moderation_status`, `moderation_reason`, `moderated_at` to both `reviews` and `supplier_reviews` tables
- `V1064__add_review_moderation_toggle.sql` — Inserts `REVIEW_AI_MODERATION` feature toggle (default: disabled)
- `V1100__reset_reviews_for_moderation.sql` (seed only) — Resets all reviews to PENDING, zeros ratings, enables `REVIEW_AI_MODERATION` toggle for dev E2E testing
