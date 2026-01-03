-- Seed local businesses data for Ireland

-- RESTAURANTS
INSERT INTO local_businesses (id, name, category, description, address, county, latitude, longitude, phone, website, weekday_hours, weekend_hours, rating, review_count, featured) VALUES
('11111111-0001-0001-0001-000000000001', 'O''Grady''s Seafood Restaurant', 'RESTAURANT', 'Fresh Atlantic seafood with stunning harbour views. Local catch daily.', 'Clifden Harbour', 'Galway', 53.4891, -10.0198, '+353 95 21450', 'https://ogradysseafood.ie', '12:00 - 21:00', '12:00 - 22:00', 4.70, 234, true),
('11111111-0001-0001-0001-000000000002', 'The Burren Kitchen', 'RESTAURANT', 'Farm-to-table dining featuring local Burren produce and wild ingredients.', 'Main Street, Ballyvaughan', 'Clare', 53.1158, -9.1467, '+353 65 7077800', NULL, '10:00 - 20:00', '09:00 - 21:00', 4.80, 189, false),
('11111111-0001-0001-0001-000000000003', 'Wild Atlantic Bistro', 'RESTAURANT', 'Contemporary Irish cuisine overlooking the Wild Atlantic Way.', 'Westport Quay', 'Mayo', 53.8008, -9.5200, '+353 98 26261', NULL, '17:00 - 22:00', '12:00 - 22:00', 4.50, 156, false);

-- PUBS
INSERT INTO local_businesses (id, name, category, description, address, county, latitude, longitude, phone, weekday_hours, weekend_hours, rating, review_count, featured) VALUES
('11111111-0002-0002-0002-000000000001', 'Lowry''s Bar', 'PUB', 'Traditional Irish pub with live music sessions every weekend.', 'Main Street, Clifden', 'Galway', 53.4875, -10.0172, '+353 95 21347', '16:00 - 23:30', '14:00 - 00:30', 4.60, 312, true),
('11111111-0002-0002-0002-000000000002', 'Paddy Coyne''s Pub', 'PUB', 'Cozy harbourside pub famous for chowder and Guinness.', 'Tully Cross', 'Galway', 53.5448, -9.9612, '+353 95 43499', '12:00 - 23:00', '12:00 - 00:30', 4.80, 287, false),
('11111111-0002-0002-0002-000000000003', 'The Sailors'' Rest', 'PUB', 'Historic waterfront pub with craft beers and hearty food.', 'Killybegs Harbour', 'Donegal', 54.6339, -8.4378, '+353 74 9731000', '11:00 - 23:00', '11:00 - 00:30', 4.40, 198, false);

-- FARM SHOPS
INSERT INTO local_businesses (id, name, category, description, address, county, latitude, longitude, phone, email, weekday_hours, weekend_hours, rating, review_count, featured) VALUES
('11111111-0003-0003-0003-000000000001', 'Connemara Organics Farm Shop', 'FARM_SHOP', 'Organic vegetables, free-range eggs, and artisan cheeses from local farms.', 'Letterfrack', 'Galway', 53.5514, -9.9456, '+353 95 41058', 'shop@connemaraorganics.ie', '09:00 - 18:00', '10:00 - 17:00', 4.90, 145, true),
('11111111-0003-0003-0003-000000000002', 'Burren Smokehouse', 'FARM_SHOP', 'Award-winning smoked salmon and local artisan products.', 'Kincora Road, Lisdoonvarna', 'Clare', 53.0286, -9.2906, '+353 65 7074432', NULL, '09:00 - 17:00', '10:00 - 16:00', 4.70, 267, false),
('11111111-0003-0003-0003-000000000003', 'Dingle Farmhouse', 'FARM_SHOP', 'Kerry dairy products, local honey, and homemade preserves.', 'Green Street, Dingle', 'Kerry', 52.1409, -10.2671, '+353 66 9152000', NULL, '08:00 - 19:00', '09:00 - 18:00', 4.60, 198, false);

-- GROCERY STORES
INSERT INTO local_businesses (id, name, category, description, address, county, latitude, longitude, phone, weekday_hours, weekend_hours, rating, review_count, featured) VALUES
('11111111-0004-0004-0004-000000000001', 'SuperValu Clifden', 'GROCERY', 'Full-service supermarket with camping supplies and local produce.', 'Market Street, Clifden', 'Galway', 53.4867, -10.0189, '+353 95 21182', '08:00 - 21:00', '08:00 - 20:00', 4.20, 89, false),
('11111111-0004-0004-0004-000000000002', 'Dunnes Stores Westport', 'GROCERY', 'Large supermarket with fresh bakery and deli counter.', 'Shop Street, Westport', 'Mayo', 53.8000, -9.5178, '+353 98 25544', '08:30 - 21:00', '09:00 - 19:00', 4.10, 76, false);

-- OUTDOOR GEAR
INSERT INTO local_businesses (id, name, category, description, address, county, latitude, longitude, phone, website, weekday_hours, weekend_hours, rating, review_count, featured) VALUES
('11111111-0005-0005-0005-000000000001', 'Wild Atlantic Outfitters', 'OUTDOOR_GEAR', 'Camping equipment, hiking gear, and outdoor clothing.', 'Main Street, Clifden', 'Galway', 53.4880, -10.0165, '+353 95 21999', 'https://wildatlanticoutfitters.ie', '09:30 - 18:00', '10:00 - 17:00', 4.50, 134, true),
('11111111-0005-0005-0005-000000000002', 'The Great Outdoors Killarney', 'OUTDOOR_GEAR', 'Premium hiking boots, waterproofs, and camping essentials.', 'New Street, Killarney', 'Kerry', 52.0599, -9.5044, '+353 64 6632888', NULL, '09:00 - 18:00', '09:30 - 17:30', 4.70, 256, false);

