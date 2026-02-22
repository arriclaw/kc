import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/guard";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string; eventId: string }> }) {
  const session = await requireAuth();
  const { id, eventId } = await params;

  const owner = await prisma.vehicleOwnership.findFirst({
    where: {
      vehicleId: id,
      userId: session.user!.id,
      ownershipStatus: "CURRENT"
    },
    select: { id: true }
  });

  if (!owner) {
    return NextResponse.json({ error: "Sin permiso para borrar eventos de este vehículo." }, { status: 403 });
  }

  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      vehicleId: id
    },
    select: { id: true }
  });

  if (!event) {
    return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
  }

  await prisma.event.delete({ where: { id: eventId } });

  return NextResponse.json({ ok: true });
}
