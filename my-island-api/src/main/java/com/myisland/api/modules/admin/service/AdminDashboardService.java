package com.myisland.api.modules.admin.service;

import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.admin.repository.AdminAuditLogRepository;
import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.booking.entity.Booking.BookingStatus;
import com.myisland.api.modules.booking.repository.BookingRepository;
import com.myisland.api.modules.identity.repository.UserRepository;
import com.myisland.api.modules.marketplace.repository.SupplierRepository;
import com.myisland.api.modules.review.repository.ReviewRepository;
import com.myisland.api.modules.review.repository.SupplierReviewRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final OwnerRepository ownerRepository;
    private final SupplierRepository supplierRepository;
    private final ReviewRepository reviewRepository;
    private final SupplierReviewRepository supplierReviewRepository;
    private final AdminAuditLogRepository adminAuditLogRepository;

    public AdminDashboardService(
            UserRepository userRepository,
            BookingRepository bookingRepository,
            OwnerRepository ownerRepository,
            SupplierRepository supplierRepository,
            ReviewRepository reviewRepository,
            SupplierReviewRepository supplierReviewRepository,
            AdminAuditLogRepository adminAuditLogRepository) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.ownerRepository = ownerRepository;
        this.supplierRepository = supplierRepository;
        this.reviewRepository = reviewRepository;
        this.supplierReviewRepository = supplierReviewRepository;
        this.adminAuditLogRepository = adminAuditLogRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalUsers", userRepository.count());
        stats.put("totalBookings", bookingRepository.count());
        stats.put("totalOwners", ownerRepository.count());
        stats.put("totalSuppliers", supplierRepository.count());

        BigDecimal totalRevenue = bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() != BookingStatus.CANCELLED)
                .map(b -> b.getTotalPrice() != null ? b.getTotalPrice() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalRevenue", totalRevenue);

        LocalDateTime firstOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        stats.put("newUsersThisMonth", userRepository.countByCreatedAtAfter(firstOfMonth));
        stats.put("activeOwners", userRepository.countByIsOwnerTrue());
        stats.put("activeSuppliers", userRepository.countByIsSupplierTrue());

        return stats;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getRevenueChart(String period) {
        List<Booking> bookings = bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() != BookingStatus.CANCELLED)
                .collect(Collectors.toList());

        if ("weekly".equalsIgnoreCase(period)) {
            return getLast8WeeksRevenue(bookings);
        } else {
            return getLast12MonthsRevenue(bookings);
        }
    }

    private List<Map<String, Object>> getLast8WeeksRevenue(List<Booking> bookings) {
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDate now = LocalDate.now();

        for (int i = 7; i >= 0; i--) {
            LocalDate weekStart = now.minusWeeks(i);
            LocalDate weekEnd = weekStart.plusDays(6);

            BigDecimal revenue = bookings.stream()
                    .filter(b -> {
                        if (b.getCreatedAt() == null) return false;
                        LocalDate bookingDate = b.getCreatedAt().toLocalDate();
                        return !bookingDate.isBefore(weekStart) && !bookingDate.isAfter(weekEnd);
                    })
                    .map(b -> b.getTotalPrice() != null ? b.getTotalPrice() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("label", weekStart.format(DateTimeFormatter.ofPattern("MMM dd")));
            dataPoint.put("revenue", revenue);
            result.add(dataPoint);
        }

        return result;
    }

    private List<Map<String, Object>> getLast12MonthsRevenue(List<Booking> bookings) {
        List<Map<String, Object>> result = new ArrayList<>();
        YearMonth now = YearMonth.now();

        for (int i = 11; i >= 0; i--) {
            YearMonth month = now.minusMonths(i);

            BigDecimal revenue = bookings.stream()
                    .filter(b -> b.getCreatedAt() != null && YearMonth.from(b.getCreatedAt()).equals(month))
                    .map(b -> b.getTotalPrice() != null ? b.getTotalPrice() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("label", month.format(DateTimeFormatter.ofPattern("MMM yyyy")));
            dataPoint.put("revenue", revenue);
            result.add(dataPoint);
        }

        return result;
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getBookingBreakdown() {
        Map<String, Long> breakdown = new HashMap<>();

        for (BookingStatus status : BookingStatus.values()) {
            long count = bookingRepository.findAll().stream()
                    .filter(b -> b.getStatus() == status)
                    .count();
            breakdown.put(status.name(), count);
        }

        return breakdown;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getRecentActivity(int limit) {
        return adminAuditLogRepository.findAll(
                PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"))
        ).stream().map(log -> {
            Map<String, Object> activity = new HashMap<>();
            activity.put("id", log.getId());
            activity.put("adminUserId", log.getAdminUserId());
            activity.put("action", log.getAction());
            activity.put("entityType", log.getEntityType());
            activity.put("entityId", log.getEntityId());
            activity.put("summary", log.getSummary());
            activity.put("createdAt", log.getCreatedAt());
            return activity;
        }).collect(Collectors.toList());
    }
}
