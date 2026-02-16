package com.myisland.moderator.scheduler;

import com.myisland.moderator.service.ModerationService;
import com.myisland.moderator.service.ModerationService.ModerationResult;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Component
public class ModerationScheduler {

    private static final Logger log = LoggerFactory.getLogger(ModerationScheduler.class);

    private final JdbcTemplate jdbcTemplate;
    private final ModerationService moderationService;

    public ModerationScheduler(JdbcTemplate jdbcTemplate, ModerationService moderationService) {
        this.jdbcTemplate = jdbcTemplate;
        this.moderationService = moderationService;
    }

    @Scheduled(fixedRate = 300000) // every 5 minutes
    @SchedulerLock(name = "reviewModeration", lockAtLeastFor = "1m", lockAtMostFor = "10m")
    public void moderatePendingReviews() {
        List<Map<String, Object>> pendingReviews = jdbcTemplate.queryForList(
                "SELECT id, comment, rating, owner_id FROM reviews WHERE moderation_status = 'PENDING'"
        );
        List<Map<String, Object>> pendingSupplierReviews = jdbcTemplate.queryForList(
                "SELECT id, comment, rating, supplier_id FROM supplier_reviews WHERE moderation_status = 'PENDING'"
        );

        if (pendingReviews.isEmpty() && pendingSupplierReviews.isEmpty()) {
            return;
        }

        int approved = 0;
        int rejected = 0;

        for (Map<String, Object> row : pendingReviews) {
            Long id = ((Number) row.get("id")).longValue();
            String comment = (String) row.get("comment");
            BigDecimal rating = (BigDecimal) row.get("rating");
            Long ownerId = ((Number) row.get("owner_id")).longValue();

            ModerationResult result = moderationService.moderate(comment, rating);
            String status = result.approved() ? "APPROVED" : "REJECTED";

            jdbcTemplate.update(
                    "UPDATE reviews SET moderation_status = ?, moderation_reason = ?, moderated_at = ? WHERE id = ?",
                    status, result.reason(), Timestamp.valueOf(LocalDateTime.now()), id
            );

            if (result.approved()) {
                approved++;
                recalculateOwnerRating(ownerId);
            } else {
                rejected++;
            }
        }

        for (Map<String, Object> row : pendingSupplierReviews) {
            Long id = ((Number) row.get("id")).longValue();
            String comment = (String) row.get("comment");
            BigDecimal rating = (BigDecimal) row.get("rating");
            Long supplierId = ((Number) row.get("supplier_id")).longValue();

            ModerationResult result = moderationService.moderate(comment, rating);
            String status = result.approved() ? "APPROVED" : "REJECTED";

            jdbcTemplate.update(
                    "UPDATE supplier_reviews SET moderation_status = ?, moderation_reason = ?, moderated_at = ? WHERE id = ?",
                    status, result.reason(), Timestamp.valueOf(LocalDateTime.now()), id
            );

            if (result.approved()) {
                approved++;
                recalculateSupplierRating(supplierId);
            } else {
                rejected++;
            }
        }

        log.info("Moderated {} reviews: {} approved, {} rejected",
                pendingReviews.size() + pendingSupplierReviews.size(), approved, rejected);
    }

    private void recalculateOwnerRating(Long ownerId) {
        BigDecimal avgRating = jdbcTemplate.queryForObject(
                "SELECT AVG(rating) FROM reviews WHERE owner_id = ? AND moderation_status = 'APPROVED'",
                BigDecimal.class, ownerId
        );
        Long count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM reviews WHERE owner_id = ? AND moderation_status = 'APPROVED'",
                Long.class, ownerId
        );

        jdbcTemplate.update(
                "UPDATE owners SET rating = ?, review_count = ? WHERE id = ?",
                avgRating, count != null ? count.intValue() : 0, ownerId
        );
    }

    private void recalculateSupplierRating(Long supplierId) {
        BigDecimal avgRating = jdbcTemplate.queryForObject(
                "SELECT AVG(rating) FROM supplier_reviews WHERE supplier_id = ? AND moderation_status = 'APPROVED'",
                BigDecimal.class, supplierId
        );
        Long count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM supplier_reviews WHERE supplier_id = ? AND moderation_status = 'APPROVED'",
                Long.class, supplierId
        );

        jdbcTemplate.update(
                "UPDATE suppliers SET rating = ?, review_count = ? WHERE id = ?",
                avgRating, count != null ? count.intValue() : 0, supplierId
        );
    }
}
