import {
  EventType,
  OwnershipStatus,
  PrismaClient,
  Role,
  SourceKind,
  VerificationStatus
} from "@prisma/client";
import { commitEventToLedger } from "../lib/ledger/service";
import { syncVehicleBadges } from "../lib/badge-service";
import { secureToken } from "../lib/utils";

const prisma = new PrismaClient();

type SeedVehicle = {
  plate: string;
  make: string;
  model: string;
  year: number;
  ownerEmail: string;
  ownerName: string;
  ownerRole: Role;
  contactEmail: string;
  phone: string;
  whatsapp: string;
  events: Array<{
    type: EventType;
    occurredAt: string;
    title: string;
    description: string;
    odometerKm?: number;
    sourceKind: SourceKind;
    verificationStatus: VerificationStatus;
    createdByEmail: string;
  }>;
};

const catalog: SeedVehicle[] = [
  {
    plate: "SBT2885",
    make: "Renault",
    model: "Megane",
    year: 2014,
    ownerEmail: "juan.particular@kc.uy",
    ownerName: "Juan Pérez",
    ownerRole: Role.OWNER,
    contactEmail: "juan.particular@kc.uy",
    phone: "+59894400001",
    whatsapp: "+59894400001",
    events: [
      {
        type: EventType.ODOMETER,
        occurredAt: "2024-01-20",
        title: "Lectura odómetro",
        description: "Registro inicial de kilometraje.",
        odometerKm: 132400,
        sourceKind: SourceKind.SELF_DECLARED,
        verificationStatus: VerificationStatus.UNVERIFIED,
        createdByEmail: "juan.particular@kc.uy"
      },
      {
        type: EventType.SERVICE,
        occurredAt: "2024-06-18",
        title: "Service general",
        description: "Cambio de aceite, filtro de aire y revisión de frenos.",
        odometerKm: 137100,
        sourceKind: SourceKind.DEALER_ENTERED,
        verificationStatus: VerificationStatus.VERIFIED,
        createdByEmail: "taller.rios@kc.uy"
      },
      {
        type: EventType.REPAIR,
        occurredAt: "2025-02-11",
        title: "Cambio de batería",
        description: "Se sustituyó batería por desgaste natural.",
        odometerKm: 143050,
        sourceKind: SourceKind.SELF_DECLARED,
        verificationStatus: VerificationStatus.UNVERIFIED,
        createdByEmail: "juan.particular@kc.uy"
      }
    ]
  },
  {
    plate: "SAB1234",
    make: "Toyota",
    model: "Corolla",
    year: 2018,
    ownerEmail: "automotora18@kc.uy",
    ownerName: "Automotora 18",
    ownerRole: Role.DEALER,
    contactEmail: "ventas@automotora18.uy",
    phone: "+59826001234",
    whatsapp: "+59899111222",
    events: [
      {
        type: EventType.SERVICE,
        occurredAt: "2024-03-05",
        title: "Service 60.000 km",
        description: "Mantenimiento completo con scanner y control de suspensión.",
        odometerKm: 60210,
        sourceKind: SourceKind.DEALER_ENTERED,
        verificationStatus: VerificationStatus.VERIFIED,
        createdByEmail: "automotora18@kc.uy"
      },
      {
        type: EventType.INSPECTION,
        occurredAt: "2024-10-09",
        title: "Inspección pre-venta",
        description: "Chequeo de 32 puntos mecánicos y eléctricos.",
        odometerKm: 64500,
        sourceKind: SourceKind.THIRD_PARTY,
        verificationStatus: VerificationStatus.VERIFIED,
        createdByEmail: "taller.rios@kc.uy"
      },
      {
        type: EventType.ODOMETER,
        occurredAt: "2025-01-28",
        title: "Lectura odómetro",
        description: "Actualización de kilometraje para publicación.",
        odometerKm: 66120,
        sourceKind: SourceKind.DEALER_ENTERED,
        verificationStatus: VerificationStatus.UNVERIFIED,
        createdByEmail: "automotora18@kc.uy"
      }
    ]
  },
  {
    plate: "SCD5678",
    make: "Volkswagen",
    model: "Gol",
    year: 2015,
    ownerEmail: "automotora18@kc.uy",
    ownerName: "Automotora 18",
    ownerRole: Role.DEALER,
    contactEmail: "ventas@automotora18.uy",
    phone: "+59826001234",
    whatsapp: "+59899111222",
    events: [
      {
        type: EventType.SERVICE,
        occurredAt: "2024-05-15",
        title: "Service anual",
        description: "Cambio de fluidos y alineación.",
        odometerKm: 98700,
        sourceKind: SourceKind.DEALER_ENTERED,
        verificationStatus: VerificationStatus.VERIFIED,
        createdByEmail: "automotora18@kc.uy"
      },
      {
        type: EventType.REPAIR,
        occurredAt: "2024-11-02",
        title: "Cambio de pastillas de freno",
        description: "Reemplazo delantero y trasero.",
        odometerKm: 101220,
        sourceKind: SourceKind.DEALER_ENTERED,
        verificationStatus: VerificationStatus.UNVERIFIED,
        createdByEmail: "automotora18@kc.uy"
      }
    ]
  },
  {
    plate: "SBE9012",
    make: "Chevrolet",
    model: "Onix",
    year: 2020,
    ownerEmail: "lucia.particular@kc.uy",
    ownerName: "Lucía Gómez",
    ownerRole: Role.OWNER,
    contactEmail: "lucia.particular@kc.uy",
    phone: "+59894770022",
    whatsapp: "+59894770022",
    events: [
      {
        type: EventType.SERVICE,
        occurredAt: "2024-04-13",
        title: "Service oficial",
        description: "Mantenimiento programado en concesionario.",
        odometerKm: 42000,
        sourceKind: SourceKind.THIRD_PARTY,
        verificationStatus: VerificationStatus.VERIFIED,
        createdByEmail: "taller.rios@kc.uy"
      },
      {
        type: EventType.ODOMETER,
        occurredAt: "2025-01-10",
        title: "Lectura odómetro",
        description: "Actualización para historial público.",
        odometerKm: 48750,
        sourceKind: SourceKind.SELF_DECLARED,
        verificationStatus: VerificationStatus.UNVERIFIED,
        createdByEmail: "lucia.particular@kc.uy"
      }
    ]
  },
  {
    plate: "SFA4455",
    make: "Ford",
    model: "Focus",
    year: 2017,
    ownerEmail: "automotora.centro@kc.uy",
    ownerName: "Automotora Centro",
    ownerRole: Role.DEALER,
    contactEmail: "ventas@automotoracentro.uy",
    phone: "+59829090011",
    whatsapp: "+59899070011",
    events: [
      {
        type: EventType.SERVICE,
        occurredAt: "2024-02-01",
        title: "Service 80.000 km",
        description: "Mantenimiento preventivo general.",
        odometerKm: 80200,
        sourceKind: SourceKind.DEALER_ENTERED,
        verificationStatus: VerificationStatus.VERIFIED,
        createdByEmail: "automotora.centro@kc.uy"
      },
      {
        type: EventType.INSPECTION,
        occurredAt: "2024-12-14",
        title: "Inspección de seguridad",
        description: "Se revisó tren delantero y sistema de frenado.",
        odometerKm: 86210,
        sourceKind: SourceKind.THIRD_PARTY,
        verificationStatus: VerificationStatus.VERIFIED,
        createdByEmail: "taller.rios@kc.uy"
      }
    ]
  },
  {
    plate: "SGB2299",
    make: "Nissan",
    model: "Sentra",
    year: 2019,
    ownerEmail: "carla.particular@kc.uy",
    ownerName: "Carla Rodríguez",
    ownerRole: Role.OWNER,
    contactEmail: "carla.particular@kc.uy",
    phone: "+59899880111",
    whatsapp: "+59899880111",
    events: [
      {
        type: EventType.ODOMETER,
        occurredAt: "2024-07-08",
        title: "Lectura odómetro",
        description: "Actualización semestral de kilometraje.",
        odometerKm: 55300,
        sourceKind: SourceKind.SELF_DECLARED,
        verificationStatus: VerificationStatus.UNVERIFIED,
        createdByEmail: "carla.particular@kc.uy"
      },
      {
        type: EventType.SERVICE,
        occurredAt: "2024-12-02",
        title: "Service de fin de año",
        description: "Service + diagnóstico computarizado.",
        odometerKm: 57990,
        sourceKind: SourceKind.THIRD_PARTY,
        verificationStatus: VerificationStatus.VERIFIED,
        createdByEmail: "taller.rios@kc.uy"
      }
    ]
  }
];

