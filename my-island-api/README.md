# My Island API

Spring Boot backend for the My Island camping platform.

## Prerequisites

- Java 17+
- PostgreSQL 14+
- Maven 3.8+

## Database Setup

```bash
# Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE myisland;"
```

## Running the Application

```bash
# Navigate to project
cd my-island-api

# Run with Maven
./mvnw spring-boot:run

# Or build and run JAR
./mvnw clean package
java -jar target/my-island-api-0.0.1-SNAPSHOT.jar
```

The API will be available at `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login (email: `demo@my-island.com`, password: `password`)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user (requires auth)

### Campsites
- `GET /api/campsites` - List campsites (query params: q, type, minPrice, maxPrice)
- `GET /api/campsites/{id}` - Get campsite details
- `GET /api/campsites/{id}/availability` - Get unavailable dates

### Bookings (requires auth)
- `GET /api/bookings` - List user bookings (query: status=upcoming|past)
- `GET /api/bookings/{id}` - Get booking details
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Cancel booking

### Favorites (requires auth)
- `GET /api/favorites` - List saved campsites
- `POST /api/favorites/{campsiteId}` - Toggle favorite

### Offers
- `GET /api/offers` - List offers (query: category)
- `GET /api/offers/{id}` - Get offer details

### Extras
- `GET /api/extras` - List all extras

## Authentication

Use Bearer token in Authorization header:
```
Authorization: Bearer <token>
```

Get token from `/api/auth/login` response.

## Configuration

Edit `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/myisland
    username: postgres
    password: postgres
```
