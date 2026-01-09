package com.example.myislandapi.service;

import com.example.myislandapi.dto.response.BookingResponse;
import com.example.myislandapi.dto.response.CampsiteResponse;
import com.example.myislandapi.dto.response.LocationResponse;
import com.example.myislandapi.dto.response.OwnerStatsResponse;
import com.example.myislandapi.dto.response.RevenueDataResponse;
import com.example.myislandapi.enums.BookingStatus;
import com.example.myislandapi.model.BookingModel;
import com.example.myislandapi.model.CampsiteModel;
import com.example.myislandapi.model.LotModel;
import com.example.myislandapi.model.UserModel;
import com.example.myislandapi.repository.jdbc.JdbcBookingRepository;
import com.example.myislandapi.repository.jdbc.JdbcCampsiteRepository;
import com.example.myislandapi.repository.jdbc.JdbcExtraRepository;
import com.example.myislandapi.repository.jdbc.JdbcLotRepository;
import com.example.myislandapi.repository.jdbc.JdbcReviewRepository;
import com.example.myislandapi.repository.jdbc.JdbcUserRepository;
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

    private final JdbcCampsiteRepository campsiteRepository;
    private final JdbcBookingRepository bookingRepository;
    private final JdbcReviewRepository reviewRepository;
    private final JdbcLotRepository lotRepository;
    private final JdbcUserRepository userRepository;
    private final JdbcExtraRepository extraRepository;

    public OwnerService(JdbcCampsiteRepository campsiteRepository,
                       JdbcBookingRepository bookingRepository,
                       JdbcReviewRepository reviewRepository,
                       JdbcLotRepository lotRepository,
                       JdbcUserRepository userRepository,
                       JdbcExtraRepository extraRepository) {
        this.campsiteRepository = campsiteRepository;
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
        this.lotRepository = lotRepository;
        this.userRepository = userRepository;
        this.extraRepository = extraRepository;
    }

    public OwnerStatsResponse getOwnerStats(UUID ownerId, UUID campsiteId) {
        List<CampsiteModel> campsites;
        if (campsiteId != null) {
            // Filter to specific campsite if provided
            campsites = campsiteRepository.findById(campsiteId)
                    .filter(c -> c.getOwnerId().equals(ownerId))
                    .map(List::of)
                    .orElse(List.of());
        } else {
            campsites = campsiteRepository.findByOwnerId(ownerId);
        }

        int totalCampsites = campsites.size();
        int totalLots = 0;
        for (CampsiteModel campsite : campsites) {
            totalLots += lotRepository.findByCampsiteId(campsite.getId()).size();
        }

        // Get bookings for owner (filtered by campsite if provided)
        Page<BookingModel> bookings;
        if (campsiteId != null) {
            bookings = bookingRepository.findByOwnerIdAndCampsiteId(ownerId, campsiteId, Pageable.unpaged());
        } else {
            bookings = bookingRepository.findByOwnerId(ownerId, Pageable.unpaged());
        }

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

        for (BookingModel booking : bookings) {
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
                .mapToInt(CampsiteModel::getReviewCount)
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

    private double calculateOccupancyRate(List<CampsiteModel> campsites, List<BookingModel> bookings, LocalDate today) {
        // Calculate occupancy for the current month
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfMonth = today.withDayOfMonth(today.lengthOfMonth());

        int totalLots = 0;
        for (CampsiteModel campsite : campsites) {
            totalLots += lotRepository.findByCampsiteId(campsite.getId()).size();
        }
        if (totalLots == 0) {
            return 0.0;
        }

        // Total available lot-nights this month
        int daysInMonth = today.lengthOfMonth();
        int totalAvailableNights = totalLots * daysInMonth;

        // Count booked nights
        int bookedNights = 0;
        for (BookingModel booking : bookings) {
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

    public Page<BookingResponse> getOwnerBookings(UUID ownerId, BookingStatus status, UUID campsiteId, Pageable pageable) {
        Page<BookingModel> bookings;
        if (campsiteId != null && status != null) {
            bookings = bookingRepository.findByOwnerIdAndCampsiteIdAndStatus(ownerId, campsiteId, status, pageable);
        } else if (campsiteId != null) {
            bookings = bookingRepository.findByOwnerIdAndCampsiteId(ownerId, campsiteId, pageable);
        } else if (status != null) {
            bookings = bookingRepository.findByOwnerIdAndStatus(ownerId, status, pageable);
        } else {
            bookings = bookingRepository.findByOwnerId(ownerId, pageable);
        }
        return bookings.map(this::toBookingResponse);
    }

    private CampsiteResponse toCampsiteResponse(CampsiteModel campsite) {
        List<LotModel> lots = lotRepository.findByCampsiteId(campsite.getId());
        BigDecimal priceFrom = lots.stream()
                .map(LotModel::getPricePerNight)
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
                campsite.getOwnerId()
        );
    }

    private BookingResponse toBookingResponse(BookingModel booking) {
        LotModel lot = lotRepository.findById(booking.getLotId()).orElse(null);
        CampsiteModel campsite = lot != null ? campsiteRepository.findById(lot.getCampsiteId()).orElse(null) : null;
        UserModel user = userRepository.findById(booking.getUserId()).orElse(null);

        var lotSummary = lot != null ? new BookingResponse.LotSummary(
                lot.getId(),
                lot.getName(),
                lot.getType().name(),
                lot.getImages()
        ) : null;

        var campsiteSummary = campsite != null ? new BookingResponse.CampsiteSummary(
                campsite.getId(),
                campsite.getName(),
                campsite.getLocation() != null ? campsite.getLocation().getCounty() : null,
                campsite.getImages().isEmpty() ? null : campsite.getImages().get(0)
        ) : null;

        var guestSummary = user != null ? new BookingResponse.GuestSummary(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAvatar()
        ) : null;

        List<BookingResponse.BookingExtraResponse> extras = booking.getBookingExtras() != null
                ? booking.getBookingExtras().stream()
                    .map(be -> {
                        var extra = extraRepository.findById(be.getExtraId()).orElse(null);
                        return new BookingResponse.BookingExtraResponse(
                                be.getExtraId(),
                                extra != null ? extra.getName() : "Unknown",
                                be.getQuantity(),
                                be.getUnitPrice(),
                                be.getTotalPrice()
                        );
                    })
                    .toList()
                : List.of();

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
                guestSummary,
                extras,
                booking.getCreatedAt()
        );
    }

    public RevenueDataResponse getRevenueData(UUID ownerId, int months) {
        List<RevenueDataResponse.MonthlyRevenue> monthlyData = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM");

        Page<BookingModel> allBookings = bookingRepository.findByOwnerId(ownerId, Pageable.unpaged());

        for (int i = months - 1; i >= 0; i--) {
            YearMonth targetMonth = YearMonth.now().minusMonths(i);
            LocalDate startOfMonth = targetMonth.atDay(1);
            LocalDate endOfMonth = targetMonth.atEndOfMonth();

            BigDecimal revenue = BigDecimal.ZERO;
            int bookingCount = 0;

            for (BookingModel booking : allBookings) {
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
