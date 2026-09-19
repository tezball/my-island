ALTER TABLE app_user ADD COLUMN username TEXT;
ALTER TABLE app_user ADD COLUMN password_hash TEXT;

CREATE UNIQUE INDEX app_user_username_lower_unique
  ON app_user (lower(username))
  WHERE username IS NOT NULL;

CREATE TABLE visit_intent (
  guest_id UUID NOT NULL REFERENCES app_user (id) ON DELETE CASCADE,
  place_id UUID NOT NULL REFERENCES place (id) ON DELETE CASCADE,
  mark TEXT NOT NULL CHECK (mark IN ('been', 'want', 'never')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (guest_id, place_id)
);

CREATE INDEX visit_intent_guest_mark_idx ON visit_intent (guest_id, mark);
CREATE INDEX visit_intent_place_been_idx ON visit_intent (place_id) WHERE mark = 'been';

CREATE TABLE visit_intent_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID NOT NULL,
  place_id UUID NOT NULL,
  old_mark TEXT,
  new_mark TEXT,
  action TEXT NOT NULL CHECK (action IN ('upsert', 'delete')),
  at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX visit_intent_audit_guest_at_idx ON visit_intent_audit (guest_id, at DESC);
