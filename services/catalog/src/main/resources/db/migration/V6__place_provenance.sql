-- Provenance + lead idempotency for PRD-008 draft import.
-- Expand-only. No booking columns. No country table.
ALTER TABLE place
  ADD COLUMN source_url text,
  ADD COLUMN source_name text,
  ADD COLUMN licence text,
  ADD COLUMN lead_dedupe_key text;

ALTER TABLE place
  ADD CONSTRAINT place_lead_dedupe_key_key UNIQUE (lead_dedupe_key);
