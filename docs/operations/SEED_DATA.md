# Seed Data

## Environment Gating

Seed data is **only loaded in the `dev` Spring profile**. In production, the database starts empty.

- **Schema migrations**: `db/migration/` — always applied (schema DDL only, no test data)
- **Seed data**: `db/seed/` — applied only when `spring.profiles.active=dev`

The Flyway configuration in `application.yml` sets `locations: classpath:db/migration,classpath:db/seed` under the `dev` profile section. The default (production) locations remain `classpath:db/migration` only.

### Local prod-like instance

`./start.sh` (or `./start.sh --fast`) always does `docker compose down -v` and starts the API with the `dev` profile, so Flyway re-applies schema **and** the full Ireland catalogue automatically.

```bash
./start.sh --fast    # fastest way to browse the island-wide mock marketplace
./start.sh           # also starts Ollama, Grafana, Prometheus, Stripe CLI
./start.sh --prod    # schema only, no seed
```

After boot, open http://localhost:5173 and http://localhost:5173/explore. The script prints campsite / county / booking counts once the API is up.

### Resetting Dev Database

After any changes to seed files, wipe and recreate:
```bash
./start.sh --fast
# or
docker compose down -v && docker compose up -d
```

To regenerate the Ireland catalogue SQL after editing `scripts/generate_ireland_e2e_seed.py`:
```bash
python3 scripts/generate_ireland_e2e_seed.py
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

Catalogue-only owner/supplier/guest accounts added by V1102 (not in the sign-in dropdown) use password `password`.

## Ireland e2e catalogue (V1102)

V1102 builds a production-like island-wide dataset on top of V999–V1101:

- **All 32 counties** of Ireland (Republic + Northern Ireland) have at least one campsite
- New mock sites inspired by popular real destinations (Dublin/Corkagh, Howth, Curragh/Athy, Blackstairs, Lough Ramor, Lough Key, Slieve Gullion, Sperrins, Magilligan/Benone, Portrush, Cong, and others) — original brand names, real coordinates
- Longer copy, unique lot names, Unsplash photos, amenities, featured listings, peak-season pricing
- Completed stays + approved reviews, plus upcoming confirmed bookings on featured sites
- Extra suppliers and “campsite guest rate” offers in the newly covered counties
- `BOOKING_ENABLED` is turned **on** in this seed so local booking flows work end-to-end
- Every owner/supplier is subscribed except the two gate-test accounts (Lough Derg Lakeside / Dingle Kayak)

## Seed Data Inventory

| Entity | Approximate Count | Source Files |
|--------|-------------------|-------------|
| Users | 80+ | V999, V1008, V1009, V1040, V1044, V1046_1, V1102 |
| Owners/Campsites | 80+ across 32 counties | V999, V1005, V1008, V1102 |
| Lots | 250+ | V999, V1005, V1059, V1102 |
| Bookings | 130+ | V999, V1004, V1043, V1059, V1102 |
| Suppliers | 30+ | V999, V1008, V1009, V1036, V1102 |
| Offers | 45+ | V999, V1047, V1102 |
| Reviews | 50+ | V1019, V1030, V1102 |
| Points of Interest | seeded | V1034, V1036 |
| Staff Members | seeded | V1040, V1042 |

## Migration vs Seed Split

| Directory | Purpose | Example Files |
|-----------|---------|---------------|
| `db/migration/` | Schema DDL, ALTER TABLE, CREATE TABLE | V001-V007, V1003, V1010, V1046 |
| `db/seed/` | Test data INSERTs, UPDATEs to seed data | V999, V1004, V1005, V1008, V1009, V1102, ... |

### V1046 Split

`V1046__add_platform_admin.sql` was split:
- **`db/migration/V1046__add_platform_admin.sql`**: `ALTER TABLE users ADD COLUMN is_admin` (schema change, always applied)
- **`db/seed/V1046_1__seed_platform_admin.sql`**: `INSERT INTO users` for the admin test account (dev only)

## Notes
- Seed bookings (V1043, V1102) are created as `CONFIRMED`/`CAPTURED` or `COMPLETED` with no `stripe_payment_intent_id` to avoid requiring Stripe in dev.
- Nore Valley has `instantBooking=true` by default. A few remote sites (Black Valley Wild, Donegal Wild Camping, Cape Clear Island) are request-to-book.
- Owner and supplier test accounts have active subscriptions seeded (V1008-V1009, V1047, V1102).
- Listing photos in V1102 use Unsplash URLs in `entity_images.url` / `lots.image_url` so the UI looks populated without shipping binary assets.
