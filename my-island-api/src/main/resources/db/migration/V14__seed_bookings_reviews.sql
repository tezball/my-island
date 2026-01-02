-- V14__seed_bookings_reviews.sql
-- Seed bookings, extras, booking_extras, and reviews

-- Extras catalog (available at Clifden campsite)
INSERT INTO extras (id, campsite_id, name, description, price, per_night, available, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000002001', '00000000-0000-0000-0000-000000000101', 'Firewood Bundle', 'Seasoned hardwood logs, enough for one evening', 12.00, FALSE, TRUE, '2022-01-15', '2022-01-15'),
('00000000-0000-0000-0000-000000002002', '00000000-0000-0000-0000-000000000101', 'BBQ Rental', 'Portable charcoal BBQ with utensils', 25.00, FALSE, TRUE, '2022-01-15', '2022-01-15'),
('00000000-0000-0000-0000-000000002003', '00000000-0000-0000-0000-000000000101', 'Late Checkout', 'Extend your stay until 2pm instead of 11am', 15.00, FALSE, TRUE, '2022-01-15', '2022-01-15'),
('00000000-0000-0000-0000-000000002004', '00000000-0000-0000-0000-000000000101', 'Welcome Pack', 'Local artisan bread, butter, eggs, and orange juice', 18.00, FALSE, TRUE, '2022-01-15', '2022-01-15'),
('00000000-0000-0000-0000-000000002005', '00000000-0000-0000-0000-000000000101', 'Bike Rental (per day)', 'Mountain bike with helmet and lock', 20.00, TRUE, TRUE, '2022-01-15', '2022-01-15');

-- Bookings for demo user (John Murphy)
-- Booking 1: Upcoming stay at Clifden (14 days from now)
INSERT INTO bookings (id, user_id, lot_id, check_in, check_out, guests, status, lot_price, extras_price, service_fee, total_price, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000003001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000001001',
 CURRENT_DATE + INTERVAL '14 days', CURRENT_DATE + INTERVAL '17 days', 2, 'CONFIRMED', 84.00, 16.00, 10.00, 110.00, CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '7 days');

-- Booking extra for booking 1
INSERT INTO booking_extras (id, booking_id, extra_id, quantity, unit_price, total_price, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000005001', '00000000-0000-0000-0000-000000003001', '00000000-0000-0000-0000-000000002001', 2, 8.00, 16.00, CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '7 days');

-- Booking 2: Future glamping at Ring of Kerry (45 days from now)
INSERT INTO bookings (id, user_id, lot_id, check_in, check_out, guests, status, lot_price, extras_price, service_fee, total_price, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000003002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000001005',
 CURRENT_DATE + INTERVAL '45 days', CURRENT_DATE + INTERVAL '47 days', 2, 'CONFIRMED', 190.00, 0.00, 19.00, 209.00, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days');

-- Booking 3: Past completed stay at Dingle (60 days ago)
INSERT INTO bookings (id, user_id, lot_id, check_in, check_out, guests, status, lot_price, extras_price, service_fee, total_price, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000003003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000001013',
 CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE - INTERVAL '55 days', 4, 'COMPLETED', 160.00, 25.00, 18.50, 203.50, CURRENT_TIMESTAMP - INTERVAL '90 days', CURRENT_TIMESTAMP - INTERVAL '90 days');

-- Owner bookings (for owner dashboard - bookings at Clifden by other users)
-- Owner booking 1: Guest Sarah at Clifden (7 days from now)
INSERT INTO bookings (id, user_id, lot_id, check_in, check_out, guests, status, lot_price, extras_price, service_fee, total_price, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000003004', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000001001',
 CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '10 days', 3, 'CONFIRMED', 84.00, 0.00, 8.40, 92.40, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '5 days');

-- Owner booking 2: Guest Michael at Clifden (21 days from now)
INSERT INTO bookings (id, user_id, lot_id, check_in, check_out, guests, status, lot_price, extras_price, service_fee, total_price, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000003005', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000001002',
 CURRENT_DATE + INTERVAL '21 days', CURRENT_DATE + INTERVAL '23 days', 2, 'CONFIRMED', 76.00, 10.00, 8.60, 94.60, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day');

INSERT INTO booking_extras (id, booking_id, extra_id, quantity, unit_price, total_price, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000005002', '00000000-0000-0000-0000-000000003005', '00000000-0000-0000-0000-000000002001', 1, 10.00, 10.00, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day');

-- Owner booking 3: Guest Emma at Clifden (completed, 30 days ago)
INSERT INTO bookings (id, user_id, lot_id, check_in, check_out, guests, status, lot_price, extras_price, service_fee, total_price, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000003006', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000001001',
 CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '26 days', 4, 'COMPLETED', 112.00, 0.00, 11.20, 123.20, CURRENT_TIMESTAMP - INTERVAL '45 days', CURRENT_TIMESTAMP - INTERVAL '45 days');

-- Owner booking 4: Guest David at Clifden (cancelled, 45 days ago)
INSERT INTO bookings (id, user_id, lot_id, check_in, check_out, guests, status, lot_price, extras_price, service_fee, total_price, cancellation_reason, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000003007', '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000001001',
 CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE - INTERVAL '43 days', 2, 'CANCELLED', 56.00, 0.00, 0.00, 0.00, 'Change of plans', CURRENT_TIMESTAMP - INTERVAL '60 days', CURRENT_TIMESTAMP - INTERVAL '60 days');

-- Additional completed booking for Ring of Kerry to allow review
INSERT INTO bookings (id, user_id, lot_id, check_in, check_out, guests, status, lot_price, extras_price, service_fee, total_price, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000003008', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000001005',
 CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE - INTERVAL '88 days', 2, 'COMPLETED', 190.00, 0.00, 19.00, 209.00, CURRENT_TIMESTAMP - INTERVAL '100 days', CURRENT_TIMESTAMP - INTERVAL '100 days');

-- Reviews (linked to completed bookings)
-- Review 1: Emma's review for Clifden (linked to booking 3006)
INSERT INTO reviews (id, user_id, campsite_id, booking_id, rating, comment, cleanliness_rating, location_rating, value_rating, facilities_rating, helpful_count, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000004001', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000003006',
 5, 'Absolutely stunning location! We had the most amazing weekend at Clifden Eco Beach. The views are incredible and the facilities are spotless. The owners were so welcoming and gave us great tips for local walks. Will definitely be back!',
 5, 5, 4, 5, 12, '2024-12-15', '2024-12-15');

-- Review 2: John's review for Dingle (linked to booking 3003)
INSERT INTO reviews (id, user_id, campsite_id, booking_id, rating, comment, cleanliness_rating, location_rating, value_rating, facilities_rating, helpful_count, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000004002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000003003',
 4, 'Great for families. Brought the kids here for a long weekend. They loved exploring the beach and the playground is fantastic. Only minor issue was the showers could be warmer in the morning.',
 4, 5, 4, 4, 8, '2024-11-28', '2024-11-28');

-- Review 3: Emma's review for Ring of Kerry (linked to booking 3008)
INSERT INTO reviews (id, user_id, campsite_id, booking_id, rating, comment, cleanliness_rating, location_rating, value_rating, facilities_rating, helpful_count, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000004003', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000003008',
 5, 'Romantic getaway perfection. Booked the bell tent for our anniversary and it exceeded all expectations. The attention to detail was incredible - from the fairy lights to the complimentary champagne. Pure magic!',
 5, 5, 5, 5, 24, '2024-12-22', '2024-12-22');

-- Favorites for demo user
INSERT INTO favorites (id, user_id, campsite_id, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000006001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', '2024-06-15', '2024-06-15'),
('00000000-0000-0000-0000-000000006002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', '2024-08-20', '2024-08-20'),
('00000000-0000-0000-0000-000000006003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000106', '2024-11-01', '2024-11-01');
