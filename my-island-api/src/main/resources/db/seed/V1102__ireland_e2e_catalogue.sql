-- V1102: Ireland e2e catalogue for a production-like local dev instance
-- Auto-loaded by Flyway when spring.profiles.active=dev (see start.sh).
-- Mock listings inspired by popular Irish camping regions; original brand names.
-- Extra catalogue users use password: password

--------------------------------------------------------------------------------
-- 1. Platform: enable booking so the local instance feels like a live marketplace
--------------------------------------------------------------------------------
UPDATE feature_toggle
SET enabled = TRUE,
    description = 'When enabled, full booking functionality is available. Seeded TRUE in local dev so the Ireland catalogue can be booked end-to-end.',
    updated_at = NOW()
WHERE name = 'BOOKING_ENABLED';

--------------------------------------------------------------------------------
-- 2. Activate subscriptions for every owner/supplier except the two gate-test accounts
--------------------------------------------------------------------------------
UPDATE owners
SET subscription_status = 'ACTIVE',
    stripe_customer_id = COALESCE(stripe_customer_id, 'cus_e2e_owner_' || id),
    stripe_subscription_id = COALESCE(stripe_subscription_id, 'sub_e2e_owner_' || id),
    subscription_current_period_end = CURRENT_TIMESTAMP + INTERVAL '365 days',
    subscription_cancel_at_period_end = FALSE
WHERE subscription_status IN ('NONE', 'CANCELED', 'UNPAID')
  AND user_id NOT IN (SELECT id FROM users WHERE email = 'bookings@loughdergcamping.ie');

UPDATE suppliers
SET subscription_status = 'ACTIVE',
    stripe_customer_id = COALESCE(stripe_customer_id, 'cus_e2e_supplier_' || id),
    stripe_subscription_id = COALESCE(stripe_subscription_id, 'sub_e2e_supplier_' || id),
    subscription_current_period_end = CURRENT_TIMESTAMP + INTERVAL '365 days',
    subscription_cancel_at_period_end = FALSE
WHERE subscription_status IN ('NONE', 'CANCELED', 'UNPAID')
  AND user_id NOT IN (SELECT id FROM users WHERE email = 'hello@dinglekayak.ie');

--------------------------------------------------------------------------------
-- 3. New campsites covering previously missing counties (Dublin, Kildare, Carlow,
--    Cavan, Longford, Monaghan, Roscommon, Armagh, Tyrone, Derry) plus extra
--    popular destinations (Portrush, Cong)
--------------------------------------------------------------------------------
INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'corkagh@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Corkagh Park Host', 'OWNER', TRUE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'corkagh@myisland.com');

INSERT INTO owners (user_id, property_name, county, town, property_type, description, latitude, longitude, phone, website,
                    subscription_status, stripe_customer_id, stripe_subscription_id, subscription_current_period_end,
                    instant_booking, is_featured, featured_until)
SELECT u.id,
       'Corkagh Touring Park', 'Dublin', 'Clondalkin', 'TOURING',
       'Dublin''s gateway touring park on the 300-acre Corkagh Park demesne. Fully serviced hardstandings with hedged gardens, a playground, and tarmac walks to fishing lakes and rose gardens. Ten minutes from the Red Cow Luas and a 25-minute drive to Dublin Airport — the classic first-night stop for island tours.', 53.3169, -6.4032, '+353 1 464 0100', 'https://corkaghtouring.ie',
       'ACTIVE', 'cus_e2e_owner_' || u.id, 'sub_e2e_owner_' || u.id, CURRENT_TIMESTAMP + INTERVAL '365 days',
       TRUE, TRUE, CURRENT_TIMESTAMP + INTERVAL '120 days'
FROM users u WHERE u.email = 'corkagh@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM owners o WHERE o.user_id = u.id);

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Hedged Hardstanding 1', 'TOURING', 'Level 10m hardstanding with 16A electric, water and grey-water points, screened by beech hedges.', 42.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'corkagh@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Hedged Hardstanding 1');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Hedged Hardstanding 2', 'TOURING', 'Family touring pitch with awning space and easy access to the playground and putting green.', 45.00, 6, 1, TRUE, 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'corkagh@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Hedged Hardstanding 2');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Parkland Tent Pitch', 'TENT', 'Grassy pitch beside woodland walks. Shared facilities a two-minute stroll away.', 28.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'corkagh@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Parkland Tent Pitch');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Family Mobile Home', 'MOBILE_HOME', 'Three-bedroom static with kitchen, living area and a small enclosed garden. Sleeps six.', 145.00, 6, 2, TRUE, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'corkagh@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Family Mobile Home');

INSERT INTO campsite_amenities (owner_id, amenity_id)
SELECT o.id, a.id
FROM owners o JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'corkagh@myisland.com'
  AND a.name IN ('WiFi', 'Electricity', 'Water Hookup', 'Toilet', 'Shower', 'Playground', 'Parking', 'Laundry', 'Shop', 'Reception', 'Security')
ON CONFLICT DO NOTHING;

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id
FROM lots l
JOIN owners o ON l.owner_id = o.id
JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'corkagh@myisland.com'
  AND (
        (l.lot_type = 'TOURING' AND a.name IN ('Electricity', 'Water Hookup', 'Parking'))
     OR (l.lot_type = 'TENT' AND a.name IN ('Fire Pit', 'Picnic Table', 'Parking'))
     OR (l.lot_type = 'GLAMPING' AND a.name IN ('WiFi', 'Electricity', 'Fire Pit'))
     OR (l.lot_type IN ('CABIN', 'MOBILE_HOME') AND a.name IN ('WiFi', 'Electricity', 'Parking'))
  )
ON CONFLICT DO NOTHING;

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'howth.camp@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Howth Head Host', 'OWNER', TRUE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'howth.camp@myisland.com');

INSERT INTO owners (user_id, property_name, county, town, property_type, description, latitude, longitude, phone, website,
                    subscription_status, stripe_customer_id, stripe_subscription_id, subscription_current_period_end,
                    instant_booking, is_featured, featured_until)
SELECT u.id,
       'Howth Head Coastal Camp', 'Dublin', 'Howth', 'TENT',
       'Cliff-edge camping above Dublin Bay with the Howth Cliff Walk at the gate. Watch the Dublin-Holyhead ferry from your tent, then walk into Howth village for lobster and live trad. DART station is 15 minutes on foot — city nightlife without giving up the sea air.', 53.3865, -6.0733, '+353 1 832 2200', 'https://howthheadcamp.ie',
       'ACTIVE', 'cus_e2e_owner_' || u.id, 'sub_e2e_owner_' || u.id, CURRENT_TIMESTAMP + INTERVAL '365 days',
       TRUE, FALSE, NULL
FROM users u WHERE u.email = 'howth.camp@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM owners o WHERE o.user_id = u.id);

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Cliff Meadow Pitch', 'TENT', 'Elevated grass pitch with Ireland''s Eye views. Sheltered by gorse. Bring pegs for the breeze.', 32.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'howth.camp@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Cliff Meadow Pitch');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Harbour View Pitch', 'TENT', 'Slightly lower pitch facing Howth Harbour lights. Quieter on windy nights.', 30.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'howth.camp@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Harbour View Pitch');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Bailey Pod', 'GLAMPING', 'Cedar pod with a picture window toward the Bailey Lighthouse. King bed, kettle, and electric blanket.', 135.00, 2, 2, TRUE, 'https://images.unsplash.com/photo-1618767689160-da3fb810aad7?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'howth.camp@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Bailey Pod');

INSERT INTO campsite_amenities (owner_id, amenity_id)
SELECT o.id, a.id
FROM owners o JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'howth.camp@myisland.com'
  AND a.name IN ('WiFi', 'Toilet', 'Shower', 'Parking', 'Hiking', 'Reception', 'Pet Friendly')
ON CONFLICT DO NOTHING;

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id
FROM lots l
JOIN owners o ON l.owner_id = o.id
JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'howth.camp@myisland.com'
  AND (
        (l.lot_type = 'TOURING' AND a.name IN ('Electricity', 'Water Hookup', 'Parking'))
     OR (l.lot_type = 'TENT' AND a.name IN ('Fire Pit', 'Picnic Table', 'Parking'))
     OR (l.lot_type = 'GLAMPING' AND a.name IN ('WiFi', 'Electricity', 'Fire Pit'))
     OR (l.lot_type IN ('CABIN', 'MOBILE_HOME') AND a.name IN ('WiFi', 'Electricity', 'Parking'))
  )
ON CONFLICT DO NOTHING;

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'curragh.farm@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Curragh Farm Host', 'OWNER', TRUE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'curragh.farm@myisland.com');

INSERT INTO owners (user_id, property_name, county, town, property_type, description, latitude, longitude, phone, website,
                    subscription_status, stripe_customer_id, stripe_subscription_id, subscription_current_period_end,
                    instant_booking, is_featured, featured_until)
SELECT u.id,
       'Curragh Farm Camping', 'Kildare', 'Athy', 'TOURING',
       'Family-run park on a working 140-acre farm of mature beech and evergreen, three miles from heritage-town Athy. Touring pitches sit well back from the road. The Curragh, Irish National Stud and Japanese Gardens are a short drive; the Barrow and Grand Canal offer coarse and game fishing.', 52.9919, -6.9835, '+353 59 863 1200', 'https://curraghfarmcamping.ie',
       'ACTIVE', 'cus_e2e_owner_' || u.id, 'sub_e2e_owner_' || u.id, CURRENT_TIMESTAMP + INTERVAL '365 days',
       TRUE, FALSE, NULL
FROM users u WHERE u.email = 'curragh.farm@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM owners o WHERE o.user_id = u.id);

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Beech Avenue Pitch', 'TOURING', 'Hardstanding under mature beech with 16A hookup. Quiet even on rally weekends.', 36.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'curragh.farm@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Beech Avenue Pitch');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Farm Meadow Tent', 'TENT', 'Open grass beside the farm track. Morning light, hens for company, and a camper''s kitchen nearby.', 24.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'curragh.farm@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Farm Meadow Tent');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Orchard Pod', 'GLAMPING', 'Insulated pod at the edge of the old orchard. Double bed, heater, and farm-egg breakfast optional.', 95.00, 2, 2, TRUE, 'https://images.unsplash.com/photo-1618767689160-da3fb810aad7?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'curragh.farm@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Orchard Pod');

INSERT INTO campsite_amenities (owner_id, amenity_id)
SELECT o.id, a.id
FROM owners o JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'curragh.farm@myisland.com'
  AND a.name IN ('WiFi', 'Electricity', 'Toilet', 'Shower', 'Parking', 'Laundry', 'Pet Friendly', 'Reception', 'Fishing')
ON CONFLICT DO NOTHING;

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id
FROM lots l
JOIN owners o ON l.owner_id = o.id
JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'curragh.farm@myisland.com'
  AND (
        (l.lot_type = 'TOURING' AND a.name IN ('Electricity', 'Water Hookup', 'Parking'))
     OR (l.lot_type = 'TENT' AND a.name IN ('Fire Pit', 'Picnic Table', 'Parking'))
     OR (l.lot_type = 'GLAMPING' AND a.name IN ('WiFi', 'Electricity', 'Fire Pit'))
     OR (l.lot_type IN ('CABIN', 'MOBILE_HOME') AND a.name IN ('WiFi', 'Electricity', 'Parking'))
  )
ON CONFLICT DO NOTHING;

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'punchestown@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Punchestown Meadows Host', 'OWNER', TRUE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'punchestown@myisland.com');

INSERT INTO owners (user_id, property_name, county, town, property_type, description, latitude, longitude, phone, website,
                    subscription_status, stripe_customer_id, stripe_subscription_id, subscription_current_period_end,
                    instant_booking, is_featured, featured_until)
SELECT u.id,
       'Punchestown Meadows', 'Kildare', 'Naas', 'TENT',
       'Open meadow camping on the edge of Punchestown. Race-week buzz in April and a sleepy Kildare hideaway the rest of the year. Naas town, the canal greenway and Dublin are all an easy hop. Hardstandings for vans plus a wildflower field for tents.', 53.1844, -6.6267, '+353 45 897 200', 'https://punchestownmeadows.ie',
       'ACTIVE', 'cus_e2e_owner_' || u.id, 'sub_e2e_owner_' || u.id, CURRENT_TIMESTAMP + INTERVAL '365 days',
       TRUE, FALSE, NULL
FROM users u WHERE u.email = 'punchestown@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM owners o WHERE o.user_id = u.id);

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Racecourse Meadow', 'TENT', 'Big grass pitch in a wildflower field. Festival weekends book out months ahead.', 26.00, 6, 1, TRUE, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'punchestown@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Racecourse Meadow');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Canal Bank Touring', 'TOURING', 'Level touring bay with electric, a short walk from the Grand Canal towpath.', 38.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'punchestown@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Canal Bank Touring');

INSERT INTO campsite_amenities (owner_id, amenity_id)
SELECT o.id, a.id
FROM owners o JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'punchestown@myisland.com'
  AND a.name IN ('Toilet', 'Shower', 'Parking', 'Pet Friendly', 'Cycling', 'Reception')
ON CONFLICT DO NOTHING;

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id
FROM lots l
JOIN owners o ON l.owner_id = o.id
JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'punchestown@myisland.com'
  AND (
        (l.lot_type = 'TOURING' AND a.name IN ('Electricity', 'Water Hookup', 'Parking'))
     OR (l.lot_type = 'TENT' AND a.name IN ('Fire Pit', 'Picnic Table', 'Parking'))
     OR (l.lot_type = 'GLAMPING' AND a.name IN ('WiFi', 'Electricity', 'Fire Pit'))
     OR (l.lot_type IN ('CABIN', 'MOBILE_HOME') AND a.name IN ('WiFi', 'Electricity', 'Parking'))
  )
