# My Island - Camping & Glamping Platform

A full-stack booking platform for camping and glamping accommodations in Ireland, with a marketplace for local suppliers.

## Quick Start

```bash
git clone https://github.com/your-org/my-island.git
cd my-island
docker compose up -d
```

### Access Points

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | React SPA |
| API | http://localhost:8080/api | REST API |
| Swagger UI | http://localhost:8080/api/swagger-ui.html | API Documentation |
| Jenkins CI/CD | http://localhost:8088 | Build / test / deploy (`./scripts/start-jenkins.sh`) |

## Test Accounts

All passwords are `password`.

| Email | Role | Description |
|-------|------|-------------|
| norevalley@myisland.com | Owner | Nore Valley Park campsite owner |
| wildatlantic@myisland.com | Owner | Wild Atlantic Glamping owner |
| farmshop@greenacres.ie | Supplier | Green Acres Farm Shop |
| kayaks@wildwater.ie | Supplier | Wild Water Kayaks |
| family@example.com | Guest | Murphy Family (sample guest) |
| solo@example.com | Guest | Solo Traveler (sample guest) |

**Note**: Users can hold multiple roles simultaneously via `isOwner` and `isSupplier` flags.

## Development Modes

### Full Stack (Docker)

```bash
docker compose up -d
```

### Backend Only (Local Java)

```bash
# Start dependencies
docker compose up -d postgres kafka zookeeper

# Run Spring Boot locally
cd my-island-api
./mvnw spring-boot:run
```

### Frontend Only (Local Node)

```bash
# Start backend
docker compose up -d postgres kafka api

# Run Vite locally
cd my-island-web
npm run dev
```

## Architecture

```
my-island/
├── my-island-web/          # React 19 + TypeScript + Vite
├── my-island-api/          # Spring Boot 3.4 + Java 25
├── docker-compose.yml      # Full stack orchestration
└── docs/                   # Documentation
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4 |
| Backend | Spring Boot 3.4, Java 25, Spring Security |
| Database | PostgreSQL 17 |
| Messaging | Apache Kafka |
| API Docs | OpenAPI 3 (Springdoc) |

### API Modules

- **Identity**: User authentication, JWT, role upgrades
- **Accommodation**: Campsite/Owner management, Lots
- **Booking**: Reservations, availability checks
- **Marketplace**: Suppliers, Offers, Claims, Redemption

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register new user |
| POST | /api/auth/login | Login and get JWT |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Get current user |
| POST | /api/auth/upgrade/owner | Upgrade to owner |
| POST | /api/auth/upgrade/supplier | Upgrade to supplier |

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/campsites | List all campsites |
| GET | /api/campsites/{id} | Get campsite details |
| GET | /api/campsites/{id}/lots | Get campsite lots |
| GET | /api/campsites/{id}/lots/available | Check availability |
| GET | /api/marketplace/offers | Browse offers |

### Protected Endpoints

See [Swagger UI](http://localhost:8080/api/swagger-ui.html) for full API documentation.

## Kafka Topics

| Topic | Description |
|-------|-------------|
| booking.created | New booking notification |
| booking.confirmed | Booking confirmed |
| booking.cancelled | Booking cancelled |
| offer.claimed | Voucher claimed |
| offer.redeemed | Voucher redeemed |
| user.registered | New user welcome |

## Database Migrations

Flyway migrations are in `my-island-api/src/main/resources/db/migration/`:

| Migration | Description |
|-----------|-------------|
| V001 | Users table |
| V002 | Owners table |
| V003 | Lots and amenities |
| V004 | Bookings |
| V005 | Suppliers |
| V006 | Offers |
| V007 | Offer claims |
| V999 | Seed data |

## Environment Variables

### API (my-island-api)

| Variable | Default | Description |
|----------|---------|-------------|
| SPRING_DATASOURCE_URL | jdbc:postgresql://localhost:5432/myisland | Database URL |
| SPRING_KAFKA_BOOTSTRAP_SERVERS | localhost:9092 | Kafka brokers |
| JWT_SECRET | (dev secret) | JWT signing key |

### Web (my-island-web)

| Variable | Default | Description |
|----------|---------|-------------|
| VITE_API_URL | http://localhost:8080/api | API base URL |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

MIT
