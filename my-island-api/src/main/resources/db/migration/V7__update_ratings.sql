-- V7__update_ratings.sql
-- Update campsite ratings and review counts based on actual reviews

-- Update campsite ratings from reviews
UPDATE campsites c SET
    rating = subquery.avg_rating,
    review_count = subquery.review_count,
    updated_at = NOW()
FROM (
    SELECT
        campsite_id,
        ROUND(AVG(rating)::numeric, 2) as avg_rating,
        COUNT(*) as review_count
    FROM reviews
    GROUP BY campsite_id
) AS subquery
WHERE c.id = subquery.campsite_id;