ON CONFLICT DO NOTHING;

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'blackstairs@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Blackstairs Eco Host', 'OWNER', TRUE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'blackstairs@myisland.com');

INSERT INTO owners (user_id, property_name, county, town, property_type, description, latitude, longitude, phone, website,
                    subscription_status, stripe_customer_id, stripe_subscription_id, subscription_current_period_end,
                    instant_booking, is_featured, featured_until)
SELECT u.id,
       'Blackstairs Eco Camp', 'Carlow', 'Borris', 'GLAMPING',
       'Shepherd huts and canvas lodges under Mount Leinster on the Carlow-Wexford border. Off-grid luxury with composting loos, solar showers and wood-fired hot tubs. Walk the South Leinster Way, then recover in Borris with a pint beside the viaduct. Adults-leaning, dog-friendly, dark-sky nights.', 52.6006, -6.925, '+353 59 977 3100', 'https://blackstairsecocamp.ie',
       'ACTIVE', 'cus_e2e_owner_' || u.id, 'sub_e2e_owner_' || u.id, CURRENT_TIMESTAMP + INTERVAL '365 days',
       TRUE, TRUE, CURRENT_TIMESTAMP + INTERVAL '120 days'
FROM users u WHERE u.email = 'blackstairs@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM owners o WHERE o.user_id = u.id);

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Mount Leinster Hut', 'GLAMPING', 'Victorian-style shepherd hut with a wood burner, king bed and a private deck facing the Blackstairs.', 155.00, 2, 2, TRUE, 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'blackstairs@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Mount Leinster Hut');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'South Leinster Yurt', 'GLAMPING', 'Family yurt with a stove, rugs and a fire pit. Sleeps four on proper beds.', 130.00, 4, 2, TRUE, 'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'blackstairs@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'South Leinster Yurt');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Barrow Valley Pitch', 'TENT', 'Simple meadow pitch for walkers doing the South Leinster Way. Composting toilet nearby.', 20.00, 2, 1, TRUE, 'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'blackstairs@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Barrow Valley Pitch');

INSERT INTO campsite_amenities (owner_id, amenity_id)
SELECT o.id, a.id
FROM owners o JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'blackstairs@myisland.com'
  AND a.name IN ('Fire Pit', 'Hiking', 'Parking', 'Pet Friendly', 'Toilet', 'Shower', 'Reception')
ON CONFLICT DO NOTHING;

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id
FROM lots l
JOIN owners o ON l.owner_id = o.id
JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'blackstairs@myisland.com'
  AND (
        (l.lot_type = 'TOURING' AND a.name IN ('Electricity', 'Water Hookup', 'Parking'))
     OR (l.lot_type = 'TENT' AND a.name IN ('Fire Pit', 'Picnic Table', 'Parking'))
     OR (l.lot_type = 'GLAMPING' AND a.name IN ('WiFi', 'Electricity', 'Fire Pit'))
     OR (l.lot_type IN ('CABIN', 'MOBILE_HOME') AND a.name IN ('WiFi', 'Electricity', 'Parking'))
  )
ON CONFLICT DO NOTHING;

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'ramor@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Lough Ramor Host', 'OWNER', TRUE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'ramor@myisland.com');

INSERT INTO owners (user_id, property_name, county, town, property_type, description, latitude, longitude, phone, website,
                    subscription_status, stripe_customer_id, stripe_subscription_id, subscription_current_period_end,
                    instant_booking, is_featured, featured_until)
SELECT u.id,
       'Lough Ramor Waterside', 'Cavan', 'Virginia', 'TENT',
       'Lakeside camping on the southwestern shore of Lough Ramor, 500m off the N3 near Virginia. Rowing boats and motorboats for hire, island-hopping, and coarse fishing from the bank. A Hidden Heartlands base between Dublin and Donegal with genuine Cavan quiet.', 53.8322, -7.0811, '+353 49 854 7100', 'https://loughramorwaterside.ie',
       'ACTIVE', 'cus_e2e_owner_' || u.id, 'sub_e2e_owner_' || u.id, CURRENT_TIMESTAMP + INTERVAL '365 days',
       TRUE, FALSE, NULL
FROM users u WHERE u.email = 'ramor@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM owners o WHERE o.user_id = u.id);

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Lakeshore Pitch 1', 'TENT', 'Waterfront grass pitch. Cast from the bank at dawn without leaving the site.', 27.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'ramor@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Lakeshore Pitch 1');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Lakeshore Pitch 2', 'TENT', 'Second-row pitch with lake glimpses and more shelter from westerlies.', 24.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'ramor@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Lakeshore Pitch 2');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Angler''s Hardstanding', 'TOURING', 'Level touring pitch with electric, close to the slipway and fish-cleaning station.', 36.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1527786356703-4b4e2d23890b?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'ramor@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Angler''s Hardstanding');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Island-View Cabin', 'CABIN', 'One-bedroom timber cabin with a deck over the reeds. Kettle, heater, and rod storage.', 110.00, 2, 2, TRUE, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'ramor@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Island-View Cabin');

INSERT INTO campsite_amenities (owner_id, amenity_id)
SELECT o.id, a.id
FROM owners o JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'ramor@myisland.com'
  AND a.name IN ('Fishing', 'Swimming', 'Toilet', 'Shower', 'Parking', 'Fire Pit', 'BBQ', 'Reception', 'Pet Friendly')
ON CONFLICT DO NOTHING;

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id
FROM lots l
JOIN owners o ON l.owner_id = o.id
JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'ramor@myisland.com'
  AND (
        (l.lot_type = 'TOURING' AND a.name IN ('Electricity', 'Water Hookup', 'Parking'))
     OR (l.lot_type = 'TENT' AND a.name IN ('Fire Pit', 'Picnic Table', 'Parking'))
     OR (l.lot_type = 'GLAMPING' AND a.name IN ('WiFi', 'Electricity', 'Fire Pit'))
     OR (l.lot_type IN ('CABIN', 'MOBILE_HOME') AND a.name IN ('WiFi', 'Electricity', 'Parking'))
  )
ON CONFLICT DO NOTHING;

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'shercock@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Shercock Lakes Host', 'OWNER', TRUE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'shercock@myisland.com');

INSERT INTO owners (user_id, property_name, county, town, property_type, description, latitude, longitude, phone, website,
                    subscription_status, stripe_customer_id, stripe_subscription_id, subscription_current_period_end,
                    instant_booking, is_featured, featured_until)
SELECT u.id,
       'Shercock Lakeside Cabins', 'Cavan', 'Shercock', 'CABIN',
       'Hand-built lakeside cabins on Lough Sillan at Shercock. Slow Cavan evenings, pike fishing, and a village pub that still does a proper session. Cabins are heated year-round; a handful of grass pitches open May to September.', 53.9936, -6.8956, '+353 42 966 8400', 'https://shercockcabins.ie',
       'ACTIVE', 'cus_e2e_owner_' || u.id, 'sub_e2e_owner_' || u.id, CURRENT_TIMESTAMP + INTERVAL '365 days',
       TRUE, FALSE, NULL
FROM users u WHERE u.email = 'shercock@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM owners o WHERE o.user_id = u.id);

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Sillan Cabin East', 'CABIN', 'Handcrafted cabin with lake views, a wood stove and a small kitchenette. Sleeps two plus a sofa bed.', 118.00, 3, 2, TRUE, 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'shercock@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Sillan Cabin East');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Sillan Cabin West', 'CABIN', 'Twin of East Cabin with a slightly bigger deck and evening sun.', 122.00, 3, 2, TRUE, 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'shercock@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Sillan Cabin West');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Lough Sillan Pitch', 'TENT', 'Seasonal grass pitch among alder. Shared shower block.', 22.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'shercock@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Lough Sillan Pitch');

INSERT INTO campsite_amenities (owner_id, amenity_id)
SELECT o.id, a.id
FROM owners o JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'shercock@myisland.com'
  AND a.name IN ('WiFi', 'Toilet', 'Shower', 'Parking', 'Fishing', 'Fire Pit', 'Reception')
ON CONFLICT DO NOTHING;

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id
FROM lots l
JOIN owners o ON l.owner_id = o.id
JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'shercock@myisland.com'
  AND (
        (l.lot_type = 'TOURING' AND a.name IN ('Electricity', 'Water Hookup', 'Parking'))
     OR (l.lot_type = 'TENT' AND a.name IN ('Fire Pit', 'Picnic Table', 'Parking'))
     OR (l.lot_type = 'GLAMPING' AND a.name IN ('WiFi', 'Electricity', 'Fire Pit'))
     OR (l.lot_type IN ('CABIN', 'MOBILE_HOME') AND a.name IN ('WiFi', 'Electricity', 'Parking'))
  )
ON CONFLICT DO NOTHING;

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'corlea@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Corlea Bog Host', 'OWNER', TRUE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'corlea@myisland.com');

INSERT INTO owners (user_id, property_name, county, town, property_type, description, latitude, longitude, phone, website,
                    subscription_status, stripe_customer_id, stripe_subscription_id, subscription_current_period_end,
                    instant_booking, is_featured, featured_until)
SELECT u.id,
       'Corlea Bog Camp', 'Longford', 'Kenagh', 'TENT',
       'Quiet midlands camping beside the Iron Age Corlea Trackway. Raised bog, curlew country, and the Royal Canal greenway a few kilometres away. Simple facilities, big skies, and a genuinely off-the-beaten-path Longford stay.', 53.6508, -7.7394, '+353 43 332 4100', 'https://corleabogcamp.ie',
       'ACTIVE', 'cus_e2e_owner_' || u.id, 'sub_e2e_owner_' || u.id, CURRENT_TIMESTAMP + INTERVAL '365 days',
       TRUE, FALSE, NULL
FROM users u WHERE u.email = 'corlea@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM owners o WHERE o.user_id = u.id);

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Bog Meadow Pitch', 'TENT', 'Sheltered grass pitch on the edge of the raised bog. Dawn chorus is the alarm clock.', 20.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'corlea@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Bog Meadow Pitch');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Canal Touring Bay', 'TOURING', 'Hardstanding with electric for canal-touring vans heading Athlone to Dublin.', 32.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'corlea@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Canal Touring Bay');

INSERT INTO campsite_amenities (owner_id, amenity_id)
SELECT o.id, a.id
FROM owners o JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'corlea@myisland.com'
  AND a.name IN ('Toilet', 'Shower', 'Parking', 'Hiking', 'Cycling', 'Pet Friendly')
ON CONFLICT DO NOTHING;

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id
FROM lots l
JOIN owners o ON l.owner_id = o.id
JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'corlea@myisland.com'
  AND (
        (l.lot_type = 'TOURING' AND a.name IN ('Electricity', 'Water Hookup', 'Parking'))
     OR (l.lot_type = 'TENT' AND a.name IN ('Fire Pit', 'Picnic Table', 'Parking'))
     OR (l.lot_type = 'GLAMPING' AND a.name IN ('WiFi', 'Electricity', 'Fire Pit'))
     OR (l.lot_type IN ('CABIN', 'MOBILE_HOME') AND a.name IN ('WiFi', 'Electricity', 'Parking'))
  )
ON CONFLICT DO NOTHING;

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'muckno@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Muckno Forest Host', 'OWNER', TRUE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'muckno@myisland.com');

INSERT INTO owners (user_id, property_name, county, town, property_type, description, latitude, longitude, phone, website,
                    subscription_status, stripe_customer_id, stripe_subscription_id, subscription_current_period_end,
                    instant_booking, is_featured, featured_until)
SELECT u.id,
       'Muckno Forest Camping', 'Monaghan', 'Castleblayney', 'TENT',
       'Forest and lakeside pitches on Lough Muckno at Castleblayney — Monaghan''s outdoor playground. Walking loops, coarse fishing, and a market town with a proper bakery. A practical overnight on the Dublin-Derry road that feels like a holiday.', 54.1183, -6.7361, '+353 42 974 0200', 'https://mucknocamping.ie',
       'ACTIVE', 'cus_e2e_owner_' || u.id, 'sub_e2e_owner_' || u.id, CURRENT_TIMESTAMP + INTERVAL '365 days',
       TRUE, FALSE, NULL
FROM users u WHERE u.email = 'muckno@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM owners o WHERE o.user_id = u.id);

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Forest Loop Pitch', 'TENT', 'Pitch among larch and pine with the lake trail at the back of the site.', 23.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'muckno@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Forest Loop Pitch');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Muckno Shore Pitch', 'TENT', 'Closer to the water, popular with anglers. Flat, slightly more open.', 25.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'muckno@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Muckno Shore Pitch');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Hope Castle Touring', 'TOURING', 'Electric hardstanding near the old estate walls. Easy in-and-out for one-nighters.', 34.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1527786356703-4b4e2d23890b?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'muckno@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Hope Castle Touring');

INSERT INTO campsite_amenities (owner_id, amenity_id)
SELECT o.id, a.id
FROM owners o JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'muckno@myisland.com'
  AND a.name IN ('Toilet', 'Shower', 'Parking', 'Fishing', 'Hiking', 'Playground', 'Reception')
ON CONFLICT DO NOTHING;

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id
FROM lots l
JOIN owners o ON l.owner_id = o.id
JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'muckno@myisland.com'
  AND (
        (l.lot_type = 'TOURING' AND a.name IN ('Electricity', 'Water Hookup', 'Parking'))
     OR (l.lot_type = 'TENT' AND a.name IN ('Fire Pit', 'Picnic Table', 'Parking'))
     OR (l.lot_type = 'GLAMPING' AND a.name IN ('WiFi', 'Electricity', 'Fire Pit'))
     OR (l.lot_type IN ('CABIN', 'MOBILE_HOME') AND a.name IN ('WiFi', 'Electricity', 'Parking'))
  )
