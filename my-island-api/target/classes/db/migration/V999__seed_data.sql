-- V999: Seed data for development and testing

-- Test Users (passwords are all 'password' hashed with BCrypt)
-- BCrypt hash for 'password': $2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG
INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier) VALUES
    -- Owners (Campsites across Ireland)
    ('norevalley@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Nore Valley Owner', 'OWNER', TRUE, FALSE),
    ('wildatlantic@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Wild Atlantic Owner', 'OWNER', TRUE, FALSE),
    ('lakeside@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Lakeside Retreat Owner', 'OWNER', TRUE, FALSE),
    ('clifden@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Clifden Eco Camp Owner', 'OWNER', TRUE, FALSE),
    ('dingle@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Dingle Peninsula Owner', 'OWNER', TRUE, FALSE),
    ('wicklow@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Wicklow Hills Owner', 'OWNER', TRUE, FALSE),
    ('donegal@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Donegal Wilds Owner', 'OWNER', TRUE, FALSE),
    ('westcork@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'West Cork Hideaway Owner', 'OWNER', TRUE, FALSE),
    ('burren@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Burren Basecamp Owner', 'OWNER', TRUE, FALSE),
    ('mayo@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Croagh Patrick Camp Owner', 'OWNER', TRUE, FALSE),
    ('sligo@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Yeats Country Camping Owner', 'OWNER', TRUE, FALSE),
    ('wexford@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Sunny Southeast Owner', 'OWNER', TRUE, FALSE),
    ('kerry@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Ring of Kerry Glamping Owner', 'OWNER', TRUE, FALSE),
    ('antrim@myisland.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Giants Causeway Camp Owner', 'OWNER', TRUE, FALSE),

    -- Suppliers (Various categories)
    ('farmshop@greenacres.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Green Acres Farm Shop', 'SUPPLIER', FALSE, TRUE),
    ('kayaks@wildwater.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Wild Water Kayaks', 'SUPPLIER', FALSE, TRUE),
    ('cycles@atlantictrails.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Atlantic Trail Cycles', 'SUPPLIER', FALSE, TRUE),
    ('stables@irishhorse.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Connemara Pony Treks', 'SUPPLIER', FALSE, TRUE),
    ('surf@lahinch.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Lahinch Surf School', 'SUPPLIER', FALSE, TRUE),
    ('fishing@loughcorrib.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Corrib Fishing Guides', 'SUPPLIER', FALSE, TRUE),
    ('cheese@durrus.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Durrus Farmhouse Cheese', 'SUPPLIER', FALSE, TRUE),
    ('bakery@soda.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Annascaul Bakery', 'SUPPLIER', FALSE, TRUE),
    ('pub@oconnors.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'O''Connors Traditional Pub', 'SUPPLIER', FALSE, TRUE),
    ('crafts@aranknits.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Aran Islands Knitwear', 'SUPPLIER', FALSE, TRUE),
    ('pottery@louisburgh.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Westport Pottery Studio', 'SUPPLIER', FALSE, TRUE),
    ('whiskey@dingle.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Dingle Distillery Tours', 'SUPPLIER', FALSE, TRUE),
    ('chocolate@skelligs.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Skelligs Chocolate Factory', 'SUPPLIER', FALSE, TRUE),
    ('seaweed@wildirish.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Wild Irish Seaweed Co', 'SUPPLIER', FALSE, TRUE),
    ('boat@blasket.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Blasket Island Ferries', 'SUPPLIER', FALSE, TRUE),
    ('yoga@retreat.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Burren Yoga Retreats', 'SUPPLIER', FALSE, TRUE),
    ('falconry@ashford.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Irish Hawking Club', 'SUPPLIER', FALSE, TRUE),
    ('golf@links.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Lahinch Golf Club', 'SUPPLIER', FALSE, TRUE),
    ('seafood@kinsale.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Kinsale Seafood Restaurant', 'SUPPLIER', FALSE, TRUE),
    ('coffee@badger.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Badger & Dodo Coffee', 'SUPPLIER', FALSE, TRUE),
    ('spa@monart.ie', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Woodland Spa & Wellness', 'SUPPLIER', FALSE, TRUE),

    -- Guests
    ('family@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Murphy Family', 'GUEST', FALSE, FALSE),
    ('solo@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Solo Traveler', 'GUEST', FALSE, FALSE),
    ('couple@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Romantic Getaway', 'GUEST', FALSE, FALSE),
    ('adventure@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Adventure Seekers', 'GUEST', FALSE, FALSE),
    ('group@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Hiking Group', 'GUEST', FALSE, FALSE);

-- Owners (Property/Campsite) - 14 campsites across Ireland
INSERT INTO owners (user_id, property_name, county, town, property_type, description, latitude, longitude, phone, website) VALUES
    (1, 'Nore Valley Park', 'Kilkenny', 'Bennettsbridge', 'CAMPSITE', 'Award-winning eco-friendly campsite in the heart of the Nore Valley. Family-owned and operated since 1985. Features riverside pitches, woodland walks, and an on-site farm shop.', 52.5614, -7.1897, '+353 56 772 7229', 'https://norevalleypark.com'),
    (2, 'Wild Atlantic Glamping', 'Clare', 'Doolin', 'GLAMPING', 'Luxury glamping pods overlooking the Cliffs of Moher. Experience the Wild Atlantic Way in style with hot tubs, wood-burning stoves, and spectacular ocean views.', 53.0176, -9.3731, '+353 65 707 4666', 'https://wildatlanticglamping.ie'),
    (3, 'Lakeside Retreat', 'Galway', 'Oughterard', 'CAMPSITE', 'Peaceful campsite on the shores of Lough Corrib. Perfect for fishing enthusiasts and nature lovers. Boat launching facilities and tackle shop on site.', 53.4285, -9.3144, '+353 91 552 345', 'https://lakesideretreat.ie'),
    (4, 'Clifden Eco Camp', 'Galway', 'Clifden', 'CAMPSITE', 'Sustainable camping in the heart of Connemara. Solar-powered facilities, composting toilets, and organic vegetable garden. Gateway to the Sky Road and Connemara National Park.', 53.4897, -10.0201, '+353 95 21 699', 'https://clifdenecocamp.ie'),
    (5, 'Dingle Peninsula Camping', 'Kerry', 'Dingle', 'CAMPSITE', 'Family-friendly campsite with stunning views of Dingle Bay. Walking distance to town centre, pubs, and restaurants. Dolphin watching trips can be arranged.', 52.1409, -10.2671, '+353 66 915 1454', 'https://dinglecamping.ie'),
    (6, 'Wicklow Hills Hideaway', 'Wicklow', 'Roundwood', 'GLAMPING', 'Escape to the Garden of Ireland. Luxurious shepherd huts and yurts nestled in ancient woodland. Just 45 minutes from Dublin with hiking trails at your doorstep.', 53.0642, -6.2219, '+353 1 281 8237', 'https://wicklowhillshideaway.ie'),
    (7, 'Donegal Wild Camping', 'Donegal', 'Dunfanaghy', 'CAMPSITE', 'Remote camping on Ireland''s rugged northwest coast. Dark sky reserve location perfect for stargazing. Horn Head and Ards Forest Park nearby.', 55.1834, -7.9667, '+353 74 913 6208', 'https://donegalwildcamping.ie'),
    (8, 'West Cork Hideaway', 'Cork', 'Schull', 'GLAMPING', 'Boutique glamping on the Wild Atlantic Way. Each unit has its own private garden with fire pit. Local seafood delivered fresh daily. Kayak and paddleboard rental available.', 51.5275, -9.5412, '+353 28 28 123', 'https://westcorkhideaway.ie'),
    (9, 'Burren Basecamp', 'Clare', 'Ballyvaughan', 'CAMPSITE', 'Camp among the lunar landscape of the Burren. Walking trails, rock climbing, and caving adventures. Spring brings rare wildflowers found nowhere else in Ireland.', 53.1142, -9.1475, '+353 65 707 7066', 'https://burrenbasecamp.ie'),
    (10, 'Croagh Patrick Camp', 'Mayo', 'Westport', 'CAMPSITE', 'Base camp for Ireland''s holy mountain. Traditional camping with modern facilities. Greenway cycle path starts at our gate. Westport town just 3km away.', 53.7594, -9.6778, '+353 98 25 811', 'https://croaghpatrickcamp.ie'),
    (11, 'Yeats Country Camping', 'Sligo', 'Drumcliffe', 'CAMPSITE', 'Camp beneath Ben Bulben, the mountain that inspired Yeats. Surf beaches at Strandhill 15 minutes away. Traditional music sessions in local pubs every weekend.', 54.3268, -8.4912, '+353 71 916 3456', 'https://yeatscountrycamping.ie'),
    (12, 'Sunny Southeast Camping', 'Wexford', 'Courtown', 'CAMPSITE', 'Ireland''s sunniest corner! Sandy beaches, safe swimming, and family-friendly activities. Heated outdoor pool and adventure playground. Perfect for young families.', 52.6461, -6.2289, '+353 53 942 5678', 'https://sunnysoutheast.ie'),
    (13, 'Ring of Kerry Glamping', 'Kerry', 'Kenmare', 'GLAMPING', 'Luxury glamping at the gateway to the Ring of Kerry. Each dome has mountain views and outdoor bathtub. On-site restaurant serving local Kerry lamb and seafood.', 51.8803, -9.5839, '+353 64 664 1234', 'https://ringofkerryglamping.ie'),
    (14, 'Giants Causeway Camp', 'Antrim', 'Bushmills', 'CAMPSITE', 'Northern Ireland''s premier campsite, minutes from the UNESCO World Heritage Giant''s Causeway. Dark Hedges and Carrick-a-Rede rope bridge nearby. Whiskey distillery tours available.', 55.2408, -6.5117, '+44 28 2073 1234', 'https://giantscausewaycamp.com');

-- Lots for Nore Valley Park (owner_id = 1)
INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, is_active, image_url) VALUES
    (1, 'Riverside Pitch 1', 'TENT', 'Spacious grass pitch by the River Nore. Perfect for tents up to 4-person. Wake up to the sound of flowing water.', 25.00, 4, TRUE, '/images/lots/riverside-1.jpg'),
    (1, 'Riverside Pitch 2', 'TENT', 'Quiet corner pitch with river views and morning sun. Great for early risers.', 25.00, 4, TRUE, '/images/lots/riverside-2.jpg'),
    (1, 'Riverside Pitch 3', 'TENT', 'Shaded pitch under mature oak trees. Perfect for hot summer days.', 25.00, 4, TRUE, '/images/lots/riverside-3.jpg'),
    (1, 'Hardstanding A', 'CAMPERVAN', 'Level hardstanding with electric hookup (16A) for campervans and motorhomes.', 35.00, 4, TRUE, '/images/lots/hardstanding-a.jpg'),
    (1, 'Hardstanding B', 'CAMPERVAN', 'Premium pitch with water hookup and grey water disposal nearby.', 40.00, 4, TRUE, '/images/lots/hardstanding-b.jpg'),
    (1, 'Hardstanding C', 'CAMPERVAN', 'Extra-large pitch for caravans with awning space. Full service hookups.', 42.00, 6, TRUE, '/images/lots/hardstanding-c.jpg'),
    (1, 'Woodland Bell Tent', 'GLAMPING', 'Pre-furnished bell tent in a woodland clearing. Includes real beds, rugs, and fairy lights.', 85.00, 2, TRUE, '/images/lots/bell-tent.jpg'),
    (1, 'Treehouse Retreat', 'TREEHOUSE', 'Unique treehouse experience with panoramic valley views. Adults only. Includes breakfast basket.', 150.00, 2, TRUE, '/images/lots/treehouse.jpg');

-- Lots for Wild Atlantic Glamping (owner_id = 2)
INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, is_active, image_url) VALUES
    (2, 'Cliff View Pod 1', 'POD', 'Luxury pod with floor-to-ceiling windows facing the Atlantic. Watch dolphins from your bed.', 180.00, 2, TRUE, '/images/lots/cliff-pod-1.jpg'),
    (2, 'Cliff View Pod 2', 'POD', 'Premium pod with private outdoor hot tub and uninterrupted ocean views.', 220.00, 2, TRUE, '/images/lots/cliff-pod-2.jpg'),
    (2, 'Cliff View Pod 3', 'POD', 'Honeymoon pod with champagne on arrival and rose petal turndown service.', 250.00, 2, TRUE, '/images/lots/cliff-pod-3.jpg'),
    (2, 'Atlantic Yurt', 'YURT', 'Traditional Mongolian yurt with wood-burning stove and sheepskin rugs.', 140.00, 4, TRUE, '/images/lots/atlantic-yurt.jpg'),
    (2, 'Cosy Cabin', 'CABIN', 'Self-contained cabin with kitchenette, en-suite, and covered deck.', 160.00, 4, TRUE, '/images/lots/cosy-cabin.jpg'),
    (2, 'Stargazer Dome', 'POD', 'Transparent geodesic dome for ultimate stargazing. Blackout blinds for sleeping.', 200.00, 2, TRUE, '/images/lots/stargazer-dome.jpg');

-- Lots for Lakeside Retreat (owner_id = 3)
INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, is_active, image_url) VALUES
    (3, 'Lakeshore Pitch 1', 'TENT', 'Prime waterfront pitch with your own private fishing spot.', 30.00, 4, TRUE, '/images/lots/lakeshore-1.jpg'),
    (3, 'Lakeshore Pitch 2', 'TENT', 'Second row pitch with lake views and easy boat launching access.', 28.00, 4, TRUE, '/images/lots/lakeshore-2.jpg'),
    (3, 'Anglers Cabin', 'CABIN', 'Purpose-built fishing cabin with rod storage and fish cleaning station.', 120.00, 4, TRUE, '/images/lots/anglers-cabin.jpg'),
    (3, 'Family Chalet', 'CABIN', 'Two-bedroom lakeside chalet. Perfect for families with lake-view deck.', 180.00, 6, TRUE, '/images/lots/family-chalet.jpg'),
    (3, 'Campervan Bay 1', 'CAMPERVAN', 'Lakefront hardstanding with full hookups and stunning sunset views.', 45.00, 4, TRUE, '/images/lots/campervan-bay-1.jpg');

