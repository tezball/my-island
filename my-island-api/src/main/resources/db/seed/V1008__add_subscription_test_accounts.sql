-- V1008: Add subscription test accounts and activate existing test account subscriptions

-- ============================================================================
-- Part A: Create new test users WITHOUT subscriptions (for testing subscription gates)
-- ============================================================================

-- Lough Derg Lakeside Camping - Owner without subscription
INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier)
VALUES ('bookings@loughdergcamping.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Cormac Fitzgerald', 'OWNER', TRUE, FALSE);

INSERT INTO owners (user_id, property_name, county, town, property_type, description, latitude, longitude, phone, website)
VALUES (
    (SELECT id FROM users WHERE email = 'bookings@loughdergcamping.ie'),
    'Lough Derg Lakeside Camping',
    'Tipperary',
    'Ballina',
    'CAMPSITE',
    'Family-friendly lakeside camping on the shores of Lough Derg. Perfect base for water sports, fishing, and exploring the Shannon region. Grass pitches with lake views and modern facilities.',
    52.8089,
    -8.4422,
    '+353 67 382 456',
    'https://loughdergcamping.ie'
);

-- Add lots for Lough Derg Lakeside Camping
INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, is_active, image_url)
VALUES
    ((SELECT id FROM owners WHERE property_name = 'Lough Derg Lakeside Camping'), 'Lakefront Pitch 1', 'TENT', 'Prime waterfront grass pitch with stunning sunrise views over Lough Derg. Direct access to swimming area.', 28.00, 4, TRUE, '/images/lots/lakefront-1.jpg'),
    ((SELECT id FROM owners WHERE property_name = 'Lough Derg Lakeside Camping'), 'Lakefront Pitch 2', 'TENT', 'Secluded corner pitch perfect for families. Flat ground with soft grass, morning sun.', 28.00, 4, TRUE, '/images/lots/lakefront-2.jpg'),
    ((SELECT id FROM owners WHERE property_name = 'Lough Derg Lakeside Camping'), 'Lakefront Pitch 3', 'TENT', 'Our largest pitch ideal for groups or family camping with multiple tents.', 32.00, 6, TRUE, '/images/lots/lakefront-3.jpg'),
    ((SELECT id FROM owners WHERE property_name = 'Lough Derg Lakeside Camping'), 'Woodland Pitch', 'TENT', 'Shaded pitch under mature oaks. Perfect for hot summer days with natural shelter.', 25.00, 4, TRUE, '/images/lots/woodland-pitch.jpg'),
    ((SELECT id FROM owners WHERE property_name = 'Lough Derg Lakeside Camping'), 'Hardstanding A', 'CAMPERVAN', 'Level hardstanding with 16A electric hookup. Easy access to water point and waste disposal.', 38.00, 4, TRUE, '/images/lots/hardstanding-a.jpg'),
    ((SELECT id FROM owners WHERE property_name = 'Lough Derg Lakeside Camping'), 'Hardstanding B', 'CAMPERVAN', 'Premium lakeside hardstanding for motorhomes with full services and unobstructed views.', 42.00, 4, TRUE, '/images/lots/hardstanding-b.jpg'),
    ((SELECT id FROM owners WHERE property_name = 'Lough Derg Lakeside Camping'), 'Fisherman''s Cabin', 'CABIN', 'Cosy wooden cabin with rod storage, fish cleaning station, and covered deck overlooking the lake.', 95.00, 2, TRUE, '/images/lots/fishermans-cabin.jpg'),
    ((SELECT id FROM owners WHERE property_name = 'Lough Derg Lakeside Camping'), 'Family Pod', 'POD', 'Modern glamping pod sleeping 4 with kitchenette, heating, and private BBQ area.', 110.00, 4, TRUE, '/images/lots/family-pod.jpg');

-- Add amenities for Lough Derg Lakeside lots (using owner join to avoid conflicts)
INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id FROM lots l
JOIN owners o ON l.owner_id = o.id
CROSS JOIN amenities a
WHERE o.property_name = 'Lough Derg Lakeside Camping'
AND l.name = 'Lakefront Pitch 1' AND a.name IN ('Fire Pit', 'BBQ', 'Picnic Table');

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id FROM lots l
JOIN owners o ON l.owner_id = o.id
CROSS JOIN amenities a
WHERE o.property_name = 'Lough Derg Lakeside Camping'
AND l.name = 'Lakefront Pitch 2' AND a.name IN ('Fire Pit', 'Picnic Table');

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id FROM lots l
JOIN owners o ON l.owner_id = o.id
CROSS JOIN amenities a
WHERE o.property_name = 'Lough Derg Lakeside Camping'
AND l.name = 'Lakefront Pitch 3' AND a.name IN ('Fire Pit', 'BBQ', 'Picnic Table', 'Pet Friendly');

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id FROM lots l
JOIN owners o ON l.owner_id = o.id
CROSS JOIN amenities a
WHERE o.property_name = 'Lough Derg Lakeside Camping'
AND l.name = 'Woodland Pitch' AND a.name IN ('Fire Pit', 'Picnic Table', 'Pet Friendly');

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id FROM lots l
JOIN owners o ON l.owner_id = o.id
CROSS JOIN amenities a
WHERE o.property_name = 'Lough Derg Lakeside Camping'
AND l.name = 'Hardstanding A' AND a.name IN ('Electricity', 'Water Hookup', 'Parking');

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id FROM lots l
JOIN owners o ON l.owner_id = o.id
CROSS JOIN amenities a
WHERE o.property_name = 'Lough Derg Lakeside Camping'
AND l.name = 'Hardstanding B' AND a.name IN ('Electricity', 'Water Hookup', 'Parking', 'WiFi');

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id FROM lots l
JOIN owners o ON l.owner_id = o.id
CROSS JOIN amenities a
WHERE o.property_name = 'Lough Derg Lakeside Camping'
AND l.name = 'Fisherman''s Cabin' AND a.name IN ('WiFi', 'Electricity', 'Toilet', 'Shower');

