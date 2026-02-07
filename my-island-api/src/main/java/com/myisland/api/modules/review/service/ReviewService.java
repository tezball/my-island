package com.myisland.api.modules.review.service;

import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.booking.repository.BookingRepository;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.identity.repository.UserRepository;
import com.myisland.api.modules.review.dto.*;
import com.myisland.api.modules.review.entity.Review;
import com.myisland.api.modules.review.repository.ReviewRepository;
import com.myisland.api.shared.exceptions.BadRequestException;
import com.myisland.api.shared.exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
public class ReviewService {

    private static final Set<Booking.BookingStatus> REVIEWABLE_STATUSES =
            Set.of(Booking.BookingStatus.COMPLETED, Booking.BookingStatus.CHECKED_IN);

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final OwnerRepository ownerRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository, BookingRepository bookingRepository,
                         OwnerRepository ownerRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.ownerRepository = ownerRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ReviewDto> getReviewsByOwner(Long ownerId) {
        return reviewRepository.findByOwnerIdWithDetails(ownerId).stream()
                .map(ReviewDto::from)
                .toList();
    }

    @Transactional
    public ReviewDto createReview(Long userId, CreateReviewRequest request) {
        Booking booking = bookingRepository.findByIdWithDetails(request.bookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getUser() == null || !booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only review your own bookings");
        }

        if (!REVIEWABLE_STATUSES.contains(booking.getStatus())) {
            throw new BadRequestException("You can only review completed or checked-in bookings");
        }

        if (reviewRepository.findByBookingId(request.bookingId()).isPresent()) {
            throw new BadRequestException("You have already reviewed this booking");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Owner owner = booking.getLot().getOwner();

        Review review = Review.builder()
                .user(user)
                .owner(owner)
                .booking(booking)
                .rating(request.rating())
                .comment(request.comment())
                .build();

        review = reviewRepository.save(review);
        updateOwnerRating(owner);

        return ReviewDto.from(review);
    }

    @Transactional
    public ReviewDto respondToReview(Long userId, Long reviewId, OwnerReviewResponseRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        Owner owner = ownerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        if (!review.getOwner().getId().equals(owner.getId())) {
            throw new BadRequestException("You can only respond to reviews for your own campsite");
        }

        if (review.getOwnerResponse() != null) {
            throw new BadRequestException("You have already responded to this review");
        }

        review.setOwnerResponse(request.response());
        review.setOwnerResponseAt(LocalDateTime.now());
        review = reviewRepository.save(review);

        return ReviewDto.from(review);
    }

    @Transactional(readOnly = true)
    public ReviewEligibilityDto checkEligibility(Long userId, Long ownerId) {
        List<Booking> bookings = bookingRepository.findByOwnerId(ownerId).stream()
                .filter(b -> b.getUser() != null && b.getUser().getId().equals(userId))
                .filter(b -> REVIEWABLE_STATUSES.contains(b.getStatus()))
                .toList();

        List<ReviewEligibilityDto.EligibleBooking> eligibleBookings = bookings.stream()
                .map(b -> new ReviewEligibilityDto.EligibleBooking(
                        b.getId(),
                        b.getLot().getName(),
                        b.getCheckInDate(),
                        b.getCheckOutDate(),
                        reviewRepository.findByBookingId(b.getId()).isPresent()
                ))
                .toList();

        boolean canReview = eligibleBookings.stream().anyMatch(eb -> !eb.alreadyReviewed());

        return new ReviewEligibilityDto(canReview, eligibleBookings);
    }

    @Transactional(readOnly = true)
    public List<ReviewDto> getOwnerReviews(Long userId) {
        Owner owner = ownerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

        return reviewRepository.findByOwnerIdWithDetails(owner.getId()).stream()
                .map(ReviewDto::from)
                .toList();
    }

    private void updateOwnerRating(Owner owner) {
        BigDecimal avgRating = reviewRepository.calculateAverageRating(owner.getId());
        long count = reviewRepository.countByOwnerId(owner.getId());

        if (avgRating != null) {
            owner.setRating(avgRating.setScale(1, RoundingMode.HALF_UP));
        } else {
            owner.setRating(null);
        }
        owner.setReviewCount((int) count);
        ownerRepository.save(owner);
    }
}
