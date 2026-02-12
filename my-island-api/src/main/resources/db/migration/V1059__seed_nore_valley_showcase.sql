-- V1059: Seed Nore Valley Park with a large volume of realistic data
-- to showcase the full power of the owner portal (dashboard, calendar, timeline,
-- bookings, reviews, messages, modifications, blocked periods, pricing).
--
-- Nore Valley Park: owner_id=1, user_id=1
-- Existing lots: IDs 1-8 (3 tent, 3 touring, 1 glamping, 1 cabin)

-- ============================================================================
-- 1. ADDITIONAL LOTS — expand Nore Valley from 8 to 30 lots
-- ============================================================================

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, is_active, min_stay) VALUES
    -- More tent pitches
    (1, 'Riverside Pitch 4', 'TENT', 'Flat grass pitch with river frontage. Morning sun, sheltered from wind by mature hedgerow.', 25.00, 4, TRUE, 1),
    (1, 'Riverside Pitch 5', 'TENT', 'Family-sized pitch near the playground. Safe and visible from the reception.', 25.00, 6, TRUE, 1),
    (1, 'Riverside Pitch 6', 'TENT', 'Quiet adults-preferred pitch at the far end of the riverside meadow.', 28.00, 2, TRUE, 2),
    (1, 'Meadow Pitch 1', 'TENT', 'Open meadow pitch with 360-degree views. Great for stargazing.', 22.00, 4, TRUE, 1),
    (1, 'Meadow Pitch 2', 'TENT', 'Wildflower meadow pitch. Buttercups and daisies in summer.', 22.00, 4, TRUE, 1),
    (1, 'Meadow Pitch 3', 'TENT', 'Large group pitch accommodating multiple tents. Communal firepit.', 30.00, 8, TRUE, 2),
    -- More touring pitches
    (1, 'Hardstanding D', 'TOURING', 'Spacious touring pitch with 16A hookup and grey water drain.', 38.00, 4, TRUE, 1),
    (1, 'Hardstanding E', 'TOURING', 'Pull-through pitch for larger motorhomes. Easy access.', 40.00, 4, TRUE, 1),
    (1, 'Hardstanding F', 'TOURING', 'Premium pitch with water, electric, and TV hookup. Paved patio area.', 45.00, 6, TRUE, 1),
    (1, 'Hardstanding G', 'TOURING', 'End-of-row pitch with extra space for awning. River views.', 42.00, 4, TRUE, 1),
    -- More glamping
    (1, 'Safari Tent', 'GLAMPING', 'Spacious African-style safari tent with double bed, wood-burning stove, and covered deck.', 95.00, 4, TRUE, 2),
    (1, 'Valley Yurt', 'GLAMPING', 'Traditional Mongolian yurt with sheepskin rugs and skylight for stargazing.', 90.00, 4, TRUE, 2),
    (1, 'Woodland Bell Tent 2', 'GLAMPING', 'Second bell tent in a private woodland glade. Fairy lights and firepit included.', 85.00, 2, TRUE, 2),
    (1, 'Honeybee Glamping Pod', 'GLAMPING', 'Insulated timber pod with ensuite wet room and kitchenette. Our cosiest option.', 110.00, 2, TRUE, 2),
    -- More cabins
    (1, 'Family Cabin', 'CABIN', 'Two-bedroom timber cabin with full kitchen, bathroom, and covered veranda. Sleeps 6.', 165.00, 6, TRUE, 2),
    (1, 'River Lodge', 'CABIN', 'Premium riverside lodge with hot tub, king bed, and panoramic windows.', 195.00, 2, TRUE, 3),
    (1, 'Woodland Cabin', 'CABIN', 'A-frame cabin hidden in native woodland. Cosy loft bedroom, wood-burning stove.', 140.00, 4, TRUE, 2),
    -- Mobile homes
    (1, 'Mobile Home 1 - Willow', 'MOBILE_HOME', 'Modern 2-bed mobile home with open-plan living, decking, and BBQ. Great for families.', 120.00, 6, TRUE, 3),
    (1, 'Mobile Home 2 - Birch', 'MOBILE_HOME', 'Fully equipped 3-bed mobile home. Dishwasher, washing machine, and private garden.', 145.00, 8, TRUE, 3),
    (1, 'Mobile Home 3 - Alder', 'MOBILE_HOME', 'Accessible mobile home with wheelchair ramp, wet room, and lower kitchen worktops.', 130.00, 6, TRUE, 3),
    -- One inactive lot (for realism)
    (1, 'Orchard Pitch (Closed)', 'TENT', 'Temporarily closed for drainage works. Reopening Spring 2027.', 25.00, 4, FALSE, 1),
    (1, 'Shepherd''s Hut', 'GLAMPING', 'Vintage shepherd''s hut with cast-iron stove and copper bath. Pure romance.', 125.00, 2, TRUE, 2);

-- Add amenities for new lots
INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id FROM lots l, amenities a
WHERE l.owner_id = 1 AND l.name LIKE 'Riverside Pitch%' AND a.name IN ('Fire Pit', 'BBQ', 'Picnic Table')
ON CONFLICT DO NOTHING;

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id FROM lots l, amenities a
WHERE l.owner_id = 1 AND l.name LIKE 'Meadow Pitch%' AND a.name IN ('Fire Pit', 'Picnic Table', 'Pet Friendly')
ON CONFLICT DO NOTHING;

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id FROM lots l, amenities a
WHERE l.owner_id = 1 AND l.name LIKE 'Hardstanding%' AND a.name IN ('Electricity', 'Water Hookup', 'Parking')
ON CONFLICT DO NOTHING;

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id FROM lots l, amenities a
WHERE l.owner_id = 1 AND l.name IN ('Safari Tent', 'Valley Yurt', 'Woodland Bell Tent 2', 'Honeybee Glamping Pod', 'Shepherd''s Hut')
AND a.name IN ('WiFi', 'Electricity', 'Fire Pit', 'Picnic Table')
ON CONFLICT DO NOTHING;

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id FROM lots l, amenities a
WHERE l.owner_id = 1 AND l.name IN ('Family Cabin', 'River Lodge', 'Woodland Cabin')
AND a.name IN ('WiFi', 'Electricity', 'Toilet', 'Shower', 'Parking')
ON CONFLICT DO NOTHING;

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id FROM lots l, amenities a
WHERE l.owner_id = 1 AND l.name LIKE 'Mobile Home%'
AND a.name IN ('WiFi', 'Electricity', 'Water Hookup', 'Toilet', 'Shower', 'Parking', 'BBQ', 'Pet Friendly')
ON CONFLICT DO NOTHING;


-- ============================================================================
-- 2. NEW GUEST USERS — 20 realistic Irish guest accounts
-- ============================================================================

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified) VALUES
    ('sean.murphy@gmail.com',    '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Sean Murphy', 'GUEST', FALSE, FALSE, TRUE),
    ('aoife.kelly@yahoo.ie',     '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Aoife Kelly', 'GUEST', FALSE, FALSE, TRUE),
    ('ciaran.obrien@hotmail.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Ciaran O''Brien', 'GUEST', FALSE, FALSE, TRUE),
    ('niamh.walsh@gmail.com',    '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Niamh Walsh', 'GUEST', FALSE, FALSE, TRUE),
    ('padraig.ryan@outlook.ie',  '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Padraig Ryan', 'GUEST', FALSE, FALSE, TRUE),
    ('siobhan.doyle@gmail.com',  '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Siobhan Doyle', 'GUEST', FALSE, FALSE, TRUE),
    ('declan.lynch@yahoo.com',   '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Declan Lynch', 'GUEST', FALSE, FALSE, TRUE),
    ('aisling.byrne@gmail.com',  '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Aisling Byrne', 'GUEST', FALSE, FALSE, TRUE),
    ('oisin.kavanagh@live.ie',   '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Oisin Kavanagh', 'GUEST', FALSE, FALSE, TRUE),
    ('roisin.brennan@gmail.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Roisin Brennan', 'GUEST', FALSE, FALSE, TRUE),
    ('conor.mccarthy@yahoo.ie',  '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Conor McCarthy', 'GUEST', FALSE, FALSE, TRUE),
    ('emma.nolan@gmail.com',     '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Emma Nolan', 'GUEST', FALSE, FALSE, TRUE),
    ('liam.fitzgerald@live.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Liam Fitzgerald', 'GUEST', FALSE, FALSE, TRUE),
    ('sarah.connolly@yahoo.ie',  '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Sarah Connolly', 'GUEST', FALSE, FALSE, TRUE),
    ('eoin.oshea@gmail.com',     '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Eoin O''Shea', 'GUEST', FALSE, FALSE, TRUE),
    ('megan.power@outlook.ie',   '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Megan Power', 'GUEST', FALSE, FALSE, TRUE),
    ('darragh.healy@gmail.com',  '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Darragh Healy', 'GUEST', FALSE, FALSE, TRUE),
    ('clodagh.daly@yahoo.ie',    '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Clodagh Daly', 'GUEST', FALSE, FALSE, TRUE),
    ('cathal.murray@gmail.com',  '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Cathal Murray', 'GUEST', FALSE, FALSE, TRUE),
    ('orla.duffy@live.ie',       '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Orla Duffy', 'GUEST', FALSE, FALSE, TRUE);


