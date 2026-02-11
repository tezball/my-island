# Infrastructure

## Local Development

### Prerequisites
- Docker and Docker Compose
- Node.js (for frontend dev server)
- Java 25 (for backend without Docker)

### Quick Start

```bash
# Start all services
docker compose up -d

# Access points:
# - Frontend: http://localhost:5173
# - API: http://localhost:8080/api
# - Swagger: http://localhost:8080/api/swagger-ui.html
# - Kafka UI: http://localhost:8081
```

### Stopping Services

```bash
docker compose down
```

### Viewing Logs

```bash
docker compose logs -f        # All services
docker compose logs -f api    # API only
```

## Services

### PostgreSQL 17
- Primary relational database
- Flyway manages schema migrations (see [Seed Data](../operations/SEED_DATA.md) for migration inventory)
- Port: 5432

### Apache Kafka
- Asynchronous domain event streaming
- Used for: booking events, offer claims, notifications
- Kafka UI available at port 8081
- Port: 9092

### Stripe
- Payment Intents with manual capture for bookings
- Subscriptions for owner/supplier plans
- Connect Express for supplier payouts
- Webhook handling via `StripeWebhookController`
- Dev mode (`STRIPE_DEV_MODE=true`) simulates payments locally without Stripe API calls

## Future Considerations
- Redis for caching
- AWS S3 for image storage (currently local/embedded)
- AWS SES for email delivery
- Elasticsearch for advanced search
