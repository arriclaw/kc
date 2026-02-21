import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth/guard";

export async function POST(req: Request) {
  const session = await requireAuth();
  requireRole(Role.DEALER, session.user?.role);

  const body = await req.json();

  const profile = await prisma.dealerProfile.upsert({
    where: { userId: session.user!.id },
    update: {
      dealerName: body.dealerName,
      legalName: body.legalName,
      phone: body.phone,
      location: body.location
    },
    create: {
      userId: session.user!.id,
      dealerName: body.dealerName,
      legalName: body.legalName,
      phone: body.phone,
      location: body.location,
      verifiedStatus: "PENDING"
    }
  });

  return NextResponse.json(profile);
}