-- ============================================================================
-- 3. SEASONAL PRICING RULES for Nore Valley
-- ============================================================================

INSERT INTO seasonal_pricing_rules (owner_id, lot_type, name, start_date, end_date, price_per_night, min_stay) VALUES
    (1, 'TENT',        'Summer Peak (Tent)',       '2026-06-20', '2026-08-31', 35.00, 2),
    (1, 'TOURING',     'Summer Peak (Touring)',    '2026-06-20', '2026-08-31', 50.00, 2),
    (1, 'GLAMPING',    'Summer Peak (Glamping)',   '2026-06-20', '2026-08-31', 130.00, 3),
    (1, 'CABIN',       'Summer Peak (Cabin)',      '2026-06-20', '2026-08-31', 195.00, 3),
    (1, 'MOBILE_HOME', 'Summer Peak (Mobile)',     '2026-06-20', '2026-08-31', 165.00, 7),
    (1, 'TENT',        'Bank Holiday May',         '2026-05-01', '2026-05-04', 32.00, 2),
    (1, 'TOURING',     'Bank Holiday May',         '2026-05-01', '2026-05-04', 48.00, 2),
    (1, 'GLAMPING',    'Easter Special',           '2026-04-03', '2026-04-06', 120.00, 2),
    (1, 'TENT',        'Off-Season Winter',        '2025-11-01', '2026-02-28', 18.00, 1),
    (1, 'TOURING',     'Off-Season Winter',        '2025-11-01', '2026-02-28', 28.00, 1);


-- ============================================================================
-- 4. BOOKINGS — ~180 bookings across all Nore Valley lots
--    Mix of COMPLETED, CONFIRMED, CHECKED_IN, PENDING, CANCELLED
--    Using CURRENT_DATE-relative dates for realism
-- ============================================================================

-- Helper: We reference lots by owner_id=1 and name. For original lots (1-8) we can use IDs directly.
-- For new lots we use subselects.

