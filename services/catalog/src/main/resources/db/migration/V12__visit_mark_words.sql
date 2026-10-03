-- Domain words for an existing database. V9 and V11 already applied with the old
-- words are not re-run; this migration moves those rows. Fresh databases already
-- create and seed visited, next, and saved, then this pass is a no-op on the rows.

ALTER TABLE visit_intent DROP CONSTRAINT visit_intent_mark_check;

UPDATE visit_intent
SET mark = CASE mark
  WHEN 'been' THEN 'visited'
  WHEN 'want' THEN 'next'
  WHEN 'never' THEN 'saved'
  ELSE mark
END
WHERE mark IN ('been', 'want', 'never');

UPDATE visit_intent_audit
SET
  old_mark = CASE old_mark
    WHEN 'been' THEN 'visited'
    WHEN 'want' THEN 'next'
    WHEN 'never' THEN 'saved'
    ELSE old_mark
  END,
  new_mark = CASE new_mark
    WHEN 'been' THEN 'visited'
    WHEN 'want' THEN 'next'
    WHEN 'never' THEN 'saved'
    ELSE new_mark
  END
WHERE old_mark IN ('been', 'want', 'never')
   OR new_mark IN ('been', 'want', 'never');

ALTER TABLE visit_intent
  ADD CONSTRAINT visit_intent_mark_check
  CHECK (mark IN ('visited', 'next', 'saved'));

DROP INDEX IF EXISTS visit_intent_place_been_idx;
CREATE INDEX IF NOT EXISTS visit_intent_place_visited_idx
  ON visit_intent (place_id) WHERE mark = 'visited';
