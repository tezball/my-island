CREATE TABLE points_of_interest (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(255)    NOT NULL,
    description     TEXT,
    category        VARCHAR(50)     NOT NULL,
    latitude        DOUBLE PRECISION NOT NULL,
    longitude       DOUBLE PRECISION NOT NULL,
    county          VARCHAR(100),
    town            VARCHAR(100),
    difficulty      VARCHAR(20),
    distance_km     DOUBLE PRECISION,
    image_url       VARCHAR(500),
    website_url     VARCHAR(500),
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pois_category ON points_of_interest (category);
CREATE INDEX idx_pois_county ON points_of_interest (county);
CREATE INDEX idx_pois_lat_lng ON points_of_interest (latitude, longitude);
