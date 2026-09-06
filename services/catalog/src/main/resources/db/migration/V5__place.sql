-- Place directory row. partner_id is the unused Chunk 1 seam. No booking columns.
CREATE TABLE place (
  id uuid PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  category_id text NOT NULL REFERENCES category (id),
  county_id text NOT NULL REFERENCES county (id),
  town text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  location geography(Point, 4326),
  published boolean NOT NULL DEFAULT false,
  partner_id uuid,
  price_band text,
  website text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT place_price_band_chk CHECK (
    price_band IS NULL OR price_band IN ('FREE', '1', '2', '3')
  ),
  CONSTRAINT place_lat_chk CHECK (
    latitude IS NULL OR (latitude >= -90 AND latitude <= 90)
  ),
  CONSTRAINT place_lon_chk CHECK (
    longitude IS NULL OR (longitude >= -180 AND longitude <= 180)
  )
);

CREATE TABLE place_facility (
  place_id uuid NOT NULL REFERENCES place (id) ON DELETE CASCADE,
  facility_id text NOT NULL REFERENCES facility (id),
  PRIMARY KEY (place_id, facility_id)
);

CREATE INDEX place_location_gix ON place USING GIST (location);
CREATE INDEX place_category_idx ON place (category_id);
CREATE INDEX place_county_idx ON place (county_id);
CREATE INDEX place_published_idx ON place (published);

CREATE OR REPLACE FUNCTION place_sync_location()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.latitude IS NULL OR NEW.longitude IS NULL THEN
    NEW.location := NULL;
  ELSE
    NEW.location := ST_SetSRID(
      ST_MakePoint(NEW.longitude::double precision, NEW.latitude::double precision),
      4326
    )::geography;
  END IF;
  IF TG_OP = 'UPDATE' THEN
    NEW.updated_at := now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER place_sync_location
BEFORE INSERT OR UPDATE ON place
FOR EACH ROW
EXECUTE FUNCTION place_sync_location();