-- ---- COMPLETED bookings (past 3 months) ----
INSERT INTO bookings (user_id, lot_id, check_in_date, check_out_date, num_guests, total_price, status, payment_status, service_fee, charge_total, booking_source, special_requests) VALUES
    -- 90 days ago to 60 days ago
    ((SELECT id FROM users WHERE email='sean.murphy@gmail.com'), 1, CURRENT_DATE - 90, CURRENT_DATE - 87, 4, 75.00, 'COMPLETED', 'CAPTURED', 3.75, 78.75, 'ONLINE', 'Arriving around 3pm. Need firewood.'),
    ((SELECT id FROM users WHERE email='aoife.kelly@yahoo.ie'), 2, CURRENT_DATE - 88, CURRENT_DATE - 85, 2, 75.00, 'COMPLETED', 'CAPTURED', 3.75, 78.75, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='ciaran.obrien@hotmail.com'), 4, CURRENT_DATE - 87, CURRENT_DATE - 84, 4, 105.00, 'COMPLETED', 'CAPTURED', 5.25, 110.25, 'ONLINE', 'Large motorhome, 7.5m. Will need extra-wide pitch.'),
    ((SELECT id FROM users WHERE email='niamh.walsh@gmail.com'), 7, CURRENT_DATE - 86, CURRENT_DATE - 83, 2, 255.00, 'COMPLETED', 'CAPTURED', 12.75, 267.75, 'ONLINE', 'Honeymoon trip! Any romantic touches appreciated.'),
    ((SELECT id FROM users WHERE email='padraig.ryan@outlook.ie'), 8, CURRENT_DATE - 85, CURRENT_DATE - 82, 2, 450.00, 'COMPLETED', 'CAPTURED', 22.50, 472.50, 'ONLINE', 'Anniversary weekend. Breakfast basket?'),
    ((SELECT id FROM users WHERE email='siobhan.doyle@gmail.com'), 3, CURRENT_DATE - 84, CURRENT_DATE - 82, 3, 50.00, 'COMPLETED', 'CAPTURED', 2.50, 52.50, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='declan.lynch@yahoo.com'), 5, CURRENT_DATE - 83, CURRENT_DATE - 80, 4, 120.00, 'COMPLETED', 'CAPTURED', 6.00, 126.00, 'ONLINE', 'Touring with kids. Quiet pitch please.'),
    ((SELECT id FROM users WHERE email='aisling.byrne@gmail.com'), 6, CURRENT_DATE - 82, CURRENT_DATE - 78, 2, 168.00, 'COMPLETED', 'CAPTURED', 8.40, 176.40, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='oisin.kavanagh@live.ie'), 1, CURRENT_DATE - 80, CURRENT_DATE - 77, 2, 75.00, 'COMPLETED', 'CAPTURED', 3.75, 78.75, 'ONLINE', 'Solo hiker. Just need basic pitch.'),
    ((SELECT id FROM users WHERE email='roisin.brennan@gmail.com'), (SELECT id FROM lots WHERE name='Safari Tent' AND owner_id=1), CURRENT_DATE - 79, CURRENT_DATE - 76, 4, 285.00, 'COMPLETED', 'CAPTURED', 14.25, 299.25, 'ONLINE', 'Birthday weekend for my mum!'),
    ((SELECT id FROM users WHERE email='conor.mccarthy@yahoo.ie'), (SELECT id FROM lots WHERE name='Family Cabin' AND owner_id=1), CURRENT_DATE - 78, CURRENT_DATE - 74, 5, 660.00, 'COMPLETED', 'CAPTURED', 33.00, 693.00, 'ONLINE', '2 adults, 3 kids. High chair needed.'),
    ((SELECT id FROM users WHERE email='emma.nolan@gmail.com'), (SELECT id FROM lots WHERE name='Valley Yurt' AND owner_id=1), CURRENT_DATE - 77, CURRENT_DATE - 74, 2, 270.00, 'COMPLETED', 'CAPTURED', 13.50, 283.50, 'ONLINE', 'Yoga retreat with friends nearby.'),
    ((SELECT id FROM users WHERE email='liam.fitzgerald@live.com'), (SELECT id FROM lots WHERE name='Hardstanding D' AND owner_id=1), CURRENT_DATE - 76, CURRENT_DATE - 73, 3, 114.00, 'COMPLETED', 'CAPTURED', 5.70, 119.70, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='sarah.connolly@yahoo.ie'), (SELECT id FROM lots WHERE name='Mobile Home 1 - Willow' AND owner_id=1), CURRENT_DATE - 75, CURRENT_DATE - 68, 6, 840.00, 'COMPLETED', 'CAPTURED', 42.00, 882.00, 'ONLINE', 'Family of 6. Need cot for baby.'),
    ((SELECT id FROM users WHERE email='eoin.oshea@gmail.com'), 2, CURRENT_DATE - 74, CURRENT_DATE - 71, 2, 75.00, 'COMPLETED', 'CAPTURED', 3.75, 78.75, 'ONLINE', 'Fishing trip. Early starts!'),

    -- 70 days ago to 40 days ago
    ((SELECT id FROM users WHERE email='megan.power@outlook.ie'), 3, CURRENT_DATE - 70, CURRENT_DATE - 67, 4, 75.00, 'COMPLETED', 'CAPTURED', 3.75, 78.75, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='darragh.healy@gmail.com'), (SELECT id FROM lots WHERE name='River Lodge' AND owner_id=1), CURRENT_DATE - 69, CURRENT_DATE - 65, 2, 780.00, 'COMPLETED', 'CAPTURED', 39.00, 819.00, 'ONLINE', 'Proposal trip! Please have champagne ready.'),
    ((SELECT id FROM users WHERE email='clodagh.daly@yahoo.ie'), 1, CURRENT_DATE - 68, CURRENT_DATE - 65, 3, 75.00, 'COMPLETED', 'CAPTURED', 3.75, 78.75, 'ONLINE', 'We love this spot! Third visit.'),
    ((SELECT id FROM users WHERE email='cathal.murray@gmail.com'), 4, CURRENT_DATE - 67, CURRENT_DATE - 63, 4, 140.00, 'COMPLETED', 'CAPTURED', 7.00, 147.00, 'ONLINE', 'VW campervan, vintage. Need flat ground.'),
    ((SELECT id FROM users WHERE email='orla.duffy@live.ie'), 7, CURRENT_DATE - 66, CURRENT_DATE - 63, 2, 255.00, 'COMPLETED', 'CAPTURED', 12.75, 267.75, 'ONLINE', 'Second time glamping here. Can''t wait!'),
    ((SELECT id FROM users WHERE email='sean.murphy@gmail.com'), (SELECT id FROM lots WHERE name='Woodland Bell Tent 2' AND owner_id=1), CURRENT_DATE - 65, CURRENT_DATE - 62, 2, 255.00, 'COMPLETED', 'CAPTURED', 12.75, 267.75, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='aoife.kelly@yahoo.ie'), (SELECT id FROM lots WHERE name='Honeybee Glamping Pod' AND owner_id=1), CURRENT_DATE - 64, CURRENT_DATE - 61, 2, 330.00, 'COMPLETED', 'CAPTURED', 16.50, 346.50, 'ONLINE', 'Allergic to feathers - synthetic pillows please.'),
    ((SELECT id FROM users WHERE email='ciaran.obrien@hotmail.com'), (SELECT id FROM lots WHERE name='Meadow Pitch 1' AND owner_id=1), CURRENT_DATE - 63, CURRENT_DATE - 61, 4, 44.00, 'COMPLETED', 'CAPTURED', 2.20, 46.20, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='niamh.walsh@gmail.com'), 5, CURRENT_DATE - 62, CURRENT_DATE - 59, 4, 120.00, 'COMPLETED', 'CAPTURED', 6.00, 126.00, 'ONLINE', 'Caravan with awning. Extra space needed.'),
    ((SELECT id FROM users WHERE email='padraig.ryan@outlook.ie'), (SELECT id FROM lots WHERE name='Woodland Cabin' AND owner_id=1), CURRENT_DATE - 61, CURRENT_DATE - 58, 4, 420.00, 'COMPLETED', 'CAPTURED', 21.00, 441.00, 'ONLINE', 'Dog-friendly cabin? We have a lab.'),
    ((SELECT id FROM users WHERE email='siobhan.doyle@gmail.com'), 6, CURRENT_DATE - 60, CURRENT_DATE - 57, 2, 126.00, 'COMPLETED', 'CAPTURED', 6.30, 132.30, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='declan.lynch@yahoo.com'), (SELECT id FROM lots WHERE name='Hardstanding E' AND owner_id=1), CURRENT_DATE - 59, CURRENT_DATE - 55, 4, 160.00, 'COMPLETED', 'CAPTURED', 8.00, 168.00, 'ONLINE', 'Need waste disposal access.'),
    ((SELECT id FROM users WHERE email='aisling.byrne@gmail.com'), 8, CURRENT_DATE - 58, CURRENT_DATE - 55, 2, 450.00, 'COMPLETED', 'CAPTURED', 22.50, 472.50, 'ONLINE', 'Treehouse for our 10th anniversary!'),
    ((SELECT id FROM users WHERE email='oisin.kavanagh@live.ie'), (SELECT id FROM lots WHERE name='Mobile Home 2 - Birch' AND owner_id=1), CURRENT_DATE - 57, CURRENT_DATE - 50, 6, 1015.00, 'COMPLETED', 'CAPTURED', 50.75, 1065.75, 'ONLINE', 'Extended family reunion. 3 bedrooms needed.'),
    ((SELECT id FROM users WHERE email='roisin.brennan@gmail.com'), 2, CURRENT_DATE - 55, CURRENT_DATE - 52, 2, 75.00, 'COMPLETED', 'CAPTURED', 3.75, 78.75, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='conor.mccarthy@yahoo.ie'), (SELECT id FROM lots WHERE name='Riverside Pitch 4' AND owner_id=1), CURRENT_DATE - 54, CURRENT_DATE - 51, 3, 75.00, 'COMPLETED', 'CAPTURED', 3.75, 78.75, 'ONLINE', 'Kayaking the Nore. Boat storage?'),
    ((SELECT id FROM users WHERE email='emma.nolan@gmail.com'), (SELECT id FROM lots WHERE name='Shepherd''s Hut' AND owner_id=1), CURRENT_DATE - 53, CURRENT_DATE - 50, 2, 375.00, 'COMPLETED', 'CAPTURED', 18.75, 393.75, 'ONLINE', 'Copper bath sounds amazing!'),
    ((SELECT id FROM users WHERE email='liam.fitzgerald@live.com'), 1, CURRENT_DATE - 50, CURRENT_DATE - 47, 2, 75.00, 'COMPLETED', 'CAPTURED', 3.75, 78.75, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='sarah.connolly@yahoo.ie'), (SELECT id FROM lots WHERE name='Hardstanding F' AND owner_id=1), CURRENT_DATE - 49, CURRENT_DATE - 46, 4, 135.00, 'COMPLETED', 'CAPTURED', 6.75, 141.75, 'ONLINE', 'Premium pitch for our new caravan!'),
    ((SELECT id FROM users WHERE email='eoin.oshea@gmail.com'), (SELECT id FROM lots WHERE name='Safari Tent' AND owner_id=1), CURRENT_DATE - 48, CURRENT_DATE - 45, 3, 285.00, 'COMPLETED', 'CAPTURED', 14.25, 299.25, 'ONLINE', 'Lads weekend. Any fishing nearby?'),
    ((SELECT id FROM users WHERE email='megan.power@outlook.ie'), 7, CURRENT_DATE - 47, CURRENT_DATE - 44, 2, 255.00, 'COMPLETED', 'CAPTURED', 12.75, 267.75, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='darragh.healy@gmail.com'), 3, CURRENT_DATE - 46, CURRENT_DATE - 44, 4, 50.00, 'COMPLETED', 'CAPTURED', 2.50, 52.50, 'ONLINE', 'Quick weekend camping trip.'),
    ((SELECT id FROM users WHERE email='clodagh.daly@yahoo.ie'), (SELECT id FROM lots WHERE name='Mobile Home 3 - Alder' AND owner_id=1), CURRENT_DATE - 45, CURRENT_DATE - 38, 4, 910.00, 'COMPLETED', 'CAPTURED', 45.50, 955.50, 'ONLINE', 'Accessible unit for grandmother in wheelchair.'),
    ((SELECT id FROM users WHERE email='cathal.murray@gmail.com'), (SELECT id FROM lots WHERE name='Hardstanding G' AND owner_id=1), CURRENT_DATE - 44, CURRENT_DATE - 41, 2, 126.00, 'COMPLETED', 'CAPTURED', 6.30, 132.30, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='orla.duffy@live.ie'), (SELECT id FROM lots WHERE name='Family Cabin' AND owner_id=1), CURRENT_DATE - 43, CURRENT_DATE - 39, 5, 660.00, 'COMPLETED', 'CAPTURED', 33.00, 693.00, 'ONLINE', 'Birthday party for 8-year-old. Cake delivery?'),

    -- 40 days ago to 20 days ago
    ((SELECT id FROM users WHERE email='sean.murphy@gmail.com'), 4, CURRENT_DATE - 40, CURRENT_DATE - 37, 4, 105.00, 'COMPLETED', 'CAPTURED', 5.25, 110.25, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='aoife.kelly@yahoo.ie'), (SELECT id FROM lots WHERE name='River Lodge' AND owner_id=1), CURRENT_DATE - 39, CURRENT_DATE - 35, 2, 780.00, 'COMPLETED', 'CAPTURED', 39.00, 819.00, 'ONLINE', 'Hot tub with river views - dream come true.'),
    ((SELECT id FROM users WHERE email='ciaran.obrien@hotmail.com'), 1, CURRENT_DATE - 38, CURRENT_DATE - 36, 3, 50.00, 'COMPLETED', 'CAPTURED', 2.50, 52.50, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='niamh.walsh@gmail.com'), (SELECT id FROM lots WHERE name='Valley Yurt' AND owner_id=1), CURRENT_DATE - 37, CURRENT_DATE - 34, 2, 270.00, 'COMPLETED', 'CAPTURED', 13.50, 283.50, 'ONLINE', 'Reading retreat. Quiet spot please.'),
    ((SELECT id FROM users WHERE email='padraig.ryan@outlook.ie'), 6, CURRENT_DATE - 36, CURRENT_DATE - 33, 4, 126.00, 'COMPLETED', 'CAPTURED', 6.30, 132.30, 'ONLINE', 'Large touring caravan with slide-out.'),
    ((SELECT id FROM users WHERE email='siobhan.doyle@gmail.com'), (SELECT id FROM lots WHERE name='Honeybee Glamping Pod' AND owner_id=1), CURRENT_DATE - 35, CURRENT_DATE - 32, 2, 330.00, 'COMPLETED', 'CAPTURED', 16.50, 346.50, 'ONLINE', 'Cosy weekend retreat!'),
    ((SELECT id FROM users WHERE email='declan.lynch@yahoo.com'), 2, CURRENT_DATE - 34, CURRENT_DATE - 31, 2, 75.00, 'COMPLETED', 'CAPTURED', 3.75, 78.75, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='aisling.byrne@gmail.com'), (SELECT id FROM lots WHERE name='Meadow Pitch 2' AND owner_id=1), CURRENT_DATE - 33, CURRENT_DATE - 30, 4, 66.00, 'COMPLETED', 'CAPTURED', 3.30, 69.30, 'ONLINE', 'Wildflower pitch! Sounds perfect.'),
    ((SELECT id FROM users WHERE email='oisin.kavanagh@live.ie'), (SELECT id FROM lots WHERE name='Woodland Cabin' AND owner_id=1), CURRENT_DATE - 32, CURRENT_DATE - 29, 3, 420.00, 'COMPLETED', 'CAPTURED', 21.00, 441.00, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='roisin.brennan@gmail.com'), 5, CURRENT_DATE - 31, CURRENT_DATE - 28, 4, 120.00, 'COMPLETED', 'CAPTURED', 6.00, 126.00, 'ONLINE', 'Caravan holiday with the grandparents.'),
    ((SELECT id FROM users WHERE email='conor.mccarthy@yahoo.ie'), (SELECT id FROM lots WHERE name='Shepherd''s Hut' AND owner_id=1), CURRENT_DATE - 30, CURRENT_DATE - 27, 2, 375.00, 'COMPLETED', 'CAPTURED', 18.75, 393.75, 'ONLINE', 'Romantic getaway.'),
    ((SELECT id FROM users WHERE email='emma.nolan@gmail.com'), (SELECT id FROM lots WHERE name='Mobile Home 1 - Willow' AND owner_id=1), CURRENT_DATE - 29, CURRENT_DATE - 22, 5, 840.00, 'COMPLETED', 'CAPTURED', 42.00, 882.00, 'ONLINE', 'School mid-term break with the kids.'),
    ((SELECT id FROM users WHERE email='liam.fitzgerald@live.com'), 3, CURRENT_DATE - 28, CURRENT_DATE - 25, 2, 75.00, 'COMPLETED', 'CAPTURED', 3.75, 78.75, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='sarah.connolly@yahoo.ie'), (SELECT id FROM lots WHERE name='Safari Tent' AND owner_id=1), CURRENT_DATE - 27, CURRENT_DATE - 24, 4, 285.00, 'COMPLETED', 'CAPTURED', 14.25, 299.25, 'ONLINE', 'Girls weekend away!'),
    ((SELECT id FROM users WHERE email='eoin.oshea@gmail.com'), (SELECT id FROM lots WHERE name='Riverside Pitch 5' AND owner_id=1), CURRENT_DATE - 26, CURRENT_DATE - 23, 4, 75.00, 'COMPLETED', 'CAPTURED', 3.75, 78.75, 'ONLINE', 'Kids love the playground pitch.'),
    ((SELECT id FROM users WHERE email='megan.power@outlook.ie'), 8, CURRENT_DATE - 25, CURRENT_DATE - 22, 2, 450.00, 'COMPLETED', 'CAPTURED', 22.50, 472.50, 'ONLINE', 'Treehouse!! So excited!'),
    ((SELECT id FROM users WHERE email='darragh.healy@gmail.com'), (SELECT id FROM lots WHERE name='Hardstanding D' AND owner_id=1), CURRENT_DATE - 24, CURRENT_DATE - 21, 2, 114.00, 'COMPLETED', 'CAPTURED', 5.70, 119.70, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='clodagh.daly@yahoo.ie'), (SELECT id FROM lots WHERE name='Riverside Pitch 6' AND owner_id=1), CURRENT_DATE - 23, CURRENT_DATE - 20, 2, 84.00, 'COMPLETED', 'CAPTURED', 4.20, 88.20, 'ONLINE', 'Quiet spot perfect for us.'),

    -- Recent completed (20 days ago to 5 days ago)
    ((SELECT id FROM users WHERE email='cathal.murray@gmail.com'), 1, CURRENT_DATE - 20, CURRENT_DATE - 17, 3, 75.00, 'COMPLETED', 'CAPTURED', 3.75, 78.75, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='orla.duffy@live.ie'), (SELECT id FROM lots WHERE name='Woodland Bell Tent 2' AND owner_id=1), CURRENT_DATE - 19, CURRENT_DATE - 16, 2, 255.00, 'COMPLETED', 'CAPTURED', 12.75, 267.75, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='sean.murphy@gmail.com'), (SELECT id FROM lots WHERE name='Meadow Pitch 3' AND owner_id=1), CURRENT_DATE - 18, CURRENT_DATE - 15, 6, 90.00, 'COMPLETED', 'CAPTURED', 4.50, 94.50, 'ONLINE', 'Scout group camping trip.'),
    ((SELECT id FROM users WHERE email='aoife.kelly@yahoo.ie'), (SELECT id FROM lots WHERE name='Hardstanding E' AND owner_id=1), CURRENT_DATE - 17, CURRENT_DATE - 14, 3, 120.00, 'COMPLETED', 'CAPTURED', 6.00, 126.00, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='ciaran.obrien@hotmail.com'), (SELECT id FROM lots WHERE name='Family Cabin' AND owner_id=1), CURRENT_DATE - 16, CURRENT_DATE - 13, 5, 495.00, 'COMPLETED', 'CAPTURED', 24.75, 519.75, 'ONLINE', 'Winter cabin break with kids.'),
    ((SELECT id FROM users WHERE email='niamh.walsh@gmail.com'), 4, CURRENT_DATE - 15, CURRENT_DATE - 12, 2, 105.00, 'COMPLETED', 'CAPTURED', 5.25, 110.25, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='padraig.ryan@outlook.ie'), (SELECT id FROM lots WHERE name='Honeybee Glamping Pod' AND owner_id=1), CURRENT_DATE - 14, CURRENT_DATE - 11, 2, 330.00, 'COMPLETED', 'CAPTURED', 16.50, 346.50, 'ONLINE', 'Midweek escape from Dublin.'),
    ((SELECT id FROM users WHERE email='siobhan.doyle@gmail.com'), (SELECT id FROM lots WHERE name='Mobile Home 2 - Birch' AND owner_id=1), CURRENT_DATE - 13, CURRENT_DATE - 6, 7, 1015.00, 'COMPLETED', 'CAPTURED', 50.75, 1065.75, 'ONLINE', 'Big family holiday. All 7 of us!'),
    ((SELECT id FROM users WHERE email='declan.lynch@yahoo.com'), 7, CURRENT_DATE - 10, CURRENT_DATE - 7, 2, 255.00, 'COMPLETED', 'CAPTURED', 12.75, 267.75, 'ONLINE', 'Third time at the bell tent!'),
    ((SELECT id FROM users WHERE email='aisling.byrne@gmail.com'), (SELECT id FROM lots WHERE name='River Lodge' AND owner_id=1), CURRENT_DATE - 9, CURRENT_DATE - 5, 2, 780.00, 'COMPLETED', 'CAPTURED', 39.00, 819.00, 'ONLINE', 'Valentine''s treat for us.');

