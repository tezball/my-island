package com.example.myislandapi.config;

import com.example.myislandapi.entity.Campsite;
import com.example.myislandapi.entity.FAQ;
import com.example.myislandapi.entity.Location;
import com.example.myislandapi.entity.Lot;
import com.example.myislandapi.entity.Offer;
import com.example.myislandapi.entity.User;
import com.example.myislandapi.enums.Facility;
import com.example.myislandapi.enums.LotType;
import com.example.myislandapi.enums.OfferCategory;
import com.example.myislandapi.repository.CampsiteRepository;
import com.example.myislandapi.repository.FAQRepository;
import com.example.myislandapi.repository.LotRepository;
import com.example.myislandapi.repository.OfferRepository;
import com.example.myislandapi.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Configuration
@Profile("dev")
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

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
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (campsiteRepository.count() > 0) {
                log.info("Database already seeded, skipping initialization");
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

            log.info("Database initialization complete!");
        };
    }

    private List<User> createOwners(UserRepository repository, PasswordEncoder encoder) {
        List<User> owners = new ArrayList<>();
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
        String[] userEmails = {"user1@example.com", "user2@example.com", "user3@example.com", "demo@example.com"};
        String[] userNames = {"Alice Johnson", "Bob Smith", "Carol White", "Demo User"};

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
            "A family-friendly holiday park nestled in the Wicklow Mountains, just an hour from Dublin. " +
            "We offer a wide range of accommodation options from self-catering apartments to cozy cabins " +
            "and glamping pods. On-site shop, playground, and bike hire available.",
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
            "The ultimate family destination on Ireland's sunny southeast coast. Our award-winning park " +
            "offers everything from traditional camping to luxury apartments. Private beach access, " +
            "heated pool, kids club, and on-site restaurant. Something for everyone!",
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

        log.info("Created 5 featured test campsites with {} total lots",
            campsites.stream().mapToInt(c -> c.getLots().size()).sum());

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
            case CARAVAN, CAMPERVAN, RV -> "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800";
            case GLAMPING, SAFARI_TENT -> "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=800";
            case CABIN, COTTAGE -> "https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=800";
            case TREEHOUSE -> "https://images.unsplash.com/photo-1520824071669-7cc5b7097969?w=800";
            case YURT -> "https://images.unsplash.com/photo-1545572279-d0d91040c5d1?w=800";
            case POD -> "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800";
            case APARTMENT -> "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800";
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
}
