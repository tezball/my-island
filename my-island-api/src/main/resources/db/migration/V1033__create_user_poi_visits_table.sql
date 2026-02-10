CREATE TABLE user_poi_visits (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    poi_id      BIGINT      NOT NULL REFERENCES points_of_interest(id) ON DELETE CASCADE,
    status      VARCHAR(20) NOT NULL,
    visited_at  TIMESTAMP,
    notes       TEXT,
    created_at  TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP   NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_user_poi UNIQUE (user_id, poi_id)
);

CREATE INDEX idx_user_poi_visits_user ON user_poi_visits (user_id);
CREATE INDEX idx_user_poi_visits_status ON user_poi_visits (user_id, status);