-- ---- CHECKED_IN bookings (currently staying) ----
INSERT INTO bookings (user_id, lot_id, check_in_date, check_out_date, num_guests, total_price, status, payment_status, service_fee, charge_total, booking_source, special_requests) VALUES
    ((SELECT id FROM users WHERE email='oisin.kavanagh@live.ie'), 1, CURRENT_DATE - 2, CURRENT_DATE + 3, 3, 125.00, 'CHECKED_IN', 'CAPTURED', 6.25, 131.25, 'ONLINE', 'Fishing and walking. Perfect combo.'),
    ((SELECT id FROM users WHERE email='roisin.brennan@gmail.com'), (SELECT id FROM lots WHERE name='Family Cabin' AND owner_id=1), CURRENT_DATE - 1, CURRENT_DATE + 4, 5, 825.00, 'CHECKED_IN', 'CAPTURED', 41.25, 866.25, 'ONLINE', 'Mid-term break!'),
    ((SELECT id FROM users WHERE email='conor.mccarthy@yahoo.ie'), 5, CURRENT_DATE - 3, CURRENT_DATE + 1, 4, 160.00, 'CHECKED_IN', 'CAPTURED', 8.00, 168.00, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='emma.nolan@gmail.com'), (SELECT id FROM lots WHERE name='Shepherd''s Hut' AND owner_id=1), CURRENT_DATE - 1, CURRENT_DATE + 2, 2, 375.00, 'CHECKED_IN', 'CAPTURED', 18.75, 393.75, 'ONLINE', 'Here for the copper bath!'),
    ((SELECT id FROM users WHERE email='liam.fitzgerald@live.com'), (SELECT id FROM lots WHERE name='Valley Yurt' AND owner_id=1), CURRENT_DATE - 2, CURRENT_DATE + 1, 2, 270.00, 'CHECKED_IN', 'CAPTURED', 13.50, 283.50, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='sarah.connolly@yahoo.ie'), (SELECT id FROM lots WHERE name='Hardstanding F' AND owner_id=1), CURRENT_DATE - 1, CURRENT_DATE + 3, 4, 180.00, 'CHECKED_IN', 'CAPTURED', 9.00, 189.00, 'ONLINE', 'New caravan - maiden voyage!'),
    ((SELECT id FROM users WHERE email='eoin.oshea@gmail.com'), (SELECT id FROM lots WHERE name='Mobile Home 1 - Willow' AND owner_id=1), CURRENT_DATE - 4, CURRENT_DATE + 3, 6, 840.00, 'CHECKED_IN', 'CAPTURED', 42.00, 882.00, 'ONLINE', 'Family week. BBQ every night!');

