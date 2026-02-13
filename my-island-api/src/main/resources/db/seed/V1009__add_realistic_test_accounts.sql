-- V1009: Add realistic test accounts - Burren area campsite and local farm shop

-- ============================================================================
-- Burren Glamping - A realistic glamping site in the Burren, County Clare
-- ============================================================================

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier)
VALUES ('hello@burrenglampingvillage.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Siobhán O''Connor', 'OWNER', TRUE, FALSE);

INSERT INTO owners (
    user_id, property_name, county, town, property_type, description,
    latitude, longitude, phone, website,
    subscription_status, stripe_customer_id, stripe_subscription_id,
    subscription_current_period_end, subscription_cancel_at_period_end
)
VALUES (
    (SELECT id FROM users WHERE email = 'hello@burrenglampingvillage.ie'),
    'Burren Glamping Village',
    'Clare',
    'Ballyvaughan',
    'GLAMPING',
    'Nestled at the edge of the Burren National Park, our family-run glamping village offers luxury bell tents and shepherd huts with stunning views of Galway Bay. Wake up to the sound of birdsong, explore ancient dolmens, and enjoy the famous Burren wildflowers right on your doorstep. Each tent features a wood-burning stove, proper beds, and a private firepit area.',
    53.1142,
    -9.1467,
    '+353 65 707 8234',
    'https://burrenglampingvillage.ie',
    'ACTIVE',
    'cus_burren_glamping_001',
    'sub_burren_glamping_001',
    CURRENT_TIMESTAMP + INTERVAL '30 days',
    FALSE
);

-- Add lots for Burren Glamping Village
INSERT INTO lots (owner_id, name, description, max_guests, price_per_night, lot_type, is_active)
VALUES
    ((SELECT id FROM owners WHERE property_name = 'Burren Glamping Village'), 'Hazel Bell Tent', 'Spacious 5m bell tent with king bed, wood burner, and private firepit. Views towards the Burren hills.', 2, 120.00, 'GLAMPING', TRUE),
    ((SELECT id FROM owners WHERE property_name = 'Burren Glamping Village'), 'Willow Bell Tent', 'Family-friendly 6m bell tent with king bed plus bunk beds. Perfect for families with children.', 4, 150.00, 'GLAMPING', TRUE),
    ((SELECT id FROM owners WHERE property_name = 'Burren Glamping Village'), 'Shepherd''s Rest', 'Cosy shepherd hut with double bed, ensuite bathroom, and small kitchenette. Our most luxurious option.', 2, 175.00, 'POD', TRUE),
    ((SELECT id FROM owners WHERE property_name = 'Burren Glamping Village'), 'Oak Bell Tent', 'Premium 5m bell tent positioned for sunrise views over Galway Bay. Includes breakfast hamper.', 2, 140.00, 'GLAMPING', TRUE),
    ((SELECT id FROM owners WHERE property_name = 'Burren Glamping Village'), 'Meadow Pitch', 'Spacious grass pitch for campervans or caravans with electric hookup. Access to shared facilities.', 4, 35.00, 'CAMPERVAN', TRUE);

-- ============================================================================
-- Aillwee Farm Shop - A realistic farm shop near the Burren
-- ============================================================================

INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier)
VALUES ('info@aillweefarmshop.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Pádraig Moloney', 'SUPPLIER', FALSE, TRUE);

INSERT INTO suppliers (
    user_id, business_name, category, description,
    county, town, address, phone, website, is_verified,
    subscription_status, stripe_customer_id, stripe_subscription_id,
    subscription_current_period_end, subscription_cancel_at_period_end
)
VALUES (
    (SELECT id FROM users WHERE email = 'info@aillweefarmshop.ie'),
    'Aillwee Farm Shop & Cheese',
    'FARM_SHOP',
    'Award-winning artisan cheese makers and farm shop located at Aillwee Cave. Our Burren Gold cheese is made on-site using milk from our own herd of goats grazing on the unique Burren limestone pastures. We also stock local honey, preserves, baked goods, and crafts from Clare producers. Campers receive 10% off all cheese purchases!',
    'Clare',
    'Ballyvaughan',
    'Aillwee Cave, Ballyvaughan, Co. Clare, H91 R2K3',
    '+353 65 707 7036',
    'https://aillweefarmshop.ie',
    TRUE,
    'ACTIVE',
    'cus_aillwee_farm_001',
    'sub_aillwee_farm_001',
    CURRENT_TIMESTAMP + INTERVAL '30 days',
    FALSE
);

-- Add offers for Aillwee Farm Shop
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, valid_from, valid_until, max_claims, is_active)
VALUES
    (
        (SELECT id FROM suppliers WHERE business_name = 'Aillwee Farm Shop & Cheese'),
        '10% Off Artisan Cheese Selection',
        'Show your My Island booking confirmation to receive 10% off our award-winning Burren Gold goat cheese and any other cheeses in store. Perfect for your campfire cheese board!',
        'PERCENTAGE',
        10.00,
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '6 months',
        100,
        TRUE
    ),
    (
        (SELECT id FROM suppliers WHERE business_name = 'Aillwee Farm Shop & Cheese'),
        'Free Cheese Tasting Experience',
        'Complimentary guided cheese tasting for My Island guests. Learn about traditional cheese-making and sample our range of aged and fresh goat cheeses. Bookings required.',
        'FREE_ITEM',
        0.00,
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '6 months',
        50,
        TRUE
    ),
    (
        (SELECT id FROM suppliers WHERE business_name = 'Aillwee Farm Shop & Cheese'),
        '15% Off Hamper Bundle',
        'Get 15% off when you purchase a Burren Picnic Hamper - includes cheese, crackers, local honey, and preserves. Perfect for a day exploring the Burren!',
        'PERCENTAGE',
        15.00,
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '3 months',
        30,
        TRUE
    );
