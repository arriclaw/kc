import { AccessGrantStatus, Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";

export async function POST(_: Request, { params }: { params: Promise<{ id: string; grantId: string }> }) {
  const session = await requireAuth();
  if (session.user?.role !== Role.OWNER && session.user?.role !== Role.DEALER && session.user?.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const { id, grantId } = await params;

  const ownsVehicle = await prisma.vehicleOwnership.findFirst({
    where: {
      vehicleId: id,
      userId: session.user!.id,
      ownershipStatus: "CURRENT"
    }
  });

  if (!ownsVehicle && session.user?.role !== Role.ADMIN) {
    return NextResponse.json({ error: "No podés revocar accesos de este vehículo." }, { status: 403 });
  }

  const grant = await prisma.vehicleAccessGrant.findFirst({
    where: {
      id: grantId,
      vehicleId: id
    }
  });

  if (!grant) {
    return NextResponse.json({ error: "Acceso no encontrado" }, { status: 404 });
  }

  if (grant.status === AccessGrantStatus.REVOKED) {
    return NextResponse.json({ ok: true, alreadyRevoked: true });
  }

  await prisma.vehicleAccessGrant.update({
    where: { id: grant.id },
    data: {
      status: AccessGrantStatus.REVOKED,
      revokedAt: new Date()
    }
  });

  return NextResponse.json({ ok: true });
}
