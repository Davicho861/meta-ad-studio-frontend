#!/bin/sh

# Abort on any error
set -e

# Navigate to the server directory
cd /usr/src/app/server

# Apply Prisma migrations
echo "Applying database migrations..."
pnpm prisma migrate deploy

# Run the database seed script
echo "Seeding the database..."
pnpm prisma:seed

# Navigate back to the app root
cd /usr/src/app

# Start the main application
echo "Starting the application..."
exec node server/dist/index.js
