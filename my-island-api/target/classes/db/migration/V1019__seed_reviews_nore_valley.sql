-- V1019: Seed review data for Nore Valley Park (owner_id = 1)
-- Insert reviews for COMPLETED bookings at Nore Valley

-- Review 1: Murphy Family for Riverside Pitch 3 (lot 3) - but lot 3 has no completed booking.
-- Let's use the COMPLETED bookings from V999 and V1004 that are at Nore Valley lots (1-8).

-- First, insert reviews for known COMPLETED bookings at Nore Valley lots.
-- From seed data: user_id=37 lot=7 (Woodland Bell Tent) is COMPLETED,
--                  user_id=36 lot=5 (Hardstanding B) is COMPLETED,
--                  user_id=36 lot=2 (Riverside Pitch 2) is COMPLETED

-- Review from Solo Traveler (user 37) on Woodland Bell Tent
INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, owner_response, owner_response_at, created_at, updated_at)
SELECT 37, 1, b.id, 4.5,
       'The Woodland Bell Tent was magical! Falling asleep with fairy lights twinkling above and waking to birdsong along the River Nore. The campsite facilities were spotless and the staff couldn''t have been more welcoming. Highly recommend for a solo retreat.',
       'Thank you so much for your lovely review! We''re delighted you enjoyed the bell tent experience. The woodland clearing is one of our most special spots. Looking forward to welcoming you back!',
       NOW() - INTERVAL '5 days',
       NOW() - INTERVAL '30 days', NOW() - INTERVAL '5 days'
FROM bookings b
WHERE b.user_id = 37 AND b.lot_id = 7 AND b.status = 'COMPLETED'
LIMIT 1;

-- Review from Murphy Family (user 36) on Hardstanding B
INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, created_at, updated_at)
SELECT 36, 1, b.id, 5.0,
       'Absolutely brilliant campsite for families! The kids loved the pet farm and river walks. Hardstanding B was perfect for our campervan with easy hookups. The on-site farm shop is a real bonus - fresh eggs and soda bread every morning. We''ve already booked again for next summer!',
       NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'
FROM bookings b
WHERE b.user_id = 36 AND b.lot_id = 5 AND b.status = 'COMPLETED'
LIMIT 1;

-- Review from Romantic Getaway (user 38) on Treehouse Retreat (lot 8)
-- Need a COMPLETED booking - check V1004 line 28: user 38, lot 33 is COMPLETED at owner 8
-- Actually user 38 lot 8 is CONFIRMED in V999, not COMPLETED. Let's use another approach.
-- From V1004: user 38, lot 25 (owner 5), lot 50 (owner 10)...
-- We need completed bookings at Nore Valley. Let's check if user 39 has any.
-- V1004 line 9: user 39, lot 30, COMPLETED (owner 6) - not Nore Valley
-- From V1004 line 29: user 39, lot 47 (owner 10), COMPLETED
-- User 40, lot 35 (owner 7) COMPLETED in V1004

-- Let's use bookings we know are COMPLETED at Nore Valley lots
-- V1004 line 26: user 36, lot 5 - but we already used lot 5 above
-- V999: user 36, lot 5 is COMPLETED (line 369), user 37, lot 7 COMPLETED (line 349)
-- V1004 line 11: user 36, lot 2 COMPLETED

-- Review from Murphy Family (user 36) on Riverside Pitch 2 (lot 2)
INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, owner_response, owner_response_at, created_at, updated_at)
SELECT 36, 1, b.id, 4.0,
       'Great riverside location and very peaceful. Loved hearing the water at night. Facilities are clean and well-maintained. Only small niggle was the path to the river could do with some lighting at night. Would definitely come back though - wonderful value for money.',
       'Thanks for the feedback! We''ve actually added solar path lights along the riverbank since your stay. Hope to see you again soon!',
       NOW() - INTERVAL '10 days',
       NOW() - INTERVAL '45 days', NOW() - INTERVAL '10 days'
FROM bookings b
WHERE b.user_id = 36 AND b.lot_id = 2 AND b.status = 'COMPLETED'
LIMIT 1;

-- Review from Adventure Seekers (user 39) - need a COMPLETED booking at Nore Valley
-- Let's check V1004 more carefully. Line 9: user 39, lot 30 COMPLETED but that's owner 6
-- We may not have a completed booking for user 39 at Nore Valley in existing data.
-- Let's create a completed booking first, then review it.

INSERT INTO bookings (user_id, lot_id, check_in_date, check_out_date, num_guests, total_price, status, special_requests)
VALUES (39, 1, '2025-05-10', '2025-05-12', 2, 50.00, 'COMPLETED', 'Looking forward to the riverside pitches!');

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, created_at, updated_at)
SELECT 39, 1, b.id, 4.5,
       'Riverside Pitch 1 was everything we hoped for. Perfect spot for our weekend getaway. The river is beautiful and the pitch had plenty of space. Staff were friendly and helpful with local walking route suggestions. The communal fire pit area was a lovely touch.',
       NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'
FROM bookings b
WHERE b.user_id = 39 AND b.lot_id = 1 AND b.status = 'COMPLETED'
LIMIT 1;

-- Add another completed booking for Hiking Group at Nore Valley
INSERT INTO bookings (user_id, lot_id, check_in_date, check_out_date, num_guests, total_price, status, special_requests)
VALUES (40, 3, '2025-04-05', '2025-04-07', 4, 50.00, 'COMPLETED', 'Group hiking trip');

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, owner_response, owner_response_at, created_at, updated_at)
SELECT 40, 1, b.id, 3.5,
       'Decent campsite with a nice location under the oak trees. Facilities were adequate but the shower block could use an upgrade - water pressure was a bit weak. The pet farm was fun for the kids in our group though. Fair value for the price point.',
       'Thank you for your honest feedback. We''ve since upgraded our shower system with new pumps and fixtures. We hope you''ll give us another try to see the improvements!',
       NOW() - INTERVAL '3 days',
       NOW() - INTERVAL '40 days', NOW() - INTERVAL '3 days'
FROM bookings b
WHERE b.user_id = 40 AND b.lot_id = 3 AND b.status = 'COMPLETED'
LIMIT 1;

-- Add a completed booking for user 38 at Nore Valley treehouse
INSERT INTO bookings (user_id, lot_id, check_in_date, check_out_date, num_guests, total_price, status, special_requests)
VALUES (38, 8, '2025-04-18', '2025-04-20', 2, 300.00, 'COMPLETED', 'Anniversary treat!');

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, created_at, updated_at)
SELECT 38, 1, b.id, 5.0,
       'The Treehouse Retreat is hands down the most special accommodation we''ve ever stayed in. The panoramic valley views are breathtaking, especially at sunrise. The breakfast basket was a lovely touch with local jams and fresh pastries. Pure romance. If you''re looking for something truly unforgettable, book this immediately!',
       NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'
FROM bookings b
WHERE b.user_id = 38 AND b.lot_id = 8 AND b.status = 'COMPLETED'
LIMIT 1;

-- Update denormalized rating on owner
UPDATE owners SET
    rating = (SELECT ROUND(AVG(r.rating), 1) FROM reviews r WHERE r.owner_id = 1),
    review_count = (SELECT COUNT(*) FROM reviews r WHERE r.owner_id = 1)
WHERE id = 1;
