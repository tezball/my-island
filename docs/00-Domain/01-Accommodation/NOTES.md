# Accommodation Context Notes

## Purpose
Manage campsite inventory, lots, and availability.

## Aggregates

### Campsite Aggregate (Root)
```
Campsite (Root)
├── Location (Value Object)
├── Lot[] (Entity)
│   └── LotType (Enum)
├── Extra[] (Entity)
├── Facility[] (Enum)
├── CheckInInstructions (Entity)
└── Review[] (Entity, weak reference)
```

#### Entities

**Campsite**
- `id`: UUID
- `name`: String
- `description`: String
- `location`: Location (Address, Lat, Lng)
- `images`: String[]
- `rating`: Decimal (1.00 - 5.00)
- `reviewCount`: Integer
- `pricePerNight`: Decimal
- `facilities`: Facility[]
- `ownerId`: UUID
- `featured`: Boolean
- `active`: Boolean

**Lot**
- `id`: UUID
- `campsiteId`: UUID
- `name`: String
- `type`: LotType
- `capacity`: Integer
- `pricePerNight`: Decimal
- `images`: String[]
- `amenities`: String[]
- `available`: Boolean

**Extra**
- `id`: UUID
- `campsiteId`: UUID
- `name`: String
- `description`: String
- `price`: Decimal
- `perNight`: Boolean
- `available`: Boolean

## Enums

### LotType
- TENT, TOURING, GLAMPING, CABIN, MOBILE_HOME

### Facility
- WIFI, ELECTRIC, WATER, TOILET, SHOWER
- LAUNDRY, SHOP, RESTAURANT
- PLAYGROUND, BEACH, FISHING, HIKING, CYCLING, PETS

## Business Rules

### Campsite Rules
1. **Owner Relationship**: Every campsite must have exactly one owner
2. **Active Lots Required**: A campsite needs at least one active lot to be bookable
3. **Rating Calculation**: `rating = average(reviews[].rating)`, updated on new review

## Invariants
- `rating` must equal the average of all associated review ratings
- `reviewCount` must equal the count of associated reviews
- `lots` cannot be empty for an active campsite
