-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'DEALER', 'ADMIN');

-- CreateEnum
CREATE TYPE "DealerVerifiedStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "OwnershipStatus" AS ENUM ('CURRENT', 'PAST');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('ODOMETER', 'SERVICE', 'REPAIR', 'ACCIDENT', 'INSPECTION', 'OTHER', 'CORRECTION');

-- CreateEnum
CREATE TYPE "SourceKind" AS ENUM ('SELF_DECLARED', 'DEALER_ENTERED', 'THIRD_PARTY');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'VERIFIED');

-- CreateEnum
CREATE TYPE "ShareVisibility" AS ENUM ('PUBLIC_SUMMARY', 'FULL_HISTORY');

-- CreateEnum
CREATE TYPE "BadgeType" AS ENUM ('TRANSPARENT_OWNER', 'MAINTENANCE_STREAK', 'RECENT_SERVICE', 'LOW_RISK');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'OWNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DealerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dealerName" TEXT NOT NULL,
    "legalName" TEXT,
    "phone" TEXT,
    "location" TEXT,
    "verifiedStatus" "DealerVerifiedStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DealerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "vin" TEXT,
    "plate" TEXT,
    "country" TEXT NOT NULL DEFAULT 'UY',
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleOwnership" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ownershipStatus" "OwnershipStatus" NOT NULL DEFAULT 'CURRENT',
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "VehicleOwnership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleAccessLink" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "visibility" "ShareVisibility" NOT NULL DEFAULT 'PUBLIC_SUMMARY',
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleAccessLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "odometerKm" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cost" DECIMAL(10,2),
    "location" TEXT,
    "createdByUserId" TEXT NOT NULL,
    "sourceKind" "SourceKind" NOT NULL DEFAULT 'SELF_DECLARED',
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "needsClarification" BOOLEAN NOT NULL DEFAULT false,
    "correctionOfEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "sha256" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "badgeType" "BadgeType" NOT NULL,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "payloadHash" TEXT NOT NULL,
    "prevHash" TEXT NOT NULL,
    "entryHash" TEXT NOT NULL,
    "merkleRootBatchId" TEXT,
    "signature" TEXT,
    "signedByKeyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerBatch" (
    "id" TEXT NOT NULL,
    "merkleRoot" TEXT NOT NULL,
    "entriesCount" INTEGER NOT NULL,
    "anchoredAt" TIMESTAMP(3),
    "anchorRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flag" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "eventId" TEXT,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Flag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionToken")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DealerProfile_userId_key" ON "DealerProfile"("userId");

-- CreateIndex
CREATE INDEX "Vehicle_plate_idx" ON "Vehicle"("plate");

-- CreateIndex
CREATE INDEX "Vehicle_vin_idx" ON "Vehicle"("vin");

-- CreateIndex
CREATE INDEX "VehicleOwnership_vehicleId_ownershipStatus_idx" ON "VehicleOwnership"("vehicleId", "ownershipStatus");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleAccessLink_token_key" ON "VehicleAccessLink"("token");

-- CreateIndex
CREATE INDEX "Event_vehicleId_occurredAt_idx" ON "Event"("vehicleId", "occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_vehicleId_badgeType_key" ON "Badge"("vehicleId", "badgeType");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerEntry_entityId_key" ON "LedgerEntry"("entityId");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerEntry_entryHash_key" ON "LedgerEntry"("entryHash");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- AddForeignKey
ALTER TABLE "DealerProfile" ADD CONSTRAINT "DealerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleOwnership" ADD CONSTRAINT "VehicleOwnership_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleOwnership" ADD CONSTRAINT "VehicleOwnership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleAccessLink" ADD CONSTRAINT "VehicleAccessLink_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_correctionOfEventId_fkey" FOREIGN KEY ("correctionOfEventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Badge" ADD CONSTRAINT "Badge_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_merkleRootBatchId_fkey" FOREIGN KEY ("merkleRootBatchId") REFERENCES "LedgerBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flag" ADD CONSTRAINT "Flag_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
