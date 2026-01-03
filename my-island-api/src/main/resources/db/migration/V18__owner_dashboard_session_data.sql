-- V18__owner_dashboard_session_data.sql
-- Update owner dashboard with specific data for May 2025 - Sept 2025

-- Use the first owner Siobhan O'Malley as the demo owner for these stats
-- ID: 00000000-0000-0000-0001-000000000001

-- 1. Create a new "Off-site B&B" campsite for the demo owner
INSERT INTO campsites (id, owner_id, name, description, address, county, latitude, longitude, rating, review_count, featured, active, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000107',
    '00000000-0000-0000-0001-000000000001',
    'Harbour View B&B (Off-site)',
    'Cozy bed and breakfast located just outside our main resort. Perfect for those who want a solid roof over their heads while still enjoying the resort facilities.',
    'Main St, Clifden',
    'Galway',
    53.4870, -10.0210,
    4.9, 32, FALSE, TRUE, '2025-01-01', '2025-01-01'
);

-- 2. Add requested lots to the demo owner's primary campsite (Clifden Eco Beach)
-- 30 Tents (total)
-- Existing: 'Ocean View Pitch 1' (TENT) id: ...1001
-- We need 29 more TENT lots for Clifden Eco Beach
-- 20 RVs (total)
-- Existing: None explicitly named RV, but 'RV Deluxe Bay' (CARAVAN) exists in Wicklow.
-- Let's add 20 RV lots to Clifden.
-- 4 Apartments (total)
-- 1 Cabin (total)
-- Existing: 'The Nest Treehouse' (CABIN) id: ...1004

-- Helper to generate lots
-- We will use a DO block for PostgreSQL if it's supported, but Flyway migrations should be standard SQL.
-- Since this is H2 or Postgres, let's use standard INSERTs for the specific amounts.

-- TENTS (29 more)
INSERT INTO lots (id, campsite_id, name, type, capacity, price_per_night, available, created_at, updated_at)
SELECT 
    '00000000-0000-0000-a001-' || LPAD(CAST(i AS VARCHAR), 12, '0'),
    '00000000-0000-0000-0000-000000000101',
    'Tent Pitch ' || i,
    'TENT',
    4,
    25.00,
    TRUE,
    '2025-01-01',
    '2025-01-01'
FROM generate_series(2, 30) AS i;

-- RVs (20)
INSERT INTO lots (id, campsite_id, name, type, capacity, price_per_night, available, created_at, updated_at)
SELECT 
    '00000000-0000-0000-a002-' || LPAD(CAST(i AS VARCHAR), 12, '0'),
    '00000000-0000-0000-0000-000000000101',
    'RV Spot ' || i,
    'RV',
    6,
    55.00,
    TRUE,
    '2025-01-01',
    '2025-01-01'
FROM generate_series(1, 20) AS i;

-- Apartments (4)
INSERT INTO lots (id, campsite_id, name, type, capacity, price_per_night, available, created_at, updated_at)
SELECT 
    '00000000-0000-0000-a003-' || LPAD(CAST(i AS VARCHAR), 12, '0'),
    '00000000-0000-0000-0000-000000000101',
    'Resort Apartment ' || i,
    'APARTMENT',
    4,
    145.00,
    TRUE,
    '2025-01-01',
    '2025-01-01'
FROM generate_series(1, 4) AS i;

-- 1 Cabin (Already exists: 'The Nest Treehouse' ...1004)

-- B&B off site (1)
INSERT INTO lots (id, campsite_id, name, type, capacity, price_per_night, available, created_at, updated_at)
VALUES (
    '00000000-0000-0000-a004-000000000001',
    '00000000-0000-0000-0000-000000000107',
    'Deluxe B&B Room',
    'BED_AND_BREAKFAST',
    2,
    120.00,
    TRUE,
    '2025-01-01',
    '2025-01-01'
);

-- 3. Generate simulated COMPLETED bookings from May 2025 to mid-Sept 2025
-- Let's create about 2-3 bookings per lot for this period.

