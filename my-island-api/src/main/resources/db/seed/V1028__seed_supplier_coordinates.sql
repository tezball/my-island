-- Seed realistic Irish coordinates for all existing suppliers

-- V999 suppliers (user_id 15-35)
UPDATE suppliers SET latitude = 52.5293, longitude = -7.1377 WHERE user_id = 15; -- Green Acres Farm Shop, Thomastown, Kilkenny
UPDATE suppliers SET latitude = 53.0176, longitude = -9.3731 WHERE user_id = 16; -- Wild Water Kayaks, Doolin, Clare
UPDATE suppliers SET latitude = 53.4883, longitude = -10.0212 WHERE user_id = 17; -- Atlantic Trail Cycles, Clifden, Galway
UPDATE suppliers SET latitude = 53.4076, longitude = -10.0904 WHERE user_id = 18; -- Connemara Pony Treks, Ballyconneely, Galway
UPDATE suppliers SET latitude = 52.9376, longitude = -9.3498 WHERE user_id = 19; -- Lahinch Surf School, Lahinch, Clare
UPDATE suppliers SET latitude = 53.4303, longitude = -9.3184 WHERE user_id = 20; -- Corrib Fishing Guides, Oughterard, Galway
UPDATE suppliers SET latitude = 51.6349, longitude = -9.5619 WHERE user_id = 21; -- Durrus Farmhouse Cheese, Durrus, Cork
UPDATE suppliers SET latitude = 52.1453, longitude = -9.8787 WHERE user_id = 22; -- Annascaul Bakery, Annascaul, Kerry
UPDATE suppliers SET latitude = 53.0176, longitude = -9.3731 WHERE user_id = 23; -- O'Connors Traditional Pub, Doolin, Clare
UPDATE suppliers SET latitude = 53.1097, longitude = -9.6601 WHERE user_id = 24; -- Aran Islands Knitwear, Inis Mor, Galway
UPDATE suppliers SET latitude = 53.8010, longitude = -9.5222 WHERE user_id = 25; -- Westport Pottery Studio, Westport, Mayo
UPDATE suppliers SET latitude = 52.1409, longitude = -10.2886 WHERE user_id = 26; -- Dingle Distillery Tours, Dingle, Kerry
UPDATE suppliers SET latitude = 51.8216, longitude = -10.2681 WHERE user_id = 27; -- Skelligs Chocolate Factory, Ballinskelligs, Kerry
UPDATE suppliers SET latitude = 53.1187, longitude = -9.2790 WHERE user_id = 28; -- Wild Irish Seaweed Co, Fanore, Clare
UPDATE suppliers SET latitude = 52.1273, longitude = -10.4587 WHERE user_id = 29; -- Blasket Island Ferries, Dunquin, Kerry
UPDATE suppliers SET latitude = 53.0805, longitude = -9.0616 WHERE user_id = 30; -- Burren Yoga Retreats, Ballyvaughan, Clare
UPDATE suppliers SET latitude = 53.5345, longitude = -9.2820 WHERE user_id = 31; -- Irish Hawking Club, Cong, Galway
UPDATE suppliers SET latitude = 52.9376, longitude = -9.3498 WHERE user_id = 32; -- Lahinch Golf Club, Lahinch, Clare
UPDATE suppliers SET latitude = 51.7061, longitude = -8.5305 WHERE user_id = 33; -- Kinsale Seafood Restaurant, Kinsale, Cork
UPDATE suppliers SET latitude = 53.2719, longitude = -9.0489 WHERE user_id = 34; -- Badger & Dodo Coffee, Galway City, Galway
UPDATE suppliers SET latitude = 52.5011, longitude = -6.5669 WHERE user_id = 35; -- Woodland Spa & Wellness, Enniscorthy, Wexford

-- V1008 supplier (Dingle Kayak Adventures)
UPDATE suppliers SET latitude = 52.1409, longitude = -10.2886
WHERE user_id = (SELECT id FROM users WHERE email = 'hello@dinglekayak.ie');

-- V1009 supplier (Aillwee Farm Shop & Cheese)
UPDATE suppliers SET latitude = 53.0805, longitude = -9.0616
WHERE user_id = (SELECT id FROM users WHERE email = 'info@aillweefarmshop.ie');
