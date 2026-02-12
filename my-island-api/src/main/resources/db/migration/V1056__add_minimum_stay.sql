-- Add minimum stay column to lots
ALTER TABLE lots ADD COLUMN min_stay INTEGER NOT NULL DEFAULT 1;

-- Add minimum stay override column to seasonal pricing rules
ALTER TABLE seasonal_pricing_rules ADD COLUMN min_stay INTEGER;
