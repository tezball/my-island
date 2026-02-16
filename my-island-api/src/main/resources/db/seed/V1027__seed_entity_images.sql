-- V1027: Seed images for testing
-- Files are copied to uploads/ by SeedImageCopier on startup (dev profile)

INSERT INTO entity_images (entity_type, entity_id, s3_key, url, filename, content_type, file_size, display_order, is_primary, alt_text)
VALUES
    -- =============================================
    -- OWNER images (property hero/gallery photos)
    -- =============================================

    -- Owner 1: Nore Valley Park (4 images)
    ('OWNER', 1, 'owners/1/seed-nore-valley-hero.jpg',  '/api/uploads/owners/1/seed-nore-valley-hero.jpg',  'nore-valley-hero.jpg',  'image/jpeg', 113000, 0, true,  'Nore Valley Park - Riverside Campsite'),
    ('OWNER', 1, 'owners/1/seed-nore-valley-woods.jpg', '/api/uploads/owners/1/seed-nore-valley-woods.jpg', 'nore-valley-woods.jpg', 'image/jpeg', 113000, 1, false, 'Nore Valley Park - Woodland Walks'),
    ('OWNER', 1, 'owners/1/seed-nore-valley-farm.jpg',  '/api/uploads/owners/1/seed-nore-valley-farm.jpg',  'nore-valley-farm.jpg',  'image/jpeg', 90000,  2, false, 'Nore Valley Park - Farm Shop'),
    ('OWNER', 1, 'owners/1/seed-nore-valley-river.jpg', '/api/uploads/owners/1/seed-nore-valley-river.jpg', 'nore-valley-river.jpg', 'image/jpeg', 121000, 3, false, 'Nore Valley Park - River Views'),

    -- Owner 2: Wild Atlantic Glamping (2 images)
    ('OWNER', 2, 'owners/2/seed-coast.jpg',  '/api/uploads/owners/2/seed-coast.jpg',  'coast.jpg',  'image/jpeg', 50000, 0, true,  'Wild Atlantic Glamping - Coastal Views'),
    ('OWNER', 2, 'owners/2/seed-sunset.jpg', '/api/uploads/owners/2/seed-sunset.jpg', 'sunset.jpg', 'image/jpeg', 55000, 1, false, 'Wild Atlantic Glamping - Sunset Over the Atlantic'),

    -- Owner 3: Lakeside Retreat (2 images)
    ('OWNER', 3, 'owners/3/seed-lake.jpg',  '/api/uploads/owners/3/seed-lake.jpg',  'lake.jpg',  'image/jpeg', 65000, 0, true,  'Lakeside Retreat - Lake at Dawn'),
    ('OWNER', 3, 'owners/3/seed-river.jpg', '/api/uploads/owners/3/seed-river.jpg', 'river.jpg', 'image/jpeg', 48000, 1, false, 'Lakeside Retreat - River Walk'),

    -- Owner 4: Clifden Eco Camp (2 images)
    ('OWNER', 4, 'owners/4/seed-green.jpg',    '/api/uploads/owners/4/seed-green.jpg',    'green.jpg',    'image/jpeg', 94000,  0, true,  'Clifden Eco Camp - Green Surroundings'),
    ('OWNER', 4, 'owners/4/seed-mountain.jpg', '/api/uploads/owners/4/seed-mountain.jpg', 'mountain.jpg', 'image/jpeg', 134000, 1, false, 'Clifden Eco Camp - Mountain Backdrop'),

    -- Owner 5: Dingle Peninsula Camping (2 images)
    ('OWNER', 5, 'owners/5/seed-field.jpg', '/api/uploads/owners/5/seed-field.jpg', 'field.jpg', 'image/jpeg', 62000, 0, true,  'Dingle Peninsula Camping - Open Fields'),
    ('OWNER', 5, 'owners/5/seed-hills.jpg', '/api/uploads/owners/5/seed-hills.jpg', 'hills.jpg', 'image/jpeg', 51000, 1, false, 'Dingle Peninsula Camping - Rolling Hills'),

    -- Owner 6: Wicklow Hills Hideaway
    ('OWNER', 6, 'owners/6/seed-forest.jpg', '/api/uploads/owners/6/seed-forest.jpg', 'forest.jpg', 'image/jpeg', 138000, 0, true, 'Wicklow Hills Hideaway - Forest Setting'),

    -- Owner 7: Donegal Wild Camping
    ('OWNER', 7, 'owners/7/seed-meadow.jpg', '/api/uploads/owners/7/seed-meadow.jpg', 'meadow.jpg', 'image/jpeg', 68000, 0, true, 'Donegal Wild Camping - Meadow Views'),

    -- Owner 8: West Cork Hideaway
    ('OWNER', 8, 'owners/8/seed-trees.jpg', '/api/uploads/owners/8/seed-trees.jpg', 'trees.jpg', 'image/jpeg', 31000, 0, true, 'West Cork Hideaway - Ancient Woodland'),

    -- Owner 9: Burren Basecamp
    ('OWNER', 9, 'owners/9/seed-tents.jpg', '/api/uploads/owners/9/seed-tents.jpg', 'tents.jpg', 'image/jpeg', 113000, 0, true, 'Burren Basecamp - Tents at Sunset'),

    -- =============================================
    -- LOT images (individual pitch/unit photos)
    -- =============================================

    -- Nore Valley lots
    ('LOT', 1, 'lots/1/seed-tent.jpg', '/api/uploads/lots/1/seed-tent.jpg', 'tent.jpg', 'image/jpeg', 34000, 0, true,  'Riverside Pitch 1 - Tent Spot'),
    ('LOT', 2, 'lots/2/seed-tent.jpg', '/api/uploads/lots/2/seed-tent.jpg', 'tent.jpg', 'image/jpeg', 34000, 0, true,  'Riverside Pitch 2 - Tent Spot'),
    ('LOT', 3, 'lots/3/seed-tent.jpg', '/api/uploads/lots/3/seed-tent.jpg', 'tent.jpg', 'image/jpeg', 34000, 0, true,  'Riverside Pitch 3 - Tent Spot'),
    ('LOT', 4, 'lots/4/seed-touring.jpg', '/api/uploads/lots/4/seed-touring.jpg', 'touring.jpg', 'image/jpeg', 86000, 0, true, 'Hardstanding A - Touring Pitch'),
    ('LOT', 5, 'lots/5/seed-touring.jpg', '/api/uploads/lots/5/seed-touring.jpg', 'touring.jpg', 'image/jpeg', 86000, 0, true, 'Hardstanding B - Touring Pitch'),
    ('LOT', 6, 'lots/6/seed-pitch.jpg',   '/api/uploads/lots/6/seed-pitch.jpg',   'pitch.jpg',   'image/jpeg', 55000, 0, true, 'Hardstanding C - All-Weather Pitch'),
    ('LOT', 7, 'lots/7/seed-glamping.jpg', '/api/uploads/lots/7/seed-glamping.jpg', 'glamping.jpg', 'image/jpeg', 77000, 0, true, 'Woodland Bell Tent - Glamping Experience'),
    ('LOT', 8, 'lots/8/seed-cabin.jpg',    '/api/uploads/lots/8/seed-cabin.jpg',    'cabin.jpg',    'image/jpeg', 111000, 0, true, 'Treehouse Retreat - Cabin in the Woods'),

    -- Wild Atlantic Glamping lot
    ('LOT', 9, 'lots/9/seed-coast.jpg', '/api/uploads/lots/9/seed-coast.jpg', 'coast.jpg', 'image/jpeg', 50000, 0, true, 'Atlantic View Pod - Coastal Glamping'),

    -- Clifden Eco Camp lot with second image
    ('LOT', 10, 'lots/10/seed-glamping.jpg', '/api/uploads/lots/10/seed-glamping.jpg', 'glamping.jpg', 'image/jpeg', 77000, 0, true, 'Eco Yurt - Sustainable Glamping'),

    -- Lakeside Retreat lot
    ('LOT', 15, 'lots/15/seed-lake.jpg', '/api/uploads/lots/15/seed-lake.jpg', 'lake.jpg', 'image/jpeg', 65000, 0, true, 'Waterfront Pitch - Lake Views'),

    -- Clifden Eco Camp lot
    ('LOT', 20, 'lots/20/seed-mountain.jpg', '/api/uploads/lots/20/seed-mountain.jpg', 'mountain.jpg', 'image/jpeg', 134000, 0, true, 'Mountain View Pitch - Twelve Bens'),

    -- Mobile home lot
    ('LOT', 25, 'lots/25/seed-mobile.jpg', '/api/uploads/lots/25/seed-mobile.jpg', 'mobile.jpg', 'image/jpeg', 59000, 0, true, 'Family Mobile Home - Self-Catering'),

    -- =============================================
    -- SUPPLIER images (business profile photos)
    -- =============================================

    ('SUPPLIER', 1,  'suppliers/1/seed-food.jpg',     '/api/uploads/suppliers/1/seed-food.jpg',     'food.jpg',     'image/jpeg', 58000, 0, true, 'Green Acres Farm Shop - Fresh Produce'),
    ('SUPPLIER', 2,  'suppliers/2/seed-activity.jpg',  '/api/uploads/suppliers/2/seed-activity.jpg', 'activity.jpg', 'image/jpeg', 30000, 0, true, 'Wild Water Kayaks - On the Water'),
    ('SUPPLIER', 3,  'suppliers/3/seed-activity.jpg',  '/api/uploads/suppliers/3/seed-activity.jpg', 'activity.jpg', 'image/jpeg', 30000, 0, true, 'Atlantic Trail Cycles - Cycling Adventures'),
    ('SUPPLIER', 5,  'suppliers/5/seed-activity.jpg',  '/api/uploads/suppliers/5/seed-activity.jpg', 'activity.jpg', 'image/jpeg', 30000, 0, true, 'Lahinch Surf School - Catching Waves'),
    ('SUPPLIER', 7,  'suppliers/7/seed-food.jpg',      '/api/uploads/suppliers/7/seed-food.jpg',     'food.jpg',     'image/jpeg', 58000, 0, true, 'Durrus Farmhouse Cheese - Artisan Cheese'),
    ('SUPPLIER', 10, 'suppliers/10/seed-shop.jpg',     '/api/uploads/suppliers/10/seed-shop.jpg',    'shop.jpg',     'image/jpeg', 57000, 0, true, 'Aran Islands Knitwear - Handmade Crafts'),

    -- =============================================
    -- OFFER images (deal/voucher photos)
    -- =============================================

    ('OFFER', 1,  'offers/1/seed-deal.jpg',  '/api/uploads/offers/1/seed-deal.jpg',  'deal.jpg', 'image/jpeg', 46000, 0, true, '10% Off Fresh Produce - Green Acres'),
    ('OFFER', 2,  'offers/2/seed-deal.jpg',  '/api/uploads/offers/2/seed-deal.jpg',  'deal.jpg', 'image/jpeg', 46000, 0, true, 'Free Cheese Tasting - Green Acres'),
    ('OFFER', 52, 'offers/52/seed-deal.jpg', '/api/uploads/offers/52/seed-deal.jpg', 'deal.jpg', 'image/jpeg', 46000, 0, true, 'Artisan Cheese Selection - Aillwee');
