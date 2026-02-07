-- Align lot types to standard 5: TENT, TOURING, GLAMPING, CABIN, MOBILE_HOME
-- Migrate old types to their nearest equivalent

-- Drop old constraint first so updates can use new type values
ALTER TABLE lots DROP CONSTRAINT IF EXISTS chk_lot_type;

UPDATE lots SET lot_type = 'TOURING' WHERE lot_type = 'CAMPERVAN';
UPDATE lots SET lot_type = 'CABIN' WHERE lot_type = 'TREEHOUSE';
UPDATE lots SET lot_type = 'GLAMPING' WHERE lot_type = 'YURT';
UPDATE lots SET lot_type = 'GLAMPING' WHERE lot_type = 'POD';

-- Add new constraint with the 5 standard types
ALTER TABLE lots ADD CONSTRAINT chk_lot_type CHECK (lot_type IN ('TENT', 'TOURING', 'GLAMPING', 'CABIN', 'MOBILE_HOME'));