-- Lots for Clifden Eco Camp (owner_id = 4)
INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, is_active, image_url) VALUES
    (4, 'Wild Pitch 1', 'TENT', 'Back-to-basics pitch in wildflower meadow. Composting toilet nearby.', 18.00, 2, TRUE, '/images/lots/wild-pitch-1.jpg'),
    (4, 'Wild Pitch 2', 'TENT', 'Secluded pitch surrounded by native woodland. True wilderness feel.', 18.00, 2, TRUE, '/images/lots/wild-pitch-2.jpg'),
    (4, 'Eco Pod', 'POD', 'Solar-powered pod made from reclaimed materials. Off-grid luxury.', 95.00, 2, TRUE, '/images/lots/eco-pod.jpg'),
    (4, 'Hobbit Hut', 'CABIN', 'Grass-roofed earth-sheltered cabin. Cosy and eco-friendly.', 110.00, 2, TRUE, '/images/lots/hobbit-hut.jpg'),
    (4, 'Connemara Tipi', 'GLAMPING', 'Authentic tipi with fire pit in centre. Unforgettable experience.', 75.00, 4, TRUE, '/images/lots/connemara-tipi.jpg');

-- Lots for Dingle Peninsula Camping (owner_id = 5)
INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, is_active, image_url) VALUES
    (5, 'Bay View Pitch 1', 'TENT', 'Elevated pitch with panoramic Dingle Bay views.', 28.00, 4, TRUE, '/images/lots/bay-view-1.jpg'),
    (5, 'Bay View Pitch 2', 'TENT', 'Sheltered pitch perfect for all weather. Mountain backdrop.', 26.00, 4, TRUE, '/images/lots/bay-view-2.jpg'),
    (5, 'Bay View Pitch 3', 'TENT', 'Family-sized pitch near playground and facilities.', 26.00, 6, TRUE, '/images/lots/bay-view-3.jpg'),
    (5, 'Motorhome Bay A', 'CAMPERVAN', 'All-weather hardstanding with 16A electric and water.', 38.00, 4, TRUE, '/images/lots/motorhome-bay-a.jpg'),
    (5, 'Motorhome Bay B', 'CAMPERVAN', 'Premium bay with waste disposal and TV hookup.', 42.00, 4, TRUE, '/images/lots/motorhome-bay-b.jpg'),
    (5, 'Kerry Cottage', 'CABIN', 'Traditional stone cottage lovingly restored. Wood-burning stove.', 145.00, 4, TRUE, '/images/lots/kerry-cottage.jpg');

