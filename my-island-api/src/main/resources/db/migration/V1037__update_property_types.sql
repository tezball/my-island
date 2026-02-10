-- Align property_type values with the new PropertyType enum:
-- TENT, TOURING, GLAMPING, CABIN, MOBILE_HOME
-- (matches LotType values)

UPDATE owners SET property_type = 'TENT' WHERE property_type = 'CAMPSITE';
UPDATE owners SET property_type = 'TOURING' WHERE property_type = 'HOLIDAY_PARK';
UPDATE owners SET property_type = 'TOURING' WHERE property_type = 'CARAVAN_PARK';
UPDATE owners SET property_type = 'CABIN' WHERE property_type = 'FARM';
UPDATE owners SET property_type = 'CABIN' WHERE property_type = 'WOODLAND';
