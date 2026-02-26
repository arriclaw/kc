import { AccessRequestStatus, AccessGrantStatus } from "@prisma/client";
import { z } from "zod";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { isOwnerOrDealer, resolveRequestByToken } from "@/lib/workshop-access";

const approveSchema = z.object({
  token: z.string().min(16),
  vehicleId: z.string().uuid().optional(),
  createVehicle: z
    .object({
      make: z.string().trim().min(2).max(40),
      model: z.string().trim().min(1).max(40),
      year: z.number().int().min(1950).max(2100)
    })
    .optional()
});

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function POST(req: Request) {
  const session = await requireAuth();

  if (!isOwnerOrDealer({ role: session.user!.role })) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = approveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const request = await resolveRequestByToken(parsed.data.token);
  if (!request) {
    return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
  }

  if (request.status !== AccessRequestStatus.PENDING) {
    return NextResponse.json({ error: "La solicitud ya fue resuelta." }, { status: 409 });
  }

  if (request.expiresAt.getTime() <= Date.now()) {
    await prisma.vehicleAccessRequest.update({
      where: { id: request.id },
      data: { status: AccessRequestStatus.EXPIRED, respondedAt: new Date(), respondedByUserId: session.user!.id }
    });
    return NextResponse.json({ error: "Solicitud expirada" }, { status: 410 });
  }

  let result: { grant: { id: string; workshopId: string; vehicleId: string; requestId: string | null; grantedByUserId: string; status: AccessGrantStatus; createdAt: Date; revokedAt: Date | null } };
  try {
    result = await prisma.$transaction(async (tx) => {
      let vehicleId = parsed.data.vehicleId;

      if (vehicleId) {
        const owned = await tx.vehicleOwnership.findFirst({
          where: {
            vehicleId,
            userId: session.user!.id,
            ownershipStatus: "CURRENT"
          }
        });
        if (!owned) {
          throw new HttpError(403, "Solo podés autorizar vehículos bajo tu titularidad actual.");
        }
      } else if (parsed.data.createVehicle) {
        const created = await tx.vehicle.create({
          data: {
            plate: request.plate,
            vin: request.vin,
            make: parsed.data.createVehicle.make,
            model: parsed.data.createVehicle.model,
            year: parsed.data.createVehicle.year,
            ownerships: {
              create: {
                userId: session.user!.id,
                ownershipStatus: "CURRENT",
                startedAt: new Date()
              }
            }
          }
        });
        vehicleId = created.id;
      } else {
        throw new HttpError(400, "Seleccioná un vehículo o creá uno nuevo.");
      }

      const existingActiveGrant = await tx.vehicleAccessGrant.findFirst({
        where: {
          workshopId: request.workshopId,
          vehicleId,
          status: AccessGrantStatus.ACTIVE
        }
      });

      const grant =
        existingActiveGrant ||
        (await tx.vehicleAccessGrant.create({
          data: {
            workshopId: request.workshopId,
            vehicleId,
            requestId: request.id,
            grantedByUserId: session.user!.id,
            status: AccessGrantStatus.ACTIVE
          }
        }));

      await tx.vehicleAccessRequest.update({
        where: { id: request.id },
        data: {
          status: AccessRequestStatus.APPROVED,
          respondedAt: new Date(),
          respondedByUserId: session.user!.id
        }
      });

      return { grant };
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }

  return NextResponse.json({ ok: true, grant: result.grant });
}
