package com.myisland.config;

import com.myisland.model.*;
import com.myisland.repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataInitializer {
    private final UserRepository userRepository;
    private final CampsiteRepository campsiteRepository;
    private final BookingRepository bookingRepository;
    private final OfferRepository offerRepository;
    private final ExtraRepository extraRepository;
    private final LotRepository lotRepository;

    public DataInitializer(UserRepository userRepository, CampsiteRepository campsiteRepository,
                          BookingRepository bookingRepository, OfferRepository offerRepository,
                          ExtraRepository extraRepository, LotRepository lotRepository) {
        this.userRepository = userRepository;
        this.campsiteRepository = campsiteRepository;
        this.bookingRepository = bookingRepository;
        this.offerRepository = offerRepository;
        this.extraRepository = extraRepository;
        this.lotRepository = lotRepository;
    }

    // Seeded random for reproducible results
    private long seed = 12345;

    private double seededRandom() {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return (double) seed / 0x7fffffff;
    }

    @PostConstruct
    public void init() {
        initUsers();
        initExtras();
        initCampsites();
        initOffers();
        initSampleBookings();

        System.out.println("Data initialized: " + campsiteRepository.count() + " campsites, " +
                offerRepository.count() + " offers");
    }

    private void initUsers() {
        userRepository.save(User.builder()
                .id("user-1")
                .email("visitor@my-island.com")
                .name("Sarah Murphy")
                .avatar("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150")
                .savedCampsites(new ArrayList<>(Arrays.asList("1", "3", "5", "7", "9", "12", "15", "18")))
                .role(User.UserRole.visitor)
                .build());

        userRepository.save(User.builder()
                .id("user-2")
                .email("owner@my-island.com")
                .name("Patrick O'Connor")
                .avatar("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150")
                .savedCampsites(new ArrayList<>())
                .role(User.UserRole.owner)
                .build());

        userRepository.save(User.builder()
                .id("user-3")
                .email("supplier@my-island.com")
                .name("Siobhan Kelly")
                .avatar("https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150")
                .savedCampsites(new ArrayList<>())
                .role(User.UserRole.supplier)
                .build());
    }

    private void initExtras() {
        List<Extra> extras = Arrays.asList(
            Extra.builder().id("kayak").name("Kayak Rental").description("Single kayak for the day").price(25).icon("kayaking").build(),
            Extra.builder().id("bbq").name("BBQ Kit").description("Charcoal, tools, and cleaning supplies").price(15).icon("outdoor_grill").build(),
            Extra.builder().id("firewood").name("Firewood Bundle").description("Seasoned hardwood for campfire").price(12).icon("local_fire_department").build(),
            Extra.builder().id("breakfast").name("Breakfast Basket").description("Local eggs, bread, butter, jam, coffee").price(22).icon("egg_alt").build(),
            Extra.builder().id("bike").name("Bike Rental").description("Mountain bike for the day").price(20).icon("directions_bike").build(),
            Extra.builder().id("surfboard").name("Surfboard Hire").description("Foam or fibreglass board").price(30).icon("surfing").build(),
            Extra.builder().id("wetsuit").name("Wetsuit Hire").description("4/3mm full wetsuit").price(15).icon("scuba_diving").build(),
            Extra.builder().id("fishing").name("Fishing Rod Set").description("Rod, reel, tackle, and bait").price(18).icon("phishing").build(),
            Extra.builder().id("stargazing").name("Stargazing Kit").description("Telescope, star map, and hot chocolate").price(35).icon("nights_stay").build(),
            Extra.builder().id("picnic").name("Gourmet Picnic").description("Local cheeses, meats, bread, and wine").price(45).icon("lunch_dining").build(),
            Extra.builder().id("marshmallow").name("S'mores Pack").description("Marshmallows, chocolate, and biscuits").price(8).icon("cookie").build(),
            Extra.builder().id("games").name("Games Bundle").description("Frisbee, football, and card games").price(10).icon("sports_soccer").build()
        );
        extras.forEach(extraRepository::save);
    }

    private void initCampsites() {
        // Initialize hand-crafted campsites
        initHandCraftedCampsites();

        // Generate additional campsites
        for (int i = 21; i <= 120; i++) {
            campsiteRepository.save(generateCampsite(i));
        }
    }

    private void initHandCraftedCampsites() {
        // Campsite 1: Eagle Point Camping
        campsiteRepository.save(Campsite.builder()
            .id("1")
            .name("Eagle Point Camping")
            .location("Ballyconneely, Co. Galway")
            .coordinates(Coordinates.builder().lat(53.4556).lng(-9.8986).build())
            .pricePerNight(28)
            .rating(4.9)
            .reviewCount(347)
            .description("Award-winning campsite on the shores of Mannin Bay with panoramic views of the Twelve Bens. Direct beach access, stunning sunsets, and the warmest hospitality in the West.")
            .imageUrl("https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800")
            .images(Arrays.asList(
                "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
                "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800"
            ))
            .facilities(Arrays.asList(
                Facility.builder().id("wifi").name("Free WiFi").icon("wifi").build(),
                Facility.builder().id("shower").name("Hot Showers").icon("shower").build(),
                Facility.builder().id("pets").name("Pet Friendly").icon("pets").build(),
                Facility.builder().id("power").name("Electric Hookup").icon("bolt").build(),
                Facility.builder().id("fire").name("Fire Pits").icon("local_fire_department").build()
            ))
            .lots(Arrays.asList(
                CampsiteLot.builder().id("lot1").name("Oceanfront Premium").type(CampsiteLot.LotType.tent).maxGuests(4).size("8m x 8m").pricePerNight(38).build(),
                CampsiteLot.builder().id("lot2").name("Bay View Standard").type(CampsiteLot.LotType.tent).maxGuests(4).size("6m x 6m").pricePerNight(28).build(),
                CampsiteLot.builder().id("lot3").name("Family Pitch XL").type(CampsiteLot.LotType.tent).maxGuests(8).size("10m x 10m").pricePerNight(45).build()
            ))
            .suppliers(Arrays.asList(
                LocalSupplier.builder().id("s1").name("O'Malley's Farm Shop").category(LocalSupplier.SupplierCategory.food).distance("1.2 km").alertsEnabled(true).build()
            ))
            .isSuperhost(true)
            .type(CampsiteLot.LotType.tent)
            .build());

        // Campsite 2: Clifden Eco Beach Camping
        campsiteRepository.save(Campsite.builder()
            .id("2")
            .name("Clifden Eco Beach Camping")
            .location("Clifden, Co. Galway")
            .coordinates(Coordinates.builder().lat(53.4879).lng(-10.0200).build())
            .pricePerNight(32)
            .rating(4.8)
            .reviewCount(218)
            .description("Sustainable camping at its finest. Solar-powered facilities, composting toilets, and wild swimming in crystal-clear Atlantic waters.")
            .imageUrl("https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800")
            .images(List.of("https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800"))
            .facilities(Arrays.asList(
                Facility.builder().id("wifi").name("Free WiFi").icon("wifi").build(),
                Facility.builder().id("shower").name("Solar Showers").icon("shower").build(),
                Facility.builder().id("eco").name("Eco Certified").icon("eco").build()
            ))
            .lots(Arrays.asList(
                CampsiteLot.builder().id("lot1").name("Eco Pod").type(CampsiteLot.LotType.glamping).maxGuests(2).size("4m diameter").pricePerNight(65).build(),
                CampsiteLot.builder().id("lot2").name("Wild Pitch").type(CampsiteLot.LotType.tent).maxGuests(4).size("6m x 6m").pricePerNight(32).build()
            ))
            .suppliers(List.of())
            .isSuperhost(true)
            .type(CampsiteLot.LotType.glamping)
            .build());

        // Campsite 3: Paddy's Point RV Park
        campsiteRepository.save(Campsite.builder()
            .id("3")
            .name("Paddy's Point RV Park")
            .location("Roundstone, Co. Galway")
            .coordinates(Coordinates.builder().lat(53.3942).lng(-9.9208).build())
            .pricePerNight(38)
            .rating(4.7)
            .reviewCount(156)
            .description("Purpose-built RV park with full hookups and stunning views of Roundstone Harbour.")
            .imageUrl("https://images.unsplash.com/photo-1533873984035-25970ab07461?w=800")
            .images(List.of("https://images.unsplash.com/photo-1533873984035-25970ab07461?w=800"))
            .facilities(Arrays.asList(
                Facility.builder().id("wifi").name("High-Speed WiFi").icon("wifi").build(),
                Facility.builder().id("power").name("Full Hookups").icon("bolt").build(),
                Facility.builder().id("laundry").name("Laundry Room").icon("local_laundry_service").build()
            ))
            .lots(Arrays.asList(
                CampsiteLot.builder().id("lot1").name("Harbour View Premium").type(CampsiteLot.LotType.rv).maxGuests(6).size("12m x 5m").pricePerNight(48).build(),
                CampsiteLot.builder().id("lot2").name("Standard RV Bay").type(CampsiteLot.LotType.rv).maxGuests(4).size("10m x 4m").pricePerNight(38).build()
            ))
            .suppliers(List.of())
            .isSuperhost(false)
            .type(CampsiteLot.LotType.rv)
            .build());

        // Campsite 4: Dingle Bay Hideaway
        campsiteRepository.save(Campsite.builder()
            .id("4")
            .name("Dingle Bay Hideaway")
            .location("Dingle, Co. Kerry")
            .coordinates(Coordinates.builder().lat(52.1409).lng(-10.2671).build())
            .pricePerNight(35)
            .rating(4.9)
            .reviewCount(412)
            .description("Intimate family-run campsite on the world-famous Dingle Peninsula. Wake to dolphin sightings.")
            .imageUrl("https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800")
            .images(List.of("https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800"))
            .facilities(Arrays.asList(
                Facility.builder().id("wifi").name("Free WiFi").icon("wifi").build(),
                Facility.builder().id("shower").name("Hot Showers").icon("shower").build(),
                Facility.builder().id("pets").name("Dog Friendly").icon("pets").build(),
                Facility.builder().id("kitchen").name("Camp Kitchen").icon("kitchen").build()
            ))
            .lots(Arrays.asList(
                CampsiteLot.builder().id("lot1").name("Fungie View").type(CampsiteLot.LotType.tent).maxGuests(4).size("7m x 7m").pricePerNight(42).build(),
                CampsiteLot.builder().id("lot2").name("Peninsula Pitch").type(CampsiteLot.LotType.tent).maxGuests(4).size("6m x 6m").pricePerNight(35).build()
            ))
            .suppliers(List.of())
            .isSuperhost(true)
            .type(CampsiteLot.LotType.tent)
            .build());

        // Campsite 5: Ring of Kerry Glamping
        campsiteRepository.save(Campsite.builder()
            .id("5")
            .name("Ring of Kerry Glamping")
            .location("Kenmare, Co. Kerry")
            .coordinates(Coordinates.builder().lat(51.8806).lng(-9.5833).build())
            .pricePerNight(89)
            .rating(4.9)
            .reviewCount(287)
            .description("Luxury safari tents with wood-burning stoves, king-size beds, and private decks overlooking Kenmare Bay.")
            .imageUrl("https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800")
            .images(List.of("https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800"))
            .facilities(Arrays.asList(
                Facility.builder().id("wifi").name("Premium WiFi").icon("wifi").build(),
                Facility.builder().id("shower").name("En-suite Bathroom").icon("shower").build(),
                Facility.builder().id("restaurant").name("Restaurant").icon("restaurant").build()
            ))
            .lots(Arrays.asList(
                CampsiteLot.builder().id("lot1").name("Safari Suite").type(CampsiteLot.LotType.glamping).maxGuests(2).size("35sqm").pricePerNight(145).build(),
                CampsiteLot.builder().id("lot2").name("Forest Lodge").type(CampsiteLot.LotType.glamping).maxGuests(4).size("45sqm").pricePerNight(175).build(),
                CampsiteLot.builder().id("lot3").name("Bay View Tent").type(CampsiteLot.LotType.glamping).maxGuests(2).size("28sqm").pricePerNight(89).build()
            ))
            .suppliers(List.of())
            .isSuperhost(true)
            .type(CampsiteLot.LotType.glamping)
            .build());

        // Campsite 6: Killarney Lakeside Camp
        campsiteRepository.save(Campsite.builder()
            .id("6")
            .name("Killarney Lakeside Camp")
            .location("Killarney, Co. Kerry")
            .coordinates(Coordinates.builder().lat(52.0598).lng(-9.5044).build())
            .pricePerNight(30)
            .rating(4.8)
            .reviewCount(523)
            .description("Gateway to Killarney National Park. Cycle the Gap of Dunloe, hike Torc Waterfall.")
            .imageUrl("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800")
            .images(List.of("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"))
            .facilities(Arrays.asList(
                Facility.builder().id("wifi").name("Free WiFi").icon("wifi").build(),
                Facility.builder().id("shower").name("Hot Showers").icon("shower").build(),
                Facility.builder().id("bikes").name("Bike Rental").icon("directions_bike").build(),
                Facility.builder().id("kayak").name("Kayak Hire").icon("kayaking").build()
            ))
            .lots(Arrays.asList(
                CampsiteLot.builder().id("lot1").name("Lakefront Deluxe").type(CampsiteLot.LotType.tent).maxGuests(4).size("8m x 8m").pricePerNight(45).build(),
                CampsiteLot.builder().id("lot2").name("Woodland Pitch").type(CampsiteLot.LotType.tent).maxGuests(4).size("6m x 6m").pricePerNight(30).build()
            ))
            .suppliers(List.of())
            .isSuperhost(true)
            .type(CampsiteLot.LotType.tent)
            .build());

        // Campsite 7: Cliffs of Moher Camping
        campsiteRepository.save(Campsite.builder()
            .id("7")
            .name("Cliffs of Moher Camping")
            .location("Doolin, Co. Clare")
            .coordinates(Coordinates.builder().lat(52.9719).lng(-9.4265).build())
            .pricePerNight(32)
            .rating(4.7)
            .reviewCount(389)
            .description("Camp within walking distance of Ireland's most iconic cliffs. Nightly trad sessions in Doolin village.")
            .imageUrl("https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800")
            .images(List.of("https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800"))
            .facilities(Arrays.asList(
                Facility.builder().id("wifi").name("Free WiFi").icon("wifi").build(),
                Facility.builder().id("shower").name("Hot Showers").icon("shower").build(),
                Facility.builder().id("fire").name("Fire Pits").icon("local_fire_department").build()
            ))
            .lots(Arrays.asList(
                CampsiteLot.builder().id("lot1").name("Cliff View Premium").type(CampsiteLot.LotType.tent).maxGuests(4).size("7m x 7m").pricePerNight(42).build(),
                CampsiteLot.builder().id("lot2").name("Village Side").type(CampsiteLot.LotType.tent).maxGuests(4).size("6m x 6m").pricePerNight(32).build()
            ))
            .suppliers(List.of())
            .isSuperhost(false)
            .type(CampsiteLot.LotType.tent)
            .build());

        // Continue with more campsites 8-20...
        initMoreHandCraftedCampsites();
    }

    private void initMoreHandCraftedCampsites() {
        // Campsite 8: Burren Basecamp
        campsiteRepository.save(Campsite.builder()
            .id("8")
            .name("Burren Basecamp")
            .location("Ballyvaughan, Co. Clare")
            .coordinates(Coordinates.builder().lat(53.1167).lng(-9.1500).build())
            .pricePerNight(28)
            .rating(4.8)
            .reviewCount(198)
            .description("Explore the lunar landscape of the Burren from this peaceful retreat.")
            .imageUrl("https://images.unsplash.com/photo-1487730116445-500c8a39a746?w=800")
            .images(List.of("https://images.unsplash.com/photo-1487730116445-500c8a39a746?w=800"))
            .facilities(Arrays.asList(
                Facility.builder().id("wifi").name("Basic WiFi").icon("wifi").build(),
                Facility.builder().id("shower").name("Showers").icon("shower").build(),
                Facility.builder().id("dark").name("Dark Sky Site").icon("nights_stay").build()
            ))
            .lots(Arrays.asList(
                CampsiteLot.builder().id("lot1").name("Stargazer Pitch").type(CampsiteLot.LotType.tent).maxGuests(4).size("6m x 6m").pricePerNight(32).build()
            ))
            .suppliers(List.of())
            .isSuperhost(true)
            .type(CampsiteLot.LotType.tent)
            .build());

        // Campsite 9: Glendalough Forest Retreat
        campsiteRepository.save(Campsite.builder()
            .id("9")
            .name("Glendalough Forest Retreat")
            .location("Glendalough, Co. Wicklow")
            .coordinates(Coordinates.builder().lat(53.0094).lng(-6.3277).build())
            .pricePerNight(45)
            .rating(4.9)
            .reviewCount(567)
            .description("Ancient monastic site meets modern glamping. Bell tents and treehouses in a mystical valley.")
            .imageUrl("https://images.unsplash.com/photo-1532339142463-fd0a8979791a?w=800")
            .images(List.of("https://images.unsplash.com/photo-1532339142463-fd0a8979791a?w=800"))
            .facilities(Arrays.asList(
                Facility.builder().id("wifi").name("Free WiFi").icon("wifi").build(),
                Facility.builder().id("shower").name("Luxury Showers").icon("shower").build(),
                Facility.builder().id("cafe").name("On-site Café").icon("local_cafe").build()
            ))
            .lots(Arrays.asList(
                CampsiteLot.builder().id("lot1").name("Treehouse Suite").type(CampsiteLot.LotType.cabin).maxGuests(2).size("20sqm").pricePerNight(125).build(),
                CampsiteLot.builder().id("lot2").name("Bell Tent Deluxe").type(CampsiteLot.LotType.glamping).maxGuests(4).size("5m diameter").pricePerNight(85).build()
            ))
            .suppliers(List.of())
            .isSuperhost(true)
            .type(CampsiteLot.LotType.glamping)
            .build());

        // Campsite 10: Powerscourt Wild Camp
        campsiteRepository.save(Campsite.builder()
            .id("10")
            .name("Powerscourt Wild Camp")
            .location("Enniskerry, Co. Wicklow")
            .coordinates(Coordinates.builder().lat(53.1847).lng(-6.1872).build())
            .pricePerNight(38)
            .rating(4.6)
            .reviewCount(234)
            .description("Hidden gem near Powerscourt Waterfall. Minimal impact camping for nature lovers.")
            .imageUrl("https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800")
            .images(List.of("https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800"))
            .facilities(Arrays.asList(
                Facility.builder().id("shower").name("Solar Showers").icon("shower").build(),
                Facility.builder().id("fire").name("Fire Pits").icon("local_fire_department").build(),
                Facility.builder().id("eco").name("Leave No Trace").icon("eco").build()
            ))
            .lots(Arrays.asList(
                CampsiteLot.builder().id("lot1").name("Waterfall View").type(CampsiteLot.LotType.tent).maxGuests(4).size("6m x 6m").pricePerNight(45).build()
            ))
            .suppliers(List.of())
            .isSuperhost(false)
            .type(CampsiteLot.LotType.tent)
            .build());

        // Add remaining campsites 11-20 in simplified form
        for (int i = 11; i <= 20; i++) {
            campsiteRepository.save(createSimpleCampsite(i));
        }
    }

    private Campsite createSimpleCampsite(int id) {
        String[] locations = {
            "Castletownbere, Co. Cork", "Kinsale, Co. Cork", "Carrick, Co. Donegal",
            "Fanad Head, Co. Donegal", "Bundoran, Co. Donegal", "Achill Island, Co. Mayo",
            "Westport, Co. Mayo", "Drumcliffe, Co. Sligo", "Mullaghmore, Co. Sligo",
            "Hook Head, Co. Wexford"
        };
        String[] names = {
            "Beara Peninsula Retreat", "Kinsale Harbour Camping", "Slieve League Camping",
            "Fanad Lighthouse Camp", "Bundoran Surf Camp", "Achill Island Adventures",
            "Croagh Patrick Basecamp", "Yeats Country Camping", "Mullaghmore Head Camp",
            "Hook Head Lighthouse Camp"
        };
        CampsiteLot.LotType[] types = {
            CampsiteLot.LotType.tent, CampsiteLot.LotType.tent, CampsiteLot.LotType.tent,
            CampsiteLot.LotType.tent, CampsiteLot.LotType.tent, CampsiteLot.LotType.tent,
            CampsiteLot.LotType.tent, CampsiteLot.LotType.tent, CampsiteLot.LotType.tent,
            CampsiteLot.LotType.tent
        };
        double[] prices = {25, 35, 22, 28, 30, 26, 32, 24, 28, 30};
        double[] ratings = {4.8, 4.7, 4.9, 4.8, 4.6, 4.8, 4.7, 4.7, 4.6, 4.8};

        int idx = id - 11;
        return Campsite.builder()
            .id(String.valueOf(id))
            .name(names[idx])
            .location(locations[idx])
            .coordinates(Coordinates.builder().lat(52 + seededRandom() * 3).lng(-7 - seededRandom() * 3).build())
            .pricePerNight(prices[idx])
            .rating(ratings[idx])
            .reviewCount(150 + (int)(seededRandom() * 300))
            .description("Beautiful campsite in the heart of Ireland's stunning countryside.")
            .imageUrl("https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800")
            .images(List.of("https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800"))
            .facilities(Arrays.asList(
                Facility.builder().id("wifi").name("Free WiFi").icon("wifi").build(),
                Facility.builder().id("shower").name("Hot Showers").icon("shower").build()
            ))
            .lots(Arrays.asList(
                CampsiteLot.builder().id("lot1").name("Standard Pitch").type(types[idx]).maxGuests(4).size("6m x 6m").pricePerNight(prices[idx]).build()
            ))
            .suppliers(List.of())
            .isSuperhost(seededRandom() > 0.5)
            .type(types[idx])
            .build();
    }

    private Campsite generateCampsite(int id) {
        String[][] locationData = {
            {"Letterfrack", "Galway"}, {"Leenane", "Galway"}, {"Waterville", "Kerry"},
            {"Sneem", "Kerry"}, {"Lahinch", "Clare"}, {"Kilkee", "Clare"},
            {"Avoca", "Wicklow"}, {"Schull", "Cork"}, {"Baltimore", "Cork"},
            {"Dunfanaghy", "Donegal"}, {"Ardara", "Donegal"}, {"Belmullet", "Mayo"},
            {"Strandhill", "Sligo"}, {"Dunmore East", "Waterford"}, {"Courtown", "Wexford"}
        };

        String[] prefixes = {"Wild", "Atlantic", "Emerald", "Celtic", "Coastal", "Lakeside", "Mountain", "Forest", "Harbour", "Bay", "Valley"};
        String[] suffixes = {"Camping", "Camp", "Retreat", "Hideaway", "Haven", "Escape", "Oasis", "Basecamp"};

        String[] location = locationData[(int)(seededRandom() * locationData.length)];
        String prefix = prefixes[(int)(seededRandom() * prefixes.length)];
        String suffix = suffixes[(int)(seededRandom() * suffixes.length)];

        CampsiteLot.LotType type;
        double typeRoll = seededRandom();
        if (typeRoll < 0.40) type = CampsiteLot.LotType.tent;
        else if (typeRoll < 0.65) type = CampsiteLot.LotType.glamping;
        else if (typeRoll < 0.85) type = CampsiteLot.LotType.rv;
        else type = CampsiteLot.LotType.cabin;

        double basePrice;
        switch (type) {
            case tent: basePrice = 20 + seededRandom() * 25; break;
            case rv: basePrice = 30 + seededRandom() * 25; break;
            case glamping: basePrice = 65 + seededRandom() * 80; break;
            default: basePrice = 80 + seededRandom() * 70;
        }

        double rating = Math.round((3.8 + seededRandom() * 1.2) * 10) / 10.0;

        List<Facility> facilities = new ArrayList<>();
        facilities.add(Facility.builder().id("wifi").name("Free WiFi").icon("wifi").build());
        facilities.add(Facility.builder().id("shower").name("Hot Showers").icon("shower").build());
        if (seededRandom() > 0.5) facilities.add(Facility.builder().id("fire").name("Fire Pits").icon("local_fire_department").build());
        if (seededRandom() > 0.5) facilities.add(Facility.builder().id("pets").name("Pet Friendly").icon("pets").build());

        List<CampsiteLot> lots = new ArrayList<>();
        lots.add(CampsiteLot.builder()
            .id("lot1")
            .name("Standard Pitch")
            .type(type)
            .maxGuests(2 + (int)(seededRandom() * 4))
            .size("6m x 6m")
            .pricePerNight(basePrice)
            .build());

        if (seededRandom() > 0.5) {
            lots.add(CampsiteLot.builder()
                .id("lot2")
                .name("Premium Pitch")
                .type(type)
                .maxGuests(4)
                .size("8m x 8m")
                .pricePerNight(basePrice + 15)
                .build());
        }

        return Campsite.builder()
            .id(String.valueOf(id))
            .name(prefix + " " + suffix)
            .location(location[0] + ", Co. " + location[1])
            .coordinates(Coordinates.builder()
                .lat(51.5 + seededRandom() * 3.5)
                .lng(-6 - seededRandom() * 4)
                .build())
            .pricePerNight(basePrice)
            .rating(rating)
            .reviewCount(50 + (int)(seededRandom() * 500))
            .description("A hidden gem in the heart of the Irish countryside. Perfect for families and adventurers alike.")
            .imageUrl("https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800")
            .images(List.of("https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800"))
            .facilities(facilities)
            .lots(lots)
            .suppliers(List.of())
            .isSuperhost(seededRandom() > 0.4)
            .type(type)
            .build();
    }

    private void initOffers() {
        // Food offers
        offerRepository.save(SupplierOffer.builder()
            .id("o1").supplierId("s1").supplierName("Joe's Organic Butcher")
            .supplierLogo("https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=100")
            .category(SupplierOffer.OfferCategory.food)
            .title("Campfire BBQ Pack")
            .description("Premium Irish beef burgers, sausages, and marinated chicken.")
            .imageUrl("https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800")
            .discount("15% OFF")
            .tags(Arrays.asList("#Food", "#BBQ", "#LocalProduce"))
            .location("Clifden, Co. Galway").distance("2.3 km").build());

        offerRepository.save(SupplierOffer.builder()
            .id("o2").supplierId("s4").supplierName("Dingle Seafood")
            .supplierLogo("https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=100")
            .category(SupplierOffer.OfferCategory.food)
            .title("Fresh Catch Box")
            .description("Daily fresh catch from Dingle Bay. Includes mussels, crab claws, and smoked salmon.")
            .imageUrl("https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800")
            .discount("20% OFF")
            .tags(Arrays.asList("#Seafood", "#Fresh", "#LocalCatch"))
            .location("Dingle, Co. Kerry").distance("1.5 km").build());

        offerRepository.save(SupplierOffer.builder()
            .id("o3").supplierId("s6").supplierName("The Irish Pantry")
            .supplierLogo("https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100")
            .category(SupplierOffer.OfferCategory.food)
            .title("Artisan Breakfast Hamper")
            .description("Local farm eggs, rashers, black & white pudding, brown bread, and butter.")
            .imageUrl("https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800")
            .discount("€10 OFF")
            .tags(Arrays.asList("#Breakfast", "#Artisan", "#IrishFood"))
            .location("Kenmare, Co. Kerry").distance("0.8 km").build());

        // Activity offers
        offerRepository.save(SupplierOffer.builder()
            .id("o7").supplierId("s2").supplierName("Bay Kayaks")
            .supplierLogo("https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100")
            .category(SupplierOffer.OfferCategory.activity)
            .title("Sunset Paddle Tour")
            .description("Guided kayak tour around the bay with stunning sunset views.")
            .imageUrl("https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=800")
            .discount("2-FOR-1")
            .tags(Arrays.asList("#Activity", "#Kayaking", "#Sunset"))
            .location("Connemara, Co. Galway").distance("0.5 km").build());

        offerRepository.save(SupplierOffer.builder()
            .id("o8").supplierId("s5").supplierName("Atlantic Surf School")
            .supplierLogo("https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=100")
            .category(SupplierOffer.OfferCategory.activity)
            .title("Beginner Surf Lesson")
            .description("2-hour group lesson with all equipment provided.")
            .imageUrl("https://images.unsplash.com/photo-1455264745730-cb3b76250ae8?w=800")
            .discount("25% OFF")
            .tags(Arrays.asList("#Surfing", "#Lessons", "#BeachLife"))
            .location("Inch Beach, Co. Kerry").distance("0.2 km").build());

        offerRepository.save(SupplierOffer.builder()
            .id("o9").supplierId("s10").supplierName("Cliffs Walking Tours")
            .supplierLogo("https://images.unsplash.com/photo-1551632811-561732d1e306?w=100")
            .category(SupplierOffer.OfferCategory.activity)
            .title("Guided Cliff Walk")
            .description("4-hour guided walk along the Cliffs of Moher.")
            .imageUrl("https://images.unsplash.com/photo-1509310202330-aec5af561c6b?w=800")
            .discount("20% OFF")
            .tags(Arrays.asList("#Walking", "#CliffsOfMoher", "#GuidedTour"))
            .location("Doolin, Co. Clare").distance("1.8 km").build());

        // Gear offers
        offerRepository.save(SupplierOffer.builder()
            .id("o15").supplierId("s3").supplierName("Camp Supplies Co.")
            .supplierLogo("https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=100")
            .category(SupplierOffer.OfferCategory.gear)
            .title("Weekend Camping Kit")
            .description("Everything you forgot to pack: torches, batteries, first aid.")
            .imageUrl("https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800")
            .discount("10% OFF")
            .tags(Arrays.asList("#Gear", "#Essentials", "#CampingKit"))
            .location("Clifden, Co. Galway").distance("3.1 km").build());

        // Wellness offers
        offerRepository.save(SupplierOffer.builder()
            .id("o19").supplierId("s19").supplierName("Mobile Massage Ireland")
            .supplierLogo("https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=100")
            .category(SupplierOffer.OfferCategory.wellness)
            .title("Campsite Massage")
            .description("Professional massage therapist comes to you. 60-minute session.")
            .imageUrl("https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800")
            .discount("€15 OFF")
            .tags(Arrays.asList("#Wellness", "#Massage", "#Relaxation"))
            .location("Killarney, Co. Kerry").distance("4.5 km").build());

        offerRepository.save(SupplierOffer.builder()
            .id("o20").supplierId("s20").supplierName("Dawn Yoga Retreats")
            .supplierLogo("https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=100")
            .category(SupplierOffer.OfferCategory.wellness)
            .title("Sunrise Beach Yoga")
            .description("Start your day with oceanside yoga. All levels welcome.")
            .imageUrl("https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800")
            .discount("2-FOR-1")
            .tags(Arrays.asList("#Yoga", "#Sunrise", "#Beach"))
            .location("Inch Beach, Co. Kerry").distance("0.4 km").build());

        // Experience offers
        offerRepository.save(SupplierOffer.builder()
            .id("o22").supplierId("s22").supplierName("O'Connor's Pub")
            .supplierLogo("https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=100")
            .category(SupplierOffer.OfferCategory.experience)
            .title("Traditional Music Night")
            .description("Authentic Irish trad session with local musicians.")
            .imageUrl("https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800")
            .discount("€10 OFF")
            .tags(Arrays.asList("#TradMusic", "#IrishPub", "#Culture"))
            .location("Doolin, Co. Clare").distance("1.3 km").build());

        offerRepository.save(SupplierOffer.builder()
            .id("o24").supplierId("s24").supplierName("Whiskey & Tales")
            .supplierLogo("https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=100")
            .category(SupplierOffer.OfferCategory.experience)
            .title("Irish Whiskey Tasting")
            .description("Sample 5 premium Irish whiskeys with expert guidance.")
            .imageUrl("https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800")
            .discount("15% OFF")
            .tags(Arrays.asList("#Whiskey", "#Tasting", "#IrishCulture"))
            .location("Kenmare, Co. Kerry").distance("1.1 km").build());
    }

    private void initSampleBookings() {
        Campsite campsite = campsiteRepository.findById("1").orElse(null);
        if (campsite == null) return;

        CampsiteLot lot = campsite.getLots().get(0);
        List<Extra> extras = new ArrayList<>(extraRepository.findAll()).subList(0, 2);

        // Past booking
        bookingRepository.save(Booking.builder()
            .id("booking-1")
            .reference("ISL-2025-8821")
            .campsiteId("1")
            .campsite(campsite)
            .lotId(lot.getId())
            .lot(lot)
            .checkIn(LocalDate.now().minusDays(30))
            .checkOut(LocalDate.now().minusDays(27))
            .nights(3)
            .guests(Guests.builder().adults(2).children(1).build())
            .extras(extras)
            .status(Booking.BookingStatus.completed)
            .totalPrice(lot.getPricePerNight() * 3 + extras.stream().mapToDouble(Extra::getPrice).sum())
            .createdAt(LocalDateTime.now().minusDays(45))
            .userId("user-1")
            .build());

        // Upcoming booking
        bookingRepository.save(Booking.builder()
            .id("booking-2")
            .reference("ISL-2025-8822")
            .campsiteId("1")
            .campsite(campsite)
            .lotId(lot.getId())
            .lot(lot)
            .checkIn(LocalDate.now().plusDays(14))
            .checkOut(LocalDate.now().plusDays(17))
            .nights(3)
            .guests(Guests.builder().adults(2).children(0).build())
            .extras(List.of())
            .status(Booking.BookingStatus.confirmed)
            .totalPrice(lot.getPricePerNight() * 3)
            .createdAt(LocalDateTime.now().minusDays(7))
            .userId("user-1")
            .build());
    }
}
