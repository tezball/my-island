-- V17__seed_lot_availability.sql
-- Seed lot availability for the next 60 days for select lots
-- Using a procedural approach with generate_series

-- Generate availability for lot 1001 (Ocean View Pitch 1 at Clifden)
INSERT INTO lot_availability (id, lot_id, date, status, price_override, created_at, updated_at)
SELECT
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000001001'::uuid,
    d::date,
    CASE
        WHEN random() > 0.9 THEN 'BLOCKED'
        WHEN random() > 0.7 THEN 'BOOKED'
        ELSE 'AVAILABLE'
    END,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '59 days', INTERVAL '1 day') AS d;

-- Generate availability for lot 1002 (Beachside Campervan)
INSERT INTO lot_availability (id, lot_id, date, status, price_override, created_at, updated_at)
SELECT
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000001002'::uuid,
    d::date,
    CASE
        WHEN random() > 0.9 THEN 'BLOCKED'
        WHEN random() > 0.7 THEN 'BOOKED'
        ELSE 'AVAILABLE'
    END,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '59 days', INTERVAL '1 day') AS d;

-- Generate availability for lot 1005 (Mountain View Bell Tent at Ring of Kerry)
INSERT INTO lot_availability (id, lot_id, date, status, price_override, created_at, updated_at)
SELECT
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000001005'::uuid,
    d::date,
    CASE
        WHEN random() > 0.9 THEN 'BLOCKED'
        WHEN random() > 0.7 THEN 'BOOKED'
        ELSE 'AVAILABLE'
    END,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '59 days', INTERVAL '1 day') AS d;

-- Generate availability for lot 1006 (Lakeside Log Cabin)
INSERT INTO lot_availability (id, lot_id, date, status, price_override, created_at, updated_at)
SELECT
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000001006'::uuid,
    d::date,
    CASE
        WHEN random() > 0.9 THEN 'BLOCKED'
        WHEN random() > 0.7 THEN 'BOOKED'
        ELSE 'AVAILABLE'
    END,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '59 days', INTERVAL '1 day') AS d;

-- Generate availability for lot 1010 (Forest Pitch A at Wicklow)
INSERT INTO lot_availability (id, lot_id, date, status, price_override, created_at, updated_at)
SELECT
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000001010'::uuid,
    d::date,
    CASE
        WHEN random() > 0.9 THEN 'BLOCKED'
        WHEN random() > 0.7 THEN 'BOOKED'
        ELSE 'AVAILABLE'
    END,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '59 days', INTERVAL '1 day') AS d;

-- Mark dates that have actual bookings as BOOKED
UPDATE lot_availability la
SET status = 'BOOKED', booking_id = b.id
FROM bookings b
WHERE la.lot_id = b.lot_id
  AND la.date >= b.check_in
  AND la.date < b.check_out
  AND b.status IN ('CONFIRMED', 'CHECKED_IN', 'COMPLETED');
