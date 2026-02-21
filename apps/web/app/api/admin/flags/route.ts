import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole } from "@/lib/auth/guard";

export async function GET() {
  const session = await requireAuth();
  requireRole(Role.ADMIN, session.user?.role);

  const flags = await prisma.flag.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    take: 200
  });

  return NextResponse.json(flags);
}
