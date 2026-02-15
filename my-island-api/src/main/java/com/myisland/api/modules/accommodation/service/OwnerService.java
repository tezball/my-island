package com.myisland.api.modules.accommodation.service;

import com.myisland.api.modules.accommodation.dto.*;
import com.myisland.api.modules.accommodation.entity.Amenity;
import com.myisland.api.modules.accommodation.entity.Lot;
import com.myisland.api.modules.accommodation.entity.LotBlockedPeriod;
import com.myisland.api.modules.accommodation.entity.Owner;
import com.myisland.api.modules.accommodation.entity.SeasonalPricingRule;
import com.myisland.api.modules.accommodation.repository.AmenityRepository;
import com.myisland.api.modules.accommodation.repository.LotBlockedPeriodRepository;
import com.myisland.api.modules.accommodation.repository.LotRepository;
import com.myisland.api.modules.accommodation.repository.OwnerRepository;
import com.myisland.api.modules.accommodation.repository.SeasonalPricingRuleRepository;
import com.myisland.api.modules.booking.dto.BookingDto;
import com.myisland.api.modules.booking.entity.Booking;
import com.myisland.api.modules.booking.repository.BookingRepository;
import com.myisland.api.modules.identity.entity.User;
import com.myisland.api.modules.identity.repository.UserRepository;
import com.myisland.api.modules.identity.service.AccessLevel;
import com.myisland.api.modules.identity.service.PermissionGroup;
import com.myisland.api.modules.identity.service.StaffPermissionChecker;
import com.myisland.api.modules.admin.service.FeatureToggleService;
import com.myisland.api.shared.exceptions.BadRequestException;
import com.myisland.api.shared.exceptions.ResourceNotFoundException;
import com.myisland.api.shared.storage.EntityImage;
import com.myisland.api.shared.storage.EntityImageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class OwnerService {

    private static final Logger log = LoggerFactory.getLogger(OwnerService.class);

    private final OwnerRepository ownerRepository;
    private final LotRepository lotRepository;
    private final AmenityRepository amenityRepository;
    private final BookingRepository bookingRepository;
    private final EntityImageService entityImageService;
    private final LotBlockedPeriodRepository blockedPeriodRepository;
    private final UserRepository userRepository;
    private final SeasonalPricingRuleRepository pricingRuleRepository;
    private final StaffPermissionChecker permissionChecker;
    private final FeatureToggleService featureToggleService;

    public OwnerService(OwnerRepository ownerRepository, LotRepository lotRepository,
                        AmenityRepository amenityRepository, BookingRepository bookingRepository,
                        EntityImageService entityImageService,
                        LotBlockedPeriodRepository blockedPeriodRepository,
                        UserRepository userRepository,
                        SeasonalPricingRuleRepository pricingRuleRepository,
                        StaffPermissionChecker permissionChecker,
                        FeatureToggleService featureToggleService) {
        this.ownerRepository = ownerRepository;
        this.lotRepository = lotRepository;
        this.amenityRepository = amenityRepository;
        this.bookingRepository = bookingRepository;
        this.entityImageService = entityImageService;
        this.blockedPeriodRepository = blockedPeriodRepository;
        this.userRepository = userRepository;
        this.pricingRuleRepository = pricingRuleRepository;
        this.permissionChecker = permissionChecker;
        this.featureToggleService = featureToggleService;
    }

    @Transactional(readOnly = true)
    public OwnerDto getOwnerProfile(Long userId) {
        Owner owner = permissionChecker.resolveOwnerAndCheck(userId, PermissionGroup.PROPERTY, AccessLevel.READ);
        return OwnerDto.from(owner);
    }

    @Transactional
    public OwnerDto updateOwnerProfile(Long userId, UpdateOwnerRequest request) {
        Owner owner = permissionChecker.resolveOwnerAndCheck(userId, PermissionGroup.PROPERTY, AccessLevel.FULL);

        if (request.propertyName() != null) {
            owner.setPropertyName(request.propertyName());
        }
        if (request.county() != null) {
            owner.setCounty(request.county());
        }
        if (request.town() != null) {
            owner.setTown(request.town());
        }
        if (request.propertyType() != null) {
            owner.setPropertyType(Owner.PropertyType.valueOf(request.propertyType()));
        }
        if (request.description() != null) {
            owner.setDescription(request.description());
        }
        if (request.latitude() != null) {
            owner.setLatitude(BigDecimal.valueOf(request.latitude()));
        }
        if (request.longitude() != null) {
            owner.setLongitude(BigDecimal.valueOf(request.longitude()));
        }
        if (request.phone() != null) {
            owner.setPhone(request.phone());
        }
        if (request.website() != null) {
            owner.setWebsite(request.website());
        }
        if (request.amenityIds() != null) {
            Set<Amenity> amenities = new HashSet<>(amenityRepository.findAllById(request.amenityIds()));
            owner.setAmenities(amenities);
        }

        owner = ownerRepository.save(owner);
        log.info("Updated owner profile: {}", owner.getId());
        return OwnerDto.from(owner);
    }

    @Transactional(readOnly = true)
    public List<LotDto> getOwnerLots(Long userId) {
        Owner owner = permissionChecker.resolveOwnerAndCheck(userId, PermissionGroup.LOTS, AccessLevel.READ);

        List<Lot> lots = lotRepository.findByOwnerId(owner.getId());
        List<Long> lotIds = lots.stream().map(Lot::getId).toList();

        // Batch load all images for these lots
        Map<Long, List<EntityImage>> imagesByLotId = entityImageService
                .getImagesForEntities(EntityImage.EntityType.LOT, lotIds);

        return lots.stream()
                .map(lot -> LotDto.from(lot, imagesByLotId.getOrDefault(lot.getId(), List.of())))
                .toList();
    }

    @Transactional
    public LotDto createLot(Long userId, CreateLotRequest request) {
        Owner owner = permissionChecker.resolveOwnerAndCheck(userId, PermissionGroup.LOTS, AccessLevel.FULL);

        Set<Amenity> amenities = new HashSet<>();
        if (request.amenityIds() != null && !request.amenityIds().isEmpty()) {
            amenities.addAll(amenityRepository.findAllById(request.amenityIds()));
        }

        Lot lot = Lot.builder()
                .owner(owner)
                .name(request.name())
                .lotType(Lot.LotType.valueOf(request.lotType()))
                .description(request.description())
                .pricePerNight(request.pricePerNight())
                .maxGuests(request.maxGuests())
                .minStay(request.minStay())
                .imageUrl(request.imageUrl())
                .amenities(amenities)
                .build();

        lot = lotRepository.save(lot);
        log.info("Created new lot: {} for owner: {}", lot.getId(), owner.getId());
        return LotDto.from(lot);
    }

    @Transactional
    public LotDto updateLot(Long userId, Long lotId, UpdateLotRequest request) {
        Owner owner = permissionChecker.resolveOwnerAndCheck(userId, PermissionGroup.LOTS, AccessLevel.FULL);

        Lot lot = lotRepository.findById(lotId)
                .orElseThrow(() -> new ResourceNotFoundException("Lot", lotId));

        if (!lot.getOwner().getId().equals(owner.getId())) {
            throw new BadRequestException("Lot does not belong to this owner");
        }

        if (request.name() != null) {
            lot.setName(request.name());
        }
        if (request.lotType() != null) {
            lot.setLotType(Lot.LotType.valueOf(request.lotType()));
        }
        if (request.description() != null) {
            lot.setDescription(request.description());
        }
        if (request.pricePerNight() != null) {
            lot.setPricePerNight(request.pricePerNight());
        }
        if (request.maxGuests() != null) {
            lot.setMaxGuests(request.maxGuests());
        }
        if (request.minStay() != null) {
            lot.setMinStay(request.minStay());
        }
        if (request.isActive() != null) {
            lot.setActive(request.isActive());
        }
        if (request.imageUrl() != null) {
            lot.setImageUrl(request.imageUrl());
        }
        if (request.amenityIds() != null) {
            Set<Amenity> amenities = new HashSet<>(amenityRepository.findAllById(request.amenityIds()));
            lot.setAmenities(amenities);
        }

        lot = lotRepository.save(lot);
        log.info("Updated lot: {}", lot.getId());
        return LotDto.from(lot);
    }

    @Transactional
    public void deleteLot(Long userId, Long lotId) {
        Owner owner = permissionChecker.resolveOwnerAndCheck(userId, PermissionGroup.LOTS, AccessLevel.FULL);

        Lot lot = lotRepository.findById(lotId)
                .orElseThrow(() -> new ResourceNotFoundException("Lot", lotId));

        if (!lot.getOwner().getId().equals(owner.getId())) {
            throw new BadRequestException("Lot does not belong to this owner");
        }

        // Check for active bookings
        List<Booking> activeBookings = bookingRepository.findByLotIdAndCheckOutDateAfter(
                lotId, LocalDate.now());
        if (!activeBookings.isEmpty()) {
            throw new BadRequestException("Cannot delete lot with active or upcoming bookings");
        }

        lotRepository.delete(lot);
        log.info("Deleted lot: {}", lotId);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getOwnerDashboard(Long userId) {
        Owner owner = permissionChecker.resolveOwnerAndCheck(userId, PermissionGroup.DASHBOARD, AccessLevel.READ);

        List<Lot> lots = lotRepository.findByOwnerId(owner.getId());
        long activeLots = lots.stream().filter(Lot::isActive).count();

        List<Booking> upcomingBookings = bookingRepository.findByOwnerIdAndDateRange(
                owner.getId(), LocalDate.now(), LocalDate.now().plusDays(30));

        long confirmedBookings = upcomingBookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.CONFIRMED)
                .count();

        BigDecimal monthlyRevenue = upcomingBookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.CONFIRMED ||
                        b.getStatus() == Booking.BookingStatus.COMPLETED)
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return Map.of(
                "totalLots", lots.size(),
                "activeLots", activeLots,
                "upcomingBookings", confirmedBookings,
                "monthlyRevenue", monthlyRevenue,
                "recentBookings", upcomingBookings.stream()
                        .limit(5)
                        .map(b -> Map.of(
                                "id", b.getId(),
                                "lotName", b.getLot().getName(),
                                "guestName", b.getUser() != null ? b.getUser().getName() : (b.getGuestName() != null ? b.getGuestName() : "Walk-in"),
                                "checkIn", b.getCheckInDate(),
                                "checkOut", b.getCheckOutDate(),
                                "status", b.getStatus().name()
                        ))
                        .toList()
        );
    }

    @Transactional(readOnly = true)
    public OwnerPreferencesDto getOwnerPreferences(Long userId) {
        Owner owner = permissionChecker.resolveOwnerAndCheck(userId, PermissionGroup.SETTINGS, AccessLevel.READ);
        return OwnerPreferencesDto.from(
                owner.isEmailNotificationsBookings(),
                owner.isWeeklySummaryReports(),
                owner.isInstantBooking(),
                owner.isAllowSameDayBookings(),
                owner.isRequireGuestVerification(),
                owner.isAllowGuestModifications(),
                owner.getModificationDeadlineDays(),
                owner.isRequireModificationApproval()
        );
    }

    @Transactional
    public OwnerPreferencesDto updateOwnerPreferences(Long userId, OwnerPreferencesDto preferences) {
        Owner owner = permissionChecker.resolveOwnerAndCheck(userId, PermissionGroup.SETTINGS, AccessLevel.FULL);

        owner.setEmailNotificationsBookings(preferences.emailNotificationsBookings());
        owner.setWeeklySummaryReports(preferences.weeklySummaryReports());
        owner.setInstantBooking(preferences.instantBooking());
        owner.setAllowSameDayBookings(preferences.allowSameDayBookings());
        owner.setRequireGuestVerification(preferences.requireGuestVerification());
        owner.setAllowGuestModifications(preferences.allowGuestModifications());
        owner.setModificationDeadlineDays(preferences.modificationDeadlineDays());
        owner.setRequireModificationApproval(preferences.requireModificationApproval());

        ownerRepository.save(owner);
        log.info("Updated owner preferences for user: {}", userId);

        return OwnerPreferencesDto.from(
                owner.isEmailNotificationsBookings(),
                owner.isWeeklySummaryReports(),
                owner.isInstantBooking(),
                owner.isAllowSameDayBookings(),
                owner.isRequireGuestVerification(),
                owner.isAllowGuestModifications(),
                owner.getModificationDeadlineDays(),
                owner.isRequireModificationApproval()
        );
    }

    @Transactional(readOnly = true)
    public Map<String, List<BookingDto>> getTodayMovements(Long userId) {
        Owner owner = permissionChecker.resolveOwnerAndCheck(userId, PermissionGroup.TODAY, AccessLevel.READ);

        LocalDate today = LocalDate.now();
        List<BookingDto> arrivals = bookingRepository.findTodayArrivals(owner.getId(), today)
                .stream().map(BookingDto::from).toList();
        List<BookingDto> departures = bookingRepository.findTodayDepartures(owner.getId(), today)
                .stream().map(BookingDto::from).toList();

        log.info("Today's movements for owner {}: {} arrivals, {} departures",
                owner.getId(), arrivals.size(), departures.size());

        return Map.of("arrivals", arrivals, "departures", departures);
    }

    @Transactional(readOnly = true)
    public List<BookingDto> getOwnerBookings(Long userId) {
        Owner owner = permissionChecker.resolveOwnerAndCheck(userId, PermissionGroup.BOOKINGS, AccessLevel.READ);

        List<Booking> bookings = bookingRepository.findByOwnerId(owner.getId());
        log.info("Found {} bookings for owner {}", bookings.size(), owner.getId());

        return bookings.stream()
                .map(BookingDto::from)
                .toList();
    }

    // --- Blocked Periods ---

    @Transactional(readOnly = true)
    public List<BlockedPeriodDto> getBlockedPeriods(Long userId) {
        Owner owner = permissionChecker.resolveOwnerAndCheck(userId, PermissionGroup.CALENDAR, AccessLevel.READ);
        return blockedPeriodRepository.findByOwnerId(owner.getId()).stream()
                .map(BlockedPeriodDto::from)
                .toList();
    }

    @Transactional
    public BlockedPeriodDto createBlockedPeriod(Long userId, CreateBlockedPeriodRequest request) {
        Owner owner = permissionChecker.resolveOwnerAndCheck(userId, PermissionGroup.CALENDAR, AccessLevel.FULL);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        Lot lot = lotRepository.findById(request.lotId())
                .orElseThrow(() -> new ResourceNotFoundException("Lot", request.lotId()));

        if (!lot.getOwner().getId().equals(owner.getId())) {
            throw new BadRequestException("Lot does not belong to this owner");
        }

        if (request.endDate().isBefore(request.startDate()) || request.endDate().isEqual(request.startDate())) {
            throw new BadRequestException("End date must be after start date");
        }

        LotBlockedPeriod bp = new LotBlockedPeriod();
        bp.setLot(lot);
        bp.setStartDate(request.startDate());
        bp.setEndDate(request.endDate());
        bp.setReason(request.reason());
        bp.setCreatedBy(user);

        bp = blockedPeriodRepository.save(bp);
        log.info("Created blocked period {} for lot {}", bp.getId(), lot.getId());

        return BlockedPeriodDto.from(bp);
    }

    @Transactional
    public void deleteBlockedPeriod(Long userId, Long blockedPeriodId) {
        Owner owner = permissionChecker.resolveOwnerAndCheck(userId, PermissionGroup.CALENDAR, AccessLevel.FULL);

        LotBlockedPeriod bp = blockedPeriodRepository.findById(blockedPeriodId)
                .orElseThrow(() -> new ResourceNotFoundException("Blocked period", blockedPeriodId));

        if (!bp.getLot().getOwner().getId().equals(owner.getId())) {
            throw new BadRequestException("Blocked period does not belong to this owner");
        }

        blockedPeriodRepository.delete(bp);
        log.info("Deleted blocked period {}", blockedPeriodId);
    }

    // --- Seasonal Pricing Rules ---

    @Transactional(readOnly = true)
    public List<SeasonalPricingRuleDto> getPricingRules(Long userId) {
        Owner owner = permissionChecker.resolveOwnerAndCheck(userId, PermissionGroup.PRICING, AccessLevel.READ);
        return pricingRuleRepository.findByOwnerId(owner.getId()).stream()
                .map(SeasonalPricingRuleDto::from)
                .toList();
    }

    @Transactional
    public SeasonalPricingRuleDto createPricingRule(Long userId, CreateSeasonalPricingRuleRequest request) {
        Owner owner = permissionChecker.resolveOwnerAndCheck(userId, PermissionGroup.PRICING, AccessLevel.FULL);

        if (request.endDate().isBefore(request.startDate()) || request.endDate().isEqual(request.startDate())) {
            throw new BadRequestException("End date must be after start date");
        }

        Lot.LotType lotType;
        try {
            lotType = Lot.LotType.valueOf(request.lotType());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid lot type: " + request.lotType());
        }

        SeasonalPricingRule rule = new SeasonalPricingRule();
        rule.setOwner(owner);
        rule.setLotType(lotType);
        rule.setName(request.name());
        rule.setStartDate(request.startDate());
        rule.setEndDate(request.endDate());
        rule.setPricePerNight(request.pricePerNight());

        rule = pricingRuleRepository.save(rule);
        log.info("Created pricing rule {} for owner {}", rule.getId(), owner.getId());

        return SeasonalPricingRuleDto.from(rule);
    }

    @Transactional
    public void deletePricingRule(Long userId, Long ruleId) {
        Owner owner = permissionChecker.resolveOwnerAndCheck(userId, PermissionGroup.PRICING, AccessLevel.FULL);

        SeasonalPricingRule rule = pricingRuleRepository.findById(ruleId)
                .orElseThrow(() -> new ResourceNotFoundException("Pricing rule", ruleId));

        if (!rule.getOwner().getId().equals(owner.getId())) {
            throw new BadRequestException("Pricing rule does not belong to this owner");
        }

        pricingRuleRepository.delete(rule);
        log.info("Deleted pricing rule {}", ruleId);
    }

    @Transactional(readOnly = true)
    public LotsDetailResponse getLotsAnalytics(Long userId) {
        Owner owner = permissionChecker.resolveOwnerAndCheck(userId, PermissionGroup.DASHBOARD, AccessLevel.READ);

        // Require active subscription to access analytics
        requireActiveSubscription(owner);

        List<Lot> lots = lotRepository.findByOwnerId(owner.getId());

        int available = (int) lots.stream().filter(Lot::isActive).count();
        int unavailable = lots.size() - available;

        Map<String, Integer> byType = new HashMap<>();
        for (Lot lot : lots) {
            String type = lot.getLotType().name().toLowerCase().replace("_", "-");
            byType.merge(type, 1, Integer::sum);
        }

        LotsDetailResponse.Summary summary = new LotsDetailResponse.Summary(
                lots.size(),
                available,
                unavailable,
                byType
        );

        List<LotsDetailResponse.LotDetail> lotDetails = lots.stream()
                .map(lot -> new LotsDetailResponse.LotDetail(
                        lot.getId(),
                        lot.getName(),
                        lot.getLotType().name().toLowerCase().replace("_", "-"),
                        lot.getPricePerNight(),
                        lot.isActive(),
                        lot.getAmenities().stream().map(Amenity::getName).toList()
                ))
                .toList();

        return new LotsDetailResponse(summary, lotDetails);
    }

    @Transactional(readOnly = true)
    public BookingsDetailResponse getBookingsAnalytics(Long userId) {
        Owner owner = permissionChecker.resolveOwnerAndCheck(userId, PermissionGroup.DASHBOARD, AccessLevel.READ);

        // Require active subscription to access analytics
        requireActiveSubscription(owner);

        List<Booking> allBookings = bookingRepository.findByOwnerId(owner.getId());

        LocalDate today = LocalDate.now();
        LocalDate weekEnd = today.plusDays(7);

        int confirmed = 0;
        int pending = 0;
        int cancelled = 0;
        int checkInsThisWeek = 0;
        int checkOutsThisWeek = 0;

        for (Booking b : allBookings) {
            switch (b.getStatus()) {
                case CONFIRMED -> confirmed++;
                case PENDING -> pending++;
                case CANCELLED -> cancelled++;
                default -> { }
            }

            if (!b.getCheckInDate().isBefore(today) && !b.getCheckInDate().isAfter(weekEnd)) {
                checkInsThisWeek++;
            }
            if (!b.getCheckOutDate().isBefore(today) && !b.getCheckOutDate().isAfter(weekEnd)) {
                checkOutsThisWeek++;
            }
        }

        BookingsDetailResponse.Summary summary = new BookingsDetailResponse.Summary(
                allBookings.size(),
                confirmed,
                pending,
                cancelled,
                checkInsThisWeek,
                checkOutsThisWeek
        );

        List<BookingsDetailResponse.BookingDetail> bookingDetails = allBookings.stream()
                .map(b -> new BookingsDetailResponse.BookingDetail(
                        b.getId(),
                        b.getUser() != null ? b.getUser().getName() : (b.getGuestName() != null ? b.getGuestName() : "Walk-in"),
                        b.getLot().getName(),
                        b.getLot().getLotType().name().toLowerCase().replace("_", "-"),
                        b.getCheckInDate(),
                        b.getCheckOutDate(),
                        b.getStatus().name().toLowerCase(),
                        b.getTotalPrice(),
                        b.getNumGuests()
                ))
                .toList();

        return new BookingsDetailResponse(summary, bookingDetails);
    }

    @Transactional(readOnly = true)
    public RevenueDetailResponse getRevenueAnalytics(Long userId) {
        Owner owner = permissionChecker.resolveOwnerAndCheck(userId, PermissionGroup.DASHBOARD, AccessLevel.READ);

        // Require active subscription to access analytics
        requireActiveSubscription(owner);

        List<Booking> allBookings = bookingRepository.findByOwnerId(owner.getId());

        LocalDate today = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(today);
        YearMonth lastMonth = currentMonth.minusMonths(1);
        LocalDate yearStart = today.withDayOfYear(1);

        BigDecimal thisMonthRevenue = BigDecimal.ZERO;
        BigDecimal lastMonthRevenue = BigDecimal.ZERO;
        BigDecimal yearToDate = BigDecimal.ZERO;
        int completedBookings = 0;

        Map<String, BigDecimal> revenueByType = new HashMap<>();
        Map<String, Integer> bookingsByLot = new HashMap<>();
        Map<String, BigDecimal> revenueByLot = new HashMap<>();
        Map<String, String> lotTypes = new HashMap<>();
        Map<YearMonth, BigDecimal> monthlyRevenue = new TreeMap<>();

        for (Booking b : allBookings) {
            if (b.getStatus() == Booking.BookingStatus.CONFIRMED ||
                b.getStatus() == Booking.BookingStatus.COMPLETED) {

                BigDecimal price = b.getTotalPrice();
                YearMonth bookingMonth = YearMonth.from(b.getCheckInDate());

                if (bookingMonth.equals(currentMonth)) {
                    thisMonthRevenue = thisMonthRevenue.add(price);
                }
                if (bookingMonth.equals(lastMonth)) {
                    lastMonthRevenue = lastMonthRevenue.add(price);
                }
                if (!b.getCheckInDate().isBefore(yearStart)) {
                    yearToDate = yearToDate.add(price);
                    completedBookings++;
                }

                String lotType = b.getLot().getLotType().name().toLowerCase().replace("_", "-");
                revenueByType.merge(lotType, price, BigDecimal::add);

                String lotName = b.getLot().getName();
                revenueByLot.merge(lotName, price, BigDecimal::add);
                bookingsByLot.merge(lotName, 1, Integer::sum);
                lotTypes.put(lotName, lotType);

                monthlyRevenue.merge(bookingMonth, price, BigDecimal::add);
            }
        }

        BigDecimal avgBookingValue = completedBookings > 0
                ? yearToDate.divide(BigDecimal.valueOf(completedBookings), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        BigDecimal monthOverMonthChange = lastMonthRevenue.compareTo(BigDecimal.ZERO) > 0
                ? thisMonthRevenue.subtract(lastMonthRevenue)
                        .divide(lastMonthRevenue, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;

        RevenueDetailResponse.Summary summary = new RevenueDetailResponse.Summary(
                thisMonthRevenue,
                lastMonthRevenue,
                yearToDate,
                avgBookingValue,
                monthOverMonthChange
        );

        // Monthly trend for last 6 months
        List<RevenueDetailResponse.MonthlyTrend> monthlyTrend = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth month = currentMonth.minusMonths(i);
            BigDecimal revenue = monthlyRevenue.getOrDefault(month, BigDecimal.ZERO);
            monthlyTrend.add(new RevenueDetailResponse.MonthlyTrend(
                    month.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                    revenue
            ));
        }

        // Revenue by type with percentage
        BigDecimal totalRevenue = revenueByType.values().stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        List<RevenueDetailResponse.RevenueByType> byType = revenueByType.entrySet().stream()
                .map(e -> new RevenueDetailResponse.RevenueByType(
                        e.getKey(),
                        e.getValue(),
                        totalRevenue.compareTo(BigDecimal.ZERO) > 0
                                ? e.getValue().divide(totalRevenue, 4, RoundingMode.HALF_UP)
                                        .multiply(BigDecimal.valueOf(100))
                                : BigDecimal.ZERO
                ))
                .toList();

        // Top lots by revenue
        List<RevenueDetailResponse.TopLot> topLots = revenueByLot.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .limit(5)
                .map(e -> new RevenueDetailResponse.TopLot(
                        e.getKey(),
                        lotTypes.get(e.getKey()),
                        e.getValue(),
                        bookingsByLot.getOrDefault(e.getKey(), 0)
                ))
                .toList();

        return new RevenueDetailResponse(summary, monthlyTrend, byType, topLots);
    }

    @Transactional(readOnly = true)
    public OccupancyDetailResponse getOccupancyAnalytics(Long userId) {
        Owner owner = permissionChecker.resolveOwnerAndCheck(userId, PermissionGroup.DASHBOARD, AccessLevel.READ);

        // Require active subscription to access analytics
        requireActiveSubscription(owner);

        List<Lot> lots = lotRepository.findByOwnerId(owner.getId());
        List<Booking> activeBookings = bookingRepository.findByOwnerIdAndDateRange(
                owner.getId(), LocalDate.now(), LocalDate.now());

        int totalLots = lots.size();
        int occupiedLots = (int) activeBookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.CONFIRMED || b.getStatus() == Booking.BookingStatus.CHECKED_IN)
                .map(b -> b.getLot().getId())
                .distinct()
                .count();
        int availableLots = totalLots - occupiedLots;

        BigDecimal currentRate = totalLots > 0
                ? BigDecimal.valueOf(occupiedLots)
                        .divide(BigDecimal.valueOf(totalLots), 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;

        // Calculate average stay duration from recent bookings
        List<Booking> recentBookings = bookingRepository.findByOwnerIdAndDateRange(
                owner.getId(), LocalDate.now().minusDays(90), LocalDate.now());
        double avgDuration = recentBookings.stream()
                .mapToLong(b -> ChronoUnit.DAYS.between(b.getCheckInDate(), b.getCheckOutDate()))
                .average()
                .orElse(0);

        OccupancyDetailResponse.Summary summary = new OccupancyDetailResponse.Summary(
                currentRate,
                totalLots,
                availableLots,
                occupiedLots,
                BigDecimal.valueOf(avgDuration).setScale(1, RoundingMode.HALF_UP)
        );

        // Occupancy by type
        Map<String, int[]> typeStats = new HashMap<>(); // [total, occupied]
        for (Lot lot : lots) {
            String type = lot.getLotType().name().toLowerCase().replace("_", "-");
            typeStats.computeIfAbsent(type, k -> new int[2]);
            typeStats.get(type)[0]++;
        }
        for (Booking b : activeBookings) {
            if (b.getStatus() == Booking.BookingStatus.CONFIRMED || b.getStatus() == Booking.BookingStatus.CHECKED_IN) {
                String type = b.getLot().getLotType().name().toLowerCase().replace("_", "-");
                if (typeStats.containsKey(type)) {
                    typeStats.get(type)[1]++;
                }
            }
        }
        List<OccupancyDetailResponse.OccupancyByType> byType = typeStats.entrySet().stream()
                .map(e -> new OccupancyDetailResponse.OccupancyByType(
                        e.getKey(),
                        e.getValue()[0],
                        e.getValue()[1],
                        e.getValue()[0] > 0
                                ? BigDecimal.valueOf(e.getValue()[1])
                                        .divide(BigDecimal.valueOf(e.getValue()[0]), 4, RoundingMode.HALF_UP)
                                        .multiply(BigDecimal.valueOf(100))
                                : BigDecimal.ZERO
                ))
                .toList();

        // Weekly trend (last 7 days)
        List<OccupancyDetailResponse.WeeklyTrend> weeklyTrend = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate day = LocalDate.now().minusDays(i);
            List<Booking> dayBookings = bookingRepository.findByOwnerIdAndDateRange(
                    owner.getId(), day, day);
            long occupiedOnDay = dayBookings.stream()
                    .filter(b -> b.getStatus() == Booking.BookingStatus.CONFIRMED || b.getStatus() == Booking.BookingStatus.CHECKED_IN)
                    .map(b -> b.getLot().getId())
                    .distinct()
                    .count();
            BigDecimal rate = totalLots > 0
                    ? BigDecimal.valueOf(occupiedOnDay)
                            .divide(BigDecimal.valueOf(totalLots), 4, RoundingMode.HALF_UP)
                            .multiply(BigDecimal.valueOf(100))
                    : BigDecimal.ZERO;
            weeklyTrend.add(new OccupancyDetailResponse.WeeklyTrend(
                    day.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                    rate
            ));
        }

        // Peak days analysis
        Map<DayOfWeek, List<BigDecimal>> dayRates = new EnumMap<>(DayOfWeek.class);
        for (OccupancyDetailResponse.WeeklyTrend trend : weeklyTrend) {
            DayOfWeek dow = DayOfWeek.valueOf(trend.day().toUpperCase().substring(0, 3).equals("THU") ? "THURSDAY" :
                    trend.day().toUpperCase().substring(0, 3).equals("TUE") ? "TUESDAY" :
                    trend.day().toUpperCase().substring(0, 3).equals("WED") ? "WEDNESDAY" :
                    trend.day().toUpperCase().substring(0, 3).equals("SAT") ? "SATURDAY" :
                    trend.day().toUpperCase().substring(0, 3).equals("SUN") ? "SUNDAY" :
                    trend.day().toUpperCase().substring(0, 3).equals("MON") ? "MONDAY" : "FRIDAY");
            dayRates.computeIfAbsent(dow, k -> new ArrayList<>()).add(trend.rate());
        }
        List<OccupancyDetailResponse.PeakDay> peakDays = dayRates.entrySet().stream()
                .map(e -> new OccupancyDetailResponse.PeakDay(
                        e.getKey().getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                        e.getValue().stream()
                                .reduce(BigDecimal.ZERO, BigDecimal::add)
                                .divide(BigDecimal.valueOf(e.getValue().size()), 2, RoundingMode.HALF_UP)
                ))
                .sorted((a, b) -> b.avgRate().compareTo(a.avgRate()))
                .limit(3)
                .toList();

        return new OccupancyDetailResponse(summary, byType, weeklyTrend, peakDays);
    }

    /**
     * Helper method to enforce subscription requirement for premium features.
     */
    private void requireActiveSubscription(Owner owner) {
        if (featureToggleService.isSubscriptionEnforced() && !owner.hasActiveSubscription()) {
            throw new BadRequestException("An active subscription is required to access this feature.");
        }
    }
}
