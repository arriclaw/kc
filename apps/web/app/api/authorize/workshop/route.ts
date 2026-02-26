import { AccessRequestStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { findAccessibleVehicleForRequest, isOwnerOrDealer, resolveRequestByToken } from "@/lib/workshop-access";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token requerido" }, { status: 400 });
  }

  const request = await resolveRequestByToken(token);
  if (!request) {
    return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
  }

  if (request.status === AccessRequestStatus.EXPIRED || request.expiresAt.getTime() <= Date.now()) {
    return NextResponse.json({ error: "Solicitud expirada" }, { status: 410 });
  }

  const session = await auth();
  const userId = session?.user?.id;
  const role = session?.user?.role;

  let matchedVehicle = null;

  if (userId && isOwnerOrDealer({ role })) {
    await prisma.vehicleAccessRequestView.upsert({
      where: {
        requestId_userId: {
          requestId: request.id,
          userId
        }
      },
      create: {
        requestId: request.id,
        userId
      },
      update: {}
    });

    matchedVehicle = await findAccessibleVehicleForRequest({
      request: { plate: request.plate, vin: request.vin },
      userId
    });
  }

  return NextResponse.json({
    request: {
      id: request.id,
      plate: request.plate,
      vin: request.vin,
      status: request.status,
      expiresAt: request.expiresAt,
      workshop: {
        id: request.workshop.id,
        workshopName: request.workshop.workshopName,
        phone: request.workshop.phone,
        address: request.workshop.address,
        isVerified: request.workshop.isVerified
      }
    },
    canRespond: Boolean(userId && isOwnerOrDealer({ role })),
    matchedVehicle
  });
}
