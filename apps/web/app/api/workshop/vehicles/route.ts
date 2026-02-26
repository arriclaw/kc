import { AccessGrantStatus, Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { ensureWorkshopUser } from "@/lib/workshop-access";
import { vehicleImageUrl } from "@/lib/vehicle-images";

export async function GET() {
  const session = await requireAuth();
  requireRole(Role.WORKSHOP, session.user?.role);

  const workshop = await ensureWorkshopUser(session.user!.id);
  if (!workshop?.profile) {
    return NextResponse.json({ error: "Completá el perfil del taller primero." }, { status: 400 });
  }

  const grants = await prisma.vehicleAccessGrant.findMany({
    where: {
      workshopId: workshop.profile.id,
      status: AccessGrantStatus.ACTIVE
    },
    include: {
      vehicle: {
        include: {
          events: {
            orderBy: { occurredAt: "desc" },
            take: 4
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const payload = await Promise.all(
    grants.map(async (grant) => ({
      grantId: grant.id,
      vehicleId: grant.vehicleId,
      make: grant.vehicle.make,
      model: grant.vehicle.model,
      year: grant.vehicle.year,
      plate: grant.vehicle.plate,
      eventsCount: grant.vehicle.events.length,
      imageUrl: await vehicleImageUrl({
        make: grant.vehicle.make,
        model: grant.vehicle.model,
        year: grant.vehicle.year
      })
    }))
  );

  return NextResponse.json({ vehicles: payload });
}
