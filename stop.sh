#!/bin/bash

# My Island - Local Development Stop Script
# Stops all services (use -k to also remove Docker volumes)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }

# Parse arguments
KILL_VOLUMES=false
while getopts "k" opt; do
    case $opt in
        k) KILL_VOLUMES=true ;;
        *) echo "Usage: $0 [-k]"; echo "  -k  Also remove Docker volumes (fresh DB on next start)"; exit 1 ;;
    esac
done

echo ""
echo "=========================================="
echo "  Stopping My Island services..."
echo "=========================================="
echo ""

# Stop Frontend
log_info "Stopping frontend..."
if [ -f "$SCRIPT_DIR/logs/frontend.pid" ]; then
    pid=$(cat "$SCRIPT_DIR/logs/frontend.pid")
    if kill -0 "$pid" 2>/dev/null; then
        kill "$pid" 2>/dev/null || true
        pkill -P "$pid" 2>/dev/null || true
        log_success "Frontend stopped (PID: $pid)"
    else
        log_warn "Frontend process not found"
    fi
    rm -f "$SCRIPT_DIR/logs/frontend.pid"
else
    pid=$(lsof -t -i:5173 2>/dev/null || true)
    if [ -n "$pid" ]; then
        kill "$pid" 2>/dev/null || true
        log_success "Frontend stopped (port 5173)"
    else
        log_warn "Frontend not running"
    fi
fi

# Stop Backend
log_info "Stopping backend..."
if [ -f "$SCRIPT_DIR/logs/backend.pid" ]; then
    pid=$(cat "$SCRIPT_DIR/logs/backend.pid")
    if kill -0 "$pid" 2>/dev/null; then
        kill "$pid" 2>/dev/null || true
        sleep 2
        if kill -0 "$pid" 2>/dev/null; then
            kill -9 "$pid" 2>/dev/null || true
        fi
        log_success "Backend stopped (PID: $pid)"
    else
        log_warn "Backend process not found"
    fi
    rm -f "$SCRIPT_DIR/logs/backend.pid"
else
    pid=$(lsof -t -i:8080 2>/dev/null || true)
    if [ -n "$pid" ]; then
        kill "$pid" 2>/dev/null || true
        sleep 2
        kill -9 "$pid" 2>/dev/null || true
        log_success "Backend stopped (port 8080)"
    else
        log_warn "Backend not running"
    fi
fi

# Stop Stripe CLI
log_info "Stopping Stripe CLI..."
if [ -f "$SCRIPT_DIR/logs/stripe.pid" ]; then
    pid=$(cat "$SCRIPT_DIR/logs/stripe.pid")
    if kill -0 "$pid" 2>/dev/null; then
        kill "$pid" 2>/dev/null || true
        log_success "Stripe CLI stopped (PID: $pid)"
    else
        log_warn "Stripe CLI process not found"
    fi
    rm -f "$SCRIPT_DIR/logs/stripe.pid"
else
    pkill -f "stripe listen" 2>/dev/null && log_success "Stripe CLI stopped" || log_warn "Stripe CLI not running"
fi

# Stop Docker
log_info "Stopping Docker containers..."
if [ "$KILL_VOLUMES" = true ]; then
    docker compose down -v
    log_success "Docker containers stopped and volumes removed"
else
    docker compose down
    log_success "Docker containers stopped (volumes preserved)"
fi

echo ""
echo "=========================================="
log_success "All services stopped"
if [ "$KILL_VOLUMES" = false ]; then
    echo ""
    echo "  Tip: Use './stop.sh -k' to also remove volumes"
    echo "       (for fresh database on next start)"
fi
echo "=========================================="
echo ""
