import { createVehicleSchema } from "@hdv/shared";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/guard";

export async function GET() {
  const session = await requireAuth();
  const vehicles = await prisma.vehicle.findMany({
    where: {
      ownerships: {
        some: {
          userId: session.user!.id,
          ownershipStatus: "CURRENT"
        }
      }
    },
    include: {
      badges: true,
      events: {
        orderBy: { occurredAt: "desc" },
        take: 3
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(vehicles);
}

export async function POST(req: Request) {
  const session = await requireAuth();

  if (session.user?.role === "OWNER") {
    const currentOwned = await prisma.vehicleOwnership.count({
      where: {
        userId: session.user.id,
        ownershipStatus: "CURRENT"
      }
    });

    if (currentOwned >= 1) {
      return NextResponse.json(
        { error: "Plan particular gratuito: podés registrar 1 vehículo. Para más unidades, usá perfil Automotora." },
        { status: 403 }
      );
    }
  }

  const payload = await req.json();
  const parsed = createVehicleSchema.safeParse({
    ...payload,
    year: Number(payload.year)
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      vin: null,
      plate: parsed.data.plate,
      country: parsed.data.country,
      make: parsed.data.make,
      model: parsed.data.model,
      year: parsed.data.year,
      ownerships: {
        create: {
          userId: session.user!.id,
          ownershipStatus: "CURRENT",
          startedAt: new Date()
        }
      }
    }
  });

  const duplicates = await prisma.vehicle.count({
    where: {
      OR: [{ plate: vehicle.plate }],
      id: { not: vehicle.id }
    }
  });

  return NextResponse.json({ vehicle, disambiguationWarning: duplicates > 0 });
}
