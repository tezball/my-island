# Infrastructure

## Local Development

### Prerequisites
- Docker and Docker Compose
- Node.js (for frontend dev server)
- Java 25 (for backend without Docker)

### Quick Start

```bash
# Local prod-like instance (Ireland catalogue auto-loaded via Flyway)
./start.sh --fast

# Start all services (Docker Compose only)
docker compose up -d
```

# Access points:
# - Frontend: http://localhost:5173
# - API: http://localhost:8080/api
# - Swagger: http://localhost:8080/api/swagger-ui.html
# - Mailpit: http://localhost:8025
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

### Spring Async Events
- Domain events published via `ApplicationEventPublisher`
- Consumed by `EventPublisher` using `@Async` + `@TransactionalEventListener(AFTER_COMMIT)`
- Used for: booking email notifications, offer claim notifications
- No external message broker required

### Stripe
- Payment Intents with manual capture for bookings
- Subscriptions for owner/supplier plans
- Connect Express for supplier payouts
- Webhook handling via `StripeWebhookController`
- Dev mode (`STRIPE_DEV_MODE=true`) simulates payments locally without Stripe API calls

## Observability (local)

Dev `docker compose` / `./start.sh` starts:

| Service | Port | Role |
|---------|------|------|
| Grafana | 3000 | UI + Grafana Alerting (admin/admin in dev) |
| Prometheus | 9090 | Metrics scrape + rule evaluation |
| Alertmanager | 9093 | Alert routing (default: keep in AM) |
| Loki | 3100 | Logs (API Loki4j appender) |

Agent access: official **mcp-grafana** (read-only) in `.mcp.json`. See [Observability setup](../automation/OBSERVABILITY_SETUP.md).

Production: opt-in with `docker compose -f docker-compose.prod.yml --profile observability`.

## Future Considerations
- Redis for caching
- AWS S3 for image storage (currently local/embedded)
- AWS SES for email delivery
- Elasticsearch for advanced search
- Wire Alertmanager receivers (email/Slack webhook) for real notifications
- Expose MCP over SSE for Cloud Agents (not only laptop stdio)
