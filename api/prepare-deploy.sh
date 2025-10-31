#!/bin/bash
# Prepare API deployment by copying backend source

echo "Preparing API deployment..."

# Copy backend source to api/backend
echo "Copying backend source..."
rm -rf backend
mkdir -p backend
cp -r ../apps/backend/src backend/
cp -r ../apps/backend/prisma backend/
cp ../apps/backend/package.json backend/
cp ../apps/backend/tsconfig.json backend/

echo "✅ Backend source copied"
echo "Ready to deploy!"
