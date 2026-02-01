-- V1005: Add large amount of seed campsites (50+)
-- This file adds Users (Owners), Owner Profiles (Campsites), and Lots for them.

-- 1. Users (Owners) - IDs 100+ to avoid conflicts with V999/V1004
INSERT INTO users (email, password_hash, name, role, is_owner, is_supplier) VALUES
('owner101@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Shannon River Owner', 'OWNER', TRUE, FALSE),
('owner102@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Ballyhoura Owner', 'OWNER', TRUE, FALSE),
('owner103@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Comeragh Owner', 'OWNER', TRUE, FALSE),
('owner104@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Achill Island Owner', 'OWNER', TRUE, FALSE),
('owner105@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Boyne Valley Owner', 'OWNER', TRUE, FALSE),
('owner106@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Glendalough Owner', 'OWNER', TRUE, FALSE),
('owner107@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Beara Peninsula Owner', 'OWNER', TRUE, FALSE),
('owner108@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Copper Coast Owner', 'OWNER', TRUE, FALSE),
('owner109@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Inishowen Owner', 'OWNER', TRUE, FALSE),
('owner110@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Mourne Mtns Owner', 'OWNER', TRUE, FALSE),
('owner111@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Lough Derg Owner', 'OWNER', TRUE, FALSE),
('owner112@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Rock of Cashel Owner', 'OWNER', TRUE, FALSE),
('owner113@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Valentia Island Owner', 'OWNER', TRUE, FALSE),
('owner114@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Killarney Park Owner', 'OWNER', TRUE, FALSE),
('owner115@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Tramore Beach Owner', 'OWNER', TRUE, FALSE),
('owner116@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Strandhill Surf Owner', 'OWNER', TRUE, FALSE),
('owner117@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Hook Head Owner', 'OWNER', TRUE, FALSE),
('owner118@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Slea Head Owner', 'OWNER', TRUE, FALSE),
('owner119@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Aran View Owner', 'OWNER', TRUE, FALSE),
('owner120@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Carlingford Lough Owner', 'OWNER', TRUE, FALSE),
('owner121@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Bantry Bay Owner', 'OWNER', TRUE, FALSE),
('owner122@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Killary Fjord Owner', 'OWNER', TRUE, FALSE),
('owner123@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Slieve Bloom Owner', 'OWNER', TRUE, FALSE),
('owner124@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Lough Ree Owner', 'OWNER', TRUE, FALSE),
('owner125@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Clonmacnoise Owner', 'OWNER', TRUE, FALSE),
('owner126@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Galtee Mountains Owner', 'OWNER', TRUE, FALSE),
('owner127@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Mulranny Park Owner', 'OWNER', TRUE, FALSE),
('owner128@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Black Valley Owner', 'OWNER', TRUE, FALSE),
('owner129@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Glenveagh Park Owner', 'OWNER', TRUE, FALSE),
('owner130@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Errigal View Owner', 'OWNER', TRUE, FALSE),
('owner131@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Spanish Point Owner', 'OWNER', TRUE, FALSE),
('owner132@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Kilkee Cliff Owner', 'OWNER', TRUE, FALSE),
('owner133@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Lough Erne Owner', 'OWNER', TRUE, FALSE),
('owner134@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Clew Bay Owner', 'OWNER', TRUE, FALSE),
('owner135@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Tara Hill Owner', 'OWNER', TRUE, FALSE),
('owner136@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Powerscourt Owner', 'OWNER', TRUE, FALSE),
('owner137@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Brittas Bay Owner', 'OWNER', TRUE, FALSE),
('owner138@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Rosslare Harbour Owner', 'OWNER', TRUE, FALSE),
('owner139@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Youghal Beach Owner', 'OWNER', TRUE, FALSE),
('owner140@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Cobh Harbour Owner', 'OWNER', TRUE, FALSE),
('owner141@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Blarney Castle Owner', 'OWNER', TRUE, FALSE),
('owner142@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Fota Island Owner', 'OWNER', TRUE, FALSE),
('owner143@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Mizen Head Owner', 'OWNER', TRUE, FALSE),
('owner144@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Sheep''s Head Owner', 'OWNER', TRUE, FALSE),
('owner145@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Cape Clear Owner', 'OWNER', TRUE, FALSE),
('owner146@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Sherkin Island Owner', 'OWNER', TRUE, FALSE),
('owner147@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Garnish Island Owner', 'OWNER', TRUE, FALSE),
('owner148@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Gougane Barra Owner', 'OWNER', TRUE, FALSE),
('owner149@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Dunmore East Owner', 'OWNER', TRUE, FALSE),
('owner150@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'Waterford Greenway Owner', 'OWNER', TRUE, FALSE);

-- 2. Owners (Campsite Profiles)
-- Note: Assuming IDs continue from previous sequence. 
-- Using sub-selects or explicit IDs if known. Previous seeded owners were 1-14.
-- New owners will receive IDs generated by trigger/sequence, but we need to link them to users correctly.
-- For simplicity in seed file, we can look up by email.

INSERT INTO owners (user_id, property_name, county, town, property_type, description, latitude, longitude, phone, website)
SELECT id, 'Shannon River Camping', 'Leitrim', 'Carrick-on-Shannon', 'CAMPSITE', 'Riverside camping with cruiser hire.', 53.9470, -8.0868, '+353 71 962 0000', 'https://shannoncamping.ie' FROM users WHERE email = 'owner101@example.com'
UNION ALL
SELECT id, 'Ballyhoura Forest Park', 'Limerick', 'Kilfinane', 'CAMPSITE', 'Mountain biking trails and forest walks.', 52.3576, -8.4725, '+353 63 91300', 'https://ballyhoura.ie' FROM users WHERE email = 'owner102@example.com'
UNION ALL
SELECT id, 'Comeragh Valley Camp', 'Waterford', 'Dungarvan', 'CAMPSITE', 'Near Coumshingaun Lake and Greenway.', 52.2035, -7.6377, '+353 58 41000', 'https://comeraghcamping.ie' FROM users WHERE email = 'owner103@example.com'
UNION ALL
SELECT id, 'Achill Wilds', 'Mayo', 'Keel', 'GLAMPING', 'Wild Atlantic Way pods on Achill Island.', 53.9740, -10.0938, '+353 98 43000', 'https://achillwilds.ie' FROM users WHERE email = 'owner104@example.com'
UNION ALL
SELECT id, 'Boyne Valley Glamping', 'Meath', 'Slane', 'GLAMPING', 'Luxurious yurts near Newgrange.', 53.7099, -6.5446, '+353 41 982 0000', 'https://boynebanking.ie' FROM users WHERE email = 'owner105@example.com'
UNION ALL
SELECT id, 'Glendalough Green', 'Wicklow', 'Laragh', 'CAMPSITE', 'Eco-camping in Wicklow Mountains National Park.', 53.0118, -6.2995, '+353 404 45000', 'https://glendaloughgreen.ie' FROM users WHERE email = 'owner106@example.com'
UNION ALL
SELECT id, 'Beara Retreat', 'Cork', 'Castletownbere', 'GLAMPING', 'Remote peninsula glamping with sea views.', 51.6499, -9.9099, '+353 27 70000', 'https://beararetreat.ie' FROM users WHERE email = 'owner107@example.com'
UNION ALL
SELECT id, 'Copper Coast Park', 'Waterford', 'Bunmahon', 'CAMPSITE', 'Geopark camping on the sunny southeast coast.', 52.1466, -7.3698, '+353 51 292000', 'https://coppercoast.ie' FROM users WHERE email = 'owner108@example.com'
UNION ALL
SELECT id, 'Malin Head Camping', 'Donegal', 'Malin Head', 'CAMPSITE', 'Most northerly point of Ireland.', 55.3807, -7.3732, '+353 74 937 0000', 'https://malinhead.ie' FROM users WHERE email = 'owner109@example.com'
UNION ALL
SELECT id, 'Mourne Mountains Camp', 'Down', 'Newcastle', 'CAMPSITE', 'Hiking base for Slieve Donard.', 54.2155, -5.8770, '+44 28 4372 0000', 'https://mournecamp.co.uk' FROM users WHERE email = 'owner110@example.com'
UNION ALL
SELECT id, 'Lough Derg Lakeside', 'Tipperary', 'Ballina', 'CAMPSITE', 'Water sports and lake views.', 52.8090, -8.3444, '+353 61 376 000', 'https://loughderg.ie' FROM users WHERE email = 'owner111@example.com'
UNION ALL
SELECT id, 'Kings Camp Cashel', 'Tipperary', 'Cashel', 'CAMPSITE', 'Views of the historic Rock of Cashel.', 52.5204, -7.8906, '+353 62 61000', 'https://cashelcamping.ie' FROM users WHERE email = 'owner112@example.com'
UNION ALL
SELECT id, 'Valentia Island Pods', 'Kerry', 'Knightstown', 'GLAMPING', 'Dark sky reserve pods.', 51.9249, -10.2882, '+353 66 947 0000', 'https://valentia.ie' FROM users WHERE email = 'owner113@example.com'
UNION ALL
SELECT id, 'Killarney National Park', 'Kerry', 'Killarney', 'CAMPSITE', 'In the heart of the national park.', 52.0599, -9.5044, '+353 64 663 0000', 'https://killarneycamping.ie' FROM users WHERE email = 'owner114@example.com'
UNION ALL
SELECT id, 'Tramore Dunes', 'Waterford', 'Tramore', 'CAMPSITE', 'Family fun near beach and amusements.', 52.1614, -7.1493, '+353 51 381000', 'https://tramoredunes.ie' FROM users WHERE email = 'owner115@example.com'
UNION ALL
SELECT id, 'Strandhill Surf Camp', 'Sligo', 'Strandhill', 'CAMPSITE', 'Surfing hotspot with campsite facilities.', 54.2691, -8.5997, '+353 71 916 0000', 'https://strandhillcamp.ie' FROM users WHERE email = 'owner116@example.com'
UNION ALL
SELECT id, 'Hook Head Lighthouse', 'Wexford', 'Fethard-on-Sea', 'GLAMPING', 'Stay near the oldest operational lighthouse.', 52.1246, -6.9304, '+353 51 397000', 'https://hookheadglamping.ie' FROM users WHERE email = 'owner117@example.com'
UNION ALL
SELECT id, 'Slea Head Drive', 'Kerry', 'Ventry', 'CAMPSITE', 'Scenic camping on the Dingle Peninsula.', 52.1077, -10.3705, '+353 66 915 9000', 'https://sleahead.ie' FROM users WHERE email = 'owner118@example.com'
UNION ALL
SELECT id, 'Aran View Doolin', 'Clare', 'Doolin', 'CAMPSITE', 'Views of Aran Islands and Cliffs of Moher.', 53.0163, -9.3804, '+353 65 707 0000', 'https://aranviewDoolin.ie' FROM users WHERE email = 'owner119@example.com'
UNION ALL
SELECT id, 'Carlingford Adventure', 'Louth', 'Carlingford', 'GLAMPING', 'Adventure sports and medieval town.', 54.0396, -6.1868, '+353 42 937 0000', 'https://carlingford.ie' FROM users WHERE email = 'owner120@example.com'
UNION ALL
SELECT id, 'Bantry Bay Camping', 'Cork', 'Bantry', 'CAMPSITE', 'Sheltered bay camping in West Cork.', 51.6833, -9.4500, '+353 27 50000', 'https://bantrycamping.ie' FROM users WHERE email = 'owner121@example.com'
UNION ALL
SELECT id, 'Killary Fjord Camp', 'Galway', 'Leenane', 'CAMPSITE', 'Ireland''s only fjord.', 53.5939, -9.6974, '+353 95 42000', 'https://killary.ie' FROM users WHERE email = 'owner122@example.com'
UNION ALL
SELECT id, 'Slieve Bloom Mountains', 'Laois', 'Mountrath', 'CAMPSITE', 'Mountain biking and hiking centre.', 53.0500, -7.5500, '+353 57 873 0000', 'https://slievebloom.ie' FROM users WHERE email = 'owner123@example.com'
UNION ALL
SELECT id, 'Lough Ree East', 'Westmeath', 'Athlone', 'CAMPSITE', 'Hidden heartlands camping by the lake.', 53.4667, -7.9000, '+353 90 647 0000', 'https://loughree.ie' FROM users WHERE email = 'owner124@example.com'
UNION ALL
SELECT id, 'Clonmacnoise Camp', 'Offaly', 'Shannonbridge', 'CAMPSITE', 'Near ancient monastic site.', 53.3263, -7.9860, '+353 90 967 0000', 'https://clonmacnoise.ie' FROM users WHERE email = 'owner125@example.com'
UNION ALL
SELECT id, 'Galtee Views', 'Tipperary', 'Cahir', 'CAMPSITE', 'Mountain climbing base.', 52.3750, -8.0000, '+353 52 744 0000', 'https://galtee.ie' FROM users WHERE email = 'owner126@example.com'
UNION ALL
SELECT id, 'Mulranny Park', 'Mayo', 'Mulranny', 'GLAMPING', 'Access to Great Western Greenway.', 53.9000, -9.8000, '+353 98 36000', 'https://mulranny.ie' FROM users WHERE email = 'owner127@example.com'
UNION ALL
SELECT id, 'Black Valley Wild', 'Kerry', 'Beaufort', 'CAMPSITE', 'Remote valley in MacGillycuddy Reeks.', 51.9833, -9.7000, '+353 64 664 0000', 'https://blackvalley.ie' FROM users WHERE email = 'owner128@example.com'
UNION ALL
SELECT id, 'Glenveagh National Park', 'Donegal', 'Letterkenny', 'CAMPSITE', 'Near castle and gardens.', 55.0333, -8.0500, '+353 74 913 0000', 'https://glenveagh.ie' FROM users WHERE email = 'owner129@example.com'
UNION ALL
SELECT id, 'Errigal View', 'Donegal', 'Gweedore', 'CAMPSITE', 'Foot of Mount Errigal.', 55.0500, -8.1167, '+353 74 953 0000', 'https://errigal.ie' FROM users WHERE email = 'owner130@example.com'
UNION ALL
SELECT id, 'Spanish Point', 'Clare', 'Miltown Malbay', 'CAMPSITE', 'Atlantic views and history.', 52.8500, -9.4500, '+353 65 708 0000', 'https://spanishpoint.ie' FROM users WHERE email = 'owner131@example.com'
UNION ALL
SELECT id, 'Kilkee Cliff Pods', 'Clare', 'Kilkee', 'GLAMPING', 'Dramatic cliffs and pollock holes.', 52.6833, -9.6500, '+353 65 905 0000', 'https://kilkeepods.ie' FROM users WHERE email = 'owner132@example.com'
UNION ALL
SELECT id, 'Lough Erne Resort', 'Fermanagh', 'Enniskillen', 'GLAMPING', 'Lakeland luxury.', 54.4000, -7.7000, '+44 28 6632 0000', 'https://lougherne.ie' FROM users WHERE email = 'owner133@example.com'
UNION ALL
SELECT id, 'Clew Bay Islands', 'Mayo', 'Westport', 'CAMPSITE', 'Island hopping base.', 53.8000, -9.6000, '+353 98 25000', 'https://clewbay.ie' FROM users WHERE email = 'owner134@example.com'
UNION ALL
SELECT id, 'Tara Hill Estate', 'Wexford', 'Gorey', 'GLAMPING', 'Sea and hill views.', 52.6833, -6.2167, '+353 53 942 0000', 'https://tarahill.ie' FROM users WHERE email = 'owner135@example.com'
UNION ALL
SELECT id, 'Powerscourt Camping', 'Wicklow', 'Enniskerry', 'CAMPSITE', 'Near waterfall and gardens.', 53.1833, -6.1833, '+353 1 286 0000', 'https://powerscourt.ie' FROM users WHERE email = 'owner136@example.com'
UNION ALL
SELECT id, 'Brittas Bay Beach', 'Wicklow', 'Wicklow Town', 'CAMPSITE', 'Popular beach holiday spot.', 52.8833, -6.0667, '+353 404 67000', 'https://brittasbay.ie' FROM users WHERE email = 'owner137@example.com'
UNION ALL
SELECT id, 'Rosslare Harbour Camp', 'Wexford', 'Rosslare', 'CAMPSITE', 'Ferry port stopover.', 52.2500, -6.3333, '+353 53 913 0000', 'https://rosslare.ie' FROM users WHERE email = 'owner138@example.com'
UNION ALL
SELECT id, 'Youghal Beach Resort', 'Cork', 'Youghal', 'CAMPSITE', 'Historic walled town and beaches.', 51.9500, -7.8500, '+353 24 92000', 'https://youghal.ie' FROM users WHERE email = 'owner139@example.com'
UNION ALL
SELECT id, 'Cobh Harbour View', 'Cork', 'Cobh', 'CAMPSITE', 'Titanic history and huge liners.', 51.8500, -8.3000, '+353 21 481 0000', 'https://cobh.ie' FROM users WHERE email = 'owner140@example.com'
UNION ALL
SELECT id, 'Blarney Castle Camp', 'Cork', 'Blarney', 'CAMPSITE', 'Kiss the stone.', 51.9333, -8.5667, '+353 21 438 0000', 'https://blarney.ie' FROM users WHERE email = 'owner141@example.com'
UNION ALL
SELECT id, 'Fota Island Wildlife', 'Cork', 'Carrigtwohill', 'GLAMPING', 'Near wildlife park and arboretum.', 51.8833, -8.3000, '+353 21 488 0000', 'https://fota.ie' FROM users WHERE email = 'owner142@example.com'
UNION ALL
SELECT id, 'Mizen Head Signal', 'Cork', 'Goleen', 'CAMPSITE', 'Southwest tip.', 51.4500, -9.8167, '+353 28 35000', 'https://mizen.ie' FROM users WHERE email = 'owner143@example.com'
UNION ALL
SELECT id, 'Sheep''s Head Way', 'Cork', 'Durrus', 'CAMPSITE', 'Walking route base.', 51.5833, -9.5167, '+353 27 61000', 'https://sheepshead.ie' FROM users WHERE email = 'owner144@example.com'
UNION ALL
SELECT id, 'Cape Clear Island', 'Cork', 'Baltimore', 'GLAMPING', 'Gaeltacht island experience.', 51.4333, -9.5000, '+353 28 39000', 'https://capeclear.ie' FROM users WHERE email = 'owner145@example.com'
UNION ALL
SELECT id, 'Sherkin Island Camp', 'Cork', 'Baltimore', 'CAMPSITE', 'Arts and beaches.', 51.4667, -9.4167, '+353 28 20000', 'https://sherkin.ie' FROM users WHERE email = 'owner146@example.com'
UNION ALL
SELECT id, 'Garnish Island View', 'Cork', 'Glengarriff', 'CAMPSITE', 'Near Italian gardens.', 51.7500, -9.5500, '+353 27 63000', 'https://garnish.ie' FROM users WHERE email = 'owner147@example.com'
UNION ALL
SELECT id, 'Gougane Barra Forest', 'Cork', 'Ballingeary', 'CAMPSITE', 'Source of River Lee.', 51.8333, -9.3333, '+353 26 40000', 'https://gougane.ie' FROM users WHERE email = 'owner148@example.com'
UNION ALL
SELECT id, 'Dunmore East Clifftop', 'Waterford', 'Dunmore East', 'CAMPSITE', 'Fishing village charm.', 52.1500, -6.9833, '+353 51 383000', 'https://dunmore.ie' FROM users WHERE email = 'owner149@example.com'
UNION ALL
SELECT id, 'Waterford Greenway Start', 'Waterford', 'Waterford City', 'CAMPSITE', 'Cycle route base.', 52.2500, -7.1167, '+353 51 870000', 'https://greenway.ie' FROM users WHERE email = 'owner150@example.com';

-- 3. Lots for new campsites (Generic, 2-3 per campsite)
-- Insert standard lots for each new owner found by email
INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, is_active, image_url)
SELECT o.id, 'Standard Pitch', 'TENT', 'Grass pitch for tent.', 25.00, 4, TRUE, '/images/lots/generic-tent.jpg'
FROM owners o JOIN users u ON o.user_id = u.id WHERE u.email LIKE 'owner1%@example.com';

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, is_active, image_url)
SELECT o.id, 'Electric Pitch', 'CAMPERVAN', 'Hardstanding with electric.', 35.00, 4, TRUE, '/images/lots/generic-camper.jpg'
FROM owners o JOIN users u ON o.user_id = u.id WHERE u.email LIKE 'owner1%@example.com';

INSERT INTO lots (owner_id, name, lot_type, description, price_per_night, max_guests, is_active, image_url)
SELECT o.id, 'Glamping Pod', 'POD', 'Cozy pod with bed.', 80.00, 2, TRUE, '/images/lots/generic-pod.jpg'
FROM owners o JOIN users u ON o.user_id = u.id WHERE u.email LIKE 'owner1%@example.com';