-- ---- CONFIRMED bookings (upcoming, payment captured) ----
INSERT INTO bookings (user_id, lot_id, check_in_date, check_out_date, num_guests, total_price, status, payment_status, service_fee, charge_total, booking_source, special_requests) VALUES
    ((SELECT id FROM users WHERE email='megan.power@outlook.ie'), 2, CURRENT_DATE + 1, CURRENT_DATE + 4, 2, 75.00, 'CONFIRMED', 'CAPTURED', 3.75, 78.75, 'ONLINE', 'Early check-in if possible?'),
    ((SELECT id FROM users WHERE email='darragh.healy@gmail.com'), 7, CURRENT_DATE + 2, CURRENT_DATE + 5, 2, 255.00, 'CONFIRMED', 'CAPTURED', 12.75, 267.75, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='clodagh.daly@yahoo.ie'), (SELECT id FROM lots WHERE name='River Lodge' AND owner_id=1), CURRENT_DATE + 3, CURRENT_DATE + 7, 2, 780.00, 'CONFIRMED', 'CAPTURED', 39.00, 819.00, 'ONLINE', 'Anniversary surprise! Partner doesn''t know.'),
    ((SELECT id FROM users WHERE email='cathal.murray@gmail.com'), 4, CURRENT_DATE + 3, CURRENT_DATE + 6, 4, 105.00, 'CONFIRMED', 'CAPTURED', 5.25, 110.25, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='orla.duffy@live.ie'), (SELECT id FROM lots WHERE name='Safari Tent' AND owner_id=1), CURRENT_DATE + 4, CURRENT_DATE + 7, 3, 285.00, 'CONFIRMED', 'CAPTURED', 14.25, 299.25, 'ONLINE', 'Glamping for my 30th birthday!'),
    ((SELECT id FROM users WHERE email='sean.murphy@gmail.com'), 3, CURRENT_DATE + 5, CURRENT_DATE + 8, 4, 75.00, 'CONFIRMED', 'CAPTURED', 3.75, 78.75, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='aoife.kelly@yahoo.ie'), (SELECT id FROM lots WHERE name='Woodland Cabin' AND owner_id=1), CURRENT_DATE + 5, CURRENT_DATE + 9, 4, 560.00, 'CONFIRMED', 'CAPTURED', 28.00, 588.00, 'ONLINE', 'Family of 4, dog-friendly?'),
    ((SELECT id FROM users WHERE email='ciaran.obrien@hotmail.com'), (SELECT id FROM lots WHERE name='Hardstanding G' AND owner_id=1), CURRENT_DATE + 6, CURRENT_DATE + 9, 2, 126.00, 'CONFIRMED', 'CAPTURED', 6.30, 132.30, 'ONLINE', 'Vintage campervan rally weekend!'),
    ((SELECT id FROM users WHERE email='niamh.walsh@gmail.com'), (SELECT id FROM lots WHERE name='Honeybee Glamping Pod' AND owner_id=1), CURRENT_DATE + 7, CURRENT_DATE + 10, 2, 330.00, 'CONFIRMED', 'CAPTURED', 16.50, 346.50, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='padraig.ryan@outlook.ie'), 8, CURRENT_DATE + 7, CURRENT_DATE + 11, 2, 600.00, 'CONFIRMED', 'CAPTURED', 30.00, 630.00, 'ONLINE', 'Can''t believe we got the treehouse!'),
    ((SELECT id FROM users WHERE email='siobhan.doyle@gmail.com'), (SELECT id FROM lots WHERE name='Meadow Pitch 1' AND owner_id=1), CURRENT_DATE + 8, CURRENT_DATE + 11, 4, 66.00, 'CONFIRMED', 'CAPTURED', 3.30, 69.30, 'ONLINE', 'Stargazing trip!'),
    ((SELECT id FROM users WHERE email='declan.lynch@yahoo.com'), (SELECT id FROM lots WHERE name='Mobile Home 2 - Birch' AND owner_id=1), CURRENT_DATE + 10, CURRENT_DATE + 17, 7, 1015.00, 'CONFIRMED', 'CAPTURED', 50.75, 1065.75, 'ONLINE', 'Week-long family reunion.'),
    ((SELECT id FROM users WHERE email='aisling.byrne@gmail.com'), 6, CURRENT_DATE + 10, CURRENT_DATE + 14, 4, 168.00, 'CONFIRMED', 'CAPTURED', 8.40, 176.40, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='oisin.kavanagh@live.ie'), (SELECT id FROM lots WHERE name='Riverside Pitch 4' AND owner_id=1), CURRENT_DATE + 12, CURRENT_DATE + 15, 2, 75.00, 'CONFIRMED', 'CAPTURED', 3.75, 78.75, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='roisin.brennan@gmail.com'), (SELECT id FROM lots WHERE name='Woodland Bell Tent 2' AND owner_id=1), CURRENT_DATE + 14, CURRENT_DATE + 17, 2, 255.00, 'CONFIRMED', 'CAPTURED', 12.75, 267.75, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='conor.mccarthy@yahoo.ie'), 1, CURRENT_DATE + 15, CURRENT_DATE + 18, 3, 75.00, 'CONFIRMED', 'CAPTURED', 3.75, 78.75, 'ONLINE', 'Return visit!'),
    ((SELECT id FROM users WHERE email='emma.nolan@gmail.com'), (SELECT id FROM lots WHERE name='Mobile Home 3 - Alder' AND owner_id=1), CURRENT_DATE + 16, CURRENT_DATE + 23, 4, 910.00, 'CONFIRMED', 'CAPTURED', 45.50, 955.50, 'ONLINE', 'Accessible unit for my dad.'),
    ((SELECT id FROM users WHERE email='liam.fitzgerald@live.com'), (SELECT id FROM lots WHERE name='Hardstanding D' AND owner_id=1), CURRENT_DATE + 18, CURRENT_DATE + 22, 4, 152.00, 'CONFIRMED', 'CAPTURED', 7.60, 159.60, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='sarah.connolly@yahoo.ie'), (SELECT id FROM lots WHERE name='Safari Tent' AND owner_id=1), CURRENT_DATE + 20, CURRENT_DATE + 23, 4, 285.00, 'CONFIRMED', 'CAPTURED', 14.25, 299.25, 'ONLINE', 'Mother-daughter glamping trip.'),
    ((SELECT id FROM users WHERE email='eoin.oshea@gmail.com'), (SELECT id FROM lots WHERE name='Riverside Pitch 6' AND owner_id=1), CURRENT_DATE + 21, CURRENT_DATE + 24, 2, 84.00, 'CONFIRMED', 'CAPTURED', 4.20, 88.20, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='megan.power@outlook.ie'), (SELECT id FROM lots WHERE name='Family Cabin' AND owner_id=1), CURRENT_DATE + 22, CURRENT_DATE + 26, 5, 660.00, 'CONFIRMED', 'CAPTURED', 33.00, 693.00, 'ONLINE', 'Easter family break.'),
    ((SELECT id FROM users WHERE email='darragh.healy@gmail.com'), (SELECT id FROM lots WHERE name='Shepherd''s Hut' AND owner_id=1), CURRENT_DATE + 25, CURRENT_DATE + 28, 2, 375.00, 'CONFIRMED', 'CAPTURED', 18.75, 393.75, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='clodagh.daly@yahoo.ie'), (SELECT id FROM lots WHERE name='Meadow Pitch 2' AND owner_id=1), CURRENT_DATE + 26, CURRENT_DATE + 29, 4, 66.00, 'CONFIRMED', 'CAPTURED', 3.30, 69.30, 'ONLINE', 'Spring wildflower season!');

-- ---- PENDING bookings (awaiting owner confirmation) ----
INSERT INTO bookings (user_id, lot_id, check_in_date, check_out_date, num_guests, total_price, status, payment_status, service_fee, charge_total, booking_source, special_requests) VALUES
    ((SELECT id FROM users WHERE email='cathal.murray@gmail.com'), (SELECT id FROM lots WHERE name='River Lodge' AND owner_id=1), CURRENT_DATE + 8, CURRENT_DATE + 12, 2, 780.00, 'PENDING', 'AUTHORIZED', 39.00, 819.00, 'ONLINE', 'Honeymoon trip! Hot tub a must.'),
    ((SELECT id FROM users WHERE email='orla.duffy@live.ie'), 2, CURRENT_DATE + 9, CURRENT_DATE + 12, 2, 75.00, 'PENDING', 'AUTHORIZED', 3.75, 78.75, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='sean.murphy@gmail.com'), (SELECT id FROM lots WHERE name='Valley Yurt' AND owner_id=1), CURRENT_DATE + 11, CURRENT_DATE + 14, 4, 270.00, 'PENDING', 'AUTHORIZED', 13.50, 283.50, 'ONLINE', 'Yurt life!'),
    ((SELECT id FROM users WHERE email='aoife.kelly@yahoo.ie'), (SELECT id FROM lots WHERE name='Mobile Home 1 - Willow' AND owner_id=1), CURRENT_DATE + 14, CURRENT_DATE + 21, 6, 840.00, 'PENDING', 'AUTHORIZED', 42.00, 882.00, 'ONLINE', 'Week stay with extended family.'),
    ((SELECT id FROM users WHERE email='ciaran.obrien@hotmail.com'), (SELECT id FROM lots WHERE name='Hardstanding E' AND owner_id=1), CURRENT_DATE + 13, CURRENT_DATE + 17, 3, 160.00, 'PENDING', 'AUTHORIZED', 8.00, 168.00, 'ONLINE', NULL),
    ((SELECT id FROM users WHERE email='niamh.walsh@gmail.com'), (SELECT id FROM lots WHERE name='Riverside Pitch 5' AND owner_id=1), CURRENT_DATE + 16, CURRENT_DATE + 19, 4, 75.00, 'PENDING', 'AUTHORIZED', 3.75, 78.75, 'ONLINE', 'Near the playground please!');

