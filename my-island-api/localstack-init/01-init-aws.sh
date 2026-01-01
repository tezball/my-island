#!/bin/bash

echo "Initializing LocalStack AWS resources..."

# Create S3 bucket for images
awslocal s3 mb s3://my-island-images
awslocal s3api put-bucket-cors --bucket my-island-images --cors-configuration '{
  "CORSRules": [
    {
      "AllowedOrigins": ["http://localhost:5173", "http://localhost:3000"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}'

# Verify SES email identity for local testing
awslocal ses verify-email-identity --email-address noreply@myisland.local
awslocal ses verify-email-identity --email-address bookings@myisland.local

echo "LocalStack initialization complete!"
echo "S3 bucket: my-island-images"
echo "SES verified emails: noreply@myisland.local, bookings@myisland.local"
