import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/guard";

export async function GET(req: Request) {
  const session = await requireAuth();
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();

  if (q.length < 2) {
    return NextResponse.json([]);
  }

  const users = await prisma.user.findMany({
    where: {
      id: { not: session.user!.id },
      role: { in: [Role.OWNER, Role.DEALER] },
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { dealerProfile: { dealerName: { contains: q, mode: "insensitive" } } }
      ]
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      dealerProfile: {
        select: {
          dealerName: true
        }
      }
    },
    take: 8,
    orderBy: { createdAt: "desc" }
  });

  const payload = users.map((user) => ({
    id: user.id,
    role: user.role,
    displayName: user.dealerProfile?.dealerName || user.name || user.email,
    email: user.email
  }));

  return NextResponse.json(payload);
}
