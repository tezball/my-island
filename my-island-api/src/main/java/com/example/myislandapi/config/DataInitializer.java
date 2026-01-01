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

            // Create campsites with lots
            List<Campsite> campsites = createCampsites(campsiteRepository, lotRepository, owners);
            log.info("Created {} campsites", campsites.size());

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
