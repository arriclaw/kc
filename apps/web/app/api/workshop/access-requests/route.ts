import { Role } from "@prisma/client";
import { z } from "zod";
import { NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { createRequestToken, ensureWorkshopUser, nextRequestExpiry } from "@/lib/workshop-access";

const createRequestSchema = z.object({
  plate: z.string().trim().min(5).max(12),
  reference: z.string().trim().min(2).max(64).optional().or(z.literal(""))
});

export async function GET() {
  const session = await requireAuth();
  requireRole(Role.WORKSHOP, session.user?.role);

  const workshop = await ensureWorkshopUser(session.user!.id);
  if (!workshop?.profile) {
    return NextResponse.json({ error: "Completá el perfil del taller primero." }, { status: 400 });
  }

  const requests = await prisma.vehicleAccessRequest.findMany({
    where: { workshopId: workshop.profile.id },
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return NextResponse.json({ requests });
}

export async function POST(req: Request) {
  const session = await requireAuth();
  requireRole(Role.WORKSHOP, session.user?.role);

  const workshop = await ensureWorkshopUser(session.user!.id);
  if (!workshop?.profile) {
    return NextResponse.json({ error: "Completá el perfil del taller primero." }, { status: 400 });
  }

  const body = await req.json();
  const parsed = createRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const normalizedPlate = parsed.data.plate.toUpperCase();

  const currentOwners = await prisma.vehicleOwnership.findMany({
    where: {
      ownershipStatus: "CURRENT",
      vehicle: {
        plate: {
          equals: normalizedPlate,
          mode: "insensitive"
        }
      },
      user: {
        role: {
          in: [Role.OWNER, Role.DEALER, Role.ADMIN]
        }
      }
    },
    select: {
      userId: true
    },
    distinct: ["userId"]
  });

  if (!currentOwners.length) {
    return NextResponse.json({ error: "No encontramos titulares actuales para esa matrícula." }, { status: 404 });
  }

  const existingPending = await prisma.vehicleAccessRequest.findFirst({
    where: {
      workshopId: workshop.profile.id,
      plate: normalizedPlate,
      status: "PENDING"
    },
    select: { id: true }
  });
  if (existingPending) {
    return NextResponse.json({ error: "Ya existe una solicitud pendiente para esta matrícula." }, { status: 409 });
  }

  const { tokenHash } = createRequestToken();

  const accessRequest = await prisma.vehicleAccessRequest.create({
    data: {
      workshopId: workshop.profile.id,
      requestedByUserId: session.user!.id,
      plate: normalizedPlate,
      vin: parsed.data.reference || null,
      tokenHash,
      expiresAt: nextRequestExpiry(),
      views: {
        createMany: {
          data: currentOwners.map((owner) => ({ userId: owner.userId }))
        }
      }
    }
  });

  return NextResponse.json({
    ok: true,
    request: accessRequest,
    recipients: currentOwners.length
  });
}
