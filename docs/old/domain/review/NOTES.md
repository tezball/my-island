# Review Context Notes

## Purpose
Guest feedback and ratings system.

## Aggregates

### Review Aggregate (Root)
```
Review (Root)
└── ReviewCategories (Value Object)
```

#### Entities

**Review**
- `id`: UUID
- `userId`: UUID
- `campsiteId`: UUID
- `bookingId`: UUID
- `rating`: Integer (1-5)
- `comment`: String
- `categories`: ReviewCategories
- `helpfulCount`: Integer
- `ownerResponse`: String
- `createdAt`: Timestamp

## Value Objects

### ReviewCategories
- `cleanliness`: Integer (1-5)
- `location`: Integer (1-5)
- `value`: Integer (1-5)
- `facilities`: Integer (1-5)

## Business Rules

### Review Rules
1. **Rating Range**: Overall rating must be 1-5
2. **Category Ratings**: Each category must be 1-5
3. **Immutable After Owner Response**: Reviews cannot be edited after owner responds
4. **One Review Per Booking**: A booking can have at most one associated review
5. **Review Eligibility**: Reviews can only be submitted when `booking.status = COMPLETED`

## Invariants
- `bookingId` must reference a booking with `status = COMPLETED`
- One review per booking (unique constraint)
