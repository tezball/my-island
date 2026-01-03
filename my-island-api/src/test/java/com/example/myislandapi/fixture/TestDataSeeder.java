package com.example.myislandapi.fixture;

import com.example.myislandapi.entity.Campsite;
import com.example.myislandapi.entity.Location;
import com.example.myislandapi.entity.Lot;
import com.example.myislandapi.entity.User;
import com.example.myislandapi.enums.Facility;
import com.example.myislandapi.enums.LotType;
import com.example.myislandapi.repository.BookingRepository;
import com.example.myislandapi.repository.CampsiteRepository;
import com.example.myislandapi.repository.LotRepository;
import com.example.myislandapi.repository.UserRepository;
import com.example.myislandapi.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * Test data seeder for creating test entities in integration tests.
 * Provides methods to create users, campsites, lots, and bookings for testing.
 */
@Component
public class TestDataSeeder {

    private final UserRepository userRepository;
    private final CampsiteRepository campsiteRepository;
    private final LotRepository lotRepository;
    private final BookingRepository bookingRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public TestDataSeeder(UserRepository userRepository,
                          CampsiteRepository campsiteRepository,
                          LotRepository lotRepository,
                          BookingRepository bookingRepository,
                          JwtTokenProvider jwtTokenProvider,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.campsiteRepository = campsiteRepository;
        this.lotRepository = lotRepository;
        this.bookingRepository = bookingRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Create a user and return a JWT token for authentication.
     */
    @Transactional
    public String createUserAndGetToken(String email, boolean isOwner, boolean isSupplier) {
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setPasswordHash(passwordEncoder.encode("TestPass123!"));
                    newUser.setName("Test User");
                    newUser.setOwner(isOwner);
                    newUser.setSupplier(isSupplier);
                    return userRepository.save(newUser);
                });

        return jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
    }

    /**
     * Create an owner user and return token.
     */
    @Transactional
    public String createOwnerAndGetToken() {
        String email = "owner_" + System.currentTimeMillis() + "@test.com";
        return createUserAndGetToken(email, true, false);
    }

    /**
     * Create a regular user and return token.
     */
    @Transactional
    public String createRegularUserAndGetToken() {
        String email = "user_" + System.currentTimeMillis() + "@test.com";
        return createUserAndGetToken(email, false, false);
    }

    /**
     * Create a user entity without a token.
     */
    @Transactional
    public User createUser(String email, String name, boolean isOwner) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User user = new User();
                    user.setEmail(email);
                    user.setPasswordHash(passwordEncoder.encode("TestPass123!"));
                    user.setName(name);
                    user.setOwner(isOwner);
                    return userRepository.save(user);
                });
    }

    /**
     * Create a test campsite with an owner.
     */
    @Transactional
    public Campsite createCampsite(User owner, String name) {
        Campsite campsite = new Campsite();
        campsite.setName(name);
        campsite.setDescription("A beautiful test campsite for camping enthusiasts");
        campsite.setOwner(owner);
        campsite.setActive(true);
        campsite.setFeatured(false);
        campsite.setPricePerNight(new BigDecimal("50.00"));
        campsite.setLocation(new Location(
                "123 Test Street",
                "Dublin",
                53.3498,
                -6.2603
        ));
        campsite.setFacilities(Set.of(Facility.WIFI, Facility.SHOWER, Facility.TOILET));
        campsite.setImages(List.of("https://example.com/image1.jpg"));
        return campsiteRepository.save(campsite);
    }

    /**
     * Create a test campsite with default owner.
     */
    @Transactional
    public Campsite createCampsite(String name) {
        User owner = createUser("campsiteowner@test.com", "Campsite Owner", true);
        return createCampsite(owner, name);
    }

    /**
     * Create a lot for a campsite.
     */
    @Transactional
    public Lot createLot(Campsite campsite, String name, LotType type, BigDecimal pricePerNight) {
        Lot lot = new Lot();
        lot.setCampsite(campsite);
        lot.setName(name);
        lot.setType(type);
        lot.setCapacity(4);
        lot.setPricePerNight(pricePerNight);
        lot.setAvailable(true);
        lot.setAmenities(List.of("Fire Pit", "Picnic Table"));
        return lotRepository.save(lot);
    }

    /**
     * Create a lot with default values.
     */
    @Transactional
    public Lot createLot(Campsite campsite) {
        return createLot(campsite, "Lot " + System.currentTimeMillis(), LotType.TENT, new BigDecimal("35.00"));
    }

    /**
     * Get or create an available lot for booking tests.
     */
    @Transactional
    public Lot getOrCreateAvailableLot() {
        // First try to find an existing available lot
        List<Lot> allLots = lotRepository.findAll();
        for (Lot lot : allLots) {
            if (lot.isAvailable()) {
                return lot;
            }
        }

        // Create a new campsite and lot if none found
        Campsite campsite = createCampsite("Test Campsite " + System.currentTimeMillis());
        return createLot(campsite);
    }

    /**
     * Get the ID of an available lot.
     */
    @Transactional
    public UUID getAvailableLotId() {
        return getOrCreateAvailableLot().getId();
    }

    /**
     * Create a complete test setup: owner, campsite, and lot.
     */
    @Transactional
    public TestSetup createCompleteSetup() {
        User owner = createUser("owner_" + System.currentTimeMillis() + "@test.com", "Test Owner", true);
        Campsite campsite = createCampsite(owner, "Complete Setup Campsite");
        Lot lot = createLot(campsite);
        String ownerToken = jwtTokenProvider.generateAccessToken(owner.getId(), owner.getEmail());
        return new TestSetup(owner, campsite, lot, ownerToken);
    }

    /**
     * Clean up all test data.
     */
    @Transactional
    public void cleanupAllData() {
        bookingRepository.deleteAll();
        lotRepository.deleteAll();
        campsiteRepository.deleteAll();
        userRepository.deleteAll();
    }

    /**
     * Record to hold a complete test setup.
     */
    public record TestSetup(User owner, Campsite campsite, Lot lot, String ownerToken) {}
}
