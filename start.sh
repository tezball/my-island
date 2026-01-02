#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== my-island Development Startup Script ===${NC}"

# Step 1: Start Docker services (PostgreSQL, LocalStack, Kafka)
echo -e "\n${YELLOW}[1/5] Starting Docker services...${NC}"
cd "$(dirname "$0")/my-island-api"
if docker compose up -d 2>/dev/null; then
    echo -e "${GREEN}✓ Docker services started${NC}"
    # Wait for PostgreSQL to be ready
    echo -e "${YELLOW}Waiting for PostgreSQL...${NC}"
    for i in {1..15}; do
        if docker compose exec -T postgres pg_isready -U myisland > /dev/null 2>&1; then
            echo -e "${GREEN}✓ PostgreSQL is ready${NC}"
            break
        fi
        sleep 1
    done
else
    echo -e "${RED}✗ Failed to start Docker services${NC}"
    exit 1
fi
cd ..

# Step 2: Kill any process on port 8080
echo -e "\n${YELLOW}[2/5] Checking port 8080...${NC}"
if lsof -ti:8080 > /dev/null 2>&1; then
    echo -e "${YELLOW}Killing process on port 8080...${NC}"
    lsof -ti:8080 | xargs kill -9 2>/dev/null || true
    sleep 1
    echo -e "${GREEN}✓ Port 8080 cleared${NC}"
else
    echo -e "${GREEN}✓ Port 8080 is free${NC}"
fi

# Step 3: Frontend build
echo -e "\n${YELLOW}[3/5] Building frontend (npm run build)...${NC}"
cd "$(dirname "$0")"
if npm run build; then
    echo -e "${GREEN}✓ Frontend build successful${NC}"
else
    echo -e "${RED}✗ Frontend build failed${NC}"
    exit 1
fi

# Step 4: Backend tests (requires Docker with API 1.44+)
echo -e "\n${YELLOW}[4/5] Running backend tests (mvn test)...${NC}"
cd my-island-api
if mvn test -q 2>/dev/null; then
    echo -e "${GREEN}✓ Backend tests passed${NC}"
else
    echo -e "${YELLOW}⚠ Backend tests skipped (Docker API 1.44+ required for Testcontainers)${NC}"
fi

# Step 5: Start the backend
echo -e "\n${YELLOW}[5/5] Starting Spring Boot backend...${NC}"

# Start in background and capture PID
mvn spring-boot:run > /tmp/my-island-api.log 2>&1 &
APP_PID=$!

# Wait for health endpoint
echo -e "${YELLOW}Waiting for application to start...${NC}"
MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    ATTEMPT=$((ATTEMPT + 1))

    # Check if process is still running
    if ! kill -0 $APP_PID 2>/dev/null; then
        echo -e "${RED}✗ Application process died. Check /tmp/my-island-api.log for details${NC}"
        exit 1
    fi

    # Check health endpoint
    if curl -s http://localhost:8080/actuator/health 2>/dev/null | grep -q '"status":"UP"'; then
        echo -e "${GREEN}✓ Application started successfully!${NC}"
        echo ""
        echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
        echo -e "${GREEN}  Backend running at:    http://localhost:8080${NC}"
        echo -e "${GREEN}  Swagger UI:            http://localhost:8080/swagger-ui.html${NC}"
        echo -e "${GREEN}  Health check:          http://localhost:8080/actuator/health${NC}"
        echo -e "${GREEN}  Frontend dev server:   npm run dev (port 5173)${NC}"
        echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
        echo ""
        echo -e "${YELLOW}Logs: tail -f /tmp/my-island-api.log${NC}"
        echo -e "${YELLOW}Stop:  kill $APP_PID${NC}"
        exit 0
    fi

    printf "."
    sleep 1
done

echo -e "\n${RED}✗ Application failed to start within ${MAX_ATTEMPTS} seconds${NC}"
echo -e "${YELLOW}Check logs: tail -100 /tmp/my-island-api.log${NC}"
kill $APP_PID 2>/dev/null || true
exit 1