-- ---- CANCELLED bookings (scattered through past) ----
INSERT INTO bookings (user_id, lot_id, check_in_date, check_out_date, num_guests, total_price, status, payment_status, service_fee, charge_total, booking_source, special_requests) VALUES
    ((SELECT id FROM users WHERE email='padraig.ryan@outlook.ie'), 1, CURRENT_DATE - 45, CURRENT_DATE - 42, 2, 75.00, 'CANCELLED', 'RELEASED', 3.75, 78.75, 'ONLINE', 'Had to cancel - family emergency.'),
    ((SELECT id FROM users WHERE email='siobhan.doyle@gmail.com'), (SELECT id FROM lots WHERE name='Safari Tent' AND owner_id=1), CURRENT_DATE - 30, CURRENT_DATE - 27, 3, 285.00, 'CANCELLED', 'RELEASED', 14.25, 299.25, 'ONLINE', 'Weather forecast terrible. Rescheduling.'),
    ((SELECT id FROM users WHERE email='declan.lynch@yahoo.com'), 8, CURRENT_DATE - 20, CURRENT_DATE - 17, 2, 450.00, 'CANCELLED', 'RELEASED', 22.50, 472.50, 'ONLINE', 'Plans changed. Sorry!'),
    ((SELECT id FROM users WHERE email='aisling.byrne@gmail.com'), (SELECT id FROM lots WHERE name='Mobile Home 1 - Willow' AND owner_id=1), CURRENT_DATE + 5, CURRENT_DATE + 12, 5, 840.00, 'CANCELLED', 'RELEASED', 42.00, 882.00, 'ONLINE', 'Kids got sick. Will rebook.'),
    ((SELECT id FROM users WHERE email='oisin.kavanagh@live.ie'), (SELECT id FROM lots WHERE name='Woodland Cabin' AND owner_id=1), CURRENT_DATE + 20, CURRENT_DATE + 24, 3, 560.00, 'CANCELLED', 'RELEASED', 28.00, 588.00, 'ONLINE', NULL);

-- ---- MANUAL / WALK-IN bookings ----
INSERT INTO bookings (user_id, lot_id, check_in_date, check_out_date, num_guests, total_price, status, payment_status, booking_source, guest_name, guest_email, guest_phone, created_by_owner_id) VALUES
    (NULL, 3, CURRENT_DATE - 70, CURRENT_DATE - 68, 3, 50.00, 'COMPLETED', 'NONE', 'WALKIN', 'Tom Brennan', 'tom@brennan.ie', '+353 87 123 4567', 1),
    (NULL, 1, CURRENT_DATE - 50, CURRENT_DATE - 47, 2, 75.00, 'COMPLETED', 'NONE', 'PHONE', 'Margaret O''Sullivan', 'margaret@osullivan.ie', '+353 86 234 5678', 1),
    (NULL, 4, CURRENT_DATE - 35, CURRENT_DATE - 32, 4, 105.00, 'COMPLETED', 'NONE', 'DIRECT', 'The Walsh Family', 'walsh.family@gmail.com', '+353 85 345 6789', 1),
    (NULL, 2, CURRENT_DATE - 15, CURRENT_DATE - 12, 2, 75.00, 'COMPLETED', 'NONE', 'PHONE', 'Brian Keane', 'brian.keane@eircom.net', '+353 87 456 7890', 1),
    (NULL, (SELECT id FROM lots WHERE name='Meadow Pitch 1' AND owner_id=1), CURRENT_DATE - 8, CURRENT_DATE - 5, 4, 66.00, 'COMPLETED', 'NONE', 'WALKIN', 'French Cyclists Group', NULL, NULL, 1),
    (NULL, (SELECT id FROM lots WHERE name='Riverside Pitch 4' AND owner_id=1), CURRENT_DATE, CURRENT_DATE + 2, 2, 50.00, 'CHECKED_IN', 'NONE', 'WALKIN', 'John & Mary Nolan', NULL, '+353 89 567 8901', 1),
    (NULL, 6, CURRENT_DATE + 2, CURRENT_DATE + 5, 4, 126.00, 'CONFIRMED', 'NONE', 'PHONE', 'Doyle Caravan Club', 'info@doyleclub.ie', '+353 86 678 9012', 1),
    (NULL, (SELECT id FROM lots WHERE name='Hardstanding G' AND owner_id=1), CURRENT_DATE + 5, CURRENT_DATE + 8, 2, 126.00, 'CONFIRMED', 'NONE', 'DIRECT', 'Hans & Greta Weber', 'weber@web.de', '+49 170 123 4567', 1);


-- ============================================================================
-- 5. BLOCKED PERIODS — maintenance, personal use, events
-- ============================================================================

INSERT INTO lot_blocked_periods (lot_id, start_date, end_date, reason, created_by) VALUES
    -- Maintenance
    (1, CURRENT_DATE + 30, CURRENT_DATE + 33, 'Pitch drainage repair', 1),
    (2, CURRENT_DATE + 30, CURRENT_DATE + 33, 'Pitch drainage repair', 1),
    ((SELECT id FROM lots WHERE name='River Lodge' AND owner_id=1), CURRENT_DATE + 28, CURRENT_DATE + 32, 'Hot tub annual servicing', 1),
    ((SELECT id FROM lots WHERE name='Safari Tent' AND owner_id=1), CURRENT_DATE + 35, CURRENT_DATE + 38, 'Canvas re-waterproofing', 1),
    ((SELECT id FROM lots WHERE name='Valley Yurt' AND owner_id=1), CURRENT_DATE + 35, CURRENT_DATE + 38, 'Stove flue cleaning', 1),
    -- Personal use
    (8, CURRENT_DATE + 30, CURRENT_DATE + 35, 'Family stay - owner use', 1),
    ((SELECT id FROM lots WHERE name='Woodland Cabin' AND owner_id=1), CURRENT_DATE + 38, CURRENT_DATE + 42, 'Owner family holiday', 1),
    -- Event block
    ((SELECT id FROM lots WHERE name='Meadow Pitch 3' AND owner_id=1), CURRENT_DATE + 25, CURRENT_DATE + 28, 'Private group event booked directly', 1),
    -- Past blocks (for realistic history)
    (4, CURRENT_DATE - 100, CURRENT_DATE - 95, 'Electric hookup replacement', 1),
    (5, CURRENT_DATE - 100, CURRENT_DATE - 95, 'Electric hookup replacement', 1),
    ((SELECT id FROM lots WHERE name='Family Cabin' AND owner_id=1), CURRENT_DATE - 60, CURRENT_DATE - 55, 'Deep clean and mattress replacement', 1),
    ((SELECT id FROM lots WHERE name='Mobile Home 2 - Birch' AND owner_id=1), CURRENT_DATE - 40, CURRENT_DATE - 35, 'Plumbing repair - burst pipe', 1);


-- ============================================================================
-- 6. REVIEWS — on completed Nore Valley bookings
-- ============================================================================

