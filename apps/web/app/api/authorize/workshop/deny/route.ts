import { AccessRequestStatus } from "@prisma/client";
import { z } from "zod";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { isOwnerOrDealer, resolveRequestByToken } from "@/lib/workshop-access";

const denySchema = z.object({
  token: z.string().min(16)
});

export async function POST(req: Request) {
  const session = await requireAuth();
  if (!isOwnerOrDealer({ role: session.user!.role })) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = denySchema.safeParse(body);
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

  await prisma.vehicleAccessRequest.update({
    where: { id: request.id },
    data: {
      status: AccessRequestStatus.DENIED,
      respondedAt: new Date(),
      respondedByUserId: session.user!.id
    }
  });

  return NextResponse.json({ ok: true });
}
