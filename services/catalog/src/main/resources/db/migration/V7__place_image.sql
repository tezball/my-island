-- Hero image for a Place (Commons URL + credit + licence). Nullable.
ALTER TABLE place ADD COLUMN image_url text;
ALTER TABLE place ADD COLUMN image_credit text;
ALTER TABLE place ADD COLUMN image_licence text;
