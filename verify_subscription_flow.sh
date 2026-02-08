#!/bin/bash

BASE_URL="http://localhost:8080/api"
EMAIL="hello@dinglekayak.ie"
PASSWORD="MyIslandStrongPass1!"

echo "1. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\", \"password\":\"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" == "null" ]; then
  echo "Login failed"
  echo $LOGIN_RESPONSE
  exit 1
fi

echo "Login successful."

echo "2. Checking current subscription status..."
SUB_STATUS=$(curl -s -X GET "$BASE_URL/supplier/subscription" \
  -H "Authorization: Bearer $TOKEN")

STATUS=$(echo $SUB_STATUS | jq -r '.status')
echo "Current status: $STATUS"

if [ "$STATUS" != "NONE" ]; then
  echo "Expected status NONE, got $STATUS. Resetting?"
  # Check if we should reset. For now, just continue, but note it.
fi

echo "3. Initiating subscription checkout (Dev Mode)..."
CHECKOUT_RESPONSE=$(curl -s -X POST "$BASE_URL/supplier/subscription/checkout" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Length: 0")

CHECKOUT_URL=$(echo $CHECKOUT_RESPONSE | jq -r '.url')
echo "Checkout URL: $CHECKOUT_URL"

echo "4. Checking subscription status after checkout..."
SUB_STATUS_AFTER=$(curl -s -X GET "$BASE_URL/supplier/subscription" \
  -H "Authorization: Bearer $TOKEN")

STATUS_AFTER=$(echo $SUB_STATUS_AFTER | jq -r '.status')
echo "New status: $STATUS_AFTER"

if [ "$STATUS_AFTER" != "ACTIVE" ]; then
  echo "Subscription failed to activate in dev mode."
  exit 1
fi

echo "5. Creating a new offer..."
# Valid from tomorrow, valid until next year
VALID_FROM=$(date -d "+1 day" +%Y-%m-%d)
VALID_UNTIL=$(date -d "+1 year" +%Y-%m-%d)

OFFER_PAYLOAD=$(cat <<EOF
{
  "title": "Test Offer",
  "description": "This is a test offer created after subscription.",
  "discountType": "PERCENTAGE",
  "discountValue": 15.0,
  "minPurchase": 50.0,
  "termsConditions": "Test terms.",
  "validFrom": "$VALID_FROM",
  "validUntil": "$VALID_UNTIL",
  "maxClaims": 100,
  "isActive": true
}
EOF
)

CREATE_OFFER_RESPONSE=$(curl -s -X POST "$BASE_URL/supplier/offers" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$OFFER_PAYLOAD")

OFFER_ID=$(echo $CREATE_OFFER_RESPONSE | jq -r '.id')

if [ "$OFFER_ID" == "null" ]; then
  echo "Failed to create offer."
  echo $CREATE_OFFER_RESPONSE
  exit 1
fi

echo "Offer created with ID: $OFFER_ID"

echo "6. Verifying offer exists..."
OFFERS_RESPONSE=$(curl -s -X GET "$BASE_URL/supplier/offers" \
  -H "Authorization: Bearer $TOKEN")

COUNT=$(echo $OFFERS_RESPONSE | jq '. | length')
echo "Total offers: $COUNT"

if [ "$COUNT" -ge 1 ]; then
  echo "Verification SUCCESS!"
else
  echo "Verification FAILED: Offer not found in list."
  exit 1
fi