ON CONFLICT DO NOTHING;

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'loughkey@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Lough Key Host', 'OWNER', TRUE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'loughkey@myisland.com');

INSERT INTO owners (user_id, property_name, county, town, property_type, description, latitude, longitude, phone, website,
                    subscription_status, stripe_customer_id, stripe_subscription_id, subscription_current_period_end,
                    instant_booking, is_featured, featured_until)
SELECT u.id,
       'Lough Key Hideaways', 'Roscommon', 'Boyle', 'GLAMPING',
       'Treehouses, pods and forest tents beside Lough Key Forest & Activity Park. Zip-lines, a Boda Borg, and island castle ruins by boat. Boyle town and the Carrowkeel cairns are close; this is the Hidden Heartlands at their most playful.', 53.9889, -8.2431, '+353 71 966 4200', 'https://loughkeyhideaways.ie',
       'ACTIVE', 'cus_e2e_owner_' || u.id, 'sub_e2e_owner_' || u.id, CURRENT_TIMESTAMP + INTERVAL '365 days',
       TRUE, TRUE, CURRENT_TIMESTAMP + INTERVAL '120 days'
FROM users u WHERE u.email = 'loughkey@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM owners o WHERE o.user_id = u.id);

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Forest Treehouse', 'CABIN', 'Elevated cabin in the canopy with a rope-bridge approach. Queen bed and a wood-burning stove.', 175.00, 2, 2, TRUE, 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'loughkey@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Forest Treehouse');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Lough Key Pod', 'GLAMPING', 'Insulated glamping pod with lake glimpses, en-suite shower and a private fire pit.', 140.00, 2, 2, TRUE, 'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'loughkey@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Lough Key Pod');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Activity Park Pitch', 'TENT', 'Family grass pitch a short walk from the visitor centre and playground.', 28.00, 6, 1, TRUE, 'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'loughkey@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Activity Park Pitch');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Boyle Touring Bay', 'TOURING', 'Serviced hardstanding for motorhomes exploring the Heartlands loop.', 40.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1502301197979-71779edbaa8d?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'loughkey@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Boyle Touring Bay');

INSERT INTO campsite_amenities (owner_id, amenity_id)
SELECT o.id, a.id
FROM owners o JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'loughkey@myisland.com'
  AND a.name IN ('WiFi', 'Toilet', 'Shower', 'Parking', 'Playground', 'Hiking', 'Fire Pit', 'Reception', 'Shop')
ON CONFLICT DO NOTHING;

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id
FROM lots l
JOIN owners o ON l.owner_id = o.id
JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'loughkey@myisland.com'
  AND (
        (l.lot_type = 'TOURING' AND a.name IN ('Electricity', 'Water Hookup', 'Parking'))
     OR (l.lot_type = 'TENT' AND a.name IN ('Fire Pit', 'Picnic Table', 'Parking'))
     OR (l.lot_type = 'GLAMPING' AND a.name IN ('WiFi', 'Electricity', 'Fire Pit'))
     OR (l.lot_type IN ('CABIN', 'MOBILE_HOME') AND a.name IN ('WiFi', 'Electricity', 'Parking'))
  )
ON CONFLICT DO NOTHING;

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'shannon.harbour@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Shannon Harbour Host', 'OWNER', TRUE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'shannon.harbour@myisland.com');

INSERT INTO owners (user_id, property_name, county, town, property_type, description, latitude, longitude, phone, website,
                    subscription_status, stripe_customer_id, stripe_subscription_id, subscription_current_period_end,
                    instant_booking, is_featured, featured_until)
SELECT u.id,
       'Shannon Harbour Camp', 'Roscommon', 'Athlone', 'TOURING',
       'Riverside touring park on the Roscommon bank of the Shannon above Athlone. Cruiser watching, the Old Rail Trail greenway, and a walkable stretch into town for Sean''s Bar. A practical Heartlands hub with full services.', 53.4236, -7.9428, '+353 90 649 2100', 'https://shannonharbourcamp.ie',
       'ACTIVE', 'cus_e2e_owner_' || u.id, 'sub_e2e_owner_' || u.id, CURRENT_TIMESTAMP + INTERVAL '365 days',
       TRUE, FALSE, NULL
FROM users u WHERE u.email = 'shannon.harbour@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM owners o WHERE o.user_id = u.id);

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Riverbank Hardstanding', 'TOURING', 'Full-service pitch facing the navigation. Watch the lock traffic from your awning.', 39.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'shannon.harbour@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Riverbank Hardstanding');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Greenway Tent Pitch', 'TENT', 'Grass pitch with direct access onto the Old Rail Trail.', 22.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'shannon.harbour@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Greenway Tent Pitch');

INSERT INTO campsite_amenities (owner_id, amenity_id)
SELECT o.id, a.id
FROM owners o JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'shannon.harbour@myisland.com'
  AND a.name IN ('WiFi', 'Electricity', 'Water Hookup', 'Toilet', 'Shower', 'Parking', 'Cycling', 'Reception')
ON CONFLICT DO NOTHING;

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id
FROM lots l
JOIN owners o ON l.owner_id = o.id
JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'shannon.harbour@myisland.com'
  AND (
        (l.lot_type = 'TOURING' AND a.name IN ('Electricity', 'Water Hookup', 'Parking'))
     OR (l.lot_type = 'TENT' AND a.name IN ('Fire Pit', 'Picnic Table', 'Parking'))
     OR (l.lot_type = 'GLAMPING' AND a.name IN ('WiFi', 'Electricity', 'Fire Pit'))
     OR (l.lot_type IN ('CABIN', 'MOBILE_HOME') AND a.name IN ('WiFi', 'Electricity', 'Parking'))
  )
ON CONFLICT DO NOTHING;

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'gullion@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Slieve Gullion Host', 'OWNER', TRUE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'gullion@myisland.com');

INSERT INTO owners (user_id, property_name, county, town, property_type, description, latitude, longitude, phone, website,
                    subscription_status, stripe_customer_id, stripe_subscription_id, subscription_current_period_end,
                    instant_booking, is_featured, featured_until)
SELECT u.id,
       'Slieve Gullion Basecamp', 'Armagh', 'Forkhill', 'TENT',
       'Basecamp for the Ring of Gullion AONB. Hike the trail to the passage tomb on the summit, then drop back to a fire pit under the mountain. Armagh orchards, Newry and the Cooley Peninsula are all day-trip easy. Simple, scenic, and properly mountainous.', 54.1231, -6.4306, '+44 28 3084 8100', 'https://slievegullioncamp.com',
       'ACTIVE', 'cus_e2e_owner_' || u.id, 'sub_e2e_owner_' || u.id, CURRENT_TIMESTAMP + INTERVAL '365 days',
       TRUE, FALSE, NULL
FROM users u WHERE u.email = 'gullion@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM owners o WHERE o.user_id = u.id);

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Gullion View Pitch', 'TENT', 'Open pitch with the mountain filling the sky. Stargazing on clear nights.', 22.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'gullion@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Gullion View Pitch');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Ring of Gullion Pitch', 'TENT', 'More sheltered pitch in the lee of a stone wall. Popular with trail walkers.', 20.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'gullion@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Ring of Gullion Pitch');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Orchard County Pod', 'GLAMPING', 'Heated pod with a kettle and a view toward Camlough. Year-round.', 105.00, 2, 2, TRUE, 'https://images.unsplash.com/photo-1618767689160-da3fb810aad7?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'gullion@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Orchard County Pod');

INSERT INTO campsite_amenities (owner_id, amenity_id)
SELECT o.id, a.id
FROM owners o JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'gullion@myisland.com'
  AND a.name IN ('Toilet', 'Shower', 'Parking', 'Hiking', 'Fire Pit', 'Pet Friendly')
ON CONFLICT DO NOTHING;

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id
FROM lots l
JOIN owners o ON l.owner_id = o.id
JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'gullion@myisland.com'
  AND (
        (l.lot_type = 'TOURING' AND a.name IN ('Electricity', 'Water Hookup', 'Parking'))
     OR (l.lot_type = 'TENT' AND a.name IN ('Fire Pit', 'Picnic Table', 'Parking'))
     OR (l.lot_type = 'GLAMPING' AND a.name IN ('WiFi', 'Electricity', 'Fire Pit'))
     OR (l.lot_type IN ('CABIN', 'MOBILE_HOME') AND a.name IN ('WiFi', 'Electricity', 'Parking'))
  )
ON CONFLICT DO NOTHING;

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'gortin@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Gortin Glen Host', 'OWNER', TRUE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'gortin@myisland.com');

INSERT INTO owners (user_id, property_name, county, town, property_type, description, latitude, longitude, phone, website,
                    subscription_status, stripe_customer_id, stripe_subscription_id, subscription_current_period_end,
                    instant_booking, is_featured, featured_until)
SELECT u.id,
       'Gortin Glen Camp', 'Tyrone', 'Gortin', 'TENT',
       'Forest camping in the Sperrins AONB at Gortin Glen. Red squirrels, waymarked trails, and the Ulster Way on the doorstep. Omagh is twenty minutes; this is the quiet Tyrone that walkers keep to themselves.', 54.7164, -7.2389, '+44 28 8164 8100', 'https://gortinglencamp.com',
       'ACTIVE', 'cus_e2e_owner_' || u.id, 'sub_e2e_owner_' || u.id, CURRENT_TIMESTAMP + INTERVAL '365 days',
       TRUE, FALSE, NULL
FROM users u WHERE u.email = 'gortin@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM owners o WHERE o.user_id = u.id);

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Sperrin Forest Pitch', 'TENT', 'Pitch among Sitka and native oak. Trails start at the cattle grid.', 21.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'gortin@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Sperrin Forest Pitch');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Glen Lookout Pitch', 'TENT', 'Higher pitch with a Sperrin ridge view. Bring a warm bag.', 23.00, 2, 1, TRUE, 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'gortin@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Glen Lookout Pitch');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Gortin Touring Bay', 'TOURING', 'Electric hardstanding for vans touring the Sperrins scenic drive.', 33.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1527786356703-4b4e2d23890b?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'gortin@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Gortin Touring Bay');

INSERT INTO campsite_amenities (owner_id, amenity_id)
SELECT o.id, a.id
FROM owners o JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'gortin@myisland.com'
  AND a.name IN ('Toilet', 'Shower', 'Parking', 'Hiking', 'Pet Friendly', 'Reception')
ON CONFLICT DO NOTHING;

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id
FROM lots l
JOIN owners o ON l.owner_id = o.id
JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'gortin@myisland.com'
  AND (
        (l.lot_type = 'TOURING' AND a.name IN ('Electricity', 'Water Hookup', 'Parking'))
     OR (l.lot_type = 'TENT' AND a.name IN ('Fire Pit', 'Picnic Table', 'Parking'))
     OR (l.lot_type = 'GLAMPING' AND a.name IN ('WiFi', 'Electricity', 'Fire Pit'))
     OR (l.lot_type IN ('CABIN', 'MOBILE_HOME') AND a.name IN ('WiFi', 'Electricity', 'Parking'))
  )
ON CONFLICT DO NOTHING;

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'magilligan@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Magilligan Strand Host', 'OWNER', TRUE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'magilligan@myisland.com');

INSERT INTO owners (user_id, property_name, county, town, property_type, description, latitude, longitude, phone, website,
                    subscription_status, stripe_customer_id, stripe_subscription_id, subscription_current_period_end,
                    instant_booking, is_featured, featured_until)
SELECT u.id,
       'Magilligan Strand Park', 'Derry', 'Limavady', 'TOURING',
       'Miles of Blue Flag sand at Benone and Magilligan, with Binevenagh rising behind the dunes. A Causeway Coast touring park for surfers, kite-flyers and ferry arrivals via Magilligan Point. Downhill beach and Mussenden Temple are a short hop east.', 55.1664, -6.9511, '+44 28 7775 0100', 'https://magilliganstrand.com',
       'ACTIVE', 'cus_e2e_owner_' || u.id, 'sub_e2e_owner_' || u.id, CURRENT_TIMESTAMP + INTERVAL '365 days',
       TRUE, FALSE, NULL
FROM users u WHERE u.email = 'magilligan@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM owners o WHERE o.user_id = u.id);

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Dune Hardstanding', 'TOURING', 'Serviced pitch behind the dunes. Boardwalk to Benone Strand in five minutes.', 40.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'magilligan@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Dune Hardstanding');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Benone Family Pitch', 'TENT', 'Spacious grass pitch near the play park. Soft sand, long evenings.', 28.00, 6, 1, TRUE, 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'magilligan@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Benone Family Pitch');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Binevenagh Cabin', 'CABIN', 'Two-bedroom cabin with dune views and space for wet suits and boards.', 135.00, 5, 2, TRUE, 'https://images.unsplash.com/photo-1482192505345-56501afb27d7?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'magilligan@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Binevenagh Cabin');

INSERT INTO campsite_amenities (owner_id, amenity_id)
SELECT o.id, a.id
FROM owners o JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'magilligan@myisland.com'
  AND a.name IN ('WiFi', 'Electricity', 'Toilet', 'Shower', 'Parking', 'Playground', 'Swimming', 'Reception', 'Shop')
ON CONFLICT DO NOTHING;

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id
FROM lots l
JOIN owners o ON l.owner_id = o.id
JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'magilligan@myisland.com'
  AND (
        (l.lot_type = 'TOURING' AND a.name IN ('Electricity', 'Water Hookup', 'Parking'))
     OR (l.lot_type = 'TENT' AND a.name IN ('Fire Pit', 'Picnic Table', 'Parking'))
     OR (l.lot_type = 'GLAMPING' AND a.name IN ('WiFi', 'Electricity', 'Fire Pit'))
     OR (l.lot_type IN ('CABIN', 'MOBILE_HOME') AND a.name IN ('WiFi', 'Electricity', 'Parking'))
  )
