# Booking Context Notes

## Purpose
Handle the reservation lifecycle from search to completion.

## Aggregates

### Booking Aggregate (Root)
```
Booking (Root)
├── BookingExtra[] (Entity)
├── Message[] (Entity, cross-aggregate reference)
└── Payment (Value Object, implicit)
```

#### Entities

**Booking**
- `id`: UUID
- `userId`: UUID
- `lotId`: UUID
- `checkIn`: Date
- `checkOut`: Date
- `guests`: Integer
- `status`: BookingStatus
- `lotPrice`: Decimal
- `extrasPrice`: Decimal
- `serviceFee`: Decimal
- `totalPrice`: Decimal
- `specialRequests`: String
- `cancellationReason`: String
- `createdAt`: Timestamp

**BookingExtra**
- `id`: UUID
- `bookingId`: UUID
- `extraId`: UUID
- `quantity`: Integer
- `unitPrice`: Decimal (Snapshot at booking time)
- `totalPrice`: Decimal

## Enums

### BookingStatus
- `PENDING`: Awaiting payment
- `CONFIRMED`: Payment received
- `CHECKED_IN`: Guest arrived
- `COMPLETED`: Stay finished
- `CANCELLED`: Cancelled by guest/owner

### PaymentType
- CARD, APPLE_PAY, GOOGLE_PAY

## Business Rules

### Booking Rules
1. **Date Validation**: `checkOut` must be after `checkIn`
2. **Guest Capacity**: `guests` cannot exceed `lot.capacity`
3. **Availability Check**: All dates in range must have `AvailabilityStatus.AVAILABLE`
4. **Cancellation Window**: Defined by campsite policy
5. **Price Locking**: Extra prices are captured at booking time (`unitPrice`)

## Invariants
- `totalPrice = lotPrice + extrasPrice + serviceFee`
- `extrasPrice = sum(bookingExtras[].totalPrice)`
- Status transitions must follow the state machine

## Domain Events
- `BookingCreated`: New booking submitted
- `BookingConfirmed`: Payment successful
- `BookingCancelled`: Guest/owner cancels
- `GuestCheckedIn`: Check-in recorded
- `BookingCompleted`: Check-out recorded
