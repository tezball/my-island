# Seed Data

## Test Accounts

All passwords are `password`.

| Email | Role | Description |
|-------|------|-------------|
| `norevalley@myisland.com` | Owner | Nore Valley Park — full campsite with lots, bookings, images |
| `farmshop@greenacres.ie` | Supplier | Green Acres Farm Shop — offers, claims, subscription |
| `family@example.com` | Guest | Family account with booking history and claimed offers |
| `testguest@example.com` | Guest | Clean account with no bookings (for fresh testing) |

## Seed Data Inventory

Loaded via Flyway migrations. Key volumes:

| Entity | Approximate Count | Migration |
|--------|-------------------|-----------|
| Users | 40+ | V999, V1004-V1005 |
| Owners/Campsites | 5+ | V999 |
| Lots | 70+ | V999 |
| Bookings | 75+ | V999, V1043 |
| Suppliers | 17+ | V999 |
| Offers | 35+ | V999 |
| Reviews | seeded | V1018-V1019 |
| Points of Interest | seeded | V1032-V1036 |
| Staff Members | seeded | V1039-V1042 |

## Migration Ranges

| Range | Purpose |
|-------|---------|
| V001-V007 | Core schema (users, owners, lots, bookings, suppliers, offers, claims) |
| V999 | Primary seed data |
| V1000-V1010 | Subscriptions, images, featured, Connect |
| V1011-V1017 | Payments, email verification, pricing, manual bookings |
| V1018-V1019 | Reviews |
| V1020 | Notifications |
| V1021-V1030 | Cleanup, constraints, supplier coordinates, supplier reviews |
| V1031 | ShedLock (distributed scheduling) |
| V1032-V1036 | Discovery / POIs |
| V1037-V1038 | Property types, trial subscriptions |
| V1039-V1042 | Staff members and roles |
| V1043-V1044 | Pending bookings seed, guest cleanup |

## Notes
- Seed bookings (V1043) are created as `CONFIRMED`/`CAPTURED` with no `stripe_payment_intent_id` to avoid requiring Stripe in dev.
- Nore Valley has `instantBooking=true` by default.
- Owner and supplier test accounts have active subscriptions seeded (V1008-V1009).
