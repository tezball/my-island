package com.example.myislandapi.integration.repository;

import com.example.myislandapi.config.AbstractIntegrationTest;
import com.example.myislandapi.entity.Booking;
import com.example.myislandapi.entity.Campsite;
import com.example.myislandapi.entity.Location;
import com.example.myislandapi.entity.Lot;
import com.example.myislandapi.entity.User;
import com.example.myislandapi.enums.BookingStatus;
import com.example.myislandapi.enums.LotType;
import com.example.myislandapi.repository.BookingRepository;
import com.example.myislandapi.repository.CampsiteRepository;
import com.example.myislandapi.repository.LotRepository;
import com.example.myislandapi.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for BookingRepository.
 * Tests custom queries against real PostgreSQL database.
 */
@Transactional
@DisplayName("BookingRepository Integration Tests")
class BookingRepositoryTest extends AbstractIntegrationTest {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CampsiteRepository campsiteRepository;

    @Autowired
    private LotRepository lotRepository;

    private User user;
    private User owner;
    private Campsite campsite;
    private Lot lot;

    @BeforeEach
    void setUpData() {
        // Create owner
        owner = new User();
        owner.setEmail("owner_" + System.currentTimeMillis() + "@test.com");
        owner.setPasswordHash("hash");
        owner.setName("Test Owner");
        owner.setOwner(true);
        owner = userRepository.save(owner);

        // Create user
        user = new User();
        user.setEmail("user_" + System.currentTimeMillis() + "@test.com");
        user.setPasswordHash("hash");
        user.setName("Test User");
        user = userRepository.save(user);

        // Create campsite
        campsite = new Campsite();
        campsite.setName("Test Campsite " + System.currentTimeMillis());
        campsite.setDescription("Test Description");
        campsite.setOwner(owner);
        campsite.setLocation(new Location("Test Address", "Dublin", 53.35, -6.26));
        campsite.setActive(true);
        campsite = campsiteRepository.save(campsite);

        // Create lot
        lot = new Lot();
        lot.setCampsite(campsite);
        lot.setName("Test Lot");
        lot.setType(LotType.TENT);
        lot.setCapacity(4);
        lot.setPricePerNight(new BigDecimal("50.00"));
        lot.setAvailable(true);
        lot = lotRepository.save(lot);
    }

    @Test
    @DisplayName("Should find bookings by user ID")
    void findByUserId_shouldReturnUserBookings() {
        // Create bookings
        Booking booking = createBooking(user, lot, LocalDate.now().plusDays(10), LocalDate.now().plusDays(13));
        bookingRepository.save(booking);

        Page<Booking> result = bookingRepository.findByUserId(user.getId(), PageRequest.of(0, 10));

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getUser().getId()).isEqualTo(user.getId());
    }

    @Test
    @DisplayName("Should find bookings by user ID and status")
    void findByUserIdAndStatus_shouldFilterByStatus() {
        // Create pending booking
        Booking pending = createBooking(user, lot, LocalDate.now().plusDays(10), LocalDate.now().plusDays(13));
        pending.setStatus(BookingStatus.PENDING);
        bookingRepository.save(pending);

        // Create confirmed booking
        Booking confirmed = createBooking(user, lot, LocalDate.now().plusDays(20), LocalDate.now().plusDays(23));
        confirmed.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(confirmed);

        Page<Booking> pendingResult = bookingRepository.findByUserIdAndStatus(
                user.getId(), BookingStatus.PENDING, PageRequest.of(0, 10));
        Page<Booking> confirmedResult = bookingRepository.findByUserIdAndStatus(
                user.getId(), BookingStatus.CONFIRMED, PageRequest.of(0, 10));

        assertThat(pendingResult.getContent()).hasSize(1);
        assertThat(pendingResult.getContent().get(0).getStatus()).isEqualTo(BookingStatus.PENDING);
        assertThat(confirmedResult.getContent()).hasSize(1);
        assertThat(confirmedResult.getContent().get(0).getStatus()).isEqualTo(BookingStatus.CONFIRMED);
    }

    @Test
    @DisplayName("Should find conflicting bookings for overlapping dates")
    void findConflictingBookings_shouldFindOverlappingBookings() {
        // Create existing booking: June 5-10
        Booking existing = createBooking(user, lot, LocalDate.of(2025, 6, 5), LocalDate.of(2025, 6, 10));
        existing.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(existing);

        // Query for overlapping dates: June 8-12
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                lot.getId(),
                LocalDate.of(2025, 6, 8),
                LocalDate.of(2025, 6, 12));

        assertThat(conflicts).hasSize(1);
    }

    @Test
    @DisplayName("Should not find conflicts for non-overlapping dates")
    void findConflictingBookings_shouldNotFindNonOverlapping() {
        // Create existing booking: June 5-10
        Booking existing = createBooking(user, lot, LocalDate.of(2025, 6, 5), LocalDate.of(2025, 6, 10));
        existing.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(existing);

        // Query for non-overlapping dates: June 15-20
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                lot.getId(),
                LocalDate.of(2025, 6, 15),
                LocalDate.of(2025, 6, 20));

        assertThat(conflicts).isEmpty();
    }

    @Test
    @DisplayName("Should not find conflicts for cancelled bookings")
    void findConflictingBookings_shouldIgnoreCancelledBookings() {
        // Create cancelled booking: June 5-10
        Booking cancelled = createBooking(user, lot, LocalDate.of(2025, 6, 5), LocalDate.of(2025, 6, 10));
        cancelled.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(cancelled);

        // Query for overlapping dates
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                lot.getId(),
                LocalDate.of(2025, 6, 7),
                LocalDate.of(2025, 6, 12));

        assertThat(conflicts).isEmpty();
    }

    @Test
    @DisplayName("Should find bookings by owner ID")
    void findByOwnerId_shouldReturnOwnerBookings() {
        // Create booking on owner's lot
        Booking booking = createBooking(user, lot, LocalDate.now().plusDays(30), LocalDate.now().plusDays(33));
        bookingRepository.save(booking);

        Page<Booking> result = bookingRepository.findByOwnerId(owner.getId(), PageRequest.of(0, 10));

        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    @DisplayName("Should find bookings by lot ID")
    void findByLotId_shouldReturnLotBookings() {
        // Create bookings for the lot
        Booking booking1 = createBooking(user, lot, LocalDate.now().plusDays(40), LocalDate.now().plusDays(43));
        Booking booking2 = createBooking(user, lot, LocalDate.now().plusDays(50), LocalDate.now().plusDays(53));
        bookingRepository.save(booking1);
        bookingRepository.save(booking2);

        List<Booking> result = bookingRepository.findByLotId(lot.getId());

        assertThat(result).hasSize(2);
    }

    @Test
    @DisplayName("Should find bookings by campsite ID")
    void findByCampsiteId_shouldReturnCampsiteBookings() {
        Booking booking = createBooking(user, lot, LocalDate.now().plusDays(60), LocalDate.now().plusDays(63));
        bookingRepository.save(booking);

        Page<Booking> result = bookingRepository.findByCampsiteId(campsite.getId(), PageRequest.of(0, 10));

        assertThat(result.getContent()).hasSize(1);
    }

    private Booking createBooking(User user, Lot lot, LocalDate checkIn, LocalDate checkOut) {
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setLot(lot);
        booking.setCheckIn(checkIn);
        booking.setCheckOut(checkOut);
        booking.setGuests(2);
        booking.setStatus(BookingStatus.PENDING);
        booking.setLotPrice(new BigDecimal("150.00"));
        booking.setTotalPrice(new BigDecimal("160.00"));
        return booking;
    }
}
