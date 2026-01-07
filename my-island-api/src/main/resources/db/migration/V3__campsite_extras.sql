-- V3__campsite_extras.sql
-- Add extras/add-ons for campsites that guests can purchase with bookings

-- ============================================
-- EXTRAS FOR EACH CAMPSITE
-- ============================================

-- Wild Atlantic Glamping (Luxury glamping)
INSERT INTO extras (id, campsite_id, name, description, price, per_night, available, created_at, updated_at) VALUES
('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Champagne Welcome Pack', 'Bottle of champagne with Irish artisan chocolates', 65.00, FALSE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Hot Tub Aromatherapy', 'Essential oils and bath salts for your private hot tub', 25.00, TRUE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'Gourmet Breakfast Hamper', 'Local produce breakfast delivered to your dome', 35.00, TRUE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'Stargazing Kit', 'Telescope and star chart rental', 20.00, FALSE, TRUE, NOW(), NOW());

-- Donegal Coastal Camp (Family camping)
INSERT INTO extras (id, campsite_id, name, description, price, per_night, available, created_at, updated_at) VALUES
('e0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000002', 'Firewood Bundle', 'Seasoned firewood for campfires', 12.00, TRUE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000002', 'Beach Equipment Hire', 'Bodyboards, buckets, and beach games', 15.00, TRUE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000002', 'Fish & Chips Voucher', 'Voucher for on-site takeaway', 25.00, FALSE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000002', 'Electric Hook-up', 'Electrical connection for your pitch', 8.00, TRUE, TRUE, NOW(), NOW());

-- Sligo Surf Camp
INSERT INTO extras (id, campsite_id, name, description, price, per_night, available, created_at, updated_at) VALUES
('e0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000003', 'Surfboard Rental', 'Quality surfboard for the day', 25.00, TRUE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000003', 'Wetsuit Rental', 'Full wetsuit in your size', 15.00, TRUE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000003', 'Surf Lesson (2hr)', 'Group surf lesson with qualified instructor', 45.00, FALSE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000003', 'Firewood Bundle', 'Seasoned firewood for communal fire pit', 10.00, TRUE, TRUE, NOW(), NOW());

-- Galway Bay Guesthouse (B&B)
INSERT INTO extras (id, campsite_id, name, description, price, per_night, available, created_at, updated_at) VALUES
('e0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000004', 'Full Irish Breakfast', 'Traditional Irish breakfast with local produce', 18.00, TRUE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000004', 'Afternoon Tea', 'Homemade scones, cakes, and tea service', 22.00, FALSE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000004', 'Airport Transfer', 'Private transfer to/from Shannon or Knock airport', 85.00, FALSE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000004', 'Packed Lunch', 'Sandwiches, fruit, and snacks for your day trip', 14.00, TRUE, TRUE, NOW(), NOW());

-- Connemara Retreat (Cottages)
INSERT INTO extras (id, campsite_id, name, description, price, per_night, available, created_at, updated_at) VALUES
('e0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000005', 'Turf Delivery', 'Bag of traditional Irish turf for the fire', 15.00, TRUE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000005', 'Welcome Grocery Pack', 'Milk, bread, butter, eggs, and essentials', 25.00, FALSE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000005', 'Fishing Rod Hire', 'Quality fishing equipment with local tips', 20.00, TRUE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000005', 'Guided Mountain Walk', 'Half-day guided walk in the Twelve Bens', 55.00, FALSE, TRUE, NOW(), NOW());

-- West Cork Eco Retreat
INSERT INTO extras (id, campsite_id, name, description, price, per_night, available, created_at, updated_at) VALUES
('e0000000-0000-0000-0000-000000000021', 'c0000000-0000-0000-0000-000000000006', 'Organic Breakfast Box', 'Farm-to-table organic breakfast', 28.00, TRUE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-000000000006', 'Yoga Session', 'Morning yoga class in the garden', 20.00, FALSE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000023', 'c0000000-0000-0000-0000-000000000006', 'E-Bike Rental', 'Electric bike for exploring the area', 35.00, TRUE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000024', 'c0000000-0000-0000-0000-000000000006', 'Garden Tour & Workshop', 'Learn about organic gardening', 25.00, FALSE, TRUE, NOW(), NOW());

-- Wicklow Woodland Camp
INSERT INTO extras (id, campsite_id, name, description, price, per_night, available, created_at, updated_at) VALUES
('e0000000-0000-0000-0000-000000000025', 'c0000000-0000-0000-0000-000000000007', 'Firewood Bundle', 'Seasoned logs for your campfire', 10.00, TRUE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000026', 'c0000000-0000-0000-0000-000000000007', 'S''mores Kit', 'Marshmallows, chocolate, and biscuits', 8.00, FALSE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000027', 'c0000000-0000-0000-0000-000000000007', 'Nature Trail Map Pack', 'Detailed maps of local walking trails', 5.00, FALSE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000028', 'c0000000-0000-0000-0000-000000000007', 'BBQ Pack', 'Charcoal, firelighters, and BBQ tools', 18.00, FALSE, TRUE, NOW(), NOW());

-- Ring of Kerry Glamping
INSERT INTO extras (id, campsite_id, name, description, price, per_night, available, created_at, updated_at) VALUES
('e0000000-0000-0000-0000-000000000029', 'c0000000-0000-0000-0000-000000000008', 'Luxury Breakfast Basket', 'Gourmet breakfast delivered to your tent', 32.00, TRUE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000030', 'c0000000-0000-0000-0000-000000000008', 'BBQ Meat Pack', 'Premium Irish meats for your private BBQ', 45.00, FALSE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000031', 'c0000000-0000-0000-0000-000000000008', 'Kayak Experience', '2-hour guided kayak on the lakes', 50.00, FALSE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000032', 'c0000000-0000-0000-0000-000000000008', 'Bike Hire', 'Quality mountain bike for Ring of Kerry', 30.00, TRUE, TRUE, NOW(), NOW());

-- Clifden Eco Camp
INSERT INTO extras (id, campsite_id, name, description, price, per_night, available, created_at, updated_at) VALUES
('e0000000-0000-0000-0000-000000000033', 'c0000000-0000-0000-0000-000000000009', 'Breakfast Pack', 'Continental breakfast for your eco-pod', 16.00, TRUE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000034', 'c0000000-0000-0000-0000-000000000009', 'Bike Rental', 'Bike for exploring the Sky Road', 22.00, TRUE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000035', 'c0000000-0000-0000-0000-000000000009', 'Hot Water Bottle', 'Cozy hot water bottle for cool nights', 5.00, TRUE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000036', 'c0000000-0000-0000-0000-000000000009', 'Walking Poles', 'Hiking poles for mountain walks', 8.00, TRUE, TRUE, NOW(), NOW());

-- Roundstone Harbour View
INSERT INTO extras (id, campsite_id, name, description, price, per_night, available, created_at, updated_at) VALUES
('e0000000-0000-0000-0000-000000000037', 'c0000000-0000-0000-0000-000000000010', 'Seafood Dinner', 'Fresh catch of the day at our restaurant', 42.00, FALSE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000038', 'c0000000-0000-0000-0000-000000000010', 'Lobster Experience', 'Visit the lobster pots with local fisherman', 65.00, FALSE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000039', 'c0000000-0000-0000-0000-000000000010', 'Photography Tour', 'Sunrise/sunset photography locations tour', 40.00, FALSE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000040', 'c0000000-0000-0000-0000-000000000010', 'Wine & Cheese Evening', 'Selection of Irish cheeses with wine', 38.00, FALSE, TRUE, NOW(), NOW());

-- Burren Camping
INSERT INTO extras (id, campsite_id, name, description, price, per_night, available, created_at, updated_at) VALUES
('e0000000-0000-0000-0000-000000000041', 'c0000000-0000-0000-0000-000000000011', 'Farm Fresh Eggs', 'Half dozen eggs from our hens', 4.00, TRUE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000042', 'c0000000-0000-0000-0000-000000000011', 'Fresh Milk', 'Litre of fresh farm milk', 3.00, TRUE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000043', 'c0000000-0000-0000-0000-000000000011', 'Cliffs of Moher Shuttle', 'Return transport to Cliffs of Moher', 25.00, FALSE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000044', 'c0000000-0000-0000-0000-000000000011', 'Burren Walk Guide', 'Guided walk through unique Burren landscape', 30.00, FALSE, TRUE, NOW(), NOW());

-- Dingle Peninsula B&B
INSERT INTO extras (id, campsite_id, name, description, price, per_night, available, created_at, updated_at) VALUES
('e0000000-0000-0000-0000-000000000045', 'c0000000-0000-0000-0000-000000000012', 'Full Irish Breakfast', 'Hearty traditional breakfast', 16.00, TRUE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000046', 'c0000000-0000-0000-0000-000000000012', 'Packed Lunch', 'Sandwiches and snacks for Slea Head Drive', 12.00, TRUE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000047', 'c0000000-0000-0000-0000-000000000012', 'Evening Meal', 'Home-cooked dinner with local ingredients', 28.00, FALSE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000048', 'c0000000-0000-0000-0000-000000000012', 'Dolphin Watching Trip', 'Boat trip to see Fungie''s friends', 35.00, FALSE, TRUE, NOW(), NOW());

-- Giant's Causeway Camp
INSERT INTO extras (id, campsite_id, name, description, price, per_night, available, created_at, updated_at) VALUES
('e0000000-0000-0000-0000-000000000049', 'c0000000-0000-0000-0000-000000000013', 'Firewood Bundle', 'Quality firewood for evening campfires', 10.00, TRUE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000050', 'c0000000-0000-0000-0000-000000000013', 'Causeway Visitor Centre Tickets', 'Entry tickets to Giant''s Causeway', 14.50, FALSE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000051', 'c0000000-0000-0000-0000-000000000013', 'Bushmills Distillery Tour', 'Guided tour and tasting at the distillery', 25.00, FALSE, TRUE, NOW(), NOW()),
('e0000000-0000-0000-0000-000000000052', 'c0000000-0000-0000-0000-000000000013', 'Coastal Walk Guide', 'Guided walk along Causeway Coast Path', 35.00, FALSE, TRUE, NOW(), NOW());