-- Lots for Wicklow Hills Hideaway (owner_id = 6)
INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, is_active, image_url) VALUES
    (6, 'Shepherds Hut 1', 'CABIN', 'Victorian-style shepherds hut with wood burner and king bed.', 135.00, 2, TRUE, '/images/lots/shepherds-hut-1.jpg'),
    (6, 'Shepherds Hut 2', 'CABIN', 'Romantic hideaway with outdoor copper bath and mountain views.', 155.00, 2, TRUE, '/images/lots/shepherds-hut-2.jpg'),
    (6, 'Woodland Yurt', 'YURT', 'Spacious yurt hidden in ancient oak woodland. Deck with BBQ.', 125.00, 4, TRUE, '/images/lots/woodland-yurt.jpg'),
    (6, 'Treehouse Nest', 'TREEHOUSE', 'Elevated treehouse with rope bridge entrance. Adventure awaits!', 175.00, 2, TRUE, '/images/lots/treehouse-nest.jpg'),
    (6, 'Safari Tent', 'GLAMPING', 'African-style safari tent with ensuite bathroom and deck.', 145.00, 4, TRUE, '/images/lots/safari-tent.jpg');

-- Lots for Donegal Wild Camping (owner_id = 7)
INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, is_active, image_url) VALUES
    (7, 'Atlantic Edge 1', 'TENT', 'Wild camping pitch on clifftop. Not for the faint-hearted!', 20.00, 2, TRUE, '/images/lots/atlantic-edge-1.jpg'),
    (7, 'Atlantic Edge 2', 'TENT', 'Exposed but exhilarating pitch with 180° ocean views.', 20.00, 2, TRUE, '/images/lots/atlantic-edge-2.jpg'),
    (7, 'Sheltered Glen', 'TENT', 'Protected valley pitch for those preferring calm conditions.', 22.00, 4, TRUE, '/images/lots/sheltered-glen.jpg'),
    (7, 'Stargazer Pitch', 'TENT', 'Prime dark sky location. Telescope available for hire.', 25.00, 2, TRUE, '/images/lots/stargazer-pitch.jpg'),
    (7, 'Bothy', 'CABIN', 'Basic stone bothy for shelter. Bring your own sleeping gear.', 45.00, 4, TRUE, '/images/lots/bothy.jpg');

-- Lots for West Cork Hideaway (owner_id = 8)
INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, is_active, image_url) VALUES
    (8, 'Garden Suite 1', 'GLAMPING', 'Private walled garden with luxury safari tent and fire pit.', 165.00, 2, TRUE, '/images/lots/garden-suite-1.jpg'),
    (8, 'Garden Suite 2', 'GLAMPING', 'Secluded garden room with outdoor shower and hammock.', 165.00, 2, TRUE, '/images/lots/garden-suite-2.jpg'),
    (8, 'Schull Cabin', 'CABIN', 'Self-catering cabin with harbour views. Walk to restaurants.', 175.00, 4, TRUE, '/images/lots/schull-cabin.jpg'),
    (8, 'Beach Hut', 'CABIN', 'Converted beach hut 50m from sandy cove. Kayaks included.', 140.00, 2, TRUE, '/images/lots/beach-hut.jpg');

-- Lots for Burren Basecamp (owner_id = 9)
INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, is_active, image_url) VALUES
    (9, 'Limestone Pitch 1', 'TENT', 'Unique pitch among Burren limestone pavement.', 22.00, 4, TRUE, '/images/lots/limestone-1.jpg'),
    (9, 'Limestone Pitch 2', 'TENT', 'Wildflower meadow pitch. Spring orchids surround you.', 22.00, 4, TRUE, '/images/lots/limestone-2.jpg'),
    (9, 'Cave Entrance', 'TENT', 'Adventure pitch near cave system. Caving gear for hire.', 25.00, 4, TRUE, '/images/lots/cave-entrance.jpg'),
    (9, 'Hazel Wood Pod', 'POD', 'Cosy pod in ancient hazel woodland. Magical atmosphere.', 110.00, 2, TRUE, '/images/lots/hazel-pod.jpg'),
    (9, 'Stone Cottage', 'CABIN', 'Restored famine cottage with modern comforts.', 130.00, 4, TRUE, '/images/lots/stone-cottage.jpg');

