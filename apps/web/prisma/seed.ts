import { PrismaClient, Role, SourceKind, VerificationStatus, EventType } from "@prisma/client";
import { commitEventToLedger } from "../lib/ledger/service";
import { syncVehicleBadges } from "../lib/badge-service";
import { secureToken } from "../lib/utils";

const prisma = new PrismaClient();

async function main() {
  await prisma.attachment.deleteMany();
  await prisma.ledgerEntry.deleteMany();
  await prisma.ledgerBatch.deleteMany();
  await prisma.event.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.vehicleAccessLink.deleteMany();
  await prisma.vehicleOwnership.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.dealerProfile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      email: "admin@hdv.uy",
      contactEmail: "admin@hdv.uy",
      phone: "+59829000000",
      whatsapp: "+59899000000",
      name: "Admin",
      role: Role.ADMIN
    }
  });
  const dealer = await prisma.user.create({
    data: {
      email: "dealer@hdv.uy",
      contactEmail: "ventas@autosdelsur.uy",
      phone: "+59826001234",
      whatsapp: "+59899111222",
      name: "Dealer",
      role: Role.DEALER
    }
  });
  const owner = await prisma.user.create({
    data: {
      email: "owner@hdv.uy",
      contactEmail: "owner@hdv.uy",
      phone: "+59894123456",
      whatsapp: "+59894123456",
      name: "Owner",
      role: Role.OWNER
    }
  });

  await prisma.dealerProfile.create({
    data: {
      userId: dealer.id,
      dealerName: "Autos del Sur",
      legalName: "Autos del Sur S.A.",
      location: "Montevideo",
      verifiedStatus: "VERIFIED"
    }
  });

  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        plate: "SAB1234",
        vin: "1HGBH41JXMN109186",
        make: "Toyota",
        model: "Corolla",
        year: 2018,
        ownerships: { create: { userId: owner.id, ownershipStatus: "CURRENT", startedAt: new Date("2022-01-01") } }
      }
    }),
    prisma.vehicle.create({
      data: {
        plate: "SCD5678",
        vin: "2C3CDXBG5HH632910",
        make: "Volkswagen",
        model: "Gol",
        year: 2015,
        ownerships: { create: { userId: owner.id, ownershipStatus: "CURRENT", startedAt: new Date("2021-06-10") } }
      }
    }),
    prisma.vehicle.create({
      data: {
        plate: "SBE9012",
        make: "Chevrolet",
        model: "Onix",
        year: 2020,
        ownerships: { create: { userId: owner.id, ownershipStatus: "CURRENT", startedAt: new Date("2023-03-15") } }
      }
    })
  ]);

  const v1 = vehicles[0];

  const events = await Promise.all([
    prisma.event.create({
      data: {
        vehicleId: v1.id,
        type: EventType.ODOMETER,
        occurredAt: new Date("2024-01-15"),
        odometerKm: 45000,
        title: "Lectura de odómetro",
        description: "Registro inicial",
        createdByUserId: owner.id,
        sourceKind: SourceKind.SELF_DECLARED,
        verificationStatus: VerificationStatus.UNVERIFIED
      }
    }),
    prisma.event.create({
      data: {
        vehicleId: v1.id,
        type: EventType.SERVICE,
        occurredAt: new Date("2024-07-20"),
        odometerKm: 52000,
        title: "Service 50k",
        description: "Cambio de aceite y filtros",
        createdByUserId: dealer.id,
        sourceKind: SourceKind.DEALER_ENTERED,
        verificationStatus: VerificationStatus.VERIFIED
      }
    }),
    prisma.event.create({
      data: {
        vehicleId: v1.id,
        type: EventType.REPAIR,
        occurredAt: new Date("2025-03-10"),
        odometerKm: 59000,
        title: "Cambio de pastillas",
        description: "Reparación de frenos delanteros",
        createdByUserId: owner.id,
        sourceKind: SourceKind.SELF_DECLARED,
        verificationStatus: VerificationStatus.UNVERIFIED
      }
    }),
    prisma.event.create({
      data: {
        vehicleId: vehicles[1].id,
        type: EventType.ACCIDENT,
        occurredAt: new Date("2025-08-05"),
        title: "Siniestro menor",
        description: "Choque en paragolpe trasero",
        createdByUserId: owner.id,
        sourceKind: SourceKind.SELF_DECLARED,
        verificationStatus: VerificationStatus.UNVERIFIED
      }
    })
  ]);

  for (const event of events) {
    await commitEventToLedger(event.id);
  }

  for (const vehicle of vehicles) {
    await syncVehicleBadges(vehicle.id);
  }

  const shared = await prisma.vehicleAccessLink.create({
    data: {
      vehicleId: v1.id,
      token: secureToken(32),
      visibility: "FULL_HISTORY"
    }
  });

  console.log("Seed completado");
  console.log("Admin:", admin.email);
  console.log("Dealer:", dealer.email);
  console.log("Owner:", owner.email);
  console.log("Public share:", `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/publico/${shared.token}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
