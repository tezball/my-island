package com.myisland.api.modules.admin.controller;

import com.myisland.api.modules.admin.service.AdminReviewService;
import com.myisland.api.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/reviews")
public class AdminReviewController {

    private final AdminReviewService reviewService;

    public AdminReviewController(AdminReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(reviewService.listReviews(page, size));
    }

    @PutMapping("/{type}/{id}/flag")
    public ResponseEntity<Void> flagReview(
            @PathVariable String type,
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        reviewService.flagReview(userDetails.getUserId(), type, id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{type}/{id}/moderate")
    public ResponseEntity<Void> moderateReview(
            @PathVariable String type,
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        reviewService.moderateReview(userDetails.getUserId(), type, id, body.get("status"), body.get("reason"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{type}/{id}/ai-moderate")
    public ResponseEntity<Map<String, String>> aiModerateReview(
            @PathVariable String type,
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(reviewService.aiModerateReview(userDetails.getUserId(), type, id));
    }

    @DeleteMapping("/{type}/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable String type,
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        reviewService.deleteReview(userDetails.getUserId(), type, id);
        return ResponseEntity.noContent().build();
    }
}
