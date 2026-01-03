package com.example.myislandapi.service;

import com.example.myislandapi.dto.response.BookingResponse;
import com.example.myislandapi.dto.response.CampsiteResponse;
import com.example.myislandapi.dto.response.LocationResponse;
import com.example.myislandapi.dto.response.OwnerStatsResponse;
import com.example.myislandapi.dto.response.RevenueDataResponse;
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
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
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
        int upcomingBookings = 0;
        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal thisMonthRevenue = BigDecimal.ZERO;
        BigDecimal lastMonthRevenue = BigDecimal.ZERO;

        LocalDate today = LocalDate.now();
        LocalDate startOfThisMonth = today.withDayOfMonth(1);
        LocalDate startOfLastMonth = startOfThisMonth.minusMonths(1);
        LocalDate endOfLastMonth = startOfThisMonth.minusDays(1);

        for (Booking booking : bookings) {
            switch (booking.getStatus()) {
                case PENDING -> {
                    pendingBookings++;
                    // Count as upcoming if check-in is in the future
                    if (!booking.getCheckIn().isBefore(today)) {
                        upcomingBookings++;
                    }
                }
                case CONFIRMED, CHECKED_IN -> {
                    confirmedBookings++;
                    // Count as upcoming if check-in is in the future
                    if (!booking.getCheckIn().isBefore(today)) {
                        upcomingBookings++;
                    }
                }
                case COMPLETED -> {
                    completedBookings++;
                    totalRevenue = totalRevenue.add(booking.getTotalPrice());

                    // Calculate this month's revenue (based on checkout date)
                    LocalDate checkOut = booking.getCheckOut();
                    if (!checkOut.isBefore(startOfThisMonth)) {
                        thisMonthRevenue = thisMonthRevenue.add(booking.getTotalPrice());
                    } else if (!checkOut.isBefore(startOfLastMonth) && !checkOut.isAfter(endOfLastMonth)) {
                        lastMonthRevenue = lastMonthRevenue.add(booking.getTotalPrice());
                    }
                }
                default -> {}
            }
        }

        // Calculate revenue change percentage
        double revenueChange = 0.0;
        if (lastMonthRevenue.compareTo(BigDecimal.ZERO) > 0) {
            revenueChange = thisMonthRevenue.subtract(lastMonthRevenue)
                    .divide(lastMonthRevenue, 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        } else if (thisMonthRevenue.compareTo(BigDecimal.ZERO) > 0) {
            revenueChange = 100.0; // 100% increase from zero
        }

        // Calculate occupancy rate for current month
        double occupancyRate = calculateOccupancyRate(campsites, bookings.getContent(), today);

        // Calculate average rating
        double averageRating = campsites.stream()
                .filter(c -> c.getRating() != null)
                .mapToDouble(c -> c.getRating().doubleValue())
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
                upcomingBookings,
                totalRevenue,
                thisMonthRevenue,
                lastMonthRevenue,
                revenueChange,
                occupancyRate,
                averageRating,
                totalReviews,
                totalCampsites,
                totalLots
        );
    }

    private double calculateOccupancyRate(List<Campsite> campsites, List<Booking> bookings, LocalDate today) {
        // Calculate occupancy for the current month
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfMonth = today.withDayOfMonth(today.lengthOfMonth());

        int totalLots = campsites.stream().mapToInt(c -> c.getLots().size()).sum();
        if (totalLots == 0) {
            return 0.0;
        }

        // Total available lot-nights this month
        int daysInMonth = today.lengthOfMonth();
        int totalAvailableNights = totalLots * daysInMonth;

        // Count booked nights
        int bookedNights = 0;
        for (Booking booking : bookings) {
            // Only count confirmed, checked-in, or completed bookings
            if (booking.getStatus() == BookingStatus.PENDING ||
                booking.getStatus() == BookingStatus.CANCELLED) {
                continue;
            }

            LocalDate checkIn = booking.getCheckIn();
            LocalDate checkOut = booking.getCheckOut();

            // Calculate overlap with current month
            LocalDate overlapStart = checkIn.isBefore(startOfMonth) ? startOfMonth : checkIn;
            LocalDate overlapEnd = checkOut.isAfter(endOfMonth) ? endOfMonth : checkOut;

            if (!overlapStart.isAfter(overlapEnd)) {
                // Count nights (checkOut is exclusive, so we count days from start to end-1)
                bookedNights += (int) java.time.temporal.ChronoUnit.DAYS.between(overlapStart, overlapEnd);
            }
        }

        return totalAvailableNights > 0
                ? Math.round((double) bookedNights / totalAvailableNights * 1000) / 10.0
                : 0.0;
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

    public RevenueDataResponse getRevenueData(UUID ownerId, int months) {
        List<RevenueDataResponse.MonthlyRevenue> monthlyData = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM");

        Page<Booking> allBookings = bookingRepository.findByOwnerId(ownerId, Pageable.unpaged());

        for (int i = months - 1; i >= 0; i--) {
            YearMonth targetMonth = YearMonth.now().minusMonths(i);
            LocalDate startOfMonth = targetMonth.atDay(1);
            LocalDate endOfMonth = targetMonth.atEndOfMonth();

            BigDecimal revenue = BigDecimal.ZERO;
            int bookingCount = 0;

            for (Booking booking : allBookings) {
                if (booking.getStatus() == BookingStatus.COMPLETED &&
                    !booking.getCheckOut().isBefore(startOfMonth) &&
                    !booking.getCheckOut().isAfter(endOfMonth)) {
                    revenue = revenue.add(booking.getTotalPrice());
                    bookingCount++;
                }
            }

            monthlyData.add(new RevenueDataResponse.MonthlyRevenue(
                    targetMonth.format(formatter),
                    revenue,
                    bookingCount
            ));
        }

        return new RevenueDataResponse(monthlyData);
    }
}
