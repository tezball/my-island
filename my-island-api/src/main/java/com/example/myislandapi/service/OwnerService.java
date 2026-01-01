package com.example.myislandapi.service;

import com.example.myislandapi.dto.response.BookingResponse;
import com.example.myislandapi.dto.response.CampsiteResponse;
import com.example.myislandapi.dto.response.LocationResponse;
import com.example.myislandapi.dto.response.OwnerStatsResponse;
import com.example.myislandapi.entity.Booking;
import com.example.myislandapi.entity.Campsite;
import com.example.myislandapi.entity.Lot;
import com.example.myislandapi.enums.BookingStatus;
import com.example.myislandapi.repository.BookingRepository;
import com.example.myislandapi.repository.CampsiteRepository;
import com.example.myislandapi.repository.ReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class OwnerService {

    private final CampsiteRepository campsiteRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;

    public OwnerService(CampsiteRepository campsiteRepository,
                       BookingRepository bookingRepository,
                       ReviewRepository reviewRepository) {
        this.campsiteRepository = campsiteRepository;
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
    }

    public OwnerStatsResponse getOwnerStats(UUID ownerId) {
        List<Campsite> campsites = campsiteRepository.findByOwnerId(ownerId);

        int totalCampsites = campsites.size();
        int totalLots = campsites.stream().mapToInt(c -> c.getLots().size()).sum();

        // Get all bookings for owner
        Page<Booking> bookings = bookingRepository.findByOwnerId(ownerId, Pageable.unpaged());

        int totalBookings = (int) bookings.getTotalElements();
        int pendingBookings = 0;
        int confirmedBookings = 0;
        int completedBookings = 0;
        BigDecimal totalRevenue = BigDecimal.ZERO;

        for (Booking booking : bookings) {
            switch (booking.getStatus()) {
                case PENDING -> pendingBookings++;
                case CONFIRMED, CHECKED_IN -> confirmedBookings++;
                case COMPLETED -> {
                    completedBookings++;
                    totalRevenue = totalRevenue.add(booking.getTotalPrice());
                }
                default -> {}
            }
        }

        // Calculate average rating
        double averageRating = campsites.stream()
                .mapToDouble(c -> c.getRating() != null ? c.getRating().doubleValue() : 0)
                .average()
                .orElse(0);

        int totalReviews = campsites.stream()
                .mapToInt(Campsite::getReviewCount)
                .sum();

        return new OwnerStatsResponse(
                totalBookings,
                pendingBookings,
                confirmedBookings,
                completedBookings,
                totalRevenue,
                BigDecimal.ZERO, // TODO: Calculate this month's revenue
                averageRating,
                totalReviews,
                totalCampsites,
                totalLots
        );
    }

    public List<CampsiteResponse> getOwnerCampsites(UUID ownerId) {
        return campsiteRepository.findByOwnerId(ownerId).stream()
                .map(this::toCampsiteResponse)
                .toList();
    }

    public Page<BookingResponse> getOwnerBookings(UUID ownerId, BookingStatus status, Pageable pageable) {
        Page<Booking> bookings;
        if (status != null) {
            bookings = bookingRepository.findByOwnerIdAndStatus(ownerId, status, pageable);
        } else {
            bookings = bookingRepository.findByOwnerId(ownerId, pageable);
        }
        return bookings.map(this::toBookingResponse);
    }

    private CampsiteResponse toCampsiteResponse(Campsite campsite) {
        BigDecimal priceFrom = campsite.getLots().stream()
                .map(Lot::getPricePerNight)
                .min(Comparator.naturalOrder())
                .orElse(BigDecimal.ZERO);

        LocationResponse locationResponse = null;
        if (campsite.getLocation() != null) {
            locationResponse = new LocationResponse(
                    campsite.getLocation().getAddress(),
                    campsite.getLocation().getCounty(),
                    campsite.getLocation().getLat(),
                    campsite.getLocation().getLng()
            );
        }

        return new CampsiteResponse(
                campsite.getId(),
                campsite.getName(),
                campsite.getDescription(),
                locationResponse,
                campsite.getImages(),
                campsite.getRating(),
                campsite.getReviewCount(),
                priceFrom,
                campsite.getFacilities(),
                campsite.isFeatured(),
                campsite.getOwner().getId()
        );
    }

    private BookingResponse toBookingResponse(Booking booking) {
        Lot lot = booking.getLot();
        var campsite = lot.getCampsite();

        var lotSummary = new BookingResponse.LotSummary(
                lot.getId(),
                lot.getName(),
                lot.getType().name(),
                lot.getImages()
        );

        var campsiteSummary = new BookingResponse.CampsiteSummary(
                campsite.getId(),
                campsite.getName(),
                campsite.getLocation() != null ? campsite.getLocation().getCounty() : null,
                campsite.getImages().isEmpty() ? null : campsite.getImages().get(0)
        );

        List<BookingResponse.BookingExtraResponse> extras = booking.getBookingExtras().stream()
                .map(be -> new BookingResponse.BookingExtraResponse(
                        be.getExtra().getId(),
                        be.getExtra().getName(),
                        be.getQuantity(),
                        be.getUnitPrice(),
                        be.getTotalPrice()
                ))
                .toList();

        return new BookingResponse(
                booking.getId(),
                booking.getStatus(),
                booking.getCheckIn(),
                booking.getCheckOut(),
                booking.getGuests(),
                booking.getNights(),
                booking.getLotPrice(),
                booking.getExtrasPrice(),
                booking.getServiceFee(),
                booking.getTotalPrice(),
                booking.getSpecialRequests(),
                lotSummary,
                campsiteSummary,
                extras,
                booking.getCreatedAt()
        );
    }
}
