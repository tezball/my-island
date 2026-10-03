-- Host is a role on app_user. A Stay is a new place, not a claim on a POI.
CREATE TABLE host_role (
  user_id uuid PRIMARY KEY REFERENCES app_user (id) ON DELETE CASCADE,
  banned boolean NOT NULL DEFAULT false,
  ban_reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE stay (
  id uuid PRIMARY KEY,
  host_user_id uuid NOT NULL REFERENCES app_user (id) ON DELETE CASCADE,
  kind text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  cost_eur numeric(10, 2),
  phone text,
  email text,
  website text,
  latitude numeric(9, 6) NOT NULL,
  longitude numeric(9, 6) NOT NULL,
  location geography(Point, 4326),
  county_id text REFERENCES county (id),
  status text NOT NULL,
  review_outcome text,
  review_feedback text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT stay_kind_chk CHECK (
    kind IN ('campsite', 'bed and breakfast', 'apartment', 'glamping', 'lodge')
  ),
  CONSTRAINT stay_status_chk CHECK (status IN ('submitted', 'public', 'hidden')),
  CONSTRAINT stay_review_chk CHECK (
    review_outcome IS NULL OR review_outcome IN ('pass', 'fail')
  ),
  CONSTRAINT stay_public_chk CHECK (
    status <> 'public' OR review_outcome = 'pass'
  ),
  CONSTRAINT stay_submitted_chk CHECK (
    status <> 'submitted' OR review_outcome IS NULL
  ),
  CONSTRAINT stay_cost_chk CHECK (cost_eur IS NULL OR cost_eur >= 0),
  CONSTRAINT stay_lat_chk CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT stay_lon_chk CHECK (longitude >= -180 AND longitude <= 180)
);

CREATE TABLE stay_image (
  id uuid PRIMARY KEY,
  stay_id uuid NOT NULL REFERENCES stay (id) ON DELETE CASCADE,
  position integer NOT NULL,
  content_type text NOT NULL,
  width integer NOT NULL,
  height integer NOT NULL,
  bytes bytea NOT NULL,
  CONSTRAINT stay_image_position_chk CHECK (position >= 0 AND position < 8),
  CONSTRAINT stay_image_position_unique UNIQUE (stay_id, position)
);

CREATE INDEX stay_host_idx ON stay (host_user_id);
CREATE INDEX stay_status_idx ON stay (status);
CREATE INDEX stay_location_gix ON stay USING GIST (location);

CREATE OR REPLACE FUNCTION stay_sync_location()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.location := ST_SetSRID(
    ST_MakePoint(NEW.longitude::double precision, NEW.latitude::double precision),
    4326
  )::geography;
  IF TG_OP = 'UPDATE' THEN
    NEW.updated_at := now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER stay_sync_location
BEFORE INSERT OR UPDATE OF latitude, longitude ON stay
FOR EACH ROW
EXECUTE FUNCTION stay_sync_location();