-- KAYAK RENTALS
INSERT INTO local_businesses (id, name, category, description, address, county, latitude, longitude, phone, website, weekday_hours, weekend_hours, rating, review_count, featured) VALUES
('11111111-0006-0006-0006-000000000001', 'Killary Fjord Kayaks', 'KAYAK_RENTAL', 'Guided kayak tours and rentals on Irelands only fjord.', 'Leenane', 'Galway', 53.5986, -9.7208, '+353 95 42276', 'https://killarykayaks.ie', '09:00 - 17:00', '08:00 - 18:00', 4.90, 312, true),
('11111111-0006-0006-0006-000000000002', 'Dingle Sea Safari', 'KAYAK_RENTAL', 'Sea kayaking, SUP boards, and dolphin watching experiences.', 'The Marina, Dingle', 'Kerry', 52.1395, -10.2645, '+353 87 2856789', NULL, '08:00 - 18:00', '07:00 - 19:00', 4.80, 189, false),
('11111111-0006-0006-0006-000000000003', 'Achill Island Adventures', 'KAYAK_RENTAL', 'Kayaks, surfboards, and coasteering equipment rental.', 'Keel Beach, Achill Island', 'Mayo', 53.9667, -10.0833, '+353 98 43220', NULL, '09:00 - 17:00', '08:00 - 18:00', 4.60, 145, false);

-- BIKE RENTALS
INSERT INTO local_businesses (id, name, category, description, address, county, latitude, longitude, phone, website, weekday_hours, weekend_hours, rating, review_count, featured) VALUES
('11111111-0007-0007-0007-000000000001', 'Connemara Cycle Tours', 'BIKE_RENTAL', 'Quality bikes, e-bikes, and guided cycling tours of Connemara.', 'The Square, Clifden', 'Galway', 53.4872, -10.0182, '+353 95 21160', 'https://connemaracycletours.com', '09:00 - 18:00', '09:00 - 17:00', 4.70, 223, true),
('11111111-0007-0007-0007-000000000002', 'Kerry Cycle Hire', 'BIKE_RENTAL', 'Mountain bikes, road bikes, and family cycles for Ring of Kerry.', 'Plunkett Street, Killarney', 'Kerry', 52.0588, -9.5067, '+353 64 6631282', NULL, '08:30 - 18:30', '09:00 - 18:00', 4.50, 178, false);

-- FISHING SUPPLIES
INSERT INTO local_businesses (id, name, category, description, address, county, latitude, longitude, phone, website, weekday_hours, weekend_hours, rating, review_count, featured) VALUES
('11111111-0008-0008-0008-000000000001', 'Angler''s Rest Tackle Shop', 'FISHING', 'Fresh bait, fishing tackle, and local fishing permits.', 'Oughterard', 'Galway', 53.4306, -9.3167, '+353 91 552688', NULL, '07:00 - 18:00', '06:00 - 18:00', 4.40, 98, false),
('11111111-0008-0008-0008-000000000002', 'Delphi Fishing Centre', 'FISHING', 'Salmon and trout fishing equipment, guides, and permits.', 'Delphi Valley', 'Galway', 53.6142, -9.7889, '+353 95 42222', 'https://delphifishing.ie', '08:00 - 17:00', '07:00 - 18:00', 4.80, 134, false),
('11111111-0008-0008-0008-000000000003', 'West Cork Angling', 'FISHING', 'Sea fishing gear, boat trips, and tackle rental.', 'Baltimore Harbour', 'Cork', 51.4828, -9.3711, '+353 28 20197', NULL, '08:00 - 17:00', '07:00 - 18:00', 4.50, 87, false);

-- CONVENIENCE STORES
INSERT INTO local_businesses (id, name, category, description, address, county, latitude, longitude, phone, weekday_hours, weekend_hours, rating, review_count, featured) VALUES
('11111111-0009-0009-0009-000000000001', 'Centra Roundstone', 'CONVENIENCE', 'Essentials, snacks, ice, firewood, and camping basics.', 'Main Street, Roundstone', 'Galway', 53.3953, -9.9231, '+353 95 35800', '07:00 - 22:00', '07:30 - 22:00', 4.00, 65, false),
('11111111-0009-0009-0009-000000000002', 'Spar Leenane', 'CONVENIENCE', 'Groceries, hot food, ATM, and tourist information.', 'Leenane Village', 'Galway', 53.6019, -9.7214, '+353 95 42211', '07:00 - 21:00', '08:00 - 21:00', 4.10, 54, false),
('11111111-0009-0009-0009-000000000003', 'Mace Portmagee', 'CONVENIENCE', 'Last stop before Skellig Michael. Snacks, fuel, and gifts.', 'Portmagee', 'Kerry', 51.8847, -10.3594, '+353 66 9477116', '07:30 - 20:00', '08:00 - 20:00', 4.20, 112, false),
('11111111-0009-0009-0009-000000000004', 'Glencolmcille Store', 'CONVENIENCE', 'Remote village store with camping supplies and local crafts.', 'Glencolmcille', 'Donegal', 54.7078, -8.7281, '+353 74 9730017', '08:00 - 19:00', '09:00 - 18:00', 4.30, 78, false);
