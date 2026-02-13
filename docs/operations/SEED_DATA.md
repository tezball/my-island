# Seed Data

## Environment Gating

Seed data is **only loaded in the `dev` Spring profile**. In production, the database starts empty.

- **Schema migrations**: `db/migration/` — always applied (schema DDL only, no test data)
- **Seed data**: `db/seed/` — applied only when `spring.profiles.active=dev`

The Flyway configuration in `application.yml` sets `locations: classpath:db/migration,classpath:db/seed` under the `dev` profile section. The default (production) locations remain `classpath:db/migration` only.

### Resetting Dev Database

After any changes to seed files, wipe and recreate:
```bash
docker compose down -v && docker compose up -d
```

### Frontend Test User Dropdown

The sign-in page test user dropdown is gated by the `VITE_SHOW_TEST_USERS` environment variable:
- `.env.development` sets `VITE_SHOW_TEST_USERS=true` (dropdown visible)
- `.env.production` sets `VITE_SHOW_TEST_USERS=false` (dropdown hidden)

## Test Accounts

All test accounts are created by seed migrations and only exist in dev environments.

| Email | Role | Description |
|-------|------|-------------|
| `norevalley@myisland.com` | Owner | Nore Valley Park — full campsite with lots, bookings, images |
| `hello@burrenglampingvillage.ie` | Owner | Burren Glamping Village |
| `farmshop@greenacres.ie` | Supplier | Green Acres Farm Shop — offers, claims, subscription |
| `info@aillweefarmshop.ie` | Supplier | Aillwee Farm Shop & Cheese |
| `bookings@loughdergcamping.ie` | Owner | Lough Derg Lakeside (no subscription) |
| `hello@dinglekayak.ie` | Supplier | Dingle Kayak Adventures (no subscription) |
| `staff@norevalley.com` | Owner Staff | Manager at Nore Valley |
| `tezball86@gmail.com` | Admin | Platform admin (superuser) |
| `family@example.com` | Guest | Murphy Family (has bookings) |
| `testguest@example.com` | Guest | Clean account, no bookings |

See `CLAUDE.md` for full account list with passwords.

## Seed Data Inventory

| Entity | Approximate Count | Source Files |
|--------|-------------------|-------------|
| Users | 40+ | V999, V1008, V1009, V1040, V1044, V1046_1 |
| Owners/Campsites | 5+ | V999, V1005 |
| Lots | 70+ | V999, V1059 |
| Bookings | 75+ | V999, V1004, V1043, V1059 |
| Suppliers | 17+ | V999 |
| Offers | 35+ | V999, V1047 |
| Reviews | seeded | V1019, V1030 |
| Points of Interest | seeded | V1034, V1036 |
| Staff Members | seeded | V1040, V1042 |

## Migration vs Seed Split

| Directory | Purpose | Example Files |
|-----------|---------|---------------|
| `db/migration/` | Schema DDL, ALTER TABLE, CREATE TABLE | V001-V007, V1003, V1010, V1046 |
| `db/seed/` | Test data INSERTs, UPDATEs to seed data | V999, V1004, V1005, V1008, V1009, ... |

### V1046 Split

`V1046__add_platform_admin.sql` was split:
- **`db/migration/V1046__add_platform_admin.sql`**: `ALTER TABLE users ADD COLUMN is_admin` (schema change, always applied)
- **`db/seed/V1046_1__seed_platform_admin.sql`**: `INSERT INTO users` for the admin test account (dev only)

## Notes
- Seed bookings (V1043) are created as `CONFIRMED`/`CAPTURED` with no `stripe_payment_intent_id` to avoid requiring Stripe in dev.
- Nore Valley has `instantBooking=true` by default.
- Owner and supplier test accounts have active subscriptions seeded (V1008-V1009).
