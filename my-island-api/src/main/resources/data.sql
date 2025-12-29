-- Seed data for My Island API
-- Password: 'password' (BCrypt hash)

-- Users
INSERT INTO users (id, email, password_hash, name, avatar_url, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'demo@my-island.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqVk9Xst2vPBnRvqx1vHq8Y8JQ2aG', 'Alex Murphy', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', NOW());

-- Facilities
INSERT INTO facilities (id, name, icon) VALUES
('wifi', 'Free WiFi', 'wifi'),
('shower', 'Hot Showers', 'shower'),
('pets', 'Pet Friendly', 'pets'),
('power', 'Electric Hookup', 'bolt'),
('fire', 'Fire Pits', 'local_fire_department'),
('parking', 'Free Parking', 'local_parking'),
('shop', 'Camp Shop', 'store'),
('laundry', 'Laundry', 'local_laundry_service'),
('eco', 'Eco Certified', 'eco'),
('swim', 'Wild Swimming', 'pool'),
('dump', 'Dump Station', 'delete'),
('tv', 'TV Lounge', 'tv'),
('kitchen', 'Camp Kitchen', 'kitchen'),
('bbq', 'BBQ Area', 'outdoor_grill'),
('restaurant', 'Restaurant', 'restaurant'),
('spa', 'Wellness Spa', 'spa'),
('heating', 'Wood Stove', 'fireplace'),
('bikes', 'Bike Rental', 'directions_bike'),
('kayak', 'Kayak Hire', 'kayaking'),
('dark', 'Dark Sky Site', 'nights_stay'),
('yoga', 'Yoga Deck', 'self_improvement'),
('cafe', 'On-site Café', 'local_cafe'),
('surf', 'Surf Lessons', 'surfing'),
('boards', 'Board Rental', 'surfing'),
('bar', 'Beach Bar', 'local_bar');

-- Extras
INSERT INTO extras (id, name, description, price, icon) VALUES
('kayak', 'Kayak Rental', 'Single kayak for the day', 25.00, 'kayaking'),
('bbq', 'BBQ Kit', 'Charcoal, tools, and cleaning supplies', 15.00, 'outdoor_grill'),
('firewood', 'Firewood Bundle', 'Seasoned hardwood for campfire', 12.00, 'local_fire_department'),
('breakfast', 'Breakfast Basket', 'Local eggs, bread, butter, jam, coffee', 22.00, 'egg_alt'),
('bike', 'Bike Rental', 'Mountain bike for the day', 20.00, 'directions_bike'),
('surfboard', 'Surfboard Hire', 'Foam or fibreglass board', 30.00, 'surfing'),
('wetsuit', 'Wetsuit Hire', '4/3mm full wetsuit', 15.00, 'scuba_diving'),
('fishing', 'Fishing Rod Set', 'Rod, reel, tackle, and bait', 18.00, 'phishing'),
('stargazing', 'Stargazing Kit', 'Telescope, star map, and hot chocolate', 35.00, 'nights_stay'),
('picnic', 'Gourmet Picnic', 'Local cheeses, meats, bread, and wine', 45.00, 'lunch_dining'),
('marshmallow', 'S''mores Pack', 'Marshmallows, chocolate, and biscuits', 8.00, 'cookie'),
('games', 'Games Bundle', 'Frisbee, football, and card games', 10.00, 'sports_soccer');

-- Campsites (first 5 for brevity - full dataset would have all 20)
INSERT INTO campsites (id, name, location, latitude, longitude, price_per_night, rating, review_count, description, image_url, is_superhost, type) VALUES
('00000001-0001-0001-0001-000000000001', 'Eagle Point Camping', 'Ballyconneely, Co. Galway', 53.4556, -9.8986, 28.00, 4.9, 347, 'Award-winning campsite on the shores of Mannin Bay with panoramic views of the Twelve Bens.', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800', true, 'TENT'),
('00000001-0001-0001-0001-000000000002', 'Clifden Eco Beach Camping', 'Clifden, Co. Galway', 53.4879, -10.0200, 32.00, 4.8, 218, 'Sustainable camping at its finest. Solar-powered facilities and wild swimming.', 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800', true, 'GLAMPING'),
('00000001-0001-0001-0001-000000000003', 'Paddy''s Point RV Park', 'Roundstone, Co. Galway', 53.3942, -9.9208, 38.00, 4.7, 156, 'Purpose-built RV park with full hookups and stunning views of Roundstone Harbour.', 'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=800', false, 'RV'),
('00000001-0001-0001-0001-000000000004', 'Dingle Bay Hideaway', 'Dingle, Co. Kerry', 52.1409, -10.2671, 35.00, 4.9, 412, 'Intimate family-run campsite on the world-famous Dingle Peninsula.', 'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800', true, 'TENT'),
('00000001-0001-0001-0001-000000000005', 'Ring of Kerry Glamping', 'Kenmare, Co. Kerry', 51.8806, -9.5833, 89.00, 4.9, 287, 'Luxury safari tents with wood-burning stoves and private decks.', 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800', true, 'GLAMPING'),
('00000001-0001-0001-0001-000000000006', 'Killarney Lakeside Camp', 'Killarney, Co. Kerry', 52.0598, -9.5044, 30.00, 4.8, 523, 'Gateway to Killarney National Park.', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', true, 'TENT'),
('00000001-0001-0001-0001-000000000007', 'Cliffs of Moher Camping', 'Doolin, Co. Clare', 52.9719, -9.4265, 32.00, 4.7, 389, 'Camp within walking distance of Ireland''s most iconic cliffs.', 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800', false, 'TENT'),
('00000001-0001-0001-0001-000000000008', 'Burren Basecamp', 'Ballyvaughan, Co. Clare', 53.1167, -9.1500, 28.00, 4.8, 198, 'Explore the lunar landscape of the Burren from this peaceful retreat.', 'https://images.unsplash.com/photo-1487730116445-500c8a39a746?w=800', true, 'TENT'),
('00000001-0001-0001-0001-000000000009', 'Glendalough Forest Retreat', 'Glendalough, Co. Wicklow', 53.0094, -6.3277, 45.00, 4.9, 567, 'Ancient monastic site meets modern glamping.', 'https://images.unsplash.com/photo-1532339142463-fd0a8979791a?w=800', true, 'GLAMPING'),
('00000001-0001-0001-0001-000000000010', 'Powerscourt Wild Camp', 'Enniskerry, Co. Wicklow', 53.1847, -6.1872, 38.00, 4.6, 234, 'Hidden gem near Powerscourt Waterfall.', 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800', false, 'TENT');

-- Campsite Images
INSERT INTO campsite_images (campsite_id, image_url) VALUES
('00000001-0001-0001-0001-000000000001', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'),
('00000001-0001-0001-0001-000000000001', 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800'),
('00000001-0001-0001-0001-000000000002', 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800'),
('00000001-0001-0001-0001-000000000003', 'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=800'),
('00000001-0001-0001-0001-000000000004', 'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800');

-- Campsite Lots
INSERT INTO campsite_lots (id, campsite_id, name, type, max_guests, size, price_per_night) VALUES
-- Eagle Point
('00000002-0001-0001-0001-000000000001', '00000001-0001-0001-0001-000000000001', 'Oceanfront Premium', 'TENT', 4, '8m x 8m', 38.00),
('00000002-0001-0001-0001-000000000002', '00000001-0001-0001-0001-000000000001', 'Bay View Standard', 'TENT', 4, '6m x 6m', 28.00),
('00000002-0001-0001-0001-000000000003', '00000001-0001-0001-0001-000000000001', 'Family Pitch XL', 'TENT', 8, '10m x 10m', 45.00),
('00000002-0001-0001-0001-000000000004', '00000001-0001-0001-0001-000000000001', 'Campervan Bay', 'RV', 4, '10m x 4m', 35.00),
-- Clifden Eco
('00000002-0001-0001-0001-000000000005', '00000001-0001-0001-0001-000000000002', 'Eco Pod', 'GLAMPING', 2, '4m diameter', 65.00),
('00000002-0001-0001-0001-000000000006', '00000001-0001-0001-0001-000000000002', 'Wild Pitch', 'TENT', 4, '6m x 6m', 32.00),
-- Paddy's Point
('00000002-0001-0001-0001-000000000007', '00000001-0001-0001-0001-000000000003', 'Harbour View Premium', 'RV', 6, '12m x 5m', 48.00),
('00000002-0001-0001-0001-000000000008', '00000001-0001-0001-0001-000000000003', 'Standard RV Bay', 'RV', 4, '10m x 4m', 38.00),
-- Dingle Bay
('00000002-0001-0001-0001-000000000009', '00000001-0001-0001-0001-000000000004', 'Fungie View', 'TENT', 4, '7m x 7m', 42.00),
('00000002-0001-0001-0001-000000000010', '00000001-0001-0001-0001-000000000004', 'Peninsula Pitch', 'TENT', 4, '6m x 6m', 35.00),
-- Ring of Kerry
('00000002-0001-0001-0001-000000000011', '00000001-0001-0001-0001-000000000005', 'Safari Suite', 'GLAMPING', 2, '35sqm', 145.00),
('00000002-0001-0001-0001-000000000012', '00000001-0001-0001-0001-000000000005', 'Forest Lodge', 'GLAMPING', 4, '45sqm', 175.00),
-- Killarney
('00000002-0001-0001-0001-000000000013', '00000001-0001-0001-0001-000000000006', 'Lakefront Deluxe', 'TENT', 4, '8m x 8m', 45.00),
('00000002-0001-0001-0001-000000000014', '00000001-0001-0001-0001-000000000006', 'Woodland Pitch', 'TENT', 4, '6m x 6m', 30.00),
-- Cliffs of Moher
('00000002-0001-0001-0001-000000000015', '00000001-0001-0001-0001-000000000007', 'Cliff View Premium', 'TENT', 4, '7m x 7m', 42.00),
('00000002-0001-0001-0001-000000000016', '00000001-0001-0001-0001-000000000007', 'Village Side', 'TENT', 4, '6m x 6m', 32.00),
-- Burren
('00000002-0001-0001-0001-000000000017', '00000001-0001-0001-0001-000000000008', 'Stargazer Pitch', 'TENT', 4, '6m x 6m', 32.00),
-- Glendalough
('00000002-0001-0001-0001-000000000018', '00000001-0001-0001-0001-000000000009', 'Treehouse Suite', 'CABIN', 2, '20sqm', 125.00),
('00000002-0001-0001-0001-000000000019', '00000001-0001-0001-0001-000000000009', 'Bell Tent Deluxe', 'GLAMPING', 4, '5m diameter', 85.00),
-- Powerscourt
('00000002-0001-0001-0001-000000000020', '00000001-0001-0001-0001-000000000010', 'Waterfall View', 'TENT', 4, '6m x 6m', 45.00);

-- Campsite Facilities (link campsites to facilities)
INSERT INTO campsite_facilities (campsite_id, facility_id) VALUES
('00000001-0001-0001-0001-000000000001', 'wifi'),
('00000001-0001-0001-0001-000000000001', 'shower'),
('00000001-0001-0001-0001-000000000001', 'pets'),
('00000001-0001-0001-0001-000000000001', 'power'),
('00000001-0001-0001-0001-000000000001', 'fire'),
('00000001-0001-0001-0001-000000000002', 'wifi'),
('00000001-0001-0001-0001-000000000002', 'shower'),
('00000001-0001-0001-0001-000000000002', 'eco'),
('00000001-0001-0001-0001-000000000002', 'fire'),
('00000001-0001-0001-0001-000000000003', 'wifi'),
('00000001-0001-0001-0001-000000000003', 'power'),
('00000001-0001-0001-0001-000000000003', 'dump'),
('00000001-0001-0001-0001-000000000003', 'laundry'),
('00000001-0001-0001-0001-000000000004', 'wifi'),
('00000001-0001-0001-0001-000000000004', 'shower'),
('00000001-0001-0001-0001-000000000004', 'pets'),
('00000001-0001-0001-0001-000000000004', 'kitchen'),
('00000001-0001-0001-0001-000000000005', 'wifi'),
('00000001-0001-0001-0001-000000000005', 'shower'),
('00000001-0001-0001-0001-000000000005', 'restaurant'),
('00000001-0001-0001-0001-000000000005', 'spa');

-- Local Suppliers
INSERT INTO local_suppliers (id, campsite_id, name, category, distance, alerts_enabled) VALUES
('00000003-0001-0001-0001-000000000001', '00000001-0001-0001-0001-000000000001', 'O''Malley''s Farm Shop', 'FOOD', '1.2 km', true),
('00000003-0001-0001-0001-000000000002', '00000001-0001-0001-0001-000000000001', 'Connemara Wild Escapes', 'ACTIVITY', '0.3 km', true),
('00000003-0001-0001-0001-000000000003', '00000001-0001-0001-0001-000000000002', 'Clifden Farmers Market', 'FOOD', '2.1 km', false),
('00000003-0001-0001-0001-000000000004', '00000001-0001-0001-0001-000000000004', 'Dingle Seafood Company', 'FOOD', '1.5 km', true);

-- Supplier Offers
INSERT INTO supplier_offers (id, supplier_id, supplier_name, supplier_logo, category, title, description, image_url, discount, location, distance) VALUES
('00000004-0001-0001-0001-000000000001', '00000003-0001-0001-0001-000000000001', 'Joe''s Organic Butcher', 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=100', 'FOOD', 'Campfire BBQ Pack', 'Premium Irish beef burgers, sausages, and marinated chicken.', 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800', '15% OFF', 'Clifden, Co. Galway', '2.3 km'),
('00000004-0001-0001-0001-000000000002', '00000003-0001-0001-0001-000000000002', 'Dingle Seafood', 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=100', 'FOOD', 'Fresh Catch Box', 'Daily fresh catch from Dingle Bay including mussels and crab.', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', '20% OFF', 'Dingle, Co. Kerry', '1.5 km'),
('00000004-0001-0001-0001-000000000003', NULL, 'Bay Kayaks', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100', 'ACTIVITY', 'Sunset Paddle Tour', 'Guided kayak tour around the bay with stunning sunset views.', 'https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=800', '2-FOR-1', 'Connemara, Co. Galway', '0.5 km'),
('00000004-0001-0001-0001-000000000004', NULL, 'Atlantic Surf School', 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=100', 'ACTIVITY', 'Beginner Surf Lesson', '2-hour group lesson with all equipment provided.', 'https://images.unsplash.com/photo-1455264745730-cb3b76250ae8?w=800', '25% OFF', 'Inch Beach, Co. Kerry', '0.2 km'),
('00000004-0001-0001-0001-000000000005', NULL, 'Camp Supplies Co.', 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=100', 'GEAR', 'Weekend Camping Kit', 'Everything you forgot to pack: torches, batteries, first aid.', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800', '10% OFF', 'Clifden, Co. Galway', '3.1 km'),
('00000004-0001-0001-0001-000000000006', NULL, 'Dawn Yoga Retreats', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=100', 'WELLNESS', 'Sunrise Beach Yoga', 'Start your day with oceanside yoga. All levels welcome.', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800', '2-FOR-1', 'Inch Beach, Co. Kerry', '0.4 km'),
('00000004-0001-0001-0001-000000000007', NULL, 'O''Connor''s Pub', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=100', 'EXPERIENCE', 'Traditional Music Night', 'Authentic Irish trad session with local musicians.', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800', '€10 OFF', 'Doolin, Co. Clare', '1.3 km');

-- Offer Tags
INSERT INTO offer_tags (offer_id, tag) VALUES
('00000004-0001-0001-0001-000000000001', '#Food'),
('00000004-0001-0001-0001-000000000001', '#BBQ'),
('00000004-0001-0001-0001-000000000001', '#LocalProduce'),
('00000004-0001-0001-0001-000000000002', '#Seafood'),
('00000004-0001-0001-0001-000000000002', '#Fresh'),
('00000004-0001-0001-0001-000000000003', '#Activity'),
('00000004-0001-0001-0001-000000000003', '#Kayaking'),
('00000004-0001-0001-0001-000000000004', '#Surfing'),
('00000004-0001-0001-0001-000000000004', '#Lessons');

-- User Favorites
INSERT INTO user_favorites (user_id, campsite_id) VALUES
('11111111-1111-1111-1111-111111111111', '00000001-0001-0001-0001-000000000001'),
('11111111-1111-1111-1111-111111111111', '00000001-0001-0001-0001-000000000003'),
('11111111-1111-1111-1111-111111111111', '00000001-0001-0001-0001-000000000005'),
('11111111-1111-1111-1111-111111111111', '00000001-0001-0001-0001-000000000007'),
('11111111-1111-1111-1111-111111111111', '00000001-0001-0001-0001-000000000009');

-- Sample Bookings
INSERT INTO bookings (id, reference, user_id, campsite_id, lot_id, check_in, check_out, adults, children, status, total_price, created_at) VALUES
('00000005-0001-0001-0001-000000000001', 'ISL-2025-0001', '11111111-1111-1111-1111-111111111111', '00000001-0001-0001-0001-000000000001', '00000002-0001-0001-0001-000000000001', '2025-02-15', '2025-02-18', 2, 0, 'CONFIRMED', 114.00, NOW()),
('00000005-0001-0001-0001-000000000002', 'ISL-2025-0002', '11111111-1111-1111-1111-111111111111', '00000001-0001-0001-0001-000000000005', '00000002-0001-0001-0001-000000000011', '2025-03-10', '2025-03-14', 2, 0, 'CONFIRMED', 580.00, NOW()),
('00000005-0001-0001-0001-000000000003', 'ISL-2024-0001', '11111111-1111-1111-1111-111111111111', '00000001-0001-0001-0001-000000000004', '00000002-0001-0001-0001-000000000009', '2024-08-10', '2024-08-15', 2, 2, 'COMPLETED', 210.00, '2024-07-01 10:00:00'),
('00000005-0001-0001-0001-000000000004', 'ISL-2024-0002', '11111111-1111-1111-1111-111111111111', '00000001-0001-0001-0001-000000000009', '00000002-0001-0001-0001-000000000019', '2024-09-20', '2024-09-22', 4, 0, 'COMPLETED', 170.00, '2024-08-15 14:30:00');

-- Booking Extras
INSERT INTO booking_extras (booking_id, extra_id) VALUES
('00000005-0001-0001-0001-000000000001', 'breakfast'),
('00000005-0001-0001-0001-000000000002', 'picnic'),
('00000005-0001-0001-0001-000000000003', 'kayak'),
('00000005-0001-0001-0001-000000000003', 'bbq');
