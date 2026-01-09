-- V10: Fix campsite and lot image URLs
-- Replace Unsplash URLs with reliable picsum.photos placeholders
-- picsum.photos is a reliable Lorem Picsum service that always works

-- Update campsite images to use picsum.photos with camping/nature themed seeds
-- Using consistent seed numbers so images are deterministic

-- Wild Atlantic Glamping (c0000000-0000-0000-0000-000000000001)
UPDATE campsite_images SET image_url = 'https://picsum.photos/seed/camp1a/800/600' WHERE campsite_id = 'c0000000-0000-0000-0000-000000000001' AND image_url LIKE '%unsplash%' LIMIT 1;
DELETE FROM campsite_images WHERE campsite_id = 'c0000000-0000-0000-0000-000000000001' AND image_url LIKE '%unsplash%';
INSERT INTO campsite_images (campsite_id, image_url) VALUES
('c0000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/camp1a/800/600'),
('c0000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/camp1b/800/600'),
('c0000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/camp1c/800/600')
ON CONFLICT DO NOTHING;

-- Donegal Coastal Camp (c0000000-0000-0000-0000-000000000002)
DELETE FROM campsite_images WHERE campsite_id = 'c0000000-0000-0000-0000-000000000002';
INSERT INTO campsite_images (campsite_id, image_url) VALUES
('c0000000-0000-0000-0000-000000000002', 'https://picsum.photos/seed/camp2a/800/600'),
('c0000000-0000-0000-0000-000000000002', 'https://picsum.photos/seed/camp2b/800/600'),
('c0000000-0000-0000-0000-000000000002', 'https://picsum.photos/seed/camp2c/800/600');

-- Sligo Surf Camp (c0000000-0000-0000-0000-000000000003)
DELETE FROM campsite_images WHERE campsite_id = 'c0000000-0000-0000-0000-000000000003';
INSERT INTO campsite_images (campsite_id, image_url) VALUES
('c0000000-0000-0000-0000-000000000003', 'https://picsum.photos/seed/camp3a/800/600'),
('c0000000-0000-0000-0000-000000000003', 'https://picsum.photos/seed/camp3b/800/600'),
('c0000000-0000-0000-0000-000000000003', 'https://picsum.photos/seed/camp3c/800/600');

-- Galway Bay Guesthouse (c0000000-0000-0000-0000-000000000004)
DELETE FROM campsite_images WHERE campsite_id = 'c0000000-0000-0000-0000-000000000004';
INSERT INTO campsite_images (campsite_id, image_url) VALUES
('c0000000-0000-0000-0000-000000000004', 'https://picsum.photos/seed/camp4a/800/600'),
('c0000000-0000-0000-0000-000000000004', 'https://picsum.photos/seed/camp4b/800/600'),
('c0000000-0000-0000-0000-000000000004', 'https://picsum.photos/seed/camp4c/800/600');

-- Connemara Retreat (c0000000-0000-0000-0000-000000000005)
DELETE FROM campsite_images WHERE campsite_id = 'c0000000-0000-0000-0000-000000000005';
INSERT INTO campsite_images (campsite_id, image_url) VALUES
('c0000000-0000-0000-0000-000000000005', 'https://picsum.photos/seed/camp5a/800/600'),
('c0000000-0000-0000-0000-000000000005', 'https://picsum.photos/seed/camp5b/800/600'),
('c0000000-0000-0000-0000-000000000005', 'https://picsum.photos/seed/camp5c/800/600');

-- West Cork Eco Retreat (c0000000-0000-0000-0000-000000000006)
DELETE FROM campsite_images WHERE campsite_id = 'c0000000-0000-0000-0000-000000000006';
INSERT INTO campsite_images (campsite_id, image_url) VALUES
('c0000000-0000-0000-0000-000000000006', 'https://picsum.photos/seed/camp6a/800/600'),
('c0000000-0000-0000-0000-000000000006', 'https://picsum.photos/seed/camp6b/800/600'),
('c0000000-0000-0000-0000-000000000006', 'https://picsum.photos/seed/camp6c/800/600');

-- Wicklow Woodland Camp (c0000000-0000-0000-0000-000000000007)
DELETE FROM campsite_images WHERE campsite_id = 'c0000000-0000-0000-0000-000000000007';
INSERT INTO campsite_images (campsite_id, image_url) VALUES
('c0000000-0000-0000-0000-000000000007', 'https://picsum.photos/seed/camp7a/800/600'),
('c0000000-0000-0000-0000-000000000007', 'https://picsum.photos/seed/camp7b/800/600'),
('c0000000-0000-0000-0000-000000000007', 'https://picsum.photos/seed/camp7c/800/600');

