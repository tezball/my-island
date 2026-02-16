#!/bin/bash

# My Island - Local Startup Script
# Always starts fresh with clean data - stops everything, cleans, and rebuilds
#
# Usage:
#   ./start.sh          Dev mode (default) — seed data, test users, dev tools
#   ./start.sh --prod   Prod mode — clean DB, no seed data, no test users

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

    # Stop Stripe CLI
    if [ -f "$SCRIPT_DIR/logs/stripe.pid" ]; then
        pid=$(cat "$SCRIPT_DIR/logs/stripe.pid")
        if kill -0 "$pid" 2>/dev/null; then
            log_info "Stopping Stripe CLI (PID: $pid)..."
            kill "$pid" 2>/dev/null || true
        fi
        rm -f "$SCRIPT_DIR/logs/stripe.pid"
    fi
    # Also kill any lingering stripe listen processes
    pkill -f "stripe listen" 2>/dev/null || true

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

    if [ "$MODE" = "prod" ]; then
        docker compose up -d postgres localstack
    else
        docker compose up -d postgres localstack mailpit grafana prometheus loki
    fi

    # Wait for services to be healthy using Docker health checks
    log_info "Waiting for services to be healthy..."

    echo -n "  PostgreSQL"
    if wait_for_healthy "myisland-postgres" 90; then
        log_success "PostgreSQL ready"
    else
        log_error "PostgreSQL failed to become healthy"
        return 1
    fi

    echo -n "  LocalStack"
    if wait_for_healthy "myisland-localstack" 90; then
        log_success "LocalStack ready"
    else
        log_error "LocalStack failed to become healthy"
        return 1
    fi

    if [ "$MODE" = "dev" ]; then
        echo -n "  Mailpit"
        if wait_for_healthy "myisland-mailpit" 30; then
            log_success "Mailpit ready"
        else
            log_warn "Mailpit not healthy (non-critical)"
        fi

        echo -n "  Grafana"
        if wait_for_port 3000 "Grafana" 30; then
            log_success "Grafana ready"
        else
            log_warn "Grafana not ready (non-critical)"
        fi
    fi

    # Give services a moment to fully initialize
    sleep 2
}

