#!/bin/bash

# My Island - Local Development Startup Script
# Always starts fresh with clean data - stops everything, cleans, and rebuilds

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step() { echo -e "${CYAN}[STEP]${NC} $1"; }

# Check if a port is in use
is_port_in_use() {
    local port=$1
    if command -v lsof &> /dev/null; then
        lsof -i :"$port" &> /dev/null
    elif command -v ss &> /dev/null; then
        ss -tuln | grep -q ":$port "
    elif command -v netstat &> /dev/null; then
        netstat -tuln | grep -q ":$port "
    else
        (echo >/dev/tcp/localhost/"$port") &>/dev/null
    fi
}

# Wait for a service to be healthy
wait_for_port() {
    local port=$1
    local service=$2
    local max_attempts=${3:-30}
    local attempt=1

    while ! is_port_in_use "$port"; do
        if [ $attempt -ge $max_attempts ]; then
            log_error "$service failed to start on port $port"
            return 1
        fi
        echo -n "."
        sleep 1
        ((attempt++))
    done
    echo ""
    return 0
}

# ============================================
# Stop All Services
# ============================================
stop_all_services() {
    log_step "Stopping all running services..."

    # Stop Frontend
    if [ -f "$SCRIPT_DIR/logs/frontend.pid" ]; then
        pid=$(cat "$SCRIPT_DIR/logs/frontend.pid")
        if kill -0 "$pid" 2>/dev/null; then
            log_info "Stopping frontend (PID: $pid)..."
            kill "$pid" 2>/dev/null || true
            pkill -P "$pid" 2>/dev/null || true
        fi
        rm -f "$SCRIPT_DIR/logs/frontend.pid"
    fi
    # Also check port directly
    pid=$(lsof -t -i:5173 2>/dev/null || true)
    if [ -n "$pid" ]; then
        kill "$pid" 2>/dev/null || true
    fi

    # Stop Backend
    if [ -f "$SCRIPT_DIR/logs/backend.pid" ]; then
        pid=$(cat "$SCRIPT_DIR/logs/backend.pid")
        if kill -0 "$pid" 2>/dev/null; then
            log_info "Stopping backend (PID: $pid)..."
            kill "$pid" 2>/dev/null || true
            sleep 2
            kill -9 "$pid" 2>/dev/null || true
        fi
        rm -f "$SCRIPT_DIR/logs/backend.pid"
    fi
    # Also check port directly
    pid=$(lsof -t -i:8080 2>/dev/null || true)
    if [ -n "$pid" ]; then
        kill "$pid" 2>/dev/null || true
        sleep 1
        kill -9 "$pid" 2>/dev/null || true
    fi

    # Stop Docker containers and remove volumes for fresh DB
    log_info "Stopping Docker containers and removing volumes..."
    docker compose down -v 2>/dev/null || true

    log_success "All services stopped"
}

# ============================================
# Clean Build Artifacts
# ============================================
clean_build_artifacts() {
    log_step "Cleaning build artifacts..."

    # Clean backend
    log_info "Running mvn clean..."
    cd "$SCRIPT_DIR/my-island-api"
    ./mvnw clean -q
    cd "$SCRIPT_DIR"
    log_success "Backend cleaned"

    # Clean frontend caches (but keep node_modules)
    log_info "Cleaning frontend caches..."
    rm -rf "$SCRIPT_DIR/my-island-web/.vite" 2>/dev/null || true
    rm -rf "$SCRIPT_DIR/my-island-web/dist" 2>/dev/null || true
    log_success "Frontend caches cleaned"

    # Clean logs
    log_info "Cleaning old logs..."
    rm -rf "$SCRIPT_DIR/logs"
    mkdir -p "$SCRIPT_DIR/logs"
    log_success "Logs cleaned"
}

# ============================================
# Wait for Docker container to be healthy
# ============================================
wait_for_healthy() {
    local container=$1
    local max_attempts=${2:-60}
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        local health=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "not_found")
        if [ "$health" = "healthy" ]; then
            return 0
        fi
        echo -n "."
        sleep 1
        ((attempt++))
    done
    return 1
}