-- Lots for Croagh Patrick Camp (owner_id = 10)
INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, is_active, image_url) VALUES
    (10, 'Pilgrim Pitch 1', 'TENT', 'Traditional camping for Croagh Patrick pilgrims.', 20.00, 4, TRUE, '/images/lots/pilgrim-1.jpg'),
    (10, 'Pilgrim Pitch 2', 'TENT', 'Early morning views of the Reek. Sacred mountain energy.', 20.00, 4, TRUE, '/images/lots/pilgrim-2.jpg'),
    (10, 'Greenway Pitch', 'TENT', 'Direct access to Great Western Greenway cycle path.', 22.00, 4, TRUE, '/images/lots/greenway-pitch.jpg'),
    (10, 'Caravan Row 1', 'CAMPERVAN', 'Full-service pitch for touring caravans.', 38.00, 6, TRUE, '/images/lots/caravan-row-1.jpg'),
    (10, 'Westport View Pod', 'POD', 'Modern pod with views towards Westport town.', 100.00, 2, TRUE, '/images/lots/westport-pod.jpg');

-- Lots for Yeats Country Camping (owner_id = 11)
INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, is_active, image_url) VALUES
    (11, 'Ben Bulben View 1', 'TENT', 'Iconic views of Yeats'' beloved mountain.', 24.00, 4, TRUE, '/images/lots/ben-bulben-1.jpg'),
    (11, 'Ben Bulben View 2', 'TENT', 'Poetry in motion. Sunrise over the mountain is unforgettable.', 24.00, 4, TRUE, '/images/lots/ben-bulben-2.jpg'),
    (11, 'Surfers Corner', 'CAMPERVAN', 'Quick access to Strandhill surf beaches.', 35.00, 4, TRUE, '/images/lots/surfers-corner.jpg'),
    (11, 'Drumcliffe Cabin', 'CABIN', 'Cabin near Drumcliffe churchyard where Yeats is buried.', 120.00, 4, TRUE, '/images/lots/drumcliffe-cabin.jpg');

-- Lots for Sunny Southeast Camping (owner_id = 12)
INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, is_active, image_url) VALUES
    (12, 'Beach Pitch 1', 'TENT', '2-minute walk to Blue Flag beach. Sandcastles guaranteed!', 30.00, 6, TRUE, '/images/lots/beach-pitch-1.jpg'),
    (12, 'Beach Pitch 2', 'TENT', 'Family-sized pitch near playground and pool.', 30.00, 6, TRUE, '/images/lots/beach-pitch-2.jpg'),
    (12, 'Beach Pitch 3', 'TENT', 'Quiet corner for families wanting peace and proximity.', 28.00, 4, TRUE, '/images/lots/beach-pitch-3.jpg'),
    (12, 'Seaside Caravan', 'CAMPERVAN', 'Premium pitch with sea glimpses through the dunes.', 40.00, 6, TRUE, '/images/lots/seaside-caravan.jpg'),
    (12, 'Family Lodge', 'CABIN', 'Three-bedroom lodge with full kitchen. Beach gear included.', 220.00, 8, TRUE, '/images/lots/family-lodge.jpg'),
    (12, 'Beach House', 'CABIN', 'Two-storey beach house 100m from sand. Surf board storage.', 195.00, 6, TRUE, '/images/lots/beach-house.jpg');

-- Lots for Ring of Kerry Glamping (owner_id = 13)
INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, is_active, image_url) VALUES
    (13, 'Mountain Dome 1', 'POD', 'Geodesic dome with MacGillycuddy Reeks views. Outdoor bath.', 195.00, 2, TRUE, '/images/lots/mountain-dome-1.jpg'),
    (13, 'Mountain Dome 2', 'POD', 'Luxury dome with private hot tub and stargazing roof.', 235.00, 2, TRUE, '/images/lots/mountain-dome-2.jpg'),
    (13, 'Kenmare Bay Pod', 'POD', 'Bay-view pod with floor heating and rainfall shower.', 175.00, 2, TRUE, '/images/lots/kenmare-pod.jpg'),
    (13, 'Wild Atlantic Suite', 'CABIN', 'Premium cabin with chef''s kitchen and balcony dining.', 265.00, 4, TRUE, '/images/lots/wild-atlantic-suite.jpg'),
    (13, 'Romantic Retreat', 'GLAMPING', 'Adults-only hideaway with champagne on arrival.', 225.00, 2, TRUE, '/images/lots/romantic-retreat.jpg');

-- Lots for Giants Causeway Camp (owner_id = 14)
INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, is_active, image_url) VALUES
    (14, 'Causeway Pitch 1', 'TENT', '15-minute walk to the Giant''s Causeway stones.', 28.00, 4, TRUE, '/images/lots/causeway-1.jpg'),
    (14, 'Causeway Pitch 2', 'TENT', 'Atlantic views with legendary hexagonal backdrop.', 28.00, 4, TRUE, '/images/lots/causeway-2.jpg'),
    (14, 'Dark Hedges View', 'TENT', 'Near the famous Dark Hedges of Game of Thrones fame.', 30.00, 4, TRUE, '/images/lots/dark-hedges.jpg'),
    (14, 'Whiskey Trail Pod', 'POD', 'Walking distance to Bushmills Distillery. Designated driver not needed!', 125.00, 2, TRUE, '/images/lots/whiskey-pod.jpg'),
    (14, 'Giants Cabin', 'CABIN', 'Family cabin with Giant''s Causeway themed decor. Kids love it!', 155.00, 6, TRUE, '/images/lots/giants-cabin.jpg');

-- Lot amenities (updating for all lots)
INSERT INTO lot_amenities (lot_id, amenity_id) VALUES
    -- Nore Valley Park lots (1-8)
    (1, 6), (1, 7), (1, 8),
    (2, 6), (2, 7), (2, 8),
    (3, 6), (3, 8),
    (4, 2), (4, 3), (4, 9),
    (5, 2), (5, 3), (5, 9),
    (6, 2), (6, 3), (6, 9), (6, 4),
    (7, 1), (7, 2), (7, 6), (7, 8),
    (8, 1), (8, 2), (8, 5), (8, 6),
    -- Wild Atlantic Glamping lots (9-14)
    (9, 1), (9, 2), (9, 5), (9, 10),
    (10, 1), (10, 2), (10, 5), (10, 10),
    (11, 1), (11, 2), (11, 5), (11, 10),
    (12, 1), (12, 6), (12, 8),
    (13, 1), (13, 2), (13, 4), (13, 5),
    (14, 1), (14, 2), (14, 5),
    -- Lakeside Retreat lots (15-19)
    (15, 6), (15, 7), (15, 8),
    (16, 6), (16, 8),
    (17, 1), (17, 2), (17, 4), (17, 5),
    (18, 1), (18, 2), (18, 4), (18, 5),
    (19, 2), (19, 3), (19, 9);