ON CONFLICT DO NOTHING;

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'portrush.dunes@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Portrush Dunes Host', 'OWNER', TRUE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'portrush.dunes@myisland.com');

INSERT INTO owners (user_id, property_name, county, town, property_type, description, latitude, longitude, phone, website,
                    subscription_status, stripe_customer_id, stripe_subscription_id, subscription_current_period_end,
                    instant_booking, is_featured, featured_until)
SELECT u.id,
       'Portrush Dunes Camp', 'Antrim', 'Portrush', 'TENT',
       'Camping behind the East Strand dunes in Ireland''s surf town. Whiterocks, Dunluce Castle and the Giant''s Causeway are the day-trip circuit; the night is pints on the harbour. A livelier Causeway Coast alternative to the Bushmills end.', 55.2044, -6.6542, '+44 28 7082 3100', 'https://portrushdunescamp.com',
       'ACTIVE', 'cus_e2e_owner_' || u.id, 'sub_e2e_owner_' || u.id, CURRENT_TIMESTAMP + INTERVAL '365 days',
       TRUE, FALSE, NULL
FROM users u WHERE u.email = 'portrush.dunes@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM owners o WHERE o.user_id = u.id);

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'East Strand Pitch', 'TENT', 'Grass pitch a boardwalk from the surf. Expect a soundtrack of Atlantic swell.', 30.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'portrush.dunes@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'East Strand Pitch');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Whiterocks Touring', 'TOURING', 'Hardstanding with electric, popular with van-lifers doing the Causeway loop.', 42.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'portrush.dunes@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Whiterocks Touring');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Harbour Pod', 'GLAMPING', 'Snug pod with a harbour-light view. Perfect after a cold-water session.', 125.00, 2, 2, TRUE, 'https://images.unsplash.com/photo-1618767689160-da3fb810aad7?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'portrush.dunes@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Harbour Pod');

INSERT INTO campsite_amenities (owner_id, amenity_id)
SELECT o.id, a.id
FROM owners o JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'portrush.dunes@myisland.com'
  AND a.name IN ('WiFi', 'Toilet', 'Shower', 'Parking', 'Swimming', 'Reception', 'Shop')
ON CONFLICT DO NOTHING;

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id
FROM lots l
JOIN owners o ON l.owner_id = o.id
JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'portrush.dunes@myisland.com'
  AND (
        (l.lot_type = 'TOURING' AND a.name IN ('Electricity', 'Water Hookup', 'Parking'))
     OR (l.lot_type = 'TENT' AND a.name IN ('Fire Pit', 'Picnic Table', 'Parking'))
     OR (l.lot_type = 'GLAMPING' AND a.name IN ('WiFi', 'Electricity', 'Fire Pit'))
     OR (l.lot_type IN ('CABIN', 'MOBILE_HOME') AND a.name IN ('WiFi', 'Electricity', 'Parking'))
  )
ON CONFLICT DO NOTHING;

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'cong.glamping@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Cong Village Host', 'OWNER', TRUE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'cong.glamping@myisland.com');

INSERT INTO owners (user_id, property_name, county, town, property_type, description, latitude, longitude, phone, website,
                    subscription_status, stripe_customer_id, stripe_subscription_id, subscription_current_period_end,
                    instant_booking, is_featured, featured_until)
SELECT u.id,
       'Cong Village Glamping', 'Mayo', 'Cong', 'GLAMPING',
       'Luxury tents and stone cottages in the Quiet Man village between Lough Corrib and Lough Mask. Ashford Castle woods, falconry, and the Cong Canal on the doorstep. Dress up for dinner in the village or keep it simple with a fire pit and Corrib trout.', 53.5406, -9.2869, '+353 94 954 6100', 'https://congvillageglamping.ie',
       'ACTIVE', 'cus_e2e_owner_' || u.id, 'sub_e2e_owner_' || u.id, CURRENT_TIMESTAMP + INTERVAL '365 days',
       TRUE, TRUE, CURRENT_TIMESTAMP + INTERVAL '120 days'
FROM users u WHERE u.email = 'cong.glamping@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM owners o WHERE o.user_id = u.id);

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Quiet Man Safari Tent', 'GLAMPING', 'Canvas lodge with a proper bed, stove and a private garden. Village pubs a five-minute stroll.', 165.00, 2, 2, TRUE, 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'cong.glamping@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Quiet Man Safari Tent');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Ashford Wood Cabin', 'CABIN', 'Stone-and-timber cabin on the estate edge. Wood-burning stove and a claw-foot bath.', 195.00, 2, 2, TRUE, 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'cong.glamping@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Ashford Wood Cabin');

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       'Corrib Bank Pitch', 'TENT', 'Simple lakeside pitch for kayakers and walkers. Shared facilities.', 26.00, 4, 1, TRUE, 'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email = 'cong.glamping@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.name = 'Corrib Bank Pitch');

INSERT INTO campsite_amenities (owner_id, amenity_id)
SELECT o.id, a.id
FROM owners o JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'cong.glamping@myisland.com'
  AND a.name IN ('WiFi', 'Toilet', 'Shower', 'Parking', 'Fire Pit', 'Hiking', 'Fishing', 'Restaurant', 'Reception')
ON CONFLICT DO NOTHING;

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id
FROM lots l
JOIN owners o ON l.owner_id = o.id
JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email = 'cong.glamping@myisland.com'
  AND (
        (l.lot_type = 'TOURING' AND a.name IN ('Electricity', 'Water Hookup', 'Parking'))
     OR (l.lot_type = 'TENT' AND a.name IN ('Fire Pit', 'Picnic Table', 'Parking'))
     OR (l.lot_type = 'GLAMPING' AND a.name IN ('WiFi', 'Electricity', 'Fire Pit'))
     OR (l.lot_type IN ('CABIN', 'MOBILE_HOME') AND a.name IN ('WiFi', 'Electricity', 'Parking'))
  )
ON CONFLICT DO NOTHING;

--------------------------------------------------------------------------------
-- 4. Enrich existing V1005 listings (longer copy, unique lot names, Unsplash photos)
--------------------------------------------------------------------------------
UPDATE owners o SET description = 'Riverside camping on the Shannon at Carrick-on-Shannon, with cruiser hire next door and the Blueway on the towpath. A sociable Heartlands hub: pubs with sessions, supermarket five minutes away, and lock-side sunsets. Touring pitches take the bigger vans; grass pitches suit tents and trailer tents.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner101@example.com';

UPDATE owners o SET description = 'Trailhead camping for the Ballyhoura mountain-bike mega trails — 98km of purpose-built singletrack. Forest walks, the Ballyhoura Way, and quiet Limerick villages with proper bakers. Muddy bikes welcome; a wash-down bay sits beside the touring field.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner102@example.com';

UPDATE owners o SET description = 'Valley camping under the Comeraghs near Dungarvan, with Coumshingaun corrie lake the signature hike. The Waterford Greenway is a short spin; the Copper Coast is the rainy-day drive. Family grass pitches and a couple of heated pods for the shoulder season.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner103@example.com';

UPDATE owners o SET description = 'Wild Atlantic Way glamping on Achill Island above Keel beach and Minaun Heights. Keem Bay, Atlantic Drive and the deserted village of Slievemore are the island circuit. Pods hold the weather; a few wild pitches remain for tents that can take a gale.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner104@example.com';

UPDATE owners o SET description = 'Yurts and shepherd huts in the Boyne Valley a few minutes from Newgrange, Knowth and the Battle of the Boyne site. Slane Castle concerts in summer; Monasterboice and Trim Castle for the rest of the year. Adults-leaning glamping with a family yurt for the school holidays.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner105@example.com';

UPDATE owners o SET description = 'Eco-camping in Wicklow Mountains National Park above Laragh, with Glendalough''s monastic city and Spinc boardwalk on the doorstep. Leave the car: trails start at the gate. Composting toilets, solar showers, and a strict quiet hours policy after 10pm.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner106@example.com';

UPDATE owners o SET description = 'Remote peninsula glamping above Castletownbere on the Beara. Healy Pass, Dursey cable car, and empty coves. This is the quiet sister of the Ring of Kerry — more seals than tour buses. Wood-fired hot tubs on two of the units.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner107@example.com';

UPDATE owners o SET description = 'UNESCO Copper Coast camping at Bunmahon: fossil cliffs, coves, and the Geopark visitor centre. A sunny-southeast family site with a playground, a shop, and a short walk to the strand.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner108@example.com';

UPDATE owners o SET description = 'Ireland''s most northerly campsite at Malin Head, Banba''s Crown. Watch Atlantic weather systems roll in, then chase them with a drive around Inishowen. Dark skies, hardy grass pitches, and a bothy for nights when the tent is a bad idea.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner109@example.com';

UPDATE owners o SET description = 'Hiking base for Slieve Donard and the Mourne Wall, ten minutes from Newcastle''s promenade. Tollymore Forest, Murlough dunes and Maggy''s Leap fill the rest of the week. Touring pitches for the van crowd; tents in the lower field.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner110@example.com';

UPDATE owners o SET description = 'Lakeside camping at Ballina/Killaloe on Lough Derg with a slipway, sailing club next door, and the East Clare Way. A different Lough Derg to the unsubscribed test site down the road — this one takes bookings and has a shop.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner111@example.com';

UPDATE owners o SET description = 'Camping in the shadow of the Rock of Cashel. Walk into town for the cathedral complex, then drive the Vee Gap and Cahir Castle. A central Munster touring stop with proper showers and a camper''s kitchen.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner112@example.com';

UPDATE owners o SET description = 'Dark-sky glamping pods on Valentia Island, a bridge from Portmagee and a boat from the Skelligs. Fog, lighthouses, and the first transatlantic cable. Pods are insulated; nights here are about the stars.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner113@example.com';

UPDATE owners o SET description = 'Camping on the edge of Killarney National Park — lakes, yew woods, and the Gap of Dunloe. Jaunting cars and tour buses by day; the park belongs to walkers at dawn. Book the lakeside pitches early in July.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner114@example.com';

UPDATE owners o SET description = 'Family camping behind Tramore''s dunes, with the amusement park, Guillamene diving boards, and a huge strand. Heated outdoor pool on site. This is the classic Waterford seaside holiday, slightly louder, very handy.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner115@example.com';

UPDATE owners o SET description = 'Surf-town camping at Strandhill under Knocknarea. Lessons on the doorstep, seaweed baths for afterwards, and Sligo town twenty minutes inland. Vans love the hardstandings; tents go in the lee of the dunes.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner116@example.com';

UPDATE owners o SET description = 'Glamping beside Hook Head, the oldest operational lighthouse in Ireland. Wexford''s Hook peninsula: choughs, shipwrecks, and Loftus Hall. Adults-leaning pods with a family cabin for summer.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner117@example.com';

UPDATE owners o SET description = 'Camping on the Slea Head Drive at Ventry, with Mount Eagle behind you and the Blaskets in front. Gallarus Oratory, Dunbeg fort, and Coumeenoole in one loop. A Dingle Peninsula stay that is quieter than town.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner118@example.com';

UPDATE owners o SET description = 'Cliff-and-island views from Doolin: the Cliffs of Moher coastal path, Aran ferries, and the best trad sessions in Clare. A busier Wild Atlantic Way stop — book ahead for festival weekends.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner119@example.com';

UPDATE owners o SET description = 'Adventure-sports glamping in medieval Carlingford on the Cooley Peninsula. Zip-lines, a skypark, oyster festival, and the Táin Way. Views across the lough to the Mournes.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner120@example.com';

UPDATE owners o SET description = 'Sheltered Bantry Bay camping with Sheep''s Head and the Beara on either side. Market square, mussel farms, and Garnish Island by boat from Glengarriff. A classic West Cork touring base.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner121@example.com';

UPDATE owners o SET description = 'Camping on Ireland''s only fjord at Killary, under Mweelrea and the Twelve Bens. Mussel ropes in the water, the Green Road famine walk, and Connemara National Park twenty minutes west.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner122@example.com';

UPDATE owners o SET description = 'Trailhead camping in the Slieve Bloom Mountains — Ireland''s least-visited range, which is the point. Waymarked loops, mountain biking, and dark skies. Mountrath is the supply town.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner123@example.com';

UPDATE owners o SET description = 'Hidden Heartlands camping on Lough Ree east of Athlone. Inland beaches, cruiser traffic, and the Old Rail Trail. A gentler Shannon than the big tourist quays.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner124@example.com';

UPDATE owners o SET description = 'Camping a short walk from Clonmacnoise, the early Christian city on the Shannon. High crosses at dawn before the coaches, then the bog railway and Clonony Castle. Simple, historic, unforgettable.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner125@example.com';

UPDATE owners o SET description = 'Climbing and hiking base under the Galtees at Cahir. Galtymore is the day''s work; Cahir Castle and the Swiss Cottage fill the rest. A munster mountain site with surprisingly good showers.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner126@example.com';

UPDATE owners o SET description = 'Glamping on the Great Western Greenway at Mulranny, with Clew Bay''s drowned drumlins in front and Croagh Patrick across the water. Cycle Westport to Achill without seeing a main road. Heated pods, a couple of grass pitches.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner127@example.com';

UPDATE owners o SET description = 'Remote valley camping in the Black Valley under MacGillycuddy''s Reeks — one of the last places in Ireland with no mains electricity. Bring a torch. The Gap of Dunloe walk starts here. Not for everyone; perfect for the right people.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner128@example.com';

UPDATE owners o SET description = 'Camping at the edge of Glenveagh National Park: castle, gardens, golden eagles, and the Derryveagh Mountains. A Donegal Highlands stay that still has a shop and hot water.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner129@example.com';

