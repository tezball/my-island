package com.example.myislandapi.config;

import com.example.myislandapi.entity.Campsite;
import com.example.myislandapi.entity.FAQ;
import com.example.myislandapi.entity.LocalBusiness;
import com.example.myislandapi.entity.Location;
import com.example.myislandapi.entity.Lot;
import com.example.myislandapi.entity.Offer;
import com.example.myislandapi.entity.User;
import com.example.myislandapi.enums.Facility;
import com.example.myislandapi.enums.LotType;
import com.example.myislandapi.enums.OfferCategory;
import com.example.myislandapi.enums.SupplierCategory;
import com.example.myislandapi.repository.CampsiteRepository;
import com.example.myislandapi.repository.FAQRepository;
import com.example.myislandapi.repository.LocalBusinessRepository;
import com.example.myislandapi.repository.LotRepository;
import com.example.myislandapi.repository.OfferRepository;
import com.example.myislandapi.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Configuration
@Profile("!test")  // Run in all profiles except test
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Value("${app.sample-data.enabled:true}")
    private boolean sampleDataEnabled;

    private final Random random = new Random(42);

    private static final String[] IRISH_COUNTIES = {
        "Kerry", "Cork", "Galway", "Clare", "Donegal", "Mayo", "Wicklow",
        "Wexford", "Sligo", "Waterford", "Tipperary", "Limerick"
    };

    private static final String[] CAMPSITE_NAMES = {
        "Wild Atlantic Camping", "Cliffs View Campsite", "Lakeside Haven",
        "Mountain Retreat", "Coastal Paradise", "Forest Hideaway",
        "River's Edge Camp", "Sunset Valley", "Ocean Breeze Camping",
        "Hidden Glen", "Emerald Fields", "Starlight Camping"
    };

    private static final String[] LOT_NAMES = {
        "Meadow View", "Oak Grove", "Riverside", "Hilltop", "Valley Floor",
        "Forest Edge", "Sunset Spot", "Morning Dew", "Wild Flower", "Fern Glade"
    };

    @Bean
    CommandLineRunner initDatabase(
            UserRepository userRepository,
            CampsiteRepository campsiteRepository,
            LotRepository lotRepository,
            FAQRepository faqRepository,
            OfferRepository offerRepository,
            LocalBusinessRepository localBusinessRepository,
            com.example.myislandapi.repository.BookingRepository bookingRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            // Always ensure demo accounts exist (even if database is already seeded)
            ensureDemoAccounts(userRepository, passwordEncoder);

            // If sample data is disabled, only create demo accounts and exit
            if (!sampleDataEnabled) {
                log.info("Sample data disabled - only demo accounts created (blank state)");
                return;
            }

            if (campsiteRepository.count() > 0) {
                log.info("Database already seeded, skipping initialization");
                // Still seed local businesses if they don't exist
                if (localBusinessRepository.count() == 0) {
                    List<LocalBusiness> businesses = createLocalBusinesses(localBusinessRepository);
                    log.info("Created {} local businesses", businesses.size());
                }
                return;
            }

            log.info("Starting database initialization...");

            // Create owner users
            List<User> owners = createOwners(userRepository, passwordEncoder);
            log.info("Created {} owner users", owners.size());

            // Create regular users
            List<User> users = createUsers(userRepository, passwordEncoder);
            log.info("Created {} regular users", users.size());

            // Create featured test campsites with diverse lot types
            List<Campsite> testCampsites = createFeaturedTestCampsites(campsiteRepository, lotRepository, owners);
            log.info("Created {} featured test campsites", testCampsites.size());

            // Create additional campsites with lots
            List<Campsite> campsites = createCampsites(campsiteRepository, lotRepository, owners);
            campsites.addAll(testCampsites);
            log.info("Created {} total campsites", campsites.size());

            // Create FAQs
            List<FAQ> faqs = createFAQs(faqRepository);
            log.info("Created {} FAQs", faqs.size());

            // Create offers
            List<Offer> offers = createOffers(offerRepository, campsites);
            log.info("Created {} offers", offers.size());

            // Create local businesses (suppliers)
            List<LocalBusiness> businesses = createLocalBusinesses(localBusinessRepository);
            log.info("Created {} local businesses", businesses.size());

            // Add owner dashboard session data if not already present
            seedOwnerDashboardData(userRepository, campsiteRepository, lotRepository, bookingRepository);

            log.info("Database initialization complete!");
        };
    }

    private void seedOwnerDashboardData(UserRepository userRepository, CampsiteRepository campsiteRepository,
                                       LotRepository lotRepository, com.example.myislandapi.repository.BookingRepository bookingRepository) {
        String ownerEmail = "siobhan@clifdeneco.ie";
        User owner = userRepository.findByEmail(ownerEmail).orElse(null);
        if (owner == null) return;

        // Check if already seeded
        if (campsiteRepository.findAll().stream().anyMatch(c -> c.getName().contains("Off-site"))) {
            return;
        }

        log.info("Seeding owner dashboard session data for {}...", ownerEmail);

        // 1. Create a new "Off-site B&B" campsite
        Campsite bbCampsite = new Campsite();
        bbCampsite.setName("Harbour View B&B (Off-site)");
        bbCampsite.setDescription("Cozy bed and breakfast located just outside our main resort.");
        bbCampsite.setOwner(owner);
        Location bbLocation = new Location();
        bbLocation.setAddress("Main St, Clifden");
        bbLocation.setCounty("Galway");
        bbLocation.setLat(53.4870);
        bbLocation.setLng(-10.0210);
        bbCampsite.setLocation(bbLocation);
        bbCampsite.setRating(BigDecimal.valueOf(4.9));
        bbCampsite.setReviewCount(32);
        bbCampsite.setActive(true);
        bbCampsite = campsiteRepository.save(bbCampsite);

        // 2. Add lots to Clifden Eco Beach
        Campsite clifden = campsiteRepository.findAll().stream()
                .filter(c -> c.getName().contains("Clifden Eco Beach"))
                .findFirst().orElse(null);

        List<Lot> addedLots = new ArrayList<>();

        if (clifden != null) {
            // Tents (reach 30)
            long existingTents = clifden.getLots().stream().filter(l -> l.getType() == LotType.TENT).count();
            for (int i = (int)existingTents + 1; i <= 30; i++) {
                Lot lot = new Lot();
                lot.setCampsite(clifden);
                lot.setName("Tent Pitch " + i);
                lot.setType(LotType.TENT);
                lot.setCapacity(4);
                lot.setPricePerNight(BigDecimal.valueOf(25.00));
                lot.setAvailable(true);
                addedLots.add(lotRepository.save(lot));
            }

            // RVs (20)
            for (int i = 1; i <= 20; i++) {
                Lot lot = new Lot();
                lot.setCampsite(clifden);
                lot.setName("RV Spot " + i);
                lot.setType(LotType.RV);
                lot.setCapacity(6);
                lot.setPricePerNight(BigDecimal.valueOf(55.00));
                lot.setAvailable(true);
                addedLots.add(lotRepository.save(lot));
            }

            // Apartments (4)
            for (int i = 1; i <= 4; i++) {
                Lot lot = new Lot();
                lot.setCampsite(clifden);
                lot.setName("Resort Apartment " + i);
                lot.setType(LotType.APARTMENT);
                lot.setCapacity(4);
                lot.setPricePerNight(BigDecimal.valueOf(145.00));
                lot.setAvailable(true);
                addedLots.add(lotRepository.save(lot));
            }
            
            // 1 Cabin (ensure at least 1)
            if (clifden.getLots().stream().noneMatch(l -> l.getType() == LotType.CABIN)) {
                Lot lot = new Lot();
                lot.setCampsite(clifden);
                lot.setName("Luxury Cabin");
                lot.setType(LotType.CABIN);
                lot.setCapacity(4);
                lot.setPricePerNight(BigDecimal.valueOf(180.00));
                lot.setAvailable(true);
                addedLots.add(lotRepository.save(lot));
            } else {
                clifden.getLots().stream().filter(l -> l.getType() == LotType.CABIN).findFirst().ifPresent(addedLots::add);
            }
        }

        // B&B lot
        Lot bbLot = new Lot();
        bbLot.setCampsite(bbCampsite);
        bbLot.setName("Deluxe B&B Room");
        bbLot.setType(LotType.BED_AND_BREAKFAST);
        bbLot.setCapacity(2);
        bbLot.setPricePerNight(BigDecimal.valueOf(120.00));
        bbLot.setAvailable(true);
        addedLots.add(lotRepository.save(bbLot));

        // 3. Generate simulated COMPLETED bookings
        seedBookings(addedLots, userRepository, bookingRepository);
    }

    private void seedBookings(List<Lot> lots, UserRepository userRepository, 
                              com.example.myislandapi.repository.BookingRepository bookingRepository) {
        log.info("Seeding simulated bookings for May-Sept 2025...");
        List<User> guests = userRepository.findAll().stream().filter(u -> !u.isOwner()).toList();
        if (guests.isEmpty()) return;

        LocalDate start = LocalDate.of(2025, 5, 1);
        
        for (Lot lot : lots) {
            int numBookings = 5 + random.nextInt(10);
            for (int i = 0; i < numBookings; i++) {
                com.example.myislandapi.entity.Booking booking = new com.example.myislandapi.entity.Booking();
                booking.setLot(lot);
                booking.setUser(guests.get(random.nextInt(guests.size())));
                
                LocalDate checkIn = start.plusDays(i * 10 + random.nextInt(5));
                if (checkIn.isAfter(LocalDate.of(2025, 9, 15))) continue;
                
                booking.setCheckIn(checkIn);
                booking.setCheckOut(checkIn.plusDays(2 + random.nextInt(5)));
                booking.setGuests(1 + random.nextInt(lot.getCapacity()));
                booking.setStatus(com.example.myislandapi.enums.BookingStatus.COMPLETED);
                
                long nights = java.time.temporal.ChronoUnit.DAYS.between(booking.getCheckIn(), booking.getCheckOut());
                BigDecimal lotPrice = lot.getPricePerNight().multiply(BigDecimal.valueOf(nights));
                booking.setLotPrice(lotPrice);
                booking.setExtrasPrice(BigDecimal.ZERO);
                booking.setServiceFee(lotPrice.multiply(BigDecimal.valueOf(0.1)));
                booking.setTotalPrice(booking.getLotPrice().add(booking.getServiceFee()));
                
                bookingRepository.save(booking);
            }
        }
    }

    private void ensureDemoAccounts(UserRepository repository, PasswordEncoder encoder) {
        // Demo accounts matching frontend login page - password: demo1234
        String[][] demoAccounts = {
            {"visitor@my-island.com", "Emma Murphy", "false", "false"},
            {"owner@my-island.com", "Sarah O'Brien", "true", "false"},
            {"supplier@my-island.com", "Michael Kelly", "false", "true"},
        };

        for (String[] account : demoAccounts) {
            String email = account[0];
            if (repository.findByEmail(email).isEmpty()) {
                User user = new User();
                user.setEmail(email);
                user.setPasswordHash(encoder.encode("demo1234"));
                user.setName(account[1]);
                user.setPhone("+353 87 " + (1000000 + random.nextInt(8999999)));
                user.setOwner(Boolean.parseBoolean(account[2]));
                user.setSupplier(Boolean.parseBoolean(account[3]));
                repository.save(user);
                log.info("Created demo account: {}", email);
            }
        }
    }

    private List<User> createOwners(UserRepository repository, PasswordEncoder encoder) {
        List<User> owners = new ArrayList<>();

        // Demo owner account matching frontend - password: demo1234
        var demoOwner = repository.findByEmail("owner@my-island.com");
        if (demoOwner.isPresent()) {
            User user = demoOwner.get();
            if (!user.isOwner()) {
                user.setOwner(true);
                repository.save(user);
            }
            owners.add(user);
        } else {
            User owner = new User();
            owner.setEmail("owner@my-island.com");
            owner.setPasswordHash(encoder.encode("demo1234"));
            owner.setName("Sarah O'Brien");
            owner.setPhone("+353871234567");
            owner.setOwner(true);
            owners.add(repository.save(owner));
        }

        // Additional owner accounts
        String[] ownerEmails = {"owner1@example.com", "owner2@example.com", "owner3@example.com"};
        String[] ownerNames = {"John Murphy", "Mary O'Brien", "Sean Kelly"};

        for (int i = 0; i < ownerEmails.length; i++) {
            var existing = repository.findByEmail(ownerEmails[i]);
            if (existing.isPresent()) {
                User user = existing.get();
                if (!user.isOwner()) {
                    user.setOwner(true);
                    repository.save(user);
                }
                owners.add(user);
            } else {
                User owner = new User();
                owner.setEmail(ownerEmails[i]);
                owner.setPasswordHash(encoder.encode("password123"));
                owner.setName(ownerNames[i]);
                owner.setPhone("+353" + (800000000 + random.nextInt(99999999)));
                owner.setOwner(true);
                owners.add(repository.save(owner));
            }
        }
        return owners;
    }

    private List<User> createUsers(UserRepository repository, PasswordEncoder encoder) {
        List<User> users = new ArrayList<>();

        // Demo accounts matching frontend - password: demo1234
        String[][] demoAccounts = {
            {"visitor@my-island.com", "Emma Murphy", "false", "false"},
            {"supplier@my-island.com", "Michael Kelly", "false", "true"},
        };

        for (String[] account : demoAccounts) {
            if (repository.findByEmail(account[0]).isEmpty()) {
                User user = new User();
                user.setEmail(account[0]);
                user.setPasswordHash(encoder.encode("demo1234"));
                user.setName(account[1]);
                user.setPhone("+353" + (871000000 + random.nextInt(8999999)));
                user.setOwner(Boolean.parseBoolean(account[2]));
                user.setSupplier(Boolean.parseBoolean(account[3]));
                users.add(repository.save(user));
            }
        }

        // Additional test users
        String[] userEmails = {"user1@example.com", "user2@example.com", "demo@example.com"};
        String[] userNames = {"Alice Johnson", "Bob Smith", "Demo User"};

        for (int i = 0; i < userEmails.length; i++) {
            if (repository.findByEmail(userEmails[i]).isEmpty()) {
                User user = new User();
                user.setEmail(userEmails[i]);
                user.setPasswordHash(encoder.encode("password123"));
                user.setName(userNames[i]);
                user.setPhone("+353" + (800000000 + random.nextInt(99999999)));
                user.setOwner(false);
                users.add(repository.save(user));
            }
        }
        return users;
    }

    private List<Campsite> createCampsites(
            CampsiteRepository campsiteRepository,
            LotRepository lotRepository,
            List<User> owners
    ) {
        List<Campsite> campsites = new ArrayList<>();

        for (int i = 0; i < 24; i++) {
            User owner = owners.get(i % owners.size());
            String county = IRISH_COUNTIES[i % IRISH_COUNTIES.length];
            String baseName = CAMPSITE_NAMES[i % CAMPSITE_NAMES.length];
            String name = baseName + " " + county;

            // Check if already exists
            if (!campsiteRepository.findByOwnerId(owner.getId()).stream()
                    .anyMatch(c -> c.getName().equals(name))) {

                Campsite campsite = new Campsite();
                campsite.setName(name);
                campsite.setDescription("A beautiful camping destination in " + county +
                    ". Experience the best of Irish countryside with stunning views and modern amenities.");
                campsite.setOwner(owner);

                // Location
                Location location = new Location();
                location.setAddress(random.nextInt(100) + " " + county + " Road, " + county);
                location.setCounty(county);
                location.setLat(51.5 + random.nextDouble() * 2);
                location.setLng(-10.5 + random.nextDouble() * 3);
                campsite.setLocation(location);

                // Images
                campsite.setImages(List.of(
                    "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
                    "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800",
                    "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800"
                ));

                // Facilities
                Set<Facility> facilities = EnumSet.noneOf(Facility.class);
                Facility[] allFacilities = Facility.values();
                int numFacilities = 4 + random.nextInt(6);
                for (int j = 0; j < numFacilities; j++) {
                    facilities.add(allFacilities[random.nextInt(allFacilities.length)]);
                }
                campsite.setFacilities(facilities);

                // Rating
                campsite.setRating(BigDecimal.valueOf(3.5 + random.nextDouble() * 1.5));
                campsite.setReviewCount(random.nextInt(50));
                campsite.setFeatured(i < 6);

                campsite = campsiteRepository.save(campsite);

                // Create lots and set pricePerNight
                BigDecimal minPrice = createLots(lotRepository, campsite);
                campsite.setPricePerNight(minPrice);
                campsiteRepository.save(campsite);

                campsites.add(campsite);
            }
        }
        return campsites;
    }

    private List<Campsite> createFeaturedTestCampsites(
            CampsiteRepository campsiteRepository,
            LotRepository lotRepository,
            List<User> owners
    ) {
        List<Campsite> campsites = new ArrayList<>();

        // Campsite 1: Coastal Glamping Resort (Galway - premium glamping)
        Campsite glamping = createTestCampsite(
            "Clifden Coastal Glamping Resort",
            "Experience luxury camping on Ireland's stunning Wild Atlantic Way. Our premium glamping resort " +
            "offers stunning ocean views, boutique accommodations, and world-class amenities. Wake up to " +
            "breathtaking sunsets over the Atlantic in our hand-crafted safari tents, cozy yurts, or " +
            "enchanting treehouses.",
            owners.get(0),
            "Clifden", "Galway", 53.4890, -10.0501,
            EnumSet.of(Facility.WIFI, Facility.ELECTRIC, Facility.WATER, Facility.TOILET,
                       Facility.SHOWER, Facility.BEACH, Facility.RESTAURANT),
            List.of(
                "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=800",
                "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
                "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800"
            ),
            BigDecimal.valueOf(4.9), 87, true
        );
        glamping = campsiteRepository.save(glamping);
        BigDecimal minPrice = createTestLots(lotRepository, glamping, List.of(
            new LotSpec("Ocean View Safari Tent", LotType.SAFARI_TENT, 2, BigDecimal.valueOf(95),
                List.of("King bed", "En-suite bathroom", "Private deck", "Ocean view")),
            new LotSpec("Sunset Safari Tent", LotType.SAFARI_TENT, 4, BigDecimal.valueOf(120),
                List.of("King bed", "Twin beds", "En-suite bathroom", "Outdoor seating")),
            new LotSpec("Coastal Glamping Pod", LotType.POD, 2, BigDecimal.valueOf(85),
                List.of("Double bed", "Heating", "Skylight", "USB charging")),
            new LotSpec("Atlantic Yurt", LotType.YURT, 4, BigDecimal.valueOf(110),
                List.of("King bed", "Sofa bed", "Wood stove", "Kitchenette")),
            new LotSpec("Sky Treehouse", LotType.TREEHOUSE, 2, BigDecimal.valueOf(145),
                List.of("King bed", "Panoramic windows", "Private bathroom", "Hot tub"))
        ));
        glamping.setPricePerNight(minPrice);
        campsites.add(campsiteRepository.save(glamping));

        // Campsite 2: Wild Atlantic Traditional Camp (Kerry - budget/traditional)
        Campsite traditional = createTestCampsite(
            "Ring of Kerry Wild Camp",
            "Back-to-basics camping in the heart of the Ring of Kerry. Perfect for adventurers seeking " +
            "an authentic Irish camping experience. Stunning mountain views, excellent hiking trails, " +
            "and incredible stargazing. Basic facilities but unbeatable natural beauty.",
            owners.get(1),
            "Killarney", "Kerry", 52.0599, -9.5044,
            EnumSet.of(Facility.WATER, Facility.TOILET, Facility.SHOWER, Facility.LAUNDRY,
                       Facility.HIKING, Facility.FISHING),
            List.of(
                "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800",
                "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800"
            ),
            BigDecimal.valueOf(4.6), 124, true
        );
        traditional = campsiteRepository.save(traditional);
        minPrice = createTestLots(lotRepository, traditional, List.of(
            new LotSpec("Mountain View Pitch 1", LotType.TENT, 4, BigDecimal.valueOf(22),
                List.of("Grass pitch", "Fire pit", "Picnic table")),
            new LotSpec("Mountain View Pitch 2", LotType.TENT, 4, BigDecimal.valueOf(22),
                List.of("Grass pitch", "Fire pit", "Picnic table")),
            new LotSpec("Riverside Pitch 3", LotType.TENT, 6, BigDecimal.valueOf(28),
                List.of("Large grass pitch", "Fire pit", "Picnic table", "River access")),
            new LotSpec("Hardstanding Caravan Bay A", LotType.CARAVAN, 4, BigDecimal.valueOf(45),
                List.of("Hardstanding", "Electric hook-up", "Water point")),
            new LotSpec("Hardstanding Caravan Bay B", LotType.CARAVAN, 4, BigDecimal.valueOf(45),
                List.of("Hardstanding", "Electric hook-up", "Water point")),
            new LotSpec("Campervan Spot 1", LotType.CAMPERVAN, 2, BigDecimal.valueOf(42),
                List.of("Level pitch", "Electric hook-up", "Grey water disposal"))
        ));
        traditional.setPricePerNight(minPrice);
        campsites.add(campsiteRepository.save(traditional));

        // Campsite 3: Mountain View Holiday Park (Wicklow - family-friendly mixed)
        Campsite familyPark = createTestCampsite(
            "Wicklow Mountains Holiday Park",
            "A family-friendly holiday park nestled in the Wicklow Mountains, the perfect escape near Dublin. " +
            "Just an hour from the city, we offer a wide range of accommodation options from self-catering " +
            "apartments to cozy cabins and glamping pods. On-site shop, playground, and bike hire available.",
            owners.get(2),
            "Roundwood", "Wicklow", 53.0667, -6.2333,
            EnumSet.of(Facility.WIFI, Facility.ELECTRIC, Facility.WATER, Facility.TOILET,
                       Facility.SHOWER, Facility.SHOP, Facility.PLAYGROUND, Facility.CYCLING, Facility.PETS),
            List.of(
                "https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=800",
                "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800",
                "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800"
            ),
            BigDecimal.valueOf(4.7), 203, true
        );
        familyPark = campsiteRepository.save(familyPark);
        minPrice = createTestLots(lotRepository, familyPark, List.of(
            new LotSpec("Pine Lodge Cabin", LotType.CABIN, 4, BigDecimal.valueOf(125),
                List.of("2 bedrooms", "Full kitchen", "Living room", "Private parking")),
            new LotSpec("Mountain View Cottage", LotType.COTTAGE, 6, BigDecimal.valueOf(185),
                List.of("3 bedrooms", "Full kitchen", "Fireplace", "Garden", "BBQ")),
            new LotSpec("Lakeside Apartment", LotType.APARTMENT, 4, BigDecimal.valueOf(155),
                List.of("2 bedrooms", "Modern kitchen", "Balcony", "Lake views")),
            new LotSpec("RV Park Spot 1", LotType.RV, 4, BigDecimal.valueOf(55),
                List.of("Full hook-up", "50 amp electric", "Sewer", "Cable TV")),
            new LotSpec("Forest Glamping Pod", LotType.GLAMPING, 2, BigDecimal.valueOf(95),
                List.of("Double bed", "Heating", "Mini fridge", "Outdoor seating"))
        ));
        familyPark.setPricePerNight(minPrice);
        campsites.add(campsiteRepository.save(familyPark));

        // Campsite 4: Lakeside Eco Retreat (Clare - eco-focused)
        Campsite ecoRetreat = createTestCampsite(
            "Burren Lakeside Eco Retreat",
            "An off-grid eco retreat in the unique Burren landscape. Solar-powered facilities, " +
            "composting toilets, and sustainably built accommodations. Perfect for those seeking " +
            "a mindful escape in harmony with nature. Yoga classes and nature walks included.",
            owners.get(0),
            "Ballyvaughan", "Clare", 53.1167, -9.1500,
            EnumSet.of(Facility.WIFI, Facility.WATER, Facility.TOILET, Facility.SHOWER,
                       Facility.FISHING, Facility.HIKING, Facility.CYCLING),
            List.of(
                "https://images.unsplash.com/photo-1520824071669-7cc5b7097969?w=800",
                "https://images.unsplash.com/photo-1545572279-d0d91040c5d1?w=800"
            ),
            BigDecimal.valueOf(4.8), 56, false
        );
        ecoRetreat = campsiteRepository.save(ecoRetreat);
        minPrice = createTestLots(lotRepository, ecoRetreat, List.of(
            new LotSpec("Hobbit Pod", LotType.POD, 2, BigDecimal.valueOf(75),
                List.of("Double bed", "Solar heating", "Composting toilet nearby")),
            new LotSpec("Zen Yurt", LotType.YURT, 4, BigDecimal.valueOf(90),
                List.of("King bed", "Floor cushions", "Wood stove", "Meditation corner")),
            new LotSpec("Canopy Treehouse", LotType.TREEHOUSE, 2, BigDecimal.valueOf(135),
                List.of("Double bed", "Compost toilet", "Solar shower", "Bird watching deck")),
            new LotSpec("Wildflower Tent Pitch", LotType.TENT, 4, BigDecimal.valueOf(25),
                List.of("Flat grass pitch", "Fire circle", "Shared facilities"))
        ));
        ecoRetreat.setPricePerNight(minPrice);
        campsites.add(campsiteRepository.save(ecoRetreat));

        // Campsite 5: Seaside Family Park (Cork - large family park)
        Campsite seasidePark = createTestCampsite(
            "Kinsale Seaside Family Park",
            "The ultimate family destination for beach camping on Ireland's sunny southeast coast. Our " +
            "award-winning park offers everything from traditional camping to luxury apartments. Private " +
            "beach access, heated pool, kids club, and on-site restaurant. Something for everyone!",
            owners.get(1),
            "Kinsale", "Cork", 51.7058, -8.5222,
            EnumSet.of(Facility.WIFI, Facility.ELECTRIC, Facility.WATER, Facility.TOILET,
                       Facility.SHOWER, Facility.LAUNDRY, Facility.SHOP, Facility.RESTAURANT,
                       Facility.PLAYGROUND, Facility.BEACH, Facility.PETS),
            List.of(
                "https://images.unsplash.com/photo-1533632359083-0185df1be85d?w=800",
                "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800",
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
            ),
            BigDecimal.valueOf(4.5), 312, true
        );
        seasidePark = campsiteRepository.save(seasidePark);
        minPrice = createTestLots(lotRepository, seasidePark, List.of(
            new LotSpec("Beachfront Caravan", LotType.CARAVAN, 4, BigDecimal.valueOf(65),
                List.of("Hardstanding", "Electric hook-up", "Sea views")),
            new LotSpec("Touring Campervan Bay", LotType.CAMPERVAN, 2, BigDecimal.valueOf(55),
                List.of("Level pitch", "Electric hook-up", "Water/waste point")),
            new LotSpec("Luxury Safari Tent", LotType.SAFARI_TENT, 5, BigDecimal.valueOf(120),
                List.of("Master bedroom", "Kids room", "Kitchen", "Private deck")),
            new LotSpec("Harbour View Cabin", LotType.CABIN, 6, BigDecimal.valueOf(165),
                List.of("3 bedrooms", "Full kitchen", "Living room", "Harbour views")),
            new LotSpec("Penthouse Apartment", LotType.APARTMENT, 4, BigDecimal.valueOf(175),
                List.of("2 bedrooms", "Sea views", "Modern kitchen", "Balcony", "Parking")),
            new LotSpec("Family Tent Pitch", LotType.TENT, 6, BigDecimal.valueOf(28),
                List.of("Large grass pitch", "Sheltered", "Electric hook-up available"))
        ));
        seasidePark.setPricePerNight(minPrice);
        campsites.add(campsiteRepository.save(seasidePark));

        log.info("Created {} featured test campsites", campsites.size());

        return campsites;
    }

    private Campsite createTestCampsite(
            String name, String description, User owner,
            String town, String county, double lat, double lng,
            Set<Facility> facilities, List<String> images,
            BigDecimal rating, int reviewCount, boolean featured
    ) {
        Campsite campsite = new Campsite();
        campsite.setName(name);
        campsite.setDescription(description);
        campsite.setOwner(owner);

        Location location = new Location();
        location.setAddress(town + ", " + county);
        location.setCounty(county);
        location.setLat(lat);
        location.setLng(lng);
        campsite.setLocation(location);

        campsite.setFacilities(facilities);
        campsite.setImages(images);
        campsite.setRating(rating);
        campsite.setReviewCount(reviewCount);
        campsite.setFeatured(featured);
        campsite.setActive(true);

        return campsite;
    }

    private record LotSpec(String name, LotType type, int capacity, BigDecimal price, List<String> amenities) {}

    private BigDecimal createTestLots(LotRepository repository, Campsite campsite, List<LotSpec> specs) {
        BigDecimal minPrice = BigDecimal.valueOf(999999);

        for (LotSpec spec : specs) {
            Lot lot = new Lot();
            lot.setCampsite(campsite);
            lot.setName(spec.name());
            lot.setType(spec.type());
            lot.setCapacity(spec.capacity());
            lot.setPricePerNight(spec.price());
            lot.setAmenities(spec.amenities());
            lot.setImages(List.of(getLotImage(spec.type())));
            lot.setAvailable(true);
            repository.save(lot);

            if (spec.price().compareTo(minPrice) < 0) {
                minPrice = spec.price();
            }
        }
        return minPrice;
    }

    private String getLotImage(LotType type) {
        return switch (type) {
            case TENT -> "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800";
            case CARAVAN, CAMPERVAN, RV, MOBILE_HOME -> "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800";
            case GLAMPING, SAFARI_TENT -> "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=800";
            case CABIN, COTTAGE -> "https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=800";
            case TREEHOUSE -> "https://images.unsplash.com/photo-1520824071669-7cc5b7097969?w=800";
            case YURT -> "https://images.unsplash.com/photo-1545572279-d0d91040c5d1?w=800";
            case POD -> "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800";
            case APARTMENT, BED_AND_BREAKFAST -> "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800";
        };
    }

    private BigDecimal createLots(LotRepository repository, Campsite campsite) {
        LotType[] types = LotType.values();
        BigDecimal minPrice = BigDecimal.valueOf(999999);

        for (int i = 0; i < 5 + random.nextInt(5); i++) {
            Lot lot = new Lot();
            lot.setCampsite(campsite);
            lot.setName(LOT_NAMES[i % LOT_NAMES.length] + " #" + (i + 1));
            lot.setType(types[random.nextInt(types.length)]);
            lot.setCapacity(2 + random.nextInt(6));
            BigDecimal price = BigDecimal.valueOf(25 + random.nextInt(75));
            lot.setPricePerNight(price);
            if (price.compareTo(minPrice) < 0) {
                minPrice = price;
            }
            lot.setImages(List.of(
                "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800"
            ));
            lot.setAvailable(true);
            repository.save(lot);
        }
        return minPrice;
    }

    private List<FAQ> createFAQs(FAQRepository repository) {
        if (repository.count() > 0) {
            return repository.findAll();
        }

        List<FAQ> faqs = new ArrayList<>();
        String[][] faqData = {
            {"booking", "How do I make a booking?", "Browse campsites, select your dates and lot type, then complete the booking process with your payment details."},
            {"booking", "Can I modify my booking?", "Yes, you can modify your booking up to 48 hours before check-in through your My Bookings page."},
            {"booking", "What is the cancellation policy?", "Free cancellation up to 7 days before check-in. 50% refund for cancellations 2-7 days before. No refund within 48 hours."},
            {"payment", "What payment methods are accepted?", "We accept all major credit cards, Apple Pay, and Google Pay."},
            {"payment", "Is my payment secure?", "Yes, all payments are processed through secure, PCI-compliant payment processors."},
            {"account", "How do I reset my password?", "Click 'Forgot Password' on the login page and follow the instructions sent to your email."},
            {"account", "How do I become a campsite owner?", "Contact our support team to apply for an owner account and list your campsite."},
            {"general", "What should I bring camping?", "Essential items include tent/sleeping bag (unless glamping), torch, warm clothing, and rain gear."},
            {"general", "Are pets allowed?", "Pet policies vary by campsite. Check the facilities list for pet-friendly campsites."},
            {"general", "What are the check-in/check-out times?", "Standard check-in is 2pm and check-out is 11am, but this may vary by campsite."}
        };

        int order = 0;
        for (String[] data : faqData) {
            FAQ faq = new FAQ();
            faq.setCategory(data[0]);
            faq.setQuestion(data[1]);
            faq.setAnswer(data[2]);
            faq.setSortOrder(order++);
            faq.setActive(true);
            faqs.add(repository.save(faq));
        }
        return faqs;
    }

    private List<Offer> createOffers(OfferRepository repository, List<Campsite> campsites) {
        if (repository.count() > 0) {
            return repository.findAll();
        }

        List<Offer> offers = new ArrayList<>();
        OfferCategory[] categories = OfferCategory.values();

        String[][] offerData = {
            {"Early Bird Discount", "Book 30 days in advance and save 20%", "100.00", "80.00", "20"},
            {"Weekend Special", "Stay Friday to Sunday and get Sunday night free", "150.00", "100.00", "33"},
            {"Family Package", "Family of 4 glamping experience with breakfast", "200.00", "160.00", "20"},
            {"Adventure Bundle", "Camping + kayak + bike rental combo", "80.00", "60.00", "25"},
            {"Romantic Getaway", "Luxury glamping for couples with champagne", "180.00", "150.00", "17"},
            {"Group Discount", "10% off for groups of 6 or more", "300.00", "270.00", "10"}
        };

        for (int i = 0; i < offerData.length; i++) {
            String[] data = offerData[i];
            Offer offer = new Offer();
            offer.setTitle(data[0]);
            offer.setDescription(data[1]);
            offer.setOriginalPrice(new BigDecimal(data[2]));
            offer.setDiscountPrice(new BigDecimal(data[3]));
            offer.setDiscountPercent(Integer.parseInt(data[4]));
            offer.setCategory(categories[i % categories.length]);
            offer.setValidFrom(LocalDate.now());
            offer.setValidUntil(LocalDate.now().plusMonths(3));
            offer.setImageUrl("https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800");
            offer.setFeatured(i < 3);
            offer.setActive(true);

            if (!campsites.isEmpty()) {
                Campsite campsite = campsites.get(i % campsites.size());
                offer.setCampsite(campsite);
                if (campsite.getLocation() != null) {
                    offer.setLat(campsite.getLocation().getLat());
                    offer.setLng(campsite.getLocation().getLng());
                }
            }

            offers.add(repository.save(offer));
        }
        return offers;
    }

    private List<LocalBusiness> createLocalBusinesses(LocalBusinessRepository repository) {
        if (repository.count() > 0) {
            return repository.findAll();
        }

        List<LocalBusiness> businesses = new ArrayList<>();

        // Restaurants
        businesses.add(createBusiness(repository, "O'Grady's Seafood Restaurant", SupplierCategory.RESTAURANT,
            "Fresh Atlantic seafood with stunning harbour views. Local catch daily.",
            "Clifden Harbour", "Galway", 53.4891, -10.0198,
            "+353 95 21450", null, "https://ogradysseafood.ie",
            "12:00 - 21:00", "12:00 - 22:00", 4.7, 234, true));

        businesses.add(createBusiness(repository, "The Burren Kitchen", SupplierCategory.RESTAURANT,
            "Farm-to-table dining featuring local Burren produce and wild ingredients.",
            "Main Street, Ballyvaughan", "Clare", 53.1158, -9.1467,
            "+353 65 7077800", "info@burrenkitchen.ie", null,
            "10:00 - 20:00", "09:00 - 21:00", 4.8, 189, false));

        businesses.add(createBusiness(repository, "Wild Atlantic Bistro", SupplierCategory.RESTAURANT,
            "Contemporary Irish cuisine overlooking the Wild Atlantic Way.",
            "Westport Quay", "Mayo", 53.8008, -9.5200,
            "+353 98 26261", null, null,
            "17:00 - 22:00", "12:00 - 22:00", 4.5, 156, false));

        // Pubs
        businesses.add(createBusiness(repository, "Lowry's Bar", SupplierCategory.PUB,
            "Traditional Irish pub with live music sessions every weekend.",
            "Main Street, Clifden", "Galway", 53.4875, -10.0172,
            "+353 95 21347", null, null,
            "16:00 - 23:30", "14:00 - 00:30", 4.6, 312, true));

        businesses.add(createBusiness(repository, "Paddy Coyne's Pub", SupplierCategory.PUB,
            "Cozy harbourside pub famous for chowder and Guinness.",
            "Tully Cross", "Galway", 53.5448, -9.9612,
            "+353 95 43499", null, null,
            "12:00 - 23:00", "12:00 - 00:30", 4.8, 287, false));

        businesses.add(createBusiness(repository, "The Sailors' Rest", SupplierCategory.PUB,
            "Historic waterfront pub with craft beers and hearty food.",
            "Killybegs Harbour", "Donegal", 54.6339, -8.4378,
            "+353 74 9731000", null, null,
            "11:00 - 23:00", "11:00 - 00:30", 4.4, 198, false));

        // Farm Shops
        businesses.add(createBusiness(repository, "Connemara Organics Farm Shop", SupplierCategory.FARM_SHOP,
            "Organic vegetables, free-range eggs, and artisan cheeses from local farms.",
            "Letterfrack", "Galway", 53.5514, -9.9456,
            "+353 95 41058", "shop@connemaraorganics.ie", null,
            "09:00 - 18:00", "10:00 - 17:00", 4.9, 145, true));

        businesses.add(createBusiness(repository, "Burren Smokehouse", SupplierCategory.FARM_SHOP,
            "Award-winning smoked salmon and local artisan products.",
            "Kincora Road, Lisdoonvarna", "Clare", 53.0286, -9.2906,
            "+353 65 7074432", null, "https://burrensmokehouse.ie",
            "09:00 - 17:00", "10:00 - 16:00", 4.7, 267, false));

        businesses.add(createBusiness(repository, "Dingle Farmhouse", SupplierCategory.FARM_SHOP,
            "Kerry dairy products, local honey, and homemade preserves.",
            "Green Street, Dingle", "Kerry", 52.1409, -10.2671,
            "+353 66 9152000", null, null,
            "08:00 - 19:00", "09:00 - 18:00", 4.6, 198, false));

        // Grocery Stores
        businesses.add(createBusiness(repository, "SuperValu Clifden", SupplierCategory.GROCERY,
            "Full-service supermarket with camping supplies and local produce.",
            "Market Street, Clifden", "Galway", 53.4867, -10.0189,
            "+353 95 21182", null, null,
            "08:00 - 21:00", "08:00 - 20:00", 4.2, 89, false));

        businesses.add(createBusiness(repository, "Dunnes Stores Westport", SupplierCategory.GROCERY,
            "Large supermarket with fresh bakery and deli counter.",
            "Shop Street, Westport", "Mayo", 53.8000, -9.5178,
            "+353 98 25544", null, null,
            "08:30 - 21:00", "09:00 - 19:00", 4.1, 76, false));

        // Outdoor Gear
        businesses.add(createBusiness(repository, "Wild Atlantic Outfitters", SupplierCategory.OUTDOOR_GEAR,
            "Camping equipment, hiking gear, and outdoor clothing.",
            "Main Street, Clifden", "Galway", 53.4880, -10.0165,
            "+353 95 21999", null, "https://wildatlanticoutfitters.ie",
            "09:30 - 18:00", "10:00 - 17:00", 4.5, 134, true));

        businesses.add(createBusiness(repository, "The Great Outdoors Killarney", SupplierCategory.OUTDOOR_GEAR,
            "Premium hiking boots, waterproofs, and camping essentials.",
            "New Street, Killarney", "Kerry", 52.0599, -9.5044,
            "+353 64 6632888", "killarney@greatoutdoors.ie", null,
            "09:00 - 18:00", "09:30 - 17:30", 4.7, 256, false));

        // Kayak Rentals
        businesses.add(createBusiness(repository, "Killary Fjord Kayaks", SupplierCategory.KAYAK_RENTAL,
            "Guided kayak tours and rentals on Irelands only fjord.",
            "Leenane", "Galway", 53.5986, -9.7208,
            "+353 95 42276", null, "https://killarykayaks.ie",
            "09:00 - 17:00", "08:00 - 18:00", 4.9, 312, true));

        businesses.add(createBusiness(repository, "Dingle Sea Safari", SupplierCategory.KAYAK_RENTAL,
            "Sea kayaking, SUP boards, and dolphin watching experiences.",
            "The Marina, Dingle", "Kerry", 52.1395, -10.2645,
            "+353 87 2856789", "info@dingleseasafari.ie", null,
            "08:00 - 18:00", "07:00 - 19:00", 4.8, 189, false));

        businesses.add(createBusiness(repository, "Achill Island Adventures", SupplierCategory.KAYAK_RENTAL,
            "Kayaks, surfboards, and coasteering equipment rental.",
            "Keel Beach, Achill Island", "Mayo", 53.9667, -10.0833,
            "+353 98 43220", null, null,
            "09:00 - 17:00", "08:00 - 18:00", 4.6, 145, false));

        // Bike Rentals
        businesses.add(createBusiness(repository, "Connemara Cycle Tours", SupplierCategory.BIKE_RENTAL,
            "Quality bikes, e-bikes, and guided cycling tours of Connemara.",
            "The Square, Clifden", "Galway", 53.4872, -10.0182,
            "+353 95 21160", null, "https://connemaracycletours.com",
            "09:00 - 18:00", "09:00 - 17:00", 4.7, 223, true));

        businesses.add(createBusiness(repository, "Kerry Cycle Hire", SupplierCategory.BIKE_RENTAL,
            "Mountain bikes, road bikes, and family cycles for Ring of Kerry.",
            "Plunkett Street, Killarney", "Kerry", 52.0588, -9.5067,
            "+353 64 6631282", "hire@kerrycycles.ie", null,
            "08:30 - 18:30", "09:00 - 18:00", 4.5, 178, false));

        // Fishing Supplies
        businesses.add(createBusiness(repository, "Angler's Rest Tackle Shop", SupplierCategory.FISHING,
            "Fresh bait, fishing tackle, and local fishing permits.",
            "Oughterard", "Galway", 53.4306, -9.3167,
            "+353 91 552688", null, null,
            "07:00 - 18:00", "06:00 - 18:00", 4.4, 98, false));

        businesses.add(createBusiness(repository, "Delphi Fishing Centre", SupplierCategory.FISHING,
            "Salmon and trout fishing equipment, guides, and permits.",
            "Delphi Valley", "Galway", 53.6142, -9.7889,
            "+353 95 42222", null, "https://delphifishing.ie",
            "08:00 - 17:00", "07:00 - 18:00", 4.8, 134, false));

        businesses.add(createBusiness(repository, "West Cork Angling", SupplierCategory.FISHING,
            "Sea fishing gear, boat trips, and tackle rental.",
            "Baltimore Harbour", "Cork", 51.4828, -9.3711,
            "+353 28 20197", null, null,
            "08:00 - 17:00", "07:00 - 18:00", 4.5, 87, false));

        // Convenience Stores
        businesses.add(createBusiness(repository, "Centra Roundstone", SupplierCategory.CONVENIENCE,
            "Essentials, snacks, ice, firewood, and camping basics.",
            "Main Street, Roundstone", "Galway", 53.3953, -9.9231,
            "+353 95 35800", null, null,
            "07:00 - 22:00", "07:30 - 22:00", 4.0, 65, false));

        businesses.add(createBusiness(repository, "Spar Leenane", SupplierCategory.CONVENIENCE,
            "Groceries, hot food, ATM, and tourist information.",
            "Leenane Village", "Galway", 53.6019, -9.7214,
            "+353 95 42211", null, null,
            "07:00 - 21:00", "08:00 - 21:00", 4.1, 54, false));

        businesses.add(createBusiness(repository, "Mace Portmagee", SupplierCategory.CONVENIENCE,
            "Last stop before Skellig Michael. Snacks, fuel, and gifts.",
            "Portmagee", "Kerry", 51.8847, -10.3594,
            "+353 66 9477116", null, null,
            "07:30 - 20:00", "08:00 - 20:00", 4.2, 112, false));

        businesses.add(createBusiness(repository, "Glencolmcille Store", SupplierCategory.CONVENIENCE,
            "Remote village store with camping supplies and local crafts.",
            "Glencolmcille", "Donegal", 54.7078, -8.7281,
            "+353 74 9730017", null, null,
            "08:00 - 19:00", "09:00 - 18:00", 4.3, 78, false));

        return businesses;
    }

    private LocalBusiness createBusiness(
            LocalBusinessRepository repository,
            String name, SupplierCategory category, String description,
            String address, String county, double lat, double lng,
            String phone, String email, String website,
            String weekdayHours, String weekendHours,
            double rating, int reviewCount, boolean featured) {

        LocalBusiness business = new LocalBusiness();
        business.setName(name);
        business.setCategory(category);
        business.setDescription(description);

        Location location = new Location();
        location.setAddress(address);
        location.setCounty(county);
        location.setLat(lat);
        location.setLng(lng);
        business.setLocation(location);

        business.setPhone(phone);
        business.setEmail(email);
        business.setWebsite(website);
        business.setWeekdayHours(weekdayHours);
        business.setWeekendHours(weekendHours);
        business.setRating(BigDecimal.valueOf(rating));
        business.setReviewCount(reviewCount);
        business.setFeatured(featured);
        business.setActive(true);

        return repository.save(business);
    }
}
