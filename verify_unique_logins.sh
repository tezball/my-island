#!/bin/bash

BASE_URL="http://localhost:8080/api"

verify_login() {
    EMAIL=$1
    PASSWORD=$2
    NAME=$3
    
    echo "Verifying $NAME ($EMAIL)..."
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/auth/login" \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"$EMAIL\", \"password\":\"$PASSWORD\"}")
      
    if [ "$STATUS" == "200" ]; then
        echo "✅ Login SUCCESS for $NAME"
    else
        echo "❌ Login FAILED for $NAME (Status: $STATUS)"
        exit 1
    fi
}

echo "Starting Multi-User Login Verification..."

# Test a few key accounts
verify_login "norevalley@myisland.com" "NoreValley2025!Secured" "Nore Valley Park"
verify_login "hello@dinglekayak.ie" "W@v3R!d3r\$K3rrry#2026" "Dingle Kayak Adventures"
verify_login "family@example.com" "MurphyFamily!Trip2025" "Murphy Family"

echo "All verified logins successful!"
