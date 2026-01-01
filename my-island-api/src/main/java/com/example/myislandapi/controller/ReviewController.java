package com.example.myislandapi.controller;

import com.example.myislandapi.dto.request.CreateReviewRequest;
import com.example.myislandapi.dto.response.ReviewResponse;
import com.example.myislandapi.security.UserDetailsImpl;
import com.example.myislandapi.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/reviews")
    public ResponseEntity<ReviewResponse> createReview(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CreateReviewRequest request) {
        ReviewResponse review = reviewService.createReview(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }

    @GetMapping("/campsites/{campsiteId}/reviews")
    public ResponseEntity<Page<ReviewResponse>> getCampsiteReviews(
            @PathVariable UUID campsiteId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(reviewService.getCampsiteReviews(campsiteId, pageable));
    }

    @GetMapping("/users/me/reviews")
    public ResponseEntity<Page<ReviewResponse>> getMyReviews(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(reviewService.getUserReviews(userDetails.getId(), pageable));
    }

    @PostMapping("/reviews/{id}/helpful")
    public ResponseEntity<ReviewResponse> markHelpful(@PathVariable UUID id) {
        return ResponseEntity.ok(reviewService.markHelpful(id));
    }

    @PostMapping("/reviews/{id}/response")
    public ResponseEntity<ReviewResponse> addOwnerResponse(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable UUID id,
            @RequestBody String response) {
        return ResponseEntity.ok(reviewService.addOwnerResponse(id, userDetails.getId(), response));
    }
}