async function upsertUser(data: {
  email: string;
  name: string;
  role: Role;
  contactEmail: string;
  phone: string;
  whatsapp: string;
}) {
  return prisma.user.upsert({
    where: { email: data.email },
    update: {
      name: data.name,
      role: data.role,
      contactEmail: data.contactEmail,
      phone: data.phone,
      whatsapp: data.whatsapp
    },
    create: {
      email: data.email,
      name: data.name,
      role: data.role,
      contactEmail: data.contactEmail,
      phone: data.phone,
      whatsapp: data.whatsapp
    }
  });
}

async function ensureVehicle(seed: SeedVehicle, ownerId: string) {
  const existing = await prisma.vehicle.findFirst({
    where: {
      plate: seed.plate,
      make: seed.make,
      model: seed.model,
      year: seed.year
    }
  });

  const vehicle =
    existing ||
    (await prisma.vehicle.create({
      data: {
        plate: seed.plate,
        country: "UY",
        make: seed.make,
        model: seed.model,
        year: seed.year
      }
    }));

  const currentOwnership = await prisma.vehicleOwnership.findFirst({
    where: { vehicleId: vehicle.id, ownershipStatus: OwnershipStatus.CURRENT },
    orderBy: { startedAt: "desc" }
  });

  if (!currentOwnership) {
    await prisma.vehicleOwnership.create({
      data: {
        vehicleId: vehicle.id,
        userId: ownerId,
        ownershipStatus: OwnershipStatus.CURRENT,
        startedAt: new Date("2024-01-01T00:00:00.000Z")
      }
    });
  } else if (currentOwnership.userId !== ownerId) {
    await prisma.vehicleOwnership.update({
      where: { id: currentOwnership.id },
      data: {
        ownershipStatus: OwnershipStatus.PAST,
        endedAt: new Date()
      }
    });

    await prisma.vehicleOwnership.create({
      data: {
        vehicleId: vehicle.id,
        userId: ownerId,
        ownershipStatus: OwnershipStatus.CURRENT,
        startedAt: new Date()
      }
    });
  }

  return vehicle;
}

