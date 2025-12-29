# my-island CLI

A Spring Shell CLI tool for managing the my-island development environment. Built with GraalVM native image support for fast startup.

## Prerequisites

- Java 17+
- Docker (for PostgreSQL)
- Node.js & npm (for frontend)
- GraalVM (optional, for native compilation)

## Building

### JVM Build (Development)

```bash
cd cli
./mvnw clean package
```

### Native Image Build (Production)

Requires GraalVM with native-image installed:

```bash
cd cli
./mvnw -Pnative native:compile
```

This creates a native executable at `target/my-island-cli`.

## Running

### JVM Mode

```bash
# Interactive shell
java -jar target/my-island-cli-1.0.0-SNAPSHOT.jar

# Run single command
java -jar target/my-island-cli-1.0.0-SNAPSHOT.jar start
```

### Native Mode

```bash
# Interactive shell
./target/my-island-cli

# Run single command
./target/my-island-cli start
```

## Commands

### Service Lifecycle

| Command | Description |
|---------|-------------|
| `start` | Start all services (db, api, frontend) |
| `start-db` | Start PostgreSQL in Docker |
| `start-api` | Start Spring Boot API |
| `start-frontend` | Start Vite dev server |
| `stop` | Stop all services |
| `stop-db` | Stop PostgreSQL container |
| `stop-api` | Stop the API server |
| `stop-frontend` | Stop the frontend |
| `status` | Show status of all services |

### Build Commands

| Command | Description |
|---------|-------------|
| `build` | Build all projects |
| `build-api` | Build Spring Boot API |
| `build-frontend` | Build React frontend |

### Testing

| Command | Description |
|---------|-------------|
| `test` | Run all tests |
| `test-api` | Run API tests |
| `test-frontend` | Run frontend tests |

### Development

| Command | Description |
|---------|-------------|
| `init-db` | Initialize/reset the database |
| `clean` | Clean build artifacts |
| `logs -s <service>` | View logs (db, api, frontend) |
| `install` | Install all dependencies |
| `psql` | Open PostgreSQL shell |

## Command Options

### start
```bash
start [-b|--background]  # Run services in background
```

### stop
```bash
stop [-r|--remove]  # Also remove Docker containers
```

### logs
```bash
logs -s <service> [-n <lines>] [-f|--follow]
# Examples:
logs -s db -n 100      # Last 100 lines of DB logs
logs -s api -f         # Follow API logs
logs -s frontend       # Last 50 lines (default)
```

### clean
```bash
clean [-a|--all]  # Also clean node_modules
```

## Configuration

Default configuration is in `src/main/resources/application.yml`:

```yaml
myisland:
  docker:
    postgres-image: postgres:15-alpine
    container-name: my-island-postgres
    port: 5432
    database: myisland
    username: postgres
    password: postgres
  api:
    port: 8080
  frontend:
    port: 5173
```

## Examples

```bash
# Start everything
./my-island-cli start

# Check status
./my-island-cli status

# Start only database and API
./my-island-cli start-db
./my-island-cli start-api -b

# View logs
./my-island-cli logs -s api -f

# Clean and rebuild
./my-island-cli clean
./my-island-cli build

# Reset database
./my-island-cli init-db

# Stop everything
./my-island-cli stop
```

## Interactive Mode

Run without arguments for an interactive shell:

```bash
./my-island-cli
shell:> status
shell:> start
shell:> help
shell:> exit
```

Use `help` to see all available commands and `help <command>` for command details.