UPDATE owners o SET description = 'Pitch at the foot of Mount Errigal in Gweedore Gaeltacht country. Poison Glen, Dunlewey lakes, and some of the best traditional singing in Ireland. The mountain looks painted on.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner130@example.com';

UPDATE owners o SET description = 'Atlantic camping at Spanish Point, with the story of the Armada wreck and a surf beach that works on a west swell. Miltown Malbay''s Willie Clancy Festival in July is either a reason to come or a reason to book a year ahead.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner131@example.com';

UPDATE owners o SET description = 'Cliff-edge pods at Kilkee looking over the Pollock Holes and the Loop Head drive. Natural swimming pools at low tide, dramatic walks, and a Victorian seaside town that still has ice cream.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner132@example.com';

UPDATE owners o SET description = 'Lakeland luxury glamping on Lough Erne near Enniskillen. Castle Archdale, White Island figures, and the Cuilcagh boardwalk. Fermanagh''s water-country at its most comfortable: hot tubs, proper beds, still the sound of water.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner133@example.com';

UPDATE owners o SET description = 'Island-hopping base on Clew Bay outside Westport. Kayak the drumlins, climb Croagh Patrick, cycle the Greenway. Westport''s food scene is the evening plan. A busier Mayo site that earns it.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner134@example.com';

UPDATE owners o SET description = 'Hill-and-sea glamping at Tara Hill near Gorey. Courtown strand, woodland walks, and a Wexford microclimate that actually gets sun. Family safari tents and a couple of adults-only huts.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner135@example.com';

UPDATE owners o SET description = 'Camping below Powerscourt Waterfall and the gardens at Enniskerry. A Dublin-escape site: Great Sugar Loaf, Bray Head, and the 44 bus if you refuse to drive. Book the waterfall-view pitches first.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner136@example.com';

UPDATE owners o SET description = 'Classic East Coast beach camping at Brittas Bay — miles of sand, dunes, and a weekend exodus from Dublin. Arrive Thursday if you can. Facilities are solid; the beach is the point.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner137@example.com';

UPDATE owners o SET description = 'Ferry-port stopover at Rosslare Harbour with hardstandings, showers, and a walk to the terminal. Curracloe and Wexford town if your sailing is not until evening. Open year-round for the late boat.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner138@example.com';

UPDATE owners o SET description = 'Historic walled-town camping at Youghal: clock gate, Myrtle Grove, and a Blue Flag strand. The N25 touring stop that is actually worth an extra night. Family pitches and a small shop.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner139@example.com';

UPDATE owners o SET description = 'Harbour-view camping at Cobh, watching the liners that still call where Titanic last touched land. The Cathedral, the Spike Island ferry, and a steep colourful town. Touring pitches have the view; tents sit further up.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner140@example.com';

UPDATE owners o SET description = 'Camping a short walk from Blarney Castle and the stone. Kiss it or don''t; the gardens and poison garden are the better hour. Cork city is twenty minutes. A genuine tourist-circuit site that still has grass and trees.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner141@example.com';

UPDATE owners o SET description = 'Family glamping beside Fota Wildlife Park and the arboretum. Lemurs at breakfast (not literally). Cobh and Cork Harbour for the afternoon. Safari tents with proper beds and a small kitchen.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner142@example.com';

UPDATE owners o SET description = 'Camping near Mizen Head, Ireland''s southwest tip. The signal station, Barleycove dunes, and Fastnet on the horizon. A Wild Atlantic Way end-of-the-road site. Hold your tent in a gale; the light is worth it.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner143@example.com';

UPDATE owners o SET description = 'Walking-base camping for the Sheep''s Head Way — 88km, empty, and arguably West Cork''s finest ridge. Durrus cheese down the road. Small, simple, and booked by people who have already done the Beara.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner144@example.com';

UPDATE owners o SET description = 'Gaeltacht island glamping on Cape Clear: Irish spoken in the shop, the Fastnet lighthouse, and migrating birds in autumn. Ferry from Baltimore. No cars needed. Tigíns and a field for tents.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner145@example.com';

UPDATE owners o SET description = 'Island camping on Sherkin: beaches, an abbey, and a slower Baltimore. The ferry is the fun part. Facilities are basic; the beaches are not.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner146@example.com';

UPDATE owners o SET description = 'Glengarriff camping with Garnish Island''s Italian gardens a ten-minute boat ride away. Seals in the harbour, Caha tunnels inland, and Bantry for supplies. A lush, sheltered West Cork pocket.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner147@example.com';

UPDATE owners o SET description = 'Forest camping at Gougane Barra, source of the River Lee, with St Finbarr''s oratory on the lake. A Coillte forest park setting: trails, picnic tables, and a sacred-feeling valley. Popular with Sunday drivers; stay the night.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner148@example.com';

UPDATE owners o SET description = 'Clifftop camping above the fishing village of Dunmore East. Thatched cottages, a sandy cove, and the Waterford Greenway a short drive. A pretty, slightly posh southeast stay.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner149@example.com';

UPDATE owners o SET description = 'City-edge camping at the Waterford Greenway start, so you can cycle to Dungarvan without loading the car. Viking Triangle museums for the rainy morning. Practical, friendly, and surprisingly quiet at night.'
FROM users u
WHERE o.user_id = u.id AND u.email = 'owner150@example.com';

-- Rename generic V1005 lots so search results look like real inventory
UPDATE lots l
SET name = regexp_replace(o.property_name, '\s+(Camping|Camp|Park|Pods|Wilds|Green|Retreat|Drive|Estate|Resort|Signal|Way|View|Start|Wildlife|Lighthouse)$', '', 'i')
             || CASE l.name
                    WHEN 'Standard Pitch' THEN ' Meadow Pitch'
                    WHEN 'Electric Pitch' THEN ' Electric Bay'
                    WHEN 'Glamping Pod' THEN ' Glamping Pod'
                    ELSE ' ' || l.name
                END,
    description = CASE l.name
        WHEN 'Standard Pitch' THEN 'Grass pitch with space for a family tent and guy lines. Shared toilet and shower block.'
        WHEN 'Electric Pitch' THEN 'Level hardstanding with 16A electric hook-up, handy for motorhomes and tourers.'
        WHEN 'Glamping Pod' THEN 'Heated glamping pod with a proper bed, kettle and USB charging. En-suite or nearby showers depending on the unit.'
        ELSE l.description
    END,
    image_url = CASE l.lot_type
        WHEN 'TENT' THEN 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1200'
        WHEN 'TOURING' THEN 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=1200'
        WHEN 'GLAMPING' THEN 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=1200'
        WHEN 'CABIN' THEN 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&q=80&w=1200'
        WHEN 'MOBILE_HOME' THEN 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?auto=format&fit=crop&q=80&w=1200'
        ELSE l.image_url
    END
FROM owners o JOIN users u ON o.user_id = u.id
WHERE l.owner_id = o.id
  AND u.email LIKE 'owner1%@example.com'
  AND l.name IN ('Standard Pitch', 'Electric Pitch', 'Glamping Pod');

-- Add a cabin or extra tent to the larger V1005 sites for inventory variety
INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, min_stay, is_active, image_url)
SELECT o.id,
       o.property_name || ' Cabin',
       'CABIN',
       'Timber cabin with a small kitchenette, heating and a private deck. A comfortable step up from the field.',
       115.00, 4, 2, TRUE, 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1200'
FROM owners o JOIN users u ON o.user_id = u.id
WHERE u.email IN (
    'owner104@example.com', 'owner106@example.com', 'owner110@example.com', 'owner114@example.com', 'owner115@example.com', 'owner129@example.com', 'owner133@example.com', 'owner136@example.com', 'owner141@example.com', 'owner148@example.com'
)
  AND NOT EXISTS (SELECT 1 FROM lots l WHERE l.owner_id = o.id AND l.lot_type = 'CABIN' AND l.name LIKE '% Cabin');

INSERT INTO campsite_amenities (owner_id, amenity_id)
SELECT o.id, a.id
FROM owners o JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email LIKE 'owner1%@example.com'
  AND a.name IN ('Toilet', 'Shower', 'Parking', 'Reception')
ON CONFLICT DO NOTHING;

INSERT INTO campsite_amenities (owner_id, amenity_id)
SELECT o.id, a.id
FROM owners o JOIN users u ON o.user_id = u.id
CROSS JOIN amenities a
WHERE u.email LIKE 'owner1%@example.com'
  AND o.property_type IN ('GLAMPING', 'CABIN', 'MOBILE_HOME')
  AND a.name IN ('WiFi', 'Electricity')
ON CONFLICT DO NOTHING;

--------------------------------------------------------------------------------
-- 5. Unsplash photos for every owner and lot so galleries and search look live
--------------------------------------------------------------------------------
-- Replace legacy /images/... lot URLs (files are not shipped) with Unsplash
UPDATE lots SET image_url = CASE lot_type
    WHEN 'TENT' THEN 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=1200'
    WHEN 'TOURING' THEN 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200'
    WHEN 'GLAMPING' THEN 'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?auto=format&fit=crop&q=80&w=1200'
    WHEN 'CABIN' THEN 'https://images.unsplash.com/photo-1482192505345-56501afb27d7?auto=format&fit=crop&q=80&w=1200'
    WHEN 'MOBILE_HOME' THEN 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?auto=format&fit=crop&q=80&w=1200'
    ELSE image_url
END
WHERE image_url LIKE '/images/%' OR image_url IS NULL;

UPDATE lots SET image_url = CASE (id % 5)
    WHEN 0 THEN 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1200'
    WHEN 1 THEN 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=1200'
    WHEN 2 THEN 'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?auto=format&fit=crop&q=80&w=1200'
    WHEN 3 THEN 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=1200'
    WHEN 4 THEN 'https://images.unsplash.com/photo-1537905569824-f89f16cf2b41?auto=format&fit=crop&q=80&w=1200'
    ELSE image_url END WHERE lot_type = 'TENT';

UPDATE lots SET image_url = CASE (id % 4)
    WHEN 0 THEN 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=1200'
    WHEN 1 THEN 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200'
    WHEN 2 THEN 'https://images.unsplash.com/photo-1527786356703-4b4e2d23890b?auto=format&fit=crop&q=80&w=1200'
    WHEN 3 THEN 'https://images.unsplash.com/photo-1502301197979-71779edbaa8d?auto=format&fit=crop&q=80&w=1200'
    ELSE image_url END WHERE lot_type = 'TOURING';

UPDATE lots SET image_url = CASE (id % 5)
    WHEN 0 THEN 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=1200'
    WHEN 1 THEN 'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?auto=format&fit=crop&q=80&w=1200'
    WHEN 2 THEN 'https://images.unsplash.com/photo-1618767689160-da3fb810aad7?auto=format&fit=crop&q=80&w=1200'
    WHEN 3 THEN 'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?auto=format&fit=crop&q=80&w=1200'
    WHEN 4 THEN 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200'
    ELSE image_url END WHERE lot_type = 'GLAMPING';

UPDATE lots SET image_url = CASE (id % 4)
    WHEN 0 THEN 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&q=80&w=1200'
    WHEN 1 THEN 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1200'
    WHEN 2 THEN 'https://images.unsplash.com/photo-1482192505345-56501afb27d7?auto=format&fit=crop&q=80&w=1200'
    WHEN 3 THEN 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200'
    ELSE image_url END WHERE lot_type = 'CABIN';

UPDATE lots SET image_url = CASE (id % 2)
    WHEN 0 THEN 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?auto=format&fit=crop&q=80&w=1200'
    WHEN 1 THEN 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200'
    ELSE image_url END WHERE lot_type = 'MOBILE_HOME';

-- Owner hero + gallery. Skip insert if this s3_key already exists (V1027).
INSERT INTO entity_images (entity_type, entity_id, s3_key, url, filename, content_type, file_size, display_order, is_primary, alt_text)
SELECT 'OWNER', o.id,
       'e2e/owners/' || o.id || '/hero.jpg',
       CASE o.property_type
           WHEN 'TENT' THEN 'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?auto=format&fit=crop&q=80&w=1200'
           WHEN 'TOURING' THEN 'https://images.unsplash.com/photo-1527786356703-4b4e2d23890b?auto=format&fit=crop&q=80&w=1200'
           WHEN 'GLAMPING' THEN 'https://images.unsplash.com/photo-1618767689160-da3fb810aad7?auto=format&fit=crop&q=80&w=1200'
           WHEN 'CABIN' THEN 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&q=80&w=1200'
           WHEN 'MOBILE_HOME' THEN 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200'
           ELSE 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200'
       END,
       'hero.jpg', 'image/jpeg', 180000, 0,
       NOT EXISTS (SELECT 1 FROM entity_images ei WHERE ei.entity_type = 'OWNER' AND ei.entity_id = o.id AND ei.is_primary = TRUE),
       o.property_name || ' — main view'
FROM owners o
WHERE NOT EXISTS (SELECT 1 FROM entity_images ei WHERE ei.s3_key = 'e2e/owners/' || o.id || '/hero.jpg');

INSERT INTO entity_images (entity_type, entity_id, s3_key, url, filename, content_type, file_size, display_order, is_primary, alt_text)
SELECT 'OWNER', o.id,
       'e2e/owners/' || o.id || '/gallery.jpg',
       CASE
           WHEN o.county IN ('Kerry','Clare','Donegal','Antrim','Cork','Galway','Mayo','Derry') THEN 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200'
           WHEN o.county IN ('Wicklow','Tyrone','Armagh','Tipperary') THEN 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200'
           WHEN o.county IN ('Cavan','Fermanagh','Westmeath','Leitrim','Roscommon') THEN 'https://images.unsplash.com/photo-1439066615861-d1cad629e3d5?auto=format&fit=crop&q=80&w=1200'
           ELSE 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200'
       END,
       'gallery.jpg', 'image/jpeg', 160000, 1, FALSE,
       o.property_name || ' — surroundings'
