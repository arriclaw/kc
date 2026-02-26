import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireAuth();
  if (session.user?.role !== Role.OWNER && session.user?.role !== Role.DEALER && session.user?.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const ownerships = await prisma.vehicleOwnership.findMany({
    where: {
      userId: session.user.id,
      ownershipStatus: "CURRENT"
    },
    select: {
      vehicleId: true,
      vehicle: {
        select: {
          plate: true
        }
      }
    }
  });

  const plateToVehicleId = new Map<string, string>();
  for (const ownership of ownerships) {
    const plate = ownership.vehicle.plate?.toUpperCase();
    if (plate) plateToVehicleId.set(plate, ownership.vehicleId);
  }

  const requests = await prisma.vehicleAccessRequest.findMany({
    where: {
      views: {
        some: {
          userId: session.user!.id
        }
      }
    },
    include: {
      workshop: {
        select: {
          id: true,
          workshopName: true,
          phone: true,
          address: true,
          isVerified: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({
    requests: requests.map((request) => ({
      ...request,
      matchedVehicleId: plateToVehicleId.get(request.plate.toUpperCase()) || null
    }))
  });
}
