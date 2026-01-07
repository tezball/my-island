package com.example.myislandapi.fixture;

import com.example.myislandapi.enums.Facility;
import com.example.myislandapi.enums.LotType;
import com.example.myislandapi.model.CampsiteModel;
import com.example.myislandapi.model.Location;
import com.example.myislandapi.model.LotModel;
import com.example.myislandapi.model.UserModel;
import com.example.myislandapi.repository.jdbc.JdbcBookingRepository;
import com.example.myislandapi.repository.jdbc.JdbcCampsiteRepository;
import com.example.myislandapi.repository.jdbc.JdbcLotRepository;
import com.example.myislandapi.repository.jdbc.JdbcUserRepository;
import com.example.myislandapi.security.JwtTokenProvider;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * Test data seeder for creating test entities in integration tests.
 * Provides methods to create users, campsites, lots, and bookings for testing.
 */
@Component
public class TestDataSeeder {

    private final JdbcUserRepository userRepository;
    private final JdbcCampsiteRepository campsiteRepository;
    private final JdbcLotRepository lotRepository;
    private final JdbcBookingRepository bookingRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final NamedParameterJdbcTemplate jdbc;

    public TestDataSeeder(JdbcUserRepository userRepository,
                          JdbcCampsiteRepository campsiteRepository,
                          JdbcLotRepository lotRepository,
                          JdbcBookingRepository bookingRepository,
                          JwtTokenProvider jwtTokenProvider,
                          PasswordEncoder passwordEncoder,
                          NamedParameterJdbcTemplate jdbc) {
        this.userRepository = userRepository;
        this.campsiteRepository = campsiteRepository;
        this.lotRepository = lotRepository;
        this.bookingRepository = bookingRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.jdbc = jdbc;
    }

    /**
     * Create a user and return a JWT token for authentication.
     */
    @Transactional
    public String createUserAndGetToken(String email, boolean isOwner, boolean isSupplier) {
        UserModel user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    UserModel newUser = new UserModel();
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
    public UserModel createUser(String email, String name, boolean isOwner) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> {
                    UserModel user = new UserModel();
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
    public CampsiteModel createCampsite(UserModel owner, String name) {
        CampsiteModel campsite = new CampsiteModel();
        campsite.setName(name);
        campsite.setDescription("A beautiful test campsite for camping enthusiasts");
        campsite.setOwnerId(owner.getId());
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
    public CampsiteModel createCampsite(String name) {
        UserModel owner = createUser("campsiteowner@test.com", "Campsite Owner", true);
        return createCampsite(owner, name);
    }

    /**
     * Create a lot for a campsite.
     */
    @Transactional
    public LotModel createLot(CampsiteModel campsite, String name, LotType type, BigDecimal pricePerNight) {
        LotModel lot = new LotModel();
        lot.setCampsiteId(campsite.getId());
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
    public LotModel createLot(CampsiteModel campsite) {
        return createLot(campsite, "Lot " + System.currentTimeMillis(), LotType.TENT, new BigDecimal("35.00"));
    }

    /**
     * Get or create an available lot for booking tests.
     */
    @Transactional
    public LotModel getOrCreateAvailableLot() {
        // First try to find an existing available lot from any campsite
        String sql = "SELECT id FROM lots WHERE available = true LIMIT 1";
        List<UUID> lotIds = jdbc.query(sql, Map.of(), (rs, rowNum) -> UUID.fromString(rs.getString("id")));

        if (!lotIds.isEmpty()) {
            return lotRepository.findById(lotIds.get(0)).orElse(null);
        }

        // Create a new campsite and lot if none found
        CampsiteModel campsite = createCampsite("Test Campsite " + System.currentTimeMillis());
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
        UserModel owner = createUser("owner_" + System.currentTimeMillis() + "@test.com", "Test Owner", true);
        CampsiteModel campsite = createCampsite(owner, "Complete Setup Campsite");
        LotModel lot = createLot(campsite);
        String ownerToken = jwtTokenProvider.generateAccessToken(owner.getId(), owner.getEmail());
        return new TestSetup(owner, campsite, lot, ownerToken);
    }

    /**
     * Clean up all test data.
     */
    @Transactional
    public void cleanupAllData() {
        // Delete in order of foreign key dependencies
        jdbc.update("DELETE FROM booking_extras", Map.of());
        jdbc.update("DELETE FROM bookings", Map.of());
        jdbc.update("DELETE FROM lot_availability", Map.of());
        jdbc.update("DELETE FROM lot_images", Map.of());
        jdbc.update("DELETE FROM lot_amenities", Map.of());
        jdbc.update("DELETE FROM lots", Map.of());
        jdbc.update("DELETE FROM campsite_images", Map.of());
        jdbc.update("DELETE FROM campsite_facilities", Map.of());
        jdbc.update("DELETE FROM campsites", Map.of());
        jdbc.update("DELETE FROM linked_accounts", Map.of());
        jdbc.update("DELETE FROM users", Map.of());
    }

    /**
     * Record to hold a complete test setup.
     */
    public record TestSetup(UserModel owner, CampsiteModel campsite, LotModel lot, String ownerToken) {}
}