FROM owners o
WHERE NOT EXISTS (SELECT 1 FROM entity_images ei WHERE ei.s3_key = 'e2e/owners/' || o.id || '/gallery.jpg');

INSERT INTO entity_images (entity_type, entity_id, s3_key, url, filename, content_type, file_size, display_order, is_primary, alt_text)
SELECT 'LOT', l.id,
       'e2e/lots/' || l.id || '/primary.jpg',
       COALESCE(l.image_url, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1200'),
       'primary.jpg', 'image/jpeg', 140000, 0,
       NOT EXISTS (SELECT 1 FROM entity_images ei WHERE ei.entity_type = 'LOT' AND ei.entity_id = l.id AND ei.is_primary = TRUE),
       l.name
FROM lots l
WHERE NOT EXISTS (SELECT 1 FROM entity_images ei WHERE ei.s3_key = 'e2e/lots/' || l.id || '/primary.jpg');

--------------------------------------------------------------------------------
-- 6. Featured listings (homepage PROMOTED row) — spread around the island
--------------------------------------------------------------------------------
UPDATE owners
SET is_featured = TRUE, featured_until = CURRENT_TIMESTAMP + INTERVAL '90 days',
    featured_purchase_id = COALESCE(featured_purchase_id, 'e2e_featured_' || id)
WHERE property_name IN ('Nore Valley Park', 'Wild Atlantic Glamping', 'Dingle Peninsula Camping', 'Wicklow Hills Hideaway', 'Giants Causeway Camp', 'Killarney National Park', 'Achill Wilds');

UPDATE suppliers
SET is_featured = TRUE, featured_until = CURRENT_TIMESTAMP + INTERVAL '90 days',
    featured_purchase_id = COALESCE(featured_purchase_id, 'e2e_featured_sup_' || id)
WHERE business_name IN ('Green Acres Farm Shop', 'Lahinch Surf School', 'Wild Water Kayaks', 'Dingle Distillery Tours');

--------------------------------------------------------------------------------
-- 7. Guest accounts, completed stays, and reviews across the island
--------------------------------------------------------------------------------
INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'siobhan.walsh@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Siobhan Walsh', 'GUEST', FALSE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'siobhan.walsh@example.com');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'cormac.nolan@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Cormac Nolan', 'GUEST', FALSE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'cormac.nolan@example.com');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'aoife.byrne@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Aoife Byrne', 'GUEST', FALSE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'aoife.byrne@example.com');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'padraig.kelly@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Pádraig Kelly', 'GUEST', FALSE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'padraig.kelly@example.com');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'niamh.dunne@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Niamh Dunne', 'GUEST', FALSE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'niamh.dunne@example.com');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'eoin.mcgrath@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Eoin McGrath', 'GUEST', FALSE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'eoin.mcgrath@example.com');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'orla.fitzgerald@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Orla Fitzgerald', 'GUEST', FALSE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'orla.fitzgerald@example.com');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'cian.obrien@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Cian O''Brien', 'GUEST', FALSE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'cian.obrien@example.com');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'mairead.quinn@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Mairéad Quinn', 'GUEST', FALSE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'mairead.quinn@example.com');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'fionn.sullivan@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Fionn O''Sullivan', 'GUEST', FALSE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'fionn.sullivan@example.com');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'clodagh.ryan@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Clodagh Ryan', 'GUEST', FALSE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'clodagh.ryan@example.com');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'tadhg.murphy@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Tadhg Murphy', 'GUEST', FALSE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'tadhg.murphy@example.com');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'sinead.doherty@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Sinéad Doherty', 'GUEST', FALSE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'sinead.doherty@example.com');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'ruairi.gallagher@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Ruairí Gallagher', 'GUEST', FALSE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'ruairi.gallagher@example.com');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'aileen.power@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Aileen Power', 'GUEST', FALSE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'aileen.power@example.com');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'diarmuid.keane@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Diarmuid Keane', 'GUEST', FALSE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'diarmuid.keane@example.com');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'ronan.healy@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Ronan Healy', 'GUEST', FALSE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'ronan.healy@example.com');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'grainne.lynch@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Gráinne Lynch', 'GUEST', FALSE, FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'grainne.lynch@example.com');

-- One completed stay + review per guest, spread across distinct campsites
WITH ranked_lots AS (
    SELECT l.id AS lot_id, l.owner_id, l.price_per_night,
           ROW_NUMBER() OVER (PARTITION BY l.owner_id ORDER BY l.id) AS lot_rank
    FROM lots l
    JOIN owners o ON o.id = l.owner_id
    WHERE o.is_deactivated = FALSE
),
pick_lots AS (
    SELECT lot_id, owner_id, price_per_night,
           ROW_NUMBER() OVER (ORDER BY owner_id) AS rn
    FROM ranked_lots WHERE lot_rank = 1
),
pick_guests AS (
    SELECT id AS user_id, ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM users
    WHERE email IN ('siobhan.walsh@example.com', 'cormac.nolan@example.com', 'aoife.byrne@example.com', 'padraig.kelly@example.com', 'niamh.dunne@example.com', 'eoin.mcgrath@example.com', 'orla.fitzgerald@example.com', 'cian.obrien@example.com', 'mairead.quinn@example.com', 'fionn.sullivan@example.com', 'clodagh.ryan@example.com', 'tadhg.murphy@example.com', 'sinead.doherty@example.com', 'ruairi.gallagher@example.com', 'aileen.power@example.com', 'diarmuid.keane@example.com', 'ronan.healy@example.com', 'grainne.lynch@example.com')
)
INSERT INTO bookings (user_id, lot_id, check_in_date, check_out_date, num_guests, total_price, status,
                     payment_status, service_fee, charge_total, booking_source, special_requests)
SELECT g.user_id, p.lot_id,
       DATE '2025-06-01' + (g.rn * 7)::int,
       DATE '2025-06-01' + (g.rn * 7)::int + 2,
       2,
       p.price_per_night * 2,
       'COMPLETED', 'CAPTURED',
       ROUND(p.price_per_night * 2 * 0.10, 2),
       ROUND(p.price_per_night * 2 * 1.10, 2),
       'ONLINE',
       'Ireland e2e seed stay'
FROM pick_guests g
JOIN pick_lots p ON p.rn = g.rn
WHERE NOT EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.user_id = g.user_id AND b.lot_id = p.lot_id AND b.special_requests = 'Ireland e2e seed stay'
);

WITH extra_lots AS (
    SELECT l.id AS lot_id, l.owner_id, l.price_per_night,
           ROW_NUMBER() OVER (ORDER BY l.owner_id) AS rn
    FROM lots l
    JOIN owners o ON o.id = l.owner_id
    WHERE o.is_deactivated = FALSE
      AND l.id NOT IN (SELECT lot_id FROM bookings WHERE special_requests = 'Ireland e2e seed stay')
),
seed_guests AS (
    SELECT id AS user_id, ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM users WHERE email IN (
        'family@example.com', 'solo@example.com', 'couple@example.com',
        'adventure@example.com', 'group@example.com'
    )
)
INSERT INTO bookings (user_id, lot_id, check_in_date, check_out_date, num_guests, total_price, status,
                     payment_status, service_fee, charge_total, booking_source, special_requests)
SELECT g.user_id, p.lot_id,
       DATE '2025-07-10' + (p.rn)::int,
       DATE '2025-07-10' + (p.rn)::int + 3,
       3,
       p.price_per_night * 3,
       'COMPLETED', 'CAPTURED',
       ROUND(p.price_per_night * 3 * 0.10, 2),
       ROUND(p.price_per_night * 3 * 1.10, 2),
       'ONLINE',
       'Ireland e2e extra stay'
FROM extra_lots p
JOIN seed_guests g ON g.rn = ((p.rn - 1) % 5) + 1
WHERE p.rn <= 40
  AND NOT EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.user_id = g.user_id AND b.lot_id = p.lot_id AND b.special_requests = 'Ireland e2e extra stay'
);

INSERT INTO reviews (user_id, owner_id, booking_id, rating, comment, owner_response, owner_response_at,
                     moderation_status, created_at, updated_at)
SELECT b.user_id, l.owner_id, b.id,
       (ARRAY[4.0, 4.5, 5.0, 4.0, 3.5, 5.0, 4.5, 4.0, 5.0, 3.5])[(((b.id % 10) + 1)::int)],
       (ARRAY['Woke to birdsong and a proper Irish mist over the fields. Facilities were spotless and the hosts had a map of local walks ready at check-in. We will be back with the dogs.', 'One of the best pitches we have had in years. Level, quiet, and close enough to the village for a pint. The kids vanished into the playground and we actually read a book.', 'Lovely site with a genuine sense of place. Showers were hot, which is not nothing in an Irish October. Only minus is the road noise on the front pitches — pick one further back.', 'We used this as a base for a long weekend of hiking and it could not have been better placed. Fire pit, dark skies, and a breakfast roll from the on-site shop that ruined us for petrol-station food.', 'Grand location and friendly welcome. The grass was a bit waterlogged after two days of rain — not their fault, but a boardwalk to the block would help. Fair price.', 'Glamping done properly: real mattress, warm pod, and a view I still think about. We toasted marshmallows and did not check our phones once. Rare.', 'Perfect overnight on a Wild Atlantic Way loop. Easy in, easy out, and a shower that actually had pressure. Would happily make it a two-nighter next time.', 'The children are still talking about the farm animals and the river. Hardstanding was level, hook-ups worked, and the farm shop soda bread is dangerous.', 'If you like your camping with a side of heritage, stay here. We walked to the historic site at opening time and had it to ourselves. Magical morning.', 'Nice spot but a little cramped on the touring field in August. Staff were grand and the facilities clean. Come in June if you can.', 'Surfed in the morning, seaweed bath in the afternoon, pint in the evening. The pitch behind the dunes is the one you want. Bring extra pegs.', 'We celebrated an anniversary in the cabin and it was perfect — stove going, rain on the roof, and a bottle of something local. Hosts left us alone in the best way.', 'Great jumping-off point for the national park. Buses and jaunting cars nearby if you want them; the forest trails if you do not. Quiet after 10 as promised.', 'Ferry the next morning and this was the least-stressful port stopover we have done. Hot shower, level pitch, walk to the terminal. Open late, which mattered.', 'Dark-sky night that made us feel very small in a good way. Pod was cosy, the kettle was boiled twice, and we saw the Milky Way. Unforgettable.'])[((b.id % 15) + 1)],
       CASE WHEN b.id % 5 = 0 THEN NULL ELSE (ARRAY['Go raibh maith agat — delighted you had a good stay. We have noted the pitch advice and will keep the back field for tents in the wet months.', 'Thanks a million for the kind words. The soda bread is a point of pride. See you next season.', 'Really glad the walks worked out. Ask at reception next time and we will lend you the laminated loop cards.', 'Appreciate the honest note about August crowding — we cap touring numbers now on bank-holiday weekends.', 'The dark-sky forecast is on the blackboard every evening. Hope to welcome you back for the Perseids.'])[((b.id % 5) + 1)] END,
       CASE WHEN b.id % 5 = 0 THEN NULL ELSE b.created_at + INTERVAL '3 days' END,
       'APPROVED',
       CURRENT_TIMESTAMP - INTERVAL '20 days' - (((b.id % 40)::text) || ' days')::interval,
       CURRENT_TIMESTAMP - INTERVAL '10 days'
FROM bookings b
JOIN lots l ON l.id = b.lot_id
WHERE b.special_requests IN ('Ireland e2e seed stay', 'Ireland e2e extra stay')
  AND NOT EXISTS (SELECT 1 FROM reviews r WHERE r.booking_id = b.id);

-- Future confirmed stays so owner calendars and guest trips are not empty
INSERT INTO bookings (user_id, lot_id, check_in_date, check_out_date, num_guests, total_price, status,
                     payment_status, service_fee, charge_total, booking_source, special_requests)
SELECT u.id, l.id,
       CURRENT_DATE + (21 + (o.id % 30))::int,
       CURRENT_DATE + (24 + (o.id % 30))::int,
       2, l.price_per_night * 3,
       'CONFIRMED', 'CAPTURED',
       ROUND(l.price_per_night * 3 * 0.10, 2),
       ROUND(l.price_per_night * 3 * 1.10, 2),
       'ONLINE', 'Ireland e2e upcoming stay'
FROM owners o
JOIN lots l ON l.owner_id = o.id
JOIN users u ON u.email = 'family@example.com'
WHERE o.is_featured = TRUE
  AND l.id = (SELECT MIN(l2.id) FROM lots l2 WHERE l2.owner_id = o.id)
  AND NOT EXISTS (
      SELECT 1 FROM bookings b WHERE b.lot_id = l.id AND b.special_requests = 'Ireland e2e upcoming stay'
  );

UPDATE owners o SET
    rating = sub.avg_rating,
    review_count = sub.cnt
FROM (
    SELECT owner_id, ROUND(AVG(rating), 1) AS avg_rating, COUNT(*) AS cnt
    FROM reviews
    WHERE moderation_status = 'APPROVED'
    GROUP BY owner_id
) sub
WHERE o.id = sub.owner_id;

--------------------------------------------------------------------------------
-- 8. Local suppliers + offers in the newly covered counties
--------------------------------------------------------------------------------
INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'dublin.bikes@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Phoenix Park Cycle Hire', 'SUPPLIER', FALSE, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'dublin.bikes@myisland.com');

INSERT INTO suppliers (user_id, business_name, category, description, county, town, address, phone, website,
                      is_verified, latitude, longitude, subscription_status, stripe_customer_id,
                      stripe_subscription_id, subscription_current_period_end)