# ============================================
# Start Docker Infrastructure
# ============================================
start_docker_infra() {
    log_step "Starting Docker infrastructure..."

    docker compose up -d postgres zookeeper kafka kafka-ui localstack

    # Wait for services to be healthy using Docker health checks
    log_info "Waiting for services to be healthy..."

    echo -n "  PostgreSQL"
    if wait_for_healthy "myisland-postgres" 90; then
        log_success "PostgreSQL ready"
    else
        log_error "PostgreSQL failed to become healthy"
        return 1
    fi

    echo -n "  Kafka"
    if wait_for_healthy "myisland-kafka" 90; then
        log_success "Kafka ready"
    else
        log_error "Kafka failed to become healthy"
        return 1
    fi

    echo -n "  LocalStack"
    if wait_for_healthy "myisland-localstack" 90; then
        log_success "LocalStack ready"
    else
        log_error "LocalStack failed to become healthy"
        return 1
    fi

    # Give services a moment to fully initialize
    sleep 2
}

# ============================================
# Start Backend (Spring Boot)
# ============================================
start_backend() {
    log_step "Starting Spring Boot backend..."

    cd "$SCRIPT_DIR/my-island-api"

    # Compile and start
    log_info "Compiling and starting backend..."
    nohup ./mvnw spring-boot:run \
        -Dspring-boot.run.profiles=dev \
        > "$SCRIPT_DIR/logs/backend.log" 2>&1 &

    local backend_pid=$!
    echo $backend_pid > "$SCRIPT_DIR/logs/backend.pid"

    log_info "Backend starting (PID: $backend_pid), waiting for port 8080..."
    echo -n "  "
    if wait_for_port 8080 "Backend" 180; then
        log_success "Backend ready on http://localhost:8080"
    else
        log_error "Backend failed to start. Check logs/backend.log"
        return 1
    fi

    cd "$SCRIPT_DIR"
}

# ============================================
# Start Frontend (Vite)
# ============================================
start_frontend() {
    log_step "Starting Vite frontend..."

    cd "$SCRIPT_DIR/my-island-web"

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        log_info "Installing npm dependencies..."
        npm install
    fi

    nohup npm run dev > "$SCRIPT_DIR/logs/frontend.log" 2>&1 &

    local frontend_pid=$!
    echo $frontend_pid > "$SCRIPT_DIR/logs/frontend.pid"

    log_info "Frontend starting (PID: $frontend_pid), waiting for port 5173..."
    echo -n "  "
    if wait_for_port 5173 "Frontend" 60; then
        log_success "Frontend ready on http://localhost:5173"
    else
        log_error "Frontend failed to start. Check logs/frontend.log"
        return 1
    fi

    cd "$SCRIPT_DIR"
}

# ============================================
# Main
# ============================================
main() {
    echo ""
    echo "=========================================="
    echo "  My Island - Fresh Start"
    echo "=========================================="
    echo ""
    log_warn "This will stop all services, clean data, and start fresh!"
    echo ""

    # Check prerequisites
    if ! command -v docker &> /dev/null; then
        log_error "Docker is required but not installed"
        exit 1
    fi

    if ! docker info &> /dev/null; then
        log_error "Docker daemon is not running"
        exit 1
    fi

    # Stop everything
    stop_all_services
    echo ""

    # Clean build artifacts
    clean_build_artifacts
    echo ""

    # Start fresh
    start_docker_infra
    echo ""
    start_backend
    echo ""
    start_frontend

    echo ""
    echo "=========================================="
    echo "  All services running with fresh data!"
    echo "=========================================="
    echo ""
    echo "  Frontend:  http://localhost:5173"
    echo "  Backend:   http://localhost:8080/api"
    echo "  Swagger:   http://localhost:8080/api/swagger-ui.html"
    echo "  Kafka UI:  http://localhost:8081"
    echo ""
    echo "  Test accounts (password: 'password'):"
    echo "    Subscribed:"
    echo "      - norevalley@myisland.com (Owner - Nore Valley Park)"
    echo "      - hello@burrenglampingvillage.ie (Owner - Burren Glamping)"
    echo "      - farmshop@greenacres.ie (Supplier - Green Acres)"
    echo "      - info@aillweefarmshop.ie (Supplier - Aillwee Farm Shop)"
    echo "    No Subscription:"
    echo "      - bookings@loughdergcamping.ie (Owner - Lough Derg Lakeside)"
    echo "      - hello@dinglekayak.ie (Supplier - Dingle Kayak Adventures)"
    echo "    Guest:"
    echo "      - family@example.com (Murphy Family)"
    echo ""
    echo "  Logs: $SCRIPT_DIR/logs/"
    echo ""
    echo "  To stop: ./stop.sh"
    echo "=========================================="
}

main "$@"