-- Ring of Kerry Glamping (c0000000-0000-0000-0000-000000000008)
DELETE FROM campsite_images WHERE campsite_id = 'c0000000-0000-0000-0000-000000000008';
INSERT INTO campsite_images (campsite_id, image_url) VALUES
('c0000000-0000-0000-0000-000000000008', 'https://picsum.photos/seed/camp8a/800/600'),
('c0000000-0000-0000-0000-000000000008', 'https://picsum.photos/seed/camp8b/800/600'),
('c0000000-0000-0000-0000-000000000008', 'https://picsum.photos/seed/camp8c/800/600');

-- Clifden Eco Camp (c0000000-0000-0000-0000-000000000009)
DELETE FROM campsite_images WHERE campsite_id = 'c0000000-0000-0000-0000-000000000009';
INSERT INTO campsite_images (campsite_id, image_url) VALUES
('c0000000-0000-0000-0000-000000000009', 'https://picsum.photos/seed/camp9a/800/600'),
('c0000000-0000-0000-0000-000000000009', 'https://picsum.photos/seed/camp9b/800/600'),
('c0000000-0000-0000-0000-000000000009', 'https://picsum.photos/seed/camp9c/800/600');

-- Roundstone Harbour View (c0000000-0000-0000-0000-000000000010)
DELETE FROM campsite_images WHERE campsite_id = 'c0000000-0000-0000-0000-000000000010';
INSERT INTO campsite_images (campsite_id, image_url) VALUES
('c0000000-0000-0000-0000-000000000010', 'https://picsum.photos/seed/camp10a/800/600'),
('c0000000-0000-0000-0000-000000000010', 'https://picsum.photos/seed/camp10b/800/600'),
('c0000000-0000-0000-0000-000000000010', 'https://picsum.photos/seed/camp10c/800/600');

-- Burren Camping (c0000000-0000-0000-0000-000000000011)
DELETE FROM campsite_images WHERE campsite_id = 'c0000000-0000-0000-0000-000000000011';
INSERT INTO campsite_images (campsite_id, image_url) VALUES
('c0000000-0000-0000-0000-000000000011', 'https://picsum.photos/seed/camp11a/800/600'),
('c0000000-0000-0000-0000-000000000011', 'https://picsum.photos/seed/camp11b/800/600'),
('c0000000-0000-0000-0000-000000000011', 'https://picsum.photos/seed/camp11c/800/600');

-- Dingle Peninsula B&B (c0000000-0000-0000-0000-000000000012)
DELETE FROM campsite_images WHERE campsite_id = 'c0000000-0000-0000-0000-000000000012';
INSERT INTO campsite_images (campsite_id, image_url) VALUES
('c0000000-0000-0000-0000-000000000012', 'https://picsum.photos/seed/camp12a/800/600'),
('c0000000-0000-0000-0000-000000000012', 'https://picsum.photos/seed/camp12b/800/600'),
('c0000000-0000-0000-0000-000000000012', 'https://picsum.photos/seed/camp12c/800/600');

-- Giant's Causeway Camp (c0000000-0000-0000-0000-000000000013)
DELETE FROM campsite_images WHERE campsite_id = 'c0000000-0000-0000-0000-000000000013';
INSERT INTO campsite_images (campsite_id, image_url) VALUES
('c0000000-0000-0000-0000-000000000013', 'https://picsum.photos/seed/camp13a/800/600'),
('c0000000-0000-0000-0000-000000000013', 'https://picsum.photos/seed/camp13b/800/600'),
('c0000000-0000-0000-0000-000000000013', 'https://picsum.photos/seed/camp13c/800/600');

-- Update lot images as well
UPDATE lot_images SET image_url = REPLACE(image_url, 'images.unsplash.com/photo-', 'picsum.photos/seed/lot')
WHERE image_url LIKE '%unsplash%';

-- For any remaining Unsplash URLs, replace with picsum
UPDATE lot_images SET image_url = 'https://picsum.photos/seed/lot' || SUBSTRING(image_url FROM '[0-9]+') || '/800/600'
WHERE image_url LIKE '%unsplash%';
