# Tech Stack

This document outlines the technologies used and planned for the My Island project.

## Backend

### Framework
- **Spring Boot** - Java-based framework for building production-ready applications
  - RESTful API development
  - Dependency injection
  - Auto-configuration
  - 

### Database
- **PostgreSQL** - Primary relational database
  - ACID compliance
  - JSON support for flexible data structures
  - Full-text search capabilities

### Event Streaming
- **Apache Kafka** - Distributed event streaming platform
  - Asynchronous communication between services
  - Event sourcing
  - Real-time data processing

## Frontend

- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

## Testing

- **Testcontainers** - Integration testing with real dependencies
  - Spin up PostgreSQL containers for database tests
  - Kafka containers for event streaming tests
  - Ensures tests run against real services, not mocks

## Infrastructure

### Local Development
- **Docker Compose** - Container orchestration for local development
  - PostgreSQL
  - Kafka + Zookeeper
  - Backend services

## Getting Started

### Prerequisites
- Docker and Docker Compose installed
- Git

### Quick Start (Git Clone & Run)

```bash
# Clone the repository
git clone <repository-url>
cd my-island

# Start all services
docker compose up -d

# The application will be available at:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:8080
# - PostgreSQL: localhost:5432
# - Kafka: localhost:9092
```

### Stopping Services

```bash
docker compose down
```

### Viewing Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
```

## Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│  PostgreSQL │
│   (React)   │     │(Spring Boot)│     │             │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    Kafka    │
                    │   (Events)  │
                    └─────────────┘
```

## Future Considerations

- Redis for caching
- Elasticsearch for advanced search
- Kubernetes for production deployment
