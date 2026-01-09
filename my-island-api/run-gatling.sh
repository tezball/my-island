#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
SIMULATION="smoke"
BASE_URL="http://localhost:8080"

# Print usage
usage() {
    echo -e "${BLUE}Usage: $0 [OPTIONS]${NC}"
    echo ""
    echo "Options:"
    echo "  -s, --simulation TYPE   Simulation type: smoke, load, stress (default: smoke)"
    echo "  -u, --url URL           Base URL (default: http://localhost:8080)"
    echo "  -h, --help              Show this help message"
    echo ""
    echo "Simulation Types:"
    echo "  ${GREEN}smoke${NC}   - Quick validation (2-6 users, ~30 seconds)"
    echo "  ${YELLOW}load${NC}    - Full load test (50+ concurrent users, ~3 minutes)"
    echo "  ${RED}stress${NC}  - Stress test to find breaking point (~5 minutes)"
    echo ""
    echo "Examples:"
    echo "  $0                         # Run smoke test against localhost:8080"
    echo "  $0 -s load                 # Run full load test"
    echo "  $0 -s stress -u http://staging.example.com"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -s|--simulation)
            SIMULATION="$2"
            shift 2
            ;;
        -u|--url)
            BASE_URL="$2"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            usage
            exit 1
            ;;
    esac
done

# Map simulation type to class name
case $SIMULATION in
    smoke)
        SIMULATION_CLASS="gatling.SmokeTestSimulation"
        echo -e "${GREEN}Running Smoke Test${NC}"
        echo "Quick validation with minimal users"
        ;;
    load)
        SIMULATION_CLASS="gatling.MyIslandLoadSimulation"
        echo -e "${YELLOW}Running Load Test${NC}"
        echo "Full load test with realistic user patterns"
        ;;
    stress)
        SIMULATION_CLASS="gatling.StressTestSimulation"
        echo -e "${RED}Running Stress Test${NC}"
        echo "Finding the breaking point of the application"
        ;;
    *)
        echo -e "${RED}Unknown simulation type: $SIMULATION${NC}"
        usage
        exit 1
        ;;
esac

echo ""
echo -e "Target URL: ${BLUE}$BASE_URL${NC}"
echo -e "Simulation: ${BLUE}$SIMULATION_CLASS${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "pom.xml" ]; then
    echo -e "${RED}Error: pom.xml not found. Please run from my-island-api directory${NC}"
    exit 1
fi

# Check if the application is running
echo -e "${YELLOW}Checking if application is running...${NC}"
if ! curl -s --connect-timeout 5 "$BASE_URL/api/health" > /dev/null 2>&1 && \
   ! curl -s --connect-timeout 5 "$BASE_URL/api/campsites" > /dev/null 2>&1; then
    echo -e "${RED}Warning: Application does not appear to be running at $BASE_URL${NC}"
    echo -e "Make sure the application is started with ${GREEN}./start.sh${NC} from the project root"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✓ Application is reachable${NC}"
fi

echo ""
echo -e "${BLUE}Starting Gatling simulation...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Run Gatling
mvn gatling:test \
    -Dgatling.simulationClass="$SIMULATION_CLASS" \
    -DbaseUrl="$BASE_URL"

# Check result
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✓ Gatling simulation completed successfully!${NC}"
    echo ""
    echo -e "Reports are available at:"
    echo -e "${BLUE}target/gatling/*/index.html${NC}"
    echo ""
    # Try to find and display the latest report path
    LATEST_REPORT=$(ls -td target/gatling/*/ 2>/dev/null | head -1)
    if [ -n "$LATEST_REPORT" ]; then
        echo -e "Latest report: ${GREEN}${LATEST_REPORT}index.html${NC}"
    fi
else
    echo ""
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}✗ Gatling simulation failed${NC}"
    exit 1
fi
