-- Align lot types to standard 5: TENT, TOURING, GLAMPING, CABIN, MOBILE_HOME
-- Migrate old types to their nearest equivalent

UPDATE lots SET lot_type = 'TOURING' WHERE lot_type = 'CAMPERVAN';
UPDATE lots SET lot_type = 'CABIN' WHERE lot_type = 'TREEHOUSE';
UPDATE lots SET lot_type = 'GLAMPING' WHERE lot_type = 'YURT';
UPDATE lots SET lot_type = 'GLAMPING' WHERE lot_type = 'POD';

-- Drop old constraint and add new one with the 5 standard types
ALTER TABLE lots DROP CONSTRAINT IF EXISTS chk_lot_type;
ALTER TABLE lots ADD CONSTRAINT chk_lot_type CHECK (lot_type IN ('TENT', 'TOURING', 'GLAMPING', 'CABIN', 'MOBILE_HOME'));
