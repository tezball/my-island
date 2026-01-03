# Reviews Flow

The reviews flow allows users to submit reviews after their stay and browse reviews from other guests.

## Screens

| # | Screen | File | Description |
|---|--------|------|-------------|
| 1 | Submit Review | `01-submit-review.png` | Review & rating form |

## User Stories

### US-REV-001: Submit Star Rating
**As a** user who completed a stay
**I want to** rate the campsite with stars
**So that** others can quickly see my overall opinion

**Acceptance Criteria:**
- 5-star rating system
- Tap or drag to select rating
- Visual feedback (filled stars)
- Rating is required to submit
- Can change before submitting
- Star labels: Poor, Fair, Good, Very Good, Excellent

---

### US-REV-002: Write Review Text
**As a** user
**I want to** write about my experience
**So that** I can share details beyond a star rating

**Acceptance Criteria:**
- Text area for review content
- Character limit shown (e.g., 1000 chars)
- Minimum length encouraged but not required
- Placeholder with writing prompts
- Can be left empty

---

### US-REV-003: Rate Specific Aspects
**As a** user
**I want to** rate specific categories
**So that** my feedback is more detailed

**Acceptance Criteria:**
- Category ratings: Cleanliness, Location, Check-in, Value
- Each category has 5-star rating
- All categories optional
- Helps campsites identify strengths/weaknesses

---

### US-REV-004: Add Review Photos
**As a** user
**I want to** upload photos with my review
**So that** others can see what the place looks like

**Acceptance Criteria:**
- "Add Photos" option
- Select from gallery or take new photo
- Multiple photos allowed (up to 5)
- Preview before submission
- Remove individual photos
- Photos are optional

---

### US-REV-005: Submit Review
**As a** user
**I want to** submit my completed review
**So that** it's published for others to see

**Acceptance Criteria:**
- Submit button enabled when minimum requirements met
- Loading state during submission
- Success confirmation shown
- Review appears on campsite detail
- Cannot edit after submission (or limited window)
- One review per booking only

---

### US-REV-006: View Campsite Reviews
**As a** user
**I want to** read reviews from other guests
**So that** I can make informed booking decisions

**Acceptance Criteria:**
- Reviews section on campsite detail
- Overall rating and review count displayed
- Individual reviews show: author, date, rating, text
- Photos shown if included
- Most recent or most helpful first
- "See All Reviews" for full list

---

### US-REV-007: View All Reviews
**As a** user
**I want to** see all reviews for a campsite
**So that** I can read more opinions

**Acceptance Criteria:**
- Full reviews list page
- Filter by rating (5 star, 4 star, etc.)
- Sort options (newest, highest, lowest)
- Pagination or infinite scroll
- Back navigation to detail page

---

### US-REV-008: Mark Review as Helpful
**As a** user
**I want to** mark helpful reviews
**So that** useful reviews get more visibility

**Acceptance Criteria:**
- "Helpful" button on each review
- Shows count of helpful votes
- Can only vote once per review
- Login required to vote

---

### US-REV-009: Report Inappropriate Review
**As a** user
**I want to** report problematic reviews
**So that** the platform stays trustworthy

**Acceptance Criteria:**
- Report option on each review
- Reason selection required
- Optional additional details
- Submitted to moderation queue
- Confirmation shown

---

## Flow Diagram

```
┌─────────────────────────────────┐
│      After Completed Stay       │
│     (From My Bookings)          │
└──────────────┬──────────────────┘
               │ "Leave Review"
               ▼
┌─────────────────────────────────┐
│        Submit Review            │
│                                 │
│  Overall Rating: ★ ★ ★ ★ ☆     │
│                                 │
│  Categories:                    │
│  Cleanliness:  ★ ★ ★ ★ ★       │
│  Location:     ★ ★ ★ ★ ☆       │
│  Check-in:     ★ ★ ★ ★ ★       │
│  Value:        ★ ★ ★ ☆ ☆       │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Write your review...     │   │
│  │                          │   │
│  └─────────────────────────┘   │
│                                 │
│  [+ Add Photos]                 │
│                                 │
│  [Submit Review]                │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│      Review Submitted           │
│                                 │
│   Thank you for your review!    │
│                                 │
│   [Back to Bookings]            │
└─────────────────────────────────┘


┌─────────────────────────────────┐
│     Campsite Detail Page        │
│                                 │
│  Reviews (4.8 ★) - 124 reviews  │
│  ┌─────────────────────────┐   │
│  │ Review 1                 │   │
│  │ ★★★★★ - 2 days ago      │   │
│  │ "Great experience..."    │   │
│  │ [Helpful (5)]            │   │
│  └─────────────────────────┘   │
│                                 │
│  [See All Reviews]              │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│       All Reviews               │
│                                 │
│  Filter: [All] [5★] [4★] ...   │
│  Sort: [Newest] [Helpful]       │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Review details...        │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

## Related Pages

- `src/pages/ReviewSubmissionPage.tsx`
- `src/pages/ReviewsListPage.tsx`
- `src/pages/ReviewDetailPage.tsx`
- `src/pages/CampsiteDetailPage.tsx`
- `src/components/ui/StarRating.tsx`
- `src/components/ui/Rating.tsx`

## Notes

- Reviews should be moderated before publication (or flagged content)
- Consider incentivizing reviews (points, badges)
- Response from host feature (owner can reply)
- Reviews impact campsite search ranking
- Fake review detection needed
