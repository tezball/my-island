-- Visit schema stub only. No Visit HTTP API on this ticket.
-- visit_type is not a boolean. date_precision is stored explicitly.
-- user_id is an unenforced UUID (User table deferred).
CREATE TABLE visit (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL,
  place_id uuid NOT NULL REFERENCES place (id),
  visit_type text NOT NULL,
  occurred_on date,
  date_precision text NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  synced_at timestamptz,
  CONSTRAINT visit_type_chk CHECK (visit_type IN ('VISITED', 'STAYED')),
  CONSTRAINT visit_precision_chk CHECK (
    date_precision IN ('DAY', 'MONTH', 'YEAR', 'UNKNOWN')
  )
);

CREATE INDEX visit_place_idx ON visit (place_id);
CREATE INDEX visit_user_idx ON visit (user_id);
