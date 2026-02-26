-- Add new enum values
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'WORKSHOP';
ALTER TYPE "SourceKind" ADD VALUE IF NOT EXISTS 'WORKSHOP_ENTERED';

-- Create enums for workshop module
DO $$ BEGIN
  CREATE TYPE "EventCreatedByRole" AS ENUM ('OWNER', 'DEALER', 'WORKSHOP');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "AccessRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED', 'EXPIRED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "AccessGrantStatus" AS ENUM ('ACTIVE', 'REVOKED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Workshop profile
CREATE TABLE IF NOT EXISTS "WorkshopProfile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "workshopName" TEXT NOT NULL,
  "phone" TEXT,
  "address" TEXT,
  "logoUrl" TEXT,
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "WorkshopProfile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "WorkshopProfile_userId_key" ON "WorkshopProfile"("userId");

ALTER TABLE "WorkshopProfile"
  ADD CONSTRAINT "WorkshopProfile_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Access request
CREATE TABLE IF NOT EXISTS "VehicleAccessRequest" (
  "id" TEXT NOT NULL,
  "workshopId" TEXT NOT NULL,
  "requestedByUserId" TEXT NOT NULL,
  "plate" TEXT NOT NULL,
  "vin" TEXT,
  "status" "AccessRequestStatus" NOT NULL DEFAULT 'PENDING',
  "tokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "respondedAt" TIMESTAMP(3),
  "respondedByUserId" TEXT,
  CONSTRAINT "VehicleAccessRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "VehicleAccessRequest_tokenHash_key" ON "VehicleAccessRequest"("tokenHash");
CREATE INDEX IF NOT EXISTS "VehicleAccessRequest_workshopId_createdAt_idx" ON "VehicleAccessRequest"("workshopId", "createdAt");
CREATE INDEX IF NOT EXISTS "VehicleAccessRequest_status_expiresAt_idx" ON "VehicleAccessRequest"("status", "expiresAt");

ALTER TABLE "VehicleAccessRequest"
  ADD CONSTRAINT "VehicleAccessRequest_workshopId_fkey"
  FOREIGN KEY ("workshopId") REFERENCES "WorkshopProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "VehicleAccessRequest"
  ADD CONSTRAINT "VehicleAccessRequest_requestedByUserId_fkey"
  FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "VehicleAccessRequest"
  ADD CONSTRAINT "VehicleAccessRequest_respondedByUserId_fkey"
  FOREIGN KEY ("respondedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Request views (owner inbox privacy-safe trigger)
CREATE TABLE IF NOT EXISTS "VehicleAccessRequestView" (
  "id" TEXT NOT NULL,
  "requestId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "VehicleAccessRequestView_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "VehicleAccessRequestView_requestId_userId_key" ON "VehicleAccessRequestView"("requestId", "userId");
CREATE INDEX IF NOT EXISTS "VehicleAccessRequestView_userId_createdAt_idx" ON "VehicleAccessRequestView"("userId", "createdAt");

ALTER TABLE "VehicleAccessRequestView"
  ADD CONSTRAINT "VehicleAccessRequestView_requestId_fkey"
  FOREIGN KEY ("requestId") REFERENCES "VehicleAccessRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "VehicleAccessRequestView"
  ADD CONSTRAINT "VehicleAccessRequestView_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Access grants
CREATE TABLE IF NOT EXISTS "VehicleAccessGrant" (
  "id" TEXT NOT NULL,
  "workshopId" TEXT NOT NULL,
  "vehicleId" TEXT NOT NULL,
  "requestId" TEXT,
  "grantedByUserId" TEXT NOT NULL,
  "status" "AccessGrantStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revokedAt" TIMESTAMP(3),
  CONSTRAINT "VehicleAccessGrant_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "VehicleAccessGrant_workshopId_status_idx" ON "VehicleAccessGrant"("workshopId", "status");
CREATE INDEX IF NOT EXISTS "VehicleAccessGrant_vehicleId_status_idx" ON "VehicleAccessGrant"("vehicleId", "status");

ALTER TABLE "VehicleAccessGrant"
  ADD CONSTRAINT "VehicleAccessGrant_workshopId_fkey"
  FOREIGN KEY ("workshopId") REFERENCES "WorkshopProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "VehicleAccessGrant"
  ADD CONSTRAINT "VehicleAccessGrant_vehicleId_fkey"
  FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "VehicleAccessGrant"
  ADD CONSTRAINT "VehicleAccessGrant_requestId_fkey"
  FOREIGN KEY ("requestId") REFERENCES "VehicleAccessRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "VehicleAccessGrant"
  ADD CONSTRAINT "VehicleAccessGrant_grantedByUserId_fkey"
  FOREIGN KEY ("grantedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Extend Event
ALTER TABLE "Event"
  ADD COLUMN IF NOT EXISTS "createdByRole" "EventCreatedByRole" NOT NULL DEFAULT 'OWNER',
  ADD COLUMN IF NOT EXISTS "workshopId" TEXT,
  ADD COLUMN IF NOT EXISTS "consentGrantId" TEXT;

CREATE INDEX IF NOT EXISTS "Event_workshopId_idx" ON "Event"("workshopId");

ALTER TABLE "Event"
  ADD CONSTRAINT "Event_workshopId_fkey"
  FOREIGN KEY ("workshopId") REFERENCES "WorkshopProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Event"
  ADD CONSTRAINT "Event_consentGrantId_fkey"
  FOREIGN KEY ("consentGrantId") REFERENCES "VehicleAccessGrant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
