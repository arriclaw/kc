import { Role } from "@prisma/client";
import { createVehicleSchema } from "@hdv/shared";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth/guard";
import { vehicleImageUrl } from "@/lib/vehicle-images";

export async function GET() {
  const session = await requireAuth();
  requireRole(Role.DEALER, session.user?.role);

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
      events: { orderBy: { occurredAt: "desc" }, take: 5 },
      badges: true
    },
    orderBy: { createdAt: "desc" }
  });

  const payload = await Promise.all(
    vehicles.map(async (vehicle) => ({
      ...vehicle,
      eventsCount: vehicle.events.length,
      verifiedCount: vehicle.events.filter((event) => event.verificationStatus === "VERIFIED").length,
      imageUrl: await vehicleImageUrl({ make: vehicle.make, model: vehicle.model, year: vehicle.year })
    }))
  );

  return NextResponse.json(payload);
}

export async function POST(req: Request) {
  const session = await requireAuth();
  requireRole(Role.DEALER, session.user?.role);

  const body = await req.json();
  const parsed = createVehicleSchema.safeParse({
    ...body,
    year: Number(body.year)
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

  return NextResponse.json(vehicle);
}
