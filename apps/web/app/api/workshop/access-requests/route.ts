import { Role } from "@prisma/client";
import { z } from "zod";
import { NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { buildWorkshopApprovalUrl, createRequestToken, ensureWorkshopUser, nextRequestExpiry } from "@/lib/workshop-access";

const createRequestSchema = z.object({
  plate: z.string().trim().min(5).max(12),
  vin: z.string().trim().min(4).max(64).optional().or(z.literal(""))
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

  const { token, tokenHash } = createRequestToken();

  const accessRequest = await prisma.vehicleAccessRequest.create({
    data: {
      workshopId: workshop.profile.id,
      requestedByUserId: session.user!.id,
      plate: parsed.data.plate.toUpperCase(),
      vin: parsed.data.vin || null,
      tokenHash,
      expiresAt: nextRequestExpiry()
    }
  });

  const approveUrl = buildWorkshopApprovalUrl(token);

  return NextResponse.json({
    ok: true,
    request: accessRequest,
    approveUrl,
    qrData: approveUrl
  });
}