-- Tents Bookings
INSERT INTO bookings (id, user_id, lot_id, check_in, check_out, guests, status, lot_price, extras_price, service_fee, total_price, created_at, updated_at)
SELECT 
    '00000000-0000-0000-b001-' || LPAD(CAST(l.id_num * 10 + b AS VARCHAR), 12, '0'),
    '00000000-0000-0000-0000-00000000000' || (1 + (l.id_num % 5)),
    l.id,
    CAST('2025-05-01' AS DATE) + CAST((b * 20 + l.id_num) AS INTERVAL),
    CAST('2025-05-01' AS DATE) + CAST((b * 20 + l.id_num + 3) AS INTERVAL),
    2,
    'COMPLETED',
    75.00, 0.00, 7.50, 82.50,
    '2025-04-01', '2025-04-01'
FROM (
    SELECT id, CAST(SUBSTR(CAST(id AS VARCHAR), 25) AS INTEGER) as id_num FROM lots WHERE type = 'TENT' AND campsite_id = '00000000-0000-0000-0000-000000000101'
) l
CROSS JOIN generate_series(1, 6) AS b;

-- RV Bookings
INSERT INTO bookings (id, user_id, lot_id, check_in, check_out, guests, status, lot_price, extras_price, service_fee, total_price, created_at, updated_at)
SELECT 
    '00000000-0000-0000-b002-' || LPAD(CAST(l.id_num * 10 + b AS VARCHAR), 12, '0'),
    '00000000-0000-0000-0000-00000000000' || (1 + (l.id_num % 5)),
    l.id,
    CAST('2025-05-10' AS DATE) + CAST((b * 15 + l.id_num) AS INTERVAL),
    CAST('2025-05-10' AS DATE) + CAST((b * 15 + l.id_num + 4) AS INTERVAL),
    4,
    'COMPLETED',
    220.00, 0.00, 22.00, 242.00,
    '2025-04-10', '2025-04-10'
FROM (
    SELECT id, CAST(SUBSTR(CAST(id AS VARCHAR), 25) AS INTEGER) as id_num FROM lots WHERE type = 'RV' AND campsite_id = '00000000-0000-0000-0000-000000000101'
) l
CROSS JOIN generate_series(1, 8) AS b;

-- Apartment Bookings
INSERT INTO bookings (id, user_id, lot_id, check_in, check_out, guests, status, lot_price, extras_price, service_fee, total_price, created_at, updated_at)
SELECT 
    '00000000-0000-0000-b003-' || LPAD(CAST(l.id_num * 10 + b AS VARCHAR), 12, '0'),
    '00000000-0000-0000-0000-00000000000' || (1 + (l.id_num % 5)),
    l.id,
    CAST('2025-05-15' AS DATE) + CAST((b * 10 + l.id_num) AS INTERVAL),
    CAST('2025-05-15' AS DATE) + CAST((b * 10 + l.id_num + 5) AS INTERVAL),
    4,
    'COMPLETED',
    725.00, 0.00, 72.50, 797.50,
    '2025-04-15', '2025-04-15'
FROM (
    SELECT id, CAST(SUBSTR(CAST(id AS VARCHAR), 25) AS INTEGER) as id_num FROM lots WHERE type = 'APARTMENT' AND campsite_id = '00000000-0000-0000-0000-000000000101'
) l
CROSS JOIN generate_series(1, 12) AS b;

-- Cabin Bookings
INSERT INTO bookings (id, user_id, lot_id, check_in, check_out, guests, status, lot_price, extras_price, service_fee, total_price, created_at, updated_at)
SELECT 
    '00000000-0000-0000-b004-' || LPAD(CAST(b AS VARCHAR), 12, '0'),
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000001004',
    CAST('2025-05-01' AS DATE) + CAST((b * 7) AS INTERVAL),
    CAST('2025-05-01' AS DATE) + CAST((b * 7 + 3) AS INTERVAL),
    2,
    'COMPLETED',
    525.00, 0.00, 52.50, 577.50,
    '2025-04-01', '2025-04-01'
FROM generate_series(1, 20) AS b;

-- B&B Bookings
INSERT INTO bookings (id, user_id, lot_id, check_in, check_out, guests, status, lot_price, extras_price, service_fee, total_price, created_at, updated_at)
SELECT 
    '00000000-0000-0000-b005-' || LPAD(CAST(b AS VARCHAR), 12, '0'),
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-a004-000000000001',
    CAST('2025-05-05' AS DATE) + CAST((b * 4) AS INTERVAL),
    CAST('2025-05-05' AS DATE) + CAST((b * 4 + 2) AS INTERVAL),
    2,
    'COMPLETED',
    240.00, 0.00, 24.00, 264.00,
    '2025-04-05', '2025-04-05'
FROM generate_series(1, 30) AS b;
