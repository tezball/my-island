-- V1026: Add latitude and longitude to suppliers table
ALTER TABLE suppliers
ADD COLUMN latitude DOUBLE PRECISION,
ADD COLUMN longitude DOUBLE PRECISION;
