import { Role } from "@prisma/client";
import { createEventSchema } from "@hdv/shared";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth/guard";
import { commitEventToLedger } from "@/lib/ledger/service";
import { syncVehicleBadges } from "@/lib/badge-service";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  requireRole(Role.DEALER, session.user?.role);
  const { id } = await params;

  const vehicle = await prisma.vehicle.findFirst({
    where: {
      id,
      ownerships: {
        some: {
          userId: session.user!.id,
          ownershipStatus: "CURRENT"
        }
      }
    }
  });

  if (!vehicle) {
    return NextResponse.json({ error: "Vehículo fuera de tu cartera" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createEventSchema.safeParse({
    ...body,
    sourceKind: "DEALER_ENTERED"
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      vehicleId: id,
      type: parsed.data.type,
      occurredAt: new Date(parsed.data.occurredAt),
      odometerKm: parsed.data.odometerKm,
      title: parsed.data.title,
      description: parsed.data.description,
      location: parsed.data.location,
      cost: parsed.data.cost,
      sourceKind: "DEALER_ENTERED",
      createdByRole: "DEALER",
      verificationStatus: parsed.data.verificationStatus,
      createdByUserId: session.user!.id,
      correctionOfEventId: parsed.data.correctionOfEventId ?? null
    }
  });

  await commitEventToLedger(event.id);
  await syncVehicleBadges(id);

  return NextResponse.json({ ok: true, eventId: event.id });
}