-- Campsite amenities (for all owners)
INSERT INTO campsite_amenities (owner_id, amenity_id) VALUES
    (1, 1), (1, 4), (1, 5), (1, 9), (1, 11), (1, 14), (1, 16), (1, 17), (1, 19),
    (2, 1), (2, 4), (2, 5), (2, 9), (2, 10), (2, 14), (2, 18), (2, 19),
    (3, 1), (3, 4), (3, 5), (3, 9), (3, 11), (3, 16),
    (4, 4), (4, 5), (4, 11), (4, 17),
    (5, 1), (5, 4), (5, 5), (5, 9), (5, 10), (5, 11), (5, 14), (5, 16),
    (6, 1), (6, 4), (6, 5), (6, 9), (6, 14), (6, 18), (6, 19),
    (7, 4), (7, 5), (7, 11), (7, 17),
    (8, 1), (8, 4), (8, 5), (8, 9), (8, 10), (8, 14), (8, 18),
    (9, 1), (9, 4), (9, 5), (9, 9), (9, 11), (9, 14),
    (10, 1), (10, 4), (10, 5), (10, 9), (10, 11), (10, 16),
    (11, 1), (11, 4), (11, 5), (11, 9), (11, 11),
    (12, 1), (12, 4), (12, 5), (12, 9), (12, 10), (12, 11), (12, 14), (12, 16), (12, 19),
    (13, 1), (13, 4), (13, 5), (13, 9), (13, 14), (13, 18), (13, 19),
    (14, 1), (14, 4), (14, 5), (14, 9), (14, 10), (14, 11), (14, 14);

-- Suppliers (21 diverse local businesses)
INSERT INTO suppliers (user_id, business_name, category, description, county, town, address, phone, website, is_verified) VALUES
    (15, 'Green Acres Farm Shop', 'FARM_SHOP', 'Local organic produce, artisan cheeses, and homemade preserves. Supporting Irish farmers since 1998. Award-winning soda bread baked daily.', 'Kilkenny', 'Thomastown', '123 Main Street, Thomastown', '+353 56 779 4100', 'https://greenacresfarm.ie', TRUE),
    (16, 'Wild Water Kayaks', 'ACTIVITY_PROVIDER', 'Kayak and canoe rental with guided tours along the River Nore and coastal waters. All equipment and wetsuits provided. Beginners welcome!', 'Clare', 'Doolin', 'The Pier, Doolin', '+353 65 707 5000', 'https://wildwaterkayaks.ie', TRUE),
    (17, 'Atlantic Trail Cycles', 'ACTIVITY_PROVIDER', 'Premium bike rental for the Wild Atlantic Way. Electric bikes, mountain bikes, and kids bikes available. Free route planning service.', 'Galway', 'Clifden', 'Market Square, Clifden', '+353 95 21 888', 'https://atlantictrailcycles.ie', TRUE),
    (18, 'Connemara Pony Treks', 'ACTIVITY_PROVIDER', 'Explore the wild Connemara landscape on our gentle native ponies. Beach rides, mountain treks, and lessons for all ages.', 'Galway', 'Ballyconneely', 'Errislannan Manor', '+353 95 23 456', 'https://connemaraponytrek.ie', TRUE),
    (19, 'Lahinch Surf School', 'ACTIVITY_PROVIDER', 'Learn to surf on Ireland''s best waves! ISA-certified instructors, all gear included. Private lessons and group sessions available.', 'Clare', 'Lahinch', 'The Promenade, Lahinch', '+353 65 708 1234', 'https://lahinchsurfschool.ie', TRUE),
    (20, 'Corrib Fishing Guides', 'ACTIVITY_PROVIDER', 'Expert-guided fishing on Lough Corrib, Ireland''s largest lake. Trout, pike, and salmon. Boats and tackle provided.', 'Galway', 'Oughterard', 'Lakeside Marina', '+353 91 552 789', 'https://corribfishing.ie', TRUE),
    (21, 'Durrus Farmhouse Cheese', 'FARM_SHOP', 'Traditional farmhouse cheese made from our own herd. Cheese tastings, farm tours, and picnic platters available.', 'Cork', 'Durrus', 'Coomkeen, Durrus', '+353 27 61 100', 'https://durruscheese.ie', TRUE),
    (22, 'Annascaul Bakery', 'RESTAURANT', 'Artisan bakery famous for our sourdough and traditional Irish barm brack. Breakfast and lunch served daily. Tom Crean memorabilia inside.', 'Kerry', 'Annascaul', 'Main Street, Annascaul', '+353 66 915 7777', 'https://annascaulbakery.ie', TRUE),
    (23, 'O''Connors Traditional Pub', 'RESTAURANT', 'Family-run pub since 1832. Live traditional music every night. Seafood chowder award-winner 5 years running.', 'Clare', 'Doolin', 'Fisher Street, Doolin', '+353 65 707 4168', 'https://oconnorsdoolin.ie', TRUE),
    (24, 'Aran Islands Knitwear', 'ARTISAN', 'Authentic Aran sweaters hand-knitted on the islands. Each piece tells a story. Custom orders welcome.', 'Galway', 'Inis Mór', 'Kilronan, Inis Mór', '+353 99 61 234', 'https://aranknitwear.ie', TRUE),
    (25, 'Westport Pottery Studio', 'ARTISAN', 'Handcrafted pottery inspired by the Mayo landscape. Workshops available for all skill levels. Gallery and shop.', 'Mayo', 'Westport', 'The Quay, Westport', '+353 98 28 999', 'https://westportpottery.ie', TRUE),
    (26, 'Dingle Distillery Tours', 'TOUR_OPERATOR', 'Experience Ireland''s artisan whiskey revolution. Guided distillery tours with tasting. Gift shop with exclusive releases.', 'Kerry', 'Dingle', 'Farranredmond, Dingle', '+353 66 402 9011', 'https://dingledistillery.ie', TRUE),
    (27, 'Skelligs Chocolate Factory', 'FARM_SHOP', 'Handmade Irish chocolates using local ingredients. Factory tours, chocolate-making workshops, and cafe.', 'Kerry', 'Ballinskelligs', 'St Finian''s Bay', '+353 66 947 9119', 'https://skelligschocolate.com', TRUE),
    (28, 'Wild Irish Seaweed Co', 'FARM_SHOP', 'Sustainably harvested Atlantic seaweed. Cooking classes, foraging walks, and seaweed spa treatments.', 'Clare', 'Fanore', 'Coast Road, Fanore', '+353 65 707 6789', 'https://wildseaweed.ie', TRUE),
    (29, 'Blasket Island Ferries', 'TOUR_OPERATOR', 'Daily ferries to the abandoned Blasket Islands. Guided walks through the deserted village. Dolphin watching en route.', 'Kerry', 'Dunquin', 'Dunquin Pier', '+353 66 915 6422', 'https://blasketislands.ie', TRUE),
    (30, 'Burren Yoga Retreats', 'ACTIVITY_PROVIDER', 'Find peace among the ancient stones. Day retreats, weekend workshops, and teacher training. All levels welcome.', 'Clare', 'Ballyvaughan', 'Burren Yoga Centre', '+353 65 707 8888', 'https://burrenyoga.ie', TRUE),
    (31, 'Irish Hawking Club', 'ACTIVITY_PROVIDER', 'Experience falconry in spectacular settings. One-on-one sessions with Harris hawks and owls. Memorable for all ages.', 'Galway', 'Cong', 'Ashford Castle Estate', '+353 94 954 5400', 'https://irishhawking.ie', TRUE),
    (32, 'Lahinch Golf Club', 'ACTIVITY_PROVIDER', 'Championship links golf on the Wild Atlantic Way. Visitors welcome. Pro shop and clubhouse dining.', 'Clare', 'Lahinch', 'Lahinch Golf Club', '+353 65 708 1003', 'https://lahinchgolf.com', TRUE),
    (33, 'Kinsale Seafood Restaurant', 'RESTAURANT', 'Fresh-caught seafood in Ireland''s gourmet capital. Harbour views, local wines, and legendary fish pie.', 'Cork', 'Kinsale', 'Market Place, Kinsale', '+353 21 477 4900', 'https://kinsaleseafood.ie', TRUE),
    (34, 'Badger & Dodo Coffee', 'RESTAURANT', 'Specialty coffee roasters and cafe. Single-origin beans roasted on-site. Pastries and light lunches.', 'Galway', 'Galway City', 'Shop Street, Galway', '+353 91 569 123', 'https://badgeranddodo.ie', TRUE),
    (35, 'Woodland Spa & Wellness', 'ACTIVITY_PROVIDER', 'Forest bathing, outdoor hot tubs, and holistic treatments in ancient woodland. Day packages and overnight stays.', 'Wexford', 'Enniscorthy', 'The Still, Enniscorthy', '+353 53 923 8999', 'https://woodlandspa.ie', TRUE);

