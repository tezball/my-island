-- V1028: Add theme park and events suppliers with offers

-- New supplier users (IDs auto-increment from 41)
INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier) VALUES
    ('info@emeraldpark.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Emerald Adventure Park', 'SUPPLIER', FALSE, TRUE),
    ('events@wildatlantic.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Wild Atlantic Festival Co', 'SUPPLIER', FALSE, TRUE);

-- New suppliers (IDs auto-increment from 22)
INSERT INTO suppliers (user_id, business_name, category, description, county, town, address, phone, website, is_verified) VALUES
    (41, 'Emerald Adventure Park', 'ACTIVITY_PROVIDER', 'Ireland''s premier family theme park and zoo. Featuring roller coasters, go-karts, zip lines, and adventure activities for all ages. Home to Europe''s largest inflatable theme park and the Cú Chulainn Coaster.', 'Meath', 'Ashbourne', 'Kilbrew, Ashbourne', '+353 1 835 1999', 'https://emeraldpark.ie', TRUE),
    (42, 'Wild Atlantic Festival Co', 'TOUR_OPERATOR', 'Curating unforgettable events along Ireland''s Wild Atlantic Way. From summer music festivals to food fairs, craft markets to cultural celebrations. Something for everyone, rain or shine!', 'Galway', 'Galway City', 'Merchants Road, Galway', '+353 91 566 777', 'https://wildatlanticfestivals.ie', TRUE);

-- Theme park offers (supplier 22 = Emerald Adventure Park)
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active) VALUES
    (22, 'Family Theme Park Day Pass - Save 15%', 'Get 15% off a family of 4 entry ticket to Emerald Adventure Park. Includes access to all rides, the zoo, and adventure playground.', 'PERCENTAGE', 15.00, 60.00, 'Valid for family of 4 (2 adults + 2 children under 14). Not valid on bank holidays.', '2025-03-01', '2027-12-31', 300, TRUE),
    (22, 'Thrill Seeker Wristband - €10 Off', 'Save €10 on our unlimited rides wristband. Access every roller coaster, go-kart track, and zip line all day long.', 'FIXED_AMOUNT', 10.00, 35.00, 'Per person. Height restrictions apply on certain rides. Valid any day.', '2025-03-01', '2027-12-31', 500, TRUE),
    (22, 'Birthday Party Package', 'Book a birthday party for 10 kids and get 2 extra places free. Includes party room, food, cake, and unlimited rides.', 'BUY_ONE_GET_ONE', 0.00, 200.00, 'Must book at least 7 days in advance. Ages 4-14. Party bags included.', '2025-01-01', '2027-12-31', 100, TRUE);

-- Events offers (supplier 23 = Wild Atlantic Festival Co)
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active) VALUES
    (23, 'Summer Festival Early Bird Pass', 'Get 20% off weekend festival passes for our Summer Sounds music festival. Three days of live music on the Wild Atlantic Way.', 'PERCENTAGE', 20.00, 80.00, 'Early bird pricing. Non-refundable. Camping included. Over 18s only.', '2025-04-01', '2025-07-31', 200, TRUE),
    (23, 'Food & Craft Fair Entry - €5 Off', 'Save €5 on entry to our monthly artisan food and craft fairs. Sample local produce, meet the makers, and take home something special.', 'FIXED_AMOUNT', 5.00, 15.00, 'Valid at any Wild Atlantic Festival Co food fair event. One per person.', '2025-01-01', '2027-12-31', 500, TRUE),
    (23, 'New Year''s Eve Gala Night - 15% Off', 'Ring in the New Year at our spectacular gala event. Live music, gourmet dinner, fireworks, and dancing until dawn.', 'PERCENTAGE', 15.00, 120.00, 'Black tie optional. Over 18s. Table of 4 minimum booking.', '2025-09-01', '2025-12-31', 100, TRUE);