SELECT u.id,
       'Phoenix Park Cycle Hire', 'EQUIPMENT_RENTAL', 'Bike hire at the edge of Phoenix Park — 707 hectares of deer, avenues and the Papal Cross. City-to-coast loops mapped for you.', 'Dublin', 'Dublin', 'Chesterfield Avenue, Phoenix Park',
       '+353 1 677 0090', 'https://phoenixparkcycles.ie', TRUE, 53.3559, -6.3298,
       'ACTIVE', 'cus_e2e_supplier_' || u.id, 'sub_e2e_supplier_' || u.id,
       CURRENT_TIMESTAMP + INTERVAL '365 days'
FROM users u WHERE u.email = 'dublin.bikes@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM suppliers s WHERE s.user_id = u.id);

INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase,
                    terms_conditions, valid_from, valid_until, max_claims, is_active, image_url)
SELECT s.id,
       'Campsite guest rate',
       'Show a valid My Island booking and save on the day. Limited daily capacity.',
       'PERCENTAGE', 15.00, 20.00,
       'One claim per booking. Subject to availability. Cannot be combined with other offers.',
       CURRENT_DATE, CURRENT_DATE + INTERVAL '9 months', 200, TRUE,
       'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=1200'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'dublin.bikes@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = 'Campsite guest rate');

INSERT INTO entity_images (entity_type, entity_id, s3_key, url, filename, content_type, file_size, display_order, is_primary, alt_text)
SELECT 'SUPPLIER', s.id, 'e2e/suppliers/' || s.id || '/hero.jpg',
       'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=1200', 'hero.jpg', 'image/jpeg', 120000, 0, TRUE, 'Phoenix Park Cycle Hire'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'dublin.bikes@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM entity_images ei WHERE ei.s3_key = 'e2e/suppliers/' || s.id || '/hero.jpg');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'howth.lobster@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Howth Harbour Lobster Shack', 'SUPPLIER', FALSE, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'howth.lobster@myisland.com');

INSERT INTO suppliers (user_id, business_name, category, description, county, town, address, phone, website,
                      is_verified, latitude, longitude, subscription_status, stripe_customer_id,
                      stripe_subscription_id, subscription_current_period_end)
SELECT u.id,
       'Howth Harbour Lobster Shack', 'RESTAURANT', 'Day-boat lobster, chowder and brown bread on Howth Pier. Book a table or take a picnic back to the cliff camp.', 'Dublin', 'Howth', 'West Pier, Howth',
       '+353 1 832 4100', 'https://howthlobstershack.ie', TRUE, 53.3915, -6.069,
       'ACTIVE', 'cus_e2e_supplier_' || u.id, 'sub_e2e_supplier_' || u.id,
       CURRENT_TIMESTAMP + INTERVAL '365 days'
FROM users u WHERE u.email = 'howth.lobster@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM suppliers s WHERE s.user_id = u.id);

INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase,
                    terms_conditions, valid_from, valid_until, max_claims, is_active, image_url)
SELECT s.id,
       'Campsite guest rate',
       'Show a valid My Island booking and save on the day. Limited daily capacity.',
       'PERCENTAGE', 15.00, 20.00,
       'One claim per booking. Subject to availability. Cannot be combined with other offers.',
       CURRENT_DATE, CURRENT_DATE + INTERVAL '9 months', 200, TRUE,
       'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'howth.lobster@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = 'Campsite guest rate');

INSERT INTO entity_images (entity_type, entity_id, s3_key, url, filename, content_type, file_size, display_order, is_primary, alt_text)
SELECT 'SUPPLIER', s.id, 'e2e/suppliers/' || s.id || '/hero.jpg',
       'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200', 'hero.jpg', 'image/jpeg', 120000, 0, TRUE, 'Howth Harbour Lobster Shack'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'howth.lobster@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM entity_images ei WHERE ei.s3_key = 'e2e/suppliers/' || s.id || '/hero.jpg');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'athy.canal@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Barrow Line Boats', 'SUPPLIER', FALSE, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'athy.canal@myisland.com');

INSERT INTO suppliers (user_id, business_name, category, description, county, town, address, phone, website,
                      is_verified, latitude, longitude, subscription_status, stripe_customer_id,
                      stripe_subscription_id, subscription_current_period_end)
SELECT u.id,
       'Barrow Line Boats', 'ACTIVITY_PROVIDER', 'Day-hire narrowboats and kayaks on the Barrow and Grand Canal at Athy. No licence needed for the day boats.', 'Kildare', 'Athy', 'The Harbour, Athy',
       '+353 59 863 4400', 'https://barrowlineboats.ie', TRUE, 52.9915, -6.984,
       'ACTIVE', 'cus_e2e_supplier_' || u.id, 'sub_e2e_supplier_' || u.id,
       CURRENT_TIMESTAMP + INTERVAL '365 days'
FROM users u WHERE u.email = 'athy.canal@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM suppliers s WHERE s.user_id = u.id);

INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase,
                    terms_conditions, valid_from, valid_until, max_claims, is_active, image_url)
SELECT s.id,
       'Campsite guest rate',
       'Show a valid My Island booking and save on the day. Limited daily capacity.',
       'PERCENTAGE', 15.00, 20.00,
       'One claim per booking. Subject to availability. Cannot be combined with other offers.',
       CURRENT_DATE, CURRENT_DATE + INTERVAL '9 months', 200, TRUE,
       'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'athy.canal@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = 'Campsite guest rate');

INSERT INTO entity_images (entity_type, entity_id, s3_key, url, filename, content_type, file_size, display_order, is_primary, alt_text)
SELECT 'SUPPLIER', s.id, 'e2e/suppliers/' || s.id || '/hero.jpg',
       'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200', 'hero.jpg', 'image/jpeg', 120000, 0, TRUE, 'Barrow Line Boats'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'athy.canal@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM entity_images ei WHERE ei.s3_key = 'e2e/suppliers/' || s.id || '/hero.jpg');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'kildare.stud@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Curragh Trail Rides', 'SUPPLIER', FALSE, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'kildare.stud@myisland.com');

INSERT INTO suppliers (user_id, business_name, category, description, county, town, address, phone, website,
                      is_verified, latitude, longitude, subscription_status, stripe_customer_id,
                      stripe_subscription_id, subscription_current_period_end)
SELECT u.id,
       'Curragh Trail Rides', 'ACTIVITY_PROVIDER', 'Guided hacks across the Curragh plains. See racehorses at work and the National Stud from the saddle.', 'Kildare', 'Kildare Town', 'Tully Road, Kildare',
       '+353 45 521 200', 'https://curraghtrails.ie', TRUE, 53.156, -6.911,
       'ACTIVE', 'cus_e2e_supplier_' || u.id, 'sub_e2e_supplier_' || u.id,
       CURRENT_TIMESTAMP + INTERVAL '365 days'
FROM users u WHERE u.email = 'kildare.stud@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM suppliers s WHERE s.user_id = u.id);

INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase,
                    terms_conditions, valid_from, valid_until, max_claims, is_active, image_url)
SELECT s.id,
       'Campsite guest rate',
       'Show a valid My Island booking and save on the day. Limited daily capacity.',
       'PERCENTAGE', 15.00, 20.00,
       'One claim per booking. Subject to availability. Cannot be combined with other offers.',
       CURRENT_DATE, CURRENT_DATE + INTERVAL '9 months', 200, TRUE,
       'https://images.unsplash.com/photo-1475924156734-496f6cae6d46?auto=format&fit=crop&q=80&w=1200'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'kildare.stud@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = 'Campsite guest rate');

INSERT INTO entity_images (entity_type, entity_id, s3_key, url, filename, content_type, file_size, display_order, is_primary, alt_text)
SELECT 'SUPPLIER', s.id, 'e2e/suppliers/' || s.id || '/hero.jpg',
       'https://images.unsplash.com/photo-1475924156734-496f6cae6d46?auto=format&fit=crop&q=80&w=1200', 'hero.jpg', 'image/jpeg', 120000, 0, TRUE, 'Curragh Trail Rides'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'kildare.stud@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM entity_images ei WHERE ei.s3_key = 'e2e/suppliers/' || s.id || '/hero.jpg');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'carlow.kayak@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Barrow Valley Kayaks', 'SUPPLIER', FALSE, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'carlow.kayak@myisland.com');

INSERT INTO suppliers (user_id, business_name, category, description, county, town, address, phone, website,
                      is_verified, latitude, longitude, subscription_status, stripe_customer_id,
                      stripe_subscription_id, subscription_current_period_end)
SELECT u.id,
       'Barrow Valley Kayaks', 'ACTIVITY_PROVIDER', 'Guided paddles on the River Barrow through the Barrow Gap. Beginners welcome, seals occasionally too.', 'Carlow', 'Borris', 'The Quay, Borris',
       '+353 59 977 2800', 'https://barrowvalleykayaks.ie', TRUE, 52.601, -6.928,
       'ACTIVE', 'cus_e2e_supplier_' || u.id, 'sub_e2e_supplier_' || u.id,
       CURRENT_TIMESTAMP + INTERVAL '365 days'
FROM users u WHERE u.email = 'carlow.kayak@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM suppliers s WHERE s.user_id = u.id);

INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase,
                    terms_conditions, valid_from, valid_until, max_claims, is_active, image_url)
SELECT s.id,
       'Campsite guest rate',
       'Show a valid My Island booking and save on the day. Limited daily capacity.',
       'PERCENTAGE', 15.00, 20.00,
       'One claim per booking. Subject to availability. Cannot be combined with other offers.',
       CURRENT_DATE, CURRENT_DATE + INTERVAL '9 months', 200, TRUE,
       'https://images.unsplash.com/photo-1475924156734-496f6cae6d46?auto=format&fit=crop&q=80&w=1200'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'carlow.kayak@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = 'Campsite guest rate');

INSERT INTO entity_images (entity_type, entity_id, s3_key, url, filename, content_type, file_size, display_order, is_primary, alt_text)
SELECT 'SUPPLIER', s.id, 'e2e/suppliers/' || s.id || '/hero.jpg',
       'https://images.unsplash.com/photo-1475924156734-496f6cae6d46?auto=format&fit=crop&q=80&w=1200', 'hero.jpg', 'image/jpeg', 120000, 0, TRUE, 'Barrow Valley Kayaks'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'carlow.kayak@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM entity_images ei WHERE ei.s3_key = 'e2e/suppliers/' || s.id || '/hero.jpg');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'cavan.boats@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Ramor Boat Hire', 'SUPPLIER', FALSE, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'cavan.boats@myisland.com');

INSERT INTO suppliers (user_id, business_name, category, description, county, town, address, phone, website,
                      is_verified, latitude, longitude, subscription_status, stripe_customer_id,
                      stripe_subscription_id, subscription_current_period_end)
SELECT u.id,
       'Ramor Boat Hire', 'EQUIPMENT_RENTAL', 'Rowing boats and small outboards on Lough Ramor. Island picnics and coarse fishing from the water.', 'Cavan', 'Virginia', 'Ryefield, Virginia',
       '+353 49 854 6200', 'https://ramorboathire.ie', TRUE, 53.833, -7.082,
       'ACTIVE', 'cus_e2e_supplier_' || u.id, 'sub_e2e_supplier_' || u.id,
       CURRENT_TIMESTAMP + INTERVAL '365 days'
FROM users u WHERE u.email = 'cavan.boats@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM suppliers s WHERE s.user_id = u.id);

INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase,
                    terms_conditions, valid_from, valid_until, max_claims, is_active, image_url)
SELECT s.id,
       'Campsite guest rate',
       'Show a valid My Island booking and save on the day. Limited daily capacity.',
       'PERCENTAGE', 15.00, 20.00,
       'One claim per booking. Subject to availability. Cannot be combined with other offers.',
       CURRENT_DATE, CURRENT_DATE + INTERVAL '9 months', 200, TRUE,
       'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=1200'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'cavan.boats@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = 'Campsite guest rate');

INSERT INTO entity_images (entity_type, entity_id, s3_key, url, filename, content_type, file_size, display_order, is_primary, alt_text)
SELECT 'SUPPLIER', s.id, 'e2e/suppliers/' || s.id || '/hero.jpg',
       'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=1200', 'hero.jpg', 'image/jpeg', 120000, 0, TRUE, 'Ramor Boat Hire'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'cavan.boats@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM entity_images ei WHERE ei.s3_key = 'e2e/suppliers/' || s.id || '/hero.jpg');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'longford.greenway@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Royal Canal Cycles', 'SUPPLIER', FALSE, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'longford.greenway@myisland.com');

INSERT INTO suppliers (user_id, business_name, category, description, county, town, address, phone, website,
                      is_verified, latitude, longitude, subscription_status, stripe_customer_id,
                      stripe_subscription_id, subscription_current_period_end)
SELECT u.id,
       'Royal Canal Cycles', 'EQUIPMENT_RENTAL', 'Hybrid and e-bike hire for the Royal Canal Greenway through Longford. One-way drops to Mullingar by arrangement.', 'Longford', 'Longford Town', 'Market Square, Longford',
       '+353 43 334 5500', 'https://royalcanalcycles.ie', TRUE, 53.727, -7.798,
       'ACTIVE', 'cus_e2e_supplier_' || u.id, 'sub_e2e_supplier_' || u.id,
       CURRENT_TIMESTAMP + INTERVAL '365 days'
FROM users u WHERE u.email = 'longford.greenway@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM suppliers s WHERE s.user_id = u.id);

INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase,
                    terms_conditions, valid_from, valid_until, max_claims, is_active, image_url)
SELECT s.id,
       'Campsite guest rate',
       'Show a valid My Island booking and save on the day. Limited daily capacity.',
       'PERCENTAGE', 15.00, 20.00,
       'One claim per booking. Subject to availability. Cannot be combined with other offers.',
       CURRENT_DATE, CURRENT_DATE + INTERVAL '9 months', 200, TRUE,
       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'longford.greenway@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = 'Campsite guest rate');

