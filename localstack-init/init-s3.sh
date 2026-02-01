#!/bin/bash
# Create S3 bucket for image uploads

echo "Creating S3 bucket: myisland-images"
awslocal s3 mb s3://myisland-images

# Set CORS for browser uploads
awslocal s3api put-bucket-cors --bucket myisland-images --cors-configuration '{
  "CORSRules": [
    {
      "AllowedOrigins": ["http://localhost:5173", "http://localhost:3000"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3600
    }
  ]
}'

echo "S3 bucket created and configured"
