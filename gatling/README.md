# My Island Load Tests

Gatling-based load tests for the My Island platform API. Exercises all endpoints across five user personas with configurable load profiles.

## Prerequisites

- Java 21+
- Maven 3.9+
- Running My Island API (default: `http://localhost:8080/api`)

## Quick Start

```bash
# Start the backend
cd ../my-island-api && ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Run smoke test (quick sanity check)
cd gatling
mvn gatling:test -Dprofile=smoke
```

## Load Profiles

| Profile | Duration | Description |
|---------|----------|-------------|
| `smoke` | 1 min | Low constant rate — sanity check that all endpoints respond |
| `load` | 10 min | Ramp up → hold → ramp down — normal expected traffic |
| `stress` | 15 min | Ramp → hold → spike → cooldown — peak capacity testing |

## Run Commands

```bash
mvn gatling:test -Dprofile=smoke                           # Quick sanity
mvn gatling:test -Dprofile=load                            # Normal load
mvn gatling:test -Dprofile=stress                          # Peak capacity
mvn gatling:test -Dprofile=load -DbaseUrl=https://staging  # Against staging
```

## Scenarios

| Scenario | Auth | Traffic Share | Description |
|----------|------|---------------|-------------|
| Anonymous Browser | None | ~70% | Public browsing: campsites, lots, reviews, marketplace |
| Guest User | JWT | ~20% | Login, bookings, saved lots, notifications |
| Owner | JWT | ~5% | Dashboard, lots, bookings, reviews, modification requests |
| Supplier | JWT | ~3% | Dashboard, offers, claims |
| Admin | JWT | ~2% | Dashboard, users, bookings, owners, feature toggles |

## Test Accounts

Credentials are in `src/test/resources/data/credentials.csv`. These match the seed data loaded in the `dev` Spring profile.

## Reports

After a run, open the interactive HTML report:

```
target/gatling/myislandsimulation-*/index.html
```

## Assertions

- Global 95th percentile response time < 2000ms
- Global failure rate < 1%
- Login 95th percentile < 500ms
- Public GET endpoints 95th percentile < 1000ms

## Project Structure

```
gatling/
├── pom.xml
├── README.md
└── src/test/
    ├── java/com/myisland/loadtest/
    │   ├── MyIslandSimulation.java          # Main simulation + load profiles
    │   ├── scenarios/
    │   │   ├── AnonymousBrowserScenario.java
    │   │   ├── GuestUserScenario.java
    │   │   ├── OwnerScenario.java
    │   │   ├── SupplierScenario.java
    │   │   └── AdminScenario.java
    │   └── helpers/
    │       └── Auth.java                    # JWT login chain
    └── resources/
        ├── gatling.conf
        ├── logback-test.xml
        └── data/
            └── credentials.csv
```
