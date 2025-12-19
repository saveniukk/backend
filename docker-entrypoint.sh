#!/bin/sh
set -e

echo "Starting application initialization..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable is not set!"
  exit 1
fi

# Extract database connection details from DATABASE_URL for pg_isready
# Format: postgresql://user:password@host:port/database
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_USER=$(echo $DATABASE_URL | sed -n 's/postgresql:\/\/\([^:]*\):.*/\1/p')

# If we can't parse, try to use defaults or skip health check
if [ -z "$DB_HOST" ]; then
  echo "Warning: Could not parse DATABASE_URL, skipping health check"
else
  echo "Waiting for database to be ready..."
  echo "Host: $DB_HOST, Port: ${DB_PORT:-5432}, User: $DB_USER"
  
  # Wait for database (with timeout)
  timeout=30
  counter=0
  until pg_isready -h "$DB_HOST" -U "$DB_USER" -p "${DB_PORT:-5432}" 2>/dev/null; do
    if [ $counter -ge $timeout ]; then
      echo "Warning: Database health check timeout, proceeding anyway..."
      break
    fi
    echo "Database is unavailable - sleeping ($counter/$timeout)"
    sleep 1
    counter=$((counter + 1))
  done
  
  echo "Database connection check completed!"
fi

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

