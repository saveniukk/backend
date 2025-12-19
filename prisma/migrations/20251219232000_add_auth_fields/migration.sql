-- AlterTable
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email" TEXT,
ADD COLUMN IF NOT EXISTS "password" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

-- Update existing users with default values (if any exist)
-- This is a one-time migration for existing data
UPDATE "users" SET 
  "email" = "username" || '@legacy.local',
  "password" = '$2b$10$defaultpasswordhash' 
WHERE "email" IS NULL OR "password" IS NULL;

-- Make email and password NOT NULL after setting defaults
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL;