INSERT INTO entity_images (entity_type, entity_id, s3_key, url, filename, content_type, file_size, display_order, is_primary, alt_text)
SELECT 'SUPPLIER', s.id, 'e2e/suppliers/' || s.id || '/hero.jpg',
       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200', 'hero.jpg', 'image/jpeg', 120000, 0, TRUE, 'Royal Canal Cycles'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'longford.greenway@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM entity_images ei WHERE ei.s3_key = 'e2e/suppliers/' || s.id || '/hero.jpg');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'monaghan.market@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Blayney Market Kitchen', 'SUPPLIER', FALSE, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'monaghan.market@myisland.com');

INSERT INTO suppliers (user_id, business_name, category, description, county, town, address, phone, website,
                      is_verified, latitude, longitude, subscription_status, stripe_customer_id,
                      stripe_subscription_id, subscription_current_period_end)
SELECT u.id,
       'Blayney Market Kitchen', 'FARM_SHOP', 'Monaghan farm produce, apple juice from Armagh orchards, and soda bread baked before dawn. Picnic boxes for Muckno.', 'Monaghan', 'Castleblayney', 'Main Street, Castleblayney',
       '+353 42 974 1800', 'https://blayneymarket.ie', TRUE, 54.12, -6.737,
       'ACTIVE', 'cus_e2e_supplier_' || u.id, 'sub_e2e_supplier_' || u.id,
       CURRENT_TIMESTAMP + INTERVAL '365 days'
FROM users u WHERE u.email = 'monaghan.market@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM suppliers s WHERE s.user_id = u.id);

INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase,
                    terms_conditions, valid_from, valid_until, max_claims, is_active, image_url)
SELECT s.id,
       'Campsite guest rate',
       'Show a valid My Island booking and save on the day. Limited daily capacity.',
       'PERCENTAGE', 15.00, 20.00,
       'One claim per booking. Subject to availability. Cannot be combined with other offers.',
       CURRENT_DATE, CURRENT_DATE + INTERVAL '9 months', 200, TRUE,
       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'monaghan.market@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = 'Campsite guest rate');

INSERT INTO entity_images (entity_type, entity_id, s3_key, url, filename, content_type, file_size, display_order, is_primary, alt_text)
SELECT 'SUPPLIER', s.id, 'e2e/suppliers/' || s.id || '/hero.jpg',
       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200', 'hero.jpg', 'image/jpeg', 120000, 0, TRUE, 'Blayney Market Kitchen'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'monaghan.market@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM entity_images ei WHERE ei.s3_key = 'e2e/suppliers/' || s.id || '/hero.jpg');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'roscommon.forest@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Lough Key Adventures', 'SUPPLIER', FALSE, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'roscommon.forest@myisland.com');

INSERT INTO suppliers (user_id, business_name, category, description, county, town, address, phone, website,
                      is_verified, latitude, longitude, subscription_status, stripe_customer_id,
                      stripe_subscription_id, subscription_current_period_end)
SELECT u.id,
       'Lough Key Adventures', 'ACTIVITY_PROVIDER', 'Zip-line, Boda Borg and forest trails at Lough Key. Campsite guests get a late slot on the zip-line.', 'Roscommon', 'Boyle', 'Lough Key Forest Park',
       '+353 71 967 3122', 'https://loughkeyadventures.ie', TRUE, 53.99, -8.241,
       'ACTIVE', 'cus_e2e_supplier_' || u.id, 'sub_e2e_supplier_' || u.id,
       CURRENT_TIMESTAMP + INTERVAL '365 days'
FROM users u WHERE u.email = 'roscommon.forest@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM suppliers s WHERE s.user_id = u.id);

INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase,
                    terms_conditions, valid_from, valid_until, max_claims, is_active, image_url)
SELECT s.id,
       'Campsite guest rate',
       'Show a valid My Island booking and save on the day. Limited daily capacity.',
       'PERCENTAGE', 15.00, 20.00,
       'One claim per booking. Subject to availability. Cannot be combined with other offers.',
       CURRENT_DATE, CURRENT_DATE + INTERVAL '9 months', 200, TRUE,
       'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=1200'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'roscommon.forest@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = 'Campsite guest rate');

INSERT INTO entity_images (entity_type, entity_id, s3_key, url, filename, content_type, file_size, display_order, is_primary, alt_text)
SELECT 'SUPPLIER', s.id, 'e2e/suppliers/' || s.id || '/hero.jpg',
       'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=1200', 'hero.jpg', 'image/jpeg', 120000, 0, TRUE, 'Lough Key Adventures'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'roscommon.forest@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM entity_images ei WHERE ei.s3_key = 'e2e/suppliers/' || s.id || '/hero.jpg');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'armagh.cidery@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Orchard County Cider House', 'SUPPLIER', FALSE, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'armagh.cidery@myisland.com');

INSERT INTO suppliers (user_id, business_name, category, description, county, town, address, phone, website,
                      is_verified, latitude, longitude, subscription_status, stripe_customer_id,
                      stripe_subscription_id, subscription_current_period_end)
SELECT u.id,
       'Orchard County Cider House', 'FARM_SHOP', 'Armagh apple country tastings, farm shop and a short orchard walk. Non-alcoholic juices for the designated driver.', 'Armagh', 'Markethill', 'Orchard Road, Markethill',
       '+44 28 3755 2100', 'https://orchardcountycider.com', TRUE, 54.296, -6.523,
       'ACTIVE', 'cus_e2e_supplier_' || u.id, 'sub_e2e_supplier_' || u.id,
       CURRENT_TIMESTAMP + INTERVAL '365 days'
FROM users u WHERE u.email = 'armagh.cidery@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM suppliers s WHERE s.user_id = u.id);

INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase,
                    terms_conditions, valid_from, valid_until, max_claims, is_active, image_url)
SELECT s.id,
       'Campsite guest rate',
       'Show a valid My Island booking and save on the day. Limited daily capacity.',
       'PERCENTAGE', 15.00, 20.00,
       'One claim per booking. Subject to availability. Cannot be combined with other offers.',
       CURRENT_DATE, CURRENT_DATE + INTERVAL '9 months', 200, TRUE,
       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'armagh.cidery@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = 'Campsite guest rate');

INSERT INTO entity_images (entity_type, entity_id, s3_key, url, filename, content_type, file_size, display_order, is_primary, alt_text)
SELECT 'SUPPLIER', s.id, 'e2e/suppliers/' || s.id || '/hero.jpg',
       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200', 'hero.jpg', 'image/jpeg', 120000, 0, TRUE, 'Orchard County Cider House'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'armagh.cidery@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM entity_images ei WHERE ei.s3_key = 'e2e/suppliers/' || s.id || '/hero.jpg');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'tyrone.walks@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Sperrins Walking Guides', 'SUPPLIER', FALSE, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'tyrone.walks@myisland.com');

INSERT INTO suppliers (user_id, business_name, category, description, county, town, address, phone, website,
                      is_verified, latitude, longitude, subscription_status, stripe_customer_id,
                      stripe_subscription_id, subscription_current_period_end)
SELECT u.id,
       'Sperrins Walking Guides', 'TOUR_OPERATOR', 'Guided hill days in the Sperrins: Mullaghcarn, Sawel, and the Ulster Way. Small groups, local weather knowledge.', 'Tyrone', 'Gortin', 'Main Street, Gortin',
       '+44 28 8164 7200', 'https://sperrinsguides.com', TRUE, 54.717, -7.24,
       'ACTIVE', 'cus_e2e_supplier_' || u.id, 'sub_e2e_supplier_' || u.id,
       CURRENT_TIMESTAMP + INTERVAL '365 days'
FROM users u WHERE u.email = 'tyrone.walks@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM suppliers s WHERE s.user_id = u.id);

INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase,
                    terms_conditions, valid_from, valid_until, max_claims, is_active, image_url)
SELECT s.id,
       'Campsite guest rate',
       'Show a valid My Island booking and save on the day. Limited daily capacity.',
       'PERCENTAGE', 15.00, 20.00,
       'One claim per booking. Subject to availability. Cannot be combined with other offers.',
       CURRENT_DATE, CURRENT_DATE + INTERVAL '9 months', 200, TRUE,
       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'tyrone.walks@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = 'Campsite guest rate');

INSERT INTO entity_images (entity_type, entity_id, s3_key, url, filename, content_type, file_size, display_order, is_primary, alt_text)
SELECT 'SUPPLIER', s.id, 'e2e/suppliers/' || s.id || '/hero.jpg',
       'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200', 'hero.jpg', 'image/jpeg', 120000, 0, TRUE, 'Sperrins Walking Guides'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'tyrone.walks@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM entity_images ei WHERE ei.s3_key = 'e2e/suppliers/' || s.id || '/hero.jpg');

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier, email_verified)
SELECT 'derry.surf@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Benone Surf Co', 'SUPPLIER', FALSE, TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'derry.surf@myisland.com');

INSERT INTO suppliers (user_id, business_name, category, description, county, town, address, phone, website,
                      is_verified, latitude, longitude, subscription_status, stripe_customer_id,
                      stripe_subscription_id, subscription_current_period_end)
SELECT u.id,
       'Benone Surf Co', 'ACTIVITY_PROVIDER', 'Surf and stand-up paddle lessons on Benone and Magilligan. Wetsuits included; the Atlantic is not optional.', 'Derry', 'Limavady', 'Benone Strand',
       '+44 28 7775 0400', 'https://benonesurf.com', TRUE, 55.167, -6.86,
       'ACTIVE', 'cus_e2e_supplier_' || u.id, 'sub_e2e_supplier_' || u.id,
       CURRENT_TIMESTAMP + INTERVAL '365 days'
FROM users u WHERE u.email = 'derry.surf@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM suppliers s WHERE s.user_id = u.id);

INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase,
                    terms_conditions, valid_from, valid_until, max_claims, is_active, image_url)
SELECT s.id,
       'Campsite guest rate',
       'Show a valid My Island booking and save on the day. Limited daily capacity.',
       'PERCENTAGE', 15.00, 20.00,
       'One claim per booking. Subject to availability. Cannot be combined with other offers.',
       CURRENT_DATE, CURRENT_DATE + INTERVAL '9 months', 200, TRUE,
       'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=1200'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'derry.surf@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM offers o WHERE o.supplier_id = s.id AND o.title = 'Campsite guest rate');

INSERT INTO entity_images (entity_type, entity_id, s3_key, url, filename, content_type, file_size, display_order, is_primary, alt_text)
SELECT 'SUPPLIER', s.id, 'e2e/suppliers/' || s.id || '/hero.jpg',
       'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=1200', 'hero.jpg', 'image/jpeg', 120000, 0, TRUE, 'Benone Surf Co'
FROM suppliers s JOIN users u ON s.user_id = u.id
WHERE u.email = 'derry.surf@myisland.com'
  AND NOT EXISTS (SELECT 1 FROM entity_images ei WHERE ei.s3_key = 'e2e/suppliers/' || s.id || '/hero.jpg');

--------------------------------------------------------------------------------
-- 9. Peak-season pricing + a few blocked dates so calendars look lived-in
--------------------------------------------------------------------------------
INSERT INTO seasonal_pricing_rules (owner_id, lot_type, name, start_date, end_date, price_per_night, min_stay)
SELECT o.id, l.lot_type, 'Summer peak',
       (DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' + INTERVAL '6 months')::date,
       (DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year' + INTERVAL '8 months')::date,
       ROUND(l.price_per_night * 1.25, 2),
       GREATEST(l.min_stay, 2)
FROM owners o
JOIN LATERAL (
    SELECT lot_type, MIN(price_per_night) AS price_per_night, MIN(min_stay) AS min_stay
    FROM lots WHERE owner_id = o.id
    GROUP BY lot_type
) l ON TRUE
WHERE o.is_featured = TRUE
  AND NOT EXISTS (
      SELECT 1 FROM seasonal_pricing_rules r
      WHERE r.owner_id = o.id AND r.name = 'Summer peak' AND r.lot_type = l.lot_type
  );

INSERT INTO lot_blocked_periods (lot_id, start_date, end_date, reason, created_by)
SELECT l.id,
       CURRENT_DATE + 40,
       CURRENT_DATE + 43,
       'Private event / site maintenance',
       o.user_id
FROM lots l
JOIN owners o ON o.id = l.owner_id
WHERE o.is_featured = TRUE
  AND l.id = (SELECT MAX(l2.id) FROM lots l2 WHERE l2.owner_id = o.id)
  AND NOT EXISTS (
      SELECT 1 FROM lot_blocked_periods bp WHERE bp.lot_id = l.id AND bp.reason = 'Private event / site maintenance'
  );

--------------------------------------------------------------------------------
-- 10. Sanity: keep Lough Derg / Dingle Kayak as the unsubscribed test pair
--------------------------------------------------------------------------------
UPDATE owners SET subscription_status = 'NONE',
    stripe_customer_id = NULL, stripe_subscription_id = NULL, subscription_current_period_end = NULL
WHERE user_id = (SELECT id FROM users WHERE email = 'bookings@loughdergcamping.ie');

UPDATE suppliers SET subscription_status = 'NONE',
    stripe_customer_id = NULL, stripe_subscription_id = NULL, subscription_current_period_end = NULL
WHERE user_id = (SELECT id FROM users WHERE email = 'hello@dinglekayak.ie');

-- Instant booking on for the catalogue (except a couple of request-to-book sites)
UPDATE owners SET instant_booking = TRUE WHERE instant_booking IS DISTINCT FROM TRUE;
UPDATE owners SET instant_booking = FALSE
WHERE property_name IN ('Black Valley Wild', 'Donegal Wild Camping', 'Cape Clear Island');

