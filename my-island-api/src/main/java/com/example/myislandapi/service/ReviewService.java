package com.example.myislandapi.service;

import com.example.myislandapi.dto.request.CreateReviewRequest;
import com.example.myislandapi.dto.response.ReviewResponse;
import com.example.myislandapi.entity.ReviewCategories;
import com.example.myislandapi.entity.Booking;
import com.example.myislandapi.entity.Campsite;
import com.example.myislandapi.entity.Review;
import com.example.myislandapi.enums.BookingStatus;
import com.example.myislandapi.exception.BadRequestException;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.repository.BookingRepository;
import com.example.myislandapi.repository.CampsiteRepository;
import com.example.myislandapi.repository.ReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

@Service
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final CampsiteRepository campsiteRepository;

    public ReviewService(ReviewRepository reviewRepository,
                        BookingRepository bookingRepository,
                        CampsiteRepository campsiteRepository) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.campsiteRepository = campsiteRepository;
    }

    public ReviewResponse createReview(UUID userId, CreateReviewRequest request) {
        // Get booking
        Booking booking = bookingRepository.findById(request.bookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + request.bookingId()));

        // Verify user owns the booking
        if (!booking.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Booking not found: " + request.bookingId());
        }

        // Verify booking is completed
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("Can only review completed bookings");
        }

        // Check if review already exists
        if (reviewRepository.existsByBookingId(request.bookingId())) {
            throw new BadRequestException("Review already submitted for this booking");
        }

        // Create review
        Review review = new Review();
        review.setUser(booking.getUser());
        review.setCampsite(booking.getLot().getCampsite());
        review.setBooking(booking);
        review.setRating(request.rating());
        review.setComment(request.comment());

        if (request.categories() != null) {
            ReviewCategories categories = new ReviewCategories();
            categories.setCleanliness(request.categories().cleanliness());
            categories.setLocation(request.categories().location());
            categories.setValue(request.categories().value());
            categories.setFacilities(request.categories().facilities());
            review.setCategories(categories);
        }

        review = reviewRepository.save(review);

        // Update campsite rating
        updateCampsiteRating(booking.getLot().getCampsite().getId());

        return toReviewResponse(review);
    }

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getCampsiteReviews(UUID campsiteId, Pageable pageable) {
        return reviewRepository.findByCampsiteId(campsiteId, pageable)
                .map(this::toReviewResponse);
    }

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getUserReviews(UUID userId, Pageable pageable) {
        return reviewRepository.findByUserId(userId, pageable)
                .map(this::toReviewResponse);
    }

    public ReviewResponse markHelpful(UUID reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));

        review.incrementHelpfulCount();
        review = reviewRepository.save(review);

        return toReviewResponse(review);
    }

    public ReviewResponse addOwnerResponse(UUID reviewId, UUID ownerId, String response) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));

        // Verify owner
        if (!review.getCampsite().getOwner().getId().equals(ownerId)) {
            throw new ResourceNotFoundException("Review not found: " + reviewId);
        }

        if (review.getOwnerResponse() != null) {
            throw new BadRequestException("Owner response already exists");
        }

        review.setOwnerResponse(response);
        review = reviewRepository.save(review);

        return toReviewResponse(review);
    }

    private void updateCampsiteRating(UUID campsiteId) {
        Double avgRating = reviewRepository.getAverageRatingForCampsite(campsiteId);
        int reviewCount = reviewRepository.countByCampsiteId(campsiteId);

        Campsite campsite = campsiteRepository.findById(campsiteId)
                .orElseThrow(() -> new ResourceNotFoundException("Campsite not found: " + campsiteId));

        if (avgRating != null) {
            campsite.setRating(BigDecimal.valueOf(avgRating).setScale(2, RoundingMode.HALF_UP));
        }
        campsite.setReviewCount(reviewCount);
        campsiteRepository.save(campsite);
    }

    private ReviewResponse toReviewResponse(Review review) {
        ReviewResponse.ReviewCategoriesResponse categories = null;
        if (review.getCategories() != null) {
            categories = new ReviewResponse.ReviewCategoriesResponse(
                    review.getCategories().getCleanliness(),
                    review.getCategories().getLocation(),
                    review.getCategories().getValue(),
                    review.getCategories().getFacilities()
            );
        }

        var userSummary = new ReviewResponse.UserSummary(
                review.getUser().getId(),
                review.getUser().getName(),
                review.getUser().getAvatar()
        );

        return new ReviewResponse(
                review.getId(),
                review.getRating(),
                review.getComment(),
                categories,
                review.getHelpfulCount(),
                review.getOwnerResponse(),
                userSummary,
                review.getCreatedAt()
        );
    }
}
