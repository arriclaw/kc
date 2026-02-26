import { AccessRequestStatus, Role } from "@prisma/client";
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
    },
    select: {
      id: true,
      status: true
    }
  });

  if (!request) {
    return NextResponse.json({ error: "Solicitud no encontrada." }, { status: 404 });
  }
  if (request.status !== AccessRequestStatus.PENDING) {
    return NextResponse.json({ error: "La solicitud ya fue resuelta." }, { status: 409 });
  }

  await prisma.vehicleAccessRequest.update({
    where: { id: request.id },
    data: {
      status: AccessRequestStatus.DENIED,
      respondedAt: new Date(),
      respondedByUserId: userId
    }
  });

  return NextResponse.json({ ok: true });
}
