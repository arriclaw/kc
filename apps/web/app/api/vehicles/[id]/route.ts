import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/guard";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  const { id } = await params;

  const vehicle = await prisma.vehicle.findFirst({
    where: {
      id,
      ownerships: {
        some: {
          userId: session.user!.id
        }
      }
    },
    include: {
      ownerships: { include: { user: true } },
      badges: true,
      shareLinks: { where: { revokedAt: null }, orderBy: { createdAt: "desc" } }
    }
  });

  if (!vehicle) {
    return NextResponse.json({ error: "Vehículo no encontrado" }, { status: 404 });
  }

  return NextResponse.json(vehicle);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  const { id } = await params;

  const owner = await prisma.vehicleOwnership.findFirst({
    where: {
      vehicleId: id,
      userId: session.user!.id,
      ownershipStatus: "CURRENT"
    },
    select: { id: true }
  });

  if (!owner) {
    return NextResponse.json({ error: "Sin permiso para borrar este vehículo." }, { status: 403 });
  }

  await prisma.vehicle.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