-- We need booking IDs. Using subselects on the bookings we just created.
-- Reviews reference bookings on lots owned by owner_id=1.
-- We'll insert reviews for many of the completed bookings.

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, created_at) VALUES
    ((SELECT id FROM users WHERE email='sean.murphy@gmail.com'), 1,
     (SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='sean.murphy@gmail.com') AND b.status='COMPLETED' ORDER BY b.check_in_date LIMIT 1),
     4.5, 'Lovely riverside pitch with the sound of flowing water. Facilities were clean and well-maintained. The farm shop on site is a great bonus. Will definitely return!', CURRENT_DATE - 85);

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, created_at) VALUES
    ((SELECT id FROM users WHERE email='aoife.kelly@yahoo.ie'), 1,
     (SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='aoife.kelly@yahoo.ie') AND b.status='COMPLETED' ORDER BY b.check_in_date LIMIT 1),
     5.0, 'Absolutely perfect camping spot. Quiet, peaceful, and the pitch was perfectly flat. Nore Valley is our new favourite campsite in Kilkenny.', CURRENT_DATE - 83);

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, created_at) VALUES
    ((SELECT id FROM users WHERE email='ciaran.obrien@hotmail.com'), 1,
     (SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='ciaran.obrien@hotmail.com') AND b.status='COMPLETED' ORDER BY b.check_in_date LIMIT 1),
     4.0, 'Good hardstanding for our motorhome. Electric hookup worked perfectly. Only minor issue was the pitch was slightly narrower than expected for our 7.5m vehicle. Overall a great stay.', CURRENT_DATE - 82);

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, created_at) VALUES
    ((SELECT id FROM users WHERE email='niamh.walsh@gmail.com'), 1,
     (SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='niamh.walsh@gmail.com') AND b.status='COMPLETED' ORDER BY b.check_in_date LIMIT 1),
     5.0, 'The bell tent was magical! Fairy lights, wood burner, proper bed - everything was perfect for our honeymoon. The woodland setting is so peaceful. 10/10.', CURRENT_DATE - 81);

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, created_at) VALUES
    ((SELECT id FROM users WHERE email='padraig.ryan@outlook.ie'), 1,
     (SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='padraig.ryan@outlook.ie') AND b.status='COMPLETED' ORDER BY b.check_in_date LIMIT 1),
     5.0, 'Treehouse Retreat is genuinely one of the best accommodation experiences we''ve had in Ireland. The views are stunning, the breakfast basket was a lovely touch, and the whole place oozes charm. Worth every cent.', CURRENT_DATE - 80);

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, created_at) VALUES
    ((SELECT id FROM users WHERE email='siobhan.doyle@gmail.com'), 1,
     (SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='siobhan.doyle@gmail.com') AND b.status='COMPLETED' ORDER BY b.check_in_date LIMIT 1),
     4.0, 'Nice pitch by the river. Showers were hot and clean. Only downside was noise from the road on windy nights. Otherwise a solid campsite.', CURRENT_DATE - 79);

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, created_at) VALUES
    ((SELECT id FROM users WHERE email='declan.lynch@yahoo.com'), 1,
     (SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='declan.lynch@yahoo.com') AND b.status='COMPLETED' ORDER BY b.check_in_date LIMIT 1),
     4.5, 'Great touring pitch with the family. Kids loved the playground and the farm animals. Easy access to Kilkenny city for day trips. Friendly staff throughout.', CURRENT_DATE - 78);

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, created_at) VALUES
    ((SELECT id FROM users WHERE email='aisling.byrne@gmail.com'), 1,
     (SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='aisling.byrne@gmail.com') AND b.status='COMPLETED' ORDER BY b.check_in_date LIMIT 1),
     4.5, 'Spacious pitch with everything we needed. Good water pressure in the showers. The recycling system is impressive. Eco-conscious camping done right.', CURRENT_DATE - 76);

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, created_at) VALUES
    ((SELECT id FROM users WHERE email='oisin.kavanagh@live.ie'), 1,
     (SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='oisin.kavanagh@live.ie') AND b.status='COMPLETED' ORDER BY b.check_in_date LIMIT 1),
     4.0, 'Good base for hiking the South Leinster Way. The pitch was clean and well-positioned. Would appreciate more power points in the shower block.', CURRENT_DATE - 75);

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, created_at) VALUES
    ((SELECT id FROM users WHERE email='roisin.brennan@gmail.com'), 1,
     (SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='roisin.brennan@gmail.com') AND b.status='COMPLETED' ORDER BY b.check_in_date LIMIT 1),
     5.0, 'Safari tent was incredible! My mum had the best birthday ever. The attention to detail is amazing - from the bedding to the cooking equipment. Five stars!', CURRENT_DATE - 74);

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, created_at) VALUES
    ((SELECT id FROM users WHERE email='conor.mccarthy@yahoo.ie'), 1,
     (SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='conor.mccarthy@yahoo.ie') AND b.status='COMPLETED' ORDER BY b.check_in_date LIMIT 1),
     4.5, 'The family cabin was perfect for us. Fully equipped kitchen, comfortable beds, and the veranda was great for evening BBQs. Kids had a brilliant time.', CURRENT_DATE - 72);

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, created_at) VALUES
    ((SELECT id FROM users WHERE email='emma.nolan@gmail.com'), 1,
     (SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='emma.nolan@gmail.com') AND b.status='COMPLETED' ORDER BY b.check_in_date LIMIT 1),
     4.5, 'Valley Yurt was a wonderful experience. So peaceful. The sheepskin rugs and skylight make it feel really special. Perfect yoga retreat location.', CURRENT_DATE - 72);

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, created_at) VALUES
    ((SELECT id FROM users WHERE email='liam.fitzgerald@live.com'), 1,
     (SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='liam.fitzgerald@live.com') AND b.status='COMPLETED' ORDER BY b.check_in_date LIMIT 1),
     3.5, 'Decent touring pitch. Hookup worked well. Shower block could use a refresh - tiles a bit tired. Location is great though and staff were helpful.', CURRENT_DATE - 71);

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, created_at) VALUES
    ((SELECT id FROM users WHERE email='sarah.connolly@yahoo.ie'), 1,
     (SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='sarah.connolly@yahoo.ie') AND b.status='COMPLETED' ORDER BY b.check_in_date LIMIT 1),
     5.0, 'The mobile home was amazing value for the whole family. Everything we needed for a week. Kids had the time of their lives. Already booked again!', CURRENT_DATE - 66);

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, created_at) VALUES
    ((SELECT id FROM users WHERE email='eoin.oshea@gmail.com'), 1,
     (SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='eoin.oshea@gmail.com') AND b.status='COMPLETED' ORDER BY b.check_in_date LIMIT 1),
     4.0, 'Nice pitch close to the river. Good for fishing. The Nore is beautiful around here. Facilities are basic but clean. Would come back for the fishing alone.', CURRENT_DATE - 69);

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, created_at) VALUES
    ((SELECT id FROM users WHERE email='megan.power@outlook.ie'), 1,
     (SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='megan.power@outlook.ie') AND b.status='COMPLETED' ORDER BY b.check_in_date LIMIT 1),
     4.5, 'Comfortable pitch and great location. The farm shop had amazing local produce. Staff went above and beyond when we had a flat tyre. True Irish hospitality.', CURRENT_DATE - 65);

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, created_at) VALUES
    ((SELECT id FROM users WHERE email='darragh.healy@gmail.com'), 1,
     (SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='darragh.healy@gmail.com') AND b.status='COMPLETED' ORDER BY b.check_in_date LIMIT 1),
     5.0, 'River Lodge was beyond our expectations. The hot tub overlooking the river at sunset was pure magic. She said yes! Thank you Nore Valley for making our proposal perfect!', CURRENT_DATE - 63);

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, created_at) VALUES
    ((SELECT id FROM users WHERE email='clodagh.daly@yahoo.ie'), 1,
     (SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='clodagh.daly@yahoo.ie') AND b.status='COMPLETED' ORDER BY b.check_in_date LIMIT 1),
     4.0, 'Third visit and still love it. Riverside pitches are our favourite. Would be nice to have more recycling bins near the pitches. But overall, wonderful as always.', CURRENT_DATE - 63);

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, created_at) VALUES
    ((SELECT id FROM users WHERE email='cathal.murray@gmail.com'), 1,
     (SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='cathal.murray@gmail.com') AND b.status='COMPLETED' ORDER BY b.check_in_date LIMIT 1),
     4.5, 'VW campervan fit perfectly on the touring pitch. Loved the vintage vibe of the whole campsite. Farm shop sourdough is incredible. Great WiFi for remote working too.', CURRENT_DATE - 61);

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, created_at) VALUES
    ((SELECT id FROM users WHERE email='orla.duffy@live.ie'), 1,
     (SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='orla.duffy@live.ie') AND b.status='COMPLETED' ORDER BY b.check_in_date LIMIT 1),
     5.0, 'Bell tent glamping at its finest! Everything was spotless. The woodland setting with fairy lights is just dreamy. Can''t recommend highly enough.', CURRENT_DATE - 61);

-- Add some owner responses to reviews
UPDATE reviews SET
    owner_response = 'Thank you Sean! So glad you enjoyed the riverside pitch. The farm shop is our pride and joy. See you again soon!',
    owner_response_at = created_at + INTERVAL '2 days'
WHERE id = (SELECT r.id FROM reviews r WHERE r.user_id = (SELECT id FROM users WHERE email='sean.murphy@gmail.com') AND r.owner_id = 1 ORDER BY r.created_at LIMIT 1);
UPDATE reviews SET
    owner_response = 'What a lovely review Aoife! We''re thrilled you enjoyed your stay. You''re welcome back any time!',
    owner_response_at = created_at + INTERVAL '1 day'
WHERE id = (SELECT r.id FROM reviews r WHERE r.user_id = (SELECT id FROM users WHERE email='aoife.kelly@yahoo.ie') AND r.owner_id = 1 ORDER BY r.created_at LIMIT 1);

UPDATE reviews SET
    owner_response = 'Thank you for the feedback Ciaran. We''re looking at widening our motorhome pitches this winter. Glad the hookup worked well!',
    owner_response_at = created_at + INTERVAL '3 days'
WHERE id = (SELECT r.id FROM reviews r WHERE r.user_id = (SELECT id FROM users WHERE email='ciaran.obrien@hotmail.com') AND r.owner_id = 1 ORDER BY r.created_at LIMIT 1);

UPDATE reviews SET
    owner_response = 'Congratulations on your honeymoon Niamh! The bell tent is our favourite too. We hope you''ll come back for your anniversary!',
    owner_response_at = created_at + INTERVAL '1 day'
WHERE id = (SELECT r.id FROM reviews r WHERE r.user_id = (SELECT id FROM users WHERE email='niamh.walsh@gmail.com') AND r.owner_id = 1 ORDER BY r.created_at LIMIT 1);

UPDATE reviews SET
    owner_response = 'Darragh, CONGRATULATIONS! We''re so honoured the River Lodge was part of your proposal. Wishing you both a lifetime of happiness!',
    owner_response_at = created_at + INTERVAL '1 day'
WHERE id = (SELECT r.id FROM reviews r WHERE r.user_id = (SELECT id FROM users WHERE email='darragh.healy@gmail.com') AND r.owner_id = 1 ORDER BY r.created_at LIMIT 1);

UPDATE reviews SET
    owner_response = 'Thanks for the honest feedback Liam. We hear you on the shower block - refurbishment is scheduled for this spring!',
    owner_response_at = created_at + INTERVAL '2 days'
WHERE id = (SELECT r.id FROM reviews r WHERE r.user_id = (SELECT id FROM users WHERE email='liam.fitzgerald@live.com') AND r.owner_id = 1 ORDER BY r.created_at LIMIT 1);

-- Update owner aggregate rating
UPDATE owners SET
    rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE owner_id = 1),
    review_count = (SELECT COUNT(*) FROM reviews WHERE owner_id = 1)
WHERE id = 1;


-- ============================================================================
-- 7. MESSAGES — conversations on some bookings
-- ============================================================================

