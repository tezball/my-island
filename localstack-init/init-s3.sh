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

# Upload seed images for Nore Valley Park (Owner ID 1)
SEED_DIR="/etc/localstack/init/ready.d/seed-images"
if [ -d "$SEED_DIR" ]; then
    echo "Uploading seed images..."
    awslocal s3 cp "$SEED_DIR/nore-valley-hero.jpg"  s3://myisland-images/owners/seed-nore-valley-hero.jpg  --content-type image/jpeg
    awslocal s3 cp "$SEED_DIR/nore-valley-woods.jpg" s3://myisland-images/owners/seed-nore-valley-woods.jpg --content-type image/jpeg
    awslocal s3 cp "$SEED_DIR/nore-valley-farm.jpg"  s3://myisland-images/owners/seed-nore-valley-farm.jpg  --content-type image/jpeg
    awslocal s3 cp "$SEED_DIR/nore-valley-river.jpg" s3://myisland-images/owners/seed-nore-valley-river.jpg --content-type image/jpeg
    echo "Seed images uploaded"
else
    echo "No seed images directory found, skipping"
fi