# ============================================
# Start Backend (GraalVM Native Image)
# ============================================
start_backend() {
    log_step "Building and starting native backend..."

    cd "$SCRIPT_DIR/my-island-api"

    # Load environment variables from .env file
    if [ -f "$SCRIPT_DIR/.env" ]; then
        log_info "Loading environment variables from .env..."
        set -a
        source "$SCRIPT_DIR/.env"
        set +a
    fi

    # Build native image
    log_info "Compiling native image (this may take several minutes)..."
    ./mvnw -Pnative native:compile -DskipTests -B \
        > "$SCRIPT_DIR/logs/native-build.log" 2>&1
    if [ $? -ne 0 ]; then
        log_error "Native compilation failed. Check logs/native-build.log"
        return 1
    fi
    log_success "Native image compiled"

    # Start the native binary
    log_info "Starting native backend ($MODE mode)..."
    if [ "$MODE" = "prod" ]; then
        nohup ./target/my-island-api \
            > "$SCRIPT_DIR/logs/backend.log" 2>&1 &
    else
        nohup ./target/my-island-api \
            --spring.profiles.active=dev \
            > "$SCRIPT_DIR/logs/backend.log" 2>&1 &
    fi

    local backend_pid=$!
    echo $backend_pid > "$SCRIPT_DIR/logs/backend.pid"

    log_info "Backend starting (PID: $backend_pid), waiting for port 8080..."
    echo -n "  "
    if wait_for_port 8080 "Backend" 30; then
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

    if [ "$MODE" = "prod" ]; then
        VITE_SHOW_TEST_USERS=false nohup npm run dev > "$SCRIPT_DIR/logs/frontend.log" 2>&1 &
    else
        nohup npm run dev > "$SCRIPT_DIR/logs/frontend.log" 2>&1 &
    fi

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
# Start Stripe CLI (Webhook Forwarding)
# ============================================
start_stripe_cli() {
    log_step "Starting Stripe CLI webhook forwarding..."

    if ! command -v stripe &> /dev/null; then
        log_warn "Stripe CLI not installed - skipping webhook forwarding"
        log_warn "Install from: https://docs.stripe.com/stripe-cli"
        return 0
    fi

    # Load .env for the webhook secret
    if [ -f "$SCRIPT_DIR/.env" ]; then
        set -a
        source "$SCRIPT_DIR/.env"
        set +a
    fi

    nohup stripe listen \
        --forward-to localhost:8080/api/webhooks/stripe \
        > "$SCRIPT_DIR/logs/stripe.log" 2>&1 &

    local stripe_pid=$!
    echo $stripe_pid > "$SCRIPT_DIR/logs/stripe.pid"

    # Give it a moment to connect
    sleep 3

    if kill -0 "$stripe_pid" 2>/dev/null; then
        log_success "Stripe CLI listening (PID: $stripe_pid) → forwarding to localhost:8080/api/webhooks/stripe"
    else
        log_warn "Stripe CLI failed to start. Check logs/stripe.log (you may need to run 'stripe login' first)"
    fi
}

# ============================================
# Open Browser Tabs
# ============================================
open_browser_tabs() {
    log_step "Opening browser tabs..."

    local open_cmd=""
    if command -v xdg-open &>/dev/null; then
        open_cmd="xdg-open"
    elif command -v open &>/dev/null; then
        open_cmd="open"
    elif command -v wslview &>/dev/null; then
        open_cmd="wslview"
    else
        log_warn "No browser opener found — open the URLs manually"
        return 0
    fi

    local urls=()
    local labels=()

    urls+=("http://localhost:5173")
    labels+=("Frontend")
    urls+=("http://localhost:8080/api/swagger-ui.html")
    labels+=("Swagger")

    if [ "$MODE" = "dev" ]; then
        urls+=("http://localhost:8025")
        labels+=("Mailpit")
        urls+=("http://localhost:3000")
        labels+=("Grafana")
        urls+=("http://localhost:9090")
        labels+=("Prometheus")
    fi

    for i in "${!urls[@]}"; do
        $open_cmd "${urls[$i]}" &>/dev/null &
        log_info "  ${labels[$i]} → ${urls[$i]}"
        sleep 0.4
    done

    log_success "Browser tabs opened"
}

# ============================================
# Main
# ============================================
main() {
    # Parse flags
    MODE="dev"
    for arg in "$@"; do
        case "$arg" in
            --prod) MODE="prod" ;;
            *) log_error "Unknown flag: $arg"; echo "Usage: ./start.sh [--prod]"; exit 1 ;;
        esac
    done

    local mode_label
    if [ "$MODE" = "prod" ]; then
        mode_label="PROD"
    else
        mode_label="DEV"
    fi

    echo ""
    echo "=========================================="
    echo "  My Island — Fresh Start ($mode_label)"
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

    # Clean log files first so we only keep logs from this run
    log_step "Deleting old log files..."
    rm -f "$SCRIPT_DIR"/logs/*.log 2>/dev/null || true
    mkdir -p "$SCRIPT_DIR/logs"
    log_success "Log files cleaned"
    echo ""

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
    start_stripe_cli
    echo ""
    open_browser_tabs

    echo ""
    echo "=========================================="
    echo "  All services running — $mode_label mode"
    echo "=========================================="
    echo ""
    echo "  App & API:"
    echo "    Frontend:    http://localhost:5173"
    echo "    API:         http://localhost:8080/api"
    echo "    Swagger:     http://localhost:8080/api/swagger-ui.html"
    echo ""
    if [ "$MODE" = "dev" ]; then
        echo "  Dev Tools:"
        echo "    Mailpit:     http://localhost:8025"
        echo "    Grafana:     http://localhost:3000  (admin / admin)"
        echo "    Prometheus:  http://localhost:9090"
        echo "    Loki:        http://localhost:3100"
        echo ""
    fi
    echo "  Stripe:"
    echo "    Mode:        Sandbox (test payments)"
    echo "    Webhooks:    Forwarding to localhost:8080/api/webhooks/stripe"
    echo "    Test card:   4242 4242 4242 4242 (any expiry/CVC)"
    echo ""
    if [ "$MODE" = "dev" ]; then
        echo "  Seed Data:     Loaded (test accounts available)"
        echo "  Test Users:    Dropdown visible on sign-in page"
    else
        echo "  Seed Data:     None (schema only)"
        echo "  Test Users:    Hidden"
    fi
    echo ""
    echo "  Logs: $SCRIPT_DIR/logs/"
    echo "  To stop: ./stop.sh"
    echo "=========================================="
}

main "$@"