-- Messages on a checked-in booking
INSERT INTO messages (booking_id, sender_id, content, is_read, created_at) VALUES
    ((SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='oisin.kavanagh@live.ie') AND b.status='CHECKED_IN' LIMIT 1),
     (SELECT id FROM users WHERE email='oisin.kavanagh@live.ie'),
     'Hi! Just checked in. Is there a good spot nearby for fly fishing on the Nore?', TRUE, CURRENT_DATE - 1 + TIME '14:30:00'),

    ((SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='oisin.kavanagh@live.ie') AND b.status='CHECKED_IN' LIMIT 1),
     1,
     'Welcome Oisin! Great to have you. The best spot is about 500m downstream from pitch 3 - there is a deep pool that holds trout. Ask at reception for a fishing permit (free for guests). Tight lines!', TRUE, CURRENT_DATE - 1 + TIME '15:15:00'),

    ((SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='oisin.kavanagh@live.ie') AND b.status='CHECKED_IN' LIMIT 1),
     (SELECT id FROM users WHERE email='oisin.kavanagh@live.ie'),
     'Brilliant, thanks! Caught a lovely brown trout already. This is the life!', TRUE, CURRENT_DATE + TIME '09:45:00');

-- Messages on an upcoming confirmed booking
INSERT INTO messages (booking_id, sender_id, content, is_read, created_at) VALUES
    ((SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='clodagh.daly@yahoo.ie') AND b.status='CONFIRMED' AND b.check_in_date > CURRENT_DATE ORDER BY b.check_in_date LIMIT 1),
     (SELECT id FROM users WHERE email='clodagh.daly@yahoo.ie'),
     'Hi there! Looking forward to our stay. Quick question - is the River Lodge wheelchair accessible? My mum uses a walker.', FALSE, CURRENT_DATE + TIME '10:20:00');

-- Messages on a pending booking
INSERT INTO messages (booking_id, sender_id, content, is_read, created_at) VALUES
    ((SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='cathal.murray@gmail.com') AND b.status='PENDING' LIMIT 1),
     (SELECT id FROM users WHERE email='cathal.murray@gmail.com'),
     'Hi! This is for our honeymoon. Could you possibly have some champagne and chocolates waiting in the lodge? Happy to pay extra!', FALSE, CURRENT_DATE + TIME '11:00:00');

-- Messages on the family mobile home stay
INSERT INTO messages (booking_id, sender_id, content, is_read, created_at) VALUES
    ((SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='eoin.oshea@gmail.com') AND b.status='CHECKED_IN' LIMIT 1),
     (SELECT id FROM users WHERE email='eoin.oshea@gmail.com'),
     'Just wanted to say the mobile home is spotless and the kids are having a ball. The BBQ is a great touch!', TRUE, CURRENT_DATE - 2 + TIME '18:30:00'),

    ((SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='eoin.oshea@gmail.com') AND b.status='CHECKED_IN' LIMIT 1),
     1,
     'Wonderful to hear Eoin! Make sure to check out the nature trail behind the mobile homes - the kids will love the fairy doors on the trees. Enjoy your week!', TRUE, CURRENT_DATE - 2 + TIME '19:00:00'),

    ((SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='eoin.oshea@gmail.com') AND b.status='CHECKED_IN' LIMIT 1),
     (SELECT id FROM users WHERE email='eoin.oshea@gmail.com'),
     'The fairy doors were a huge hit! Quick one - is there a local takeaway that delivers? Thinking pizza night tonight.', TRUE, CURRENT_DATE - 1 + TIME '16:00:00'),

    ((SELECT b.id FROM bookings b JOIN lots l ON b.lot_id=l.id WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='eoin.oshea@gmail.com') AND b.status='CHECKED_IN' LIMIT 1),
     1,
     'Glad they loved it! Bennettsbridge doesn''t have delivery but Kilkenny Pizza Co delivers out here. Their number is 056 772 1234. Tell them you''re at Nore Valley and they know the way!', TRUE, CURRENT_DATE - 1 + TIME '16:30:00');


-- ============================================================================
-- 8. NOTIFICATIONS for the owner
-- ============================================================================

INSERT INTO notifications (user_id, type, title, message, link, is_read, created_at) VALUES
    (1, 'BOOKING_CREATED', 'New Booking', 'Megan Power has booked Riverside Pitch 2 for 3 nights', '/owner/bookings', TRUE, CURRENT_DATE - 3 + TIME '09:15:00'),
    (1, 'BOOKING_CREATED', 'New Booking', 'Darragh Healy has booked Woodland Bell Tent for 3 nights', '/owner/bookings', TRUE, CURRENT_DATE - 3 + TIME '14:22:00'),
    (1, 'BOOKING_CREATED', 'New Booking', 'Clodagh Daly has booked River Lodge for 4 nights', '/owner/bookings', TRUE, CURRENT_DATE - 2 + TIME '10:05:00'),
    (1, 'BOOKING_CREATED', 'New Booking', 'Cathal Murray has booked Hardstanding A for 3 nights', '/owner/bookings', TRUE, CURRENT_DATE - 2 + TIME '11:30:00'),
    (1, 'BOOKING_CREATED', 'New Booking', 'Orla Duffy has booked Safari Tent for 3 nights', '/owner/bookings', TRUE, CURRENT_DATE - 1 + TIME '08:45:00'),
    (1, 'CHECK_IN', 'Guest Checked In', 'Oisin Kavanagh has checked into Riverside Pitch 1', '/owner/today', TRUE, CURRENT_DATE - 2 + TIME '15:00:00'),
    (1, 'CHECK_IN', 'Guest Checked In', 'Conor McCarthy has checked into Hardstanding B', '/owner/today', TRUE, CURRENT_DATE - 3 + TIME '14:30:00'),
    (1, 'CHECK_IN', 'Guest Checked In', 'Eoin O''Shea has checked into Mobile Home 1 - Willow', '/owner/today', TRUE, CURRENT_DATE - 4 + TIME '16:00:00'),
    (1, 'REVIEW_CREATED', 'New Review', 'Aisling Byrne left a 4.5-star review for River Lodge', '/owner/reviews', FALSE, CURRENT_DATE - 3 + TIME '12:00:00'),
    (1, 'REVIEW_CREATED', 'New Review', 'Declan Lynch left a 4.5-star review for Woodland Bell Tent', '/owner/reviews', FALSE, CURRENT_DATE - 5 + TIME '09:30:00'),
    (1, 'BOOKING_CREATED', 'New Booking Request', 'Cathal Murray requests River Lodge for 4 nights - awaiting confirmation', '/owner/bookings', FALSE, CURRENT_DATE + TIME '08:15:00'),
    (1, 'BOOKING_CREATED', 'New Booking Request', 'Orla Duffy requests Riverside Pitch 2 for 3 nights - awaiting confirmation', '/owner/bookings', FALSE, CURRENT_DATE + TIME '09:30:00'),
    (1, 'MESSAGE_RECEIVED', 'New Message', 'Clodagh Daly sent a message about their upcoming River Lodge booking', '/owner/messages', FALSE, CURRENT_DATE + TIME '10:20:00'),
    (1, 'MESSAGE_RECEIVED', 'New Message', 'Cathal Murray sent a message about their River Lodge booking request', '/owner/messages', FALSE, CURRENT_DATE + TIME '11:00:00');


-- ============================================================================
-- 9. BOOKING MODIFICATION LOG — a few past modifications
-- ============================================================================

-- Simulate an owner moving a guest to a different pitch
INSERT INTO booking_modification_log (booking_id, modified_by_user_id, modification_type, previous_lot_id, new_lot_id, previous_check_in_date, new_check_in_date, previous_check_out_date, new_check_out_date, previous_total_price, new_total_price, price_adjustment, reason, initiated_by, created_at)
SELECT b.id, 1, 'LOT_CHANGE', 2, 3, b.check_in_date, b.check_in_date, b.check_out_date, b.check_out_date, 75.00, 75.00, 0.00, 'Moved to pitch 3 due to waterlogging on pitch 2 after rain', 'OWNER', b.created_at + INTERVAL '1 day'
FROM bookings b JOIN lots l ON b.lot_id=l.id
WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='roisin.brennan@gmail.com') AND b.status='COMPLETED' AND b.lot_id=2
LIMIT 1;

-- Simulate extending a stay
INSERT INTO booking_modification_log (booking_id, modified_by_user_id, modification_type, previous_lot_id, new_lot_id, previous_check_in_date, new_check_in_date, previous_check_out_date, new_check_out_date, previous_total_price, new_total_price, price_adjustment, reason, initiated_by, created_at)
SELECT b.id, 1, 'DATE_CHANGE', b.lot_id, b.lot_id, b.check_in_date, b.check_in_date, b.check_out_date, b.check_out_date + 1, b.total_price, b.total_price + 25.00, 25.00, 'Guest requested extra night at reception', 'OWNER', b.created_at + INTERVAL '2 days'
FROM bookings b JOIN lots l ON b.lot_id=l.id
WHERE l.owner_id=1 AND b.user_id=(SELECT id FROM users WHERE email='liam.fitzgerald@live.com') AND b.status='COMPLETED' AND l.lot_type='TENT'
ORDER BY b.check_in_date DESC LIMIT 1;