-- Offers (Multiple offers per supplier)
INSERT INTO offers (supplier_id, title, description, discount_type, discount_value, min_purchase, terms_conditions, valid_from, valid_until, max_claims, is_active) VALUES
    -- Green Acres Farm Shop
    (1, '10% Off Fresh Produce', 'Get 10% off all fresh fruit and vegetables', 'PERCENTAGE', 10.00, 10.00, 'Valid on fresh produce only. Cannot be combined with other offers.', '2025-01-01', '2027-12-31', 500, TRUE),
    (1, 'Free Cheese Tasting', 'Complimentary cheese tasting with any purchase over €20', 'FREE_ITEM', 0.00, 20.00, 'One tasting per customer per visit.', '2025-01-01', '2027-12-31', 300, TRUE),
    (1, 'Breakfast Basket Deal', 'Farm breakfast basket for 2 - save €5', 'FIXED_AMOUNT', 5.00, 25.00, 'Includes eggs, bacon, sausages, and fresh bread. Pre-order by 4pm previous day.', '2025-01-01', '2027-12-31', 200, TRUE),

    -- Wild Water Kayaks
    (2, '€10 Off Kayak Rental', 'Save €10 on any half-day or full-day kayak rental', 'FIXED_AMOUNT', 10.00, 30.00, 'Valid for single or double kayaks. Booking required.', '2025-04-01', '2025-09-30', 150, TRUE),
    (2, 'Buy One Get One Free Tour', 'Bring a friend for free on our guided coastal tour', 'BUY_ONE_GET_ONE', 0.00, 50.00, 'Must book in advance. Subject to availability.', '2025-05-01', '2025-08-31', 75, TRUE),
    (2, 'Sunset Paddle Special', '20% off evening sunset paddles', 'PERCENTAGE', 20.00, 40.00, 'Available May-August, departing 7pm.', '2025-05-01', '2025-08-31', 100, TRUE),

    -- Atlantic Trail Cycles
    (3, 'Full Day Bike Hire - 15% Off', 'Explore the Wild Atlantic Way for less', 'PERCENTAGE', 15.00, 25.00, 'Includes helmet, lock, and repair kit. Return by 6pm.', '2025-03-01', '2025-10-31', 300, TRUE),
    (3, 'E-Bike Experience', '€15 off electric bike rental', 'FIXED_AMOUNT', 15.00, 45.00, 'Full day e-bike hire. Range up to 80km.', '2025-03-01', '2025-10-31', 200, TRUE),
    (3, 'Family Bike Package', 'Family of 4 bikes for price of 3', 'PERCENTAGE', 25.00, 80.00, '2 adult + 2 child bikes. Trailer available at extra cost.', '2025-06-01', '2025-08-31', 100, TRUE),

    -- Connemara Pony Treks
    (4, '€10 Off Beach Trek', 'Discount on our popular beach ride experience', 'FIXED_AMOUNT', 10.00, 55.00, '2-hour beach trek. All riding levels welcome.', '2025-04-01', '2025-10-31', 150, TRUE),
    (4, 'Kids Pony Experience', 'Free lead rein session for under 8s with adult booking', 'FREE_ITEM', 0.00, 45.00, 'Adult must book full trek. Child session 30 minutes.', '2025-04-01', '2025-10-31', 100, TRUE),

    -- Lahinch Surf School
    (5, 'Beginner Lesson Bundle', 'Book 3 lessons, get 4th free', 'FREE_ITEM', 0.00, 120.00, 'Must be used within 14 days. Same student only.', '2025-05-01', '2025-09-30', 80, TRUE),
    (5, 'Surf & Stay Package', '20% off lessons for campsite guests', 'PERCENTAGE', 20.00, 45.00, 'Show valid campsite booking confirmation.', '2025-05-01', '2025-09-30', 200, TRUE),
    (5, 'Wetsuit Rental Included', 'Free wetsuit with any lesson booking', 'FREE_ITEM', 0.00, 45.00, 'Normally €10 extra. Limited sizes available.', '2025-04-01', '2025-10-31', 300, TRUE),

    -- Corrib Fishing Guides
    (6, 'Half-Day Guided Fishing', '€20 off guided fishing experience', 'FIXED_AMOUNT', 20.00, 120.00, 'Includes boat, tackle, and guide. Fish cleaning service included.', '2025-03-01', '2025-09-30', 80, TRUE),
    (6, 'Early Bird Special', '25% off dawn fishing trips', 'PERCENTAGE', 25.00, 100.00, 'Depart 5am, return by noon. Coffee and sandwiches included.', '2025-04-01', '2025-08-31', 50, TRUE),

    -- Durrus Farmhouse Cheese
    (7, 'Cheese Board for Two', '€8 off artisan cheese platter', 'FIXED_AMOUNT', 8.00, 28.00, 'Selection of 5 cheeses with crackers and chutney.', '2025-01-01', '2027-12-31', 200, TRUE),
    (7, 'Farm Tour & Tasting', 'Free tour with cheese purchase over €30', 'FREE_ITEM', 0.00, 30.00, 'Tours run 11am and 3pm daily. Booking recommended.', '2025-04-01', '2025-10-31', 150, TRUE),

    -- Annascaul Bakery
    (8, 'Baker''s Breakfast Deal', '15% off full Irish breakfast', 'PERCENTAGE', 15.00, 12.00, 'Served until 11:30am. Vegetarian option available.', '2025-01-01', '2027-12-31', 500, TRUE),
    (8, 'Fresh Bread Bundle', 'Buy 2 loaves, get sourdough half price', 'PERCENTAGE', 50.00, 8.00, 'Baked fresh each morning. While stocks last.', '2025-01-01', '2027-12-31', 400, TRUE),

    -- O'Connors Pub
    (9, 'Seafood Chowder & Guinness', '€5 off our famous combo', 'FIXED_AMOUNT', 5.00, 18.00, 'Award-winning chowder with fresh soda bread.', '2025-01-01', '2027-12-31', 500, TRUE),
    (9, 'Traditional Music Night', 'Free Irish coffee with dinner', 'FREE_ITEM', 0.00, 25.00, 'Valid Fri-Sun when music session is on.', '2025-01-01', '2027-12-31', 300, TRUE),

    -- Aran Islands Knitwear
    (10, '€20 Off Aran Sweaters', 'Discount on hand-knitted sweaters', 'FIXED_AMOUNT', 20.00, 120.00, 'Valid on full-price items only. One per customer.', '2025-01-01', '2027-12-31', 100, TRUE),
    (10, 'Free Scarf with Purchase', 'Complimentary wool scarf with sweater purchase', 'FREE_ITEM', 0.00, 150.00, 'Choice of 3 colors. While stocks last.', '2025-01-01', '2027-12-31', 50, TRUE),

    -- Westport Pottery
    (11, 'Pottery Workshop Discount', '€10 off 2-hour pottery experience', 'FIXED_AMOUNT', 10.00, 45.00, 'Create your own piece to take home. All materials included.', '2025-01-01', '2027-12-31', 200, TRUE),
    (11, '15% Off Gallery Purchases', 'Discount on handcrafted pottery', 'PERCENTAGE', 15.00, 30.00, 'Valid in-store only. Not valid with other offers.', '2025-01-01', '2027-12-31', 300, TRUE),

    -- Dingle Distillery
    (12, 'Distillery Tour & Tasting', '€5 off guided tour with whiskey flight', 'FIXED_AMOUNT', 5.00, 25.00, 'Tours run hourly 10am-5pm. Over 18s only.', '2025-01-01', '2027-12-31', 400, TRUE),
    (12, 'Exclusive Bottle Purchase', '10% off cask-strength whiskey', 'PERCENTAGE', 10.00, 80.00, 'Distillery exclusive. Not available elsewhere.', '2025-01-01', '2027-12-31', 100, TRUE),

    -- Skelligs Chocolate
    (13, 'Chocolate Making Workshop', 'Book for 2, pay for 1', 'BUY_ONE_GET_ONE', 0.00, 35.00, '90-minute workshop. Take home your creations.', '2025-01-01', '2027-12-31', 80, TRUE),
    (13, 'Free Hot Chocolate', 'Complimentary drink with €15 purchase', 'FREE_ITEM', 0.00, 15.00, 'Made with our signature chocolate. Cafe seating available.', '2025-01-01', '2027-12-31', 500, TRUE),

    -- Wild Irish Seaweed
    (14, 'Seaweed Foraging Walk', '€10 off guided coastal foraging', 'FIXED_AMOUNT', 10.00, 40.00, '2-hour walk with expert guide. Taste as you go!', '2025-04-01', '2025-09-30', 100, TRUE),
    (14, 'Seaweed Spa Treatment', '20% off kelp wrap experience', 'PERCENTAGE', 20.00, 60.00, '45-minute treatment. Booking essential.', '2025-01-01', '2027-12-31', 150, TRUE),

    -- Blasket Island Ferries
    (15, 'Island Explorer Ticket', '€5 off return ferry crossing', 'FIXED_AMOUNT', 5.00, 40.00, 'Includes dolphin watching. Weather dependent.', '2025-04-01', '2025-09-30', 300, TRUE),
    (15, 'Guided Island Walk', 'Free guided walk with ferry booking', 'FREE_ITEM', 0.00, 45.00, '2-hour walk through abandoned village. Fascinating history.', '2025-05-01', '2025-08-31', 150, TRUE),

    -- Burren Yoga
    (16, 'Day Retreat Special', '€15 off full day yoga retreat', 'FIXED_AMOUNT', 15.00, 85.00, 'Includes lunch and herbal tea. All levels.', '2025-01-01', '2027-12-31', 100, TRUE),
    (16, 'Sunrise Yoga Session', 'Free mat hire with drop-in class', 'FREE_ITEM', 0.00, 15.00, 'Classes 7am daily in summer months.', '2025-05-01', '2025-09-30', 200, TRUE),

    -- Irish Hawking Club
    (17, 'Falconry Experience', '€20 off private hawk walk', 'FIXED_AMOUNT', 20.00, 120.00, '2-hour experience with Harris hawk. Unforgettable!', '2025-01-01', '2027-12-31', 100, TRUE),
    (17, 'Owl Encounter', 'Kids fly an owl for half price', 'PERCENTAGE', 50.00, 45.00, '30-minute session with barn owl. Ages 8+.', '2025-01-01', '2027-12-31', 80, TRUE),

    -- Lahinch Golf
    (18, 'Weekday Green Fees', '€25 off Monday-Thursday rounds', 'FIXED_AMOUNT', 25.00, 120.00, 'Championship Old Course. Handicap cert required.', '2025-03-01', '2025-10-31', 200, TRUE),
    (18, 'Twilight Golf Special', '50% off after 4pm', 'PERCENTAGE', 50.00, 60.00, 'Castle Course only. Last tee time 5pm.', '2025-05-01', '2025-08-31', 150, TRUE),

    -- Kinsale Seafood Restaurant
    (19, 'Early Bird Menu', '20% off 3-course dinner before 7pm', 'PERCENTAGE', 20.00, 45.00, 'Reservations required. Set menu.', '2025-01-01', '2027-12-31', 300, TRUE),
    (19, 'Seafood Platter for 2', '€15 off our signature sharing platter', 'FIXED_AMOUNT', 15.00, 75.00, 'Includes lobster, crab, oysters, and prawns.', '2025-01-01', '2027-12-31', 150, TRUE),

    -- Badger & Dodo Coffee
    (20, 'Coffee & Pastry Deal', 'Free pastry with any specialty coffee', 'FREE_ITEM', 0.00, 5.00, 'Valid until noon. Choice of croissant or muffin.', '2025-01-01', '2027-12-31', 500, TRUE),
    (20, 'Coffee Bag Discount', '€3 off 250g bag of beans', 'FIXED_AMOUNT', 3.00, 12.00, 'Single-origin roasted locally. Grind to order.', '2025-01-01', '2027-12-31', 300, TRUE),

    -- Woodland Spa
    (21, 'Forest Bathing Experience', '€20 off guided forest therapy', 'FIXED_AMOUNT', 20.00, 65.00, '2-hour mindful walk in ancient woodland.', '2025-01-01', '2027-12-31', 100, TRUE),
    (21, 'Spa Day Package', '25% off full day package', 'PERCENTAGE', 25.00, 150.00, 'Includes treatment, lunch, and outdoor hot tub.', '2025-01-01', '2027-12-31', 80, TRUE);

