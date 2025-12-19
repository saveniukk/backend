#!/bin/sh
set -e

echo "Starting application initialization..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable is not set!"
  exit 1
fi

echo "DATABASE_URL is set, proceeding with migrations..."

echo "Running database migrations..."
npx prisma migrate deploy || {
  echo "Warning: Migrations failed, but continuing..."
}

echo "Generating Prisma Client..."
npx prisma generate || {
  echo "Error: Failed to generate Prisma Client"
  exit 1
}

echo "Starting application..."
exec node dist/src/main