async function ensureEvent(vehicleId: string, event: SeedVehicle["events"][number], createdByUserId: string) {
  const occurredAt = new Date(`${event.occurredAt}T12:00:00.000Z`);

  const existing = await prisma.event.findFirst({
    where: {
      vehicleId,
      type: event.type,
      title: event.title,
      occurredAt
    }
  });

  if (existing) {
    return existing;
  }

  const created = await prisma.event.create({
    data: {
      vehicleId,
      type: event.type,
      occurredAt,
      odometerKm: event.odometerKm,
      title: event.title,
      description: event.description,
      createdByUserId,
      sourceKind: event.sourceKind,
      verificationStatus: event.verificationStatus
    }
  });

  if (process.env.LEDGER_PRIVATE_KEY_PEM) {
    await commitEventToLedger(created.id);
  } else {
    console.warn(
      `Seed: evento ${created.id} creado sin commit de ledger (LEDGER_PRIVATE_KEY_PEM no disponible en este entorno).`
    );
  }
  return created;
}

async function ensureShareLink(vehicleId: string) {
  const existing = await prisma.vehicleAccessLink.findFirst({
    where: { vehicleId, revokedAt: null },
    orderBy: { createdAt: "desc" }
  });

  if (existing) return existing;

  return prisma.vehicleAccessLink.create({
    data: {
      vehicleId,
      token: secureToken(32),
      visibility: "FULL_HISTORY"
    }
  });
}

async function main() {
  const admin = await upsertUser({
    email: "admin@kc.uy",
    name: "Admin KC",
    role: Role.ADMIN,
    contactEmail: "admin@kc.uy",
    phone: "+59829000000",
    whatsapp: "+59899000000"
  });

  const workshop = await upsertUser({
    email: "taller.rios@kc.uy",
    name: "Taller Ríos",
    role: Role.DEALER,
    contactEmail: "taller.rios@kc.uy",
    phone: "+59829223344",
    whatsapp: "+59899923344"
  });

  await prisma.dealerProfile.upsert({
    where: { userId: workshop.id },
    update: {
      dealerName: "Taller Ríos",
      legalName: "Talleres Ríos SRL",
      location: "Montevideo",
      phone: workshop.phone,
      verifiedStatus: "VERIFIED"
    },
    create: {
      userId: workshop.id,
      dealerName: "Taller Ríos",
      legalName: "Talleres Ríos SRL",
      location: "Montevideo",
      phone: workshop.phone,
      verifiedStatus: "VERIFIED"
    }
  });

  for (const seed of catalog) {
    const owner = await upsertUser({
      email: seed.ownerEmail,
      name: seed.ownerName,
      role: seed.ownerRole,
      contactEmail: seed.contactEmail,
      phone: seed.phone,
      whatsapp: seed.whatsapp
    });

    if (seed.ownerRole === Role.DEALER) {
      await prisma.dealerProfile.upsert({
        where: { userId: owner.id },
        update: {
          dealerName: seed.ownerName,
          legalName: seed.ownerName,
          location: "Montevideo",
          phone: seed.phone,
          verifiedStatus: "VERIFIED"
        },
        create: {
          userId: owner.id,
          dealerName: seed.ownerName,
          legalName: seed.ownerName,
          location: "Montevideo",
          phone: seed.phone,
          verifiedStatus: "VERIFIED"
        }
      });
    }

    const vehicle = await ensureVehicle(seed, owner.id);

    for (const event of seed.events) {
      const createdBy = await prisma.user.findUnique({ where: { email: event.createdByEmail } });
      if (!createdBy) continue;
      await ensureEvent(vehicle.id, event, createdBy.id);
    }

    await syncVehicleBadges(vehicle.id);
    await ensureShareLink(vehicle.id);
  }

  const totalVehicles = await prisma.vehicle.count();
  const totalEvents = await prisma.event.count();
  const totalPublicLinks = await prisma.vehicleAccessLink.count({ where: { revokedAt: null } });

  console.log("Seed producción completado (sin borrado).");
  console.log(`Vehículos totales: ${totalVehicles}`);
  console.log(`Eventos totales: ${totalEvents}`);
  console.log(`Links públicos activos: ${totalPublicLinks}`);
  console.log(`Admin: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