-- Sample Bookings (More diverse bookings)
INSERT INTO bookings (user_id, lot_id, check_in_date, check_out_date, num_guests, total_price, status, special_requests) VALUES
    -- Murphy Family bookings
    (36, 1, '2025-06-15', '2025-06-18', 4, 75.00, 'CONFIRMED', 'Arriving late around 8pm. Will need campfire wood.'),
    (36, 9, '2025-07-20', '2025-07-25', 2, 900.00, 'CONFIRMED', 'Celebrating anniversary. Can you arrange flowers?'),
    (36, 53, '2025-08-10', '2025-08-15', 4, 150.00, 'PENDING', 'First time at this campsite!'),

    -- Solo Traveler bookings
    (37, 7, '2025-06-01', '2025-06-03', 1, 170.00, 'COMPLETED', NULL),
    (37, 22, '2025-07-05', '2025-07-08', 1, 54.00, 'CONFIRMED', 'Hiking the Burren Way. Need early check-in if possible.'),
    (37, 42, '2025-08-20', '2025-08-23', 1, 72.00, 'PENDING', 'Ben Bulben hike planned. Any local tips?'),

    -- Romantic Getaway bookings
    (38, 8, '2025-06-20', '2025-06-22', 2, 300.00, 'CONFIRMED', 'Honeymoon! Any romantic touches would be amazing.'),
    (38, 11, '2025-07-15', '2025-07-17', 2, 500.00, 'CONFIRMED', 'Proposal trip! Please keep the hot tub ready.'),
    (38, 59, '2025-08-01', '2025-08-03', 2, 470.00, 'PENDING', 'Anniversary weekend. Wine on arrival?'),

    -- Adventure Seekers bookings
    (39, 20, '2025-06-25', '2025-06-28', 2, 285.00, 'CONFIRMED', 'Here for caving. Can you recommend guides?'),
    (39, 28, '2025-07-10', '2025-07-12', 2, 40.00, 'CONFIRMED', 'Atlantic Edge camping - we love wild spots!'),
    (39, 65, '2025-08-15', '2025-08-18', 2, 84.00, 'PENDING', 'Giants Causeway visit. Bringing kayaks.'),

    -- Hiking Group bookings
    (40, 39, '2025-06-05', '2025-06-07', 4, 40.00, 'COMPLETED', 'Croagh Patrick pilgrimage group.'),
    (40, 15, '2025-07-25', '2025-07-28', 4, 84.00, 'CONFIRMED', 'Fishing trip! Need info on boat rental.'),
    (40, 35, '2025-08-22', '2025-08-25', 4, 435.00, 'PENDING', 'Group walking tour of Kerry.'),

    -- More historical bookings
    (36, 5, '2025-03-01', '2025-03-03', 4, 80.00, 'COMPLETED', 'Great campsite, will return!'),
    (37, 13, '2025-04-10', '2025-04-12', 1, 280.00, 'COMPLETED', 'Loved the cabin. Perfect location.'),
    (38, 33, '2025-05-05', '2025-05-07', 2, 270.00, 'COMPLETED', 'Beautiful hideaway. Highly recommend.'),
    (39, 17, '2025-04-20', '2025-04-23', 2, 360.00, 'COMPLETED', 'Excellent fishing! Caught a 10lb pike.');