INSERT INTO lot_amenities (lot_id, amenity_id)
SELECT l.id, a.id FROM lots l
JOIN owners o ON l.owner_id = o.id
CROSS JOIN amenities a
WHERE o.property_name = 'Lough Derg Lakeside Camping'
AND l.name = 'Family Pod' AND a.name IN ('WiFi', 'Electricity', 'Toilet', 'Shower', 'BBQ');

-- Add campsite amenities for Lough Derg Lakeside
INSERT INTO campsite_amenities (owner_id, amenity_id)
SELECT o.id, a.id FROM owners o, amenities a
WHERE o.property_name = 'Lough Derg Lakeside Camping'
AND a.name IN ('WiFi', 'Toilet', 'Shower', 'Parking', 'Playground', 'Swimming', 'Fishing', 'Laundry', 'Shop');

-- ============================================================================
-- Dingle Kayak Adventures - Supplier without subscription
-- ============================================================================

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier)
VALUES ('hello@dinglekayak.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Aoife Brennan', 'SUPPLIER', FALSE, TRUE);

INSERT INTO suppliers (user_id, business_name, category, description, county, town, address, phone, website, is_verified)
VALUES (
    (SELECT id FROM users WHERE email = 'hello@dinglekayak.ie'),
    'Dingle Kayak Adventures',
    'ACTIVITY_PROVIDER',
    'Guided sea kayaking tours around the stunning Dingle Peninsula. Experience hidden coves, sea caves, and maybe spot Fungie the dolphin! All equipment provided, suitable for beginners and experienced paddlers.',
    'Kerry',
    'Dingle',
    'The Marina, Dingle, Co. Kerry, V92 HX93',
    '+353 66 915 2344',
    'https://dinglekayak.ie',
    TRUE
);

-- Add offers for Dingle Kayak Adventures
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active)
VALUES
    (
        (SELECT id FROM suppliers WHERE business_name = 'Dingle Kayak Adventures'),
        '€15 Off Sea Cave Tour',
        'Explore the famous sea caves of Slea Head with our experienced guides. This 3-hour adventure includes all equipment and a hot drink at the finish.',
        'FIXED_AMOUNT',
        15.00,
        55.00,
        'Valid for our Sea Cave Explorer tour only. Booking required 24 hours in advance. Subject to weather conditions.',
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '6 months',
        100,
        TRUE
    ),
    (
        (SELECT id FROM suppliers WHERE business_name = 'Dingle Kayak Adventures'),
        'Sunset Paddle - 20% Off',
        'Experience the magic of Dingle Bay as the sun sets over the Atlantic. A gentle 2-hour paddle perfect for beginners and romantics.',
        'PERCENTAGE',
        20.00,
        45.00,
        'Available May-September, weather permitting. Departs 2 hours before sunset. Booking essential.',
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '6 months',
        80,
        TRUE
    ),
    (
        (SELECT id FROM suppliers WHERE business_name = 'Dingle Kayak Adventures'),
        'Family Kayak Adventure',
        'Bring the kids! Our family-friendly harbour tour is safe and fun for ages 8+. Book for 4 and the youngest paddles free.',
        'FREE_ITEM',
        0.00,
        120.00,
        'Minimum 2 adults required. Child must be 8+ years old. All children must be accompanied by an adult in tandem kayak.',
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '6 months',
        50,
        TRUE
    ),
    (
        (SELECT id FROM suppliers WHERE business_name = 'Dingle Kayak Adventures'),
        'Dolphin Watch Paddle',
        '€10 off our popular dolphin watching kayak tour. Paddle out to meet the famous Dingle dolphins in their natural habitat.',
        'FIXED_AMOUNT',
        10.00,
        50.00,
        'Dolphin sightings not guaranteed but highly likely! 2.5 hour tour. Wetsuits and all equipment provided.',
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '6 months',
        120,
        TRUE
    ),
    (
        (SELECT id FROM suppliers WHERE business_name = 'Dingle Kayak Adventures'),
        'Learn to Kayak - Beginner Special',
        'Never kayaked before? Book our beginner lesson and get a free return session to practice your new skills.',
        'FREE_ITEM',
        0.00,
        40.00,
        'Second session must be used within 14 days. Subject to availability. Includes all safety instruction.',
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '6 months',
        60,
        TRUE
    );

-- ============================================================================
-- Part B: Activate subscriptions for existing test accounts
-- ============================================================================

-- Activate subscription for existing owner (norevalley@myisland.com, user_id=1)
UPDATE owners
SET subscription_status = 'ACTIVE',
    stripe_customer_id = 'cus_test_owner_001',
    stripe_subscription_id = 'sub_test_owner_001',
    subscription_current_period_end = CURRENT_TIMESTAMP + INTERVAL '30 days',
    subscription_cancel_at_period_end = FALSE
WHERE user_id = 1;

-- Activate subscription for existing supplier (farmshop@greenacres.ie, user_id=15)
UPDATE suppliers
SET subscription_status = 'ACTIVE',
    stripe_customer_id = 'cus_test_supplier_001',
    stripe_subscription_id = 'sub_test_supplier_001',
    subscription_current_period_end = CURRENT_TIMESTAMP + INTERVAL '30 days',
    subscription_cancel_at_period_end = FALSE
WHERE user_id = 15;
