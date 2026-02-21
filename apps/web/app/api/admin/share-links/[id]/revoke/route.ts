import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth/guard";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  requireRole(Role.ADMIN, session.user?.role);
  const { id } = await params;

  const link = await prisma.vehicleAccessLink.update({
    where: { id },
    data: { revokedAt: new Date() }
  });

  return NextResponse.json({ ok: true, link });
}
