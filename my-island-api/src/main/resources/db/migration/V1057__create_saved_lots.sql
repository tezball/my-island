CREATE TABLE saved_lots (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lot_id BIGINT NOT NULL REFERENCES lots(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, lot_id)
);

CREATE INDEX idx_saved_lots_user ON saved_lots(user_id);
