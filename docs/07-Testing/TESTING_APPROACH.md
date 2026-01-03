# Testing Approach for my-island Backend API

This document outlines the testing strategy, patterns, and priorities for the my-island backend API. **Our approach prioritizes E2E and integration tests over unit tests** to validate real system behavior with actual infrastructure using Testcontainers.

## Table of Contents
- [Testing Philosophy](#testing-philosophy)
- [Testing Trophy (Not Pyramid)](#testing-trophy-not-pyramid)
- [Test Infrastructure](#test-infrastructure)
- [Testcontainers Setup](#testcontainers-setup)
- [Testing Layers](#testing-layers)
- [E2E Test Flows](#e2e-test-flows)
- [Priority Test Areas](#priority-test-areas)
- [Test Organization](#test-organization)
- [Naming Conventions](#naming-conventions)
- [Code Examples](#code-examples)
- [CI/CD Integration](#cicd-integration)
- [Coverage Goals](#coverage-goals)

---

## Testing Philosophy

### Core Principles

1. **Test real behavior with real infrastructure** - Use Testcontainers to spin up actual PostgreSQL, Kafka, and LocalStack containers
2. **E2E tests provide the most confidence** - A passing E2E test proves the entire flow works
3. **Integration tests catch interface issues** - Real HTTP requests, real database queries, real event publishing
4. **Unit tests for complex algorithms only** - Reserve unit tests for pure functions and complex business logic
5. **Avoid mocking where possible** - Mocks can hide integration bugs; prefer real dependencies

### Why E2E-First?

| Approach | Pros | Cons |
|----------|------|------|
| **E2E/Integration-heavy** | Tests real behavior, catches integration bugs, high confidence | Slower, requires containers |
| **Unit-heavy** | Fast, isolated | Mocks hide bugs, false confidence, refactoring breaks tests |

**Our choice**: Slower tests that catch real bugs > fast tests that miss integration issues.

---

## Testing Trophy (Not Pyramid)

We follow the **Testing Trophy** pattern (popularized by Kent C. Dodds) rather than the traditional testing pyramid:

```
                        ════════════════
                       ║   Static Types  ║     (TypeScript/Java compiler)
                        ════════════════
                              ║
                    ┌─────────────────────┐
                    │                     │
                    │    E2E Tests        │     ~40% of tests
                    │  (Full user flows)  │     Testcontainers + REST Assured
                    │                     │
                    └─────────────────────┘
                              │
            ┌─────────────────────────────────┐
            │                                 │
            │      Integration Tests          │     ~45% of tests
            │   (API endpoints, DB queries,   │     Testcontainers + MockMvc
            │    Kafka events, Security)      │
            │                                 │
            └─────────────────────────────────┘
                              │
                      ┌───────────────┐
                      │  Unit Tests   │            ~15% of tests
                      │ (Pure logic)  │            JUnit + AssertJ
                      └───────────────┘
```

### Test Distribution

| Type | Percentage | Purpose | Speed |
|------|------------|---------|-------|
| **E2E** | 40% | Complete user journeys, API contracts | <60s |
| **Integration** | 45% | Component interaction, DB, events | <10s |
| **Unit** | 15% | Complex algorithms, utilities | <50ms |

---

## Test Infrastructure

### Required Dependencies

The project has these configured in `pom.xml`:

| Tool | Purpose | Used For |
|------|---------|----------|
| **Testcontainers** | Container orchestration | All E2E/integration tests |
| **PostgreSQL Container** | Real database | Data persistence tests |
| **Kafka Container** | Real message broker | Event flow tests |
| **LocalStack** | AWS S3/SES simulation | File upload, email tests |
| **REST Assured** | HTTP API testing | E2E API tests |
| **MockMvc** | Spring MVC testing | Integration tests |
| **Spring Security Test** | Auth testing | Security integration tests |

### Add REST Assured (if not present)

```xml
<dependency>
    <groupId>io.rest-assured</groupId>
    <artifactId>rest-assured</artifactId>
    <version>5.4.0</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>io.rest-assured</groupId>
    <artifactId>spring-mock-mvc</artifactId>
    <version>5.4.0</version>
    <scope>test</scope>
</dependency>
```

---

## Testcontainers Setup

### Base Configuration Class

```java
@TestConfiguration(proxyBeanMethods = false)
public class TestcontainersConfiguration {

    @Bean
    @ServiceConnection
    public PostgreSQLContainer<?> postgresContainer() {
        return new PostgreSQLContainer<>(DockerImageName.parse("postgres:17-alpine"))
            .withDatabaseName("myisland_test")
            .withUsername("test")
            .withPassword("test")
            .withReuse(true);  // Reuse containers across tests
    }

    @Bean
    @ServiceConnection
    public KafkaContainer kafkaContainer() {
        return new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.5.0"))
            .withReuse(true);
    }

    @Bean
    public LocalStackContainer localStackContainer() {
        return new LocalStackContainer(DockerImageName.parse("localstack/localstack:3.0"))
            .withServices(LocalStackContainer.Service.S3, LocalStackContainer.Service.SES)
            .withReuse(true);
    }
}
```

### Enable Container Reuse

In `src/test/resources/testcontainers.properties`:
```properties
testcontainers.reuse.enable=true
```

### Singleton Container Pattern (Recommended)

For faster test execution, use singleton containers shared across all tests:

```java
public abstract class AbstractIntegrationTest {

    static final PostgreSQLContainer<?> POSTGRES;
    static final KafkaContainer KAFKA;
    static final LocalStackContainer LOCALSTACK;

    static {
        POSTGRES = new PostgreSQLContainer<>(DockerImageName.parse("postgres:17-alpine"))
            .withDatabaseName("myisland_test")
            .withReuse(true);

        KAFKA = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.5.0"))
            .withReuse(true);

        LOCALSTACK = new LocalStackContainer(DockerImageName.parse("localstack/localstack:3.0"))
            .withServices(LocalStackContainer.Service.S3, LocalStackContainer.Service.SES)
            .withReuse(true);

        // Start all containers in parallel
        Startables.deepStart(POSTGRES, KAFKA, LOCALSTACK).join();
    }

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        // PostgreSQL
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);

        // Kafka
        registry.add("spring.kafka.bootstrap-servers", KAFKA::getBootstrapServers);

        // LocalStack S3
        registry.add("aws.s3.endpoint", () -> LOCALSTACK.getEndpointOverride(LocalStackContainer.Service.S3).toString());
        registry.add("aws.ses.endpoint", () -> LOCALSTACK.getEndpointOverride(LocalStackContainer.Service.SES).toString());
    }
}
```

---

## Testing Layers

### 1. E2E Tests (40% - Primary Focus)

**Purpose**: Test complete user flows from API request to database to events

**Characteristics**:
- Full Spring Boot application running
- Real PostgreSQL, Kafka, LocalStack containers
- HTTP requests via REST Assured or WebTestClient
- Verify end-to-end data flow

**What to Test**:
- Complete booking flow: search → select → book → confirm → email sent
- Authentication flow: register → login → access protected resource → refresh token
- Owner flow: create campsite → add lots → receive booking → view revenue
- Search flow: filter by dates/amenities → paginated results → correct data

### 2. Integration Tests (45%)

**Purpose**: Test component integration with real infrastructure

**Characteristics**:
- `@SpringBootTest` with Testcontainers
- Test single API endpoints thoroughly
- Test repository queries against real database
- Test Kafka event publishing/consumption

**What to Test**:
- Each REST endpoint (all HTTP methods, status codes, edge cases)
- Repository custom queries
- Security/authorization rules
- Event publishing and consumption
- Input validation and error responses

### 3. Unit Tests (15% - Selective)

**Purpose**: Test pure functions and complex algorithms

**When to Use Unit Tests**:
- Price calculation logic
- Date/availability algorithms
- Validation utilities
- Mappers with complex transformations

**When NOT to Use Unit Tests**:
- Simple CRUD service methods
- Controllers (use integration tests)
- Anything requiring mocked repositories

---

## E2E Test Flows

### Critical Flows to Test

#### 1. Complete Booking Flow

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class BookingFlowE2ETest extends AbstractIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CampsiteRepository campsiteRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        RestAssured.basePath = "/api";
        bookingRepository.deleteAll();
    }

    @Test
    void shouldCompleteFullBookingFlow() {
        // Step 1: Register a new user
        var registerRequest = Map.of(
            "email", "guest@test.com",
            "password", "SecurePass123!",
            "firstName", "Test",
            "lastName", "Guest"
        );

        var authResponse = given()
            .contentType(ContentType.JSON)
            .body(registerRequest)
        .when()
            .post("/auth/register")
        .then()
            .statusCode(201)
            .extract()
            .as(AuthResponse.class);

        String accessToken = authResponse.getAccessToken();

        // Step 2: Search for available campsites
        var searchResults = given()
            .queryParam("checkIn", LocalDate.now().plusDays(7))
            .queryParam("checkOut", LocalDate.now().plusDays(10))
            .queryParam("guests", 2)
        .when()
            .get("/campsites/search")
        .then()
            .statusCode(200)
            .body("content.size()", greaterThan(0))
            .extract()
            .jsonPath()
            .getList("content", CampsiteResponse.class);

        Long campsiteId = searchResults.get(0).getId();

        // Step 3: Get campsite details with available lots
        var campsiteDetail = given()
            .queryParam("checkIn", LocalDate.now().plusDays(7))
            .queryParam("checkOut", LocalDate.now().plusDays(10))
        .when()
            .get("/campsites/{id}", campsiteId)
        .then()
            .statusCode(200)
            .body("availableLots.size()", greaterThan(0))
            .extract()
            .as(CampsiteDetailResponse.class);

        Long lotId = campsiteDetail.getAvailableLots().get(0).getId();

        // Step 4: Create booking
        var bookingRequest = Map.of(
            "lotId", lotId,
            "checkIn", LocalDate.now().plusDays(7).toString(),
            "checkOut", LocalDate.now().plusDays(10).toString(),
            "guestCount", 2,
            "specialRequests", "Late arrival"
        );

        var booking = given()
            .header("Authorization", "Bearer " + accessToken)
            .contentType(ContentType.JSON)
            .body(bookingRequest)
        .when()
            .post("/bookings")
        .then()
            .statusCode(201)
            .body("status", equalTo("PENDING"))
            .body("totalPrice", greaterThan(0f))
            .extract()
            .as(BookingResponse.class);

        // Step 5: Verify booking exists in database
        var savedBooking = bookingRepository.findById(booking.getId());
        assertThat(savedBooking).isPresent();
        assertThat(savedBooking.get().getStatus()).isEqualTo(BookingStatus.PENDING);

        // Step 6: Verify booking appears in user's bookings
        given()
            .header("Authorization", "Bearer " + accessToken)
        .when()
            .get("/bookings/my")
        .then()
            .statusCode(200)
            .body("content.size()", equalTo(1))
            .body("content[0].id", equalTo(booking.getId().intValue()));

        // Step 7: Confirm booking (simulate payment)
        given()
            .header("Authorization", "Bearer " + accessToken)
            .contentType(ContentType.JSON)
            .body(Map.of("paymentIntentId", "pi_test_123"))
        .when()
            .post("/bookings/{id}/confirm", booking.getId())
        .then()
            .statusCode(200)
            .body("status", equalTo("CONFIRMED"));

        // Step 8: Verify lot is no longer available for same dates
        given()
            .queryParam("checkIn", LocalDate.now().plusDays(7))
            .queryParam("checkOut", LocalDate.now().plusDays(10))
        .when()
            .get("/campsites/{id}", campsiteId)
        .then()
            .statusCode(200)
            .body("availableLots.id", not(hasItem(lotId.intValue())));
    }

    @Test
    void shouldPreventDoubleBooking() {
        // Setup: Create first booking
        String token = authenticateUser("user1@test.com");
        Long lotId = getAvailableLotId();

        var bookingRequest = Map.of(
            "lotId", lotId,
            "checkIn", LocalDate.now().plusDays(5).toString(),
            "checkOut", LocalDate.now().plusDays(8).toString(),
            "guestCount", 2
        );

        // First booking succeeds
        given()
            .header("Authorization", "Bearer " + token)
            .contentType(ContentType.JSON)
            .body(bookingRequest)
        .when()
            .post("/bookings")
        .then()
            .statusCode(201);

        // Second user tries same lot/dates
        String token2 = authenticateUser("user2@test.com");

        given()
            .header("Authorization", "Bearer " + token2)
            .contentType(ContentType.JSON)
            .body(bookingRequest)
        .when()
            .post("/bookings")
        .then()
            .statusCode(409)
            .body("message", containsString("not available"));
    }
}
```

#### 2. Authentication Flow

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class AuthFlowE2ETest extends AbstractIntegrationTest {

    @LocalServerPort
    private int port;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        RestAssured.basePath = "/api";
    }

    @Test
    void shouldCompleteFullAuthenticationFlow() {
        String email = "newuser_" + System.currentTimeMillis() + "@test.com";

        // Step 1: Register
        var registerResponse = given()
            .contentType(ContentType.JSON)
            .body(Map.of(
                "email", email,
                "password", "SecurePass123!",
                "firstName", "John",
                "lastName", "Doe"
            ))
        .when()
            .post("/auth/register")
        .then()
            .statusCode(201)
            .body("accessToken", notNullValue())
            .body("refreshToken", notNullValue())
            .body("user.email", equalTo(email))
            .extract()
            .as(AuthResponse.class);

        // Step 2: Access protected resource
        given()
            .header("Authorization", "Bearer " + registerResponse.getAccessToken())
        .when()
            .get("/users/me")
        .then()
            .statusCode(200)
            .body("email", equalTo(email));

        // Step 3: Logout (invalidate refresh token)
        given()
            .header("Authorization", "Bearer " + registerResponse.getAccessToken())
        .when()
            .post("/auth/logout")
        .then()
            .statusCode(200);

        // Step 4: Login again
        var loginResponse = given()
            .contentType(ContentType.JSON)
            .body(Map.of(
                "email", email,
                "password", "SecurePass123!"
            ))
        .when()
            .post("/auth/login")
        .then()
            .statusCode(200)
            .body("accessToken", notNullValue())
            .extract()
            .as(AuthResponse.class);

        // Step 5: Use refresh token
        given()
            .contentType(ContentType.JSON)
            .body(Map.of("refreshToken", loginResponse.getRefreshToken()))
        .when()
            .post("/auth/refresh")
        .then()
            .statusCode(200)
            .body("accessToken", notNullValue());
    }

    @Test
    void shouldRejectInvalidCredentials() {
        given()
            .contentType(ContentType.JSON)
            .body(Map.of(
                "email", "nonexistent@test.com",
                "password", "wrongpassword"
            ))
        .when()
            .post("/auth/login")
        .then()
            .statusCode(401)
            .body("message", containsString("Invalid"));
    }

    @Test
    void shouldRejectExpiredToken() {
        // Use a pre-generated expired token
        String expiredToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwiZXhwIjoxNjAwMDAwMDAwfQ.xxx";

        given()
            .header("Authorization", "Bearer " + expiredToken)
        .when()
            .get("/users/me")
        .then()
            .statusCode(401);
    }
}
```

#### 3. Owner Management Flow

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class OwnerFlowE2ETest extends AbstractIntegrationTest {

    @LocalServerPort
    private int port;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        RestAssured.basePath = "/api";
    }

    @Test
    void shouldAllowOwnerToManageCampsite() {
        // Step 1: Register as owner
        String ownerToken = registerOwner("owner@test.com");

        // Step 2: Create campsite
        var campsiteRequest = Map.of(
            "name", "Lakeside Retreat",
            "description", "Beautiful lakeside camping",
            "county", "Kerry",
            "latitude", 52.0598,
            "longitude", -9.5044,
            "facilities", List.of("WIFI", "SHOWERS", "ELECTRIC_HOOKUP")
        );

        var campsite = given()
            .header("Authorization", "Bearer " + ownerToken)
            .contentType(ContentType.JSON)
            .body(campsiteRequest)
        .when()
            .post("/owner/campsites")
        .then()
            .statusCode(201)
            .body("name", equalTo("Lakeside Retreat"))
            .extract()
            .as(CampsiteResponse.class);

        // Step 3: Add lots to campsite
        var lotRequest = Map.of(
            "name", "Lot A1",
            "type", "TENT",
            "maxGuests", 4,
            "pricePerNight", 35.00
        );

        given()
            .header("Authorization", "Bearer " + ownerToken)
            .contentType(ContentType.JSON)
            .body(lotRequest)
        .when()
            .post("/owner/campsites/{id}/lots", campsite.getId())
        .then()
            .statusCode(201)
            .body("name", equalTo("Lot A1"));

        // Step 4: Verify campsite appears in public search
        given()
        .when()
            .get("/campsites/{id}", campsite.getId())
        .then()
            .statusCode(200)
            .body("lots.size()", equalTo(1));

        // Step 5: View owner dashboard
        given()
            .header("Authorization", "Bearer " + ownerToken)
        .when()
            .get("/owner/dashboard")
        .then()
            .statusCode(200)
            .body("totalCampsites", greaterThanOrEqualTo(1));
    }

    @Test
    void shouldPreventNonOwnerFromAccessingOwnerEndpoints() {
        String userToken = authenticateUser("regularuser@test.com");

        given()
            .header("Authorization", "Bearer " + userToken)
        .when()
            .get("/owner/dashboard")
        .then()
            .statusCode(403);
    }
}
```

#### 4. Kafka Event Flow

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class BookingEventFlowE2ETest extends AbstractIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @SpyBean
    private EmailListener emailListener;

    @SpyBean
    private NotificationListener notificationListener;

    @Test
    void shouldPublishAndConsumeBookingCreatedEvent() {
        // Create a booking via API
        String token = authenticateUser("eventtest@test.com");
        Long lotId = getAvailableLotId();

        given()
            .header("Authorization", "Bearer " + token)
            .contentType(ContentType.JSON)
            .body(Map.of(
                "lotId", lotId,
                "checkIn", LocalDate.now().plusDays(10).toString(),
                "checkOut", LocalDate.now().plusDays(12).toString(),
                "guestCount", 2
            ))
        .when()
            .post("/api/bookings")
        .then()
            .statusCode(201);

        // Verify event was consumed by listeners
        await()
            .atMost(Duration.ofSeconds(10))
            .untilAsserted(() -> {
                verify(emailListener, atLeastOnce())
                    .handleBookingEvent(argThat(event ->
                        event.getType() == BookingEventType.CREATED
                    ));
            });

        await()
            .atMost(Duration.ofSeconds(10))
            .untilAsserted(() -> {
                verify(notificationListener, atLeastOnce())
                    .handleBookingEvent(any());
            });
    }

    @Test
    void shouldSendEmailOnBookingConfirmation() {
        // Setup: Create and confirm a booking
        String token = authenticateUser("emailtest@test.com");
        Long bookingId = createBooking(token);

        // Confirm booking
        given()
            .header("Authorization", "Bearer " + token)
            .contentType(ContentType.JSON)
            .body(Map.of("paymentIntentId", "pi_test"))
        .when()
            .post("/api/bookings/{id}/confirm", bookingId)
        .then()
            .statusCode(200);

        // Verify confirmation email event was processed
        await()
            .atMost(Duration.ofSeconds(10))
            .untilAsserted(() -> {
                verify(emailListener, atLeastOnce())
                    .handleBookingEvent(argThat(event ->
                        event.getType() == BookingEventType.CONFIRMED
                    ));
            });
    }
}
```

---

## Priority Test Areas

### Tier 1 - E2E Flows (Implement First)

| Flow | Tests | Priority |
|------|-------|----------|
| **Complete Booking** | 5-10 E2E tests | Critical |
| **Authentication** | 5-8 E2E tests | Critical |
| **Owner Management** | 5-8 E2E tests | High |
| **Search & Discovery** | 3-5 E2E tests | High |

### Tier 2 - Integration Tests

| Component | Tests | Priority |
|-----------|-------|----------|
| All Controller Endpoints | 50+ tests | High |
| Repository Custom Queries | 20+ tests | High |
| Security/Authorization | 15+ tests | Critical |
| Kafka Events | 10+ tests | Medium |

### Tier 3 - Unit Tests (Selective)

| Component | Tests | Priority |
|-----------|-------|----------|
| Price Calculator | 10+ tests | High |
| Availability Logic | 10+ tests | High |
| Date Utilities | 5+ tests | Medium |
| Validators | 5+ tests | Medium |

---

## Test Organization

### Directory Structure

```
my-island-api/src/test/java/com/example/myislandapi/
├── e2e/                          # E2E flow tests (40%)
│   ├── BookingFlowE2ETest.java
│   ├── AuthFlowE2ETest.java
│   ├── OwnerFlowE2ETest.java
│   ├── SearchFlowE2ETest.java
│   └── EventFlowE2ETest.java
├── integration/                   # Integration tests (45%)
│   ├── controller/
│   │   ├── AuthControllerTest.java
│   │   ├── BookingControllerTest.java
│   │   ├── CampsiteControllerTest.java
│   │   ├── OwnerControllerTest.java
│   │   └── ...
│   ├── repository/
│   │   ├── BookingRepositoryTest.java
│   │   ├── CampsiteRepositoryTest.java
│   │   └── ...
│   ├── security/
│   │   └── SecurityConfigTest.java
│   └── kafka/
│       └── BookingEventTest.java
├── unit/                          # Unit tests (15%)
│   ├── PriceCalculatorTest.java
│   ├── AvailabilityCheckerTest.java
│   └── DateUtilsTest.java
├── config/                        # Test configuration
│   ├── AbstractIntegrationTest.java
│   └── TestcontainersConfiguration.java
└── fixture/                       # Test data builders
    ├── UserFixtures.java
    ├── CampsiteFixtures.java
    ├── BookingFixtures.java
    └── TestDataSeeder.java
```

### Base Test Classes

```java
/**
 * Base class for ALL E2E and integration tests.
 * Provides shared Testcontainers infrastructure.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Testcontainers
public abstract class AbstractIntegrationTest {

    static final PostgreSQLContainer<?> POSTGRES;
    static final KafkaContainer KAFKA;
    static final LocalStackContainer LOCALSTACK;

    static {
        POSTGRES = new PostgreSQLContainer<>(DockerImageName.parse("postgres:17-alpine"))
            .withDatabaseName("myisland_test")
            .withReuse(true);

        KAFKA = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.5.0"))
            .withReuse(true);

        LOCALSTACK = new LocalStackContainer(DockerImageName.parse("localstack/localstack:3.0"))
            .withServices(LocalStackContainer.Service.S3, LocalStackContainer.Service.SES)
            .withReuse(true);

        Startables.deepStart(POSTGRES, KAFKA, LOCALSTACK).join();
    }

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
        registry.add("spring.kafka.bootstrap-servers", KAFKA::getBootstrapServers);
        registry.add("aws.s3.endpoint", () ->
            LOCALSTACK.getEndpointOverride(LocalStackContainer.Service.S3).toString());
    }

    @LocalServerPort
    protected int port;

    @Autowired
    protected TestDataSeeder dataSeeder;

    @BeforeEach
    void setUpRestAssured() {
        RestAssured.port = port;
        RestAssured.basePath = "/api";
    }

    // Helper methods for all tests
    protected String authenticateUser(String email) {
        return dataSeeder.createUserAndGetToken(email, "USER");
    }

    protected String registerOwner(String email) {
        return dataSeeder.createUserAndGetToken(email, "OWNER");
    }

    protected Long getAvailableLotId() {
        return dataSeeder.getOrCreateAvailableLot();
    }

    protected Long createBooking(String token) {
        return dataSeeder.createBooking(token);
    }
}
```

### Test Data Seeder

```java
@Component
public class TestDataSeeder {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CampsiteRepository campsiteRepository;

    @Autowired
    private LotRepository lotRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public String createUserAndGetToken(String email, String role) {
        var user = userRepository.findByEmail(email)
            .orElseGet(() -> {
                var newUser = new User();
                newUser.setEmail(email);
                newUser.setPassword(passwordEncoder.encode("TestPass123!"));
                newUser.setFirstName("Test");
                newUser.setLastName("User");
                newUser.setRole(Role.valueOf(role));
                return userRepository.save(newUser);
            });

        return jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());
    }

    @Transactional
    public Long getOrCreateAvailableLot() {
        return lotRepository.findFirstByAvailableTrue()
            .map(Lot::getId)
            .orElseGet(() -> {
                var campsite = createTestCampsite();
                var lot = createTestLot(campsite);
                return lot.getId();
            });
    }

    @Transactional
    public Campsite createTestCampsite() {
        var campsite = new Campsite();
        campsite.setName("Test Campsite " + System.currentTimeMillis());
        campsite.setDescription("Test description");
        campsite.setCounty("Dublin");
        campsite.setLatitude(53.3498);
        campsite.setLongitude(-6.2603);
        campsite.setActive(true);
        return campsiteRepository.save(campsite);
    }

    @Transactional
    public Lot createTestLot(Campsite campsite) {
        var lot = new Lot();
        lot.setCampsite(campsite);
        lot.setName("Test Lot " + System.currentTimeMillis());
        lot.setType(LotType.TENT);
        lot.setMaxGuests(4);
        lot.setPricePerNight(new BigDecimal("50.00"));
        lot.setAvailable(true);
        return lotRepository.save(lot);
    }

    @Transactional
    public Long createBooking(String token) {
        // Implementation to create a booking via API
        // Returns booking ID
        return null; // Implement based on your needs
    }

    @Transactional
    public void cleanupTestData() {
        bookingRepository.deleteAll();
        lotRepository.deleteAll();
        campsiteRepository.deleteAll();
        userRepository.deleteAll();
    }
}
```

---

## Naming Conventions

### Test Class Names
```
{Feature}FlowE2ETest.java        # E2E tests
{ClassName}Test.java              # Integration tests
{ClassName}UnitTest.java          # Unit tests (rare)
```

### Test Method Names
Use descriptive flow-based names for E2E, action-based for integration:

```java
// E2E tests - describe the flow
@Test void shouldCompleteFullBookingFlow()
@Test void shouldPreventDoubleBooking()
@Test void shouldAllowOwnerToManageCampsite()

// Integration tests - describe the action/response
@Test void createBooking_withValidData_returns201()
@Test void createBooking_withInvalidDates_returns400()
@Test void getBookings_withoutAuth_returns401()
```

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Backend Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 25
        uses: actions/setup-java@v4
        with:
          java-version: '25'
          distribution: 'temurin'
          cache: maven

      - name: Run All Tests
        run: mvn verify -f my-island-api/pom.xml
        env:
          TESTCONTAINERS_RYUK_DISABLED: true

      - name: Generate Coverage Report
        run: mvn jacoco:report -f my-island-api/pom.xml

      - name: Upload Coverage
        uses: codecov/codecov-action@v4
        with:
          file: my-island-api/target/site/jacoco/jacoco.xml
```

### Test Execution Commands

```bash
# Run all tests (E2E + Integration + Unit)
mvn verify -f my-island-api/pom.xml

# Run only E2E tests
mvn test -Dtest="**/*E2ETest" -f my-island-api/pom.xml

# Run only integration tests
mvn test -Dtest="**/integration/**" -f my-island-api/pom.xml

# Run specific flow test
mvn test -Dtest=BookingFlowE2ETest -f my-island-api/pom.xml

# Run with parallel execution (faster)
mvn test -DforkCount=2 -f my-island-api/pom.xml
```

---

## Coverage Goals

### Target Coverage

| Layer | Target | Rationale |
|-------|--------|-----------|
| **E2E Flows** | 100% of critical paths | All user journeys must work |
| **Controllers** | 90%+ | Every endpoint tested |
| **Services** | 70%+ | Covered via E2E/integration |
| **Repositories** | 80%+ | Custom queries tested |
| **Overall** | 75%+ | High confidence in system |

### JaCoCo Configuration

```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.11</version>
    <executions>
        <execution>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>verify</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
        <execution>
            <id>check</id>
            <goals>
                <goal>check</goal>
            </goals>
            <configuration>
                <rules>
                    <rule>
                        <element>BUNDLE</element>
                        <limits>
                            <limit>
                                <counter>LINE</counter>
                                <value>COVEREDRATIO</value>
                                <minimum>0.75</minimum>
                            </limit>
                        </limits>
                    </rule>
                </rules>
            </configuration>
        </execution>
    </executions>
</plugin>
```

---

## Implementation Roadmap

### Phase 1 - Infrastructure Setup
- [ ] Create `AbstractIntegrationTest` base class
- [ ] Create `TestDataSeeder` component
- [ ] Create test fixtures for all entities
- [ ] Verify Testcontainers startup

### Phase 2 - E2E Flows (Priority)
- [ ] `BookingFlowE2ETest` - Complete booking journey
- [ ] `AuthFlowE2ETest` - Full authentication flow
- [ ] `OwnerFlowE2ETest` - Owner management
- [ ] `SearchFlowE2ETest` - Search and filtering
- [ ] `EventFlowE2ETest` - Kafka event flows

### Phase 3 - Integration Tests
- [ ] All controller endpoints (15 controllers)
- [ ] Repository custom queries
- [ ] Security authorization rules
- [ ] Error handling scenarios

### Phase 4 - Unit Tests (Selective)
- [ ] Price calculation logic
- [ ] Availability algorithms
- [ ] Date utilities
- [ ] Input validators

---

## References

- [Testcontainers Documentation](https://testcontainers.com/)
- [REST Assured Documentation](https://rest-assured.io/)
- [Spring Boot Testing](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.testing)
- [Testing Trophy - Kent C. Dodds](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