-- Sample Offer Claims
INSERT INTO offer_claims (offer_id, user_id, booking_id, claim_code, status, is_test, expires_at) VALUES
    -- Claims for Murphy Family
    (1, 36, 1, 'GA-2025-001-ABC', 'CLAIMED', FALSE, '2025-06-18 23:59:59'),
    (4, 36, 2, 'WW-2025-001-XYZ', 'CLAIMED', FALSE, '2025-07-25 23:59:59'),
    (22, 36, 3, 'OC-2025-001-PUB', 'CLAIMED', FALSE, '2025-08-15 23:59:59'),

    -- Claims for Solo Traveler
    (2, 37, 4, 'GA-2025-002-DEF', 'REDEEMED', FALSE, '2025-06-03 23:59:59'),
    (16, 37, 5, 'BY-2025-001-YOG', 'CLAIMED', FALSE, '2025-07-08 23:59:59'),
    (19, 37, 6, 'AB-2025-001-BRK', 'CLAIMED', FALSE, '2025-08-23 23:59:59'),

    -- Claims for Romantic Getaway
    (28, 38, 7, 'DD-2025-001-WHI', 'CLAIMED', FALSE, '2025-06-22 23:59:59'),
    (45, 38, 8, 'WS-2025-001-SPA', 'CLAIMED', FALSE, '2025-07-17 23:59:59'),
    (41, 38, 9, 'KS-2025-001-SEA', 'CLAIMED', FALSE, '2025-08-03 23:59:59'),

    -- Claims for Adventure Seekers
    (14, 39, 10, 'WS-2025-001-SEA', 'CLAIMED', FALSE, '2025-06-28 23:59:59'),
    (5, 39, 11, 'LS-2025-001-SRF', 'CLAIMED', FALSE, '2025-07-12 23:59:59'),
    (36, 39, 12, 'BL-2025-001-FER', 'CLAIMED', FALSE, '2025-08-18 23:59:59'),

    -- Claims for Hiking Group
    (10, 40, 13, 'CP-2025-001-TRK', 'REDEEMED', FALSE, '2025-06-07 23:59:59'),
    (15, 40, 14, 'CF-2025-001-FSH', 'CLAIMED', FALSE, '2025-07-28 23:59:59'),
    (30, 40, 15, 'SC-2025-001-CHO', 'CLAIMED', FALSE, '2025-08-25 23:59:59'),

    -- Test claims for suppliers
    (1, 15, NULL, 'GA-TEST-001', 'REDEEMED', TRUE, '2025-12-31 23:59:59'),
    (4, 16, NULL, 'WW-TEST-001', 'REDEEMED', TRUE, '2025-12-31 23:59:59'),
    (7, 17, NULL, 'AT-TEST-001', 'REDEEMED', TRUE, '2025-12-31 23:59:59');
