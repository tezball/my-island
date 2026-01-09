package com.example.myislandapi.service;

import com.example.myislandapi.dto.request.CreateReviewRequest;
import com.example.myislandapi.dto.response.ReviewResponse;
import com.example.myislandapi.model.ReviewCategories;
import com.example.myislandapi.model.BookingModel;
import com.example.myislandapi.model.CampsiteModel;
import com.example.myislandapi.model.LotModel;
import com.example.myislandapi.model.ReviewModel;
import com.example.myislandapi.model.UserModel;
import com.example.myislandapi.enums.BookingStatus;
import com.example.myislandapi.event.ReviewEvent;
import com.example.myislandapi.exception.BadRequestException;
import com.example.myislandapi.exception.ResourceNotFoundException;
import com.example.myislandapi.repository.jdbc.JdbcBookingRepository;
import com.example.myislandapi.repository.jdbc.JdbcCampsiteRepository;
import com.example.myislandapi.repository.jdbc.JdbcLotRepository;
import com.example.myislandapi.repository.jdbc.JdbcReviewRepository;
import com.example.myislandapi.repository.jdbc.JdbcUserRepository;
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

    private final JdbcReviewRepository reviewRepository;
    private final JdbcBookingRepository bookingRepository;
    private final JdbcCampsiteRepository campsiteRepository;
    private final JdbcLotRepository lotRepository;
    private final JdbcUserRepository userRepository;
    private final EventPublisher eventPublisher;

    public ReviewService(JdbcReviewRepository reviewRepository,
                        JdbcBookingRepository bookingRepository,
                        JdbcCampsiteRepository campsiteRepository,
                        JdbcLotRepository lotRepository,
                        JdbcUserRepository userRepository,
                        EventPublisher eventPublisher) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.campsiteRepository = campsiteRepository;
        this.lotRepository = lotRepository;
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
    }

    public ReviewResponse createReview(UUID userId, CreateReviewRequest request) {
        // Get booking
        BookingModel booking = bookingRepository.findById(request.bookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + request.bookingId()));

        // Verify user owns the booking
        if (!booking.getUserId().equals(userId)) {
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

        // Get lot and campsite
        LotModel lot = lotRepository.findById(booking.getLotId())
                .orElseThrow(() -> new ResourceNotFoundException("Lot not found"));
        UUID campsiteId = lot.getCampsiteId();

        // Create review
        ReviewModel review = new ReviewModel();
        review.setUserId(userId);
        review.setCampsiteId(campsiteId);
        review.setBookingId(booking.getId());
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
        updateCampsiteRating(campsiteId);

        // Publish review created event
        eventPublisher.publishReviewEvent(ReviewEvent.created(
                review.getId(), userId, campsiteId, booking.getId(), review.getRating()));

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
        ReviewModel review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));

        review.setHelpfulCount(review.getHelpfulCount() + 1);
        review = reviewRepository.save(review);

        return toReviewResponse(review);
    }

    public ReviewResponse addOwnerResponse(UUID reviewId, UUID ownerId, String response) {
        ReviewModel review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));

        // Verify owner
        CampsiteModel campsite = campsiteRepository.findById(review.getCampsiteId())
                .orElseThrow(() -> new ResourceNotFoundException("Campsite not found"));

        if (!campsite.getOwnerId().equals(ownerId)) {
            throw new ResourceNotFoundException("Review not found: " + reviewId);
        }

        if (review.getOwnerResponse() != null) {
            throw new BadRequestException("Owner response already exists");
        }

        review.setOwnerResponse(response);
        review = reviewRepository.save(review);

        // Publish owner response added event
        eventPublisher.publishReviewEvent(ReviewEvent.responseAdded(
                review.getId(), ownerId, review.getCampsiteId()));

        return toReviewResponse(review);
    }

    private void updateCampsiteRating(UUID campsiteId) {
        Double avgRating = reviewRepository.getAverageRatingForCampsite(campsiteId);
        int reviewCount = reviewRepository.countByCampsiteId(campsiteId);

        CampsiteModel campsite = campsiteRepository.findById(campsiteId)
                .orElseThrow(() -> new ResourceNotFoundException("Campsite not found: " + campsiteId));

        if (avgRating != null) {
            campsite.setRating(BigDecimal.valueOf(avgRating).setScale(2, RoundingMode.HALF_UP));
        }
        campsite.setReviewCount(reviewCount);
        campsiteRepository.save(campsite);
    }

    private ReviewResponse toReviewResponse(ReviewModel review) {
        ReviewResponse.ReviewCategoriesResponse categories = null;
        if (review.getCategories() != null) {
            categories = new ReviewResponse.ReviewCategoriesResponse(
                    review.getCategories().getCleanliness(),
                    review.getCategories().getLocation(),
                    review.getCategories().getValue(),
                    review.getCategories().getFacilities()
            );
        }

        UserModel user = userRepository.findById(review.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        var userSummary = new ReviewResponse.UserSummary(
                user.getId(),
                user.getName(),
                user.getAvatar()
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
