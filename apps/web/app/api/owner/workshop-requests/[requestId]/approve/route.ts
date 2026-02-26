import { AccessRequestStatus, AccessGrantStatus, Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ requestId: string }> };

export async function POST(_: Request, { params }: Params) {
  const session = await requireAuth();
  const userId = session.user!.id;
  if (session.user?.role !== Role.OWNER && session.user?.role !== Role.DEALER && session.user?.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const { requestId } = await params;
  const request = await prisma.vehicleAccessRequest.findFirst({
    where: {
      id: requestId,
      views: {
        some: { userId }
      }
    }
  });

  if (!request) {
    return NextResponse.json({ error: "Solicitud no encontrada." }, { status: 404 });
  }
  if (request.status !== AccessRequestStatus.PENDING) {
    return NextResponse.json({ error: "La solicitud ya fue resuelta." }, { status: 409 });
  }
  if (request.expiresAt.getTime() <= Date.now()) {
    await prisma.vehicleAccessRequest.update({
      where: { id: request.id },
      data: {
        status: AccessRequestStatus.EXPIRED,
        respondedAt: new Date(),
        respondedByUserId: session.user.id
      }
    });
    return NextResponse.json({ error: "Solicitud expirada." }, { status: 410 });
  }

  const currentOwnership = await prisma.vehicleOwnership.findFirst({
      where: {
      userId,
      ownershipStatus: "CURRENT",
      vehicle: {
        plate: {
          equals: request.plate,
          mode: "insensitive"
        }
      }
    },
    select: { vehicleId: true }
  });

  if (!currentOwnership) {
    return NextResponse.json({ error: "No tenés este vehículo bajo titularidad actual." }, { status: 403 });
  }

  const result = await prisma.$transaction(async (tx) => {
    const existingGrant = await tx.vehicleAccessGrant.findFirst({
      where: {
        workshopId: request.workshopId,
        vehicleId: currentOwnership.vehicleId,
        status: AccessGrantStatus.ACTIVE
      }
    });

    const grant =
      existingGrant ||
      (await tx.vehicleAccessGrant.create({
        data: {
          workshopId: request.workshopId,
          vehicleId: currentOwnership.vehicleId,
          requestId: request.id,
          grantedByUserId: userId,
          status: AccessGrantStatus.ACTIVE
        }
      }));

    await tx.vehicleAccessRequest.update({
      where: { id: request.id },
      data: {
        status: AccessRequestStatus.APPROVED,
        respondedAt: new Date(),
        respondedByUserId: userId
      }
    });

    return grant;
  });

  return NextResponse.json({ ok: true, grantId: result.id });
}
