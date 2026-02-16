-- Reset all reviews to PENDING so the AI moderation scheduler can re-process them through Ollama.
-- This allows the full AI moderation pipeline to be tested end-to-end in dev.

-- Reset owner reviews
UPDATE reviews SET
    moderation_status = 'PENDING',
    moderation_reason = NULL,
    moderated_at = NULL;

-- Reset supplier reviews
UPDATE supplier_reviews SET
    moderation_status = 'PENDING',
    moderation_reason = NULL,
    moderated_at = NULL;

-- Zero out denormalized ratings (will be recalculated when reviews are APPROVED by AI)
UPDATE owners SET rating = 0, review_count = 0 WHERE review_count > 0;
UPDATE suppliers SET rating = 0, review_count = 0 WHERE review_count > 0;

-- Enable AI moderation toggle
UPDATE feature_toggle SET enabled = true WHERE name = 'REVIEW_AI_MODERATION';
