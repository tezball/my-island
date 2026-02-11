package com.myisland.api.modules.admin.service;

import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.booking.entity.Booking.BookingStatus;
import com.myisland.api.modules.booking.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminFinancialService {

    private final BookingRepository bookingRepository;

    public AdminFinancialService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getRevenue(String period) {
        List<Booking> bookings = bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() != BookingStatus.CANCELLED)
                .collect(Collectors.toList());

        if ("weekly".equalsIgnoreCase(period)) {
            return aggregateRevenueWeekly(bookings);
        } else {
            return aggregateRevenueMonthly(bookings);
        }
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getServiceFees(String period) {
        List<Booking> bookings = bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() != BookingStatus.CANCELLED)
                .collect(Collectors.toList());

        if ("weekly".equalsIgnoreCase(period)) {
            return aggregateServiceFeesWeekly(bookings);
        } else {
            return aggregateServiceFeesMonthly(bookings);
        }
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getPerOwnerRevenue() {
        List<Booking> bookings = bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() != BookingStatus.CANCELLED && b.getLot() != null && b.getLot().getOwner() != null)
                .collect(Collectors.toList());

        Map<Long, Map<String, Object>> ownerRevenueMap = new HashMap<>();

        bookings.forEach(booking -> {
            Long ownerId = booking.getLot().getOwner().getId();
            String ownerName = booking.getLot().getOwner().getPropertyName();

            ownerRevenueMap.putIfAbsent(ownerId, new HashMap<>());
            Map<String, Object> ownerData = ownerRevenueMap.get(ownerId);
            ownerData.put("ownerId", ownerId);
            ownerData.put("ownerName", ownerName);

            BigDecimal currentRevenue = (BigDecimal) ownerData.getOrDefault("revenue", BigDecimal.ZERO);
            BigDecimal bookingPrice = booking.getTotalPrice() != null ? booking.getTotalPrice() : BigDecimal.ZERO;
            ownerData.put("revenue", currentRevenue.add(bookingPrice));

            Long currentBookingCount = (Long) ownerData.getOrDefault("bookingCount", 0L);
            ownerData.put("bookingCount", currentBookingCount + 1);
        });

        return new ArrayList<>(ownerRevenueMap.values());
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getBookingVolume(String period) {
        List<Booking> bookings = bookingRepository.findAll();

        if ("weekly".equalsIgnoreCase(period)) {
            return aggregateBookingVolumeWeekly(bookings);
        } else {
            return aggregateBookingVolumeMonthly(bookings);
        }
    }

    @Transactional(readOnly = true)
    public String exportCsv(String startDate, String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        List<Booking> bookings = bookingRepository.findAll().stream()
                .filter(b -> {
                    if (b.getCreatedAt() == null) return false;
                    LocalDate bookingDate = b.getCreatedAt().toLocalDate();
                    return !bookingDate.isBefore(start) && !bookingDate.isAfter(end);
                })
                .collect(Collectors.toList());

        StringBuilder csv = new StringBuilder();
        csv.append("ID,Guest Name,Guest Email,Owner,Check In,Check Out,Total Price,Service Fee,Status,Created At\n");

        bookings.forEach(booking -> {
            String ownerName = (booking.getLot() != null && booking.getLot().getOwner() != null)
                    ? booking.getLot().getOwner().getPropertyName() : "";
            csv.append(booking.getId()).append(",")
                    .append(booking.getGuestName() != null ? booking.getGuestName() : "").append(",")
                    .append(booking.getGuestEmail() != null ? booking.getGuestEmail() : "").append(",")
                    .append(ownerName).append(",")
                    .append(booking.getCheckInDate()).append(",")
                    .append(booking.getCheckOutDate()).append(",")
                    .append(booking.getTotalPrice() != null ? booking.getTotalPrice() : "").append(",")
                    .append(booking.getServiceFee() != null ? booking.getServiceFee() : "").append(",")
                    .append(booking.getStatus()).append(",")
                    .append(booking.getCreatedAt()).append("\n");
        });

        return csv.toString();
    }

    private BigDecimal safeServiceFee(Booking booking) {
        return booking.getServiceFee() != null ? booking.getServiceFee() : BigDecimal.ZERO;
    }

    private BigDecimal safeTotalPrice(Booking booking) {
        return booking.getTotalPrice() != null ? booking.getTotalPrice() : BigDecimal.ZERO;
    }

    private List<Map<String, Object>> aggregateRevenueWeekly(List<Booking> bookings) {
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
                    .map(this::safeTotalPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("label", weekStart.format(DateTimeFormatter.ofPattern("MMM dd")));
            dataPoint.put("revenue", revenue);
            result.add(dataPoint);
        }

        return result;
    }

    private List<Map<String, Object>> aggregateRevenueMonthly(List<Booking> bookings) {
        List<Map<String, Object>> result = new ArrayList<>();
        YearMonth now = YearMonth.now();

        for (int i = 11; i >= 0; i--) {
            YearMonth month = now.minusMonths(i);

            BigDecimal revenue = bookings.stream()
                    .filter(b -> b.getCreatedAt() != null && YearMonth.from(b.getCreatedAt()).equals(month))
                    .map(this::safeTotalPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("label", month.format(DateTimeFormatter.ofPattern("MMM yyyy")));
            dataPoint.put("revenue", revenue);
            result.add(dataPoint);
        }

        return result;
    }

    private List<Map<String, Object>> aggregateServiceFeesWeekly(List<Booking> bookings) {
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDate now = LocalDate.now();

        for (int i = 7; i >= 0; i--) {
            LocalDate weekStart = now.minusWeeks(i);
            LocalDate weekEnd = weekStart.plusDays(6);

            BigDecimal serviceFees = bookings.stream()
                    .filter(b -> {
                        if (b.getCreatedAt() == null) return false;
                        LocalDate bookingDate = b.getCreatedAt().toLocalDate();
                        return !bookingDate.isBefore(weekStart) && !bookingDate.isAfter(weekEnd);
                    })
                    .map(this::safeServiceFee)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("label", weekStart.format(DateTimeFormatter.ofPattern("MMM dd")));
            dataPoint.put("serviceFees", serviceFees);
            result.add(dataPoint);
        }

        return result;
    }

    private List<Map<String, Object>> aggregateServiceFeesMonthly(List<Booking> bookings) {
        List<Map<String, Object>> result = new ArrayList<>();
        YearMonth now = YearMonth.now();

        for (int i = 11; i >= 0; i--) {
            YearMonth month = now.minusMonths(i);

            BigDecimal serviceFees = bookings.stream()
                    .filter(b -> b.getCreatedAt() != null && YearMonth.from(b.getCreatedAt()).equals(month))
                    .map(this::safeServiceFee)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("label", month.format(DateTimeFormatter.ofPattern("MMM yyyy")));
            dataPoint.put("serviceFees", serviceFees);
            result.add(dataPoint);
        }

        return result;
    }

    private List<Map<String, Object>> aggregateBookingVolumeWeekly(List<Booking> bookings) {
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDate now = LocalDate.now();

        for (int i = 7; i >= 0; i--) {
            LocalDate weekStart = now.minusWeeks(i);
            LocalDate weekEnd = weekStart.plusDays(6);

            long count = bookings.stream()
                    .filter(b -> {
                        if (b.getCreatedAt() == null) return false;
                        LocalDate bookingDate = b.getCreatedAt().toLocalDate();
                        return !bookingDate.isBefore(weekStart) && !bookingDate.isAfter(weekEnd);
                    })
                    .count();

            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("label", weekStart.format(DateTimeFormatter.ofPattern("MMM dd")));
            dataPoint.put("count", count);
            result.add(dataPoint);
        }

        return result;
    }

    private List<Map<String, Object>> aggregateBookingVolumeMonthly(List<Booking> bookings) {
        List<Map<String, Object>> result = new ArrayList<>();
        YearMonth now = YearMonth.now();

        for (int i = 11; i >= 0; i--) {
            YearMonth month = now.minusMonths(i);

            long count = bookings.stream()
                    .filter(b -> b.getCreatedAt() != null && YearMonth.from(b.getCreatedAt()).equals(month))
                    .count();

            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("label", month.format(DateTimeFormatter.ofPattern("MMM yyyy")));
            dataPoint.put("count", count);
            result.add(dataPoint);
        }

        return result;
    }
}
