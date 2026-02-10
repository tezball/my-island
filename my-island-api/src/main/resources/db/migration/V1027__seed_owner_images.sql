-- V1027: Seed images for Nore Valley Park (Owner ID 1)
-- These reference files uploaded to LocalStack S3 by localstack-init/init-s3.sh

INSERT INTO entity_images (entity_type, entity_id, s3_key, url, filename, content_type, file_size, display_order, is_primary, alt_text)
VALUES
    ('OWNER', 1, 'owners/seed-nore-valley-hero.jpg',  '/s3/myisland-images/owners/seed-nore-valley-hero.jpg',  'nore-valley-hero.jpg',  'image/jpeg', 113000, 0, true,  'Nore Valley Park - Riverside Campsite'),
    ('OWNER', 1, 'owners/seed-nore-valley-woods.jpg', '/s3/myisland-images/owners/seed-nore-valley-woods.jpg', 'nore-valley-woods.jpg', 'image/jpeg', 113000, 1, false, 'Nore Valley Park - Woodland Walks'),
    ('OWNER', 1, 'owners/seed-nore-valley-farm.jpg',  '/s3/myisland-images/owners/seed-nore-valley-farm.jpg',  'nore-valley-farm.jpg',  'image/jpeg', 90000,  2, false, 'Nore Valley Park - Farm Shop'),
    ('OWNER', 1, 'owners/seed-nore-valley-river.jpg', '/s3/myisland-images/owners/seed-nore-valley-river.jpg', 'nore-valley-river.jpg', 'image/jpeg', 121000, 3, false, 'Nore Valley Park - River Views');
