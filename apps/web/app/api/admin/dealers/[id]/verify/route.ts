import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth/guard";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAuth();
  requireRole(Role.ADMIN, session.user?.role);
  const { id } = await params;
  const body = await req.json();

  const profile = await prisma.dealerProfile.update({
    where: { id },
    data: {
      verifiedStatus: body.verified ? "VERIFIED" : "REJECTED"
    }
  });

  return NextResponse.json(profile);
}
